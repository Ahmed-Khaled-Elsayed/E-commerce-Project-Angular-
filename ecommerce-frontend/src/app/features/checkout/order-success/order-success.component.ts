import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../shared/interfaces/order.interface';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-success.component.html',
  styleUrl: './order-success.component.css'
})
export class OrderSuccessComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);

  order: Order | null = null;
  orderId: string | null = null;
  isLoading = true;

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('orderId');

    if (!this.orderId) {
      this.isLoading = false;
      return;
    }

    this.orderService.getOrderById(this.orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
