import { defineStore } from 'pinia';
import axios from './../axios';
import CryptoJS from 'crypto-js';
import cookies from 'vue-cookies';

export const userStore = defineStore('users', {
  state: () => ({
    token: null,
    isAuth: false,
    name: ''
  }),
  getters: {
    getIsAuth: (state) => {
      return state.isAuth;
    },
    getName: (state) => {
      return state.name;
    }
  },
  actions: {
    async csrfToken() {
      await axios.get('sanctum/csrf-cookie');
    },
    async fetchCookie() {
      if (cookies.isKey('u')) {
        const cookie = cookies.get('u');
        const bytes = CryptoJS.AES.decrypt(cookie, 'myAppSecret');
        const json = bytes.toString(CryptoJS.enc.Utf8);
        const form = JSON.parse(json);
        return form;
      }
      return false;
    },
    async setCookie(form) {
      const myJSON = JSON.stringify(form);
      const encrypted = CryptoJS.AES.encrypt(myJSON, import.meta.env.VITE_APP_SECRET).toString();
      cookies.set('u', encrypted, Infinity);
    },
    async removeCookie() {
      cookies.remove('u');
    },
    async setLocalStore(token, name) {
      this.token = token;
      this.name = name;
      this.isAuth = true;
    },
    async login(form) {
      return await axios.post('api/login', form);
    },
    async logout() {
      await axios.post('api/logout');
      this.token = null;
      this.isAuth = false;
    }
  },
  persist: true
});
