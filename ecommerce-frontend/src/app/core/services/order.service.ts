import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ORDERS_API } from '../env';
import { CreateOrderPayload, Order } from '../../shared/interfaces/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = ORDERS_API;

  createOrder(payload: CreateOrderPayload): Observable<Order> {
    return this.http.post<Order>(this.baseUrl, payload);
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/mine`);
  }

  getOrderById(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${orderId}`);
  }
}
