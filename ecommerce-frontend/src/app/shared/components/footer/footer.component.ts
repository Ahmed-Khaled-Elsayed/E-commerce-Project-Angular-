import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  template: `
    <footer class="bg-[var(--color-surface-secondary)] pt-16 pb-8 border-t border-[var(--color-outline)] relative overflow-hidden">
      <!-- Decorative background accent -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)] opacity-5 rounded-bl-full pointer-events-none"></div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <!-- Brand -->
          <div>
            <h3 class="text-[var(--color-primary)] font-bold text-3xl mb-4 tracking-tight">ShopEase</h3>
            <p class="text-[var(--color-on-surface-variant)] mb-6 text-sm leading-relaxed">
              Elevating your everyday style with curated collections of premium electronics and accessories.
            </p>
            <div class="flex space-x-3 text-[var(--color-on-surface-variant)]">
              <a href="javascript:void(0)" class="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-[var(--color-outline)] hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] hover:-translate-y-1 transition-all duration-300"><span class="material-symbols-outlined text-[20px]">public</span></a>
              <a href="javascript:void(0)" class="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-[var(--color-outline)] hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] hover:-translate-y-1 transition-all duration-300"><span class="material-symbols-outlined text-[20px]">share</span></a>
              <a href="javascript:void(0)" class="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-[var(--color-outline)] hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] hover:-translate-y-1 transition-all duration-300"><span class="material-symbols-outlined text-[20px]">forum</span></a>
            </div>
          </div>

          <!-- Company -->
          <div>
            <h4 class="font-bold text-[var(--color-on-background)] text-lg mb-6 tracking-wide">Company</h4>
            <ul class="space-y-4 text-sm text-[var(--color-on-surface-variant)]">
              <li><a routerLink="/about" class="group flex items-center hover:text-[var(--color-primary)] transition-colors"><span class="material-symbols-outlined text-[16px] mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[var(--color-primary)]">chevron_right</span>About Us</a></li>
              <li><a routerLink="/careers" class="group flex items-center hover:text-[var(--color-primary)] transition-colors"><span class="material-symbols-outlined text-[16px] mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[var(--color-primary)]">chevron_right</span>Careers</a></li>
              <li><a routerLink="/store-locator" class="group flex items-center hover:text-[var(--color-primary)] transition-colors"><span class="material-symbols-outlined text-[16px] mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[var(--color-primary)]">chevron_right</span>Store Locator</a></li>
              <li><a routerLink="/blog" class="group flex items-center hover:text-[var(--color-primary)] transition-colors"><span class="material-symbols-outlined text-[16px] mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[var(--color-primary)]">chevron_right</span>Blog</a></li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h4 class="font-bold text-[var(--color-on-background)] text-lg mb-6 tracking-wide">Support</h4>
            <ul class="space-y-4 text-sm text-[var(--color-on-surface-variant)]">
              <li><a routerLink="/help-center" class="group flex items-center hover:text-[var(--color-primary)] transition-colors"><span class="material-symbols-outlined text-[16px] mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[var(--color-primary)]">chevron_right</span>Help Center</a></li>
              <li><a routerLink="/returns" class="group flex items-center hover:text-[var(--color-primary)] transition-colors"><span class="material-symbols-outlined text-[16px] mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[var(--color-primary)]">chevron_right</span>Returns & Refunds</a></li>
              <li><a routerLink="/track-order" class="group flex items-center hover:text-[var(--color-primary)] transition-colors"><span class="material-symbols-outlined text-[16px] mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[var(--color-primary)]">chevron_right</span>Track Order</a></li>
              <li><a routerLink="/contact" class="group flex items-center hover:text-[var(--color-primary)] transition-colors"><span class="material-symbols-outlined text-[16px] mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[var(--color-primary)]">chevron_right</span>Contact Us</a></li>
            </ul>
          </div>

          <!-- Newsletter -->
          <div>
            <h4 class="font-bold text-[var(--color-on-background)] text-lg mb-6 tracking-wide">Newsletter</h4>
            <p class="text-sm text-[var(--color-on-surface-variant)] mb-5 leading-relaxed">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <form class="flex items-center shadow-sm" (submit)="onSubmit(emailInput); $event.preventDefault()">
              <input #emailInput type="email" required placeholder="Enter your email" class="w-full px-4 py-3 rounded-l-lg border border-[var(--color-outline)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all bg-white text-sm">
              <button type="submit" class="bg-[var(--color-primary)] text-white px-5 py-3 rounded-r-lg border border-[var(--color-primary)] hover:bg-[var(--color-success)] hover:border-[var(--color-success)] transition-all duration-300 flex items-center justify-center">
                <span class="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">send</span>
              </button>
            </form>
          </div>
        </div>

        <!-- Copyright -->
        <div class="border-t border-[var(--color-outline)] pt-8 flex flex-col md:flex-row justify-between items-center">
          <p class="text-sm text-[var(--color-on-surface-variant)] mb-4 md:mb-0">
            &copy; 2024 ShopEase. All rights reserved.
          </p>
          <div class="flex space-x-6 text-sm text-[var(--color-on-surface-variant)]">
            <a routerLink="/privacy-policy" class="hover:text-[var(--color-primary)] transition-colors">Privacy Policy</a>
            <a routerLink="/terms-of-service" class="hover:text-[var(--color-primary)] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  constructor(private toastr: ToastrService) {}

  onSubmit(inputElement: HTMLInputElement) {
    const email = inputElement.value;
    if (email && email.includes('@')) {
      this.toastr.success('You have successfully subscribed to our newsletter!', 'Subscribed!');
      inputElement.value = ''; // Clear the input field
    } else {
      this.toastr.error('Please enter a valid email address.', 'Invalid Email');
    }
  }
}
