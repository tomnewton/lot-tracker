import {Router, Request, Response, NextFunction} from 'express';

const asyncMiddleware = (fn: any) => (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const worker = Router();

worker.post(
  '/process',
  asyncMiddleware(async (req: Request, res: Response) => {
    console.log(req.body);
    res.status(500);
  }),
);
