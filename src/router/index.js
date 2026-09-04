import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BookingView from '@/views/customer/BookingView.vue'
import AboutView from '@/views/customer/AboutView.vue'
import ContactView from '@/views/customer/ContactView.vue'
import ProfileView from '@/views/customer/ProfileView.vue'
import BookingdetailView from '@/views/customer/BookingdetailView.vue'
import DashboardMg from '@/views/DashboardMg.vue'
import DashboardAdmin from '@/views/DashboardAdmin.vue'
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
      component: DashboardAdmin
    },
    {
      path:'/manager',
      name:'manager',
      component: DashboardMg
    },
    {
      path:'/booking',
      name:'booking',
      component: BookingView
    },
    {
      path:'/about',
      name:'about',
      component: AboutView
    },
    {
      path:'/contact',
      name:'contact',
      component: ContactView
    },
    {
      path:'/profile',
      name:'profile',
      component: ProfileView
    },
    {
      path:'/detail/:id',
      name:'detail',
      component: BookingdetailView
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
