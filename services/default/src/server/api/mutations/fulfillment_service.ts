import {GraphQLNonNull, GraphQLString, GraphQLResolveInfo} from 'graphql';
import {mutationWithClientMutationId} from 'graphql-relay';
import {FulfillmentServiceType} from '../fulfillment_service';
import {newFulfillmentService, FulfillmentService} from '../../db';

export const fulfillmentServiceMutation = mutationWithClientMutationId({
  name: 'AddFulfillmentService',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    fulfillmentService: {
      type: FulfillmentServiceType,
    },
  },
  mutateAndGetPayload: handle_mutation,
});

async function handle_mutation(
  object: any,
  context: any,
  info: GraphQLResolveInfo,
): Promise<object> {
  const f_service = await newFulfillmentService(object.name);
  return {
    fulfillmentService: f_service,
  };
}
