import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div [routerLink]="['/products', product.id]" class="group bg-[var(--color-surface)] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-[var(--color-outline)] flex flex-col h-full relative cursor-pointer">
      
      <!-- Badges -->
      <div class="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <span *ngIf="product.badge === 'new'" class="bg-[var(--color-success)] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">NEW</span>
        <span *ngIf="product.badge === 'sale' || (product.originalPrice && product.originalPrice > product.price)" class="bg-[var(--color-error)] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">SALE</span>
      </div>

      <!-- Image Container -->
      <div class="relative w-full pt-[100%] overflow-hidden bg-gray-50 p-4">
        <img [src]="product.image || 'https://via.placeholder.com/400?text=No+Image'" 
             [alt]="product.name"
             class="absolute inset-0 w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-110">
      </div>

      <!-- Content -->
      <div class="p-6 flex flex-col flex-grow">
        <span class="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-2">{{ product.category }}</span>
        <h3 class="text-lg font-bold text-[var(--color-on-background)] leading-tight line-clamp-2 mb-4 flex-grow group-hover:text-[var(--color-primary)] transition-colors">
          {{ product.name }}
        </h3>
        
        <!-- Price & Action -->
        <div class="flex items-center justify-between mt-auto">
          <div>
            <span class="text-2xl font-black" [ngClass]="variant === 'product-page' ? 'text-[#1A1A1A]' : 'text-[var(--color-primary)]'">\${{ product.price | number:'1.2-2' }}</span>
            <span *ngIf="product.originalPrice" class="ml-2 text-sm text-[var(--color-on-surface-variant)] line-through">\${{ product.originalPrice | number:'1.2-2' }}</span>
          </div>
          <button (click)="$event.stopPropagation(); addToCart()" class="bg-white border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-200 shadow-sm disabled:opacity-50"
                  [disabled]="!product.quantity || product.quantity <= 0"
                  title="Add to Cart">
            <span class="material-symbols-outlined text-[20px]">add_shopping_cart</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Input() variant: 'default' | 'product-page' = 'default';

  addToCart() {
    // Implement add to cart if needed, currently just a stub to stop propagation
  }
}
