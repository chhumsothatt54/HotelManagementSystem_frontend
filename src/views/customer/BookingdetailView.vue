<template>
  <div class="booking-page bg-light min-vh-100">
    <!-- NAVBAR -->
    <NavbarView />

    <main class="container py-5">
      <!-- HEADER -->
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 class="section-title fw-bold text-dark mb-1">My Bookings</h2>
          <p class="section-sub text-muted small mb-0">View and manage your hotel reservation history</p>
        </div>

        <!-- SEARCH & FILTER -->
        <div class="d-flex gap-2 flex-wrap">
          <select class="form-select form-select-sm status-filter shadow-sm" v-model="statusFilter">
            <option value="ALL">All Status</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <!-- BOOKINGS TABLE CARD -->
      <div class="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0 custom-table">
            <thead>
              <tr>
                <th scope="col" class="ps-4">Booking ID</th>
                <th scope="col">Hotel & Room</th>
                <th scope="col">Dates</th>
                <th scope="col">Guests</th>
                <th scope="col">Total Price</th>
                <th scope="col">Payment</th>
                <th scope="col">Status</th>
                <th scope="col" class="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              <!-- EMPTY STATE -->
              <tr v-if="filteredBookings.length === 0">
                <td colspan="8" class="text-center py-5 text-muted">
                  <p class="mb-0 fw-medium">No booking records found.</p>
                </td>
              </tr>

              <!-- BOOKING ROW -->
              <tr v-for="b in filteredBookings" :key="b.id" class="booking-row">
                <td class="ps-4 fw-bold text-brand">
                  #{{ b.id }}
                </td>
                <td>
                  <div class="d-flex align-items-center gap-3">
                    <img :src="getHotelImage(b)" :alt="b.hotel?.name || 'Hotel'" class="hotel-thumb rounded-3 shadow-sm" />
                    <div>
                      <div class="fw-bold text-dark text-truncate" style="max-width: 200px;">{{ b.hotel?.name || 'Unknown Hotel' }}</div>
                      <div class="small text-muted">{{ b.room?.roomType?.name || 'Standard Room' }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="date-box p-2 rounded-3 bg-light border">
                    <div class="small text-secondary"><strong>In:</strong> {{ formatDate(b.check_in) }}</div>
                    <div class="small text-secondary"><strong>Out:</strong> {{ formatDate(b.check_out) }}</div>
                  </div>
                </td>
                <td>
                  <span class="badge bg-light text-dark border px-2 py-1 rounded-2">
                    👤 {{ b.total_guests || 1 }} Guest(s)
                  </span>
                </td>
                <td>
                  <span class="fw-bold text-emerald fs-6">${{ b.total_amount }}</span>
                </td>
                <td>
                  <span class="badge status-badge" :class="getPaymentStatusClass(b.payment_status)">
                    ● {{ formatStatus(b.payment_status || 'unpaid') }}
                  </span>
                </td>
                <td>
                  <span class="badge status-badge" :class="getStatusClass(b.status)">
                    ● {{ formatStatus(b.status) }}
                  </span>
                </td>
                <td class="text-end pe-4">
                  <div class="dropdown">
                    <button class="btn btn-light btn-sm rounded-circle icon-btn shadow-sm" type="button" data-bs-toggle="dropdown">
                      ⋮
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end border-0 shadow rounded-3">
                      <li v-if="b.status === 'confirmed' || b.status === 'pending'">
                        <button class="dropdown-menu-item dropdown-item text-danger py-2" @click="handleCancel(b.id)" :disabled="customerStore.loading">
                          ❌ Cancel Booking
                        </button>
                      </li>
                      <li v-else>
                        <span class="dropdown-item-text text-muted small">No actions</span>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- FOOTER -->
    <FooterView />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import NavbarView from '@/components/layout/customer/NavbarView.vue'
import FooterView from '@/components/layout/customer/FooterView.vue'
import { useCustomerStore } from '@/stores/customer'

const customerStore = useCustomerStore()

const searchQuery = ref('')
const statusFilter = ref('ALL')

onMounted(async () => {
  await customerStore.getBookingHistory()
})

// Filter Data
const filteredBookings = computed(() => {
  const list = customerStore.bookings || []
  return list.filter(item => {
    const hotelName = item.hotel?.name || ''
    const matchesSearch = hotelName.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          String(item.id).toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'ALL' || String(item.status).toLowerCase() === statusFilter.value.toLowerCase()
    return matchesSearch && matchesStatus
  })
})

function formatStatus(status) {
  if (!status) return 'Unknown'
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
}

// ពណ៌ Status Badge
function getStatusClass(status) {
  if (!status) return 'bg-secondary-subtle text-secondary'
  switch (status.toLowerCase()) {
    case 'confirmed': return 'bg-success-subtle text-success border border-success-subtle'
    case 'pending': return 'bg-warning-subtle text-warning-emphasis border border-warning-subtle'
    case 'completed': return 'bg-info-subtle text-info-emphasis border border-info-subtle'
    case 'checked-in': return 'bg-primary-subtle text-primary border border-primary-subtle'
    case 'checked-out': return 'bg-dark-subtle text-dark border border-dark-subtle'
    case 'cancelled': 
    case 'rejected': return 'bg-danger-subtle text-danger border border-danger-subtle'
    default: return 'bg-secondary-subtle text-secondary'
  }
}

// ពណ៌ Payment Status Badge
function getPaymentStatusClass(status) {
  if (!status) return 'bg-warning-subtle text-warning-emphasis border border-warning-subtle'
  switch (status.toLowerCase()) {
    case 'paid': return 'bg-success-subtle text-success border border-success-subtle'
    case 'pending': return 'bg-warning-subtle text-warning-emphasis border border-warning-subtle'
    case 'failed':
    case 'unpaid': return 'bg-danger-subtle text-danger border border-danger-subtle'
    default: return 'bg-secondary-subtle text-secondary'
  }
}

function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function getHotelImage(booking) {
  // Try to use a real image if available, else a nice placeholder
  if (booking.hotel?.images && booking.hotel.images.length > 0) {
    const path = booking.hotel.images[0].image
    return path.startsWith('http') ? path : `http://127.0.0.1:8000/storage/${path}`
  }
  return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=200&auto=format&fit=crop'
}

// Cancel Booking via API
async function handleCancel(id) {
  const reason = prompt(`Are you sure you want to cancel booking #${id}?\n\nPlease enter a reason for cancellation:`)
  if (reason !== null) {
    if (!reason.trim()) {
      alert("A reason is required to cancel your booking.")
      return
    }
    try {
      await customerStore.cancelBooking(id, reason.trim())
      await customerStore.getBookingHistory() // refresh
    } catch (err) {
      alert(customerStore.error || "Failed to cancel booking.")
    }
  }
}
</script>

<style scoped>
.text-brand {
  color: #087F68;
}

.text-emerald {
  color: #0d9488;
}

.status-filter {
  min-width: 170px;
  border-color: #E2E8F0;
  border-radius: 10px;
  padding: 0.5rem 0.8rem;
  background-color: var(--bg-card, #ffffff);
}

.status-filter:focus {
  border-color: #087F68;
  box-shadow: 0 0 0 3px rgba(8, 127, 104, 0.15);
}

.custom-table {
  font-size: 0.9rem;
}

.custom-table thead th {
  background-color: var(--bg-soft, #F8FAFC);
  color: #475569;
  font-weight: 600;
  padding: 1.1rem 1rem;
  border-bottom: 1px solid #E2E8F0;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.custom-table tbody td {
  padding: 1rem;
  border-bottom: 1px solid #F1F5F9;
}

.booking-row {
  transition: background-color 0.15s ease-in-out;
}

.booking-row:hover {
  background-color: var(--bg-card, #f8faf9) !important;
}

.hotel-thumb {
  width: 54px;
  height: 54px;
  object-fit: cover;
}

.date-box {
  min-width: 135px;
}

.status-badge {
  padding: 0.45em 0.8em;
  font-weight: 600;
  border-radius: 20px;
  font-size: 0.78rem;
}

.icon-btn {
  width: 34px;
  height: 34px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #F1F5F9;
  border: none;
  transition: all 0.2s ease;
}

.icon-btn:hover {
  background-color: #E2E8F0;
}

.dropdown-menu-item {
  font-size: 0.88rem;
  cursor: pointer;
}
</style>