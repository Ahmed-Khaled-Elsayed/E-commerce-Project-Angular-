import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  template: `
    <div class="relative bg-gray-900 h-[600px] flex items-center">
      <!-- Background Image -->
      <div class="absolute inset-0 z-0">
        <img src="assets/hero-bg.jpg?v=3" 
             alt="Hero lifestyle"
             class="w-full h-full object-cover opacity-50">
      </div>
      
      <!-- Content -->
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div class="max-w-2xl">
          <span class="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-semibold mb-6 border border-white/20 shadow-[0_4px_12px_rgba(26,156,109,0.3)]">
            <span class="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-success)] bg-clip-text text-transparent">
              NEW ARRIVAL 2024
            </span>
          </span>
          <h1 class="text-[var(--text-display-lg-mobile)] md:text-[var(--text-display-lg)] font-bold text-white mb-6">
            Elevate Your Everyday Style
          </h1>
          <p class="text-lg md:text-xl text-gray-300 mb-8">
            Discover our handpicked collection of premium electronics and accessories designed to seamlessly integrate into your life.
          </p>
          <button class="bg-[var(--color-primary)] hover:bg-[var(--color-success)] text-white font-bold py-4 px-8 rounded-full transition-all hover:shadow-[0_0_20px_rgba(26,156,109,0.4)] flex items-center space-x-2">
            <span>Shop Now</span>
            <span class="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class HeroComponent {}
