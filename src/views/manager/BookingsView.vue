<template>
  <div class="page-content">
    <!-- Main Content Body -->
    <main class="p-3 p-md-4 pt-0 pt-md-0 flex-grow-1"><br>
      <div class="mb-1 text-uppercase fw-bold" style="font-size: 0.725rem; letter-spacing: 0.5px; color: #087F68;">
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
                <th scope="col" style="width: 13%;">PAYMENT</th>
                <!-- <th scope="col" style="width: 11%;">PAYMENT METHOD</th> -->
                <th scope="col" class="text-end" style="width: 12%;">ACTION</th>
              </tr>
            </thead>
            <tbody>
              <!-- Loading State -->
              <tr v-if="managerStore.loading">
                <td colspan="9" class="text-center py-4 text-muted">
                  <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                  Loading bookings...
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-else-if="filteredBookings.length === 0">
                <td colspan="9" class="text-center py-4 text-muted">
                  No bookings found.
                </td>
              </tr>

              <!-- Dynamic Table Rows -->
              <tr v-else v-for="booking in filteredBookings" :key="booking.id">
                <td>
                  <div class="d-flex align-items-center gap-3">
                    <div class="guest-avatar-wrapper">
                        <img
                            v-if="booking.customer?.avatar"
                            :src="getAvatarUrl(booking.customer.avatar)"
                            :alt="booking.customer?.name || booking.guest_name"
                            class="guest-avatar guest-avatar-image"
                            @error="handleAvatarError"
                        />

                        <div
                            v-else
                            class="guest-avatar"
                            :style="{
                            backgroundColor: getAvatarStyle(booking.guest_name).bg,
                            color: getAvatarStyle(booking.guest_name).text
                            }"
                        >
                            {{ getInitial(booking.guest_name) }}
                        </div>
                        </div>
                    <span class="fw-bold text-dark">{{ booking.guest_name }}</span>
                  </div>
                </td>
                <td class="text-muted">{{ booking.room?.room_number || booking.room_id || 'N/A' }}</td>
                <td class="text-muted">{{ formatDate(booking.check_in) }}</td>
                <td class="text-muted">{{ formatDate(booking.check_out) }}</td>
                <td>
                  <span class="status-badge" :class="getStatusClass(booking.status)">
                    {{ formatStatus(booking.status) }}
                  </span>
                </td>
                <td class="fw-bold text-dark">${{ booking.total_amount }}</td>
                
                <!-- PAYMENT STATUS -->
                <td>
                  <span
                    class="payment-badge"
                    :class="getPaymentStatusClass(booking)"
                  >
                    {{ formatPaymentStatus(booking) }}
                  </span>
                </td>

                <!-- PAYMENT METHOD -->
                <!-- <td>
                  <span class="payment-method">
                    {{ getPaymentMethod(booking) }}
                  </span>
                </td> -->
                
                <td class="text-end">
                  <select 
                    class="action-select" 
                    :value="booking.status" 
                    @change="handleStatusChange(booking.id, $event.target.value)"
                    :disabled="updatingId === booking.id"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="checked_in">Checked-in</option>
                    <option value="checked_out">Checked-out</option>
                    <!-- <option value="cancelled">Cancelled</option> -->
                    <!-- <option value="rejected">Rejected</option> -->
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

<style scoped>
/* Page Layout Wrapper */
.page-content {
  background-color: var(--bg-soft, #f8fafc);
  min-height: 100vh;
  padding-left: 1rem !important; 
  padding-right: 1rem !important;
  padding-top: 0 !important;
  margin-top: 0 !important;
}

main {
  padding-top: 1rem !important; /* Minimal flush top padding */
}

/* Guest Avatar */
.guest-avatar-wrapper {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.guest-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.825rem;
  flex-shrink: 0;
}

.guest-avatar-image {
  width: 32px;
  height: 32px;
  object-fit: cover;
  border-radius: 50%;
  display: block;
}

/* Filter Pills */
.filter-btn {
  border: 1px solid var(--border-color, #e5e7eb);
  background-color: var(--bg-card, #ffffff);
  color: #087F68;
  border-radius: 20px;
  padding: 0.35rem 1rem;
  font-size: 0.8125rem;
  font-weight: 500;
  transition: all 0.15s ease-in-out;
}

.filter-btn:hover {
  background-color: #087F68;
  color: var(--bg-card, #ffffff);
}

.filter-btn.active {
  background-color: #087F68;
  color: var(--bg-card, #ffffff);
  border-color: #087F68;
}

/* Card Scaffolding & Table */
.card-table-wrapper {
  background-color: var(--bg-card, #ffffff);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  padding: 1.5rem;
}

.table th {
  font-size: 0.725rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--text-muted, #6b7280);
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 1rem;
}

.table td {
  padding: 1rem 0.5rem;
  color: var(--text-main, #374151);
  font-size: 0.875rem;
  border-bottom: 1px solid #f1f5f9;
}

/* Status Badges */
.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-pending { background-color: #fef3c7; color: #d97706; }
.status-confirmed { background-color: #d1fae5; color: #059669; }
.status-checkedin { background-color: #c4fed8; color: rgb(18, 89, 25); }
.status-checkedout { background-color: var(--bg-card, #f3f4f6); color: var(--text-main, #4b5563); }
.status-cancelled { background-color: #fee2e2; color: #dc2626; }
.status-rejected { background-color: var(--bg-card, #f3f4f6); color: var(--text-muted, #9ca3af); }

/* Action Select Dropdown */
.action-select {
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 6px;
  padding: 0.25rem 0.6rem;
  font-size: 0.8125rem;
  color: var(--text-main, #374151);
  background-color: var(--bg-card, #ffffff);
  width: 130px;
}

.action-select:focus {
  outline: none;
  border-color: #087F68;
  box-shadow: 0 0 0 0.2rem rgba(8, 127, 104, 0.15);
}

/* Payment Badges */
.payment-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.payment-paid {
  background-color: #ecfdf5;
  color: #047857;
}

.payment-paiding {
  background-color: #fff7ed;
  color: #c2410c;
}

.payment-failed {
  background-color: #fef2f2;
  color: #dc2626;
}

.payment-refunded {
  background-color: #eff6ff;
  color: #2563eb;
}
</style>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useManagerStore } from '@/stores/manager'

const managerStore = useManagerStore()

const currentFilter = ref('All')
const updatingId = ref(null)

const filterOptions = ['All', 'Pending', 'Confirmed', 'Checked-in', 'Checked-out']

// Fetch data on mounted
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

  if (currentFilter.value === 'All') {
    return list
  }

  const statusMap = {
    'Pending': 'pending',
    'Confirmed': 'confirmed',
    'Checked-in': 'checked_in',
    'Checked-out': 'checked_out',
    'Cancelled': 'cancelled',
    'Rejected': 'rejected'
  }

  const targetStatus = statusMap[currentFilter.value]

  return list.filter(
    booking => booking.status === targetStatus
  )
})

const setFilter = (status) => {
  currentFilter.value = status
}

// Update status handler
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

// Status Formatting Helpers
const formatStatus = (status = '') => {
  if (!status) return ''

  const labels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    checked_in: 'Checked-in',
    checked_out: 'Checked-out',
    cancelled: 'Cancelled',
    rejected: 'Rejected'
  }

  return labels[status] || status
}

const getStatusClass = (status = '') => {
  if (!status) return ''
  const key = status.toLowerCase().replace(/[^a-z]/g, '')
  return `status-${key}`
}

const getInitial = (name) => {
  return name ? String(name).charAt(0).toUpperCase() : '?'
}

const getAvatarStyle = (name) => {
  const charCode = name ? String(name).charCodeAt(0) : 65
  const bgHue = (charCode * 55) % 360
  return {
    bg: `hsl(${bgHue}, 65%, 85%)`,
    text: `hsl(${bgHue}, 70%, 25%)`
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Payment Status Helpers
const getPaymentStatus = (booking) => {
  return booking.payment_status || 'unpaid'
}

const formatPaymentStatus = (booking) => {
  const status = getPaymentStatus(booking).toLowerCase()

  const labels = {
    pending: 'Pending',
    paid: 'Paid',
    failed: 'Failed',
    refunded: 'Refunded',
    unpaid: 'Unpaid'
  }

  return labels[status] || (status.charAt(0).toUpperCase() + status.slice(1).toLowerCase())
}

const getPaymentStatusClass = (booking) => {
  const status = getPaymentStatus(booking).toLowerCase()

  if (status === 'pending' || status === 'paiding') {
    return 'payment-paiding'
  }
  
  if (status === 'unpaid') {
    return 'payment-failed' // Uses the red style similar to failed
  }

  return `payment-${status}`
}

// Payment Method Helper
const getPaymentMethod = (booking) => {
  const payments = booking.payments || []

  if (payments.length === 0) {
    return 'N/A'
  }

  const payment = payments[payments.length - 1]

  if (!payment.payment_method) {
    return 'N/A'
  }



  return payment.payment_method.charAt(0).toUpperCase() + payment.payment_method.slice(1)
}

const getAvatarUrl = (avatar) => {
  if (!avatar) return null

  // Already a full URL
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
    return avatar
  }

  // Laravel storage image
  return `http://127.0.0.1:8000/storage/${avatar}`
}

const handleAvatarError = (event) => {
  event.target.style.display = 'none'
}
</script>
