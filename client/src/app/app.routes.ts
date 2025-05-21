import { Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CreatePostComponent } from './pages/create-post/create-post.component';
import { PostEditComponent } from './pages/edit-post/edit-post.component';
export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
   {
    path: 'post',
    component: CreatePostComponent
  }, { path: 'post/:id', component: PostEditComponent },

];
