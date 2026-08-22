import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  { path: 'products', loadChildren: () => import('./features/products/products.module').then(m => m.ProductsModule) },
  {
    path: 'cart',
    loadChildren: () => import('./features/cart/cart.module').then(m => m.CartModule),
    canActivate: [authGuard]
  },
  {
    path: 'checkout',
    loadChildren: () => import('./features/checkout/checkout.module').then(m => m.CheckoutModule),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
    canActivate: [adminGuard]
  },
  // Content Pages
  { path: 'about', loadComponent: () => import('./features/content-page/content-page.component').then(m => m.ContentPageComponent) },
  { path: 'careers', loadComponent: () => import('./features/content-page/content-page.component').then(m => m.ContentPageComponent) },
  { path: 'store-locator', loadComponent: () => import('./features/content-page/content-page.component').then(m => m.ContentPageComponent) },
  { path: 'blog', loadComponent: () => import('./features/content-page/content-page.component').then(m => m.ContentPageComponent) },
  { path: 'help-center', loadComponent: () => import('./features/content-page/content-page.component').then(m => m.ContentPageComponent) },
  { path: 'returns', loadComponent: () => import('./features/content-page/content-page.component').then(m => m.ContentPageComponent) },
  { path: 'track-order', loadComponent: () => import('./features/content-page/content-page.component').then(m => m.ContentPageComponent) },
  { path: 'contact', loadComponent: () => import('./features/content-page/content-page.component').then(m => m.ContentPageComponent) },
  { path: 'privacy-policy', loadComponent: () => import('./features/content-page/content-page.component').then(m => m.ContentPageComponent) },
  { path: 'terms-of-service', loadComponent: () => import('./features/content-page/content-page.component').then(m => m.ContentPageComponent) },
  { path: '**', redirectTo: '' }
];