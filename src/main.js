import './assets/style.css';
import './assets/ckeditor-reset.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from './App.vue';
import router from './router';
import VueCookies from 'vue-cookies';
import CKEditor from '@ckeditor/ckeditor5-vue';

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(router);
app.use(pinia);
app.use(VueCookies);
app.use(CKEditor);
app.mount('#app');
