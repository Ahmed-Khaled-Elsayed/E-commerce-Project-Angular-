import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { CartItem, CartTotals } from '../../shared/interfaces/cart.interface';
import { Product } from '../../shared/interfaces/product.interface';

const STORAGE_KEY = 'luxecart_cart';
const TAX_RATE = 0.08;

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>(this.loadFromStorage());
  readonly items = this.itemsSubject.asObservable();
  readonly totals: Observable<CartTotals> = this.items.pipe(map(items => this.calculateTotals(items)));

  get currentItems(): CartItem[] {
    return this.itemsSubject.value;
  }

  get currentTotals(): CartTotals {
    return this.calculateTotals(this.currentItems);
  }

  addItem(product: Product, quantity = 1): void {
    const items = [...this.itemsSubject.value];
    const existing = items.find(item => item.productId === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity
      });
    }

    this.updateItems(items);
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity < 1) {
      this.removeItem(productId);
      return;
    }

    const items = this.itemsSubject.value.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    );
    this.updateItems(items);
  }

  removeItem(productId: string): void {
    const items = this.itemsSubject.value.filter(item => item.productId !== productId);
    this.updateItems(items);
  }

  clear(): void {
    this.updateItems([]);
  }

  private calculateTotals(items: CartItem[]): CartTotals {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const tax = subtotal * TAX_RATE;

    return { itemCount, subtotal, tax, total: subtotal + tax };
  }

  private updateItems(items: CartItem[]): void {
    this.itemsSubject.next(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  private loadFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}
