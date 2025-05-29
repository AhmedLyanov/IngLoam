import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../service/service.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  name: string | null = null;
  surname: string | null = null;
  username: string | null = null;
  avatarUrl: string | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  resume: any = {
    education: [],
    experience: [],
    skills: []
  };
  isEditingResume: boolean = false;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    if (!localStorage.getItem("token")) {
      this.router.navigate(['/login']);
      return;
    }

    this.apiService.getProfile().subscribe({
      next: (response) => {
        this.name = response.profile.name;
        this.surname = response.profile.surname;
        this.username = response.profile.username;
        this.avatarUrl = response.profile.avatar ? this.addCacheBuster(response.profile.avatar) : null;
        this.resume = response.profile.resume || {
          education: [],
          experience: [],
          skills: []
        };
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Вы не авторизованы или токен недействителен';
      }
    });

    this.apiService.avatar$.subscribe(url => {
      if (url) {
        this.avatarUrl = this.addCacheBuster(url);
      }
    });

    this.apiService.resume$.subscribe(resume => {
      if (resume) {
        this.resume = resume;
      }
    });
  }

  logout() {
    this.apiService.logout();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.apiService.uploadAvatar(file).subscribe({
        next: (response) => {},
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Ошибка загрузки аватара';
        }
      });
    }
  }

  toggleEditResume() {
    this.isEditingResume = !this.isEditingResume;
    this.successMessage = '';
    this.errorMessage = '';
  }

  addEducation() {
    this.resume.education.push({ institution: '', degree: '', startYear: '', endYear: '' });
  }

  removeEducation(index: number) {
    this.resume.education.splice(index, 1);
  }

  addExperience() {
    this.resume.experience.push({ company: '', position: '', startDate: '', endDate: '', description: '' });
  }

  removeExperience(index: number) {
    this.resume.experience.splice(index, 1);
  }

  addSkill() {
    this.resume.skills.push('');
  }

  removeSkill(index: number) {
    this.resume.skills.splice(index, 1);
  }

  saveResume() {
    this.apiService.updateResume(this.resume).subscribe({
      next: (response) => {
        this.isEditingResume = false;
        this.successMessage = 'Резюме успешно сохранено';
        this.errorMessage = '';
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Ошибка сохранения резюме';
        this.successMessage = '';
      }
    });
  }

  deleteResume() {
    if (confirm('Вы уверены, что хотите удалить резюме?')) {
      this.apiService.deleteResume().subscribe({
        next: (response) => {
          this.resume = { education: [], experience: [], skills: [] };
          this.isEditingResume = false;
          this.successMessage = 'Резюме успешно удалено';
          this.errorMessage = '';
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Ошибка удаления резюме';
          this.successMessage = '';
        }
      });
    }
  }

  private addCacheBuster(url: string): string {
    return url + '?t=' + new Date().getTime();
  }
}
