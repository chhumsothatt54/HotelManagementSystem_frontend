<template>
    <div class="page-container">
        <!-- Topbar -->
        <AdminTopbar title="Payments" subtitle="Platform performance overview" />

        <!-- Payments Panel -->
        <div class="p-4">
            <div class="panel-card">
                <div class="d-flex justify-content-between align-items-start mb-4">
                    <div>
                        <div class="panel-title fw-bold fs-6">Transactions List</div>
                        <div class="panel-sub text-muted font-sm">Recent payments and transactions across the platform</div>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="table custom-table align-middle mb-0">
                        <thead>
                            <tr>
                                <th>PAYMENT ID</th>
                                <th>BOOKING ID</th>
                                <th>AMOUNT</th>
                                <th>METHOD</th>
                                <th>DATE</th>
                                <th>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="loading">
                                <td colspan="6" class="text-center py-4 text-muted">Loading payments...</td>
                            </tr>
                            <tr v-else-if="!paymentList.length">
                                <td colspan="6" class="text-center py-4 text-muted">No payments found.</td>
                            </tr>
                            <tr v-for="payment in paymentList" :key="payment.id" v-else>
                                <td class="fw-bold text-dark">#{{ payment.id || payment.transaction_id }}</td>
                                <td class="text-muted">#{{ payment.booking_id }}</td>
                                <td class="fw-bold text-success">${{ payment.amount }}</td>
                                <td>
                                    <span class="text-uppercase text-secondary font-sm fw-semibold">
                                        {{ payment.method || payment.payment_method }}
                                    </span>
                                </td>
                                <td class="text-secondary">{{ formatDate(payment.created_at || payment.payment_date) }}</td>
                                <td>
                                    <span class="status-badge" :class="payment.status">
                                        {{ payment.status }}
                                    </span>
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

const loadPayments = async () => {
    loading.value = true;
    try {
        await adminStore.getPayments();
    } catch (error) {
        console.error('Failed to load payments:', error);
    } finally {
        loading.value = false;
    }
};

const paymentList = computed(() => {
    const data = adminStore.payments;
    if (!data) return [];
    
    // Recursive search for the first array in the object
    const findArray = (obj) => {
        if (Array.isArray(obj)) return obj;
        if (obj && typeof obj === 'object') {
            if (obj.data && Array.isArray(obj.data)) return obj.data;
            if (obj.payments && Array.isArray(obj.payments)) return obj.payments;
            for (const key in obj) {
                if (Array.isArray(obj[key])) return obj[key];
            }
            // If we still haven't found an array, let's look deeper
            for (const key in obj) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    const deep = findArray(obj[key]);
                    if (deep && deep.length > 0) return deep;
                }
            }
        }
        return [];
    };
    
    return findArray(data);
});

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

onMounted(() => {
    loadPayments();
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
    padding: 24px;
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
.status-badge {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: capitalize;
}
.status-badge.successful, .status-badge.completed, .status-badge.paid { background-color: #def7ec; color: #03543f; }
.status-badge.pending { background-color: #fef08a; color: #854d0e; }
.status-badge.failed, .status-badge.cancelled { background-color: #fde8e8; color: #9b1c1c; }
</style>
