import {GraphQLObjectType, GraphQLNonNull} from 'graphql';
import {connectionArgs, connectionFromPromisedArray} from 'graphql-relay';
import {getFulfillmentServices} from '../db';
import {
  FulfillmentServiceConnection,
  FulfillmentServiceType,
} from './fulfillment_service';
import {LocationType} from './location';
import {nodeField} from './node';
import {fulfillmentServiceMutation} from './mutations/fulfillment_service';
import {locationMutation} from './mutations/location';
import {inventoryBatchMutation} from './mutations/inventory_batch';

export const RootQueryType = new GraphQLObjectType({
  name: 'QueryRoot',
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

export const RootMutationType = new GraphQLObjectType({
  name: 'MutationRoot',
  fields: {
    addFulfillmentService: fulfillmentServiceMutation,
    addFulfillmentServiceLocation: locationMutation,
    addInventoryBatch: inventoryBatchMutation,
  },
});
