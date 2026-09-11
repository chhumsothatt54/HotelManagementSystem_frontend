<template>
  <!-- Top bar -->
  <div class="topbar bg-white">
    <div>
      <h1 class="page-title brand-serif">Revenue</h1>
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

      <!-- User -->
      <!-- <div class="user-chip">
        <div class="avatar-circle">
          {{ profileInitial }}
        </div>

        <div>
          <div class="name">
            {{ fullName }}
          </div>

          <div class="sub">
            {{ hotelName }}
          </div>
        </div>

        <i class="bi bi-chevron-down text-muted small"></i>
      </div> -->
    </div>
  </div>

  <div class="page-content">
    <main class="p-4 flex-grow-1">
      <div class="mb-1 text-uppercase fw-bold" style="font-size: 0.725rem; letter-spacing: 0.5px; color: var(--blue);">
        INSIGHTS
      </div>
      <h2 class="fw-bold mb-1" style="color: #1f2937;">Revenue</h2>
      <p class="text-muted mb-4" style="font-size: 0.875rem;">Monitor your hotel's financial performance.</p>

      <!-- Alert Error -->
      <div v-if="managerStore.error" class="alert alert-danger alert-dismissible fade show mb-4" role="alert">
        {{ managerStore.error }}
        <button type="button" class="btn-close" @click="managerStore.clearError()"></button>
      </div>

      <!-- Loading Indicator -->
      <div v-if="managerStore.loading" class="text-center py-5">
        <div class="spinner-border text-emerald" role="status">
          <span class="visually-hidden">Loading revenue stats...</span>
        </div>
        <p class="text-muted mt-2">Fetching financial overview...</p>
      </div>

      <template v-else>
        <!-- Overview Cards -->
        <div class="row g-3 mb-4">
          <!-- Total Revenue -->
          <div class="col-md-4">
            <div class="stat-card d-flex flex-column justify-content-between h-100">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <span class="text-muted" style="font-size: 0.85rem;">Total Revenue</span>
                <div class="stat-icon-box" style="background-color: var(--icon-bg-mint, #e6f4ea); color: var(--icon-text-mint, #137333);">
                  <i class="bi bi-wallet2"></i>
                </div>
              </div>
              <div>
                <h2 class="fw-bold mb-1" style="color: #00372b; font-size: 2rem;">
                  {{ formatCurrency(stats.total_revenue) }}
                </h2>
                <small class="text-muted" style="font-size: 0.75rem;">
                  <span :class="stats.growth_percentage >= 0 ? 'text-success' : 'text-danger'" class="fw-semibold">
                    <i :class="stats.growth_percentage >= 0 ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
                    {{ Math.abs(stats.growth_percentage || 0) }}%
                  </span> vs last month
                </small>
              </div>
            </div>
          </div>

          <!-- Average Daily -->
          <div class="col-md-4">
            <div class="stat-card d-flex flex-column justify-content-between h-100">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <span class="text-muted" style="font-size: 0.85rem;">Average Daily</span>
                <div class="stat-icon-box" style="background-color: var(--icon-bg-mint, #e6f4ea); color: var(--icon-text-mint, #137333);">
                  <i class="bi bi-calendar-event"></i>
                </div>
              </div>
              <div>
                <h2 class="fw-bold mb-1" style="color: #00372b; font-size: 2rem;">
                  {{ formatCurrency(stats.average_daily_revenue) }}
                </h2>
                <small class="text-muted" style="font-size: 0.75rem;">Daily average</small>
              </div>
            </div>
          </div>

          <!-- Average Booking -->
          <div class="col-md-4">
            <div class="stat-card d-flex flex-column justify-content-between h-100">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <span class="text-muted" style="font-size: 0.85rem;">Average Booking</span>
                <div class="stat-icon-box" style="background-color: var(--icon-bg-amber, #fef7e0); color: var(--icon-text-amber, #b06000);">
                  <i class="bi bi-newspaper"></i>
                </div>
              </div>
              <div>
                <h2 class="fw-bold mb-1" style="color: #00372b; font-size: 2rem;">
                  {{ formatCurrency(stats.average_booking_value) }}
                </h2>
                <small class="text-muted" style="font-size: 0.75rem;">Per reservation</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Revenue Breakdown Container -->
        <div class="breakdown-card">
          <h5 class="fw-bold mb-0" style="font-size: 1rem; color: #1f2937;">Revenue by Room Type</h5>
          <small class="text-muted d-block mb-3" style="font-size: 0.8rem;">Performance breakdown</small>

          <div class="d-flex flex-column gap-2">
            <!-- Empty State -->
            <div v-if="!roomBreakdowns.length" class="text-muted text-center py-4">
              No revenue data recorded for room types.
            </div>

            <!-- Dynamic Breakdown Rows -->
            <div
              v-else
              v-for="room in roomBreakdowns"
              :key="room.id || room.name"
              class="breakdown-item d-flex align-items-center justify-content-between p-2 rounded"
            >
              <div class="d-flex align-items-center gap-3">
                <div class="room-icon-box">
                  <i class="bi bi-door-closed"></i>
                </div>
                <div>
                  <h6 class="fw-bold mb-0 text-dark" style="font-size: 0.9rem;">{{ room.name }}</h6>
                  <small class="text-muted" style="font-size: 0.75rem;">
                    {{ room.bookings_count || 0 }} bookings · {{ room.nights_count || 0 }} nights
                  </small>
                </div>
              </div>
              <span class="fw-bold text-dark" style="font-size: 0.95rem;">
                {{ formatCurrency(room.total_revenue) }}
              </span>
            </div>
          </div>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useManagerStore } from '@/stores/manager'

const managerStore = useManagerStore()

// Computed Properties mapped directly to Pinia store state
const stats = computed(() => managerStore.revenueStats || {})
const roomBreakdowns = computed(() => managerStore.revenueByRoomType || [])
const profile = computed(() => managerStore.profile || {})
const hotel = computed(() => managerStore.hotel || {})

const managerName = computed(() => {
  if (profile.value.first_name || profile.value.last_name) {
    return `${profile.value.first_name || ''} ${profile.value.last_name || ''}`.trim()
  }
  return 'Sokha Manager'
})

const userInitial = computed(() => {
  return profile.value?.first_name?.charAt(0).toUpperCase() || 'M'
})

const hotelName = computed(() => {
  return hotel.value?.name || 'Mekong Riverside Hotel'
})

// Currency Formatter
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount || 0)
}

// Fetch Revenue Analytics on Component Mount
onMounted(async () => {
  try {
    await Promise.all([
      managerStore.getRevenueStats?.(),
      managerStore.getProfile?.(),
      managerStore.getMyHotel?.()
    ])
  } catch (err) {
    console.error('Failed to load revenue overview:', err)
  }
})
</script>
<style scoped>
  /* Stat Cards */
    .stat-card {
      background-color: #ffffff;
      border-radius: 12px;
      border: none;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
      height: 100%;
    }

    .stat-icon-box {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
    }

    /* Breakdown Section Card */
    .breakdown-card {
      background-color: #ffffff;
      border-radius: 12px;
      border: none;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
      padding: 1.5rem;
    }

    .breakdown-item {
      padding: 1rem 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .breakdown-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .room-icon-box {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background-color: var(--icon-bg-mint);
      color: var(--icon-text-mint);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
    }
</style>