import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: !!localStorage.getItem('token'),
  }),
  actions: {
    async login({ username, password }) {
      try {
        const response = await axios.post('http://localhost:3000/login', {
          username,
          password,
        });
        this.token = response.data.token;
        this.isAuthenticated = true;
        localStorage.setItem('token', this.token);
        await this.fetchUserProfile();
        return { success: true, message: response.data.message };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.error || 'Ошибка входа',
        };
      }
    },
    async register({ name, surname, username, email, password }) {
      try {
        const response = await axios.post('http://localhost:3000/register', {
          name,
          surname,
          username,
          email,
          password,
        });
        return { success: true, message: response.data.message };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.error || 'Ошибка регистрации',
        };
      }
    },
    async fetchUserProfile() {
      if (!this.token) return;
      try {
        const response = await axios.get('http://localhost:3000/profile', {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.user = response.data.profile;
        localStorage.setItem('user', JSON.stringify(this.user));
      } catch (error) {
        console.error('Ошибка получения профиля:', error);
        this.logout();
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      this.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  getters: {
    avatarUrl: (state) => state.user?.avatar || 'https://avatars.githubusercontent.com/u/583231?v=4',
    username: (state) => state.user?.username || '',
  },
});
