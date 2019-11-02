import {nodeDefinitions, fromGlobalId} from 'graphql-relay';
import {entity, Entity} from '@google-cloud/datastore/build/src/entity';
import {getEntityKey, get} from '../db';
import {FulfillmentServiceType} from './fulfillment_service';
import {LocationType} from './location';
import {GraphQLObjectType} from 'graphql';

export const {nodeInterface, nodeField} = nodeDefinitions(
  async (globalId) => {
    var resolved = fromGlobalId(globalId);
    const key: entity.Key = new entity.URLSafeKey().legacyDecode(resolved.id);
    return await get(key);
  },
  (obj: Entity): GraphQLObjectType => {
    const kind = getEntityKey(obj).kind;
    switch (kind) {
      case FulfillmentServiceType.name:
        return FulfillmentServiceType;
      case LocationType.name:
        return LocationType;
      default:
        return null;
    }
  },
);
