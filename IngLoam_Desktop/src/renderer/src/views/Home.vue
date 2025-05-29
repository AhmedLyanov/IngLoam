<template>
  <div class="home-page">
    <h1>Добро пожаловать в IngLoam Desktop</h1>

    <div v-if="user" class="user-info">
      <img :src="user.avatar || 'https://avatars.githubusercontent.com/u/583231?v=4'"
           alt="Аватар"
           class="avatar">
      <h2>Привет, {{ user.name }}!</h2>
      <p>Ваш email: {{ user.email }}</p>
    </div>

    <div class="features">
      <div class="feature-card" v-for="feature in features" :key="feature.title">
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../../../store/auth';
import { computed } from 'vue';

export default {
  name: 'HomeView',
  setup() {
    const authStore = useAuthStore();

    const features = [
      {
        title: 'Репозитории',
        description: 'Управляйте вашими Git-репозиториями'
      },
      {
        title: 'Проекты',
        description: 'Организуйте ваши проекты'
      },
      {
        title: 'Почта',
        description: 'Проверяйте ваши письма'
      }
    ];

    return {
      user: computed(() => authStore.user),
      features
    };
  }
};
</script>

<style scoped>
.home-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.feature-card {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  transition: transform 0.2s;
}

.feature-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.1);
}
</style>
