import {Datastore} from '@google-cloud/datastore';

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

export async function upsertUser(user: User): Promise<User> {
  // The kind for the new entity
  const kind = 'User';

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
