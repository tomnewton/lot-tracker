import {GraphQLSchema} from 'graphql';
import graphqlHTTP from 'express-graphql';
import {RootQueryType} from './api/root';
import {Router, NextFunction} from 'express';

var programatticSchema = new GraphQLSchema({
  query: RootQueryType,
});

const asyncMiddleware = (fn: any) => (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const api = Router();

api.use(
  '/graphql',
  graphqlHTTP(async (request, response, graphQLParams) => {
    return {
      schema: programatticSchema,
      graphiql: true,
    };
  }),
);
