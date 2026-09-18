<template>
    <div class="topbar">
        <div class="d-flex align-items-center gap-3 ps-4">
            <button class="icon-btn" @click="toggleSidebar" title="Toggle Sidebar">
                <i class="bi bi-layout-sidebar"></i>
            </button>
            <div>
                <div class="page-title">{{ title }}</div>
                <div class="page-subtitle">{{ subtitle }}</div>
            </div>
        </div>
        <div class="d-flex align-items-center gap-3 pe-4">
            <router-link to="/admin/ad-notification" class="icon-btn position-relative">
               <i class="bi bi-bell"></i>
               <span class="notification-badge">{{ notificationCount }}</span>
            </router-link>
            <div class="user-chip">
                <div v-if="userAvatar" class="avatar-circle p-0 overflow-hidden border-0">
                    <img :src="userAvatar" alt="Avatar" class="w-100 h-100 object-fit-cover" />
                </div>
                <div v-else class="avatar-circle">{{ userInitial }}</div>
                <div>
                    <div class="name">{{ userName }}</div>
                    <div class="sub">{{ userRole }}</div>
                </div>
                <i class="fa-solid fa-chevron-down text-muted small ms-1"></i>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAdminStore } from '@/stores/admin'

defineProps({
    title: { type: String, required: true },
    subtitle: { type: String, default: '' }
})

const authStore = useAuthStore()
const adminStore = useAdminStore()

const toggleSidebar = () => {
    if (window.innerWidth <= 991) {
        document.getElementById('sidebar')?.classList.toggle('show')
    } else {
        document.getElementById('sidebar')?.classList.toggle('collapsed')
        document.getElementById('main')?.classList.toggle('expanded')
    }
}

onMounted(async () => {
    if (!authStore.user) {
        await authStore.getMe()
    }
    // Fetch notifications to show the count in the topbar
    adminStore.getNotification()
})

const notificationCount = computed(() => {
    let responseData = adminStore.notification;
    let list = [];
    
    // Safely extract the notifications array
    if (responseData && responseData.data && Array.isArray(responseData.data.data)) {
        list = responseData.data.data;
    } else if (responseData && Array.isArray(responseData.data)) {
        list = responseData.data;
    } else if (Array.isArray(responseData)) {
        list = responseData;
    }
    
    // Count how many are unread
    const unread = list.filter(notif => notif.read_at === null || notif.is_read === false);
    return unread.length;
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

<style scoped>
.page-title {
    font-size: 1.25rem;
    font-weight: 700;
}
.page-subtitle {
    font-size: 0.875rem;
    color: #6c757d;
}
.icon-btn {
    background: #f1f5f9;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    position: relative;
    cursor: pointer;
}
.notification-badge {
    position: absolute;
    top: -2px;
    right: -2px;
    background-color: #ef4444;
    color: white;
    font-size: 10px;
    font-weight: bold;
    min-width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    border: 2px solid #ffffff;
}
.user-chip {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6px 12px;
    border-radius: 30px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    cursor: pointer;
}
.avatar-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #035e4e;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 14px;
}
</style>
