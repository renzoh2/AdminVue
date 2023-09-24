import { createRouter, createWebHistory } from 'vue-router';
import { userStore } from './../store/user';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/indexView.vue')
    },
    {
      path: '/products',
      name: 'admin.index',
      component: () => import('../views/adminView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/products/create',
      name: 'products.create',
      component: () => import('../views/productFormView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/products/edit/:id',
      name: 'products.edit',
      component: () => import('../views/productFormView.vue'),
      meta: { requiresAuth: true },
      props: (route) => ({ id: route.query.id })
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (userStore().getIsAuth) {
      next();
    } else {
      router.push({ name: 'home' });
      next();
    }
  } else {
    if (userStore().isAuth) {
      router.push({ name: 'admin.index' });
      next();
    } else {
      next();
    }
  }
});

export default router;
