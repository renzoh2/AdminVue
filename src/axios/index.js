import axios from 'axios';
import router from './../router';

axios.defaults.baseURL = 'http://localhost:8000/';
axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      router.push({ name: 'home' });
      localStorage.removeItem('users');
    }

    return Promise.reject(error);
  }
);

export default axios;
