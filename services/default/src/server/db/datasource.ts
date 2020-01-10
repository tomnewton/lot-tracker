import {Datastore} from '@google-cloud/datastore';
import {entity, Entity} from '@google-cloud/datastore/build/src/entity';
import {
  DeleteResponse,
  InsertResponse,
} from '@google-cloud/datastore/build/src/request';
import {DataSource, DataSourceConfig} from 'apollo-datasource';
import {FulfillmentServiceInput} from '../interfaces';

class ApiBase {
  protected _db: Datastore;
  constructor(db: Datastore) {
    this._db = db;
  }

  protected async fetch(key: entity.Key | string): Promise<Entity> | null {
    if (typeof key === 'string') {
      key = this.toKey(key);
    }
    const getResponse = await this._db.get(key);
    const response = this.setIDs(getResponse);
    return response[0];
  }

  protected async delete(key: entity.Key | string): Promise<void> {
    if (typeof key === 'string') {
      key = this.toKey(key);
    }
    const deleteResponse: DeleteResponse = await this._db.delete(key);
  }

  public getURLSafeKey(object: Entity): string {
    const urlsafe: entity.URLSafeKey = new entity.URLSafeKey();
    return urlsafe.legacyEncode(
      process.env.GOOGLE_CLOUD_PROJECT,
      object[entity.KEY_SYMBOL],
    );
  }

  protected toKey(urlSafeKey: string): entity.Key {
    const urlsafe = new entity.URLSafeKey();
    return urlsafe.legacyDecode(urlSafeKey);
  }

  protected getKey(object: Entity): entity.Key {
    return object[entity.KEY_SYMBOL];
  }

  protected setIDs(entities: Entity[]): Entity[] {
    return entities.map((el: Entity) => {
      if (el) {
        el.id = this.getURLSafeKey(el);
        return el;
      }
    });
  }
}

interface IDatasourceAPI {
  create(input: any): Promise<Entity>;
  get(id: string): Promise<Entity>;
  list(cursor: string, limit: number): Promise<Entity[]>;
  delete(id: string): Promise<void>;
}

class FulfillmentServiceAPI extends ApiBase implements IDatasourceAPI {
  async create(input: FulfillmentServiceInput): Promise<Entity> {
    const kind = GoogleDatasource.KIND_FULFILLMENT_SERVICE;
    const fulfillmentServiceKey = this._db.key([kind, input.name]);
    const entity = {
      key: fulfillmentServiceKey,
      data: input,
    };

    const result: InsertResponse = await this._db.insert(entity);
    return this.fetch(fulfillmentServiceKey);
  }

  async get(id: string): Promise<Entity> | null {
    return await super.fetch(id);
  }

  async list(
    cursor: string = undefined,
    limit: number = 20,
  ): Promise<Entity[]> {
    const query = this._db.createQuery(
      GoogleDatasource.KIND_FULFILLMENT_SERVICE,
    );

    if (limit) {
      query.limit(limit);
    }

    if (cursor) {
      query.start(cursor);
    }

    const result = await this._db.runQuery(query);
    return super.setIDs(result[0]);
  }

  async delete(id: string): Promise<void> {
    await super.delete(id);
  }
}

class GoogleDatasource extends DataSource {
  public static readonly KIND_FULFILLMENT_SERVICE = 'FulfillmentService';
  public static readonly KIND_LOCATION = 'Location';
  public static readonly KIND_INVENTORY_BATCH = 'InventoryBatch';

  protected _fulfillmentServiceAPI: FulfillmentServiceAPI;

  public get fulfillmentService(): FulfillmentServiceAPI {
    return this._fulfillmentServiceAPI;
  }

  constructor() {
    super();
    this._fulfillmentServiceAPI = new FulfillmentServiceAPI(new Datastore());
  }

  //TODO: add caching.
  public initialize(conifg: DataSourceConfig<any>) {}
}

export default GoogleDatasource;
