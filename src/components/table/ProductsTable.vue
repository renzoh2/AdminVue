<script setup>
import { Pagination, Alert, Input, Select } from 'flowbite-vue';
import { productStore } from './../../store/products';
import { ref, reactive, onMounted } from 'vue';
import router from './../../router';

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
  search: null,
  filter: null,
  order: 'asc'
});

const alert = reactive({
  status: false
});

onMounted(async () => {
  const { data } = await productStore().fetchData(filter);
  dataTable.tableData = data.data;
  dataTable.totalItems = data.records;
  dataTable.countItems = data.count;
  dataTable.totalPages = dataTable.records / data.count;
});

if (productStore().getStatus == 'Success') {
  alert.status = true;
  setTimeout(function () {
    alert.status = false;
  }, 6000);
  productStore().resetStatus();
}

const refreshPage = async (e) => {
  filter.page = e;
  const { data } = await productStore().fetchData(filter);
  dataTable.tableData = data.data;
};

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

const categories = [
  { name: 'All Products' },
  { value: 'Bag', name: 'Bag' },
  { value: 'Shirt', name: 'Shirt' },
  { value: 'Shoes', name: 'Shoes' },
  { value: 'Pants', name: 'Pants' },
  { value: 'Dress', name: 'Dress' },
  { value: 'Appliances', name: 'Appliances' },
  { value: 'Tech', name: 'Tech' }
];

const editProduct = (id) => {
  router.push({ name: 'products.edit', params: { id } });
};

const deleteProduct = async (id) => {
  console.log(id);
  await productStore().deleteData(id);
  const { data } = await productStore().fetchData(filter);
  dataTable.tableData = data.data;
};

const requestData = async () => {
  filter.page = 1;
  const { data } = await productStore().fetchData(filter);
  dataTable.tableData = data.data;
  dataTable.totalItems = data.records;
  dataTable.countItems = data.count;
  dataTable.totalPages = dataTable.records / data.count;
};
</script>
<template>
  <div class="w-full p-10">
    <div class="relati7u8ve overflow-x-auto py-10">
      <div class="pb-2" v-if="alert.status === true">
        <Alert type="success" border icon> Success alert! Change a few things up and try submitting again. </Alert>
      </div>
      <div class="pb-2 flex flex-row justify-between">
        <router-link to="/products/create" class="bg-blue-500 text-white hover:bg-blue-700 px-5 py-2 rounded">Create</router-link>
        <div class="flex flex-row gap-2">
          <div>Total Records: {{ dataTable.totalItems }}</div>
          <div>Per Page: {{ dataTable.countItems }}</div>
          <Input placeholder="Search Product" v-model="filter.search" @Input="requestData">
            <template #prefix>
              <svg
                aria-hidden="true"
                class="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </template>
          </Input>
          <Select v-model="filter.filter" @Change="requestData" :options="categories" />
        </div>
      </div>
      <table hoverable class="w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-5">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">Product name</th>
            <th scope="col" class="px-6 py-3">Category</th>
            <th scope="col" class="px-6 py-3">Description</th>
            <th scope="col" class="px-6 py-3">Date/Time</th>
            <th scope="col" class="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody v-for="rowItems in dataTable.tableData" v-bind:key="rowItems.id">
          <tr class="bg-white border-b hover:bg-gray-50 hover:bg-gray-600 text-gray-800 hover:text-white">
            <th scope="row" class="px-6 py-4 font-medium whitespace-nowrap">
              {{ rowItems.name }}
            </th>
            <td class="px-6 py-4">
              {{ rowItems.category }}
            </td>
            <td class="px-6 py-4">
              {{ rowItems.description }}
            </td>
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
      <Pagination
        v-model="currentPage"
        :per-page="dataTable.countItems"
        :total-pages="dataTable.totalPages"
        :slice-length="dataTable.countItems"
        :total-items="dataTable.totalItems"
        @page-changed="refreshPage"
      ></Pagination>
    </div>
  </div>
</template>
