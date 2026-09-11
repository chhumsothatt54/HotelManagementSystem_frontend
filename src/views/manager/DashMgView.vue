<template>
    <div class="dashboard-page">

        <!-- ==================== TOP BAR ==================== -->
        <div class="topbar bg-white">
            <div>
                <h1 class="page-title brand-serif">
                    Dashboard
                </h1>

                <div class="page-subtitle">
                    Property performance overview
                </div>
            </div>

            <div class="d-flex align-items-center gap-3">

                <!-- Notification -->
                <button class="icon-btn" type="button">
                    <i class="bi bi-bell"></i>
                    <span class="dot"></span>
                </button>

                <!-- Manager
                <div class="user-chip">
                    <div class="avatar-circle">
                        {{ managerInitial }}
                    </div>

                    <div>
                        <div class="name">
                            {{ managerName }}
                        </div>

                        <div class="sub">
                            {{ hotelName }}
                        </div>
                    </div>

                    <i class="bi bi-chevron-down text-muted small"></i>
                </div> -->

            </div>
        </div>


        <!-- ==================== CONTENT ==================== -->
        <div class="page-content">

            <!-- ==================== WELCOME ==================== -->
            <div
                class="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4"
            >
                <div>
                    <h2 class="welcome-heading">
                        Welcome back, {{ managerName }}
                    </h2>

                    <p class="text-muted mb-0">
                        Here's what's happening with your property today.
                    </p>
                </div>

                <div class="date-pill">
                    <i class="bi bi-calendar3"></i>
                    {{ currentDate }}
                </div>
            </div>


            <!-- ==================== LOADING ==================== -->
            <div
                v-if="managerStore.loading && !dashboard"
                class="loading-card"
            >
                <div class="spinner-border spinner-border-sm me-2"></div>
                Loading dashboard...
            </div>


            <!-- ==================== ERROR ==================== -->
            <div
                v-else-if="managerStore.error && !dashboard"
                class="error-card"
            >
                <div>
                    <i class="bi bi-exclamation-circle me-2"></i>
                    {{ managerStore.error }}
                </div>

                <button
                    class="btn btn-sm btn-outline-danger"
                    @click="loadDashboard"
                >
                    Try again
                </button>
            </div>


            <template v-else>

                <!-- ==================== STAT CARDS ==================== -->
                <div class="row g-3 mb-4">

                    <!-- Total Rooms -->
                    <div class="col-12 col-sm-6 col-xl-3">
                        <div class="stat-card h-100">

                            <div
                                class="d-flex justify-content-between align-items-start"
                            >
                                <span class="stat-label">
                                    Total Rooms
                                </span>

                                <span class="stat-icon">
                                    <i class="bi bi-door-open"></i>
                                </span>
                            </div>

                            <div class="stat-value">
                                {{ dashboard.total_rooms }}
                            </div>

                            <div class="stat-foot">
                                <i class="bi bi-building me-1"></i>
                                Property inventory
                            </div>

                        </div>
                    </div>


                    <!-- Available Rooms -->
                    <div class="col-12 col-sm-6 col-xl-3">
                        <div class="stat-card h-100">

                            <div
                                class="d-flex justify-content-between align-items-start"
                            >
                                <span class="stat-label">
                                    Available Rooms
                                </span>

                                <span class="stat-icon">
                                    <i class="bi bi-door-open"></i>
                                </span>
                            </div>

                            <div class="stat-value text-success">
                                {{ dashboard.available_rooms }}
                            </div>

                            <div class="stat-foot">
                                <i class="bi bi-check-circle me-1"></i>
                                Ready for booking
                            </div>

                        </div>
                    </div>


                    <!-- Total Bookings -->
                    <div class="col-12 col-sm-6 col-xl-3">
                        <div class="stat-card h-100">

                            <div
                                class="d-flex justify-content-between align-items-start"
                            >
                                <span class="stat-label">
                                    Total Bookings
                                </span>

                                <span class="stat-icon">
                                    <i class="bi bi-calendar-check"></i>
                                </span>
                            </div>

                            <div class="stat-value text-primary">
                                {{ dashboard.total_bookings }}
                            </div>

                            <div class="stat-foot">
                                <i class="bi bi-bookmark me-1"></i>
                                All reservations
                            </div>

                        </div>
                    </div>


                    <!-- Revenue -->
                    <div class="col-12 col-sm-6 col-xl-3">
                        <div class="stat-card h-100">

                            <div
                                class="d-flex justify-content-between align-items-start"
                            >
                                <span class="stat-label">
                                    Revenue
                                </span>

                                <span class="stat-icon">
                                    <i class="bi bi-graph-up-arrow"></i>
                                </span>
                            </div>

                            <div class="stat-value">
                                ${{ formatMoney(dashboard.revenue) }}
                            </div>

                            <div class="stat-foot">
                                <i class="bi bi-cash-stack me-1"></i>
                                Completed bookings
                            </div>

                        </div>
                    </div>

                </div>


                <!-- ==================== SECOND STAT ROW ==================== -->
                <div class="row g-3 mb-4">

                    <!-- Pending -->
                    <div class="col-12 col-md-4">
                        <div class="mini-stat-card">

                            <div class="mini-stat-icon pending">
                                <i class="bi bi-clock-history"></i>
                            </div>

                            <div>
                                <div class="mini-stat-label">
                                    Pending Bookings
                                </div>

                                <div class="mini-stat-value">
                                    {{ dashboard.pending_bookings }}
                                </div>
                            </div>

                        </div>
                    </div>


                    <!-- Approved -->
                    <div class="col-12 col-md-4">
                        <div class="mini-stat-card">

                            <div class="mini-stat-icon approved">
                                <i class="bi bi-check-circle"></i>
                            </div>

                            <div>
                                <div class="mini-stat-label">
                                    Approved Bookings
                                </div>

                                <div class="mini-stat-value">
                                    {{ dashboard.approved_bookings }}
                                </div>
                            </div>

                        </div>
                    </div>


                    <!-- Rating -->
                    <div class="col-12 col-md-4">
                        <div class="mini-stat-card">

                            <div class="mini-stat-icon rating">
                                <i class="bi bi-star-fill"></i>
                            </div>

                            <div>
                                <div class="mini-stat-label">
                                    Average Rating
                                </div>

                                <div class="mini-stat-value">
                                    {{ dashboard.average_rating }}
                                    <span class="rating-star">★</span>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>


                <!-- ==================== BOOKINGS + OCCUPANCY ==================== -->
                <div class="row g-3 mb-4">

                    <!-- Recent Bookings -->
                    <div class="col-12 col-xl-8">
                        <div class="panel-card h-100">

                            <div
                                class="d-flex justify-content-between align-items-start mb-3"
                            >
                                <div>
                                    <div class="panel-title">
                                        Recent Bookings
                                    </div>

                                    <div class="panel-sub">
                                        Latest reservations at your property
                                    </div>
                                </div>

                                <router-link
                                    to="/manager/bookings"
                                    class="view-all-link"
                                >
                                    View all
                                    <i class="bi bi-arrow-right"></i>
                                </router-link>
                            </div>


                            <!-- Loading bookings -->
                            <div
                                v-if="managerStore.loading && !bookings.length"
                                class="empty-state"
                            >
                                <div
                                    class="spinner-border spinner-border-sm me-2"
                                ></div>
                                Loading bookings...
                            </div>


                            <!-- No bookings -->
                            <div
                                v-else-if="!bookings.length"
                                class="empty-state"
                            >
                                <i class="bi bi-calendar-x"></i>

                                <div>
                                    <strong>No bookings yet</strong>

                                    <p class="mb-0">
                                        Your latest reservations will appear here.
                                    </p>
                                </div>
                            </div>


                            <!-- Bookings table -->
                            <div
                                v-else
                                class="table-responsive"
                            >
                                <table class="table bookings mb-0">

                                    <thead>
                                        <tr>
                                            <th>Guest</th>
                                            <th>Room</th>
                                            <th>Stay</th>
                                            <th>Status</th>
                                            <th class="text-end">
                                                Amount
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        <tr
                                            v-for="booking in recentBookings"
                                            :key="booking.id"
                                        >

                                            <!-- Guest -->
                                            <td>
                                                <div
                                                    class="d-flex align-items-center gap-2"
                                                >
                                                    <div class="guest-avatar">
                                                        {{ getGuestInitial(booking) }}
                                                    </div>

                                                    <div>
                                                        <div class="guest-name">
                                                            {{ getGuestName(booking) }}
                                                        </div>

                                                        <div class="guest-id">
                                                            #BK{{ String(booking.id).padStart(3, '0') }}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>


                                            <!-- Room -->
                                            <td>
                                                {{ getRoomNumber(booking) }}
                                            </td>


                                            <!-- Stay -->
                                            <td>
                                                <span class="stay-date">
                                                    {{ formatDate(booking.check_in) }}
                                                </span>

                                                <i
                                                    class="bi bi-arrow-right text-muted small mx-1"
                                                ></i>

                                                <span class="stay-date">
                                                    {{ formatDate(booking.check_out) }}
                                                </span>
                                            </td>


                                            <!-- Status -->
                                            <td>
                                                <span
                                                    class="badge-status"
                                                    :class="getStatusClass(booking.status)"
                                                >
                                                    {{ formatStatus(booking.status) }}
                                                </span>
                                            </td>


                                            <!-- Amount -->
                                            <td class="amount-cell">
                                                ${{ formatMoney(booking.total_amount) }}
                                            </td>

                                        </tr>

                                    </tbody>

                                </table>
                            </div>

                        </div>
                    </div>


                    <!-- ==================== OCCUPANCY ==================== -->
                    <div class="col-12 col-xl-4">
                        <div class="panel-card h-100">

                            <div
                                class="d-flex justify-content-between align-items-start mb-2"
                            >
                                <div>
                                    <div class="panel-title">
                                        Occupancy
                                    </div>

                                    <div class="panel-sub">
                                        Current room utilization
                                    </div>
                                </div>

                                <i
                                    class="bi bi-bar-chart-line text-muted"
                                ></i>
                            </div>


                            <!-- Donut -->
                            <div class="donut-wrap">

                                <div
                                    class="donut"
                                    :style="{
                                        '--occupancy': occupancyRate + '%'
                                    }"
                                >
                                    <div class="donut-center">

                                        <div class="donut-pct">
                                            {{ occupancyRate }}%
                                        </div>

                                        <div class="donut-label">
                                            Occupied
                                        </div>

                                    </div>
                                </div>

                            </div>


                            <!-- Occupied -->
                            <div
                                class="d-flex justify-content-between px-2"
                            >
                                <div>
                                    <span class="legend-dot occupied-dot"></span>
                                    Occupied
                                </div>

                                <div class="fw-semibold">
                                    {{ occupiedRooms }}
                                </div>
                            </div>


                            <!-- Available -->
                            <div
                                class="d-flex justify-content-between px-2 mt-2"
                            >
                                <div>
                                    <span class="legend-dot available-dot"></span>
                                    Available
                                </div>

                                <div class="fw-semibold">
                                    {{ availableRooms }}
                                </div>
                            </div>


                            <!-- Maintenance -->
                            <div
                                class="d-flex justify-content-between px-2 mt-2"
                            >
                                <div>
                                    <span class="legend-dot maintenance-dot"></span>
                                    Other
                                </div>

                                <div class="fw-semibold">
                                    {{ otherRooms }}
                                </div>
                            </div>

                        </div>
                    </div>

                </div>


                <!-- ==================== REVENUE ==================== -->
                <div class="panel-card">

                    <div
                        class="d-flex justify-content-between align-items-start mb-4"
                    >
                        <div>
                            <div class="panel-title">
                                Revenue Overview
                            </div>

                            <div class="panel-sub">
                                Revenue from completed bookings
                            </div>
                        </div>

                        <router-link
                            to="/manager/revenue"
                            class="view-all-link"
                        >
                            View report
                            <i class="bi bi-arrow-right"></i>
                        </router-link>
                    </div>


                    <!-- Revenue summary -->
                    <div class="revenue-summary">

                        <div>
                            <div class="revenue-label">
                                Total Revenue
                            </div>

                            <div class="revenue-value">
                                ${{ formatMoney(dashboard.revenue) }}
                            </div>
                        </div>

                        <div class="revenue-icon">
                            <i class="bi bi-currency-dollar"></i>
                        </div>

                    </div>


                    <!-- Revenue days -->
                    <div
                        v-if="revenueData.length"
                        class="revenue-list"
                    >

                        <div
                            v-for="item in revenueData"
                            :key="item.date"
                            class="revenue-row"
                        >

                            <div>
                                {{ formatDate(item.date) }}
                            </div>

                            <div class="fw-semibold">
                                ${{ formatMoney(item.revenue) }}
                            </div>

                        </div>

                    </div>


                    <div
                        v-else
                        class="empty-revenue"
                    >
                        <i class="bi bi-bar-chart"></i>

                        <span>
                            No completed revenue records available.
                        </span>
                    </div>

                </div>

            </template>

        </div>
    </div>
</template>


<script setup>
import { computed, onMounted } from 'vue'
import { useManagerStore } from '@/stores/manager'

const managerStore = useManagerStore()


// ============================================================
// COMPUTED
// ============================================================

const dashboard = computed(() => {
    return managerStore.dashboard || {
        total_rooms: 0,
        available_rooms: 0,
        total_bookings: 0,
        pending_bookings: 0,
        approved_bookings: 0,
        revenue: 0,
        average_rating: 0
    }
})


const hotel = computed(() => {
    return managerStore.hotel
})


const managerName = computed(() => {
    // If your auth store later provides manager name,
    // you can replace this with the real logged-in user.
    return 'Manager'
})


const managerInitial = computed(() => {
    return managerName.value.charAt(0).toUpperCase()
})


const hotelName = computed(() => {
    return hotel.value?.name || 'Your Hotel'
})


const bookings = computed(() => {
    return managerStore.bookings || []
})


const recentBookings = computed(() => {
    return bookings.value.slice(0, 5)
})


const occupancy = computed(() => {
    return managerStore.occupancyReport || {}
})


const occupiedRooms = computed(() => {
    return Number(occupancy.value.occupied_rooms || 0)
})


const availableRooms = computed(() => {
    return Number(occupancy.value.available_rooms || 0)
})


const totalRooms = computed(() => {
    return Number(occupancy.value.total_rooms || dashboard.value.total_rooms || 0)
})


const otherRooms = computed(() => {
    const other =
        totalRooms.value -
        occupiedRooms.value -
        availableRooms.value

    return other > 0 ? other : 0
})


const occupancyRate = computed(() => {
    if (occupancy.value.occupancy_rate !== undefined) {
        return Number(occupancy.value.occupancy_rate)
    }

    if (!totalRooms.value) {
        return 0
    }

    return Math.round(
        (occupiedRooms.value / totalRooms.value) * 100
    )
})


const revenueData = computed(() => {
    const report = managerStore.revenueReport

    if (!report) {
        return []
    }

    // Backend returns:
    // data: {
    //     hotel: "...",
    //     revenue: [...]
    // }

    if (Array.isArray(report.revenue)) {
        return report.revenue.slice(-7)
    }

    if (Array.isArray(report.data?.revenue)) {
        return report.data.revenue.slice(-7)
    }

    return []
})


const currentDate = computed(() => {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(new Date())
})


// ============================================================
// LOAD DASHBOARD
// ============================================================

async function loadDashboard() {
    managerStore.clearError()

    try {
        await Promise.all([
            managerStore.getDashboard(),
            managerStore.getMyHotel(),
            managerStore.getBookings(1),
            managerStore.getOccupancyReport(),
            managerStore.getRevenueReport()
        ])
    } catch (error) {
        console.error('Failed to load manager dashboard:', error)
    }
}


// ============================================================
// FORMATTERS
// ============================================================

function formatMoney(value) {
    const number = Number(value || 0)

    return number.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}


function formatDate(date) {
    if (!date) {
        return '-'
    }

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
        return date
    }

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(parsedDate)
}


function formatStatus(status) {
    if (!status) {
        return 'Unknown'
    }

    return status
        .replace(/_/g, ' ')
        .replace(/\b\w/g, letter => letter.toUpperCase())
}


function getStatusClass(status) {
    switch (status) {
        case 'pending':
            return 'badge-pending'

        case 'approved':
            return 'badge-confirmed'

        case 'completed':
            return 'badge-checkedout'

        case 'cancelled':
        case 'rejected':
            return 'badge-cancelled'

        default:
            return 'badge-default'
    }
}


function getGuestName(booking) {
    return (
        booking.user?.name ||
        booking.user?.full_name ||
        booking.guest_name ||
        'Guest'
    )
}


function getGuestInitial(booking) {
    return getGuestName(booking)
        .charAt(0)
        .toUpperCase()
}


function getRoomNumber(booking) {
    return (
        booking.room?.room_number ||
        booking.room_number ||
        '-'
    )
}


// ============================================================
// PAGE LOAD
// ============================================================

onMounted(() => {
    loadDashboard()
})
</script>


<style scoped>
/* ============================================================
   PAGE
============================================================ */

.dashboard-page {
    min-height: 100vh;
    background: #f6f8f7;
    color: #24312a;
}


/* ============================================================
   TOP BAR
============================================================ */

.topbar {
    min-height: 78px;
    padding: 18px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #edf0ee;
}

.page-title {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
}

.page-subtitle {
    color: #8a938e;
    font-size: 13px;
    margin-top: 2px;
}


/* ============================================================
   USER
============================================================ */

.icon-btn {
    width: 40px;
    height: 40px;
    border: 1px solid #e7ebe8;
    border-radius: 10px;
    background: white;
    color: #58635d;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-btn:hover {
    background: #f5f7f6;
}

.icon-btn .dot {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #d96c5f;
    border: 1px solid white;
}

.user-chip {
    display: flex;
    align-items: center;
    gap: 10px;
}

.avatar-circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #e8eee9;
    color: #42544a;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
}

.user-chip .name {
    font-weight: 600;
    font-size: 14px;
}

.user-chip .sub {
    color: #89928d;
    font-size: 12px;
}


/* ============================================================
   CONTENT
============================================================ */

.page-content {
    padding: 30px 32px;
}

.welcome-heading {
    font-size: 25px;
    font-weight: 700;
    margin-bottom: 5px;
}

.date-pill {
    background: white;
    border: 1px solid #e7ebe8;
    border-radius: 10px;
    padding: 9px 14px;
    color: #64706a;
    font-size: 13px;
    white-space: nowrap;
}

.date-pill i {
    margin-right: 7px;
}


/* ============================================================
   STAT CARDS
============================================================ */

.stat-card {
    background: white;
    border: 1px solid #edf0ee;
    border-radius: 14px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(30, 45, 36, 0.03);
}

.stat-label {
    color: #77817b;
    font-size: 13px;
    font-weight: 500;
}

.stat-icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: #f0f4f1;
    color: #50645a;
    display: flex;
    align-items: center;
    justify-content: center;
}

.stat-value {
    margin-top: 15px;
    font-size: 29px;
    font-weight: 700;
    color: #26332c;
}

.stat-foot {
    margin-top: 8px;
    color: #89928d;
    font-size: 12px;
}

.stat-foot.up {
    color: #4f8767;
}


/* ============================================================
   MINI STATS
============================================================ */

.mini-stat-card {
    background: white;
    border: 1px solid #edf0ee;
    border-radius: 14px;
    padding: 17px 20px;
    display: flex;
    align-items: center;
    gap: 14px;
}

.mini-stat-icon {
    width: 43px;
    height: 43px;
    border-radius: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
}

.mini-stat-icon.pending {
    background: #fff5dc;
    color: #c58b27;
}

.mini-stat-icon.approved {
    background: #eaf5ee;
    color: #4c8b65;
}

.mini-stat-icon.rating {
    background: #fff3df;
    color: #d18a25;
}

.mini-stat-label {
    color: #7b857f;
    font-size: 12px;
}

.mini-stat-value {
    font-size: 22px;
    font-weight: 700;
    margin-top: 2px;
}

.rating-star {
    font-size: 15px;
    color: #d4932d;
}


/* ============================================================
   PANELS
============================================================ */

.panel-card {
    background: white;
    border: 1px solid #edf0ee;
    border-radius: 14px;
    padding: 22px;
    box-shadow: 0 2px 8px rgba(30, 45, 36, 0.03);
}

.panel-title {
    font-size: 17px;
    font-weight: 700;
    color: #28352e;
}

.panel-sub {
    color: #8b948f;
    font-size: 12px;
    margin-top: 3px;
}

.view-all-link {
    color: #506d5b;
    text-decoration: none;
    font-size: 13px;
    font-weight: 600;
}

.view-all-link:hover {
    color: #354f40;
}


/* ============================================================
   BOOKINGS TABLE
============================================================ */

.table.bookings {
    font-size: 13px;
}

.table.bookings th {
    color: #89928d;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-weight: 600;
    border-bottom: 1px solid #edf0ee;
    padding: 12px 10px;
    white-space: nowrap;
}

.table.bookings td {
    padding: 14px 10px;
    vertical-align: middle;
    border-color: #f0f2f1;
}

.guest-avatar {
    width: 32px;
    height: 32px;
    min-width: 32px;
    border-radius: 50%;
    background: #e9efeb;
    color: #53665b;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
}

.guest-name {
    font-weight: 600;
    color: #344039;
}

.guest-id {
    color: #9aa19d;
    font-size: 10px;
    margin-top: 1px;
}

.stay-date {
    white-space: nowrap;
    color: #66716b;
    font-size: 12px;
}

.amount-cell {
    font-weight: 700;
    color: #34443a;
    white-space: nowrap;
}


/* ============================================================
   STATUS
============================================================ */

.badge-status {
    display: inline-flex;
    align-items: center;
    padding: 5px 9px;
    border-radius: 20px;
    font-size: 10px;
    font-weight: 600;
    white-space: nowrap;
}

.badge-pending {
    background: #fff4dc;
    color: #b77b18;
}

.badge-confirmed {
    background: #e9f5ed;
    color: #43815b;
}

.badge-checkedin {
    background: #e7f0f8;
    color: #4c7397;
}

.badge-checkedout {
    background: #edf0f2;
    color: #657078;
}

.badge-cancelled {
    background: #fae9e7;
    color: #b75b51;
}

.badge-default {
    background: #eef1ef;
    color: #66716b;
}


/* ============================================================
   OCCUPANCY
============================================================ */

.donut-wrap {
    display: flex;
    justify-content: center;
    padding: 24px 0;
}

.donut {
    width: 165px;
    height: 165px;
    border-radius: 50%;
    background: conic-gradient(
        #55715f var(--occupancy),
        #e7eee9 var(--occupancy)
    );
    display: flex;
    align-items: center;
    justify-content: center;
}

.donut-center {
    width: 117px;
    height: 117px;
    background: white;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.donut-pct {
    font-size: 28px;
    font-weight: 700;
    color: #2f3c34;
}

.donut-label {
    color: #89928d;
    font-size: 11px;
}

.legend-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 7px;
}

.occupied-dot {
    background: #55715f;
}

.available-dot {
    background: #b9c9bd;
}

.maintenance-dot {
    background: #d9dedb;
}


/* ============================================================
   REVENUE
============================================================ */

.revenue-summary {
    background: #f7f9f7;
    border-radius: 12px;
    padding: 18px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.revenue-label {
    color: #8a938e;
    font-size: 12px;
}

.revenue-value {
    font-size: 28px;
    font-weight: 700;
    margin-top: 4px;
}

.revenue-icon {
    width: 45px;
    height: 45px;
    border-radius: 12px;
    background: #e8efe9;
    color: #506b59;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}

.revenue-list {
    border-top: 1px solid #edf0ee;
}

.revenue-row {
    display: flex;
    justify-content: space-between;
    padding: 11px 4px;
    border-bottom: 1px solid #f0f2f1;
    color: #68736d;
    font-size: 13px;
}

.revenue-row:last-child {
    border-bottom: none;
}

.empty-revenue {
    padding: 20px;
    text-align: center;
    color: #939b96;
    font-size: 13px;
}

.empty-revenue i {
    display: block;
    font-size: 24px;
    margin-bottom: 7px;
}


/* ============================================================
   LOADING / ERROR / EMPTY
============================================================ */

.loading-card,
.error-card {
    background: white;
    border: 1px solid #edf0ee;
    border-radius: 14px;
    padding: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.error-card {
    justify-content: space-between;
    color: #a54e46;
    background: #fff7f6;
    border-color: #f1d7d4;
}

.empty-state {
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: #8c9590;
    text-align: center;
}

.empty-state > i {
    font-size: 28px;
}


/* ============================================================
   RESPONSIVE
============================================================ */

@media (max-width: 768px) {

    .topbar {
        padding: 15px 18px;
    }

    .topbar .sub {
        display: none;
    }

    .page-content {
        padding: 22px 18px;
    }

    .user-chip .name {
        display: none;
    }

    .welcome-heading {
        font-size: 22px;
    }

    .panel-card {
        padding: 17px;
    }

    .table.bookings {
        min-width: 720px;
    }
}
</style>