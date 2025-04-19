import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';

// Import Views
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Home from '../views/Home.vue';

// Tạo router
const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },

  // Admin Routes
  {
    path: '/admin',
    component: () => import('../views/Admin.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      { path: '', component: () => import('../views/admin/AdminDashboard.vue') },
      { path: 'products', component: () => import('../components/admin/ProductList.vue') },
      { path: 'category', component: () => import('../components/admin/CategoryList.vue') },
      { path: 'orders', component: () => import('../components/admin/OrderList.vue') },
      { path: 'customers', component: () => import('../components/admin/CustomersList.vue') },
    ]
  },

  // Product Detail Routes
  {
    path: '/admin/products/:id/edit',
    component: () => import('../views/admin/EditProduct.vue'),
  },
  {
    path: '/admin/products/:id',
    name: 'product-detail',
    component: () => import('../views/admin/ProductDetail.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/products/add',
    component: () => import('../views/admin/AddProduct.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },

  // Category Routes
  {
    path: '/admin/categories/add',
    component: () => import('../views/admin/categories/AddCategories.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/categories/:category_id/products',
    name: 'CategoryProducts',
    component: () => import('../components/admin/CategoriesProduct.vue')
  },
  {
    path: '/admin/categories/:category_id/edit',
    name: 'EditCategory',
    component: () => import('../views/admin/categories/EditCategories.vue')
  },

  // Order Detail Route

  {
    path: '/admin/orders/:id/detail',  
    name: 'Order-detail',
    component:()=> import('../views/admin/order/OrderDetail.vue'),
  },
  
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token');
  const requiresAuth = to.meta.requiresAuth;

 
  if (requiresAuth && !token) {
    return next('/login');
  }

 
  if (requiresAuth && token) {
    try {
      const response = await axios.get('/user', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userRole = response.data.role;

     
      if (to.meta.role && to.meta.role !== userRole) {
        return next('/'); 
      }

      return next();
    } catch (err) {
      console.error('Lỗi xác thực:', err);
      localStorage.removeItem('token'); 
      return next('/login');
    }
  }


  return next();
});

export default router;
