<template>
  <div class="revenue-container p-4">
    <!-- Topbar Header -->
    <div class="topbar bg-white p-3 rounded-3 shadow-sm d-flex justify-content-between align-items-center mb-4 border">
      <div>
        <h1 class="page-title brand-serif h4 mb-1 text-dark fw-bold">Financial Analytics</h1>
        <div class="page-subtitle text-muted small">
          Monitor your property revenue, daily averages, and sales metrics
        </div>
      </div>

      <div class="d-flex align-items-center gap-3">
        <button class="btn btn-light position-relative rounded-circle p-2 shadow-sm border-0" type="button">
          <i class="bi bi-bell text-secondary"></i>
          <span class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
        </button>
      </div>
    </div>

    <div class="page-content">
      <!-- Section Header & Filter -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <div class="badge bg-emerald-subtle text-emerald text-uppercase fw-bold mb-1 px-2 py-1" style="font-size: 0.725rem; letter-spacing: 0.5px;">
            INSIGHTS & PERFORMANCE
          </div>
          <h2 class="fw-bold text-dark mb-1">Revenue Overview</h2>
          <p class="text-muted small mb-0">Track key financial figures and performance per room tier.</p>
        </div>

        <!-- Date Range Filter Buttons -->
        <div class="bg-white p-1 rounded-3 border shadow-sm d-inline-flex gap-1">
          <button
            v-for="period in ['7 Days', '30 Days', 'This Year']"
            :key="period"
            type="button"
            class="btn btn-sm px-3 fw-medium rounded-2 transition-all"
            :class="selectedPeriod === period ? 'btn-emerald shadow-sm' : 'btn-light text-muted border-0'"
            @click="selectedPeriod = period"
          >
            {{ period }}
          </button>
        </div>
      </div>

      <!-- Alert Error -->
      <div v-if="managerStore.error" class="alert alert-danger alert-dismissible fade show mb-4 shadow-sm" role="alert">
        <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ managerStore.error }}
        <button type="button" class="btn-close" @click="managerStore.clearError()"></button>
      </div>

      <!-- Loading Indicator -->
      <div v-if="managerStore.loading" class="text-center py-5">
        <div class="spinner-border text-emerald" role="status">
          <span class="visually-hidden">Loading statistics...</span>
        </div>
        <p class="text-muted small mt-2">Fetching financial breakdown...</p>
      </div>

      <template v-else>
        <!-- Top Stats Cards -->
        <div class="row g-3 mb-4">
          <!-- Total Revenue -->
          <div class="col-12 col-md-4">
            <div class="card border-0 shadow-sm rounded-3 bg-white p-4 h-100 position-relative overflow-hidden card-stat">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <span class="text-muted text-uppercase micro-text fw-bold">Total Revenue</span>
                <div class="icon-shape bg-emerald-subtle text-emerald rounded-3 p-2">
                  <i class="bi bi-wallet2 fs-5"></i>
                </div>
              </div>
              <h2 class="fw-bold text-dark mb-2 display-6">
                {{ formatCurrency(stats.total_revenue) }}
              </h2>
              <div class="d-flex align-items-center small">
                <span
                  class="badge px-2 py-1 me-2"
                  :class="stats.growth_percentage >= 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'"
                >
                  <i :class="stats.growth_percentage >= 0 ? 'bi bi-arrow-up-right' : 'bi bi-arrow-down-right'"></i>
                  {{ Math.abs(stats.growth_percentage || 0) }}%
                </span>
                <span class="text-muted micro-text">vs previous period</span>
              </div>
            </div>
          </div>

          <!-- Average Daily Revenue -->
          <div class="col-12 col-md-4">
            <div class="card border-0 shadow-sm rounded-3 bg-white p-4 h-100 card-stat">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <span class="text-muted text-uppercase micro-text fw-bold">Avg. Daily Revenue</span>
                <div class="icon-shape bg-primary-subtle text-primary rounded-3 p-2">
                  <i class="bi bi-calendar-event fs-5"></i>
                </div>
              </div>
              <h2 class="fw-bold text-dark mb-2 display-6">
                {{ formatCurrency(stats.average_daily_revenue) }}
              </h2>
              <span class="text-muted micro-text">Calculated daily earning rate</span>
            </div>
          </div>

          <!-- Average Booking Value -->
          <div class="col-12 col-md-4">
            <div class="card border-0 shadow-sm rounded-3 bg-white p-4 h-100 card-stat">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <span class="text-muted text-uppercase micro-text fw-bold">Avg. Reservation Value</span>
                <div class="icon-shape bg-warning-subtle text-warning rounded-3 p-2">
                  <i class="bi bi-receipt fs-5"></i>
                </div>
              </div>
              <h2 class="fw-bold text-dark mb-2 display-6">
                {{ formatCurrency(stats.average_booking_value) }}
              </h2>
              <span class="text-muted micro-text">Average yield per checkout</span>
            </div>
          </div>
        </div>

        <!-- Breakdown Card Container -->
        <div class="card border-0 shadow-sm rounded-3 bg-white p-4">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 class="fw-bold text-dark mb-1">Revenue by Room Category</h5>
              <p class="text-muted small mb-0">Detailed performance and earnings split per room type.</p>
            </div>
            <span class="badge bg-light text-secondary border px-3 py-2 fw-normal">
              {{ roomBreakdowns.length }} Categories
            </span>
          </div>

          <!-- Empty State -->
          <div v-if="!roomBreakdowns.length" class="text-center py-5 border rounded-3 bg-light style-empty-box">
            <i class="bi bi-bar-chart-line display-5 text-muted opacity-50 d-block mb-2"></i>
            <h6 class="fw-semibold text-secondary">No Financial Data Recorded</h6>
            <p class="text-muted small mb-0">Revenue details will appear here once bookings are confirmed.</p>
          </div>

          <!-- Revenue List with Progress Bars -->
          <div v-else class="d-flex flex-column gap-3">
            <div
              v-for="room in roomBreakdowns"
              :key="room.id || room.name"
              class="p-3 rounded-3 bg-light-subtle border border-light-subtle hover-bg-light transition-all"
            >
              <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="d-flex align-items-center gap-3">
                  <div class="room-icon-box rounded-2 bg-white border text-emerald p-2 d-flex align-items-center justify-content-center">
                    <i class="bi bi-door-closed fs-5"></i>
                  </div>
                  <div>
                    <h6 class="fw-bold text-dark mb-0">{{ room.name }}</h6>
                    <small class="text-muted micro-text">
                      <i class="bi bi-journal-check me-1"></i>{{ room.bookings_count || 0 }} bookings ·
                      <i class="bi bi-moon me-1"></i>{{ room.nights_count || 0 }} nights
                    </small>
                  </div>
                </div>

                <div class="text-end">
                  <span class="fw-bold text-dark fs-5 d-block">
                    {{ formatCurrency(room.total_revenue) }}
                  </span>
                  <small class="text-muted micro-text">
                    {{ calculateShare(room.total_revenue) }}% of total
                  </small>
                </div>
              </div>

              <!-- Visual Share Progress Bar -->
              <div class="progress mt-2" style="height: 6px;">
                <div
                  class="progress-bar bg-emerald"
                  role="progressbar"
                  :style="{ width: calculateShare(room.total_revenue) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useManagerStore } from '@/stores/manager'

const managerStore = useManagerStore()
const selectedPeriod = ref('30 Days')

// Computed Properties mapped directly to Pinia store state
const stats = computed(() => managerStore.revenueStats || {})
const roomBreakdowns = computed(() => managerStore.revenueByRoomType || [])

// Calculate Room Tier Share Percentage
const calculateShare = (amount) => {
  const total = stats.value.total_revenue || 0
  if (!total || !amount) return 0
  return Math.round((amount / total) * 100)
}

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
/* Emerald Palette & Accents */
.btn-emerald {
  background-color: #059669;
  color: #ffffff;
  border: none;
}

.btn-emerald:hover {
  background-color: #047857;
  color: #ffffff;
}

.bg-emerald {
  background-color: #059669 !important;
}

.bg-emerald-subtle {
  background-color: #d1fae5;
}

.text-emerald {
  color: #059669;
}

.micro-text {
  font-size: 0.75rem;
}

/* Card Visual Tweaks */
.card-stat {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card-stat:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05) !important;
}

.icon-shape {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.room-icon-box {
  width: 42px;
  height: 42px;
}

.transition-all {
  transition: all 0.2s ease;
}

.hover-bg-light:hover {
  background-color: #f8fafc !important;
}

.style-empty-box {
  border-style: dashed !important;
}
</style>