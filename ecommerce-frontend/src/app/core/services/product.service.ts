import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PRODUCTS_API } from '../env';
import { Product, ProductApiModel, ProductInput, ProductQueryParams } from '../../shared/interfaces/product.interface';

interface ProductApiPayload {
  id?: number;
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
      .get<{ data?: { data?: ProductApiModel[] } }>(`${this.baseUrl}/getAllProducts`, { params })
      .pipe(map(response => (response.data?.data ?? []).map(product => this.toProduct(product))));
  }

  getById(id: string): Observable<Product> {
    return this.http
      .get<{ data?: { data?: ProductApiModel } }>(`${this.baseUrl}/${id}`)
      .pipe(map(response => this.toProduct(response.data?.data as ProductApiModel)));
  }

  getByCategory(category: string): Observable<Product[]> {
    return this.http
      .get<{ data?: { data?: ProductApiModel[] } }>(`${this.baseUrl}/getAllProducts`, {
        params: { category }
      })
      .pipe(map(response => (response.data?.data ?? [])
        .filter(product => product.category === category)
        .map(product => this.toProduct(product))));
  }

  create(input: ProductInput): Observable<unknown> {
    return this.http
      .post<unknown>(`${this.baseUrl}/insertProduct`, this.toApiPayload(input));
  }

  update(id: string, input: Partial<ProductInput>): Observable<Product> {
    return this.http
      .patch<ProductApiModel>(`${this.baseUrl}/${id}`, this.toApiPayload(input))
      .pipe(map(response => this.toProduct((response as any).data?.data ?? response)));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  private toProduct(raw: ProductApiModel): Product {
    return {
      id: String(raw.id ?? raw._id),
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
    payload.id = Date.now();
    if (input.name !== undefined) payload.title = input.name;
    if (input.price !== undefined) payload.price = input.price;
    if (input.description !== undefined) payload.description = input.description;
    if (input.category !== undefined) payload.category = input.category;
    if (input.image !== undefined) payload.image = input.image;
    if (input.quantity !== undefined) payload.qunt = input.quantity;
    return payload;
  }
}
