import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../service/service.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  post = {
    title: '',
    content: '',
    tags: '',
    image: undefined as File | undefined
  };

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    // Check if user is authenticated
    this.apiService.username$.subscribe(username => {
      if (!username) {
        // No logged-in user, redirect to login
        this.router.navigate(['/login']);
      }
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.post.image = event.target.files[0];
    }
  }

  createPost() {
    this.apiService.createPost(this.post).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error creating post:', err);
      }
    });
  }
}
