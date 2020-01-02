import {mutationWithClientMutationId} from 'graphql-relay';
import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLResolveInfo,
} from 'graphql';
import {LocationType} from '../location';
import {newFulfillmentServiceLocation} from '../../db';

export const locationMutation = mutationWithClientMutationId({
  name: 'AddFulfillmentServiceLocation',
  inputFields: {
    fulfillmentServiceId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    locationName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    currentLotId: {
      type: GraphQLString,
    },
  },
  outputFields: {
    location: {
      type: LocationType,
    },
  },
  mutateAndGetPayload: handle_mutation,
});

async function handle_mutation(
  object: any,
  context: any,
  info: GraphQLResolveInfo,
): Promise<object> {
  const location = await newFulfillmentServiceLocation(
    object.locationName,
    object.fulfillmentServiceId,
    object.currentLotId,
  );
  return {
    location: location,
  };
}
