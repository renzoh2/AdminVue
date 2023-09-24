<script setup>
import { reactive, onMounted, ref, watch } from 'vue';
import { Input, Select } from 'flowbite-vue';
import { productStore } from './../../store/products';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import router from './../../router';
import TopBar from './../navigation/TopBar.vue';
import { FormBuild, Categories } from './../../const';

const prop = defineProps(['identifier']);

onMounted(async () => {
  if (prop.identifier === 'edit') {
    formStep.step = 4;
    const { data } = await productStore().fetchDataById(router.currentRoute.value.params.id);
    formData.name = data.data.name;
    formData.description = data.data.description;
    formData.category = data.data.category;
    formData.dateTimeCreated = data.data.datetime_created;
    formData.image = data.data.image_urls;
  }
  formBuild.show = true;
});

const formStep = reactive({
  step: 1,
  submit: true
});

const formBuild = reactive({
  ...FormBuild[prop.identifier],
  function: prop.identifier,
  show: false
});

const initFormData = {
  name: '',
  description: '',
  category: '',
  dateTimeCreated: '',
  image: null
};

const formData = reactive(initFormData);

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
  const { data } = formBuild.function === 'create' ? await productStore().postData(formData) : formBuild.function === 'edit' ? await productStore().updateData(formData, router.currentRoute.value.params.id) : null;
  if (data.status === 'Success') {
    productStore().setStatus(data.status.toLowerCase(), formBuild.alertSuccessTitle, formBuild.alertSuccessMessage);
    router.push({ name: 'admin.index' });
  } else {
    productStore().setStatus('danger', formBuild.alertErrorTitle, formBuild.alertErrorMessage);
    router.push({ name: 'admin.index' });
  }
};

const editorRef = ref(null);
const fileRef = ref(null);
const dateTimeRef = ref(null);

//Watch CKeditor (Rich Editor Plugin)
watch(
  () => formData.description,
  (description) => {
    if (editorRef.value) {
      const parent = editorRef.value;
      const errorNode = parent.querySelector('span.error-message');
      errorNode.innerHTML = description === '' ? 'Description is required' : '';
    }
  }
);

watch(
  () => {
    const { name, description, category } = formData;
    return { name, description, category };
  },
  () => {
    formStep.step = formData.name != '' && formData.description != '' && formData.category != '' ? 2 : 1;
    formStep.submit = formData.name != '' && formData.description != '' && formData.category != '' ? true : false;
    if (prop.identifier === 'edit') {
      formStep.step = 4; //To Force Edit
    }
  }
);

const stepOneValidation = (type = 'text', event) => {
  const currentTarget = event.target;
  const parent = currentTarget.parentNode;
  const errorNode = parent.closest('.form-group').querySelector('span.error-message');

  switch (type) {
    case 'text': {
      errorNode.innerHTML = currentTarget.value === '' ? 'Name is required' : '';
      break;
    }
    case 'select': {
      errorNode.innerHTML = currentTarget.value === '' ? 'Category is required' : '';
      break;
    }
    default:
      break;
  }
};

const stepTwoValidation = (e) => {
  formData.image = null;
  const parent = fileRef.value;
  const errorNode = parent.querySelector('span.error-message');
  formStep.step = prop.identifier === 'edit' ? 4 : 2;
  var files = e.target.files || e.dataTransfer.files;
  let falseChecker = false;
  if (files.length === 0) {
    errorNode.innerHTML = formData.image === null && prop.identifier === 'create' ? 'No file. Please insert image file/s. ' : '';
    formStep.submit = falseChecker === false && prop.identifier === 'create' ? false : true;
    console.log(formStep.submit);
    return;
  }

  Object.values(files).forEach((value) => {
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(value['type'])) {
      falseChecker = true;
      return;
    }
  });

  formStep.step = prop.identifier === 'edit' ? 4 : falseChecker === true ? 2 : 3;
  formStep.submit = falseChecker === false ? true : false;
  if (falseChecker === false) formData.image = files;
  errorNode.innerHTML = formData.image === null ? 'Invalid file/s. Please insert correct file image/s. ' : '';
};

const stepThreeValidation = (e) => {
  const parent = dateTimeRef.value;
  const errorNode = parent.querySelector('span.error-message');
  formStep.step = 3;
  if (formData.dateTimeCreated != '') {
    formStep.step = 4;
    formStep.submit = true;
  }
  errorNode.innerHTML = formData.dateTimeCreated === '' ? 'Please input date and time. ' : '';
};
</script>
<template>
  <div class="flex flex-col w-full">
    <TopBar></TopBar>
    <div class="w-full py-10 px-5" v-if="formBuild.show === true">
      <div class="w-full mx-auto border-2 border-gray-300 rounded-lg">
        <div class="pt-10 px-10 flex flex-row justify-between">
          <h1 class="font-bold text-xl">{{ formBuild.header }}</h1>
          <div>
            <router-link to="/products" class="bg-blue-500 text-white p-2 rounded flex flex-row items-center gap-2">
              <svg fill="currentColor" height="18px" width="18px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 26.676 26.676" xml:space="preserve">
                <g>
                  <path d="M26.105,21.891c-0.229,0-0.439-0.131-0.529-0.346l0,0c-0.066-0.156-1.716-3.857-7.885-4.59 c-1.285-0.156-2.824-0.236-4.693-0.25v4.613c0,0.213-0.115,0.406-0.304,0.508c-0.188,0.098-0.413,0.084-0.588-0.033L0.254,13.815 C0.094,13.708,0,13.528,0,13.339c0-0.191,0.094-0.365,0.254-0.477l11.857-7.979c0.175-0.121,0.398-0.129,0.588-0.029 c0.19,0.102,0.303,0.295,0.303,0.502v4.293c2.578,0.336,13.674,2.33,13.674,11.674c0,0.271-0.191,0.508-0.459,0.562 C26.18,21.891,26.141,21.891,26.105,21.891z" />
                </g>
              </svg>
              Back to Product List
            </router-link>
          </div>
        </div>
        <form class="px-10 py-10 flex flex-col gap-5">
          <div v-if="formStep.step >= 1">
            <div class="form-group">
              <label>Name</label>
              <Input v-model="formData.name" placeholder="Enter Product Name" @input="stepOneValidation('text', $event)" />
              <span class="text-red-500 error-message"></span>
            </div>
            <div class="form-group">
              <label>Category</label>
              <Select v-model="formData.category" :options="Categories" @change="stepOneValidation('select', $event)" />
              <span class="text-red-500 error-message"></span>
            </div>
            <div ref="editorRef" class="form-group">
              <label>Description</label>
              <ckeditor :editor="ClassicEditor" v-model="formData.description"></ckeditor>
              <span class="text-red-500 error-message"></span>
            </div>
          </div>
          <div ref="fileRef" v-if="formStep.step >= 2">
            <label>Upload Images</label>
            <input multiple v-on:change="stepTwoValidation" accept="image/x-png,image/gif,image/jpeg" class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" aria-describedby="file_input_help" id="file_input" type="file" />
            <p class="mt-1 text-sm text-gray-500" id="file_input_help">PNG, JPG or JPEG only.</p>
            <span class="text-red-500 error-message"></span>
          </div>
          <div ref="dateTimeRef" v-if="formStep.step >= 3">
            <label>Date/Time Created</label>
            <VueDatePicker v-model="formData.dateTimeCreated" @update:model-value="changeDateTime" :is-24="false" @blur="stepThreeValidation"></VueDatePicker>
            <span class="text-red-500 error-message"></span>
          </div>
        </form>
        <div class="w-full p-5" v-if="formStep.step >= 4 && formStep.submit === true">
          <button class="bg-blue-500 text-white w-full p-2 rounded m-auto" @click="submitData">
            {{ formBuild.button }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
