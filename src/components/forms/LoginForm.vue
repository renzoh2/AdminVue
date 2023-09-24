<script setup>
import { reactive, onMounted } from 'vue';
import { userStore } from './../../store/user';
import { Alert } from 'flowbite-vue';
import router from './../../router';

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

const alert = reactive({
  trigger: false,
  status: '',
  title: '',
  message: '',
  html: '',
  subAlert: false
});

const login = async () => {
  await userStore().csrfToken();
  const { data } = await userStore().login(loginForm);
  alert.trigger = false;
  alert.title = data.title;
  alert.message = data.message;
  alert.subAlert = false;
  alert.status = 'success';
  if (data.status === 'Success') {
    userStore().setLocalStore(data.data.token, data.data.name);
  } else {
    alert.status = 'danger';
    if (!data.data) {
      alert.subAlert = false;
    } else {
      alert.subAlert = true;
      alert.title = '';
      alert.html = '<b>Insufficient Credentials!</b> <br> <ul class="mt-1.5 ml-4 list-disc list-inside">';
      if (data.data.username) alert.html += '<li>' + data.data.username[0].message + '</li>';
      if (data.data.password) alert.html += '<li>' + data.data.password[0].message + '</li>';
    }
  }
  console.log(alert.status);
  alert.trigger = true;

  setTimeout(function () {
    alert.trigger = false;
    alert.subAlert = false;
    router.push({ name: 'admin.index' });
  }, 6000);
};

const remember = async () => {
  if (cookie.remember == true && loginForm.identity != '' && loginForm.password != '') await userStore().setCookie(loginForm);
  else await userStore().removeCookie(loginForm);
};
</script>
<template>
  <div class="flex flex-col justify-center min-h-screen w-4/12 m-auto">
    <div class="pb-2 w-full flex flex-col">
      <Alert :type="alert.status" border icon v-if="alert.trigger === true && alert.subAlert === false">
        <div class="flex flex-row w-full justify-between items-center">
          <div>
            <b>{{ alert.title }}</b> {{ alert.message }}
          </div>
          <div>
            <span v-if="alert.status === 'success'" class="flex animate-spin">
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" class="spinner_P7sC" />
              </svg>
            </span>
          </div>
        </div>
      </Alert>
      <Alert :type="alert.status" border icon v-if="alert.subAlert === true">
        <span v-html="alert.html"></span>
      </Alert>
    </div>

    <div class="bg-white p-10 rounded-md">
      <div class="mb-2 text-center">
        <h1 class="font-extrabold text-2xl">MyADMIN</h1>
        <i class="text-sm">Back End PHP Dev Exam</i>
      </div>
      <hr class="border-2 border-gray-700 my-5" />
      <form @submit.prevent="login">
        <div class="flex flex-col py-2">
          <label class="font-bold pb-2"> USERNAME </label>
          <input type="text" class="bg-gray-200 rounded-md p-2 border-2 border-gray-500 focus:outline-blue-600 focus:bg-white" v-model="loginForm.identity" />
        </div>
        <div class="flex flex-col py-2">
          <label class="font-bold pb-2"> PASSWORD </label>
          <input type="password" class="bg-gray-200 rounded-md p-2 border-2 border-gray-500 focus:outline-blue-600 focus:bg-white" v-model="loginForm.password" />
        </div>
        <div class="py-3 pb-2 flex flex-row gap-2">
          <input type="checkbox" class="p-2 outline-4 outline-gray-400 rounded-md checked:bg-blue-600 checked:border-blue-600 w-6" @change="remember" v-model="cookie.remember" />
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
          This link is only for my Linkedin Account.
          <a href="https://www.linkedin.com/in/lawrence-agnir-09a3521bb/" target="blank" class="hover:text-blue-500"><b>Click Here!</b></a>
        </p>
      </div>
    </div>
  </div>
</template>
