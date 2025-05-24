import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../service/service.service';
import { MarkdownPipe } from '../../pipes/markdown.pipe';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownPipe],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  post: any = null;
  currentUsername: string | null = null;
  openMenuId: string | null = null;
  newComment: string = '';
  isCodeSidebarOpen: boolean = false;
  selectedCodeSnippet: { code: string; language: string } | null = null;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.apiService.getPost(postId).subscribe({
        next: (data) => {
          this.post = data.post;
        },
        error: (err) => {
          console.error('Error fetching post:', err);
          if (err.status === 404) {
            alert('Пост не найден');
            this.router.navigate(['/']);
          } else {
            alert('Ошибка при загрузке поста');
          }
        }
      });
    }

    this.apiService.username$.subscribe(username => {
      this.currentUsername = username;
    });
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
          alert('Пост успешно удалён');
          this.router.navigate(['/home']);
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

  addComment() {
    if (this.newComment && this.post) {
      this.apiService.addComment(this.post._id, this.newComment).subscribe({
        next: (data) => {
          this.post = data.post;
          this.newComment = '';
        },
        error: (err) => {
          console.error('Error adding comment:', err);
          alert('Ошибка при добавлении комментария');
        }
      });
    }
  }

  openCodeSidebar(snippet: { code: string; language: string }) {
    this.selectedCodeSnippet = snippet;
    this.isCodeSidebarOpen = true;
  }

  closeCodeSidebar() {
    this.isCodeSidebarOpen = false;
    this.selectedCodeSnippet = null;
  }
}
