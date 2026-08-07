import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ORDERS_API } from '../env';
import { Order, OrderStatus } from '../../shared/interfaces/order.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly ordersUrl = ORDERS_API;

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.ordersUrl);
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Observable<Order> {
    return this.http.patch<Order>(`${this.ordersUrl}/${orderId}/status`, { status });
  }
}
