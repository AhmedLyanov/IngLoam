<template>
  <div id="app">
    <AppHeader v-if="!$route.meta.hideHeader"/>
    <main>
      <router-view  />
    </main>
  </div>
</template>

<script>
import AppHeader from './components/header.vue'

export default {
  name: 'App',
  components: {
    AppHeader
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
