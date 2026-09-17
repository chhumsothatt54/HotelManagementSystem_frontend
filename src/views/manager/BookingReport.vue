<template>
  <div class="booking-reports-page">
    <!-- Top Bar Header -->
    <header class="topbar">
      <div>
        <h1 class="topbar-title brand-serif">Booking Reports</h1>
        <div class="topbar-subtitle">Reservation reports</div>
      </div>

      <div class="d-flex align-items-center gap-3">
        <button class="icon-btn" aria-label="Notifications">
          <i class="bi bi-bell"></i>
          <span class="dot"></span>
        </button>

        <!-- <div class="user-chip d-flex align-items-center gap-2">
          <div class="avatar-circle">M</div>
          <div class="user-info">
            <div class="user-name">Sokha Manager</div>
            <div class="user-sub">Mekong Riverside Hotel</div>
          </div>
          <i class="bi bi-chevron-down text-muted small ms-1"></i>
        </div> -->
      </div>
    </header>

    <!-- Main Content Body -->
    <main class="page-content">
      <!-- Section Title & Action Button -->
      <div class="d-flex align-items-center justify-content-between mt-5 mb-4 flex-wrap gap-3">
        <div>
          <br>
          <span class="eyebrow-text">BOOKING REPORTS</span>
          <h2 class="section-title brand-serif">Booking Reports</h2>
          <p class="section-subtitle">Generate reservation reports for your property.</p>
        </div>

        <button 
          class="btn-emerald d-inline-flex align-items-center gap-2" 
          @click="exportCSV" 
          :disabled="managerStore.loading || !reportBookings.length"
        >
          <i class="bi bi-download"></i>
          <span>Export CSV</span>
        </button>
      </div>

      <!-- Error State -->
      <div v-if="managerStore.error" class="alert alert-danger mb-4">
        {{ managerStore.error }}
      </div>

      <!-- Date Filters -->
      <div class="main-card-panel mb-4">
        <div class="row g-4">
          <div class="col-12 col-md-6">
            <label class="form-label fw-bold text-ink small mb-2">Start Date</label>
            <input 
              type="date" 
              class="form-control custom-input" 
              v-model="startDate" 
            />
          </div>

          <div class="col-12 col-md-6">
            <label class="form-label fw-bold text-ink small mb-2">End Date</label>
            <input 
              type="date" 
              class="form-control custom-input" 
              v-model="endDate" 
            />
          </div>
        </div>
      </div>

      <!-- Real Confirmed Bookings Data Table Panel -->
      <div class="main-card-panel">
        <div class="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h3 class="h5 fw-bold text-ink m-0">Confirmed Bookings Report</h3>
            <p class="text-muted small m-0">Showing confirmed reservation records from live data</p>
          </div>
          <button class="btn btn-sm btn-link text-emerald text-decoration-none" @click="loadData">
            <i class="bi bi-arrow-clockwise me-1"></i> Refresh
          </button>
        </div>

        <!-- Table View -->
        <div class="table-responsive">
          <table class="table custom-table align-middle mb-0">
            <thead>
              <tr>
                <th scope="col" style="width: 22%;">GUEST</th>
                <th scope="col" style="width: 10%;">ROOM</th>
                <th scope="col" style="width: 15%;">CHECK-IN</th>
                <th scope="col" style="width: 15%;">CHECK-OUT</th>
                <th scope="col" style="width: 15%;">STATUS</th>
                <th scope="col" style="width: 11%;">AMOUNT</th>
                <!-- <th scope="col" class="text-end" style="width: 12%;">ACTION</th> -->
              </tr>
            </thead>
            <tbody>
              <!-- Loading State -->
              <tr v-if="managerStore.loading">
                <td colspan="7" class="text-center py-5 text-muted">
                  <div class="spinner-border spinner-border-sm text-emerald me-2" role="status"></div>
                  Loading confirmed bookings...
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-else-if="reportBookings.length === 0">
                <td colspan="7" class="text-center py-5 text-muted">
                  <i class="bi bi-journal-x fs-2 d-block mb-2 text-secondary"></i>
                  No confirmed bookings found.
                </td>
              </tr>

              <!-- Live Confirmed Data Rows -->
              <tr v-else v-for="booking in reportBookings" :key="booking.id">
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
                    <span class="fw-bold text-ink">{{ booking.guest_name }}</span>
                  </div>
                </td>
                <td class="text-muted">{{ booking.room?.room_number || booking.room_id || 'N/A' }}</td>
                <td class="text-muted">{{ formatDate(booking.check_in) }}</td>
                <td class="text-muted">{{ formatDate(booking.check_out) }}</td>
                <td>
                  <span
                    class="status-badge"
                    :class="`status-${booking.status}`"
                  >
                    {{ formatStatus(booking.status) }}
                  </span>
                </td>
                <td class="fw-bold text-ink">${{ booking.total_amount }}</td>
                <!-- <td class="text-end">
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
                    <option value="cancelled">Cancelled</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td> -->
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
import { useManagerStore } from '@/stores/manager'

const managerStore = useManagerStore()

const startDate = ref("2026-09-01")
const endDate = ref("2026-09-30")
const updatingId = ref(null)

/* Fetch Store Data */
async function loadData() {
  try {
    await managerStore.getBookings()
  } catch (err) {
    console.error('Failed to fetch bookings:', err)
  }
}

onMounted(() => {
  loadData()
})

/* Filter exclusively confirmed bookings from real store data */
const reportBookings = computed(() => {
  const list = managerStore.bookings || []

  return list.filter((booking) => {
    const status = booking.status?.toLowerCase()

    // Only show confirmed and completed booking stages
    const validStatus = [
      'confirmed',
      'checked_in',
      'checked_out'
    ].includes(status)

    if (!validStatus) {
      return false
    }

    // If no start/end date is selected, show all
    if (!startDate.value && !endDate.value) {
      return true
    }

    // Booking must have a check-in date
    if (!booking.check_in) {
      return false
    }

    // Get YYYY-MM-DD
    const bookingDate = booking.check_in.substring(0, 10)

    // Start Date
    if (startDate.value && bookingDate < startDate.value) {
      return false
    }

    // End Date
    if (endDate.value && bookingDate > endDate.value) {
      return false
    }

    return true
  })
})

const formatStatus = (status = '') => {
  const labels = {
    confirmed: 'Confirmed',
    checked_in: 'Checked-in',
    checked_out: 'Checked-out'
  }

  return labels[status] || status
}

/* Status Update Handler */
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

/* Helpers */
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

/* CSV Exporter for Live Data */
function exportCSV() {
  if (!reportBookings.value.length) return;

  const headers = ["Guest Name,Room,Check-In,Check-Out,Status,Amount"];
  const rows = reportBookings.value.map(b => 
    `"${b.guest_name || ''}","${b.room?.room_number || b.room_id || ''}","${b.check_in || ''}","${b.check_out || ''}","Confirmed",${b.total_amount || 0}`
  );

  const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `confirmed_bookings_${startDate.value}_to_${endDate.value}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>

<style scoped>
.booking-reports-page {
  --emerald: #087f68;
  --emerald-hover: #066754;
  --ink: #0f172a;
  --muted: #64748b;
  --line: #e2e8f0;
  --bg-page: #f8fafc;

  background-color: var(--bg-page);
  min-height: 100vh;
  width: 100%;
}

.brand-serif {
  font-family: "Lora", serif;
}

/* Topbar Styling */
.topbar {
  background: #ffffff;
  border-bottom: 1px solid var(--line);
  padding: 1.25rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.topbar-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--ink);
  margin: 0;
}

.topbar-subtitle {
  font-size: 0.825rem;
  color: var(--muted);
}

.icon-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  position: relative;
  cursor: pointer;
}

.icon-btn .dot {
  position: absolute;
  top: 9px;
  right: 9px;
  width: 6px;
  height: 6px;
  background-color: var(--emerald);
  border-radius: 50%;
}

.avatar-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--emerald);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
}

.user-name {
  font-size: 0.825rem;
  font-weight: 700;
  color: var(--ink);
  line-height: 1.2;
}

.user-sub {
  font-size: 0.725rem;
  color: var(--muted);
}

/* Layout */
.page-content {
  padding: 2rem;
}

.eyebrow-text {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--emerald);
  letter-spacing: 0.08em;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--ink);
  margin: 0.1rem 0;
}

.section-subtitle {
  font-size: 0.875rem;
  color: var(--muted);
  margin: 0;
}

.btn-emerald {
  background-color: var(--emerald);
  color: #ffffff;
  border: none;
  font-weight: 600;
  font-size: 0.875rem;
  border-radius: 8px;
  padding: 0.55rem 1.25rem;
  transition: all 0.2s ease;
}

.btn-emerald:hover:not(:disabled) {
  background-color: var(--emerald-hover);
}

.text-ink {
  color: var(--ink);
}

.text-emerald {
  color: var(--emerald) !important;
}

/* Card Panel */
.main-card-panel {
  background: #ffffff;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 1.5rem;
}

/* Inputs */
.custom-input {
  border-radius: 8px;
  border: 1px solid var(--line);
  padding: 0.65rem 1rem;
  font-size: 0.875rem;
  color: var(--ink);
  background-color: #ffffff;
}

.custom-input:focus {
  border-color: var(--emerald);
  box-shadow: 0 0 0 3px rgba(8, 127, 104, 0.15);
}

/* Custom Table Design */
.custom-table th {
  font-size: 0.725rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--muted);
  border-bottom: 1px solid var(--line);
  padding: 0.85rem 0.75rem;
  background-color: #f8fafc;
}

.custom-table td {
  padding: 0.85rem 0.75rem;
  border-bottom: 1px solid var(--line);
  font-size: 0.875rem;
}

/* Avatar Circle */
.guest-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.8125rem;
  flex-shrink: 0;
}

/* Status Badges */
.status-badge {
  display: inline-block;
  padding: 0.25rem 0.65rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
}

.status-confirmed { 
  background-color: rgba(8, 127, 104, 0.12); 
  color: var(--emerald); 
}

/* Action Select Dropdown */
.action-select {
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 0.3rem 0.6rem;
  font-size: 0.8125rem;
  color: var(--ink);
  background-color: #ffffff;
  width: 120px;
}

.action-select:focus {
  outline: none;
  border-color: var(--emerald);
  box-shadow: 0 0 0 3px rgba(8, 127, 104, 0.15);
}
</style>