<template>
    <div class="page-container">
        <!-- Topbar -->
        <AdminTopbar title="Occupancy Report" subtitle="Platform performance overview" />

        <!-- Report Panel -->
        <div class="p-4">
            <!-- Summary Cards with Premium UI -->
            <div class="row g-4 mb-5">
                <div class="col-md-4">
                    <div class="premium-card rate-card p-4 h-100 position-relative overflow-hidden">
                        <div class="card-bg-circle"></div>
                        <div class="position-relative z-1">
                            <div class="d-flex align-items-center justify-content-between mb-3">
                                <div class="text-white opacity-75 font-sm fw-bold text-uppercase tracking-wide">Total Occupancy Rate</div>
                                <div class="icon-circle bg-white text-primary">
                                    <i class="bi bi-pie-chart-fill"></i>
                                </div>
                            </div>
                            <h2 class="fw-bold mb-0 text-white display-5">{{ occupancyData?.occupancy_rate || '0%' }}</h2>
                            <div class="text-white opacity-75 mt-2 font-xs">Across all properties</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="premium-card occupied-card p-4 h-100 position-relative overflow-hidden">
                        <div class="card-bg-circle"></div>
                        <div class="position-relative z-1">
                            <div class="d-flex align-items-center justify-content-between mb-3">
                                <div class="text-white opacity-75 font-sm fw-bold text-uppercase tracking-wide">Occupied Rooms</div>
                                <div class="icon-circle bg-white text-success">
                                    <i class="bi bi-door-closed-fill"></i>
                                </div>
                            </div>
                            <h2 class="fw-bold mb-0 text-white display-5">{{ occupancyData?.occupied_rooms || '0' }}</h2>
                            <div class="text-white opacity-75 mt-2 font-xs">Currently in use</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="premium-card available-card p-4 h-100 position-relative overflow-hidden">
                        <div class="card-bg-circle"></div>
                        <div class="position-relative z-1">
                            <div class="d-flex align-items-center justify-content-between mb-3">
                                <div class="text-white opacity-75 font-sm fw-bold text-uppercase tracking-wide">Total Rooms</div>
                                <div class="icon-circle bg-white text-info">
                                    <i class="bi bi-building"></i>
                                </div>
                            </div>
                            <h2 class="fw-bold mb-0 text-white display-5">{{ occupancyData?.total_rooms || '0' }}</h2>
                            <div class="text-white opacity-75 mt-2 font-xs">Total inventory capacity</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Report Table -->
            <div class="panel-card p-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <div class="panel-title fw-bold fs-5 text-dark">Occupancy Breakdown</div>
                        <div class="panel-sub text-muted font-sm">Detailed occupancy stats per hotel/property</div>
                    </div>
                    <button class="btn btn-primary px-4 fw-bold shadow-sm" @click="loadReport" :disabled="loading">
                        <i class="bi bi-arrow-clockwise me-2"></i> Refresh Data
                    </button>
                </div>

                <div class="table-responsive">
                    <table class="table custom-table align-middle mb-0">
                        <thead>
                            <tr>
                                <th class="text-secondary ps-4">HOTEL / PROPERTY</th>
                                <th class="text-secondary text-center">TOTAL ROOMS</th>
                                <th class="text-secondary text-center">OCCUPIED</th>
                                <th class="text-secondary text-center">AVAILABLE</th>
                                <th class="text-secondary pe-4" style="width: 250px;">OCCUPANCY RATE</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="loading">
                                <td colspan="5" class="text-center py-5 text-muted">
                                    <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                                    Loading occupancy report...
                                </td>
                            </tr>
                            <tr v-else-if="!breakdownList.length">
                                <td colspan="5" class="text-center py-5 text-muted">
                                    <i class="bi bi-inbox fs-2 d-block mb-2 text-black-50"></i>
                                    No occupancy data available.
                                </td>
                            </tr>
                            <tr v-for="(item, index) in breakdownList" :key="index" v-else class="hover-row">
                                <td class="ps-4">
                                    <div class="d-flex align-items-center gap-3">
                                        <div class="hotel-avatar shadow-sm">
                                            <i class="bi bi-buildings-fill text-primary"></i>
                                        </div>
                                        <div class="fw-bold text-dark fs-6">{{ item.hotel_name || item.name || 'Unknown Property' }}</div>
                                    </div>
                                </td>
                                <td class="text-center fw-semibold text-muted">{{ item.total_rooms || 0 }}</td>
                                <td class="text-center text-success fw-bold">{{ item.occupied_rooms || 0 }}</td>
                                <td class="text-center text-info fw-bold">{{ item.available_rooms || 0 }}</td>
                                <td class="pe-4">
                                    <div class="d-flex align-items-center gap-3">
                                        <div class="progress flex-grow-1 bg-light rounded-pill shadow-inner" style="height: 10px;">
                                            <div class="progress-bar rounded-pill" 
                                                :class="getProgressBarColor(item.occupancy_rate)"
                                                role="progressbar"
                                                :style="{ width: `${item.occupancy_rate || 0}%` }"></div>
                                        </div>
                                        <span class="font-sm fw-bold text-dark" style="min-width: 45px;">{{ item.occupancy_rate || 0 }}%</span>
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
    return occupancyData.value.breakdown || [];
});

const getProgressBarColor = (rate) => {
    if (rate >= 80) return 'bg-success';
    if (rate >= 50) return 'bg-warning';
    return 'bg-danger';
};

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
    background-color: #f4f7f6;
    min-height: 100vh;
}

/* Premium Summary Cards */
.premium-card {
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.premium-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.rate-card {
    background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
}

.occupied-card {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.available-card {
    background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
}

.card-bg-circle {
    position: absolute;
    top: -30%;
    right: -10%;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%);
    border-radius: 50%;
    z-index: 0;
}

.icon-circle {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.tracking-wide {
    letter-spacing: 1px;
}

/* Panel & Table Styles */
.panel-card {
    background: #ffffff;
    border-radius: 20px;
    border: none;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.03);
}

.custom-table th {
    font-size: 12px;
    font-weight: 700;
    padding: 18px 20px;
    border-bottom: 2px solid #f1f5f9;
    background-color: #ffffff;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.custom-table td {
    padding: 20px;
    border-bottom: 1px solid #f8fafc;
    vertical-align: middle;
}

.hover-row {
    transition: background-color 0.2s ease;
}

.hover-row:hover {
    background-color: #f8fafc;
}

.hotel-avatar {
    width: 48px;
    height: 48px;
    background-color: #eff6ff;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
}

.shadow-inner {
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);
}

.progress-bar {
    transition: width 1s ease-in-out;
}

.font-sm {
    font-size: 13px;
}

.font-xs {
    font-size: 11px;
}
</style>
