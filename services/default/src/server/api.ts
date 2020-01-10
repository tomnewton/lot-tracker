import {ApolloServer} from 'apollo-server-express';
import FulfillmentServiceAPI from './db/datasource';
import {
  createFulfillmentService as resolveCreateFulfillmentService,
  fulfillmentService as resolveFulfillmentService,
  fulfillmentServices as resolveFulfillmentServices,
} from './resolvers/fulfillment_service';
import typeDefs from './schema';

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
