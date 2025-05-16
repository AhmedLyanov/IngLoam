import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../service/service.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  name: string | null = null;
  surname: string | null = null;
  username: string | null = null;
  avatarUrl: string | null = null;
  errorMessage: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    if (!localStorage.getItem("token")) {
      this.router.navigate(['/login']);
      return;
    }


    this.apiService.getProfile().subscribe({
      next: (response) => {
        this.name = response.profile.name;
        this.surname = response.profile.surname;
        this.username = response.profile.username;
        this.avatarUrl = response.profile.avatar ? this.addCacheBuster(response.profile.avatar) : null;
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Вы не авторизованы или токен недействителен';
      }
    });


    this.apiService.avatar$.subscribe(url => {
      if (url) {
        this.avatarUrl = this.addCacheBuster(url);
      }
    });
  }

  logout() {
    this.apiService.logout();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      this.apiService.uploadAvatar(file).subscribe({
        next: (response) => {

        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Ошибка загрузки аватара';
        }
      });
    }
  }

  private addCacheBuster(url: string): string {
    return url + '?t=' + new Date().getTime();
  }
}
