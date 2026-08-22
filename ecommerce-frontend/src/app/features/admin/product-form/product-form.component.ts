import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  form!: FormGroup;
  isEditMode = false;
  productId: string | null = null;
  isLoading = false;
  isSaving = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  readonly categories = ['Electronics', 'Clothing', 'Accessories', 'Footwear', 'Home', 'Sports', 'Books', 'Other'];

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      image: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0)]]
    });

    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.isEditMode = true;
      this.loadProduct(this.productId);
    }
  }

  private loadProduct(id: string): void {
    this.isLoading = true;
    this.productService.getById(id).subscribe({
      next: (product) => {
        this.form.patchValue({
          name: product.name,
          price: product.price,
          description: product.description,
          category: product.category,
          image: product.image,
          quantity: product.quantity
        });
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load product.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = null;
    this.successMessage = null;

    const formValue = this.form.value;

    if (this.isEditMode && this.productId) {
      this.productService.update(this.productId, formValue).subscribe({
        next: () => {
          this.successMessage = 'Product updated successfully!';
          this.isSaving = false;
          setTimeout(() => this.router.navigate(['/admin/products']), 1200);
        },
        error: () => {
          this.errorMessage = 'Failed to update product. Please try again.';
          this.isSaving = false;
        }
      });
    } else {
      this.productService.create(formValue).subscribe({
        next: () => {
          this.successMessage = 'Product created successfully!';
          this.isSaving = false;
          setTimeout(() => this.router.navigate(['/admin/products']), 1200);
        },
        error: () => {
          this.errorMessage = 'Failed to create product. Please try again.';
          this.isSaving = false;
        }
      });
    }
  }

  getFieldError(fieldName: string): string | null {
    const control = this.form.get(fieldName);
    if (!control || !control.touched || !control.errors) return null;

    if (control.errors['required']) return `${this.fieldLabel(fieldName)} is required.`;
    if (control.errors['minlength']) return `Minimum ${control.errors['minlength'].requiredLength} characters.`;
    if (control.errors['min']) return `Must be at least ${control.errors['min'].min}.`;

    return null;
  }

  private fieldLabel(field: string): string {
    const labels: Record<string, string> = {
      name: 'Product name', price: 'Price', description: 'Description',
      category: 'Category', image: 'Image URL', quantity: 'Quantity'
    };
    return labels[field] || field;
  }
}
