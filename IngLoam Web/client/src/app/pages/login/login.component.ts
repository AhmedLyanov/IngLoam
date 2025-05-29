import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../service/service.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgIf,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  getUsernameErrorMessage(): string {
    const usernameControl = this.loginForm.get('username');
    return usernameControl?.errors?.['required'] ? 'Имя пользователя обязательно' : '';
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const { username, password } = this.loginForm.value;

    this.apiService.login({ username, password }).subscribe({
      next: (response) => {
        this.isLoading = false;
        localStorage.setItem('token', response.token);
        this.router.navigate(['/profile']);
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 401 || error.status === 404) {
          this.errorMessage = 'Неверное имя пользователя или пароль';
        } else if (error.status === 0) {
          this.errorMessage = 'Нет соединения с сервером';
        } else {
          this.errorMessage = 'Ошибка при входе';
        }
      }
    });
  }
}
