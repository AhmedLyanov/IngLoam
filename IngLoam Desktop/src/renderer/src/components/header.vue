<template>
  <header class="site-header">
    <div class="content_center_header">
      <div class="logotype_IngLoam">
        <router-link to="/" class="logo_image_link">
          <div class="IngLoam_corporation"></div>
        </router-link>
      </div>

      <div class="sign_or_reg_panel">
        <div v-if="authStore.isAuthenticated" class="login_information">
          <nav class="nav-buttons">
            <router-link to="/repos">Repositories</router-link>
            <router-link to="/projects">Projects</router-link>
            <router-link to="/mail">Mail</router-link>
          </nav>
          <div
            class="avatar-dropdown"
            @mouseenter="showDropdown = true"
            @mouseleave="showDropdown = false"
          >
            <img :src="authStore.avatarUrl" alt="avatar" class="avatar-image" />
            <ul v-show="showDropdown" class="dropdown-menu">
              <li title="Профиль">
                <button @click="navigateTo('/profile')">
                  <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                    <path
                      d="M8 9a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm0 1c-2 0-6 1-6 3v1h12v-1c0-2-4-3-6-3Z"
                    />
                  </svg>
                  Profile
                </button>
              </li>
              <li title="Настройки">
                <button @click="navigateTo('/settings')">
                  <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                    <path d="M8 1a7 7 0 1 0 7 7A7 7 0 0 0 8 1Zm0 12a5 5 0 1 1 5-5 5 5 0 0 1-5 5Z" />
                  </svg>
                  Settings
                </button>
              </li>
              <li title="Выйти">
                <button @click="logout">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path
                      d="M16 13v-2H7V8l-5 4 5 4v-3zm2-10H6c-1.1 0-2 .9-2 2v4h2V5h12v14H6v-4H4v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
                    />
                  </svg>
                  Exit
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div v-else class="guest-links">
          <router-link to="/login" class="auth-link sign-in">Войти</router-link>
          <router-link to="/register" class="auth-link register">Регистрация</router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { useAuthStore } from '../../../store/auth'

export default {
  name: 'AppHeader',
  data() {
    return {
      searchQuery: '',
      showDropdown: false,
      notificationsCount: 0
    }
  },
  computed: {
    authStore() {
      return useAuthStore()
    }
  },
  methods: {
    handleSearch() {
      console.log('Search query:', this.searchQuery)
    },
    navigateTo(path) {
      this.$router.push(path)
      this.showDropdown = false
    },
    logout() {
      this.authStore.logout()
      this.$router.push('/login')
    }
  },
  mounted() {
    this.notificationsCount = 3
  }
}
</script>

<style scoped>
.site-header {
  background-color: rgba(13, 17, 23, 0.95);
  border-bottom: 1px solid rgba(48, 54, 61, 0.5);
  padding: 0 32px;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: #ffffff;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.site-header:hover {
  background-color: rgba(13, 17, 23, 0.98);
  border-bottom-color: rgba(48, 54, 61, 0.8);
}

.content_center_header {
  max-width: 1700px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}

.logo-image {
  height: 55px;
}

.search_form_module {
  flex-grow: 1;
  margin: 0 32px;
  max-width: 600px;
}

.search-form {
  position: relative;
}

.search-input {
  padding: 10px 12px 10px 40px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #30363d;
  background-color: rgba(13, 17, 23, 0.7);
  color: #ffffff;
  font-size: 15px;
  transition: all 0.25s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-input:focus {
  outline: none;
  border-color: #58a6ff;
  box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.2);
  background-color: rgba(13, 17, 23, 0.9);
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  fill: #8b949e;
  pointer-events: none;
  transition: fill 0.2s ease;
}

.search-input:focus + .search-icon,
.search-input:focus ~ .search-icon {
  fill: #58a6ff;
}

.sign_or_reg_panel {
  display: flex;
  align-items: center;
  gap: 20px;
}

.auth-link {
  color: #58a6ff;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  font-size: 15px;
  font-weight: 500;
}

.auth-link:hover {
  background-color: rgba(56, 139, 253, 0.15);
  border-color: rgba(88, 166, 255, 0.4);
}

.auth-link.register {
  background-color: rgba(46, 160, 67, 0.1);
  color: #3fb950;
  border-color: rgba(63, 185, 80, 0.4);
}

.auth-link.register:hover {
  background-color: rgba(46, 160, 67, 0.2);
}

.login_information {
  display: flex;
  align-items: center;
  gap: 24px;
}

.avatar-image {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.avatar-image:hover {
  border-color: rgba(88, 166, 255, 0.5);
  transform: scale(1.05);
}

.avatar-dropdown {
  position: relative;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: 48px;
  right: 0;
  background-color: #161b22;
  border: 1px solid #30363d;
  border-radius: 8px;
  min-width: 180px;
  z-index: 10;
  padding: 6px 0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.dropdown-menu li {
  list-style: none;
}

.dropdown-menu button {
  background: none;
  border: none;
  color: #e6edf3;
  text-align: left;
  width: 100%;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  transition: all 0.15s ease;
}

.dropdown-menu button:hover {
  background-color: #21262d;
  color: #58a6ff;
}

.dropdown-menu button svg {
  flex-shrink: 0;
}

.nav-buttons {
  display: flex;
  gap: 16px;
}

.nav-buttons a {
  color: #c9d1d9;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  padding: 8px 0;
  position: relative;
  transition: color 0.2s ease;
}

.nav-buttons a:hover {
  color: #58a6ff;
}

.nav-buttons a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #58a6ff;
  transition: width 0.3s ease;
}

.nav-buttons a:hover::after {
  width: 100%;
}

.notifications_user_box {
  cursor: pointer;
  position: relative;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.notifications_user_box:hover {
  background-color: rgba(177, 186, 196, 0.1);
}

.notification-icon {
  fill: #c9d1d9;
  transition: fill 0.2s ease;
}

.notifications_user_box:hover .notification-icon {
  fill: #58a6ff;
}

.notification-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  background-color: #f85149;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
