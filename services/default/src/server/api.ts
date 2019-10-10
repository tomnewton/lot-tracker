import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
} from 'graphql';
import graphqlHTTP, {GraphQLParams} from 'express-graphql';
import {Router, NextFunction, Response, Request} from 'express';
import {getUser, getFulfillmentServices, getLocations} from './db';

const LocationType = new GraphQLObjectType({
  name: 'Location',
  fields: {
    ID: {
      type: GraphQLInt,
      resolve: (source, context, args) => {
        return source.ID;
      },
    },
    currentLot: {
      type: GraphQLString,
      resolve: (source, context, args) => {
        return source.currentLot;
      },
    },
  },
});

const FulfillmentServiceType = new GraphQLObjectType({
  name: 'FulfillmentService',
  description:
    'A Fullfilment Service is a unique fulfillment service, like SFN.',
  fields: {
    name: {type: GraphQLString},
    locations: {
      name: 'LocationType',
      type: GraphQLList(LocationType),
      resolve: async (source, context, args) => {
        return getLocations(source);
      },
    },
  },
});

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    hello: {
      type: GraphQLString,
      resolve() {
        return 'hello world2';
      },
    },
    fulfillmentServices: {
      name: 'FulfillmentServiceType',
      description: 'Query root for Fulfillment Services.',
      type: GraphQLList(FulfillmentServiceType),
      resolve: async (source, context, args) => {
        return await getFulfillmentServices();
      },
    },
  },
});

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

const user = async (
  req: Request,
  res: Response,
  graphQLParams: GraphQLParams,
) => {
  await getUser('test');
};

interface GetUserRequest {
  email: string;
}

api.use(
  '/graphql',
  asyncMiddleware(
    graphqlHTTP(
      async (
        request: Request,
        response: Response,
        graphQLParams: GraphQLParams,
      ) => ({
        schema: programatticSchema,
        graphiql: true,
      }),
    ),
  ),
);
