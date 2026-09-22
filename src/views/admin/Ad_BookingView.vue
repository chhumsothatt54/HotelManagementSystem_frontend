<template>
    <div class="page-container">
        <!-- Topbar -->
        <AdminTopbar title="Bookings" subtitle="Platform performance overview" />

        <!-- Bookings Panel -->
        <div class="p-4">
            <div class="panel-card">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <div class="panel-title fw-bold fs-6">All Bookings</div>
                        <div class="panel-sub text-muted font-sm">Recent booking activities</div>
                    </div>

                    <div class="d-flex gap-3">
                        <input type="text" class="form-control search-input" placeholder="Search ID, guest, hotel..."
                            v-model="searchQuery">
                        <select class="form-select status-select" v-model="statusFilter">
                            <option value="All">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="table custom-table align-middle mb-0">
                        <thead>
                            <tr>
                                <th>BOOKING ID</th>
                                <th>GUEST</th>
                                <th>HOTEL / ROOM</th>
                                <th>CHECK-IN</th>
                                <th>CHECK-OUT</th>
                                <th>TOTAL PRICE</th>
                                <th>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="loading">
                                <td colspan="7" class="text-center py-4 text-muted">Loading bookings...</td>
                            </tr>
                            <tr v-else-if="!filteredBookings.length">
                                <td colspan="7" class="text-center py-4 text-muted">No bookings found.</td>
                            </tr>
                            <tr v-for="booking in filteredBookings" :key="booking.id" v-else>
                                <td class="fw-bold text-dark">#{{ booking.id || booking.booking_number }}</td>
                                <td>
                                    <div class="d-flex align-items-center gap-2">
                                        <div v-if="(booking.customer || booking.user)?.avatar" class="border-0"
                                            style="width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0; overflow: hidden;">
                                            <img :src="(booking.customer || booking.user).avatar.startsWith('http') ? (booking.customer || booking.user).avatar : ((booking.customer || booking.user).avatar.startsWith('uploads/') ? `http://127.0.0.1:8000/${(booking.customer || booking.user).avatar}` : `http://127.0.0.1:8000/storage/${(booking.customer || booking.user).avatar}`)"
                                                style="width: 100%; height: 100%; object-fit: cover;"
                                                alt="Guest Avatar" />
                                        </div>
                                        <div v-else
                                            class="bg-light text-dark d-flex align-items-center justify-content-center"
                                            style="width: 32px; height: 32px; border-radius: 50%; font-weight: 600; font-size: 13px; flex-shrink: 0; border: 1px solid #e5e7eb;">
                                            {{ ((booking.customer || booking.user)?.name || booking.guest_name ||
                                            'G').charAt(0).toUpperCase() }}
                                        </div>
                                        <div>
                                            <div class="text-dark fw-semibold">{{ (booking.customer ||
                                                booking.user)?.name || booking.guest_name || 'N/A' }}</div>
                                            <div class="text-muted font-xs">{{ (booking.customer || booking.user)?.email
                                                || booking.guest_email }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="text-dark">{{ booking.hotel?.name || 'N/A' }}</div>
                                    <div class="text-muted font-xs">{{ booking.room?.room_number ||
                                        booking.room_type?.name }}</div>
                                </td>
                                <td class="text-secondary">{{ formatDate(booking.check_in_date || booking.check_in) }}
                                </td>
                                <td class="text-secondary">{{ formatDate(booking.check_out_date || booking.check_out) }}
                                </td>
                                <td class="fw-bold text-success">${{ booking.total_amount || booking.total_price ||
                                    booking.amount }}</td>
                                <td>
                                    <span class="status-badge" :class="booking.status">
                                        {{ booking.status }}
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
const searchQuery = ref('');
const statusFilter = ref('All');

const loadBookings = async () => {
    loading.value = true;
    try {
        await adminStore.getBookings();
    } catch (error) {
        console.error('Failed to load bookings:', error);
    } finally {
        loading.value = false;
    }
};

const bookingList = computed(() => {
    const data = adminStore.bookings;
    if (!data) return [];

    // Recursive search for the first array in the object
    const findArray = (obj) => {
        if (Array.isArray(obj)) return obj;
        if (obj && typeof obj === 'object') {
            if (obj.data && Array.isArray(obj.data)) return obj.data;
            if (obj.bookings && Array.isArray(obj.bookings)) return obj.bookings;
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

const filteredBookings = computed(() => {
    let result = bookingList.value;

    if (statusFilter.value !== 'All') {
        result = result.filter(b => b.status === statusFilter.value);
    }

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(b => {
            const idMatch = String(b.id || b.booking_number || '').toLowerCase().includes(query);
            const guestNameMatch = String(b.user?.name || b.guest_name || '').toLowerCase().includes(query);
            const hotelMatch = String(b.hotel?.name || '').toLowerCase().includes(query);
            const roomMatch = String(b.room?.room_number || b.room_type?.name || '').toLowerCase().includes(query);
            return idMatch || guestNameMatch || hotelMatch || roomMatch;
        });
    }

    return result;
});

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

onMounted(() => {
    loadBookings();
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

.font-sm {
    font-size: 13px;
}

.font-xs {
    font-size: 11px;
}

/* Panel & Table Styles */
.search-input {
    width: 250px;
    border-radius: 8px;
    border: 1px solid #eef2f0;
    font-size: 14px;
}

.search-input:focus {
    box-shadow: none;
    border-color: #035e4e;
}

.status-select {
    width: 140px;
    border-radius: 8px;
    border: 1px solid #eef2f0;
    font-size: 14px;
}

.status-select:focus {
    box-shadow: none;
    border-color: #035e4e;
}

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

.status-badge.confirmed,
.status-badge.completed {
    background-color: #def7ec;
    color: #03543f;
}

.status-badge.pending {
    background-color: #fef08a;
    color: #854d0e;
}

.status-badge.cancelled {
    background-color: #fde8e8;
    color: #9b1c1c;
}
</style>
