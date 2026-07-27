import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from './components/hero/hero.component';
import { CategorySectionComponent } from './components/category-section/category-section.component';
import { FeaturedProductsComponent } from './components/featured-products/featured-products.component';
import { PromoBannerComponent } from './components/promo-banner/promo-banner.component';
import { HomeService, Category, Promo } from '../../core/services/home.service';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../shared/interfaces/product.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeroComponent, CategorySectionComponent, FeaturedProductsComponent, PromoBannerComponent],
  template: `
    <div class="flex flex-col">
      <app-hero></app-hero>
      
      <app-category-section 
        [categories]="categories" 
        [loading]="categoriesLoading">
      </app-category-section>
      
      <app-featured-products 
        [products]="featuredProducts" 
        [loading]="productsLoading">
      </app-featured-products>
      
      <app-promo-banner 
        [promo]="activePromo">
      </app-promo-banner>
    </div>
  `
})
export class HomeComponent implements OnInit {
  private homeService = inject(HomeService);
  private productService = inject(ProductService);

  categories: Category[] = [];
  categoriesLoading = true;

  featuredProducts: Product[] = [];
  productsLoading = true;

  activePromo: Promo | null = null;

  ngOnInit() {
    this.loadCategories();
    this.loadFeaturedProducts();
    this.loadPromotions();
  }

  private loadCategories() {
    this.homeService.getCategories().subscribe({
      next: (data: Category[]) => {
        this.categories = data;
        this.categoriesLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading categories', err);
        this.categoriesLoading = false;
      }
    });
  }

  private loadFeaturedProducts() {
    // Get all products, then filter and take 4
    this.productService.getAll().subscribe({
      next: (data: Product[]) => {
        // filter featured products
        this.featuredProducts = data.filter((p: Product) => p.featured).slice(0, 4);
        // if none are marked featured, just take the first 4 as fallback
        if (this.featuredProducts.length === 0) {
          this.featuredProducts = data.slice(0, 4);
        }
        this.productsLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading products', err);
        this.productsLoading = false;
      }
    });
  }

  private loadPromotions() {
    this.homeService.getActivePromotions().subscribe({
      next: (data: Promo[]) => {
        if (data && data.length > 0) {
          this.activePromo = data[0]; // Take the first active promo
        }
      },
      error: (err: any) => {
        console.error('Error loading promotions', err);
      }
    });
  }
}
