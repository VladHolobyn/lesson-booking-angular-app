import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {AuthResponse} from '../models/auth/auth-response.interface';
import {User} from '../models/auth/user.interface';
import {LoginRequest} from '../models/auth/login-request';
import {RegisterRequest} from '../models/auth/register-request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user?: User;
  constructor(private http: HttpClient) { }

  register(userData: RegisterRequest) {
    return this.http.post(`api/auth/register`, userData);
  }

  login(data: LoginRequest){
    return new Observable<void>((observer) => {
      this.http.post<AuthResponse>(`api/auth/login`, data).subscribe({
        next: (response) => {
          this.user = response.user;
          observer.next();
          observer.complete()
        },
        error: () => observer.error()
      });
    })
  }

  getCurrentUser(): User | undefined {
    return this.user;
  }

  logout = () => {
    this.user = undefined;
  }
}
