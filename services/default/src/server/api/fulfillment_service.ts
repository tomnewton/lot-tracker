import {GraphQLObjectType, GraphQLResolveInfo, GraphQLString} from 'graphql';
import {
  connectionArgs,
  connectionDefinitions,
  connectionFromPromisedArray,
  globalIdField,
} from 'graphql-relay';
import {FulfillmentService, getLocations, getURLSafeKey} from './../db';
import {LocationConnection} from './location';
import {nodeInterface} from './node';

export const FulfillmentServiceType = new GraphQLObjectType({
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
  interfaces: () => [nodeInterface],
});

export const {
  connectionType: FulfillmentServiceConnection,
} = connectionDefinitions({
  nodeType: FulfillmentServiceType,
});
