<template>
  <transition name="slide-up">
    <div v-if="showStatus" class="network-status" :class="statusClass">
      {{ statusMessage }}
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const isOnline = ref(navigator.onLine)
const showStatus = ref(false)
const statusChanged = ref(false)

const statusClass = computed(() => ({
  'online': isOnline.value && statusChanged.value,
  'offline': !isOnline.value
}))

const statusMessage = computed(() =>
  isOnline.value ? 'Сеть вернулась' : 'Нет подключения к сети'
)

const updateNetworkStatus = () => {
  const newStatus = navigator.onLine
  if (newStatus !== isOnline.value) {
    isOnline.value = newStatus
    statusChanged.value = true
    showStatus.value = true

    window.api.updateNetworkStatus(newStatus)


    setTimeout(() => {
      showStatus.value = false
      setTimeout(() => statusChanged.value = false, 500)
    }, 3000)
  }
}

onMounted(() => {
  window.addEventListener('online', updateNetworkStatus)
  window.addEventListener('offline', updateNetworkStatus)
  window.api.updateNetworkStatus(isOnline.value)
})

onBeforeUnmount(() => {
  window.removeEventListener('online', updateNetworkStatus)
  window.removeEventListener('offline', updateNetworkStatus)
})
</script>

<style scoped>
.network-status {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-family: "Cabin", sans-serif;
  font-optical-sizing: auto;
  text-align: center;
  font-weight: 600;
  font-size: 15px;
  z-index: 9999;
  padding: 16px 32px;
  border-radius: 12px;
  min-width: 280px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  overflow: hidden;
}

.network-status::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #CE357B, #723697);
}

.network-status.offline {
  background-color: rgba(206, 53, 123, 0.9);
  color: white;
  border: 1px solid rgba(206, 53, 123, 0.5);
}

.network-status.online {
  background-color: rgba(114, 54, 151, 0.9);
  color: white;
  border: 1px solid rgba(114, 54, 151, 0.5);
}

.network-status::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: 0.5s;
}

.network-status:hover::after {
  left: 100%;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateX(-50%) translateY(100px);
  opacity: 0;
}

.slide-up-enter-active {
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.slide-up-leave-active {
  transition: all 0.3s ease-out;
}


.network-status.offline {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(206, 53, 123, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(206, 53, 123, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(206, 53, 123, 0);
  }
}

/* Иконки статуса */
.network-status::before {
  content: '';
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-right: 10px;
}

.network-status.offline::before {
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z'/%3E%3C/svg%3E") no-repeat center;
}

.network-status.online::before {
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E") no-repeat center;
}
</style>
