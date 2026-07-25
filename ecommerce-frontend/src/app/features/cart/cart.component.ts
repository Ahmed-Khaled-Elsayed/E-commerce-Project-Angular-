import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../shared/interfaces/product.interface';

const DEMO_PRODUCTS: Product[] = [
  { id: '1', name: 'Acoustic Pro Max', price: 349, description: '', category: '', image: '', rating: { rate: 0, count: 0 }, quantity: 1 },
  { id: '2', name: 'Pulse Tracker V2', price: 199, description: '', category: '', image: '', rating: { rate: 0, count: 0 }, quantity: 1 },
  { id: '3', name: 'Heritage Leather Sleeve', price: 85, description: '', category: '', image: '', rating: { rate: 0, count: 0 }, quantity: 1 }
];

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  private readonly cartService = inject(CartService);

  readonly items = this.cartService.items;
  readonly totals = this.cartService.totals;

  constructor() {
    if (this.cartService.currentItems.length === 0) {
      DEMO_PRODUCTS.forEach(product => this.cartService.addItem(product));
    }
  }

  increment(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity + 1);
  }

  decrement(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity - 1);
  }

  remove(productId: string): void {
    this.cartService.removeItem(productId);
  }

  rewardPoints(subtotal: number): number {
    return Math.round(subtotal * 2);
  }
}
