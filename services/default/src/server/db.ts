import {Datastore, Query} from '@google-cloud/datastore';
import {entity, Entity} from '@google-cloud/datastore/build/src/entity';
import {ConnectionArguments, fromGlobalId} from 'graphql-relay';
import {getLocation} from 'graphql';
import {resolve} from 'dns';

// Creates a client
const datastore = new Datastore();

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  refreshToken: string;
  accessToken: string;
  expiryDate: Date;
}

export interface FulfillmentService {
  name: string;
}

export interface Location {
  name: string;
  currentLotId: string;
}

export interface InventoryBatch {
  name: string;
  lotId: string;
  quantity: number;
  active: boolean;
  kitted?: Date;
  fulfillmentStarted?: Date;
  fulfillmentEnded?: Date;
  shopifyVariantId: string;
}

const KIND_FULFILLMENT_SERVICE = 'FulfillmentService';
const KIND_USER = 'User';
const KIND_LOCATION = 'Location';
const KIND_INVENTORY_BATCH = 'InventoryBatch';

// export async function newInventoryBatch(
//   fulfillmentServiceId: string,
//   locationId: string,
//   inventoryBatch: InventoryBatch,
// ): Promise<InventoryBatch> {
//}

export async function newFulfillmentService(
  name: string,
): Promise<FulfillmentService> {
  const kind = KIND_FULFILLMENT_SERVICE;
  const fulfillmentServiceKey = datastore.key([kind, name]);
  const fulfillmentService = {
    key: fulfillmentServiceKey,
    data: {
      name: name,
    },
  };
  await datastore.save(fulfillmentService);
  return await get(fulfillmentServiceKey);
}

export async function newFulfillmentServiceLocation(
  locationName: string,
  fulfillmentServiceId: string,
  currentLotId: string = '',
): Promise<Location> {
  const resolved = fromGlobalId(fulfillmentServiceId);
  const fulfillmentServiceKey = getKeyFromURLSafeKey(resolved.id);

  const locationKey = datastore.key([
    ...fulfillmentServiceKey.path,
    KIND_LOCATION,
    locationName,
  ]);

  const location = {
    key: locationKey,
    data: {
      name: locationName,
      currentLotId: currentLotId,
    },
  };
  await datastore.save(location);
  return await get(locationKey);
}

export async function getFulfillmentServices(
  args: ConnectionArguments,
): Promise<FulfillmentService[]> {
  const query = datastore.createQuery(KIND_FULFILLMENT_SERVICE);

  if (args.first) {
    query.limit(args.first);
  }

  const result = await datastore.runQuery(query);
  return result[0];
}

export function getURLSafeKey(object: Entity): string {
  const urlsafe: entity.URLSafeKey = new entity.URLSafeKey();
  return urlsafe.legacyEncode(
    process.env.GOOGLE_CLOUD_PROJECT,
    object[entity.KEY_SYMBOL],
  );
}

function getKeyFromURLSafeKey(data: string): entity.Key {
  const urlsafe: entity.URLSafeKey = new entity.URLSafeKey();
  const output = urlsafe.legacyDecode(data);
  return output;
}

export function getEntityKey(object: Entity): entity.Key {
  return object[entity.KEY_SYMBOL];
}

export async function getLocations(
  fulfillmentService: Entity,
): Promise<Location[]> {
  const query: Query = datastore
    .createQuery(KIND_LOCATION)
    .hasAncestor(getEntityKey(fulfillmentService));

  const result: any = await datastore.runQuery(query);
  return result[0];
}

export async function getInventoryBatches(
  location: Entity,
): Promise<InventoryBatch[]> {
  const query: Query = datastore
    .createQuery(KIND_INVENTORY_BATCH)
    .hasAncestor(getEntityKey(location));

  const result: any = await datastore.runQuery(query);
  return result[0];
}

export async function upsertUser(user: User): Promise<User> {
  // The kind for the new entity
  const kind = KIND_USER;

  // The name/ID for the new entity
  const name = user.email;

  // The Cloud Datastore key for the new entity
  const taskKey = datastore.key([kind, name]);

  // Prepares the new entity
  const task = {
    key: taskKey,
    data: user,
  };

  // Saves the entity
  await datastore.upsert(task);

  console.log(
    `Saved User: ${task.key.name}: ${task.data.firstName} ${task.data.lastName}`,
  );

  return task.data;
}

export async function getUser(email: string): Promise<User> {
  const user: Entity = await datastore.get(datastore.key([KIND_USER, email]));
  return user[0];
}

export async function get(key: entity.Key): Promise<Entity> {
  const result: Entity = await datastore.get(key);
  return result[0];
}
