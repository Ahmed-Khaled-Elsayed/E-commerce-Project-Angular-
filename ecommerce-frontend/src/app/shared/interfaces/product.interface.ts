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
  images?: string[];
  features?: string[];
  rating: ProductRating;
  quantity: number;
  originalPrice?: number;
  badge?: string;
  featured?: boolean;
}

export interface ProductApiModel {
  _id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  images?: string[];
  features?: string[];
  rating?: ProductRating;
  qunt: number;
  originalPrice?: number;
  badge?: string;
  featured?: boolean;
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
