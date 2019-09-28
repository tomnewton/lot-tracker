import express from 'express';
import {config} from 'dotenv';
import {webhooks} from './webhooks';
import {worker} from './worker';

config();
export const app = express();

//webhooks handled by the webhooks router.
app.use('/webhooks', webhooks);

//processing the queue.
app.use('/process', worker);

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('hello from lot-tracker.');
});
