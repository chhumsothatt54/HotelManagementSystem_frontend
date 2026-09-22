<template>
    <div class="page-container">
        <!-- Topbar -->
        <AdminTopbar title="Revenue Report" subtitle="Revenue by day, month, year, hotel" />

        <!-- Report Panel -->
        <div class="p-4">
            <!-- Custom Page Header -->
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <div class="text-success font-xs fw-bold text-uppercase mb-1" style="letter-spacing: 1px;">REPORTS
                    </div>
                    <div class="fw-bold fs-4 text-dark mb-1">Revenue Report</div>
                    <div class="text-muted font-sm">Revenue performance by hotel.</div>
                </div>
                <button class="btn btn-success fw-bold d-flex align-items-center gap-2 export-btn">
                    <i class="bi bi-download"></i> Export CSV
                </button>
            </div>

            <!-- Filter Card -->
            <div class="panel-card p-4 mb-4">
                <div class="row">
                    <div class="col-md-6">
                        <label class="form-label font-sm fw-bold mb-2">From</label>
                        <input type="date" class="form-control custom-input" v-model="fromDate">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label font-sm fw-bold mb-2">To</label>
                        <input type="date" class="form-control custom-input" v-model="toDate">
                    </div>
                </div>
            </div>

            <!-- Revenue by Hotel Card -->
            <div class="panel-card p-4">
                <div class="mb-4">
                    <div class="panel-title fw-bold fs-5 text-dark mb-1">Revenue by Hotel</div>
                    <div class="panel-sub text-muted font-sm">{{ fromDate || '2026-08-01' }} to {{ toDate ||'2026-08-31' }}</div>
                </div>

                <div class="hotel-list">
                    <div v-if="loading" class="text-center py-4 text-muted">Loading report...</div>
                    <div v-else-if="!breakdownList.length" class="text-center py-4 text-muted">No revenue data
                        available.</div>
                    <div v-for="(item, index) in breakdownList" :key="index" v-else
                        class="hotel-item d-flex align-items-center justify-content-between py-3 border-bottom">
                        <div class="d-flex align-items-center gap-3">
                            <div class="hotel-icon-box">
                                <i class="bi bi-building"></i>
                            </div>
                            <div>
                                <div class="fw-bold text-dark mb-1">{{ item.hotel_name || item.name || 'Unknown Property' }}</div>
                                <div class="text-muted font-xs">{{ item.total_bookings || item.bookings_count || 0 }}
                                    bookings</div>
                            </div>
                        </div>
                        <div class="fw-bold fs-5 text-dark">
                            ${{ item.revenue || item.total_revenue || 0 }}
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

const fromDate = ref('2026-08-01');
const toDate = ref('2026-08-31');

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

.panel-card {
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #eef2f0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

.export-btn {
    background-color: #035e4e;
    border: none;
    border-radius: 8px;
    padding: 10px 16px;
    font-size: 14px;
}

.export-btn:hover {
    background-color: #024a3e;
}

.custom-input {
    border-radius: 8px;
    border: 1px solid #eef2f0;
    padding: 12px 16px;
    font-size: 14px;
    color: #475569;
}

.custom-input:focus {
    box-shadow: none;
    border-color: #035e4e;
}

.hotel-icon-box {
    width: 48px;
    height: 48px;
    background-color: #def7ec;
    color: #035e4e;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}

.hotel-item:last-child {
    border-bottom: none !important;
}

.font-sm {
    font-size: 13px;
}

.font-xs {
    font-size: 11px;
}
</style>
