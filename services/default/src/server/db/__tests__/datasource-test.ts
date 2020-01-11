import {Entity} from '@google-cloud/datastore/build/src/entity';
import Emulator from 'google-datastore-emulator';
import request from 'request-promise-native';
import {setupENV} from '../../env';
import {FulfillmentService} from '../../interfaces';
import GoogleDatasource from '../google';

setupENV();
jest.setTimeout(30000);

describe('Datasource test suite for Google Cloud Datastore.', () => {
  let emulator: Emulator;
  let dataSource: GoogleDatasource;

  beforeAll(async (done) => {
    const options = {
      useDocker: false,
      storeOnDisk: false,
      project: process.env.DATASTORE_PROJECT_ID,
    };

    emulator = new Emulator(options);
    try {
      await emulator.start();
    } catch (e) {
      fail('Could not start emulator.');
    }

    dataSource = new GoogleDatasource();
    done();
  });

  afterEach(async (done) => {
    await clearDatastoreEmulator();
    done();
  });

  afterAll(async (done) => {
    await emulator.stop();
    done();
  });

  async function clearDatastoreEmulator(): Promise<void> {
    const options = {
      method: 'POST',
      uri: process.env.DATASTORE_RESET_URL,
    };
    await request(options);
  }

  it('adds a fulfillmentService', async () => {
    const services: Entity[] = await dataSource.fulfillmentService.list();
    expect(services.length).toBe(0);

    const want: any = {name: 'testService'};
    const have: Entity = await dataSource.fulfillmentService.create(want);

    expect(have.name).toBe(want.name);
  });

  it('returns a list of fulfillmentServices', async () => {
    let services: Entity[] = await dataSource.fulfillmentService.list();
    expect(services.length).toBe(0);

    const one: any = {name: '1'};
    const two: any = {name: '2'};
    const three: any = {name: '3'};

    await dataSource.fulfillmentService.create(one);
    await dataSource.fulfillmentService.create(two);
    await dataSource.fulfillmentService.create(three);

    services = await dataSource.fulfillmentService.list();

    expect(services.length).toBe(3);
    expect(services[0].name).toBe('1');
    expect(services[1].name).toBe('2');
    expect(services[2].name).toBe('3');
  });

  it('deletes a fulfillmentService', async () => {
    const one: any = {name: '1'};
    const entity: FulfillmentService = await dataSource.fulfillmentService.create(
      one,
    );

    let getResult: FulfillmentService = await dataSource.fulfillmentService.get(
      entity.id,
    );

    expect(entity).toStrictEqual(getResult);

    await dataSource.fulfillmentService.delete(entity.id);
    getResult = await dataSource.fulfillmentService.get(entity.id);
    expect(getResult).toBeNull;
    expect(1).toBe(1);
  });
});
