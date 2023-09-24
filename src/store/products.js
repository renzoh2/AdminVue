import { defineStore } from 'pinia';
import axios from './../axios';

export const productStore = defineStore('products', {
  state: () => ({
    status: '',
    title: '',
    message: ''
  }),
  getters: {
    getStatus: (state) => {
      return state.status;
    },
    getTitle: (state) => {
      return state.title;
    },
    getMesssage: (state) => {
      return state.message;
    }
  },
  actions: {
    resetStatus() {
      this.status = '';
      this.title = '';
      this.message = '';
    },
    setStatus(status, title, message) {
      this.status = status;
      this.title = title;
      this.message = message;
    },
    async fetchData(filter) {
      return await axios.get('api/products', { params: { ...filter } });
    },
    async fetchDataById(id) {
      return await axios.get('api/products/' + id);
    },
    async postData(form) {
      const options = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };
      return await axios.post('api/products', form, options);
    },
    async updateData(form, id) {
      const options = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };
      return await axios.post('api/products/' + id + '?_method=PUT', form, options);
    },
    async deleteData(id) {
      return await axios.delete('api/products/' + id);
    }
  },
  persist: true
});
