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
  currentUsername: string | null = null;
  openMenuId: string | null = null;

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

    this.apiService.username$.subscribe(username => {
      this.currentUsername = username;
    });
  }

  navigateToCreatePost() {
    this.router.navigate(['/post']);
  }

  navigateToPost(postId: string) {
    this.router.navigate(['/posts', postId]);
  }

  toggleMenu(postId: string) {
    this.openMenuId = this.openMenuId === postId ? null : postId;
  }

  editPost(postId: string) {
    this.router.navigate(['/post', postId]);
    this.openMenuId = null;
  }

  deletePost(postId: string) {
    if (confirm('Вы уверены, что хотите удалить этот пост?')) {
      this.apiService.deletePost(postId).subscribe({
        next: () => {
          this.posts = this.posts.filter(post => post._id !== postId);
          this.openMenuId = null;
        },
        error: (err) => {
          console.error('Error deleting post:', err);
          if (err.status === 404) {
            alert('Пост не найден');
          } else if (err.status === 403) {
            alert('Вы не можете удалить этот пост');
          } else {
            alert('Ошибка при удалении поста');
          }
        }
      });
    }
  }
}
