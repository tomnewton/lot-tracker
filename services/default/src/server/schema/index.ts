import {gql} from 'apollo-server-express';

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

export default typeDefs;
