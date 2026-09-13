<template>
    <div class="page-container">
        <!-- Topbar -->
        <div class="topbar bg-white px-5">
            <div class="ps-4">
                <div class="page-title">Revenue Report</div>
                <div class="page-subtitle">Platform performance overview</div>
            </div>
            <div class="d-flex align-items-center gap-3 pe-4">
                <button class="icon-btn">
                    <i class="bi bi-bell"></i>
                    <span class="dot"></span>
                </button>
                <div class="user-chip">
                    <div class="avatar-circle">P</div>
                    <div>
                        <div class="name">Platform Admin</div>
                        <div class="sub">Administrator</div>
                    </div>
                    <i class="fa-solid fa-chevron-down text-muted small ms-1"></i>
                </div>
            </div>
        </div>

        <!-- Report Panel -->
        <div class="p-4">
            <!-- Summary Cards -->
            <div class="row g-3 mb-4">
                <div class="col-md-4">
                    <div class="panel-card h-100 p-4">
                        <div class="text-muted font-sm mb-1 fw-bold text-uppercase">Total Revenue</div>
                        <h3 class="fw-bold mb-0 text-success">${{ revenueData?.total_revenue || revenueData?.total || '0.00' }}</h3>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="panel-card h-100 p-4">
                        <div class="text-muted font-sm mb-1 fw-bold text-uppercase">This Month</div>
                        <h3 class="fw-bold mb-0 text-primary">${{ thisMonthRevenue }}</h3>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="panel-card h-100 p-4">
                        <div class="text-muted font-sm mb-1 fw-bold text-uppercase">Avg. Booking Value</div>
                        <h3 class="fw-bold mb-0 text-dark">${{ revenueData?.average_booking_value || revenueData?.avg_booking || '0.00' }}</h3>
                    </div>
                </div>
            </div>

            <!-- Report Table -->
            <div class="panel-card">
                <div class="d-flex justify-content-between align-items-start mb-4">
                    <div>
                        <div class="panel-title fw-bold fs-6">Revenue Breakdown</div>
                        <div class="panel-sub text-muted font-sm">Detailed revenue statistics per hotel/property</div>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="table custom-table align-middle mb-0">
                        <thead>
                            <tr>
                                <th>HOTEL / PROPERTY</th>
                                <th>TOTAL BOOKINGS</th>
                                <th>REVENUE</th>
                                <th>COMMISSION (PLATFORM)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="loading">
                                <td colspan="4" class="text-center py-4 text-muted">Loading report...</td>
                            </tr>
                            <tr v-else-if="!breakdownList.length">
                                <td colspan="4" class="text-center py-4 text-muted">No revenue data available.</td>
                            </tr>
                            <tr v-for="(item, index) in breakdownList" :key="index" v-else>
                                <td class="fw-bold text-dark">{{ item.hotel_name || item.name || 'Unknown Property' }}</td>
                                <td>{{ item.total_bookings || item.bookings_count || 0 }}</td>
                                <td class="text-success fw-bold">${{ item.revenue || item.total_revenue || 0 }}</td>
                                <td class="text-primary fw-bold">${{ item.commission || (item.revenue * 0.1) || 0 }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAdminStore } from '@/stores/admin';

const adminStore = useAdminStore();
const loading = ref(false);

const revenueData = computed(() => {
    const data = adminStore.revenueReport;
    if (!data) return {};
    if (data.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
        return data.data;
    }
    return data;
});

const breakdownList = computed(() => {
    let list = revenueData.value.breakdown || revenueData.value.hotels || [];
    if (!list.length && Array.isArray(revenueData.value.data)) {
        list = revenueData.value.data;
    }
    return list;
});

const thisMonthRevenue = computed(() => {
    const monthly = revenueData.value.monthly_revenue;
    if (monthly && Array.isArray(monthly) && monthly.length > 0) {
        return monthly[0].total || monthly[0].revenue || '0.00';
    }
    return revenueData.value.this_month || '0.00';
});

const loadReport = async () => {
    loading.value = true;
    try {
        await adminStore.getRevenueReport();
    } catch (error) {
        console.error('Failed to load revenue report:', error);
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

/* Panel & Table Styles */
.panel-card {
    background: #ffffff;
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
