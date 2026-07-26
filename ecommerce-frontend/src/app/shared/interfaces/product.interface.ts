export interface ProductRating {
  rate: number;
  count: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: ProductRating;
  quantity: number;
}

export interface ProductApiModel {
  _id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: ProductRating;
  qunt: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductInput {
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  quantity: number;
}

export interface ProductQueryParams {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}
