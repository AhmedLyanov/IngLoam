import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ApiService } from '../../service/service.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgIf,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registrationForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.registrationForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  onSubmit() {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.apiService.register(this.registrationForm.value).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Registration error:', error);

        if (error.status === 0) {
          this.errorMessage = 'Не удалось подключиться к серверу';
        } else if (error.status === 409) {
          this.errorMessage = 'Пользователь с таким логином уже существует';
        } else {
          this.errorMessage = error.error?.message || 'Ошибка при регистрации';
        }
      }
    });
  }
}
