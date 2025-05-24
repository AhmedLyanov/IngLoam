import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

export interface Profile {
  name: string;
  surname: string;
  username: string;
  avatar: string | null;
  resume: {
    education: { institution: string; degree: string; startYear: string; endYear: string }[];
    experience: { company: string; position: string; startDate: string; endDate: string; description: string }[];
    skills: string[];
  };
}

export interface UpdateResumeResponse {
  message: string;
  resume: Profile['resume'];
}

export interface CodeSnippet {
  language: string;
  code: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000';
  private currentUsername = new BehaviorSubject<string | null>(null);
  username$ = this.currentUsername.asObservable();
  private currentAvatar = new BehaviorSubject<string | null>(null);
  avatar$ = this.currentAvatar.asObservable();
  private currentResume = new BehaviorSubject<Profile['resume'] | null>(null);
  resume$ = this.currentResume.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('token');
    if (token) {
      this.getProfile().subscribe({
        next: (data) => {
          this.currentUsername.next(data.profile.username);
          this.currentAvatar.next(data.profile.avatar || null);
          this.currentResume.next(data.profile.resume || null);
        },
        error: () => {
          this.currentUsername.next(null);
          this.currentAvatar.next(null);
          this.currentResume.next(null);
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
              this.currentResume.next(data.profile.resume || null);
            },
            error: () => {
              this.currentUsername.next(null);
              this.currentAvatar.next(null);
              this.currentResume.next(null);
            },
          });
        })
      );
  }

  getProfile(): Observable<{ message: string; profile: Profile }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<{ message: string; profile: Profile }>(`${this.apiUrl}/profile`, { headers });
  }

  uploadAvatar(file: File): Observable<{ avatar: string }> {
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

  updateResume(resume: Profile['resume']): Observable<UpdateResumeResponse> {
    const token = localStorage.getItem('token');
    return this.http
      .post<UpdateResumeResponse>(
        `${this.apiUrl}/update-resume`,
        resume,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .pipe(
        tap((response) => {
          this.currentResume.next(response.resume);
        })
      );
  }

  deleteResume(): Observable<{ message: string }> {
    const token = localStorage.getItem('token');
    return this.http
      .delete<{ message: string }>(`${this.apiUrl}/delete-resume`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        tap(() => {
          this.currentResume.next({ education: [], experience: [], skills: [] });
        })
      );
  }

  createPost(postData: { title: string; content: string; tags: string; images?: File[]; codeSnippets?: CodeSnippet[] }): Observable<any> {
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('content', postData.content);
    formData.append('tags', postData.tags);
    if (postData.images) {
      postData.images.forEach((image, index) => {
        formData.append('images', image);
      });
    }
    if (postData.codeSnippets) {
      formData.append('codeSnippets', JSON.stringify(postData.codeSnippets));
    }
    const token = localStorage.getItem('token');
    return this.http.post(`${this.apiUrl}/posts`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getPosts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts`);
  }

  getPost(postId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts/${postId}`);
  }

  updatePost(postId: string, postData: { title: string; content: string; tags: string; images?: File[] | string[]; codeSnippets?: CodeSnippet[] }): Observable<any> {
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('content', postData.content);
    formData.append('tags', postData.tags);
    if (postData.images) {
      if (typeof postData.images[0] === 'string') {
        formData.append('images', JSON.stringify(postData.images));
      } else {
        (postData.images as File[]).forEach((image, index) => {
          formData.append('images', image);
        });
      }
    }
    if (postData.codeSnippets) {
      formData.append('codeSnippets', JSON.stringify(postData.codeSnippets));
    }
    const token = localStorage.getItem('token');
    return this.http.put(`${this.apiUrl}/posts/${postId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  deletePost(postId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(`${this.apiUrl}/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  addComment(postId: string, content: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(`${this.apiUrl}/posts/${postId}/comments`, { content }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUsername.next(null);
    this.currentAvatar.next(null);
    this.currentResume.next(null);
    this.router.navigate(['/login']);
  }
}
