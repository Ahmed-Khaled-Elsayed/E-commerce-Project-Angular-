import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutComponent } from './checkout.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { OrderHistoryComponent } from './order-history/order-history.component';

const routes: Routes = [
  { path: '', component: CheckoutComponent },
  { path: 'success/:orderId', component: OrderSuccessComponent },
  { path: 'orders', component: OrderHistoryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutRoutingModule { }
