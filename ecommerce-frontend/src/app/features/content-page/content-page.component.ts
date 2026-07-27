import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-content-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-[var(--color-surface)] py-16 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-16 animate-fade-in-up">
          <span class="inline-block px-4 py-1.5 rounded-full bg-green-50 text-[var(--color-primary)] text-sm font-bold tracking-wider uppercase mb-6 shadow-sm border border-green-100">
            Information
          </span>
          <h1 class="text-4xl md:text-5xl font-extrabold text-[#1E2A3A] tracking-tight mb-6">
            {{ title }}
          </h1>
          <div class="w-24 h-1 bg-gradient-to-r from-[var(--color-primary)] to-emerald-400 mx-auto rounded-full"></div>
        </div>

        <!-- Content Area -->
        <div class="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[var(--color-outline)] animate-fade-in-up" style="animation-delay: 100ms;">
          <div class="prose prose-lg max-w-none text-[#6B7280] leading-relaxed space-y-6">
            <p *ngIf="content" [innerHTML]="content"></p>
            
            <p *ngIf="!content">
              This is a placeholder page for <strong>{{ title }}</strong>. 
              The actual content for this section will be drafted and published by the content management team shortly.
            </p>
            <p *ngIf="!content">
              At ShopEase, we are dedicated to providing the best possible shopping experience. We are currently updating our informational pages to bring you the most accurate and up-to-date details. 
            </p>
            <p *ngIf="!content">
              Please check back later for full details. If you need immediate assistance, please feel free to reach out to our support team directly.
            </p>
          </div>
        </div>
        
        <!-- Back Button -->
        <div class="mt-12 text-center">
          <a href="javascript:history.back()" class="inline-flex items-center text-[var(--color-primary)] font-medium hover:text-[var(--color-success)] transition-colors">
            <span class="material-symbols-outlined mr-2">arrow_back</span>
            Return to Previous Page
          </a>
        </div>
      </div>
    </div>
  `
})
export class ContentPageComponent implements OnInit {
  private route = inject(ActivatedRoute);

  title = 'Page Not Found';
  content = '';

  private readonly pageData: Record<string, { title: string; content?: string }> = {
    'about': { 
      title: 'About Us',
      content: `
        <h3>Our Story</h3>
        <p>Founded with a passion for bringing the best electronics and gadgets directly to you, ShopEase has grown from a small startup to a leading eCommerce platform. Our mission is to make premium technology accessible, affordable, and seamlessly integrated into your lifestyle.</p>
        <p>We source only the highest quality accessories and smart home devices, ensuring every product meets our rigorous standards. At ShopEase, we don't just sell products; we deliver experiences.</p>
      `
    },
    'careers': { 
      title: 'Careers',
      content: `
        <h3>Join the ShopEase Team</h3>
        <p>We are always on the lookout for passionate, innovative, and driven individuals to join our growing family. Whether you're an expert in supply chain logistics, a customer service champion, or a brilliant software engineer, there's a place for you here.</p>
        <ul class="list-disc pl-5 mt-4 space-y-2">
          <li><strong>Frontend Developer:</strong> Help us build the ultimate user experience.</li>
          <li><strong>Customer Success Specialist:</strong> Be the friendly face of our brand.</li>
          <li><strong>Product Manager:</strong> Lead the charge in sourcing next-gen electronics.</li>
        </ul>
        <p class="mt-4">Send your resume to <strong>careers&#64;shopease.com</strong> to apply!</p>
      `
    },
    'store-locator': { 
      title: 'Store Locator',
      content: `
        <h3>Find Us Near You</h3>
        <p>While ShopEase is primarily an online platform designed to deliver right to your doorstep, we occasionally host pop-up shops and experience centers in major metropolitan areas.</p>
        <p>Currently, we do not have any permanent physical storefronts. All of our premium gadgets and accessories are safely stored in our climate-controlled fulfillment centers across the country, ready to be shipped out the moment you click 'Order'.</p>
      `
    },
    'blog': { 
      title: 'Blog',
      content: `
        <h3>Latest from the ShopEase Blog</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div class="border border-[var(--color-outline)] p-4 rounded-xl">
            <h4 class="font-bold text-[var(--color-primary)]">Top 5 Smart Home Gadgets of 2024</h4>
            <p class="text-sm mt-2 text-gray-500">Transform your living space with these incredible IoT devices that make life just a little bit easier.</p>
          </div>
          <div class="border border-[var(--color-outline)] p-4 rounded-xl">
            <h4 class="font-bold text-[var(--color-primary)]">Why Wireless is the Future</h4>
            <p class="text-sm mt-2 text-gray-500">From headphones to chargers, cutting the cord is no longer a luxury—it's a necessity.</p>
          </div>
        </div>
      `
    },
    'help-center': { 
      title: 'Help Center',
      content: `
        <h3>How Can We Help?</h3>
        <p>If you're having trouble with an order, a product, or your account, you're in the right place. Our knowledge base is designed to get you answers fast.</p>
        <ul class="list-disc pl-5 mt-4 space-y-2">
          <li><strong>Shipping FAQs:</strong> Delivery times, tracking numbers, and international shipping.</li>
          <li><strong>Product Setup:</strong> Manuals and video guides for your new electronics.</li>
          <li><strong>Account Issues:</strong> Password resets and payment method updates.</li>
        </ul>
        <p class="mt-4">Can't find what you're looking for? Visit our Contact Us page to speak with a human.</p>
      `
    },
    'returns': { 
      title: 'Returns & Refunds',
      content: `
        <h3>Our 30-Day Guarantee</h3>
        <p>We want you to love your ShopEase purchase. If you're not completely satisfied, you can return any item within 30 days of delivery for a full refund or exchange.</p>
        <h4 class="font-bold mt-4">Return Conditions:</h4>
        <ul class="list-disc pl-5 mt-2 space-y-2">
          <li>Items must be in original condition with all packaging intact.</li>
          <li>Proof of purchase is required.</li>
          <li>Return shipping costs are covered for defective items; otherwise, the customer is responsible for return postage.</li>
        </ul>
      `
    },
    'track-order': { 
      title: 'Track Order',
      content: `
        <h3>Track Your Package</h3>
        <p>Once your order has shipped, you will receive a confirmation email containing your tracking number.</p>
        <div class="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <label class="block text-sm font-medium text-gray-700 mb-2">Order Number</label>
          <div class="flex gap-2">
            <input type="text" placeholder="e.g. ORD-123456" class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-[var(--color-primary)]">
            <button class="bg-[var(--color-primary)] text-white px-6 py-2 rounded-lg font-medium hover:bg-[var(--color-success)] transition-colors">Track</button>
          </div>
          <p class="text-xs text-gray-500 mt-2">*This is a placeholder tracking tool.</p>
        </div>
      `
    },
    'contact': { 
      title: 'Contact Us',
      content: `
        <h3>Get in Touch</h3>
        <p>Have a question or feedback? We'd love to hear from you. Our support team is available Monday through Friday, 9am to 6pm EST.</p>
        <div class="mt-4 space-y-3">
          <p><strong>Email:</strong> support&#64;shopease.com</p>
          <p><strong>Phone:</strong> 0123323212</p>
        </div>
      `
    },
    'privacy-policy': { 
      title: 'Privacy Policy',
      content: `
        <h3>Your Privacy Matters</h3>
        <p>At ShopEase, we take your privacy very seriously. This policy outlines how we collect, use, and protect your personal information.</p>
        <ul class="list-disc pl-5 mt-4 space-y-2">
          <li><strong>Data Collection:</strong> We collect information necessary to process your orders and improve your shopping experience.</li>
          <li><strong>Data Usage:</strong> Your data is used exclusively for fulfilling orders, providing customer support, and, if opted in, sending promotional emails.</li>
          <li><strong>Data Protection:</strong> We use industry-standard encryption to protect your payment details and personal data. We never sell your data to third parties.</li>
        </ul>
      `
    },
    'terms-of-service': { 
      title: 'Terms of Service',
      content: `
        <h3>Terms and Conditions</h3>
        <p>By accessing and using the ShopEase website, you accept and agree to be bound by the terms and provision of this agreement.</p>
        <ul class="list-disc pl-5 mt-4 space-y-2">
          <li><strong>Use of Site:</strong> You may use our site for lawful, non-commercial purposes only.</li>
          <li><strong>Product Descriptions:</strong> We strive for accuracy, but we do not warrant that product descriptions or other content is completely error-free.</li>
          <li><strong>Pricing:</strong> Prices are subject to change without notice. We reserve the right to cancel any orders containing pricing errors.</li>
        </ul>
      `
    }
  };

  ngOnInit() {
    this.route.url.subscribe(urlSegments => {
      if (urlSegments.length > 0) {
        const path = urlSegments[0].path;
        if (this.pageData[path]) {
          this.title = this.pageData[path].title;
          if (this.pageData[path].content) {
            this.content = this.pageData[path].content!;
          }
        } else {
          this.title = 'Content Not Found';
          this.content = 'We could not find the page you are looking for.';
        }
      }
    });
  }
}
