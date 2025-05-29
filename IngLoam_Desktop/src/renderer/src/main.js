import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/main.css';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');
