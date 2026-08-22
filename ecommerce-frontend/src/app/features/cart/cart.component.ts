import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);

  readonly items = this.cartService.items;
  readonly totals = this.cartService.totals;

  ngOnInit(): void {
    this.cartService.load();
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
