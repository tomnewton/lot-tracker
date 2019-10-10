import {Datastore, Query} from '@google-cloud/datastore';
import {entity, Entity} from '@google-cloud/datastore/build/src/entity';

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
  _id: number;
  name: string;
}

export interface Location {
  ID: number;
  currentLot: string;
}

const KIND_FULFILLMENT_SERVICE = 'FulfillmentService';
const KIND_USER = 'User';
const KIND_LOCATION = 'Location';

export async function getFulfillmentServices(): Promise<FulfillmentService[]> {
  const query = datastore.createQuery(KIND_FULFILLMENT_SERVICE);
  query.limit(10);

  const result = await datastore.runQuery(query);
  return result[0];
}

export async function getLocations(
  fulfillmentService: Object,
): Promise<Location[]> {
  var syms = Object.getOwnPropertySymbols(fulfillmentService);
  var mFound = syms.find((e) => e.toString() === 'Symbol(KEY)');
  var id = fulfillmentService[mFound].id;

  const query: Query = datastore
    .createQuery(KIND_LOCATION)
    .hasAncestor(datastore.key([KIND_FULFILLMENT_SERVICE, parseInt(id)]));

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
