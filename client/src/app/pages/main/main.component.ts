import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../service/service.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  posts: any[] = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.apiService.getPosts().subscribe({
      next: (data) => {
        this.posts = data.posts;
      },
      error: (err) => {
        console.error('Error fetching posts:', err);
      }
    });
  }

  navigateToCreatePost() {
    this.router.navigate(['/create-post']);
  }
}
