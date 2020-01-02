import {
  GraphQLObjectType,
  GraphQLResolveInfo,
  GraphQLString,
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLScalarType,
  GraphQLInt,
} from 'graphql';
import {Kind} from 'graphql/language';
import {connectionDefinitions, globalIdField} from 'graphql-relay';
import {getURLSafeKey, Location, InventoryBatch} from '../db';
import {nodeInterface} from './node';

const DateType = new GraphQLScalarType({
  name: 'Date',
  serialize: (value: Date) => value.getTime(),
  parseValue: (value: any) => new Date(value),
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value);
    }
    return null;
  },
});

export const InventoryBatchType = new GraphQLObjectType({
  name: 'InventoryBatch',
  fields: {
    id: globalIdField(
      'InventoryBatch',
      (source: InventoryBatch, context: any, info: GraphQLResolveInfo) => {
        return getURLSafeKey(source);
      },
    ),
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (source: InventoryBatch, context, args) => {
        return source.name;
      },
    },
    lotId: {
      type: GraphQLString,
      resolve: (source: InventoryBatch, context, args) => {
        return source.lotId;
      },
    },
    quantity: {
      type: GraphQLInt,
      resolve: (source: InventoryBatch, context, args) => {
        return source.quantity;
      },
    },
    active: {
      type: GraphQLBoolean,
      resolve: (source: InventoryBatch, context: any, args: any) => {
        return source.active;
      },
    },
    kitted: {
      type: DateType,
      resolve: (source: InventoryBatch, context: any, args: any) => {
        return source.kitted;
      },
    },
    fulfillmentStarted: {
      type: DateType,
      resolve: (source: InventoryBatch, context: any, args: any) => {
        return source.fulfillmentStarted;
      },
    },
    fulfillmentEnded: {
      type: DateType,
      resolve: (source: InventoryBatch, context: any, args: any) => {
        return source.fulfillmentEnded;
      },
    },
    shopifyVariantId: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (source: InventoryBatch, context: any, args: any) => {
        return source.shopifyVariantId;
      },
    },
  },
  interfaces: [nodeInterface],
});

export const {connectionType: InventoryBatchConnection} = connectionDefinitions(
  {
    nodeType: InventoryBatchType,
  },
);
