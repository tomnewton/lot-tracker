import {Entity} from '@google-cloud/datastore/build/src/entity';
import FulfillmentServiceAPI from '../datasource';
import {CollectionResolver, EntityResolver} from './interfaces';

export const fulfillmentServices: CollectionResolver<
  Entity,
  FulfillmentServiceAPI
> = async (parent, args, context, info): Promise<Entity[]> => {
  return context.dataSources.api.getFulfillmentServices(args.cursor);
};

export const fulfillmentService: EntityResolver<
  Entity,
  FulfillmentServiceAPI
> = async (parent, args, context, info): Promise<Entity> => {
  return context.dataSources.api.getFulfillmentService(args.id);
};
