import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLResolveInfo,
  GraphQLString,
} from 'graphql';
import {mutationWithClientMutationId} from 'graphql-relay';
import {newInventoryBatch} from '../../db';
import {DateType, InventoryBatchType} from '../inventory_batch';

export const inventoryBatchMutation = mutationWithClientMutationId({
  name: 'AddInventoryBatch',
  inputFields: {
    fulfillmentServiceId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    locationId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    lotId: {
      type: new GraphQLNonNull(GraphQLString),
    },
    quantity: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    shopifyVariantId: {
      type: new GraphQLNonNull(GraphQLString),
    },
    active: {
      type: GraphQLBoolean,
      defaultValue: false,
    },
    kitted: {
      type: DateType,
    },
    fulfillmentStarted: {
      type: DateType,
    },
    fulfillmentEnded: {
      type: DateType,
    },
  },
  outputFields: {
    inventoryBatch: {
      type: InventoryBatchType,
    },
  },
  mutateAndGetPayload: handle_mutation,
});

async function handle_mutation(
  object: any,
  context: any,
  info: GraphQLResolveInfo,
): Promise<object> {
  const inventoryBatch = await newInventoryBatch(object.locationId, object);
  return {
    inventoryBatch: inventoryBatch,
  };
}
