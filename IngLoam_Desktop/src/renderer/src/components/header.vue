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
            <router-link to="/repos">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
                style="margin-right: 6px"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Чат
            </router-link>
            <router-link to="/projects">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
                style="margin-right: 6px"
              >
                <path
                  d="M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"
                />
              </svg>
              Конференция
            </router-link>
            <router-link to="/mail">
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor"
                style="margin-right: 6px"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M3.75 5.25L3 6V18L3.75 18.75H20.25L21 18V6L20.25 5.25H3.75ZM4.5 7.6955V17.25H19.5V7.69525L11.9999 14.5136L4.5 7.6955ZM18.3099 6.75H5.68986L11.9999 12.4864L18.3099 6.75Z"
                />
              </svg>
              Почта
            </router-link>
          </nav>
          <div
            class="avatar-dropdown"
            @mouseenter="showDropdownMenu"
            @mouseleave="hideDropdownMenu"
          >
            <img :src="authStore.avatarUrl" alt="avatar" class="avatar-image" />
            <ul v-show="showDropdown" class="dropdown-menu">
              <li title="Профиль">
                <button @click="navigateTo('/')">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                  </svg>
                  Home
                </button>
              </li>
              <li title="Профи">
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
      notificationsCount: 0,
      dropdownTimeout: null
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
    },

    showDropdownMenu() {
      clearTimeout(this.dropdownTimeout)
      this.showDropdown = true
    },

    hideDropdownMenu() {
      this.dropdownTimeout = setTimeout(() => {
        this.showDropdown = false
      }, 300)
    }
  },
  mounted() {
    this.notificationsCount = 3
  }
}
</script>

<style scoped>
.site-header {
  background-color: rgba(27, 31, 46, 0.95);
  border-bottom: 1px solid rgba(206, 53, 123, 0.2);
  padding: 0 32px;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: #ffffff;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease;
}

.site-header:hover {
  background-color: rgba(27, 31, 46, 0.98);
  border-bottom-color: rgba(206, 53, 123, 0.4);
}

.content_center_header {
  max-width: 1700px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
}

.sign_or_reg_panel {
  display: flex;
  align-items: center;
  gap: 20px;
}

.auth-link {
  color: #e6edf3;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  font-family: 'Cabin', sans-serif;
  font-optical-sizing: auto;
  font-size: 15px;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.auth-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(206, 53, 123, 0.2), transparent);
  transition: all 0.5s ease;
}

.auth-link:hover::before {
  left: 100%;
}

.auth-link.sign-in {
  background-color: rgba(206, 53, 123, 0.1);
  border: 1px solid rgba(206, 53, 123, 0.3);
}

.auth-link.sign-in:hover {
  background-color: rgba(206, 53, 123, 0.2);
  box-shadow: 0 0 15px rgba(206, 53, 123, 0.3);
}

.auth-link.register {
  background-color: rgba(114, 54, 151, 0.1);
  border: 1px solid rgba(114, 54, 151, 0.3);
}

.auth-link.register:hover {
  background-color: rgba(114, 54, 151, 0.2);
  box-shadow: 0 0 15px rgba(114, 54, 151, 0.3);
}

.login_information {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-buttons {
  display: flex;
  gap: 20px;
}

.nav-buttons a {
  color: #c9d1d9;
  text-decoration: none;
  font-family: 'Cabin', sans-serif;
  font-optical-sizing: auto;
  font-size: 16px;
  font-weight: 500;
  padding: 8px 0;
  position: relative;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
}

.nav-buttons a:hover {
  color: #ce357b;
}

.nav-buttons a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #ce357b, #723697);
  transition: width 0.3s ease;
}

.nav-buttons a:hover::after {
  width: 100%;
}

.avatar-dropdown {
  position: relative;
  cursor: pointer;
}

.avatar-image {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  object-fit: cover;
}

.avatar-image:hover {
  border-color: #ce357b;
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(206, 53, 123, 0.4);
}

.dropdown-menu {
  position: absolute;
  top: 52px;
  right: 0;
  background-color: rgba(27, 31, 46, 0.95);
  border: 1px solid rgba(206, 53, 123, 0.3);
  border-radius: 8px;
  min-width: 200px;
  z-index: 10;
  padding: 8px 0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  overflow: hidden;
}

.dropdown-menu::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #ce357b, #723697);
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
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Cabin', sans-serif;
  font-optical-sizing: auto;
  font-size: 14px;
  transition: all 0.15s ease;
}

.dropdown-menu button:hover {
  background-color: rgba(206, 53, 123, 0.1);
  color: #ce357b;
  padding-left: 25px;
}

.dropdown-menu button svg {
  flex-shrink: 0;
  transition: fill 0.2s ease;
}

.dropdown-menu button:hover svg {
  fill: #ce357b;
}

.notifications_user_box {
  cursor: pointer;
  position: relative;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.notifications_user_box:hover {
  background-color: rgba(206, 53, 123, 0.1);
}

.notification-icon {
  fill: #c9d1d9;
  transition: fill 0.2s ease;
}

.notifications_user_box:hover .notification-icon {
  fill: #ce357b;
}

.notification-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: linear-gradient(135deg, #ce357b, #723697);
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 5px rgba(206, 53, 123, 0.5);
}
</style>
