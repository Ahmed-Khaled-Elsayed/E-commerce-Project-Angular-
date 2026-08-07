import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { Order, OrderStatus } from '../../../shared/interfaces/order.interface';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  orders: Order[] = [];
  filteredOrders: Order[] = [];
  isLoading = true;
  activeFilter: string = 'All';
  updatingOrderId: string | null = null;

  readonly statuses: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  readonly filterOptions = ['All', ...['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']];

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.adminService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    if (this.activeFilter === 'All') {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(o => o.status === this.activeFilter);
    }
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
    this.applyFilter();
  }

  updateStatus(orderId: string, newStatus: OrderStatus): void {
    this.updatingOrderId = orderId;
    this.adminService.updateOrderStatus(orderId, newStatus).subscribe({
      next: (updatedOrder) => {
        const index = this.orders.findIndex(o => o._id === orderId);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
        }
        this.applyFilter();
        this.updatingOrderId = null;
      },
      error: () => {
        this.updatingOrderId = null;
      }
    });
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

  getFilterCount(filter: string): number {
    if (filter === 'All') return this.orders.length;
    return this.orders.filter(o => o.status === filter).length;
  }

  getOrderItemsSummary(order: Order): string {
    if (order.items.length === 1) return order.items[0].name;
    return `${order.items[0].name} + ${order.items.length - 1} more`;
  }
}
