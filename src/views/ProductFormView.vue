<script setup>
import sidebar from './../components/navigation/SideBar.vue';
import productForm from './../components/forms/ProductForm.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

let identifier = '';

switch (router.currentRoute.value.name) {
  case 'products.create':
    identifier = 'create';
    break;
  case 'products.edit':
    identifier = 'edit';
    break;
  default:
    identifier = 'create';
    break;
}
</script>
<template>
  <div class="flex flex-row">
    <sidebar></sidebar>
    <productForm :identifier="identifier"></productForm>
  </div>
</template>
