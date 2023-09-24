<script setup>
import { reactive, onMounted } from 'vue';
import { userStore } from './../../store/user';

const initLoginForm = {
  identity: '',
  password: ''
};

const loginForm = reactive(initLoginForm);

const cookie = reactive({
  remember: false
});

onMounted(async () => {
  const data = await userStore().fetchCookie();
  if (data) {
    loginForm.identity = data.identity;
    loginForm.password = data.password;
    cookie.remember = true;
  }
});

const login = async () => {
  await userStore().csrfToken();
  await userStore().login(loginForm);
};

const remember = async () => {
  if (cookie.remember == true && loginForm.identity != '' && loginForm.password != '') await userStore().setCookie(loginForm);
  else await userStore().removeCookie(loginForm);
};
</script>
<template>
  <div class="flex flex-col justify-center min-h-screen w-3/12 m-auto">
    <div class="bg-white p-10 rounded-md">
      <div class="mb-2 text-center">
        <h1 class="font-extrabold text-2xl">MyADMIN</h1>
        <i class="text-sm">Back End PHP Dev Exam</i>
      </div>
      <hr class="border-2 border-gray-700 my-5" />
      <form @submit.prevent="login">
        <div class="flex flex-col py-2">
          <label class="font-bold pb-2"> USERNAME </label>
          <input
            type="text"
            class="bg-gray-200 rounded-md p-2 border-2 border-gray-500 focus:outline-blue-600 focus:bg-white"
            v-model="loginForm.identity"
          />
        </div>
        <div class="flex flex-col py-2">
          <label class="font-bold pb-2"> PASSWORD </label>
          <input
            type="password"
            class="bg-gray-200 rounded-md p-2 border-2 border-gray-500 focus:outline-blue-600 focus:bg-white"
            v-model="loginForm.password"
          />
        </div>
        <div class="py-3 pb-2 flex flex-row gap-2">
          <input
            type="checkbox"
            class="p-2 outline-4 outline-gray-400 rounded-md checked:bg-blue-600 checked:border-blue-600 w-6"
            @change="remember"
            v-model="cookie.remember"
          />
          <label class="font-bold">Remember Me?</label>
        </div>
        <div class="mt-5">
          <button class="text-white p-3 rounded-md text-center bg-blue-400 hover:bg-blue-600 w-full">
            <b>LOGIN ACCOUNT</b>
          </button>
        </div>
      </form>
      <div class="text-center pt-4 text-sm">
        <p>
          Don't have an account yet?
          <a href="#" class="hover:text-blue-500"><b>Sign up here!</b></a>
        </p>
      </div>
    </div>
  </div>
</template>
