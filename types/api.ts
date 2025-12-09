export interface Batch {
  id: number;
  batchCode: string;
  expirationDate: string;
  stock: number;
  purchasePrice: number;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  barcode?: string;
  salePrice: number;
  minStock: number;
  provider?: string; 
  batches?: Batch[];
  totalStock?: number; 
  nearestBatch?: Batch; 
}