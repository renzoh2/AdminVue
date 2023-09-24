import { defineStore } from 'pinia';
import axios from './../axios';

export const productStore = defineStore('products', {
  state: () => ({
    status: ''
  }),
  getters: {
    getStatus: (state) => {
      return state.status;
    }
  },
  actions: {
    resetStatus() {
      this.status = '';
    },
    setStatus(status) {
      this.status = status;
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
