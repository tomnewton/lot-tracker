import {DataSource, DataSourceConfig} from 'apollo-datasource';
import {Datastore} from '@google-cloud/datastore';
import {entity, Entity} from '@google-cloud/datastore/build/src/entity';
import {nonExecutableDefinitionMessage} from 'graphql/validation/rules/ExecutableDefinitions';

class ApiBase {
  protected _db: Datastore;
  constructor(db: Datastore) {
    this._db = db;
  }

  protected async fetch(key: entity.Key | string): Promise<Entity> {
    if (typeof key === 'string') {
      key = this.toKey(key);
    }
    const result: Entity = await this._db.get(key);
    return result[0];
  }

  protected getURLSafeKey(object: Entity): string {
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
      el.id = this.getURLSafeKey(el);
      return el;
    });
  }
}

class ServiceAPI extends ApiBase {
  async getFulfillmentService(id: string): Promise<Entity> {
    return await super.fetch(id);
  }

  async getFulfillmentServices(
    cursor?: string,
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

  toKey(id: string): entity.Key {
    return super.toKey(id);
  }

  getURLSafeKey(obj: Entity): string {
    return super.getURLSafeKey(obj);
  }
}

class GoogleDatasource extends DataSource {
  public static readonly KIND_FULFILLMENT_SERVICE = 'FulfillmentService';
  public static readonly KIND_LOCATION = 'Location';
  public static readonly KIND_INVENTORY_BATCH = 'InventoryBatch';

  protected _api: ServiceAPI;

  //TODO: add caching.
  constructor() {
    super();
    this._api = new ServiceAPI(new Datastore());
  }

  public initialize(conifg: DataSourceConfig<any>) {}

  public resolve_id(obj: Entity): string {
    return this._api.getURLSafeKey(obj);
  }
}

class FulfillmentServiceAPI extends GoogleDatasource {
  constructor() {
    super();
  }

  public async getFulfillmentServices(cursor?: string): Promise<Entity[]> {
    const result = await this._api.getFulfillmentServices();
    return result;
  }

  public async getFulfillmentService(id: string): Promise<Entity> {
    return await this._api.getFulfillmentService(id);
  }
}

export default FulfillmentServiceAPI;
