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
                                <i :class="notif.icon || 'bi bi-bell'"></i>
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
const notificationList = ref([]); // Holds the array of notifications to display

// --- FUNCTIONS ---

// Function to fetch data from the store
const loadNotifications = async () => {
    loading.value = true;
    try {
        // Fetch notifications from the backend API
        await adminStore.getNotification();
        let responseData = adminStore.notification;

        // Safely extract the notifications array.
        // Since Laravel sends paginated data, the array is usually located in responseData.data.data
        if (responseData && responseData.data && Array.isArray(responseData.data.data)) {
            notificationList.value = responseData.data.data;
        }
        else if (responseData && Array.isArray(responseData.data)) {
            notificationList.value = responseData.data;
        }
        else if (Array.isArray(responseData)) {
            notificationList.value = responseData;
        }
        else {
            notificationList.value = []; // Default to empty array if no data found
        }
    } catch (error) {
        console.error('Failed to load notifications:', error);
    } finally {
        loading.value = false;
    }
};

// Helper function to safely get the notification title
const getTitle = (notif) => {
    return notif.data?.title || notif.title || 'System Alert';
};

// Helper function to safely get the notification message
const getMessage = (notif) => {
    return notif.data?.message || notif.data?.content || notif.message || 'No details available.';
};

// Helper function to format the date correctly (e.g. 2026-09-03 08:12)
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return original if invalid date

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// Helper function to check if a notification is unread
const isUnread = (notif) => {
    return notif.read_at === null || notif.is_read === false || notif.is_read == 0;
};

const markAsRead = async (id) => {
    if (!id) return;
    try {
        await adminStore.markNotificationAsRead(id);
        await loadNotifications(); // Refresh list to get updated status
    } catch (error) {
        console.error('Failed to mark notification as read:', error);
    }
};

const markAllAsRead = async () => {
    try {
        await adminStore.markAllNotificationsAsRead();
        await loadNotifications(); // Refresh list
    } catch (error) {
        console.error('Failed to mark all notifications as read:', error);
    }
};

// --- LIFECYCLE HOOKS ---
onMounted(() => {
    loadNotifications();
});
</script>

<style scoped>
.page-container {
    background-color: #f6f8f7;
    min-height: 100vh;
}

.panel-card {
    background: #ffffff;
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
    padding-left: 16px;
    padding-right: 16px;
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
}

.notif-item.unread .notif-icon-box {
    background-color: #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.notif-item.read .notif-icon-box {
    background-color: transparent;
    padding-left: 16px;
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
