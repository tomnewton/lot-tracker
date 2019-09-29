import express from 'express';
import {config} from 'dotenv';
import {webhooks} from './webhooks';
import {worker} from './worker';
import mustacheExpress from 'mustache-express';
import getRawBody from 'raw-body';
import {OAuth2Client} from 'google-auth-library';
import {GetTokenResponse} from 'google-auth-library/build/src/auth/oauth2client';
import {LoginTicket} from 'google-auth-library/build/src/auth/loginticket';
import {upsertUser, User} from './db';
import session from 'express-session';
import {Datastore} from '@google-cloud/datastore';
const DatastoreStore = require('@google-cloud/connect-datastore')(session);

const LOGIN_PATH = '/login';

config();
export const app = express();

app.use(
  session({
    store: new DatastoreStore({
      dataset: new Datastore({
        namespace: 'express-sessions',
        projectId: process.env.GOOGLE_CLOUD_PROJECT,
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      }),
    }),
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV == 'production' ? true : false,
    },
    resave: false,
  }),
);

app.use(function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  console.log(req.path);
  if (!req.session.user && req.path !== 'LOGIN_PATH') {
    res.redirect('LOGIN_PATH');
    res.end();
    return;
  }

  next();
});

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/client/');

//webhooks handled by the webhooks router.
app.use('/webhooks', webhooks);

//processing the queue.
app.use('/process', worker);

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('hello from lot-tracker.');
});

app.get('LOGIN_PATH', (req: express.Request, res: express.Response) => {
  res.render('login.html', {oauth_redirect_url: process.env.OAUTH_REDIRECT});
});

app.post('/authcode', async (req: express.Request, res: express.Response) => {
  console.log('/authcode');
  const body = await getRawBody(req);
  const code = body.toString();
  const user = await verify(code);
  // create a session
});

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

async function verify(code: string): Promise<User> {
  const response: GetTokenResponse = await client.getToken({
    code: code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: 'http://localhost:8080',
  });

  const loginTicket: LoginTicket = await client.verifyIdToken({
    idToken: response.tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = loginTicket.getPayload();
  if (payload.hd !== 'letsnixit.com') {
    throw new Error('Only letsnixit.com accounts are authorized.');
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
