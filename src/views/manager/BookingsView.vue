<template>
    <!-- Top bar -->
  <div class="topbar bg-white">
    <div>
      <h1 class="page-title brand-serif">Booking</h1>
      <div class="page-subtitle">
        Manage your account and property information
      </div>
    </div>

    <div class="d-flex align-items-center gap-3">
      <!-- Notification -->
      <div class="icon-btn">
        <i class="bi bi-bell"></i>
        <span class="dot"></span>
      </div>

      
    </div>
  </div>
    
    <div class="page-content">
        <!-- Main Content Body -->
        <main class="p-4 flex-grow-1">
            <div class="mb-1 text-uppercase fw-bold" style="font-size: 0.725rem; letter-spacing: 0.5px; color: var(--blue);">
                RESERVATIONS
            </div>
            <h2 class="fw-bold mb-1" style="color: #1f2937;">Bookings</h2>
            <p class="text-muted mb-4" style="font-size: 0.875rem;">Review and manage guest reservations.</p>

            <!-- Error Banner -->
            <div v-if="managerStore.error" class="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                {{ managerStore.error }}
                <button type="button" class="btn-close" @click="managerStore.clearError()"></button>
            </div>

            <!-- Filters Row -->
            <div class="d-flex flex-wrap gap-2 mb-4">
                <button 
                    v-for="status in filterOptions" 
                    :key="status"
                    class="filter-btn"
                    :class="{ active: currentFilter === status }"
                    @click="setFilter(status)"
                >
                    {{ status }}
                </button>
            </div>

            <!-- Bookings Table Container -->
            <div class="card-table-wrapper">
                <div class="table-responsive">
                    <table class="table align-middle mb-0">
                        <thead>
                            <tr class="text-uppercase">
                                <th scope="col" style="width: 22%;">GUEST</th>
                                <th scope="col" style="width: 10%;">ROOM</th>
                                <th scope="col" style="width: 15%;">CHECK-IN</th>
                                <th scope="col" style="width: 15%;">CHECK-OUT</th>
                                <th scope="col" style="width: 15%;">STATUS</th>
                                <th scope="col" style="width: 11%;">AMOUNT</th>
                                <th scope="col" class="text-end" style="width: 12%;">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Loading State -->
                            <tr v-if="managerStore.loading">
                                <td colspan="7" class="text-center py-4 text-muted">
                                    <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                                    Loading bookings...
                                </td>
                            </tr>

                            <!-- Empty State -->
                            <tr v-else-if="filteredBookings.length === 0">
                                <td colspan="7" class="text-center py-4 text-muted">
                                    No bookings found.
                                </td>
                            </tr>

                            <!-- Dynamic Table Rows -->
                            <tr v-else v-for="booking in filteredBookings" :key="booking.id">
                                <td>
                                    <div class="d-flex align-items-center gap-3">
                                        <div 
                                            class="guest-avatar" 
                                            :style="{ 
                                                backgroundColor: getAvatarStyle(booking.guest_name).bg, 
                                                color: getAvatarStyle(booking.guest_name).text 
                                            }"
                                        >
                                            {{ getInitial(booking.guest_name) }}
                                        </div>
                                        <span class="fw-bold text-dark">{{ booking.guest_name }}</span>
                                    </div>
                                </td>
                                <td class="text-muted">{{ booking.room_number || booking.room_id }}</td>
                                <td class="text-muted">{{ booking.check_in }}</td>
                                <td class="text-muted">{{ booking.check_out }}</td>
                                <td>
                                    <span class="status-badge" :class="getStatusClass(booking.status)">
                                        {{ formatStatus(booking.status) }}
                                    </span>
                                </td>
                                <td class="fw-bold text-dark">${{ booking.total_amount }}</td>
                                <td class="text-end">
                                    <select 
                                        class="action-select" 
                                        :value="booking.status" 
                                        @change="handleStatusChange(booking.id, $event.target.value)"
                                        :disabled="updatingId === booking.id"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="checked-in">Checked-in</option>
                                        <option value="checked-out">Checked-out</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useManagerStore } from '@/stores/manager' // កែប្រែ path ទៅតាមទីតាំង store របស់អ្នក

const managerStore = useManagerStore()

const currentFilter = ref('All')
const updatingId = ref(null)

const filterOptions = ['All', 'Pending', 'Confirmed', 'Checked-in', 'Checked-out', 'Cancelled', 'Rejected']

// Fetch ទិន្នន័យពី API នៅពេល Component Mount
onMounted(async () => {
    try {
        await managerStore.getBookings()
    } catch (err) {
        console.error('Failed to fetch bookings:', err)
    }
})

// Dynamic Filter Bookings
const filteredBookings = computed(() => {
    const list = managerStore.bookings || []
    if (currentFilter.value === 'All') return list

    const targetStatus = currentFilter.value.toLowerCase()
    return list.filter(b => b.status?.toLowerCase() === targetStatus)
})

const setFilter = (status) => {
    currentFilter.value = status
}

// ធ្វើបច្ចុប្បន្នភាព Status ទៅកាន់ API
const handleStatusChange = async (bookingId, newStatus) => {
    updatingId.value = bookingId
    try {
        await managerStore.updateBookingStatus(bookingId, newStatus)
    } catch (err) {
        console.error('Failed to update booking status:', err)
    } finally {
        updatingId.value = null
    }
}

// Utility Helpers សម្រាប់ Styling
const formatStatus = (status = '') => {
    if (!status) return ''
    return status.charAt(0).toUpperCase() + status.slice(1)
}

const getStatusClass = (status = '') => {
    const key = status.toLowerCase().replace(/[^a-z]/g, '')
    return `status-${key}`
}

const getInitial = (name = '') => {
    return name ? name.charAt(0).toUpperCase() : '?'
}

const getAvatarStyle = (name = '') => {
    const charCode = name.charCodeAt(0) || 65
    const bgHue = (charCode * 55) % 360
    return {
        bg: `hsl(${bgHue}, 65%, 85%)`,
        text: `hsl(${bgHue}, 70%, 25%)`
    }
}
</script>
<style scoped>
:root {
  --sidebar-bg: #0c3b34;
  --sidebar-bg-light: #123f37;
  --accent: #087F68;
  --accent-light: #0fa360;
  --page-bg: #f4f6f5;
  --card-border: #e7eae9;
  --text-muted: #6b7674;
  --sidebar-width: 260px;
  --sidebar-width-collapsed: 76px;
  --topbar-height: 78px;
}
/* Filter Pills */
    .filter-btn {
      border: 1px solid #e5e7eb;
      background-color: #ffffff;
      color: #4b5563;
      border-radius: 20px;
      padding: 0.35rem 1rem;
      font-size: 0.8125rem;
      font-weight: 500;
      transition: all 0.15s ease-in-out;
    }

    .filter-btn:hover {
      background-color: #f9fafb;
      color: #111827;
    }

    .filter-btn.active {
      background-color: var(--primary-emerald);
      color: #ffffff;
      border-color: var(--primary-emerald);
    }

    /* Card Scaffolding & Table */
    .card-table-wrapper {
      background-color: #ffffff;
      border-radius: 12px;
      border: none;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
      padding: 1.5rem;
    }

    .table th {
      font-size: 0.725rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      color: #6b7280;
      border-bottom-width: 1px;
      padding-bottom: 1rem;
    }

    .table td {
      padding: 1rem 0.5rem;
      color: #374151;
      font-size: 0.875rem;
      border-bottom-color: #f3f4f6;
    }

    /* Status Badges */
    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .status-pending { background-color: var(--status-pending-bg); color: var(--status-pending-text); }
    .status-confirmed { background-color: var(--status-confirmed-bg); color: var(--status-confirmed-text); }
    .status-checkedin { background-color: var(--status-checkedin-bg); color: var(--status-checkedin-text); }
    .status-checkedout { background-color: var(--status-checkedout-bg); color: var(--status-checkedout-text); }
    .status-cancelled { background-color: var(--status-cancelled-bg); color: var(--status-cancelled-text); }
    .status-rejected { background-color: var(--status-rejected-bg); color: var(--status-rejected-text); }

    /* Action Select Dropdown */
    .action-select {
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 0.25rem 0.6rem;
      font-size: 0.8125rem;
      color: #374151;
      background-color: #ffffff;
      width: 120px;
    }

    .action-select:focus {
      outline: none;
      border-color: var(--primary-emerald);
      box-shadow: 0 0 0 0.2rem rgba(10, 122, 92, 0.15);
    }
</style>