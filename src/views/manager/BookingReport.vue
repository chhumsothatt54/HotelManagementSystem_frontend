<template>
  <div class="booking-reports-page">

    <!-- Main Content Body -->
    <main class="page-content">
      
      <!-- Section Title & Action Button -->
      <div class="page-header d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <span class="eyebrow-text">REPORTS & ANALYTICS</span>
          <h2 class="section-title brand-serif">Booking Reports</h2>
          <p class="section-subtitle">Generate and inspect reservation reports for your property.</p>
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
      <div v-if="managerStore.error" class="alert alert-custom-danger mb-4 d-flex align-items-center gap-2">
        <i class="bi bi-exclamation-octagon-fill"></i>
        <span>{{ managerStore.error }}</span>
      </div>

      <!-- Date Filters Panel -->
      <div class="main-card-panel filter-panel mb-4">
        <div class="row g-3 align-items-end">
          <div class="col-12 col-sm-6 col-md-4">
            <label class="form-label field-label">Start Date</label>
            <div class="input-icon-wrapper">
              <i class="bi bi-calendar-event input-icon"></i>
              <input 
                type="date" 
                class="form-control custom-input ps-5" 
                v-model="startDate" 
              />
            </div>
          </div>

          <div class="col-12 col-sm-6 col-md-4">
            <label class="form-label field-label">End Date</label>
            <div class="input-icon-wrapper">
              <i class="bi bi-calendar-event input-icon"></i>
              <input 
                type="date" 
                class="form-control custom-input ps-5" 
                v-model="endDate" 
              />
            </div>
          </div>

          <div class="col-12 col-md-4 d-flex align-items-center justify-content-md-end">
            <span class="filter-count-badge" v-if="reportBookings.length">
              Showing <strong>{{ reportBookings.length }}</strong> confirmed record(s)
            </span>
          </div>
        </div>
      </div>

      <!-- Bookings Data Table Panel -->
      <div class="main-card-panel p-0 overflow-hidden">
        
        <!-- Panel Header -->
        <div class="panel-header d-flex align-items-center justify-content-between p-4">
          <div>
            <h3 class="h6 fw-bold text-ink m-0">Confirmed Bookings</h3>
            <p class="text-muted small m-0 mt-1">Showing confirmed reservation records from live database</p>
          </div>
          <button class="btn-refresh d-inline-flex align-items-center gap-1" @click="loadData">
            <i class="bi bi-arrow-clockwise"></i>
            <span>Refresh</span>
          </button>
        </div>

        <!-- Table Container -->
        <div class="table-responsive">
          <table class="table custom-table align-middle mb-0">
            <thead>
              <tr>
                <th scope="col" style="width: 25%;">GUEST</th>
                <th scope="col" style="width: 12%;">ROOM</th>
                <th scope="col" style="width: 16%;">CHECK-IN</th>
                <th scope="col" style="width: 16%;">CHECK-OUT</th>
                <th scope="col" style="width: 16%;">STATUS</th>
                <th scope="col" class="text-end" style="width: 15%;">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              
              <!-- Loading State -->
              <tr v-if="managerStore.loading">
                <td colspan="6" class="text-center py-5">
                  <div class="d-flex flex-column align-items-center justify-content-center py-3">
                    <div class="spinner-border spinner-border-sm text-emerald mb-2" role="status"></div>
                    <span class="text-muted small fw-medium">Fetching confirmed bookings...</span>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-else-if="reportBookings.length === 0">
                <td colspan="6" class="text-center py-5">
                  <div class="empty-state-wrapper py-4">
                    <i class="bi bi-journal-x fs-1 text-secondary opacity-50 mb-2 d-block"></i>
                    <h6 class="fw-bold text-ink mb-1">No confirmed bookings found</h6>
                    <p class="text-muted small m-0">Try expanding your start and end date range filters.</p>
                  </div>
                </td>
              </tr>

              <!-- Data Rows -->
              <tr v-else v-for="booking in reportBookings" :key="booking.id" class="table-row">
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
                    <span class="fw-semibold text-ink">{{ booking.guest_name || 'Anonymous Guest' }}</span>
                  </div>
                </td>

                <td>
                  <span class="room-pill">
                    {{ booking.room?.room_number || booking.room_id || 'N/A' }}
                  </span>
                </td>

                <td class="text-muted font-mono">{{ formatDate(booking.check_in) }}</td>
                <td class="text-muted font-mono">{{ formatDate(booking.check_out) }}</td>

                <td>
                  <span
                    class="status-badge"
                    :class="`status-${booking.status}`"
                  >
                    <span class="status-dot"></span>
                    {{ formatStatus(booking.status) }}
                  </span>
                </td>

                <td class="text-end">
                  <span class="amount-text">${{ Number(booking.total_amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</span>
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
/*
|--------------------------------------------------------------------------
| DESIGN SYSTEM VARIABLES
|--------------------------------------------------------------------------
*/
.booking-reports-page {
  --emerald: #087f68;
  --emerald-hover: #066754;
  --emerald-light: rgba(8, 127, 104, 0.08);
  --ink: #0f172a;
  --ink-secondary: #334155;
  --muted: #64748b;
  --line: #e2e8f0;
  --bg-page: #f8fafc;
  --card-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05);
  --card-shadow-hover: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05);

  background-color: var(--bg-page);
  min-height: 100vh;
  width: 100%;
}

.brand-serif {
  font-family: Georgia, "Times New Roman", serif;
}

.page-content {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

/*
|--------------------------------------------------------------------------
| HEADER SECTION
|--------------------------------------------------------------------------
*/
.eyebrow-text {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--emerald);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  display: block;
  margin-bottom: 0.25rem;
}

.section-title {
  font-size: 1.65rem;
  font-weight: 700;
  color: var(--ink);
  margin: 0;
  line-height: 1.2;
}

.section-subtitle {
  font-size: 0.85rem;
  color: var(--muted);
  margin-top: 0.35rem;
}

.btn-emerald {
  background-color: var(--emerald);
  color: var(--bg-card, #ffffff);
  border: none;
  font-weight: 600;
  font-size: 0.85rem;
  border-radius: 8px;
  padding: 0.6rem 1.25rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(8, 127, 104, 0.2);
}

.btn-emerald:hover:not(:disabled) {
  background-color: var(--emerald-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(8, 127, 104, 0.3);
}

.btn-emerald:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

/*
|--------------------------------------------------------------------------
| ALERT & CARDS
|--------------------------------------------------------------------------
*/
.alert-custom-danger {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  border-radius: 10px;
  padding: 0.85rem 1.15rem;
  font-size: 0.85rem;
  font-weight: 500;
}

.main-card-panel {
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--card-shadow);
  transition: box-shadow 0.2s ease;
}

.panel-header {
  border-bottom: 1px solid var(--line);
  background-color: var(--bg-card, #ffffff);
}

.btn-refresh {
  background: transparent;
  border: 1px solid var(--line);
  color: var(--ink-secondary);
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.4rem 0.85rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.btn-refresh:hover {
  background-color: var(--bg-page);
  color: var(--emerald);
  border-color: var(--emerald);
}

/*
|--------------------------------------------------------------------------
| FILTERS & FORM CONTROLS
|--------------------------------------------------------------------------
*/
.field-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--ink-secondary);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-bottom: 0.4rem;
}

.input-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: var(--muted);
  font-size: 0.9rem;
  pointer-events: none;
}

.custom-input {
  border-radius: 8px;
  border: 1px solid var(--line);
  padding: 0.6rem 1rem;
  font-size: 0.85rem;
  color: var(--ink);
  background-color: var(--bg-card, #ffffff);
  transition: all 0.2s ease;
}

.custom-input:focus {
  border-color: var(--emerald);
  box-shadow: 0 0 0 3px var(--emerald-light);
  outline: none;
}

.filter-count-badge {
  font-size: 0.8rem;
  color: var(--muted);
  background-color: var(--bg-page);
  padding: 0.4rem 0.85rem;
  border-radius: 20px;
  border: 1px solid var(--line);
}

/*
|--------------------------------------------------------------------------
| TABLE STYLING
|--------------------------------------------------------------------------
*/
.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.custom-table {
  width: 100%;
}

.custom-table th {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--muted);
  border-bottom: 1px solid var(--line);
  padding: 0.9rem 1.25rem;
  background-color: var(--bg-soft, #f8fafc);
  text-transform: uppercase;
}

.custom-table td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--line);
  font-size: 0.875rem;
  color: var(--ink-secondary);
}

.table-row {
  transition: background-color 0.15s ease;
}

.table-row:hover {
  background-color: rgba(248, 250, 252, 0.8);
}

.table-row:last-child td {
  border-bottom: none;
}

/* Guest Avatar */
.guest-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.8rem;
  flex-shrink: 0;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
}

/* Room Pill */
.room-pill {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  background-color: #f1f5f9;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--ink-secondary);
}

/* Status Badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}

/* Confirmed */
.status-confirmed {
  background-color: rgba(8, 127, 104, 0.1);
  color: var(--emerald);
}
.status-confirmed .status-dot {
  background-color: var(--emerald);
}

/* Checked In */
.status-checked_in {
  background-color: rgba(14, 233, 40, 0.1);
  color: #004f23;
}
.status-checked_in .status-dot {
  background-color: #02c747;
}

/* Checked Out */
.status-checked_out {
  background-color: rgba(100, 116, 139, 0.1);
  color: #475569;
}
.status-checked_out .status-dot {
  background-color: #475569;
}

/* Amount Display */
.amount-text {
  font-weight: 700;
  color: var(--ink);
  font-size: 0.9rem;
}

.font-mono {
  font-variant-numeric: tabular-nums;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .page-content {
    padding: 1.25rem;
  }
  
  .section-title {
    font-size: 1.4rem;
  }
  
  .main-card-panel {
    padding: 1rem;
  }
}
</style>
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