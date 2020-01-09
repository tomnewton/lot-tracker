import {Entity} from '@google-cloud/datastore/build/src/entity';
import Emulator from 'google-datastore-emulator';
import FulfillmentServiceAPI from '../datasource';
import {setupENV} from '../env';

setupENV();

describe('Datasource test suite for Google Cloud Datastore.', () => {
  let emulator: Emulator;
  let api: FulfillmentServiceAPI;

  beforeAll(() => {
    const options = {
      useDocker: false,
      storeOnDisk: false,
      clean: true,
      project: process.env.DATASTORE_PROJECT_ID,
    };

    emulator = new Emulator(options);

    emulator.start();

    api = new FulfillmentServiceAPI();
  });

  afterAll(() => {
    return emulator.stop();
  });

  it('adds a fulfillmentService', async () => {
    const services: Entity[] = await api.getFulfillmentServices();
    expect(services.length).toBe(0);
  });
});
