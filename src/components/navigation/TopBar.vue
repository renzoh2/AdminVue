<script setup>
import { userStore } from './../../store/user';
import router from './../../router';

const logout = async () => {
  await userStore().logout();
  router.push({ name: 'home' });
};
</script>
<template>
  <div class="w-full flex flex-row justify-end bg-gray-300 items-center">
    <div class="p-4"><b>Welcome!</b> {{ userStore().getName }}</div>
    <div>
      <button class="bg-blue-500 text-white text-sm hover:bg-blue-700 px-5 py-5" @click="logout"><b>Logout</b></button>
    </div>
  </div>
</template>
