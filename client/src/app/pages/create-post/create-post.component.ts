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
    images: [] as File[],
    codeSnippets: [] as { language: string; code: string }[]
  };
  imagePreviews: string[] = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.apiService.username$.subscribe(username => {
      if (!username) {
        this.router.navigate(['/login']);
      }
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files) as File[];
      this.post.images = [...this.post.images, ...newFiles.slice(0, 5 - this.post.images.length)];
      this.imagePreviews = [];
      this.post.images.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target?.result) {
            this.imagePreviews.push(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
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

  createPost() {
    this.apiService.createPost(this.post).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error creating post:', err);
        alert('Ошибка при создании поста');
      }
    });
  }
}
