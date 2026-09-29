<template>
    <div class="page-container">
        <!-- Topbar -->
        <AdminTopbar title="Notifications" subtitle="System notifications" />

        <!-- Notifications Panel -->
        <div class="p-4">
            <!-- Custom Page Header -->
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <div class="text-success font-xs fw-bold text-uppercase mb-1" style="letter-spacing: 1px;">SYSTEM
                    </div>
                    <div class="fw-bold fs-4 text-dark mb-1">Notifications</div>
                    <div class="text-muted font-sm">System-level notifications for admins.</div>
                </div>
                <button class="btn fw-bold d-flex align-items-center gap-2 mark-all-btn" @click="markAllAsRead">
                    <i class="bi bi-check2-all"></i> Mark all read
                </button>
            </div>

            <div class="panel-card p-4">
                <div class="notifications-list">
                    <div v-if="loading" class="text-center py-4 text-muted">
                        Loading notifications...
                    </div>
                    <div v-else-if="!notificationList.length" class="text-center py-4 text-muted">
                        No notifications found.
                    </div>
                    <div v-else class="notif-wrapper">
                        <div v-for="(notif, index) in notificationList" :key="index"
                            class="notif-item d-flex align-items-start gap-3"
                            :class="isUnread(notif) ? 'unread' : 'read'">

                            <div class="notif-icon-box flex-shrink-0 d-flex align-items-center justify-content-center">
                                <i :class="getIcon(notif)"></i>
                            </div>

                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-start mb-1">
                                    <h6 class="mb-0 fw-bold text-dark">{{ getTitle(notif) }}</h6>
                                    <div class="text-end">
                                        <div class="text-muted font-xs">{{ formatDate(notif.created_at || notif.date ||
                                            notif.updated_at) }}</div>
                                        <div v-if="isUnread(notif)"
                                            class="mt-2 text-success fw-bold font-sm cursor-pointer mark-read-text"
                                            @click="markAsRead(notif.id)">
                                            Mark read
                                        </div>
                                    </div>
                                </div>
                                <p class="mb-0 text-secondary font-sm mt-1">{{ getMessage(notif) }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import AdminTopbar from '@/components/layout/admin/AdminTopbar.vue'
import { ref, onMounted } from 'vue';
import { useAdminStore } from '@/stores/admin';

// --- STATE VARIABLES ---
const adminStore = useAdminStore();
const loading = ref(false);
const notificationList = ref([]);

const getnoti = async () => {
    loading.value = true;
    try {
        await adminStore.getNotification();
        notificationList.value = adminStore.notification?.data?.data || adminStore.notification?.data || [];
    } catch (error) {
        console.error("Failed to fetch notifications:", error);
    } finally {
        loading.value = false;
    }
}

const getTitle = (notif) => {
    return notif.title || 'System Notification';
}

const getMessage = (notif) => {
    return notif.message || '';
}

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
}

const isUnread = (notif) => {
    return notif.is_read == false || notif.is_read == 0;
}

const getIcon = (notif) => {
    switch (notif.type) {
        case 'booking_confirmed': return 'bi bi-calendar-check text-success';
        case 'checked_in': return 'bi bi-check-circle text-primary';
        case 'hotel_created': return 'bi bi-building text-info';
        case 'user_registered': return 'bi bi-person-plus text-warning';
        default: return 'bi bi-bell';
    }
}

const markAsRead = async (id) => {
    try {
        await adminStore.markNotificationAsRead(id);
        const notif = notificationList.value.find(n => n.id === id);
        if (notif) notif.is_read = true;
    } catch (error) {
        console.error("Failed to mark as read:", error);
    }
}

const markAllAsRead = async () => {
    try {
        await adminStore.markAllNotificationsAsRead();
        notificationList.value.forEach(n => n.is_read = true);
    } catch (error) {
        console.error("Failed to mark all as read:", error);
    }
}

onMounted(() => {
    getnoti();
})
</script>

<style scoped>
.page-container {
    background-color: var(--bg-card, #f6f8f7);
    min-height: 100vh;
}

.panel-card {
    background: var(--bg-card, #ffffff);
    border-radius: 16px;
    border: 1px solid #eef2f0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

.mark-all-btn {
    background-color: #def7ec;
    color: #035e4e;
    border: none;
    border-radius: 8px;
    padding: 10px 16px;
    font-size: 14px;
}

.mark-all-btn:hover {
    background-color: #c8eadd;
}

.notif-wrapper {
    display: flex;
    flex-direction: column;
}

.notif-item {
    padding: 24px 32px;
}

.notif-item.unread {
    background-color: #edf7f3;
    border-radius: 12px;
    margin-bottom: 16px;
    border: none;
}

.notif-item.read {
    background-color: transparent;
    border-bottom: 1px solid #eef2f0;
}

.notif-item.read:last-child {
    border-bottom: none;
}

.notif-icon-box {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    color: #035e4e;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.notif-item.unread .notif-icon-box {
    background-color: var(--bg-card, #ffffff);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.notif-item.read .notif-icon-box {
    background-color: #f8f9fa;
}

.mark-read-text {
    cursor: pointer;
}

.mark-read-text:hover {
    text-decoration: underline;
}

.font-sm {
    font-size: 13px;
}

.font-xs {
    font-size: 11px;
}
</style>
