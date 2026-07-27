import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { Product } from '../../../../shared/interfaces/product.interface';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  template: `
    <div class="bg-[var(--color-surface-secondary)] py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-[var(--color-on-background)] mb-3">Featured Products</h2>
          <div class="w-16 h-1 bg-[var(--color-primary)] mx-auto rounded-full"></div>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div *ngFor="let i of [1,2,3,4]" class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col h-[400px]">
            <div class="w-full pt-[100%] bg-gray-200 rounded-xl mb-4 animate-pulse"></div>
            <div class="h-4 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
            <div class="h-6 bg-gray-200 rounded w-3/4 mb-4 animate-pulse flex-grow"></div>
            <div class="flex justify-between items-center">
              <div class="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              <div class="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        <!-- Grid -->
        <div *ngIf="!loading && products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <app-product-card *ngFor="let product of products" [product]="product"></app-product-card>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && products.length === 0" class="text-center py-12">
          <p class="text-[var(--color-on-surface-variant)]">No featured products at this time.</p>
        </div>
      </div>
    </div>
  `
})
export class FeaturedProductsComponent {
  @Input() products: Product[] = [];
  @Input() loading = false;
}
