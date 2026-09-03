import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminView from '@/views/admin/AdminView.vue'
import ManagerView from '@/views/manager/ManagerView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path:'/admin',
      name:'admin',
      component: AdminView
    },
    {
      path:'/manager',
      name:'manager',
      component: ManagerView
    }
  ],
})

export default router
