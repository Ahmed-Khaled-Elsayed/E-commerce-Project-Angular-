import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CATEGORIES_API } from '../env';
import { Category, CategoryApiResponse } from '../../shared/interfaces/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = CATEGORIES_API;

  getAllCategories(): Observable<Category[]> {
    return this.http
      .get<CategoryApiResponse>(this.baseUrl)
      .pipe(map(res => res.data.data));
  }
}
