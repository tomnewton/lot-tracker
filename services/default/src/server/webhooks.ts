import express from 'express';
import getRawBody from 'raw-body';
import crypto from 'crypto';

export const webhooks = express.Router();
webhooks.use(verify);

webhooks.post(
  '/orders/create',
  (req: express.Request, res: express.Response) => {
    console.log(req.body);
  },
);

webhooks.post(
  '/fulfillment/create',
  (req: express.Request, res: express.Response) => {
    console.log(req.body);
  },
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
    return next();
  }
  res.status(401);
  res.end();
}
