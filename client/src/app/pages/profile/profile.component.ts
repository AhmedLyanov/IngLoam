import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../service/service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  name: string | null = null;
  surname: string | null = null;
  username: string | null = null;
  errorMessage: string = '';

  constructor(private apiService: ApiService, private router: Router) {}


  ngOnInit(): void {
    if(!localStorage.getItem("token")){
      this.router.navigate(['/login']);
    }
    this.apiService.getProfile().subscribe({
      next: (response) => {
        this.name = response.profile.name;
        this.surname = response.profile.surname;
        this.username = response.profile.username;
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Вы не авторизованы или токен недействителен';
      }
    });
  }
}
