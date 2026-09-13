<template>
    <div class="topbar bg-white px-5">
        <div class="ps-4">
            <div class="page-title">{{ title }}</div>
            <div class="page-subtitle">{{ subtitle }}</div>
        </div>
        <div class="d-flex align-items-center gap-3 pe-4">
            <button class="icon-btn">
               <i class="bi bi-bell"></i>
                <span class="dot"></span>
            </button>
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

defineProps({
    title: { type: String, required: true },
    subtitle: { type: String, default: '' }
})

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

<style scoped>
.topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid #eef2f0;
}
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
.dot {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 8px;
    height: 8px;
    background-color: #ef4444;
    border-radius: 50%;
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
