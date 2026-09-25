<template>
    <div class="page-container">
        <!-- Topbar -->
        <AdminTopbar title="Occupancy Report" subtitle="Platform performance overview" />

        <!-- Report Panel -->
        <div class="p-4">
            <!-- Summary Cards -->
            <div class="row g-3 mb-4">
                <div class="col-md-4">
                    <div class="panel-card h-100 p-4">
                        <div class="text-muted font-sm mb-1 fw-bold text-uppercase">Total Occupancy Rate</div>
                        <h3 class="fw-bold mb-0 text-dark">{{ occupancyData?.total_occupancy_rate ||
                            occupancyData?.overall_rate || '0' }}%</h3>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="panel-card h-100 p-4">
                        <div class="text-muted font-sm mb-1 fw-bold text-uppercase">Occupied Rooms</div>
                        <h3 class="fw-bold mb-0 text-success">{{ occupancyData?.total_occupied_rooms ||
                            occupancyData?.occupied_rooms || '0' }}</h3>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="panel-card h-100 p-4">
                        <div class="text-muted font-sm mb-1 fw-bold text-uppercase">Available Rooms</div>
                        <h3 class="fw-bold mb-0 text-primary">{{ occupancyData?.total_available_rooms ||
                            occupancyData?.available_rooms || '0' }}</h3>
                    </div>
                </div>
            </div>

            <!-- Report Table -->
            <div class="panel-card">
                <div class="d-flex justify-content-between align-items-start mb-4">
                    <div>
                        <div class="panel-title fw-bold fs-6">Occupancy Breakdown</div>
                        <div class="panel-sub text-muted font-sm">Detailed occupancy stats per hotel/property</div>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="table custom-table align-middle mb-0">
                        <thead>
                            <tr>
                                <th>HOTEL / PROPERTY</th>
                                <th>TOTAL ROOMS</th>
                                <th>OCCUPIED</th>
                                <th>AVAILABLE</th>
                                <th>OCCUPANCY RATE</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="loading">
                                <td colspan="5" class="text-center py-4 text-muted">Loading report...</td>
                            </tr>
                            <tr v-else-if="!breakdownList.length">
                                <td colspan="5" class="text-center py-4 text-muted">No occupancy data available.</td>
                            </tr>
                            <tr v-for="(item, index) in breakdownList" :key="index" v-else>
                                <td class="fw-bold text-dark">{{ item.hotel_name || item.name || 'Unknown Property' }}
                                </td>
                                <td>{{ item.total_rooms || 0 }}</td>
                                <td class="text-success fw-bold">{{ item.occupied_rooms || 0 }}</td>
                                <td class="text-primary fw-bold">{{ item.available_rooms || 0 }}</td>
                                <td>
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="progress flex-grow-1" style="height: 6px;">
                                            <div class="progress-bar bg-success" role="progressbar"
                                                :style="{ width: `${item.occupancy_rate || 0}%` }"></div>
                                        </div>
                                        <span class="font-sm fw-bold">{{ item.occupancy_rate || 0 }}%</span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
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

const occupancyData = computed(() => {
    const data = adminStore.occupancyReport;
    if (!data) return {};
    if (data.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
        return data.data;
    }
    return data;
});

const breakdownList = computed(() => {
    let list = occupancyData.value.breakdown || occupancyData.value.hotels || [];
    if (!list.length && Array.isArray(occupancyData.value.data)) {
        list = occupancyData.value.data;
    }
    return list;
});

const loadReport = async () => {
    loading.value = true;
    try {
        await adminStore.getOccupancyReport();
    } catch (error) {
        console.error('Failed to load occupancy report:', error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loadReport();
});
</script>

<style scoped>
.page-container {
    background-color: var(--bg-card, #f6f8f7);
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
    background: var(--bg-soft, #f8fafc);
    border: 1px solid #e2e8f0;
    cursor: pointer;
}

.avatar-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #035e4e;
    color: var(--bg-card, white);
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
    background: var(--bg-card, #ffffff);
    border-radius: 16px;
    border: 1px solid #eef2f0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

.custom-table th {
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    padding: 16px 20px;
    border-bottom: 1px solid #f1f5f9;
    text-transform: uppercase;
}

.custom-table td {
    padding: 16px 20px;
    border-bottom: 1px solid #f8fafc;
    font-size: 14px;
}
</style>
