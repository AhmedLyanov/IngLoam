import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { ApiService } from '../service/service.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  username: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.apiService.getProfile().subscribe({
        next: (data) => {
          this.username = data.profile.username;
          this.isAuthenticated = true;
        },
        error: () => {
          this.isAuthenticated = false;
        }
      });
    }
  }
}
