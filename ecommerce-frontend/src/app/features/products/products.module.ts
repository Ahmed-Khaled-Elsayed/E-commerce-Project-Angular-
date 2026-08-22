import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductCatalogComponent } from './product-catalog.component';
import { ProductDetailsComponent } from './product-details.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ProductsRoutingModule
  ]
})
export class ProductsModule { }
