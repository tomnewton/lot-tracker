import {nodeDefinitions, fromGlobalId} from 'graphql-relay';
import {entity, Entity} from '@google-cloud/datastore/build/src/entity';
import {getEntityKey, get} from '../db';
import {FulfillmentServiceType} from './fulfillment_service';
import {LocationType} from './location';
import {GraphQLObjectType, GraphQLResolveInfo} from 'graphql';

export const {nodeInterface, nodeField} = nodeDefinitions(
  id_fetcher,
  type_resolver,
);

async function id_fetcher(
  globalId: string,
  context: any,
  info: GraphQLResolveInfo,
): Promise<Entity> {
  var resolved = fromGlobalId(globalId);
  const key: entity.Key = new entity.URLSafeKey().legacyDecode(resolved.id);
  return await get(key);
}

function type_resolver(obj: Entity): GraphQLObjectType {
  const kind = getEntityKey(obj).kind;
  switch (kind) {
    case FulfillmentServiceType.name:
      return FulfillmentServiceType;
    case LocationType.name:
      return LocationType;
    default:
      return null;
  }
}
