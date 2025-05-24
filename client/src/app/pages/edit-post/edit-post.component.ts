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
    images: [],
    codeSnippets: []
  };
  imagePreviews: string[] = [];
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
            images: data.post.images,
            codeSnippets: data.post.codeSnippets.map((snippet: any) => ({
              language: snippet.language || 'javascript',
              code: snippet.code
            }))
          };
          this.imagePreviews = [...this.post.images];
        },
        error: (err) => {
          this.errorMessage = 'Ошибка при загрузке поста';
          console.error('Error fetching post:', err);
        }
      });
    }
  }

  onFileChange(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      this.post.images = [...this.post.images, ...Array.from(files).slice(0, 5 - this.post.images.length)];
      this.imagePreviews = [];
      this.post.images.forEach((item: File | string) => {
        if (typeof item === 'string') {
          this.imagePreviews.push(item);
        } else {
          const reader = new FileReader();
          reader.onload = (e: any) => this.imagePreviews.push(e.target.result);
          reader.readAsDataURL(item);
        }
      });
    }
  }

  removeImage(index: number) {
    this.post.images.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  addSnippet() {
    this.post.codeSnippets.push({ language: 'javascript', code: '' });
  }

  removeSnippet(index: number) {
    this.post.codeSnippets.splice(index, 1);
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
      images: this.post.images,
      codeSnippets: this.post.codeSnippets
    };

    if (this.postId) {
      this.apiService.updatePost(this.postId, postData).subscribe({
        next: () => {
          this.successMessage = 'Пост успешно обновлен';
          this.errorMessage = null;
          setTimeout(() => this.router.navigate(['/']), 1000);
        },
        error: (err) => {
          this.errorMessage = 'Ошибка при обновлении поста';
          console.error('Error updating post:', err);
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
