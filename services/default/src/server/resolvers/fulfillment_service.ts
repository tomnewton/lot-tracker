import {Entity} from '@google-cloud/datastore/build/src/entity';
import {default as GoogleDatasource} from '../datasource';
import {CollectionResolver, EntityResolver} from './interfaces';

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
