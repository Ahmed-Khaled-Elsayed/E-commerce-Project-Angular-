import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../interfaces/category.interface';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <nav class="bg-white border-b border-[var(--color-outline)] sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <a routerLink="/" class="text-[var(--color-primary)] font-bold text-2xl tracking-tight">ShopEase</a>
          </div>

          <!-- Desktop Menu -->
          <div class="hidden md:flex items-center space-x-2">
            <a routerLink="/" [routerLinkActiveOptions]="{exact: true}" routerLinkActive="!text-white !bg-[var(--color-primary)] shadow-md" class="px-4 py-2 rounded-full text-[var(--color-on-background)] font-medium hover:text-[var(--color-primary)] hover:bg-green-50 transition-all duration-300">Home</a>
            <a routerLink="/products" routerLinkActive="!text-white !bg-[var(--color-primary)] shadow-md" class="px-4 py-2 rounded-full text-[var(--color-on-background)] font-medium hover:text-[var(--color-primary)] hover:bg-green-50 transition-all duration-300">Products</a>
            
            <!-- Categories Dropdown -->
            <div class="relative group">
              <button class="flex items-center px-4 py-2 rounded-full text-[var(--color-on-background)] font-medium hover:text-[var(--color-primary)] hover:bg-green-50 transition-all duration-300 outline-none focus:outline-none">
                Categories
                <span class="material-symbols-outlined text-sm ml-1">expand_more</span>
              </button>
              <div class="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[var(--color-outline)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left z-50">
                <div class="py-2">
                  <a *ngIf="categories.length === 0" class="block px-4 py-2 text-sm text-[var(--color-on-surface-variant)]">Loading...</a>
                  <a *ngFor="let cat of categories" [routerLink]="['/products']" [queryParams]="{ category: cat.name }" class="block px-4 py-2 text-sm text-[var(--color-on-background)] hover:bg-green-50 hover:text-[var(--color-primary)] capitalize transition-colors">
                    {{ cat.name }}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Right side icons & search -->
          <div class="flex items-center space-x-4">
            <!-- Search -->
            <div class="hidden sm:block relative">
              <input #searchInput [value]="searchQuery" type="text" (input)="onSearch(searchInput.value)" placeholder="Search products..." class="w-64 pl-4 pr-10 py-2 rounded-full border border-[var(--color-outline)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all bg-[var(--color-background)]">
              <button class="absolute right-3 top-2.5 text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors flex items-center justify-center pointer-events-none">
                <span class="material-symbols-outlined">search</span>
              </button>
            </div>

            <!-- Icons -->
            <button class="p-2 rounded-full border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors" title="Cart">
              <span class="material-symbols-outlined">shopping_cart</span>
            </button>
            <button class="p-2 rounded-full border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors" title="Profile">
              <span class="material-symbols-outlined">person</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private categoryService = inject(CategoryService);
  private searchSubject = new Subject<string>();
  
  searchQuery = '';
  categories: Category[] = [];

  ngOnInit() {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => console.error('Failed to load categories', err)
    });

    // Listen to route query params to sync the search bar text
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
    });

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      if (query.trim()) {
        this.router.navigate(['/products'], { queryParams: { search: query.trim() } });
      } else {
        this.router.navigate(['/products']);
      }
    });
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }

  onSearch(query: string) {
    this.searchSubject.next(query);
  }
}
