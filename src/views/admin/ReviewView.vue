<template>
    <div class="page-container">
        <!-- Topbar -->
        <AdminTopbar title="Reviews" subtitle="Platform performance overview" />

        <!-- Reviews Panel -->
        <div class="p-4">
            <div class="panel-card">
                <div class="d-flex justify-content-between align-items-start mb-4">
                    <div>
                        <div class="panel-title fw-bold fs-6">Customer Reviews</div>
                        <div class="panel-sub text-muted font-sm">Reviews submitted for platform hotels</div>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="table custom-table align-middle mb-0">
                        <thead>
                            <tr>
                                <th>REVIEW ID</th>
                                <th>USER</th>
                                <th>HOTEL</th>
                                <th>RATING</th>
                                <th>COMMENT</th>
                                <th>STATUS</th>
                                <th class="text-end">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="loading">
                                <td colspan="7" class="text-center py-4 text-muted">Loading reviews...</td>
                            </tr>
                            <tr v-else-if="!reviewList.length">
                                <td colspan="7" class="text-center py-4 text-muted">No reviews found.</td>
                            </tr>
                            <tr v-for="review in reviewList" :key="review.id" v-else>
                                <td class="text-muted">#{{ review.id }}</td>
                                <td class="fw-bold text-dark">{{ review.user?.name || review.guest_name || 'Anonymous'
                                    }}</td>
                                <td class="text-secondary">{{ review.hotel?.name || 'N/A' }}</td>
                                <td>
                                    <div class="text-warning">
                                        <i v-for="n in 5" :key="n"
                                            :class="n <= (review.rating || review.stars || 0) ? 'bi-star-fill' : 'bi-star'"
                                            class="bi me-1"></i>
                                    </div>
                                </td>
                                <td class="text-secondary" style="max-width: 250px;">
                                    <div class="text-truncate" :title="review.comment">{{ review.comment || 'No comment provided' }}></div>
                                </td>
                                <td>
                                    <span class="status-badge" :class="review.status">
                                        {{ review.status }}
                                    </span>
                                </td>
                                <td>
                                    <div class="d-flex justify-content-end align-items-center gap-2">
                                        <select :value="review.status" class="status-select"
                                            @change="changeStatus(review.id, $event.target.value)">
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approved</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
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

const loadReviews = async () => {
    loading.value = true;
    try {
        await adminStore.getReviews();
    } catch (error) {
        console.error('Failed to load reviews:', error);
    } finally {
        loading.value = false;
    }
};

const reviewList = computed(() => {
    const data = adminStore.reviews;
    if (!data) return [];

    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.reviews)) return data.reviews;
    return [];
});

const changeStatus = async (id, status) => {
    try {
        await adminStore.updateReviewstatus(id, status);
        loadReviews(); // Refresh list after update
    } catch (error) {
        console.error('Failed to update review status:', error);
    }
};

onMounted(() => {
    loadReviews();
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

.status-badge.approved {
    background-color: #def7ec;
    color: #03543f;
}

.status-badge.pending {
    background-color: #fef08a;
    color: #854d0e;
}

.status-badge.rejected {
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
