export interface FulfillmentService {
  id: string;
  name: string;
  locations: Location[];
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
