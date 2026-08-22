import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../shared/interfaces/product.interface';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './product-catalog.component.html',
  styleUrl: './product-catalog.component.css'
})
export class ProductCatalogComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  products: Product[] = [];
  categories: string[] = [];
  search = '';
  category = '';
  page = 1;
  readonly pageSize = 12;
  totalPages = 1;
  isLoading = true;
  errorMessage = '';
  addedProductId: string | null = null;
  addingProductId: string | null = null;
  cartError = '';

  get cartItemCount(): number {
    return this.cartService.currentTotals.itemCount;
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.productService.getAll({
      search: this.search.trim() || undefined,
      category: this.category || undefined,
      page: this.page,
      limit: this.pageSize
    }).subscribe({
      next: products => {
        this.products = products;
        this.categories = [...new Set(products.map(product => product.category).filter(Boolean))].sort();
        this.totalPages = Math.max(1, Math.ceil(products.length < this.pageSize ? this.page : this.page + 1));
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'We could not load the catalog. Please try again.';
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.page = 1;
    this.loadProducts();
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.page) return;
    this.page = page;
    this.loadProducts();
  }

  addToCart(product: Product): void {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.addingProductId = product.id;
    this.cartError = '';
    this.cartService.addItem(product).subscribe({
      next: () => {
        this.addingProductId = null;
        this.addedProductId = product.id;
        setTimeout(() => { if (this.addedProductId === product.id) this.addedProductId = null; }, 1400);
      },
      error: error => {
        this.addingProductId = null;
        this.cartError = error.error?.data?.data || error.error?.data?.message || 'Product could not be added to cart.';
      }
    });
  }

  trackById(_index: number, product: Product): string {
    return product.id;
  }
}
