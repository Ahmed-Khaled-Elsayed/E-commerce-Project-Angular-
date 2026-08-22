import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AUTH_API } from '../env';
import { AuthResponse, LoginPayload, RegisterPayload } from '../../shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = AUTH_API;

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, payload);
  }

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/InsertUserS`, payload);
  }

  updateProfile(payload: { name: string; email: string; password: string; newPassword?: string }): Observable<AuthResponse> {
    return this.http.patch<AuthResponse>(`${this.baseUrl}/profile`, payload);
  }
}
