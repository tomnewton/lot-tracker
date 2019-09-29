import express from 'express';
import {config} from 'dotenv';
import {webhooks} from './webhooks';
import {worker} from './worker';
import mustacheExpress from 'mustache-express';
import getRawBody from 'raw-body';
import {OAuth2Client} from 'google-auth-library';
import {GetTokenResponse} from 'google-auth-library/build/src/auth/oauth2client';
import {LoginTicket} from 'google-auth-library/build/src/auth/loginticket';

config();
export const app = express();

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

app.get('/login', (req: express.Request, res: express.Response) => {
  res.render('login.html', {oauth_redirect_url: process.env.OAUTH_REDIRECT});
});

app.post('/authcode', async (req: express.Request, res: express.Response) => {
  console.log('/authcode');
  const body = await getRawBody(req);
  const code = body.toString();
  await verify(code);
  res.send('0k');
});

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

async function verify(code: string): Promise<boolean> {
  try {
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
      return false;
    }
    return true;
  } catch (e) {
    console.error(`auth issue: ${e.message}`);
    return false;
  }
}
