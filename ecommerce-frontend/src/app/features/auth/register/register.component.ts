import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  isLoading = false;
  errorMessage: string | null = null;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordsMatchValidator
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  get nameControl(): AbstractControl | null {
    return this.registerForm.get('name');
  }

  get emailControl(): AbstractControl | null {
    return this.registerForm.get('email');
  }

  get passwordControl(): AbstractControl | null {
    return this.registerForm.get('password');
  }

  get confirmPasswordControl(): AbstractControl | null {
    return this.registerForm.get('confirmPassword');
  }

  private passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = null;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { confirmPassword, ...payload } = this.registerForm.value;

    this.authService.register(payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        localStorage.setItem('authToken', response.token ?? '');
        localStorage.setItem('user', JSON.stringify(response.user ?? {}));
        this.router.navigate(['/products']);
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Registration failed. Please try again in a moment.';
      }
    });
  }

  getFieldError(control: AbstractControl | null, fieldName: string): string | null {
    if (!control) {
      return null;
    }

    if (control.touched && control.invalid && control.errors) {
      if (control.errors['required']) {
        return `${fieldName} is required.`;
      }

      if (control.errors['email']) {
        return 'Please enter a valid email address.';
      }

      if (control.errors['minlength']) {
        return `${fieldName} must be at least ${control.errors['minlength'].requiredLength} characters.`;
      }
    }

    return null;
  }

  getConfirmPasswordError(): string | null {
    if (this.confirmPasswordControl?.touched && this.confirmPasswordControl?.errors?.['required']) {
      return 'Please confirm your password.';
    }

    if (this.confirmPasswordControl?.touched && this.registerForm.hasError('passwordMismatch')) {
      return 'Passwords do not match.';
    }

    return null;
  }
}
