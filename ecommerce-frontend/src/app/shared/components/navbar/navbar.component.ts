import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, AsyncPipe, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private readonly router = inject(Router);
  readonly cartService = inject(CartService);
  readonly totals = this.cartService.totals;
  readonly isAdmin = this.readRole() === 'admin';
  isProfileMenuOpen = false;

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isProfileMenuOpen = false;
    this.router.navigate(['/auth/login']);
  }

  private readRole(): string {
    try {
      const token = localStorage.getItem('token') || '';
      return token.split('.')[1] ? JSON.parse(atob(token.split('.')[1])).role || '' : '';
    } catch {
      return '';
    }
  }
}
