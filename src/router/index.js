import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";

import DashMgView from "@/views/manager/DashMgView.vue";
import DashboardMg from "@/views/DashboardMg.vue";

import DemoMg from "@/views/DemoMg.vue";
import DemoAdmin from "@/views/DemoAdmin.vue";

// Customer Views
import HoteldetailView from "@/views/customer/Hoteldetailview.vue";
import BookingView from "@/views/customer/BookingView.vue";
import BookingdetailView from "@/views/customer/BookingdetailView.vue"; 
import PaymentView from "@/views/customer/PaymentView.vue";
import ContactView from "@/views/customer/ContactView.vue";
import AboutView from "@/views/customer/AboutView.vue";
import Cus_ProfileView from "@/views/customer/Cus_ProfileView.vue";

// Manager Views
import ProfileView from "@/views/manager/ProfileView.vue";
import HotelimageView from "@/views/manager/HotelimageView.vue";
import RoomView from "@/views/manager/RoomView.vue";
import RoomTypeView from "@/views/manager/RoomTypeView.vue";
import RoomImageView from "@/views/manager/RoomImageView.vue";
import AmenityView from "@/views/manager/AmenityView.vue";
import PricingView from "@/views/manager/PricingView.vue";
import RevenView from "@/views/manager/RevenView.vue";
import OccupancyView from "@/views/manager/OccupancyView.vue";
import BookingsView from "@/views/manager/BookingsView.vue";
import ConnectAmenityView from '@/views/manager/ConnectAmenityView.vue';
import MangeHotelView from "@/views/manager/MangeHotelView.vue";

// Admin Views
import DashboardAdmin from "@/views/DashboardAdmin.vue";
import DashAdView from "@/views/admin/DashAdView.vue";
import UserView from "@/views/admin/UserView.vue";
import HotelMagerView from "@/views/admin/HotelMagerView.vue";
import HotelView from "@/views/admin/HotelView.vue";
import ReviewView from "@/views/admin/ReviewView.vue";
import Ad_RoomTypeView from "@/views/admin/Ad_RoomTypeView.vue";
import Ad_RoomView from "@/views/admin/Ad_RoomView.vue";
import Ad_AmenityView from "@/views/admin/Ad_AmenityView.vue";
import Ad_BookingView from "@/views/admin/Ad_BookingView.vue";
import Ad_PaymentView from "@/views/admin/Ad_PaymentView.vue";
import Ad_RevenueReportView from "@/views/admin/Ad_RevenueReportView.vue";
import Ad_OccupancyReport from "@/views/admin/Ad_OccupancyReport.vue";
import Ad_ProfileView from "@/views/admin/Ad_ProfileView.vue";

// Auth Views
import LoginView from "@/views/auth/LoginView.vue";
import RegisterView from "@/views/auth/RegisterView.vue";
import ForgotPasswordView from "@/views/auth/ForgotPasswordView.vue";
import GoogleCallbackView from "@/views/GoogleCallbackView.vue";
import InputOtp from "@/views/auth/InputOtp.vue";
import ResetPasswordView from "@/views/auth/ResetPasswordView.vue";
import ChangePasswordView from "@/views/auth/ChangePasswordView.vue";

import { useAuthStore } from "@/stores/auth.js";
import BookingReport from "@/views/manager/BookingReport.vue";
import RevenueReport from "@/views/manager/RevenueReport.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    // =============================
    // Public Routes
    // =============================
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/auth/google/callback",
      name: "google-callback",
      component: GoogleCallbackView,
    },
    {
      path: "/input-otp",
      name: "input-otp",
      component: InputOtp,
    },
    {
      path: "/reset-password",
      name: "resend-password",
      component: ResetPasswordView,
    },
    {
      path: "/change-password",
      name: "change-password",
      component: ChangePasswordView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/forgot-password",
      name: "forgot-password",
      component: ForgotPasswordView,
    },
    {
      path: "/contact",
      name: "contact",
      component: ContactView,
    },
    {
      path: "/about",
      name: "about",
      component: AboutView,
    },

    // =============================
    // Demo Routes
    // =============================
    {
      path: "/demomg",
      name: "demo-manager",
      component: DemoMg,
    },
    {
      path: "/demoadmin",
      name: "demo-admin",
      component: DemoAdmin,
    },

    // =============================
    // Customer Routes
    // =============================
    {
      path: "/hotel/:id",
      name: "hotel-detail",
      component: HoteldetailView,
    },
    {
      path: "/booking/:id?",
      name: "customer-booking",
      component: BookingView,
    },
    {
      path: "/booking-detail",
      name: "customer-booking-detail",
      component: BookingdetailView,
    },
    {
      path: "/payment",
      name: "customer-payment",
      component: PaymentView,
    },
    {
      path: '/settings',
      name: 'settings',
      component: Cus_ProfileView,
      meta: {
        requireAuth: true,
        roles: ['customer']
      },
    },

    // =============================
    // Admin Routes
    // =============================
    {
      path: "/admin",
      component: DashboardAdmin,
      meta: {
        requireAuth: true,
        roles: ["admin"],
      },
      children: [
        {
          path: "",
          redirect: {
            name: "admin-dashboard",
          },
        },
        {
          path: "dashboard",
          name: "admin-dashboard",
          component: DashAdView,
          meta: {
            requireAuth: true,
            roles: ["admin"],
          },
        },
        {
          path: "user",
          name: "admin-user",
          component: UserView,
          meta: {
            requireAuth: true,
            roles: ["admin"],
          },
        },
        {
          path: "hotel-manager",
          name: "hotel-manager",
          component: HotelMagerView,
          meta: {
            requireAuth: true,
            roles: ["admin"],
          },
        },
        {
          path: "hotels",
          name: "hotels",
          component: HotelView,
          meta: {
            requireAuth: true,
            roles: ["admin"],
          },
        },
        {
          path: "ad-room-type",
          name: "ad-room-type",
          component: Ad_RoomTypeView,
          meta: {
            requireAuth: true,
            roles: ["admin"],
          },
        },
        {
          path: "ad-rooms",
          name: "ad-rooms",
          component: Ad_RoomView,
          meta: {
            requireAuth: true,
            roles: ["admin"],
          },
        },
        {
          path: "ad-amenity",
          name: "ad-amenity",
          component: Ad_AmenityView,
          meta: {
            requireAuth: true,
            roles: ["admin"],
          },
        },
        {
          path: "ad-booking",
          name: "ad-booking",
          component: Ad_BookingView,
          meta: {
            requireAuth: true,
            roles: ["admin"],
          },
        },
        {
          path: "ad-payment",
          name: "ad-payment",
          component: Ad_PaymentView,
          meta: {
            requireAuth: true,
            roles: ["admin"],
          },
        },
        {
          path: "review",
          name: "review",
          component: ReviewView,
          meta: {
            requireAuth: true,
            roles: ["admin"],
          },
        },
        {
          path: "ad-revenue",
          name: "ad-revenue",
          component: Ad_RevenueReportView,
          meta: {
            requireAuth: true,
            roles: ["admin"],
          },
        },
        {
          path: "ad-occupancy",
          name: "ad-occupancy",
          component: Ad_OccupancyReport,
          meta: {
            requireAuth: true,
            roles: ["admin"],
          },
        },
        {
          path: "ad-profile",
          name: "ad-profile",
          component: Ad_ProfileView,
          meta: {
            requireAuth: true,
            roles: ["admin"],
          },
        },
      ],
    },

    // =============================
    // Manager Routes
    // =============================
    {
      path: "/manager",
      component: DashboardMg,
      meta: {
        requireAuth: true,
        roles: ["hotel_manager"],
      },
      children: [
        {
          path: "",
          redirect: {
            name: "manager-dashboard",
          },
        },
        {
          path: "manger-hotel",
          name: "manager-hotel",
          component: MangeHotelView,
          meta: {
            requireAuth: true,
            roles: ["hotel_manager"],
          },
        },
        {
          path: "dashboard",
          name: "manager-dashboard",
          component: DashMgView,
          meta: {
            requireAuth: true,
            roles: ["hotel_manager"],
          },
        },
        {
          path: "profile",
          name: "manager-profile",
          component: ProfileView,
          meta: {
            requireAuth: true,
            roles: ["hotel_manager"],
          },
        },
        {
          path: "hotel-image",
          name: "manager-hotel-image",
          component: HotelimageView,
          meta: {
            requireAuth: true,
            roles: ["hotel_manager"],
          },
        },
        {
          path: "room",
          name: "manager-room",
          component: RoomView,
          meta: {
            requireAuth: true,
            roles: ["hotel_manager"],
          },
        },
        {
          path: "room-type",
          name: "manager-room-type",
          component: RoomTypeView,
          meta: {
            requireAuth: true,
            roles: ["hotel_manager"],
          },
        },
        {
          path: "room-image",
          name: "manager-room-image",
          component: RoomImageView,
          meta: {
            requireAuth: true,
            roles: ["hotel_manager"],
          },
        },
        {
          path: "amenity",
          name: "manager-amenity",
          component: AmenityView,
          meta: {
            requireAuth: true,
            roles: ["hotel_manager"],
          },
        },
        {
          path: "connect-amenity",
          name: "manager-connect-amenity",
          component: ConnectAmenityView,
          meta: {
            requireAuth: true,
            roles: ["hotel_manager"],
          },
        },
        {
          path: "price",
          name: "manager-price",
          component: PricingView,
          meta: {
            requireAuth: true,
            roles: ["hotel_manager"],
          },
        },
        {
          path: "booking",
          name: "manager-booking",
          component: BookingsView,
          meta: {
            requireAuth: true,
            roles: ["hotel_manager"],
          },
        },
        {
          path: "revenue",
          name: "manager-revenue",
          component: RevenView,
          meta: {
            requireAuth: true,
            roles: ["hotel_manager"],
          },
        },
        {
          path: "occupancy",
          name: "manager-occupancy",
          component: OccupancyView,
          meta: {
            requireAuth: true,
            roles: ["hotel_manager"],    
          },
        },
          {
          path: "RevenueReport",
          name: "manager-revenue-report",
          component: RevenueReport,
          meta: {
            requireAuth: true,
            roles: ["hotel_manager"],
          },
        },
        {
          path: "BookingReport",
          name: "manager-occupancy-report",
          component: BookingReport,
          meta: {
            requireAuth: true,
            roles: ["hotel_manager"],    
          },
        },
      ],
    },
  ],
});

// Navigation Guard
router.beforeEach((to, from) => {
  const auth = useAuthStore();

  if (to.meta.requireAuth && !auth.isLogin) {
    return {
      name: "login",
    };
  }

  if (to.meta.roles) {
    const allowedRoles = to.meta.roles;

    if (!auth.user) {
      return {
        name: "login",
      };
    }

    if (!allowedRoles.includes(auth.user.role)) {
      return {
        name: "home",
      };
    }
  }

  return true;
});

export default router;