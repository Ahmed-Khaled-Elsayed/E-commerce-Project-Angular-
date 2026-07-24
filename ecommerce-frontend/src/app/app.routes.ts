import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  { path: 'products', loadChildren: () => import('./features/products/products.module').then(m => m.ProductsModule) },
  { path: 'cart', loadChildren: () => import('./features/cart/cart.module').then(m => m.CartModule) },
  { path: 'checkout', loadChildren: () => import('./features/checkout/checkout.module').then(m => m.CheckoutModule) },
  { path: 'admin', loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule) },
  { path: '', redirectTo: 'products', pathMatch: 'full' }, 
  { path: '**', redirectTo: 'products' } 
];