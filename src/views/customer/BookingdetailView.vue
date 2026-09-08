<template>
  <div>
    <!-- NAVBAR -->
    <NavbarView />

    <main class="container py-5">
      <!-- HEADER -->
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 class="section-title mb-1">My Bookings</h2>
          <p class="section-sub mb-0">View and manage your hotel reservation history</p>
        </div>

        <!-- SEARCH & FILTER -->
        <div class="d-flex gap-2 flex-wrap">
          <input 
            type="text" 
            class="form-control form-control-sm search-input" 
            placeholder="Search hotel or booking ID..." 
            v-model="searchQuery"
          />
          <select class="form-select form-select-sm status-filter" v-model="statusFilter">
            <option value="ALL">All Status</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <!-- BOOKINGS TABLE CARD -->
      <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0 custom-table">
            <thead>
              <tr>
                <th scope="col">Booking ID</th>
                <th scope="col">Hotel & Room</th>
                <th scope="col">Dates</th>
                <th scope="col">Guests</th>
                <th scope="col">Total Price</th>
                <th scope="col">Status</th>
                <th scope="col" class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <!-- EMPTY STATE -->
              <tr v-if="filteredBookings.length === 0">
                <td colspan="7" class="text-center py-5 text-muted">
                  <div class="fs-1 mb-2">🏨</div>
                  <p class="mb-0 fw-medium">No booking records found.</p>
                </td>
              </tr>

              <!-- BOOKING ROW -->
              <tr v-for="b in filteredBookings" :key="b.id">
                <td class="fw-bold text-brand">
                  #{{ b.id }}
                </td>
                <td>
                  <div class="d-flex align-items-center gap-3">
                    <img :src="b.hotelImage" :alt="b.hotelName" class="hotel-thumb rounded-3" />
                    <div>
                      <div class="fw-bold text-dark">{{ b.hotelName }}</div>
                      <div class="small text-muted">{{ b.roomType }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="small font-monospace">
                    <div><strong>In:</strong> {{ b.checkIn }}</div>
                    <div><strong>Out:</strong> {{ b.checkOut }}</div>
                  </div>
                </td>
                <td>
                  <span class="badge bg-light text-dark border">
                    👤 {{ b.guests }} Guest(s)
                  </span>
                </td>
                <td>
                  <span class="fw-bold text-success">${{ b.totalPrice }}</span>
                </td>
                <td>
                  <span class="badge status-badge" :class="getStatusClass(b.status)">
                    ● {{ b.status }}
                  </span>
                </td>
                <td class="text-end">
                  <div class="dropdown">
                    <button class="btn btn-light btn-sm rounded-circle icon-btn" type="button" data-bs-toggle="dropdown">
                      ⋮
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end border-0 shadow-sm">
                      <li v-if="b.status === 'Confirmed' || b.status === 'Pending'">
                        <button class="dropdown-menu-item dropdown-item text-danger" @click="cancelBooking(b.id)">
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
import { ref, computed } from 'vue'
import NavbarView from '@/components/layout/customer/NavbarView.vue'
import FooterView from '@/components/layout/customer/FooterView.vue'

const searchQuery = ref('')
const statusFilter = ref('ALL')

// Data Reactive
const bookings = ref([
  {
    id: 'BK-1001',
    hotelName: 'Riverside Heritage Hotel',
    roomType: 'Deluxe King Room',
    hotelImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=200&auto=format&fit=crop',
    checkIn: '2026-04-10',
    checkOut: '2026-04-12',
    guests: 2,
    totalPrice: 82,
    status: 'Confirmed'
  },
  {
    id: 'BK-1002',
    hotelName: 'Temple Grove Boutique',
    roomType: 'Pool View Suite',
    hotelImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=200&auto=format&fit=crop',
    checkIn: '2026-05-01',
    checkOut: '2026-05-04',
    guests: 2,
    totalPrice: 180,
    status: 'Pending'
  },
  {
    id: 'BK-0988',
    hotelName: 'Sokha Bay Seaview',
    roomType: 'Ocean Front Bungalow',
    hotelImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=200&auto=format&fit=crop',
    checkIn: '2026-01-15',
    checkOut: '2026-01-18',
    guests: 3,
    totalPrice: 96,
    status: 'Completed'
  },
  {
    id: 'BK-0950',
    hotelName: 'Kampot Cliffside Villa',
    roomType: 'Mountain View Villa',
    hotelImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=200&auto=format&fit=crop',
    checkIn: '2025-12-20',
    checkOut: '2025-12-22',
    guests: 1,
    totalPrice: 110,
    status: 'Cancelled'
  }
])

// Filter Data
const filteredBookings = computed(() => {
  return bookings.value.filter(item => {
    const matchesSearch = item.hotelName.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          item.id.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'ALL' || item.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

// ពណ៌ Status Badge
function getStatusClass(status) {
  switch (status) {
    case 'Confirmed': return 'bg-success-subtle text-success border border-success-subtle'
    case 'Pending': return 'bg-warning-subtle text-warning-emphasis border border-warning-subtle'
    case 'Completed': return 'bg-info-subtle text-info-emphasis border border-info-subtle'
    case 'Cancelled': return 'bg-danger-subtle text-danger border border-danger-subtle'
    default: return 'bg-secondary-subtle text-secondary'
  }
}

// Cancel Booking ធម្មតា (In-Memory)
function cancelBooking(id) {
  if (confirm(`Are you sure you want to cancel booking ${id}?`)) {
    const target = bookings.value.find(b => b.id === id)
    if (target) {
      target.status = 'Cancelled'
    }
  }
}
</script>

<style scoped>
.text-brand {
  color: #087F68;
}

.search-input, .status-filter {
  min-width: 180px;
  border-color: #E1E9E5;
  border-radius: 8px;
}

.search-input:focus, .status-filter:focus {
  border-color: #087F68;
  box-shadow: 0 0 0 3px #E8F6F2;
}

.custom-table {
  font-size: 0.92rem;
}

.custom-table thead th {
  background-color: #F8FAF9;
  color: #063B32;
  font-weight: 600;
  padding: 1rem;
  border-bottom: 1px solid #E1E9E5;
}

.custom-table tbody td {
  padding: 1rem;
  border-bottom: 1px solid #EEF2F0;
}

.hotel-thumb {
  width: 52px;
  height: 52px;
  object-fit: cover;
}

.status-badge {
  padding: 0.4em 0.75em;
  font-weight: 600;
  border-radius: 20px;
  font-size: 0.78rem;
}

.icon-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.dropdown-menu-item {
  font-size: 0.88rem;
  cursor: pointer;
}
</style>