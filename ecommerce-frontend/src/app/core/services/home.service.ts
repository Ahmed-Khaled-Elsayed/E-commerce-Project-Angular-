import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_URL } from '../env';

export interface Category {
  _id: string;
  name: string;
  image: string;
  subtitle?: string;
}

export interface Promo {
  _id: string;
  title: string;
  discountPercentage: number;
  endDate: string;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private readonly http = inject(HttpClient);

  getCategories(): Observable<Category[]> {
    return this.http.get<{status: string, data: {data: Category[]}}>(`${API_URL}/categories`)
      .pipe(map(res => res.data.data));
  }

  getActivePromotions(): Observable<Promo[]> {
    return this.http.get<{status: string, data: {data: Promo[]}}>(`${API_URL}/promotions/active`)
      .pipe(map(res => res.data.data));
  }
}
