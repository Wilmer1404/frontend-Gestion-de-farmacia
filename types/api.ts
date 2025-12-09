export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

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

export interface User {
  id: number;
  username: string;
  fullName: string;
  role: "ADMIN" | "SELLER";
  password?: string; 
}