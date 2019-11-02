import {nodeDefinitions, fromGlobalId} from 'graphql-relay';
import {entity, Entity} from '@google-cloud/datastore/build/src/entity';
import {getEntityKey, get} from '../db';
import {FulfillmentServiceType} from './fulfillment_service';
import {LocationType} from './location';

export const {nodeInterface, nodeField} = nodeDefinitions(
  async (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    // Log to NodeJS console the mapping from globalId/Node ID
    // to actual object type and id

    const key: entity.Key = new entity.URLSafeKey().legacyDecode(id);

    // onsole.log('NodeDefinitions (globalId), id:', id);
    // console.log('NodeDefinitions (globalId), type:', type);

    return await get(key);
  },
  (obj: Entity) => {
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
