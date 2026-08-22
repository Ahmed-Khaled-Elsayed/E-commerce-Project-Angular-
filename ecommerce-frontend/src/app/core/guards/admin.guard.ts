import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    return router.createUrlTree(['/auth/login']);
  }

  try {
    // Decode JWT payload (base64) to check role
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role === 'admin') {
      return true;
    }
  } catch (error) {
    console.error('Invalid token format:', error);
    return router.createUrlTree(['/auth/login']); 
  }

  return router.createUrlTree(['/products']);
};
