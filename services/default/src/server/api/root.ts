import {connectionArgs, connectionFromPromisedArray} from 'graphql-relay';
import {FulfillmentServiceConnection} from './fulfillment_service';
import {getFulfillmentServices} from '../db';
import {GraphQLObjectType} from 'graphql';

import {nodeField} from './node';

export const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    node: nodeField, // so we can use eg. query { node(id: ID!) { ... on FulfillmentService {name}}}
    fulfillmentServices: {
      type: FulfillmentServiceConnection,
      args: connectionArgs,
      resolve: (_, args, context) =>
        connectionFromPromisedArray(getFulfillmentServices(args), args),
    },
  },
});
