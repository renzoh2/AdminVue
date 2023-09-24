<script setup>
import { Pagination, Alert, Input, Select } from 'flowbite-vue';
import { productStore } from './../../store/products';
import { ref, reactive, onMounted } from 'vue';
import router from './../../router';
import TopBar from './../navigation/TopBar.vue';
import { Categories } from './../../const';
const dataTable = reactive({
  tableData: null,
  totalItems: 0,
  countItems: 0,
  totalPages: 0
});

const filter = reactive({
  page: 1,
  limit: 10,
  sort: 'name',
  search: '',
  filter: '',
  order: 'asc'
});

const alert = reactive({
  trigger: false,
  status: '',
  title: '',
  message: ''
});

onMounted(async () => {
  const { data } = await productStore().fetchData(filter);
  dataTable.tableData = data.data;
  dataTable.totalItems = data.records;
  dataTable.countItems = data.count;
  dataTable.totalPages = Math.ceil(data.records / filter.limit);
  if (productStore().status != '') {
    alert.trigger = true;
    alert.status = productStore().status.toLowerCase();
    alert.title = productStore().title;
    alert.message = productStore().message;
    setTimeout(function () {
      alert.trigger = false;
      alert.status = '';
      alert.title = '';
      alert.message = '';
    }, 6000);
    productStore().resetStatus();
  }
});

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const d = new Date(date);
  const result = d.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
  return `${month}/${day}/${year} ${result}`;
};

const currentPage = ref(1);

const editProduct = (id) => {
  router.push({ name: 'products.edit', params: { id } });
};

const deleteProduct = async (id) => {
  await productStore().deleteData(id);
  dataTable.countItems = dataTable.countItems - 1;
  requestData();
};

const requestData = async (e) => {
  if (e != null) filter.page = e;

  if (dataTable.countItems == 0) {
    filter.page = currentPage.value - 1;
    currentPage.value = filter.page;
  }
  const { data } = await productStore().fetchData(filter);
  dataTable.totalItems = data.records;
  dataTable.countItems = data.count;
  dataTable.tableData = data.data;
  dataTable.totalPages = Math.ceil(data.records / filter.limit);
};
</script>
<template>
  <div class="flex flex-col w-full">
    <TopBar></TopBar>
    <div class="w-full py-2 px-10">
      <div class="relative overflow-x-auto py-10">
        <div class="pb-2" v-if="alert.trigger === true">
          <Alert type="success" border icon v-if="alert.status === 'success'">
            <b>{{ alert.title }}</b> {{ alert.message }}
          </Alert>
          <Alert type="danger" border icon v-if="alert.status === 'fail'">
            <b>{{ alert.title }}</b> {{ alert.message }}
          </Alert>
        </div>
        <div class="pb-2 flex flex-row justify-between">
          <router-link to="/products/create" class="bg-blue-500 text-white hover:bg-blue-700 px-5 py-2 rounded">Create</router-link>
          <div class="flex flex-row gap-2 items-center">
            <div>Total Records: {{ dataTable.totalItems }}</div>
            <div>Per Page: {{ dataTable.countItems }}</div>
            <Input placeholder="Search Product" v-model="filter.search" @Input="requestData">
              <template #prefix>
                <svg aria-hidden="true" class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </template>
            </Input>
            <Select v-model="filter.filter" @Change="requestData" :options="Categories" />
          </div>
        </div>
        <table hoverable class="w-full text-sm text-left text-gray-400 mt-5">
          <thead class="text-xs text-gray-400 uppercase bg-gray-500">
            <tr>
              <th scope="col" class="px-6 py-3">Product name</th>
              <th scope="col" class="px-6 py-3">Category</th>
              <th scope="col" class="px-6 py-3">Description</th>
              <th scope="col" class="px-6 py-3">Date/Time</th>
              <th scope="col" class="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white border-b hover:bg-gray-50 hover:bg-gray-600 text-gray-800 hover:text-white" v-for="rowItems in dataTable.tableData" v-bind:key="rowItems.id">
              <td scope="row" class="px-6 py-4 font-medium whitespace-nowrap">
                {{ rowItems.name }}
              </td>
              <td class="px-6 py-4">
                {{ rowItems.category }}
              </td>
              <td class="px-6 py-4" v-html="rowItems.description"></td>
              <td class="px-6 py-4">
                {{ formatDate(new Date(rowItems.datetime_created)) }}
              </td>
              <td class="px-6 py-4 flex gap-1">
                <button class="font-medium hover:bg-blue-400 rounded-md py-2 px-2" @click="editProduct(rowItems.id)">Edit</button>
                <button class="font-medium hover:bg-red-400 rounded-md py-2 px-2" @click="deleteProduct(rowItems.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        <Pagination v-model="currentPage" :perPage="dataTable.countItems" :totalPages="dataTable.totalPages" :totalItems="dataTable.totalItems" @update:model-value="requestData"></Pagination>
      </div>
    </div>
  </div>
</template>
