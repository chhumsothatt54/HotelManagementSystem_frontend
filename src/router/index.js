import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminView from '@/views/admin/AdminView.vue'
import ManagerView from '@/views/manager/ManagerView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import ForgotPasswordView from '@/views/auth/ForgotPasswordView.vue'
import InputOtp from '@/views/auth/InputOtp.vue'
import ResetPasswordView from '@/views/auth/ResetPasswordView.vue'

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
    },
    {
      path:'/register',
      name:'register',
      component: RegisterView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },

    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },

    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordView
    },

    {
      path: '/input-otp',
      name: 'input-otp',
      component: InputOtp
    },

    {
      path: '/reset-password',
      name: 'reset-password',
      component: ResetPasswordView
    }

  ],
})

export default router
