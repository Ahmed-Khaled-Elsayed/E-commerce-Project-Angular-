import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ORDERS_API, PRODUCTS_API } from '../env';
import { CreateOrderPayload, Order } from '../../shared/interfaces/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = ORDERS_API;

  createOrder(payload: CreateOrderPayload): Observable<Order> {
    const products = payload.items.map(item => ({
      id: Number(item.product), title: item.name, price: item.price,
      image: item.image, quantity: item.quantity, total: item.quantity
    }));
    return this.http.post<unknown>(`${PRODUCTS_API}/order`, products).pipe(
      map(() => ({
        _id: String(Date.now()), items: payload.items,
        shippingAddress: payload.shippingAddress, totalPrice: payload.totalPrice,
        status: 'Pending', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
      }))
    );
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<any>(`${PRODUCTS_API}/lastOrders`).pipe(
      map(response => (Array.isArray(response) ? response : response.data ?? [])
        .map((order: any) => this.toOrder(order)))
    );
  }

  getOrderById(orderId: string): Observable<Order> {
    return this.http.get<any>(`${PRODUCTS_API}/lastOrders/${orderId}`).pipe(
      map(response => this.toOrder(response.data ?? response))
    );
  }

  private toOrder(raw: any): Order {
    const items = (raw.products ?? []).map((item: any) => ({
      product: String(item.id), name: item.name ?? item.title ?? '',
      price: Number(item.price) || 0, quantity: Number(item.quantity) || 0,
      image: item.image ?? ''
    }));
    return {
      _id: String(raw.id), items,
      shippingAddress: { fullName: raw.name ?? '', address: '', city: '', postalCode: '', country: '' },
      totalPrice: items.reduce((total: number, item: any) => total + item.price * item.quantity, 0),
      status: (raw.status ? raw.status.charAt(0).toUpperCase() + raw.status.slice(1) : 'Pending') as Order['status'],
      createdAt: raw.createdAt, updatedAt: raw.updatedAt
    };
  }
}
