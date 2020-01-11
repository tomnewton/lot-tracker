import {Datastore} from '@google-cloud/datastore';
import {Entity, entity} from '@google-cloud/datastore/build/src/entity';
import {
  DeleteResponse,
  InsertResponse,
} from '@google-cloud/datastore/build/src/request';
import {FulfillmentServiceInput} from '../interfaces';
import {IDatasourceAPI} from './interface';

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

class FulfillmentServiceAPI extends ApiBase implements IDatasourceAPI<Entity> {
  public static readonly KIND = 'FulfillmentService';

  async create(input: FulfillmentServiceInput): Promise<Entity> {
    const kind = FulfillmentServiceAPI.KIND;
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
    const query = this._db.createQuery(FulfillmentServiceAPI.KIND);

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

export default FulfillmentServiceAPI;
