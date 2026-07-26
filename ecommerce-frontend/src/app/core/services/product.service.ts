import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PRODUCTS_API } from '../env';
import { Product, ProductApiModel, ProductInput, ProductQueryParams } from '../../shared/interfaces/product.interface';

interface ProductApiPayload {
  title?: string;
  price?: number;
  description?: string;
  category?: string;
  image?: string;
  qunt?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = PRODUCTS_API;

  getAll(query: ProductQueryParams = {}): Observable<Product[]> {
    let params = new HttpParams();
    if (query.category) params = params.set('category', query.category);
    if (query.search) params = params.set('search', query.search);
    if (query.page) params = params.set('page', query.page);
    if (query.limit) params = params.set('limit', query.limit);

    return this.http
      .get<ProductApiModel[]>(this.baseUrl, { params })
      .pipe(map(products => products.map(product => this.toProduct(product))));
  }

  getById(id: string): Observable<Product> {
    return this.http
      .get<ProductApiModel>(`${this.baseUrl}/${id}`)
      .pipe(map(product => this.toProduct(product)));
  }

  getByCategory(category: string): Observable<Product[]> {
    return this.http
      .get<ProductApiModel[]>(`${this.baseUrl}/category/${category}`)
      .pipe(map(products => products.map(product => this.toProduct(product))));
  }

  create(input: ProductInput): Observable<Product> {
    return this.http
      .post<ProductApiModel>(this.baseUrl, this.toApiPayload(input))
      .pipe(map(product => this.toProduct(product)));
  }

  update(id: string, input: Partial<ProductInput>): Observable<Product> {
    return this.http
      .patch<ProductApiModel>(`${this.baseUrl}/${id}`, this.toApiPayload(input))
      .pipe(map(product => this.toProduct(product)));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  private toProduct(raw: ProductApiModel): Product {
    return {
      id: raw._id,
      name: raw.title,
      price: raw.price,
      description: raw.description,
      category: raw.category,
      image: raw.image,
      rating: raw.rating ?? { rate: 0, count: 0 },
      quantity: raw.qunt
    };
  }

  private toApiPayload(input: Partial<ProductInput>): ProductApiPayload {
    const payload: ProductApiPayload = {};
    if (input.name !== undefined) payload.title = input.name;
    if (input.price !== undefined) payload.price = input.price;
    if (input.description !== undefined) payload.description = input.description;
    if (input.category !== undefined) payload.category = input.category;
    if (input.image !== undefined) payload.image = input.image;
    if (input.quantity !== undefined) payload.qunt = input.quantity;
    return payload;
  }
}
