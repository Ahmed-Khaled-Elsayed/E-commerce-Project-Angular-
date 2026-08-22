import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { AuthService } from '../../core/services/auth.service';

interface ProfileData { name: string; email: string; role: string; }

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  profile: ProfileData = this.loadProfile();
  isEditing = false;
  isSaving = false;
  successMessage = '';
  errorMessage = '';
  readonly profileForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(4)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    newPassword: ['', Validators.minLength(8)]
  });

  constructor() {
    this.profileForm.patchValue({ name: this.profile.name, email: this.profile.email });
  }

  startEditing(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.profileForm.patchValue({ name: this.profile.name, email: this.profile.email, password: '', newPassword: '' });
    this.isEditing = true;
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.errorMessage = '';
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/auth/login']);
  }

  saveProfile(): void {
    this.successMessage = '';
    this.errorMessage = '';
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      if (this.profileForm.controls.password.hasError('required')) {
        this.errorMessage = 'Please enter your current password before saving changes.';
      } else {
        this.errorMessage = 'Please correct the highlighted fields before saving.';
      }
      return;
    }
    this.isSaving = true;
    this.authService.updateProfile(this.profileForm.getRawValue()).subscribe({
      next: response => {
        const data = response.data;
        const user = data?.user;
        const token = data?.token;
        if (user) this.profile = { ...this.profile, name: user.name || this.profile.name, email: user.email || this.profile.email };
        if (token) localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ name: this.profile.name, email: this.profile.email, role: this.profile.role }));
        this.isEditing = false;
        this.isSaving = false;
        this.successMessage = 'Profile updated successfully.';
      },
      error: error => {
        this.isSaving = false;
        this.errorMessage = error.error?.data?.message || error.error?.message || 'We could not update your profile.';
      }
    });
  }

  private loadProfile(): ProfileData {
    try {
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('token') || '';
      const payload = token.split('.')[1] ? JSON.parse(atob(token.split('.')[1])) : {};
      return {
        name: stored.name || payload.name || 'Account holder',
        email: stored.email || payload.email || 'No email available',
        role: stored.role || payload.role || 'user'
      };
    } catch {
      return { name: 'Account holder', email: 'No email available', role: 'user' };
    }
  }
}
