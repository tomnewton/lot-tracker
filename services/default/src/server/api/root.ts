import {GraphQLObjectType} from 'graphql';
import {connectionArgs, connectionFromPromisedArray} from 'graphql-relay';
import {getFulfillmentServices} from '../db';
import {
  FulfillmentServiceConnection,
  FulfillmentServiceType,
} from './fulfillment_service';
import {LocationType} from './location';
import {nodeField} from './node';

export const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    fulfillmentService: {
      type: FulfillmentServiceType,
      resolve: nodeField.resolve,
      args: nodeField.args,
    },
    location: {
      type: LocationType,
      resolve: nodeField.resolve,
      args: nodeField.args,
    },
    fulfillmentServices: {
      type: FulfillmentServiceConnection,
      args: connectionArgs,
      resolve: (_, args, context) =>
        connectionFromPromisedArray(getFulfillmentServices(args), args),
    },
  },
});
