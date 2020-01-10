import {ApolloServer} from 'apollo-server-express';
import FulfillmentServiceAPI from './db/datasource';
import {
  createFulfillmentService as resolveCreateFulfillmentService,
  fulfillmentService as resolveFulfillmentService,
  fulfillmentServices as resolveFulfillmentServices,
} from './resolvers/fulfillment_service';
import typeDefs from './schema';

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    fulfillmentServices: resolveFulfillmentServices,
    fulfillmentService: resolveFulfillmentService,
  },
  Mutation: {
    createFulfillmentService: resolveCreateFulfillmentService,
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
