import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Category } from '../../../../core/services/home.service';

@Component({
  selector: 'app-category-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <!-- Header -->
      <div class="flex justify-between items-end mb-8">
        <div>
          <h2 class="text-3xl font-bold text-[var(--color-on-background)]">Browse by Category</h2>
        </div>
        <a routerLink="/products" class="text-[var(--color-primary)] font-semibold hover:underline flex items-center space-x-1 cursor-pointer">
          <span>View All</span>
          <span class="material-symbols-outlined text-sm">arrow_forward</span>
        </a>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="grid grid-cols-1 md:grid-cols-3 gap-6 h-[500px]">
        <div class="md:col-span-2 bg-gray-200 rounded-2xl animate-pulse h-full"></div>
        <div class="md:col-span-1 flex flex-col gap-6 h-full">
          <div class="bg-gray-200 rounded-2xl animate-pulse flex-1"></div>
          <div class="bg-gray-200 rounded-2xl animate-pulse flex-1"></div>
        </div>
      </div>

      <!-- Grid -->
      <div *ngIf="!loading && categories.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[500px]">
        <!-- Large Card (First item) -->
        <div [routerLink]="['/products']" [queryParams]="{ category: categories[0].name }" class="md:col-span-2 relative rounded-2xl overflow-hidden group h-[300px] md:h-full cursor-pointer">
          <div class="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors z-10"></div>
          <img [src]="categories[0].image" [alt]="categories[0].name" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
          <div class="absolute bottom-0 left-0 p-8 z-20">
            <h3 class="text-3xl font-bold text-white mb-2 uppercase">{{ categories[0].name }}</h3>
            <p *ngIf="categories[0].subtitle" class="text-white/80 font-medium">{{ categories[0].subtitle }}</p>
          </div>
        </div>

        <!-- Stacked Small Cards (Items 2 and 3) -->
        <div class="md:col-span-1 flex flex-col gap-6 h-full">
          <div *ngFor="let cat of categories | slice:1:3" [routerLink]="['/products']" [queryParams]="{ category: cat.name }" class="relative rounded-2xl overflow-hidden group flex-1 min-h-[200px] md:min-h-0 cursor-pointer">
            <div class="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors z-10"></div>
            <img [src]="cat.image" [alt]="cat.name" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
            <div class="absolute bottom-0 left-0 p-6 z-20">
              <h3 class="text-xl font-bold text-white mb-1 uppercase">{{ cat.name }}</h3>
              <p *ngIf="cat.subtitle" class="text-white/80 text-sm font-medium">{{ cat.subtitle }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && categories.length === 0" class="text-center py-12">
        <p class="text-[var(--color-on-surface-variant)]">No categories found.</p>
      </div>
    </div>
  `
})
export class CategorySectionComponent {
  @Input() categories: Category[] = [];
  @Input() loading = false;
}
