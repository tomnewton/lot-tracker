import express from 'express';
import {setupENV} from './env';
import {webhooks} from './webhooks';
import {api} from './api';
import {worker} from './worker';
import mustacheExpress from 'mustache-express';
import getRawBody from 'raw-body';
import {OAuth2Client} from 'google-auth-library';
import {GetTokenResponse} from 'google-auth-library/build/src/auth/oauth2client';
import {LoginTicket} from 'google-auth-library/build/src/auth/loginticket';
import {upsertUser, User} from './db';
import session from 'express-session';
import {Datastore} from '@google-cloud/datastore';
import path from 'path';
const lb = require('@google-cloud/logging-bunyan');
import {Logger} from '@google-cloud/logging-bunyan/build/src/middleware/express';
const DatastoreStore = require('@google-cloud/connect-datastore')(session);

const LOGIN_PATH = '/login';

setupENV();
declare global {
  namespace Express {
    interface Request {
      log?: Logger;
    }
  }
}

export async function startApp(): Promise<express.Application> {
  const {logger, mw} = await lb.express.middleware({
    logName: 'lot-tracker',
  });

  const app = express();

  app.use(mw);

  if (process.env.NODE_ENV === 'production') {
    // gae ssl termination point means we
    // can't set cookies on the [subdomain].appspot.com
    app.set('trust proxy', 1);
  }

  app.engine('html', mustacheExpress());
  app.set('view engine', 'html');
  app.set('views', __dirname + '/views');

  //webhooks handled by the webhooks router.
  app.use('/webhooks', webhooks);

  //processing the queue.
  app.use('/process', worker);

  //auth setup.
  app.use(
    session({
      store: new DatastoreStore({
        dataset: new Datastore({
          namespace: 'express-sessions',
          projectId: process.env.GOOGLE_CLOUD_PROJECT, // gae supported
          keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS, // gae supported
        }),
      }),
      secret: process.env.SESSION_SECRET,
      saveUninitialized: true,
      rolling: true,
      resave: true,
      cookie: {
        secure: process.env.NODE_ENV === 'production' ? true : false,
        maxAge: 1000 * 60 * 60, // 1 hour
        domain: process.env.COOKIE_DOMAIN,
      },
    }),
  );

  app.use(function(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    req.log.info(req.path);
    req.log.info(process.env.NODE_ENV);

    // allow access to /login page.
    if (req.path === LOGIN_PATH) {
      if (req.session.user) {
        res.redirect('/');
        res.end();
        return;
      }
      return next();
    }

    if (req.path === '/authcode') {
      return next();
    }

    // not logged in
    if (!req.session.user) {
      res.redirect(LOGIN_PATH);
      res.end();
      return;
    }

    // logged in
    next();
  });

  app.use('/api', api);

  app.get(LOGIN_PATH, (req: express.Request, res: express.Response) => {
    res.render('login.html', {oauth_redirect_url: process.env.OAUTH_REDIRECT});
  });

  app.post('/authcode', async (req: express.Request, res: express.Response) => {
    const body = await getRawBody(req);
    const code = body.toString();
    let user: User;

    try {
      user = await verify(code);
    } catch (e) {
      req.session.user = null;
      req.log.error(e.message);
      res.redirect(LOGIN_PATH);
      res.end();
      return;
    }

    // create a session
    req.session.user = {
      email: user.email,
    };

    req.session.save(function(err: any) {
      res.send('ok').end();
    });
  });

  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('/', (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });

  return app;
}

async function verify(code: string): Promise<User> {
  let client: OAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );

  const response: GetTokenResponse = await client.getToken({
    code: code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.REDIRECT_URI,
  });

  const loginTicket: LoginTicket = await client.verifyIdToken({
    idToken: response.tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = loginTicket.getPayload();
  if (payload.hd !== process.env.NIXIT_DOMAIN) {
    throw new Error(`${payload.hd} is not authorized.`);
  }

  return await upsertUser({
    firstName: payload.given_name,
    lastName: payload.family_name,
    email: payload.email,
    refreshToken: response.tokens.refresh_token,
    accessToken: response.tokens.access_token,
    expiryDate: new Date(response.tokens.expiry_date),
  });
}
