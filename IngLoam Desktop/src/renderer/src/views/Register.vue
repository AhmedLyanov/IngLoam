<template>
  <div class="page">
    <h1>Регистрация</h1>
    <form @submit.prevent="handleRegister" class="auth-form">
      <div class="form-group">
        <label for="name">Имя</label>
        <input
          v-model="form.name"
          type="text"
          id="name"
          placeholder="Введите имя"
          required
        />
      </div>
      <div class="form-group">
        <label for="surname">Фамилия</label>
        <input
          v-model="form.surname"
          type="text"
          id="surname"
          placeholder="Введите фамилию"
          required
        />
      </div>
      <div class="form-group">
        <label for="username">Имя пользователя</label>
        <input
          v-model="form.username"
          type="text"
          id="username"
          placeholder="Введите имя пользователя"
          required
        />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input
          v-model="form.email"
          type="email"
          id="email"
          placeholder="Введите email"
          required
        />
      </div>
      <div class="form-group">
        <label for="password">Пароль</label>
        <input
          v-model="form.password"
          type="password"
          id="password"
          placeholder="Введите пароль"
          required
        />
      </div>
      <button type="submit" class="submit-button">Зарегистрироваться</button>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>
      <p>
        Уже есть аккаунт? <router-link to="/login">Войти</router-link>
      </p>
    </form>
  </div>
</template>

<script>
import { useAuthStore } from '../../../store/auth';

export default {
  name: 'Register',
  data() {
    return {
      form: {
        name: '',
        surname: '',
        username: '',
        email: '',
        password: '',
      },
      error: '',
      success: '',
    };
  },
  methods: {
    async handleRegister() {
      const authStore = useAuthStore();
      const { success, message } = await authStore.register(this.form);
      if (success) {
        this.success = message;
        this.error = '';
        setTimeout(() => this.$router.push('/login'), 2000);
      } else {
        this.error = message;
        this.success = '';
      }
    },
  },
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  color: #e6edf3;
  background-color: #0d1117;
  min-height: 100vh;
}

.auth-form {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #c9d1d9;
}

input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #30363d;
  background-color: rgba(13, 17, 23, 0.7);
  color: #ffffff;
  font-size: 15px;
  transition: all 0.2s ease;
}

input:focus {
  outline: none;
  border-color: #58a6ff;
  box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.2);
}

.submit-button {
  padding: 10px;
  border-radius: 8px;
  border: none;
  background-color: #3fb950;
  color: #ffffff;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-button:hover {
  background-color: #2ea043;
}

.error {
  color: #f85149;
  font-size: 14px;
  text-align: center;
}

.success {
  color: #3fb950;
  font-size: 14px;
  text-align: center;
}

a {
  color: #58a6ff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
