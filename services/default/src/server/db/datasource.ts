import {Datastore} from '@google-cloud/datastore';
import {DataSource, DataSourceConfig} from 'apollo-datasource';
import FulfillmentServiceAPI from './fulfillment_service';

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
