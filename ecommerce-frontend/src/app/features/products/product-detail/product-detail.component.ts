import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../shared/interfaces/product.interface';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);
  private readonly toastr = inject(ToastrService);

  product: Product | null = null;
  relatedProducts: Product[] = [];
  
  isLoading = true;
  isLoadingRelated = false;
  errorMessage: string | null = null;
  
  // UI State
  selectedImage: string = '';
  quantity: number = 1;
  isWishlisted: boolean = false;

  // Features placeholder if database is empty
  defaultFeatures = [
    'Premium quality materials',
    '1-year manufacturer warranty',
    '30-day money-back guarantee',
    'Free shipping on all orders'
  ];

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProduct(id);
      } else {
        this.errorMessage = 'Invalid product ID.';
        this.isLoading = false;
      }
    });
  }

  loadProduct(id: string) {
    this.isLoading = true;
    this.errorMessage = null;
    
    // Reset state for new product route
    this.quantity = 1;
    this.isWishlisted = false;
    window.scrollTo(0, 0);

    this.productService.getById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.selectedImage = product.image; // default image
        
        // Setup images array if missing from old seeded data
        if (!this.product.images || this.product.images.length === 0) {
           this.product.images = [this.product.image];
        }
        
        // Setup features if missing
        if (!this.product.features || this.product.features.length === 0) {
           this.product.features = this.defaultFeatures;
        }

        this.isLoading = false;
        this.loadRelatedProducts(product.category, product.id);
      },
      error: (err) => {
        this.errorMessage = 'Product not found or an error occurred.';
        this.isLoading = false;
      }
    });
  }

  loadRelatedProducts(category: string, currentId: string) {
    this.isLoadingRelated = true;
    this.productService.getByCategory(category)
      .pipe(finalize(() => this.isLoadingRelated = false))
      .subscribe({
        next: (products) => {
          // Filter out current product and limit to 4
          this.relatedProducts = products.filter(p => p.id !== currentId).slice(0, 4);
        },
        error: (err) => {
          console.error('Failed to load related products', err);
          this.relatedProducts = [];
        }
      });
  }

  selectImage(img: string) {
    this.selectedImage = img;
  }

  toggleWishlist() {
    this.isWishlisted = !this.isWishlisted;
    if (this.isWishlisted) {
       this.toastr.success('Added to Wishlist!');
    } else {
       this.toastr.info('Removed from Wishlist');
    }
  }

  incrementQuantity() {
    if (this.product && this.quantity < this.product.quantity) {
      this.quantity++;
    }
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (!this.product) return;
    this.toastr.success(`Added ${this.quantity} item(s) to cart`);
    // Connect to actual cart service here
  }

  buyNow() {
    if (!this.product) return;
    this.toastr.success('Redirecting to checkout...');
  }
}
