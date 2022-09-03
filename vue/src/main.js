import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
import store from './store/index';
import router from './router/index';

createApp(App).use(store).use(router).mount('#app')
