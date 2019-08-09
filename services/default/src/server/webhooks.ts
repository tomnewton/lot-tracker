import express from 'express';
import getRawBody from 'raw-body';
import crypto from 'crypto';
import {createTask, client} from './tasks';

export const webhooks = express.Router();

const asyncMiddleware = (fn: any) => (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

webhooks.use(asyncMiddleware(verify));

webhooks.post(
  '/orders/create',
  asyncMiddleware(async (req: express.Request, res: express.Response) => {
    console.log(req.body);
    await createTask(process.env.DEFAULT_QUEUE, req.body, client);
  }),
);

webhooks.post(
  '/fulfillment/create',
  asyncMiddleware(async (req: express.Request, res: express.Response) => {
    console.log(req.body);
    await createTask(process.env.DEFAULT_QUEUE, req.body, client);
  }),
);

// Verify incoming webhooks.
async function verify(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const hmac = req.get('X-Shopify-Hmac-Sha256');
  const payload = await getRawBody(req);
  const message = payload.toString();
  req.body = message;
  const genHash = crypto
    .createHmac('sha256', process.env.SHOPIFY_APP_WEBHOOK_SECRET)
    .update(message)
    .digest('base64');

  if (genHash === hmac) {
    return await next();
  }
  res.status(401);
  res.end();
}
