import {Entity} from '@google-cloud/datastore/build/src/entity';
import {default as GoogleDatasource} from '../db/datasource';
import {FulfillmentServiceInput} from '../interfaces';
import {BasicResolver, CollectionResolver, EntityResolver} from './interfaces';
export const fulfillmentServices: CollectionResolver<
  Entity,
  GoogleDatasource
> = async (parent, args, context, info): Promise<Entity[]> => {
  return context.dataSources.api.fulfillmentService.list(args.cursor);
};

export const fulfillmentService: EntityResolver<
  Entity,
  GoogleDatasource
> = async (parent, args, context, info): Promise<Entity> => {
  return context.dataSources.api.fulfillmentService.get(args.id);
};

export const createFulfillmentService: BasicResolver<
  Entity,
  GoogleDatasource,
  FulfillmentServiceInput
> = async (parent, args, context, info): Promise<Entity> => {
  await context.dataSources.api.fulfillmentService.create({name: args.name});
};
