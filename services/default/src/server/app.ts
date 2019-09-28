import express = require('express');
import {config} from 'dotenv';
import {webhooks} from './webhooks';

config();
export const app = express();

//webhooks handled by the webhooks router.
app.use('/webhooks', webhooks);

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('hello from lot-tracker.');
});
