import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";

import DashMgView from "@/views/manager/DashMgView.vue";
import DashboardMg from "@/views/DashboardMg.vue";

import DemoMg from "@/views/DemoMg.vue";
import DemoAdmin from "@/views/DemoAdmin.vue";

import BookingView from "@/views/customer/BookingView.vue";
import ContactView from "@/views/customer/ContactView.vue";
import AboutView from "@/views/customer/AboutView.vue";

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

import DashboardAdmin from "@/views/DashboardAdmin.vue";
import DashAdView from "@/views/admin/DashAdView.vue";
import UserView from "@/views/admin/UserView.vue";

import LoginView from "@/views/auth/LoginView.vue";
import RegisterView from "@/views/auth/RegisterView.vue";
import ForgotPasswordView from "@/views/auth/ForgotPasswordView.vue";

import { useAuthStore } from "@/stores/auth.js";

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
        path: "/booking",
        name: "customer-booking",
        component: BookingView,

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

        ],

    },

],


});

// ==================================
// Navigation Guard
// ==================================

router.beforeEach((to, from) => {

const auth = useAuthStore();


// Check Authentication
if (to.meta.requireAuth && !auth.isLogin) {

    return {
        name: "login",
    };

}


// Check Role
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
