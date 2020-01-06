import FulfillmentServiceAPI from '../datasource';

export const fulfillmentServices = async (
  _: any,
  __: any,
  {dataSources: {api}}: {dataSources: {api: FulfillmentServiceAPI}},
) => {
  return api.getFulfillmentServices();
};

export const fulfillmentService = async (
  _: any,
  {id}: {id: string},
  {dataSources: {api}}: {dataSources: {api: FulfillmentServiceAPI}},
) => {
  return api.getFulfillmentService(id);
};
