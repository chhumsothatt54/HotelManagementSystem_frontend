<template>

    <aside id="sidebar">
        <button class="sidebar-toggle" id="sidebarToggle" title="Collapse sidebar">
            <i class="fa-solid fa-chevron-left"></i>
        </button>

        <RouterLink to="/" class="brand-box text-decoration-none text-dark">
            <div class="brand-logo overflow-hidden border-0 p-0" style="background: transparent;">
                <img src="@/assets/image/hotel_logo.jpg" alt="logo" class="w-100 h-100 object-fit-cover">
            </div>
            <div class="brand-text">
                <div class="brand-title">AngkorStay Hotel</div>
                <div class="brand-sub">Admin Console</div>
            </div>
        </RouterLink>

        <div class="sidebar-content">
            <div class="nav-section-label">Overview</div>
            <RouterLink to="/admin/dashboard" class="sidebar-link " active-class="active" exact-active-class="active">
                <i class="bi bi-grid"></i>
                <span class="link-text">Dashboard</span>
            </RouterLink>

            <div class="nav-section-label">Users</div>
            <RouterLink to="/admin/user" class="sidebar-link" active-class="active" exact-active-class="active">
                <i class="bi bi-person-badge"></i>
                <span class="link-text">Users</span>
            </RouterLink>
            <RouterLink to="/admin/hotel-manager" class="sidebar-link" active-class="active" exact-active-class="active">
                <i class="bi bi-building-fill"></i>
                <span class="link-text">Hotel Managers</span>
            </RouterLink>

            <div class="nav-section-label">Properties</div>
            <RouterLink to="/admin/hotels" class="sidebar-link" active-class="active" exact-active-class="active">
                <i class="bi bi-buildings-fill"></i>
                <span class="link-text">Hotels</span>
            </RouterLink>
            <RouterLink to="/admin/ad-room-type" class="sidebar-link" active-class="active" exact-active-class="active">
                <i class="bi bi-ui-checks-grid"></i>
                <span class="link-text">Room Types</span>
            </RouterLink>
            <RouterLink to="/admin/ad-rooms" class="sidebar-link" active-class="active" exact-active-class="active">
                <i class="bi bi-door-open"></i>
                <span class="link-text">Rooms</span>
            </RouterLink>
            <RouterLink to="/admin/ad-amenity" class="sidebar-link" active-class="active" exact-active-class="active">
                <i class="bi bi-stars"></i>
                <span class="link-text">Amenities</span>
            </RouterLink>

            <div class="nav-section-label">Bookings</div>
            <RouterLink to="/admin/ad-booking" class="sidebar-link" active-class="active" exact-active-class="active">
                <i class="bi bi-calendar-check"></i>
                <span class="link-text">Bookings</span>
            </RouterLink>
            <RouterLink to="/admin/ad-payment" class="sidebar-link" active-class="active" exact-active-class="active">
                <i class="bi bi-credit-card"></i>
                <span class="link-text">Payments</span>
            </RouterLink>
            <RouterLink to="/admin/review" class="sidebar-link" active-class="active" exact-active-class="active">
                <i class="bi bi-star"></i>
                <span class="link-text">Reviews</span>
            </RouterLink>
            <div class="nav-section-label">Report</div>

            <RouterLink to="/admin/ad-revenue" class="sidebar-link" active-class="active" exact-active-class="active">
                <i class="bi bi-graph-up-arrow"></i>
                <span class="link-text">Revenue Report</span>
            </RouterLink>
            <RouterLink to="/admin/ad-occupancy" class="sidebar-link" active-class="active" exact-active-class="active">
                <i class="bi bi-pie-chart"></i>
                <span class="link-text">Occupancy Report</span>
            </RouterLink>
        </div>

        <div class="sidebar-footer">
            <RouterLink to="/admin/ad-profile" class="sidebar-user text-decoration-none" active-class="active" exact-active-class="active">
                <div v-if="userAvatar" class="avatar-circle overflow-hidden border-0 p-0">
                    <img :src="userAvatar" alt="Admin Avatar" class="w-100 h-100 object-fit-cover" />
                </div>
                <div v-else class="avatar-circle">{{ userInitial }}</div>
                
                <div class="link-text">
                    <div class="name">{{ userName }}</div>
                    <div class="role">{{ userRole }}</div>
                </div>
                <i class="fa-solid fa-chevron-right link-text ms-auto text-white-50"></i>
            </RouterLink>
        </div>
    </aside>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(async () => {
    if (!authStore.user) {
        await authStore.getMe()
    }
})

const userName = computed(() => authStore.user?.name || 'Platform Admin')
const userRole = computed(() => {
    const role = authStore.user?.role
    if (role === 'admin') return 'Administrator'
    if (role === 'hotel_manager') return 'Hotel Manager'
    return 'User'
})

const userAvatar = computed(() => {
    if (authStore.user?.avatar) {
        const path = authStore.user.avatar
        return path.startsWith('http') ? path : `http://127.0.0.1:8000/storage/${path}`
    }
    return null
})

const userInitial = computed(() => {
    return authStore.user?.name ? authStore.user.name.charAt(0).toUpperCase() : 'A'
})
</script>