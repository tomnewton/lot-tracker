import getRawBody from 'raw-body';
import crypto from 'crypto';
import {createTask, client} from './tasks';
import {Router, Request, Response, NextFunction} from 'express';

const asyncMiddleware = (fn: any) => (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export let webhooks = Router();
webhooks.use(asyncMiddleware(verify));

webhooks.post(
  '/orders/fulfilled',
  asyncMiddleware(async (req: Request, res: Response) => {
    console.log('order fulfilled');
    await createTask(process.env.DEFAULT_QUEUE, req.body, client);
    res.status(200).end();
  }),
);

// Verify incoming webhooks.
async function verify(req: Request, res: Response, next: NextFunction) {
  const hmac = req.get('X-Shopify-Hmac-Sha256');
  const payload = await getRawBody(req);
  const message = payload.toString();
  req.body = message;
  const genHash = crypto
    .createHmac('sha256', process.env.SHOPIFY_SECRET)
    .update(message)
    .digest('base64');

  if (genHash != hmac) {
    res.status(401);
    res.end();
    return;
  }
  next();
}
