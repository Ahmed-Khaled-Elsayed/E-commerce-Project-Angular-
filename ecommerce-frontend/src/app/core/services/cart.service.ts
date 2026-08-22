import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { CartItem, CartTotals } from '../../shared/interfaces/cart.interface';
import { Product } from '../../shared/interfaces/product.interface';
import { CART_API } from '../env';

const TAX_RATE = 0.08;

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>([]);
  private readonly baseUrl = CART_API;
  readonly items = this.itemsSubject.asObservable();
  readonly totals: Observable<CartTotals> = this.items.pipe(map(items => this.calculateTotals(items)));

  get currentItems(): CartItem[] {
    return this.itemsSubject.value;
  }

  get currentTotals(): CartTotals {
    return this.calculateTotals(this.currentItems);
  }

  load(): void {
    this.http.get<{ data?: { data?: any[] } }>(this.baseUrl).subscribe({
      next: response => this.setItems(response.data?.data ?? [])
    });
  }

  addItem(product: Product, quantity = 1): Observable<void> {
    return this.http.post<{ data?: { data?: any[] } }>(this.baseUrl, {
      productId: Number(product.id), quantity
    }).pipe(map(response => {
      this.setItems(response.data?.data ?? []);
    }));
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity < 1) {
      this.removeItem(productId);
      return;
    }

    this.http.patch<{ data?: { data?: any[] } }>(`${this.baseUrl}/${productId}`, { quantity }).subscribe({
      next: response => this.setItems(response.data?.data ?? [])
    });
  }

  removeItem(productId: string): void {
    this.http.delete<{ data?: { data?: any[] } }>(`${this.baseUrl}/${productId}`).subscribe({
      next: response => this.setItems(response.data?.data ?? [])
    });
  }

  clear(): void {
    this.http.delete<{ data?: { data?: any[] } }>(this.baseUrl).subscribe({
      next: response => this.setItems(response.data?.data ?? [])
    });
  }

  private calculateTotals(items: CartItem[]): CartTotals {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const tax = subtotal * TAX_RATE;

    return { itemCount, subtotal, tax, total: subtotal + tax };
  }

  private setItems(rawItems: any[]): void {
    const items = rawItems.map(item => ({
      productId: String(item.productId ?? item.id),
      name: item.name ?? item.title ?? '',
      price: Number(item.price) || 0,
      image: item.image ?? '',
      quantity: Number(item.quantity) || 0
    }));
    this.itemsSubject.next(items);
  }
}
