import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../shared/interfaces/product.interface';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../shared/interfaces/category.interface';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly categoryService = inject(CategoryService);
  
  products: Product[] = [];
  categories: Category[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  searchQuery: string = '';
  activeCategory: string = '';

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Failed to load categories', err)
    });

    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
      this.activeCategory = params['category'] || '';
      this.fetchProducts(this.searchQuery, this.activeCategory);
    });
  }

  fetchProducts(searchQuery: string = '', category: string = ''): void {
    this.isLoading = true;
    const query: any = {};
    if (searchQuery) query.search = searchQuery;
    if (category) query.category = category;
    
    this.productService.getAll(query).subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load products. Please try again later.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  addToCart(product: Product): void {
    // Stub for adding to cart
    console.log('Adding to cart from list', product);
  }
}
