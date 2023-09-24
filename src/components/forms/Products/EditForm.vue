<script setup>
import { ref, reactive, onMounted } from 'vue';
import { Input, Select, FileInput } from 'flowbite-vue';
import { productStore } from './../../../store/products';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import router from './../../../router';

onMounted(async () => {
  const { data } = await productStore().fetchDataById(router.currentRoute.value.params.id);
  console.log(data);
  formData.name = data.data.name;
  formData.description = data.data.description;
  formData.category = data.data.category;
  formData.dateTimeCreated = data.data.datetime_created;
  formData.image = data.data.image_urls;
});

const initFormData = {
  name: '',
  description: '',
  category: '',
  dateTimeCreated: '',
  image: null
};
const file = ref([]);

const formData = reactive(initFormData);

const categories = [
  { value: 'Bag', name: 'Bag' },
  { value: 'Shirt', name: 'Shirt' },
  { value: 'Shoes', name: 'Shoes' },
  { value: 'Pants', name: 'Pants' },
  { value: 'Dress', name: 'Dress' },
  { value: 'Appliances', name: 'Appliances' },
  { value: 'Tech', name: 'Tech' }
];

const formatDate = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hrs = date.getHours();
  const mins = date.getMinutes();
  const secs = date.getSeconds();
  return `${year}-${month}-${day} ${hrs}:${mins}:${secs}`;
};

const changeDateTime = () => {
  formData.dateTimeCreated = formatDate(formData.dateTimeCreated);
};

const submitData = async () => {
  formData.image = file;

  const { data } = await productStore().updateData(formData, router.currentRoute.value.params.id);
  console.log(data.status);
  if (data.status === 'Success') {
    productStore().setStatus(data.status);
    router.push({ name: 'admin.index' });
  }
};
</script>
<template>
  <div class="w-full p-10">
    <div class="w-10/12 mx-auto border-2 border-gray-300 rounded-lg">
      <div class="pt-10 px-10">
        <h1 class="font-bold text-xl">Edit Products</h1>
      </div>
      <form class="px-10 py-10 flex flex-col gap-5">
        <div>
          <label>Name</label>
          <Input v-model="formData.name" placeholder="Enter Product Name" />
        </div>
        <div>
          <label>Category</label>
          <Select v-model="formData.category" :options="categories" />
        </div>
        <div>
          <label>Description</label>
          <ckeditor :editor="ClassicEditor" v-model="formData.description"></ckeditor>
        </div>
        <div>
          <label>Date/Time Created</label>
          <VueDatePicker v-model="formData.dateTimeCreated" @update:model-value="changeDateTime" :is-24="false"></VueDatePicker>
        </div>
        <div>
          <label>Upload Images</label>
          <FileInput multiple v-model="file">
            <p class="!mt-1 text-sm">PNG, JPG or JPEG only.</p>
          </FileInput>
        </div>
      </form>
      <div class="w-full p-5">
        <button class="bg-blue-500 text-white w-full p-2 rounded m-auto" @click="submitData">Edit Product</button>
      </div>
    </div>
  </div>
</template>
