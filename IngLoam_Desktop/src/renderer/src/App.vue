<template>
  <div id="app">
    <NetworkViewStatus />
    <AppHeader v-if="!$route.meta.hideHeader"/>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import AppHeader from './components/header.vue'
import NetworkViewStatus from './components/NetworkViewStatus.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    NetworkViewStatus
  }
}
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #0d1117;
}

</style>
