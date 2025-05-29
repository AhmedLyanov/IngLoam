vue
<template>
  <div class="profile-page">
    <aside class="sidebar">
      <div class="user-info">
        <img :src="authStore.avatarUrl" alt="User Avatar" class="user-avatar" />
        <h2 class="user-name">{{ authStore.user?.name }} {{ authStore.user?.surname }}</h2>
        <p class="user-username">@{{ authStore.user?.username }}</p>
        <p class="user-email">{{ authStore.user?.email }}</p>
      </div>
      <nav class="sidebar-nav">
        <router-link to="/profile" class="nav-link" active-class="active">
          <svg class="icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-3.31 0-10 1.67-10 5v2h20v-2c0-3.33-6.69-5-10-5z"/></svg>
          Profile
        </router-link>
        <router-link to="/settings" class="nav-link" active-class="active">
          <svg class="icon" viewBox="0 0 24 24"><path d="M12 2c-1.1 0-2 .9-2 2v1H9c-1.1 0-2 .9-2 2v1H5c-1.1 0-2 .9-2 2v1h3v1c0 1.1.9 2 2 2h1v1c0 1.1.9 2 2 2h1c1.1 0 2-.9 2-2v-1h1c1.1 0 2-.9 2-2v-1h3v-1c0-1.1-.9-2-2-2h-1V7c0-1.1-.9-2-2-2h-1V4c0-1.1-.9-2-2-2z"/></svg>
          Settings
        </router-link>
        <button @click="authStore.logout" class="logout-button">
          <svg class="icon" viewBox="0 0 24 24"><path d="M16 13h-5v-2h5V9l4 4-4 4v-2zm-3 7h-9V4h9v2H5v14h9v2z"/></svg>
          Logout
        </button>
      </nav>
    </aside>
    <main class="main-content">
      <h1>Profile</h1>
      <div class="profile-card">
        <h2>Personal Information</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Name:</span>
            <span>{{ authStore.user?.name }} {{ authStore.user?.surname }}</span>
          </div>
          <div class="info-item">
            <span class="label">Username:</span>
            <span>{{ authStore.user?.username }}</span>
          </div>
          <div class="info-item">
            <span class="label">Email:</span>
            <span>{{ authStore.user?.email }}</span>
          </div>
          <div class="info-item">
            <span class="label">Age:</span>
            <span>{{ authStore.user?.age || 'Not specified' }}</span>
          </div>
          <div class="info-item">
            <span class="label">Description:</span>
            <span>{{ authStore.user?.description || 'No description provided' }}</span>
          </div>
        </div>
      </div>
      <div class="profile-card">
        <h2>Resume</h2>
        <div v-if="authStore.user?.resume" class="resume-section">
          <h3>Education</h3>
          <div v-if="authStore.user.resume.education.length > 0" class="resume-list">
            <div v-for="(edu, index) in authStore.user.resume.education" :key="index" class="resume-item">
              <p><strong>{{ edu.institution }}</strong> - {{ edu.degree }}</p>
              <p>{{ edu.startYear }} - {{ edu.endYear }}</p>
            </div>
          </div>
          <p v-else class="no-data">No education information provided.</p>
          <h3>Experience</h3>
          <div v-if="authStore.user.resume.experience.length > 0" class="resume-list">
            <div v-for="(exp, index) in authStore.user.resume.experience" :key="index" class="resume-item">
              <p><strong>{{ exp.company }}</strong> - {{ exp.position }}</p>
              <p>{{ exp.startDate }} - {{ exp.endDate }}</p>
              <p>{{ exp.description || 'No description' }}</p>
            </div>
          </div>
          <p v-else class="no-data">No experience information provided.</p>
          <h3>Skills</h3>
          <div v-if="authStore.user.resume.skills.length > 0" class="skills-list">
            <span v-for="(skill, index) in authStore.user.resume.skills" :key="index" class="skill-badge">{{ skill }}</span>
          </div>
          <p v-else class="no-data">No skills provided.</p>
        </div>
        <p v-else class="no-data">No resume data available.</p>
      </div>
    </main>
  </div>
</template>
<script>
import { useAuthStore } from '../../../store/auth';
export default {
  name: 'Profile',
  computed: {
    authStore() {
      return useAuthStore();
    },
  },
  async mounted() {
    if (!this.authStore.user) {
      await this.authStore.fetchUserProfile();
    }
  },
};
</script>
<style scoped>
.profile-page {
  display: flex;
  min-height: 100vh;
  background-color: #0d1117;
  color: #e6edf3;
}
.sidebar {
  width: 280px;
  background-color: #161b22;
  padding: 24px;
  border-right: 1px solid #30363d;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.user-info {
  text-align: center;
}
.user-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid #30363d;
  margin-bottom: 16px;
  transition: all 0.2s ease;
}
.user-avatar:hover {
  border-color: #58a6ff;
  transform: scale(1.05);
}
.user-name {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}
.user-username {
  font-size: 16px;
  color: #8b949e;
  margin: 8px 0;
}
.user-email {
  font-size: 14px;
  color: #c9d1d9;
}
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.nav-link {
  color: #c9d1d9;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  padding: 10px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}
.nav-link:hover {
  background-color: #21262d;
  color: #58a6ff;
}
.nav-link.active {
  background-color: #58a6ff;
  color: #ffffff;
}
.logout-button {
  background-color: transparent;
  border: 1px solid #30363d;
  color: #f85149;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}
.logout-button:hover {
  background-color: rgba(248, 81, 73, 0.15);
  border-color: rgba(248, 81, 73, 0.4);
}
.main-content {
  flex: 1;
  padding: 40px;
}
h1 {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 24px;
}
.profile-card {
  background-color: #161b22;
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
.profile-card h2 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #e6edf3;
}
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.info-item {
  display: flex;
  flex-direction: column;
}
.label {
  font-size: 14px;
  font-weight: 500;
  color: #8b949e;
  margin-bottom: 4px;
}
.info-item span:nth-child(2) {
  font-size: 16px;
  color: #c9d1d9;
}
.resume-section h3 {
  font-size: 18px;
  font-weight: 500;
  margin: 16px 0 8px;
  color: #e6edf3;
}
.resume-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.resume-item {
  background-color: #21262d;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #30363d;
}
.resume-item p {
  margin: 4px 0;
  font-size: 14px;
  color: #c9d1d9;
}
.resume-item p strong {
  color: #e6edf3;
}
.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.skill-badge {
  background-color: #58a6ff;
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
}
.no-data {
  font-size: 14px;
  color: #8b949e;
  font-style: italic;
}
.icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
}
</style>
