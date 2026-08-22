import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../shared/interfaces/product.interface';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  product: Product | null = null;
  quantity = 1;
  isLoading = true;
  errorMessage = '';
  added = false;
  isAdding = false;
  cartError = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.errorMessage = 'Product not found.'; this.isLoading = false; return; }
    this.productService.getById(id).subscribe({
      next: product => { this.product = product; this.isLoading = false; },
      error: () => { this.errorMessage = 'We could not find that product.'; this.isLoading = false; }
    });
  }

  addToCart(): void {
    if (!this.product) return;
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.isAdding = true;
    this.cartError = '';
    this.cartService.addItem(this.product, this.quantity).subscribe({
      next: () => {
        this.isAdding = false;
        this.added = true;
        setTimeout(() => this.added = false, 1400);
      },
      error: error => {
        this.isAdding = false;
        this.cartError = error.error?.data?.data || error.error?.data?.message || 'Product could not be added to cart.';
      }
    });
  }
}
