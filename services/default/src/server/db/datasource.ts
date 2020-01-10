import {Datastore} from '@google-cloud/datastore';
import {DataSource, DataSourceConfig} from 'apollo-datasource';
import FulfillmentServiceAPI from './fulfillment_service';

class GoogleDatasource extends DataSource {
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
