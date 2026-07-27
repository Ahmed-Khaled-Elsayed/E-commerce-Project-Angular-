import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Promo } from '../../../../core/services/home.service';

@Component({
  selector: 'app-promo-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="promo" class="bg-[var(--color-navy)] py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <!-- Text content -->
          <div class="md:w-1/2 mb-10 md:mb-0">
            <h2 class="text-[var(--text-display-lg-mobile)] md:text-4xl font-bold text-white mb-4">
              {{ promo.title }}
            </h2>
            <p class="text-gray-400 text-lg mb-8">
              Get up to {{ promo.discountPercentage }}% off on selected items. Limited time offer!
            </p>
            
            <div class="flex flex-wrap items-center gap-6">
              <button class="bg-[var(--color-primary)] hover:bg-opacity-90 text-white font-bold py-3 px-8 rounded-full transition-all">
                Shop the Sale
              </button>
              
              <!-- Countdown -->
              <div class="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                <span class="material-symbols-outlined text-[var(--color-primary)]">timer</span>
                <span class="text-white font-mono font-medium">
                  {{ days }}d {{ hours }}h {{ minutes }}m {{ seconds }}s
                </span>
              </div>
            </div>
          </div>
          
          <!-- Image with Glow -->
          <div class="md:w-5/12 relative">
            <div class="absolute inset-0 bg-[var(--color-primary)] rounded-full blur-[80px] opacity-30"></div>
            <img [src]="promo.image" alt="Promo" class="relative z-10 w-full h-auto object-cover rounded-2xl shadow-2xl">
          </div>
        </div>
      </div>
    </div>
  `
})
export class PromoBannerComponent implements OnInit, OnDestroy, OnChanges {
  @Input() promo: Promo | null = null;
  
  days = 0; hours = 0; minutes = 0; seconds = 0;
  private timer: any;

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['promo'] && changes['promo'].currentValue) {
      if (this.timer) clearInterval(this.timer);
      this.updateCountdown();
      this.timer = setInterval(() => this.updateCountdown(), 1000);
    }
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  private updateCountdown() {
    if (!this.promo) return;
    const end = new Date(this.promo.endDate).getTime();
    const now = new Date().getTime();
    const diff = end - now;
    
    if (diff > 0) {
      this.days = Math.floor(diff / (1000 * 60 * 60 * 24));
      this.hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((diff % (1000 * 60)) / 1000);
    }
  }
}
