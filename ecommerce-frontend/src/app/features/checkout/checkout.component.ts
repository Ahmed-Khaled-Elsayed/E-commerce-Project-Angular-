import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { CreateOrderPayload, OrderItem } from '../../shared/interfaces/order.interface';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  private readonly fb = inject(FormBuilder);
  private readonly cartService = inject(CartService);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  readonly items = this.cartService.items;
  readonly totals = this.cartService.totals;

  isPlacingOrder = false;
  errorMessage: string | null = null;

  readonly shippingForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required]],
    address: ['', [Validators.required]],
    city: ['', [Validators.required]],
    postalCode: ['', [Validators.required]],
    country: ['', [Validators.required]],
    phone: ['']
  });

  get fullNameControl(): AbstractControl | null {
    return this.shippingForm.get('fullName');
  }

  get addressControl(): AbstractControl | null {
    return this.shippingForm.get('address');
  }

  get cityControl(): AbstractControl | null {
    return this.shippingForm.get('city');
  }

  get postalCodeControl(): AbstractControl | null {
    return this.shippingForm.get('postalCode');
  }

  get countryControl(): AbstractControl | null {
    return this.shippingForm.get('country');
  }

  getFieldError(control: AbstractControl | null, fieldName: string): string | null {
    if (!control) {
      return null;
    }

    if (control.touched && control.invalid && control.errors) {
      if (control.errors['required']) {
        return `${fieldName} is required.`;
      }
    }

    return null;
  }

  placeOrder(): void {
    this.errorMessage = null;

    if (this.shippingForm.invalid) {
      this.shippingForm.markAllAsTouched();
      return;
    }

    if (this.cartService.currentItems.length === 0) {
      this.errorMessage = 'Your cart is empty.';
      return;
    }

    this.isPlacingOrder = true;

    const items: OrderItem[] = this.cartService.currentItems.map(item => ({
      product: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image
    }));

    const payload: CreateOrderPayload = {
      items,
      shippingAddress: this.shippingForm.value,
      totalPrice: this.cartService.currentTotals.total
    };

    this.orderService.createOrder(payload).subscribe({
      next: (order) => {
        this.isPlacingOrder = false;
        this.cartService.clear();
        this.router.navigate(['/checkout/success', order._id]);
      },
      error: () => {
        this.isPlacingOrder = false;
        this.errorMessage = 'We could not place your order. Please try again.';
      }
    });
  }
}
