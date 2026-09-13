<template>
    <div class="page-container">
        <!-- Topbar -->
        <AdminTopbar title="Notifications" subtitle="Platform notifications & alerts" />

        <!-- Notifications Panel -->
        <div class="p-4">
            <div class="panel-card">
                <div class="d-flex justify-content-between align-items-start mb-4">
                    <div>
                        <div class="panel-title fw-bold fs-6">Recent Notifications</div>
                        <div class="panel-sub text-muted font-sm">System alerts, updates, and messages</div>
                    </div>
                </div>

                <div class="notifications-list">
                    <div v-if="loading" class="text-center py-4 text-muted">
                        Loading notifications...
                    </div>
                    <div v-else-if="!notificationList.length" class="text-center py-4 text-muted">
                        No notifications found.
                    </div>
                    <div v-else class="list-group list-group-flush">
                        <div v-for="(notif, index) in notificationList" :key="index" class="list-group-item px-0 py-3 d-flex align-items-start gap-3 border-bottom">
                            <div class="notif-icon bg-light-primary text-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style="width: 40px; height: 40px;">
                                <i :class="notif.icon || 'bi bi-info-circle-fill'"></i>
                            </div>
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-center mb-1">
                                    <h6 class="mb-0 fw-bold text-dark">{{ getTitle(notif) }}</h6>
                                    <small class="text-muted">{{ formatDate(notif.created_at || notif.date || notif.updated_at) }}</small>
                                </div>
                                <p class="mb-0 text-secondary font-sm">{{ getMessage(notif) }}</p>
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
import { ref, computed, onMounted } from 'vue';
import { useAdminStore } from '@/stores/admin';

const adminStore = useAdminStore();
const loading = ref(false);

const notificationList = ref([]);

const loadNotifications = async () => {
    loading.value = true;
    try {
        await adminStore.getNotification();
        let data = adminStore.notification;
        
        const findArray = (obj) => {
            if (Array.isArray(obj)) return obj;
            if (obj && typeof obj === 'object') {
                if (obj.data && Array.isArray(obj.data)) return obj.data;
                if (obj.notifications && Array.isArray(obj.notifications)) return obj.notifications;
                for (const key in obj) {
                    if (Array.isArray(obj[key])) return obj[key];
                }
                const values = Object.values(obj);
                if (values.length > 0 && typeof values[0] === 'object') return values;
            }
            return [];
        };
        
        notificationList.value = findArray(data);
    } catch (error) {
        console.error('Failed to load notifications:', error);
    } finally {
        loading.value = false;
    }
};

const getTitle = (notif) => {
    return notif.data?.title || notif.data?.subject || notif.title || notif.subject || 'System Alert';
};

const getMessage = (notif) => {
    return notif.data?.message || notif.data?.content || notif.message || notif.content || 'No details available.';
};

const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

onMounted(() => {
    loadNotifications();
});
</script>

<style scoped>
.page-container {
    background-color: #f6f8f7;
    min-height: 100vh;
}

/* Topbar Styles */
.topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid #eef2f0;
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
.font-sm { font-size: 13px; }
.font-xs { font-size: 11px; }

/* Panel Styles */
.panel-card {
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #eef2f0;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

.bg-light-primary {
    background-color: #e0f2fe;
}
.text-primary {
    color: #0284c7 !important;
}
</style>
