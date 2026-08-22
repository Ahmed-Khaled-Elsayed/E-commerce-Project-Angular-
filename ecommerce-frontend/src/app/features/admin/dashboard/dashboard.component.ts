import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { AdminService } from '../../../core/services/admin.service';
import { Product } from '../../../shared/interfaces/product.interface';
import { Order } from '../../../shared/interfaces/order.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly adminService = inject(AdminService);

  products: Product[] = [];
  orders: Order[] = [];
  isLoading = true;

  get totalProducts(): number {
    return this.products.length;
  }

  get totalOrders(): number {
    return this.orders.length;
  }

  get totalRevenue(): number {
    return this.orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.totalPrice, 0);
  }

  get pendingOrders(): number {
    return this.orders.filter(o => o.status === 'Pending').length;
  }

  get recentOrders(): Order[] {
    return this.orders.slice(0, 5);
  }

  get lowStockProducts(): Product[] {
    return this.products.filter(p => p.quantity <= 10).slice(0, 5);
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.isLoading = true;

    this.productService.getAll({ limit: 200 }).subscribe({
      next: (products) => {
        this.products = products;
        this.checkLoaded();
      },
      error: () => this.checkLoaded()
    });

    this.adminService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.checkLoaded();
      },
      error: () => this.checkLoaded()
    });
  }

  private loadCount = 0;
  private checkLoaded(): void {
    this.loadCount++;
    if (this.loadCount >= 2) {
      this.isLoading = false;
    }
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'Pending': 'badge-pending',
      'Processing': 'badge-processing',
      'Shipped': 'badge-shipped',
      'Delivered': 'badge-delivered',
      'Cancelled': 'badge-cancelled'
    };
    return classes[status] || '';
  }
}
