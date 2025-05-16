import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000';

  private currentUsername = new BehaviorSubject<string | null>(null);
  username$ = this.currentUsername.asObservable();

  private currentAvatar = new BehaviorSubject<string | null>(null);
  avatar$ = this.currentAvatar.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('token');
    if (token) {
      this.getProfile().subscribe({
        next: (data) => {
          this.currentUsername.next(data.profile.username);
          this.currentAvatar.next(data.profile.avatar || null);
        },
        error: () => {
          this.currentUsername.next(null);
          this.currentAvatar.next(null);
        },
      });
    }
  }

  register(userData: {
    name: string;
    surname: string;
    username: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: {
    username: string;
    password: string;
  }): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token);
          this.getProfile().subscribe({
            next: (data) => {
              this.currentUsername.next(data.profile.username);
              this.currentAvatar.next(data.profile.avatar || null);
            },
            error: () => {
              this.currentUsername.next(null);
              this.currentAvatar.next(null);
            },
          });
        })
      );
  }

  getProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(`${this.apiUrl}/profile`, { headers });
  }

  uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);

    const token = localStorage.getItem('token');
    return this.http
      .post<{ avatar: string }>(
        `${this.apiUrl}/upload-avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .pipe(
        tap((response) => {
          this.currentAvatar.next(response.avatar);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUsername.next(null);
    this.currentAvatar.next(null);
    this.router.navigate(['/login']);
  }
}
