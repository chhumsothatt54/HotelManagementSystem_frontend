<template>
    <div class="page-container ">
        <!-- Topbar -->
        <AdminTopbar title="User Managers" subtitle="Platform performance overview" />

        <!-- Hotel Managers Panel -->
        <div class="p-4">
            <div class="panel-card">
                <div class="d-flex justify-content-between align-items-start mb-4">
                    <div>
                        <div class="panel-title fw-bold fs-6">Hotel Managers</div>
                        <div class="panel-sub text-muted font-sm">Managers waiting for your review or action</div>
                    </div>
                    <div>
                        <input type="text" class="custom-input" placeholder="Search managers..."
                            v-model="searchQuery" />
                    </div>
                </div>

                <table class="table custom-table align-middle mb-0">
                    <thead>
                        <tr>
                            <th>MANAGER NAME</th>
                            <th>EMAIL</th>
                            <th>HOTELS ASSIGNED</th>
                            <th>STATUS</th>
                            <th class="text-end">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loading">
                            <td colspan="5" class="text-center py-4 text-muted">Loading managers...</td>
                        </tr>
                        <tr v-else-if="!managerList.length">
                            <td colspan="5" class="text-center py-4 text-muted">No hotel managers found.</td>
                        </tr>
                        <tr v-else-if="!filteredManagers.length">
                            <td colspan="5" class="text-center py-4 text-muted">No managers match your search.</td>
                        </tr>
                        <tr v-for="manager in filteredManagers" :key="manager.id" v-else>
                            <td class="fw-bold text-dark">
                                <div class="d-flex align-items-center gap-2">
                                    <div v-if="manager.avatar" class="border-0"
                                        style="width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0; overflow: hidden;">
                                        <img :src="manager.avatar.startsWith('http') ? manager.avatar : (manager.avatar.startsWith('uploads/') ? `http://127.0.0.1:8000/${manager.avatar}` : `http://127.0.0.1:8000/storage/${manager.avatar}`)"
                                            style="width: 100%; height: 100%; object-fit: cover;"
                                            alt="Manager Avatar" />
                                    </div>
                                    <div v-else
                                        class="bg-light text-dark d-flex align-items-center justify-content-center"
                                        style="width: 32px; height: 32px; border-radius: 50%; font-weight: 600; font-size: 13px; flex-shrink: 0; border: 1px solid #e5e7eb;">
                                        {{ manager.name ? manager.name.charAt(0).toUpperCase() : 'M' }}
                                    </div>
                                    <span>{{ manager.name }}</span>
                                </div>
                            </td>
                            <td class="text-secondary">{{ manager.email }}</td>
                            <td>
                                <span class="badge bg-light text-dark border">
                                    {{ manager.hotels?.length || 0 }} Hotels
                                </span>
                            </td>
                            <td>
                                <span class="status-badge" :class="manager.status">
                                    {{ manager.status }}
                                </span>
                            </td>
                            <td>
                                <div class="d-flex justify-content-end align-items-center gap-2">
                                    <select :value="manager.status" class="status-select"
                                        @change="changeStatus(manager.id, $event.target.value)">
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="blocked">Blocked</option>
                                    </select>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
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
const searchQuery = ref("");

const managerList = ref([]);

const filteredManagers = computed(() => {
    if (!searchQuery.value) return managerList.value;
    const query = searchQuery.value.toLowerCase();
    return managerList.value.filter(manager =>
        manager.name?.toLowerCase().includes(query) ||
        manager.email?.toLowerCase().includes(query) ||
        manager.status?.toLowerCase().includes(query)
    );
});

const loadManagers = async () => {
    loading.value = true;
    try {
        await adminStore.getManagers();
        const rawData = adminStore.managers?.data || [];
        managerList.value = JSON.parse(JSON.stringify(rawData));
    } catch (error) {
        console.error('Failed to load managers:', error);
    } finally {
        loading.value = false;
    }
};

const changeStatus = async (id, status) => {
    try {
        await adminStore.managerStatus(id, status);
        loadManagers(); // Refresh list after update
    } catch (error) {
        console.error('Failed to update manager status:', error);
    }
};

onMounted(() => {
    loadManagers();
});
</script>

<style scoped>
.custom-input {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    padding: 8px 12px;
    outline: none;
    min-width: 200px;
}

.custom-input:focus {
    border-color: #035e4e;
    box-shadow: 0 0 0 2px rgba(3, 94, 78, 0.1);
}

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

.font-sm {
    font-size: 13px;
}

.font-xs {
    font-size: 11px;
}

/* Panel & Table Styles */
.panel-card {
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #eef2f0;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

.custom-table th {
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    padding: 16px 20px;
    border-bottom: 1px solid #f1f5f9;
}

.custom-table td {
    padding: 16px 20px;
    border-bottom: 1px solid #f8fafc;
    font-size: 14px;
}

.status-badge {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: lowercase;
}

.status-badge.active {
    background-color: #def7ec;
    color: #03543f;
}

.status-badge.inactive {
    background-color: #f1f5f9;
    color: #64748b;
}

.status-badge.blocked {
    background-color: #fde8e8;
    color: #9b1c1c;
}

.status-select {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 4px 8px;
    font-size: 13px;
    outline: none;
}
</style>