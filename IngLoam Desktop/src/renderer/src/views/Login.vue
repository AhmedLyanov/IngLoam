<template>
  <div class="page">
    <div class="container_registration_box">
      <h1>Вход</h1>
      <form @submit.prevent="handleLogin" class="auth-form">
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
          <label for="password">Пароль</label>
          <input
            v-model="form.password"
            type="password"
            id="password"
            placeholder="Введите пароль"
            required
          />

        </div>
        <button type="submit" class="submit-button">Войти</button>
        <p v-if="error" class="error">{{ error }}</p>
        <p>Нет аккаунта? <router-link to="/register">Зарегистрироваться</router-link></p>
      </form>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../../../store/auth'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      error: ''
    }
  },
  methods: {
    async handleLogin() {
      const authStore = useAuthStore()
      const { success, message } = await authStore.login(this.form)
      if (success) {
        this.$router.push('/main')
      } else {
        this.error = message
      }
    }
  }
}
</script>

<style scoped>
.container_registration_box {
  padding: 43px;
  backdrop-filter: blur(5px);
  background: #ffffff12;
  border-radius: 15px;
}
.page {
  display: flex;
  flex-direction: column;
  background-image: url(../assets/media/background.png);
  background-position: center;
  background-size: cover;
  align-items: center;
  color: #e6edf3;
  justify-content: center;
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

.container_registration_box {
  max-width: 600px;
  height: auto;
  backdrop-filter: blur(5px);
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
  background-color: #58a6ff;
  color: #ffffff;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-button:hover {
  background-color: #388bfd;
}

.error {
  color: #f85149;
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
