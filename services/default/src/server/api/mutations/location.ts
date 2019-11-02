import {mutationWithClientMutationId} from 'graphql-relay';
import {GraphQLNonNull, GraphQLString, GraphQLID} from 'graphql';

/*var shipMutation = mutationWithClientMutationId({
  name: 'IntroduceShip',
  inputFields: {
    shipName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    factionId: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  outputFields: {
    ship: {
      type: shipType,
      resolve: (payload) => data['Ship'][payload.shipId],
    },
    faction: {
      type: factionType,
      resolve: (payload) => data['Faction'][payload.factionId],
    },
  },
  mutateAndGetPayload: ({shipName, factionId}) => {
    var newShip = {
      id: getNewShipId(),
      name: shipName,
    };
    data.Ship[newShip.id] = newShip;
    data.Faction[factionId].ships.push(newShip.id);
    return {
      shipId: newShip.id,
      factionId: factionId,
    };
  },
});

var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    introduceShip: shipMutation,
  }),
});
*/
