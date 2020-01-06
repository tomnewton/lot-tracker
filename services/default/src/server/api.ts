import {ApolloServer} from 'apollo-server-express';
import typeDefs from './schema';
import FulfillmentServiceAPI from './datasource';
import {
  fulfillmentServices as resolveFulfillmentServices,
  fulfillmentService as resolveFulfillmentService,
} from './resolvers/fulfillment_service';

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    fulfillmentServices: resolveFulfillmentServices,
    fulfillmentService: resolveFulfillmentService,
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
