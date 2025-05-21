import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../service/service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class PostEditComponent implements OnInit {
  postId: string | null = null;
  post: any = {
    title: '',
    content: '',
    tags: '',
    image: null
  };
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id');
    if (this.postId) {
      this.apiService.getPost(this.postId).subscribe({
        next: (data) => {
          this.post = {
            title: data.post.title,
            content: data.post.content,
            tags: data.post.tags.join(', '),
            image: data.post.image
          };
        },
        error: (err) => {
          this.errorMessage = 'Ошибка при загрузке поста';
          console.error('Error fetching post:', err);
        }
      });
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.post.image = input.files[0];
    }
  }

  updatePost() {
    if (!this.post.title || !this.post.content) {
      this.errorMessage = 'Заголовок и содержимое обязательны';
      return;
    }

    const postData = {
      title: this.post.title,
      content: this.post.content,
      tags: this.post.tags,
      image: this.post.image
    };

    if (this.postId) {
      this.apiService.updatePost(this.postId, postData).subscribe({
        next: () => {
          this.successMessage = 'Пост успешно обновлен';
          this.errorMessage = null;
          setTimeout(() => this.router.navigate(['/home']), 1000);
        },
        error: (err) => {
          this.errorMessage = 'Ошибка при обновлении поста';
          console.error('Error updating post:', err);
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/home']);
  }
}
