export interface FulfillmentService extends FulfillmentServiceInput {
  id: string;
  locations: Location[];
}

export interface FulfillmentServiceInput {
  name: string;
}

export interface FulfillmentServiceInput {
  name: string;
}

export interface Location {
  id: string;
  name: string;
  inventoryBatches: InventoryBatch[];
}

export interface InventoryBatch {
  id: string;
  name: string;
  lotId: string;
  quantity: number;
  active: boolean;
}
