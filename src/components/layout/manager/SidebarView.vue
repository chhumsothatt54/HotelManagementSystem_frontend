<template>

    <div>
        <aside class="hm-sidebar" :class="{ 'hm-sidebar--open': sidebarOpen }">
            <!-- Brand -->
            <div class="hm-brand">
                <div class="hm-brand-mark">
                    {{ hotel.name?.charAt(0) || "H" }}
                </div>

                <div class="hm-brand-text">
                    <strong>{{ hotel.name }}</strong>
                    <span>Manager Portal</span>
                </div>

                <button class="hm-mobile-close" type="button" aria-label="Close menu" @click="sidebarOpen = false">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>

            <!-- Navigation -->
            <nav class="hm-nav">
                <div v-for="group in navGroups" :key="group.title" class="hm-nav-group">
                    <div class="hm-nav-label">
                        {{ group.title }}
                    </div>

                    <button v-for="item in group.items" :key="item.key" type="button" class="hm-nav-item"
                        :class="{ active: activeView === item.key }" @click="setView(item.key)">
                        <i :class="item.icon"></i>
                        <span>{{ item.label }}</span>
                    </button>
                </div>
            </nav>

            <!-- Sidebar Footer -->
            <div class="hm-sidebar-footer">
                <button type="button" class="hm-manager-mini" @click="setView('managerProfile')">
                    <div class="hm-avatar">M</div>

                    <div class="hm-manager-info">
                        <strong>Sokha Manager</strong>
                        <span>Hotel Manager</span>
                    </div>

                    <i class="bi bi-chevron-right"></i>
                </button>
            </div>
        </aside>
    </div>
</template>

<script setup>
import { reactive,ref } from 'vue';

/* =========================================================
   DESIGN
========================================================= */

const sidebarOpen = ref(false);
const activeView = ref("dashboard");

///yyy

/* =========================================================
   DATE
========================================================= */

const todayDate = new Date();

const today = computed(() =>
  todayDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
);

/* =========================================================
   HOTEL
========================================================= */

const hotel = reactive({
    name: "Mekong Riverside Hotel",
    stars: 4,
    phone: "+855 12 345 678",
    email: "info@mekongriverside.com",
    address: "Phnom Penh, Cambodia",
    description:
        "A modern riverside hotel offering comfortable rooms, excellent hospitality and convenient access to the city.",
    checkIn: "14:00",
    checkOut: "12:00",
});


const manager = reactive({
    firstName: "Sokha",
    lastName: "Manager",
    email: "sokha@example.com",
    phone: "+855 12 345 678",
});

function saveManagerProfile() {
    alert("Profile updated successfully.");
}

function changePassword() {
    alert("Password change screen will be connected here.");
}

/* =========================================================
   NAVIGATION
========================================================= */


const navGroups = [
    {
        title: "Account",
        items: [
            {
                key: "managerProfile",
                label: "My Profile",
                description: "Manage your manager account",
                icon: "bi bi-person-circle",
            },
        ],
    },
    {
        title: "Overview",
        items: [
            {
                key: "dashboard",
                label: "Dashboard",
                description: "Property performance overview",
                icon: "bi bi-grid-1x2",
            },
        ],
    },
    {
        title: "Property Setup",
        items: [
            {
                key: "profile",
                label: "Hotel Profile",
                description: "Manage hotel information",
                icon: "bi bi-building",
            },
            {
                key: "hotelImages",
                label: "Hotel Images",
                description: "Manage property images",
                icon: "bi bi-images",
            },
        ],
    },
    {
        title: "Rooms",
        items: [
            {
                key: "rooms",
                label: "Rooms",
                description: "Manage hotel rooms",
                icon: "bi bi-door-open",
            },
            {
                key: "roomTypes",
                label: "Room Types",
                description: "Configure room categories",
                icon: "bi bi-grid",
            },
            {
                key: "roomImages",
                label: "Room Images",
                description: "Manage room photos",
                icon: "bi bi-image",
            },
            {
                key: "amenities",
                label: "Amenities",
                description: "Manage hotel amenities",
                icon: "bi bi-stars",
            },
            {
                key: "pricing",
                label: "Pricing",
                description: "Manage room pricing",
                icon: "bi bi-tags",
            },
        ],
    },
    {
        title: "Bookings",
        items: [
            {
                key: "bookings",
                label: "Bookings",
                description: "Manage guest reservations",
                icon: "bi bi-calendar-check",
            },
        ],
    },
    {
        title: "Insights",
        items: [
            {
                key: "revenue",
                label: "Revenue",
                description: "Monitor financial performance",
                icon: "bi bi-graph-up-arrow",
            },
            {
                key: "occupancy",
                label: "Occupancy",
                description: "Track room utilization",
                icon: "bi bi-pie-chart",
            },
            {
                key: "bookingReports",
                label: "Booking Reports",
                description: "Reservation reports",
                icon: "bi bi-file-earmark-bar-graph",
            },
            {
                key: "revenueReports",
                label: "Revenue Reports",
                description: "Financial reports",
                icon: "bi bi-file-earmark-spreadsheet",
            },
        ],
    },
];

const currentNavItem = computed(() => {
    for (const group of navGroups) {
        const item = group.items.find(
            (item) => item.key === activeView.value
        );

        if (item) return item;
    }

    return navGroups[0].items[0];
});
</script>