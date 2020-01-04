import {ApolloServer, gql} from 'apollo-server-express';
import FulfillmentServiceAPI from './datasource';

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type FulfillmentService {
    id: ID!
    name: String
    locations: [Location]
  }

  type Location {
    id: ID!
    name: String
    inventoryBatches: [InventoryBatch]
  }

  type InventoryBatch {
    id: ID!
    name: String
    lotId: String
    quantity: Int
    active: Boolean
  }

  type Query {
    fulfillmentService(id: ID!): FulfillmentService
    fulfillmentServices: [FulfillmentService]
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    fulfillmentServices: async (
      obj,
      args,
      {dataSources: {api}}: {dataSources: {api: FulfillmentServiceAPI}},
    ) => {
      return await api.getFulfillmentServices();
    },
    fulfillmentService: async (
      obj,
      {id}: {id: string},
      {dataSources: {api}}: {dataSources: {api: FulfillmentServiceAPI}},
    ) => {
      return api.getFulfillmentService(id);
    },
  },
};

export const api = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      api: new FulfillmentServiceAPI(),
    };
  },
});
