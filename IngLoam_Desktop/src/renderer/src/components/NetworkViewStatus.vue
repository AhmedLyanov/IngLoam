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
    
    // Скрываем уведомление через 3 секунды
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
  bottom: 0;
  left: 0;
  right: 0;
  font-family: "Cabin", sans-serif;
  font-optical-sizing: auto;
  text-align: center;
  font-weight: bold;
  z-index: 9999;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.network-status.offline {
  background-color: #ff4444;
  color: white;
}

.network-status.online {
  background-color: #00C851;
  color: white;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
</style>