import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/service.service';
import { RouterLink, Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  username: string | null = null;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.apiService.username$.subscribe(name => {
      this.username = name;
    });
  }

  get isAuthenticated(): boolean {
    return !!this.username;
  }
dropdownOpen = false;

toggleDropdown() {
  this.dropdownOpen = !this.dropdownOpen;
}

navigateTo(path: string) {
  this.router.navigate([path]);
  this.dropdownOpen = false;
}

  logout() {
    this.apiService.logout();
  }
}
