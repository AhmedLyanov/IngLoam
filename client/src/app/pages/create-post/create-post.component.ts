import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../service/service.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent {
  post = {
    title: '',
    content: '',
    tags: '',
    image: undefined as File | undefined
  };

  constructor(private apiService: ApiService, private router: Router) {}

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
