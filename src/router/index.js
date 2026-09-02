import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminView from '@/views/admin/AdminView.vue'
import ManagerView from '@/views/customer/ManagerView.vue'
import SmeyView from '@/views/SmeyView.vue'
import TheaView from '@/views/TheaView.vue'
import green from '@/views/green.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/manager',
      name: 'manager',
      component: ManagerView,
    },
    {
      path:'/admin',
      name:'admin',
      component: AdminView
    },
    {
      path:'/smey',
      name: 'smey',
      component: SmeyView
    },
    {
      path:'/green',
      name: 'green',
      component: green
    },
    {
      path: '/theara',
      name: 'theara',
      component:TheaView
    }
  ],
})

export default router
