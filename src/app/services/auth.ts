import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private loginStatus = new BehaviorSubject<boolean>(this.isLoggedIn());
  // 1. Add a reactive stream tracking the current user role string
  private roleStatus = new BehaviorSubject<string>(this.getUserRole());

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if (res && res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role);
          localStorage.setItem('email', res.email);
          
          // 2. Broadcast BOTH values to all components simultaneously
          this.roleStatus.next(res.role);
          this.loginStatus.next(true);
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getLoginStatus(): Observable<boolean> {
    return this.loginStatus.asObservable();
  }

  // 3. Add an explicit observer getter for the role stream
  getRoleStatus(): Observable<string> {
    return this.roleStatus.asObservable();
  }

  getUserRole(): string {
    return localStorage.getItem('role') || '';
  }

  logout() {
    localStorage.clear();
    this.roleStatus.next(''); // Clear the stream data
    this.loginStatus.next(false);
    this.router.navigate(['/login']);
  }
}