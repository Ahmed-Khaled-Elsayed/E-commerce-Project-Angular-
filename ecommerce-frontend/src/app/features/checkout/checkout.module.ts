import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { OrderHistoryComponent } from './order-history/order-history.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    CheckoutComponent,
    OrderSuccessComponent,
    OrderHistoryComponent
  ]
})
export class CheckoutModule { }
