import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from "../../../store/auth"
import Home from '../views/Home.vue';
import Repositories from '../views/Repositories.vue';
import Projects from '../views/Projects.vue';
import Mail from '../views/Mail.vue';
import Profile from '../views/Profile.vue';
import Settings from '../views/Settings.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true,
      title: 'Главная'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      requiresAuth: false,
      title: 'Вход',
      hideHeader: true 
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      requiresAuth: false,
      title: 'Регистрация'
    }
  },
  {
    path: '/repos',
    name: 'Repositories',
    component: Repositories,
    meta: {
      requiresAuth: true,
      title: 'Репозитории'
    }
  },
  {
    path: '/projects',
    name: 'Projects',
    component: Projects,
    meta: {
      requiresAuth: true,
      title: 'Проекты'
    }
  },
  {
    path: '/mail',
    name: 'Mail',
    component: Mail,
    meta: {
      requiresAuth: true,
      title: 'Почта'
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      requiresAuth: true,
      title: 'Профиль'
    },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: {
      requiresAuth: true,
      title: 'Настройки'
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  document.title = to.meta.title || 'IngLoam Desktop';
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  }
  else if ((to.path === '/login' || to.path === '/register') && authStore.isAuthenticated) {
    next('/');
  }
  else {
    next();
  }
});

export default router;
