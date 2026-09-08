<template>
    <div>
        <!-- Topbar -->
        <div class="topbar  bg-white">
            <div class="ps-4">
                <div class="page-title">Dashboard</div>
                <div class="page-subtitle">Platform performance overview</div>
            </div>
            <div class="d-flex align-items-center gap-3 pe-4">
                <button class="icon-btn">
                    <i class="fa-regular fa-bell"></i>
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
                    <div class="stat-foot">2 hotel managers</div>
                </div>
            </div>

            <div class="col-6 col-lg-3">
                <div class="stat-card h-100">
                    <div class="d-flex justify-content-between align-items-start">
                        <span class="stat-label">Total Hotels</span>
                        <span class="stat-icon"><i class="bi bi-people-fill"></i></span>
                    </div>
                    <div class="stat-value">{{ stats.hotels }}</div>
                    <div class="stat-foot">0 pending approval</div>
                </div>
            </div>

            <div class="col-6 col-lg-3">
                <div class="stat-card h-100">
                    <div class="d-flex justify-content-between align-items-start">
                        <span class="stat-label">Total Rooms</span>
                        <span class="stat-icon" style="background:#fdf1d6;color:#9a6a00;"><i class="bi bi-hospital"></i></span>
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
                    <div class="stat-foot">1 pending</div>
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
            <div style="position:relative; height:280px;">
                <canvas ref="statsChartCanvas"></canvas>
            </div>
        </div>

        <!-- Stat cards row 2 -->
        <!-- <div class="row g-3 mt-1">
            <div class="col-6 col-lg-3">
                <div class="stat-card h-100">
                    <div class="d-flex justify-content-between align-items-start">
                        <span class="stat-label">Total Revenue</span>
                        <span class="stat-icon"><i class="fa-solid fa-sack-dollar"></i></span>
                    </div>
                    <div class="stat-value">$925</div>
                    <div class="stat-foot">From paid bookings</div>
                </div>
            </div>

            <div class="col-6 col-lg-3">
                <div class="stat-card h-100">
                    <div class="d-flex justify-content-between align-items-start">
                        <span class="stat-label">Pending Bookings</span>
                        <span class="stat-icon" style="background:#fbe4e4;color:#c23434;"><i
                                class="fa-regular fa-hourglass-half"></i></span>
                    </div>
                    <div class="stat-value">1</div>
                    <div class="stat-foot">Awaiting confirmation</div>
                </div>
            </div>
        </div> -->

        <!-- Pending hotel approvals -->
        <div class="panel-card mt-3">
            <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                    <div class="panel-title">Pending hotel approvals</div>
                    <div class="panel-sub">Hotels waiting for your review</div>
                </div>
                <a href="#" class="view-all-link">View all <i class="fa-solid fa-arrow-right ms-1"></i></a>
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
                    <tbody>
                        <!-- Rows go here when hotels are pending, e.g.:
            <tr>
              <td class="guest-name">Ocean View Resort</td>
              <td>Jane Doe</td>
              <td>Miami, FL</td>
              <td>12</td>
              <td><span class="badge-status badge-pending">Pending</span></td>
            </tr>
            -->
                    </tbody>
                </table>
                <div class="empty-state">No hotels pending approval.</div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { useAdminStore } from '@/stores/admin';
    import { onMounted, onBeforeUnmount, ref, computed, watch, nextTick } from 'vue';
    import Chart from 'chart.js/auto';

    const admin = useAdminStore();
    
    const stats = computed(() => ({
        users: admin.dashboard?.data?.total_users ?? 0,
        hotels: admin.dashboard?.data?.total_hotels ?? 0,
        rooms: admin.dashboard?.data?.total_rooms ?? 0,
        bookings: admin.dashboard?.data?.total_bookings ?? 0,
    }));

    const statsChartCanvas = ref(null);
    let statsChart = null;

    const buildChart = () => {
        if (!statsChartCanvas.value) return;

        // destroy any previous instance before redrawing (avoids duplicate charts on data refresh)
        if (statsChart) {
            statsChart.destroy();
        }
        statsChart = new Chart(statsChartCanvas.value, {
            type: 'bar',
            data: {
                labels: ['Users', 'Hotels', 'Rooms', 'Bookings'],
                datasets: [
                    {
                        label: 'Count',
                        data: [
                            stats.value.users,
                            stats.value.hotels,
                            stats.value.rooms,
                            stats.value.bookings,
                        ],
                        backgroundColor: [
                            '#4e73df',
                            '#1cc88a',
                            '#f6c23e',
                            '#e74a3b',
                        ],
                        borderRadius: 6,
                        maxBarThickness: 60,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 },
                    },
                },
            },
        });
    };

    onMounted(async () => {
        await admin.getDashboard();
        await nextTick();
        buildChart();
    });

    // redraw the chart whenever the underlying stats change (e.g. after a refetch)
    watch(stats, () => {
        buildChart();
    });

    onBeforeUnmount(() => {
        if (statsChart) {
            statsChart.destroy();
        }
    });
</script>