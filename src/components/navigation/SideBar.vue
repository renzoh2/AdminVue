<script setup>
import { ref } from 'vue';

let hidden = ref(true);

const showDropdown = () => {
  console.log(hidden.value);
  hidden.value = hidden.value === true ? false : true;
};
</script>
<template>
  <div class="bg-gray-500 text-white">
    <aside id="sidebar-multi-level-sidebar" class="relative top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
      <div class="h-full px-3 py-4 overflow-y-auto">
        <a href="#" class="flex items-center pl-2.5 mb-5">
          <span class="self-center text-xl whitespace-nowrap text-white font-light">MyADMIN</span>
        </a>

        <ul class="space-y-2 font-medium">
          <li>
            <button type="button" @click="showDropdown" class="flex items-center w-full p-2 text-base text-white transition duration-75 rounded-lg group hover:bg-gray-100 hover:text-black" aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
              <svg class="flex-shrink-0 w-5 h-5 transition duration-75" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 21">
                <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
              </svg>
              <span class="flex-1 ml-3 text-left whitespace-nowrap">Products</span>
              <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
              </svg>
            </button>
            <ul id="dropdown-example" class="py-2 space-y-2" :class="{ hidden: hidden }">
              <li>
                <router-link to="/products" href="#" class="flex items-center w-full p-2 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 hover:text-black">Product List</router-link>
              </li>
              <li>
                <router-link to="/products/create" class="flex items-center w-full p-2 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 hover:text-black">Create Product</router-link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </aside>
  </div>
</template>
