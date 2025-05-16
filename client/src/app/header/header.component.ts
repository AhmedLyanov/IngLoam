import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../service/service.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, RouterLink, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  username: string | null = null;
  avatarUrl: string | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.apiService.username$.subscribe((name) => {
      this.username = name;
    });

    this.apiService.avatar$.subscribe((url) => {
      this.avatarUrl = url;
    });
  }

  get isAuthenticated(): boolean {
    return !!this.username;
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.apiService.logout();
  }

  onAvatarClick(event: MouseEvent) {
    event.stopPropagation();
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.apiService.uploadAvatar(input.files[0]).subscribe({
        next: () => {
  
        },
        error: () => {
          alert('Ошибка загрузки аватара');
        },
      });
    }
  }
}
