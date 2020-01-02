import {
  GraphQLObjectType,
  GraphQLResolveInfo,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';
import {
  connectionDefinitions,
  globalIdField,
  connectionArgs,
  connectionFromPromisedArray,
} from 'graphql-relay';
import {getURLSafeKey, Location, getInventoryBatches} from '../db';
import {nodeInterface} from './node';
import {InventoryBatchConnection} from './inventory_batch';

export const LocationType = new GraphQLObjectType({
  name: 'Location',
  fields: {
    id: globalIdField(
      'Location',
      (source: Location, context: any, info: GraphQLResolveInfo) => {
        return getURLSafeKey(source);
      },
    ),
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (source: Location, context, args) => {
        return source.name;
      },
    },
    inventoryBatches: {
      type: InventoryBatchConnection,
      args: connectionArgs,
      resolve: (location: Location, args) =>
        connectionFromPromisedArray(getInventoryBatches(location), args),
    },
  },
  interfaces: [nodeInterface],
});

export const {connectionType: LocationConnection} = connectionDefinitions({
  nodeType: LocationType,
});
