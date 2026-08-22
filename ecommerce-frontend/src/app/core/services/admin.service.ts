import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ORDERS_API, PRODUCTS_API } from '../env';
import { Order, OrderStatus } from '../../shared/interfaces/order.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly ordersUrl = ORDERS_API;

  getAllOrders(): Observable<Order[]> {
    return this.http.get<any[]>(`${this.ordersUrl}/customersOrders`).pipe(
      map(orders => orders.map(order => this.toOrder(order)))
    );
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Observable<Order> {
    return this.http.patch<{ data?: any }>(`${PRODUCTS_API}/order/${orderId}`, {
      status: status.toLowerCase()
    }).pipe(map(response => this.toOrder(response.data ?? {})));
  }

  private toOrder(raw: any): Order {
    return {
      _id: String(raw.id),
      user: {
        _id: String(raw.email ?? raw.id),
        name: raw.name ?? 'Unknown',
        email: raw.email ?? ''
      },
      items: (raw.products ?? []).map((item: any) => ({
        product: String(item.id), name: item.name ?? item.title ?? '',
        price: Number(item.price) || 0, quantity: Number(item.quantity) || 0,
        image: item.image ?? ''
      })),
      shippingAddress: { fullName: raw.name ?? '', address: '', city: '', postalCode: '', country: '' },
      totalPrice: (raw.products ?? []).reduce((total: number, item: any) =>
        total + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0),
      status: this.toStatus(raw.status), createdAt: raw.createdAt, updatedAt: raw.updatedAt
    };
  }

  private toStatus(status: string): OrderStatus {
    return (status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Pending') as OrderStatus;
  }
}
