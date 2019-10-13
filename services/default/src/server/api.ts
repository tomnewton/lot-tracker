import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
  GraphQLResolveInfo,
} from 'graphql';
import {
  globalIdField,
  fromGlobalId,
  nodeDefinitions,
  connectionDefinitions,
  connectionArgs,
  connectionFromArray,
  connectionFromPromisedArray,
  GraphQLNodeDefinitions,
} from 'graphql-relay';
import graphqlHTTP, {GraphQLParams} from 'express-graphql';
import {Router, NextFunction, Response, Request} from 'express';
import {
  getUser,
  getFulfillmentServices,
  getLocations,
  FulfillmentService,
  Location,
  getURLSafeKey,
  getEntityKey,
  get,
} from './db';
import {entity, Entity} from '@google-cloud/datastore/build/src/entity';

var {nodeInterface, nodeField} = nodeDefinitions(
  async (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    // Log to NodeJS console the mapping from globalId/Node ID
    // to actual object type and id

    const key: entity.Key = new entity.URLSafeKey().legacyDecode(id);

    // onsole.log('NodeDefinitions (globalId), id:', id);
    // console.log('NodeDefinitions (globalId), type:', type);

    return await get(key);
  },
  (obj: Entity) => {
    switch (getEntityKey(obj).kind) {
      case LocationType.name:
        return LocationType;
      case FulfillmentServiceType.name:
        return FulfillmentServiceType;
      default:
        return null;
    }
  },
);

const LocationType = new GraphQLObjectType({
  name: 'Location',
  fields: {
    id: globalIdField(
      'Location',
      (object: Location, context: any, info: GraphQLResolveInfo) => {
        return getURLSafeKey(object);
      },
    ),
    locationId: {
      type: GraphQLInt,
      resolve: (source, context, args) => {
        return source.locationId;
      },
    },
    currentLot: {
      type: GraphQLString,
      resolve: (source, context, args) => {
        return source.currentLot;
      },
    },
  },
  interfaces: [nodeInterface],
});

var {connectionType: LocationConnection} = connectionDefinitions({
  nodeType: LocationType,
});

const FulfillmentServiceType = new GraphQLObjectType({
  name: 'FulfillmentService',
  description:
    'A Fullfilment Service is a unique fulfillment service, like SFN.',
  fields: {
    id: globalIdField(
      'FulfillmentService',
      (object: FulfillmentService, context: any, info: GraphQLResolveInfo) => {
        return getURLSafeKey(object);
      },
    ),
    name: {type: GraphQLString},
    locations: {
      type: LocationConnection,
      args: connectionArgs,
      resolve: (fulfillmentService: FulfillmentService, args) =>
        connectionFromPromisedArray(getLocations(fulfillmentService), args),
    },
  },
  interfaces: [nodeInterface],
});

var {connectionType: FulfillmentServiceConnection} = connectionDefinitions({
  nodeType: FulfillmentServiceType,
});

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    node: nodeField,
    // fulfillmentServices: {
    //   name: 'FulfillmentServiceType',
    //   description: 'Query root for Fulfillment Services.',
    //   type: GraphQLList(FulfillmentServiceType),
    //   resolve: async (source, context, args) => {
    //     return await getFulfillmentServices();
    //   },
    // },
    fulfillmentServices: {
      type: FulfillmentServiceConnection,
      args: connectionArgs,
      resolve: (none: object, args) =>
        connectionFromPromisedArray(getFulfillmentServices(), args),
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
