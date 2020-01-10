import {gql} from 'apollo-server-express';

const typeDefs = gql`
  type FulfillmentService {
    id: ID!
    name: String
    locations: Locations
  }

  type FulfillmentServices {
    cursor: string
    items: [FulfillmentService]
  }

  type Location {
    id: ID!
    name: String
    inventoryBatches: InventoryBatches
  }

  type Locations {
    cursor: string
    items: [Location]
  }

  type InventoryBatch {
    id: ID!
    name: String
    lotId: String
    quantity: Int
    active: Boolean
  }

  type InventoryBatches {
    cursor: string
    items: [InventoryBatch]
  }

  type Query {
    fulfillmentService(id: ID!): FulfillmentService
    fulfillmentServices: [FulfillmentService]
  }

  type Mutation {
    createFulfillmentService(name: string): FulfillmentService
    deleteFulfillmentService(id: ID!): FulfillmentService
  }
`;

export default typeDefs;
