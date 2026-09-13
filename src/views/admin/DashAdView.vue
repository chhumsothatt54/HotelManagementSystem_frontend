<template>
    <div>
        <!-- Topbar -->
        <div class="topbar bg-white">
            <div class="ps-4">
                <div class="page-title">Dashboard</div>
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

        <!-- Stat cards row 1 -->
        <div class="row g-3 mt-1">
            <div class="col-6 col-lg-3">
                <div class="stat-card h-100">
                    <div class="d-flex justify-content-between align-items-start">
                        <span class="stat-label">Total Users</span>
                        <span class="stat-icon"><i class="bi bi-people-fill"></i></span>
                    </div>
                    <div class="stat-value">{{ stats.users }}</div>
                    <div class="stat-foot">{{ admin.dashboard?.data?.total_managers ?? 0 }} hotel managers</div>
                </div>
            </div>

            <div class="col-6 col-lg-3">
                <div class="stat-card h-100">
                    <div class="d-flex justify-content-between align-items-start">
                        <span class="stat-label">Total Hotels</span>
                        <span class="stat-icon"><i class="bi bi-building"></i></span>
                    </div>
                    <div class="stat-value">{{ stats.hotels }}</div>
                    <div class="stat-foot">{{ admin.dashboard?.data?.pending_hotels ?? 0 }} pending approval</div>
                </div>
            </div>

            <div class="col-6 col-lg-3">
                <div class="stat-card h-100">
                    <div class="d-flex justify-content-between align-items-start">
                        <span class="stat-label">Total Rooms</span>
                        <span class="stat-icon" style="background:#fdf1d6;color:#9a6a00;"><i class="bi bi-door-open"></i></span>
                    </div>
                    <div class="stat-value">{{ stats.rooms }}</div>
                    <div class="stat-foot">Across all properties</div>
                </div>
            </div>

            <div class="col-6 col-lg-3">
                <div class="stat-card h-100">
                    <div class="d-flex justify-content-between align-items-start">
                        <span class="stat-label">Total Bookings</span>
                        <span class="stat-icon"><i class="bi bi-bookmark-check"></i></span>
                    </div>
                    <div class="stat-value">{{ stats.bookings }}</div>
                    <div class="stat-foot">{{ admin.dashboard?.data?.pending_bookings ?? 0 }} pending</div>
                </div>
            </div>
        </div>

        <!-- Stat cards bar chart -->
        <div class="panel-card mt-3">
            <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                    <div class="panel-title">Stats overview</div>
                    <div class="panel-sub">Users, hotels, rooms & bookings compared</div>
                </div>
            </div>
            <div class="custom-chart-container">
                <div v-for="(item, index) in chartData" :key="index" class="chart-column">
                    <span class="chart-val">{{ item.value }}</span>
                    <div class="chart-bar-bg">
                        <div class="chart-bar-fill" :style="{ height: `${(item.value / maxStat) * 100}%` }"></div>
                    </div>
                    <span class="chart-label">{{ item.label }}</span>
                </div>
            </div>
        </div>

        <!-- Pending hotel approvals -->
        <div class="panel-card mt-3">
            <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                    <div class="panel-title">Pending hotel approvals</div>
                    <div class="panel-sub">Hotels waiting for your review</div>
                </div>
                <router-link to="/admin/hotels" class="view-all-link">
                    View all <i class="fa-solid fa-arrow-right ms-1"></i>
                </router-link>
            </div>

            <div class="table-responsive">
                <table class="table bookings mb-0">
                    <thead>
                        <tr>
                            <th>Hotel</th>
                            <th>Manager</th>
                            <th>Location</th>
                            <th>Rooms</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody v-if="admin.dashboard?.data?.pending_hotels_list?.length">
                        <tr v-for="hotel in admin.dashboard.data.pending_hotels_list" :key="hotel.id">
                            <td class="guest-name">{{ hotel.name }}</td>
                            <td>{{ hotel.manager?.name || 'N/A' }}</td>
                            <td>{{ hotel.address || hotel.location || 'N/A' }}</td>
                            <td>{{ hotel.rooms_count ?? 0 }}</td>
                            <td>
                                <span class="badge-status badge-pending">
                                    {{ hotel.status }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div 
                    v-if="!admin.dashboard?.data?.pending_hotels_list?.length" 
                    class="empty-state text-center py-4 text-muted"
                >
                    No hotels pending approval.
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useAdminStore } from '@/stores/admin';
import { onMounted, ref, computed } from 'vue';

const admin = useAdminStore();

const stats = computed(() => ({
    users: admin.dashboard?.data?.total_users ?? 0,
    hotels: admin.dashboard?.data?.total_hotels ?? 0,
    rooms: admin.dashboard?.data?.total_rooms ?? 0,
    bookings: admin.dashboard?.data?.total_bookings ?? 0,
}));

// We map the stats to an array to easily loop over them in the custom chart
const chartData = computed(() => [
    { label: 'Users', value: stats.value.users },
    { label: 'Hotels', value: stats.value.hotels },
    { label: 'Rooms', value: stats.value.rooms },
    { label: 'Bookings', value: stats.value.bookings },
]);

const maxStat = computed(() => {
    const max = Math.max(...chartData.value.map(d => d.value));
    return max > 0 ? max : 1; // Prevent division by zero
});

onMounted(async () => {
    await admin.getDashboard();
});
</script>

<style scoped>
/* Topbar & Cards (existing, add custom chart CSS) */
.page-title {
    font-size: 1.25rem;
    font-weight: 700;
}
.page-subtitle {
    font-size: 0.875rem;
    color: #6c757d;
}
.stat-card {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    border: 1px solid #eef2f0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}
.stat-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
}
.stat-value {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 8px 0;
}
.stat-foot {
    font-size: 0.8rem;
    color: #9ca3af;
}
.stat-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #eef2f0;
    color: #11684e;
    font-size: 1.1rem;
}
.panel-card {
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    border: 1px solid #eef2f0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}
.panel-title {
    font-weight: 700;
    font-size: 1rem;
}
.panel-sub {
    font-size: 0.875rem;
    color: #6b7280;
}

/* Custom CSS Bar Chart */
.custom-chart-container {
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    height: 250px;
    padding: 20px 0;
}
.chart-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    height: 100%;
}
.chart-val {
    font-size: 13px;
    color: #6b7280;
    font-weight: 600;
}
.chart-bar-bg {
    width: 40px;
    flex-grow: 1;
    background-color: #eaf6f2; /* Light green */
    border-radius: 8px;
    position: relative;
    display: flex;
    align-items: flex-end;
}
.chart-bar-fill {
    width: 100%;
    background-color: #11684e; /* Dark green */
    border-radius: 8px;
    transition: height 0.8s ease-out;
}
.chart-label {
    font-size: 13px;
    color: #9ca3af;
    font-weight: 500;
    margin-top: 4px;
}
</style>