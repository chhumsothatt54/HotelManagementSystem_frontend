<template>
  <div class="occupancy-page">

    <!-- Topbar -->
    <div class="topbar bg-white">
      <div>
        <h1 class="page-title brand-serif">Occupancy</h1>
        <div class="page-subtitle">
          Monitor your hotel room occupancy
        </div>
      </div>

      <div class="topbar-date">
        <i class="bi bi-calendar3"></i>
        {{ currentDate }}
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-box">
      <div class="spinner-border" role="status"></div>
      <span>Loading occupancy report...</span>
    </div>

    <!-- Error -->
    <div v-else-if="managerStore.error" class="alert alert-danger">
      <i class="bi bi-exclamation-circle me-2"></i>
      {{ managerStore.error }}
    </div>

    <!-- Content -->
    <div v-else class="content-area">

      <!-- Summary Cards -->
      <div class="stats-grid">

        <!-- Total Rooms -->
        <div class="stat-card">
          <div class="stat-icon">
            <i class="bi bi-building"></i>
          </div>

          <div class="stat-content">
            <div class="stat-label">Total Rooms</div>
            <div class="stat-value">
              {{ totalRooms }}
            </div>
            <div class="stat-description">
              Rooms in your hotel
            </div>
          </div>
        </div>

        <!-- Occupied -->
        <div class="stat-card">
          <div class="stat-icon occupied-icon">
            <i class="bi bi-door-closed"></i>
          </div>

          <div class="stat-content">
            <div class="stat-label">Occupied Rooms</div>
            <div class="stat-value">
              {{ occupiedRooms }}
            </div>
            <div class="stat-description">
              Currently occupied
            </div>
          </div>
        </div>

        <!-- Available -->
        <div class="stat-card">
          <div class="stat-icon available-icon">
            <i class="bi bi-door-open"></i>
          </div>

          <div class="stat-content">
            <div class="stat-label">Available Rooms</div>
            <div class="stat-value">
              {{ availableRooms }}
            </div>
            <div class="stat-description">
              Ready for booking
            </div>
          </div>
        </div>

        <!-- Occupancy Rate -->
        <div class="stat-card">
          <div class="stat-icon rate-icon">
            <i class="bi bi-bar-chart-line"></i>
          </div>

          <div class="stat-content">
            <div class="stat-label">Occupancy Rate</div>
            <div class="stat-value">
              {{ occupancyPercentage }}%
            </div>
            <div class="stat-description">
              Current occupancy
            </div>
          </div>
        </div>

      </div>

      <!-- Occupancy Overview -->
      <div class="dashboard-grid">

        <!-- Donut Chart -->
        <div class="card-box occupancy-card">

          <div class="card-header">
            <div>
              <h2>Occupancy Overview</h2>
              <p>Current room availability</p>
            </div>
          </div>

          <div class="donut-wrapper">

            <div
              class="donut-chart"
              :style="donutStyle"
            >
              <div class="donut-center">
                <strong>{{ occupancyPercentage }}%</strong>
                <span>Occupied</span>
              </div>
            </div>

            <div class="legend">

              <div class="legend-item">
                <span class="legend-dot occupied-dot"></span>

                <div>
                  <strong>{{ occupiedRooms }}</strong>
                  <span>Occupied</span>
                </div>
              </div>

              <div class="legend-item">
                <span class="legend-dot available-dot"></span>

                <div>
                  <strong>{{ availableRooms }}</strong>
                  <span>Available</span>
                </div>
              </div>

              <div
                v-if="otherRooms > 0"
                class="legend-item"
              >
                <span class="legend-dot other-dot"></span>

                <div>
                  <strong>{{ otherRooms }}</strong>
                  <span>Other</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        <!-- Occupancy Details -->
        <div class="card-box">

          <div class="card-header">
            <div>
              <h2>Occupancy Details</h2>
              <p>Room status breakdown</p>
            </div>
          </div>

          <div class="details-list">

            <!-- Occupied -->
            <div class="detail-row">
              <div class="detail-info">
                <span class="status-dot occupied-dot"></span>

                <div>
                  <strong>Occupied</strong>
                  <small>Rooms currently occupied</small>
                </div>
              </div>

              <div class="detail-value">
                {{ occupiedRooms }}
              </div>
            </div>

            <!-- Available -->
            <div class="detail-row">
              <div class="detail-info">
                <span class="status-dot available-dot"></span>

                <div>
                  <strong>Available</strong>
                  <small>Rooms ready for booking</small>
                </div>
              </div>

              <div class="detail-value">
                {{ availableRooms }}
              </div>
            </div>

            <!-- Total -->
            <div class="detail-row total-row">
              <div class="detail-info">
                <span class="status-dot total-dot"></span>

                <div>
                  <strong>Total Rooms</strong>
                  <small>Total rooms in hotel</small>
                </div>
              </div>

              <div class="detail-value">
                {{ totalRooms }}
              </div>
            </div>

          </div>

          <!-- Progress -->
          <div class="progress-section">

            <div class="progress-header">
              <span>Occupancy Rate</span>
              <strong>{{ occupancyPercentage }}%</strong>
            </div>

            <div class="progress">
              <div
                class="progress-bar"
                :style="{ width: `${occupancyPercentage}%` }"
              ></div>
            </div>

          </div>

        </div>

      </div>

      <!-- Empty State -->
      <div
        v-if="totalRooms === 0"
        class="empty-state"
      >
        <div class="empty-icon">
          <i class="bi bi-building"></i>
        </div>

        <h3>No Room Data</h3>

        <p>
          There is currently no room occupancy data available
          for your hotel.
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useManagerStore } from '@/stores/manager'

const managerStore = useManagerStore()

/*
|--------------------------------------------------------------------------
| Occupancy Report
|--------------------------------------------------------------------------
| Uses the same state as Dashboard.vue:
| managerStore.occupancyReport
*/
const occupancy = computed(() => {
  return managerStore.occupancyReport || {}
})

/*
|--------------------------------------------------------------------------
| Room Statistics
|--------------------------------------------------------------------------
*/

const totalRooms = computed(() => {
  return Number(occupancy.value.total_rooms || 0)
})

const occupiedRooms = computed(() => {
  return Number(occupancy.value.occupied_rooms || 0)
})

const availableRooms = computed(() => {
  if (
    occupancy.value.available_rooms !== undefined &&
    occupancy.value.available_rooms !== null
  ) {
    return Number(occupancy.value.available_rooms)
  }

  return Math.max(
    totalRooms.value - occupiedRooms.value,
    0
  )
})

/*
|--------------------------------------------------------------------------
| Occupancy Rate
|--------------------------------------------------------------------------
*/

const occupancyPercentage = computed(() => {
  if (
    occupancy.value.occupancy_rate !== undefined &&
    occupancy.value.occupancy_rate !== null
  ) {
    return Math.round(
      Number(occupancy.value.occupancy_rate)
    )
  }

  if (!totalRooms.value) {
    return 0
  }

  return Math.round(
    (occupiedRooms.value / totalRooms.value) * 100
  )
})

/*
|--------------------------------------------------------------------------
| Other Rooms
|--------------------------------------------------------------------------
*/

const otherRooms = computed(() => {
  const other =
    totalRooms.value -
    occupiedRooms.value -
    availableRooms.value

  return other > 0 ? other : 0
})

/*
|--------------------------------------------------------------------------
| Donut Chart
|--------------------------------------------------------------------------
*/

const donutStyle = computed(() => {
  const percentage = Math.min(
    Math.max(occupancyPercentage.value, 0),
    100
  )

  return {
    background: `conic-gradient(
      var(--blue) ${percentage}%,
      var(--blue-light) ${percentage}% 100%
    )`
  }
})

/*
|--------------------------------------------------------------------------
| Current Date
|--------------------------------------------------------------------------
*/

const currentDate = computed(() => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date())
})

/*
|--------------------------------------------------------------------------
| Loading
|--------------------------------------------------------------------------
*/

const loading = computed(() => {
  return managerStore.loading
})

/*
|--------------------------------------------------------------------------
| Load Occupancy
|--------------------------------------------------------------------------
*/

async function loadOccupancy() {
  managerStore.clearError()

  try {
    await managerStore.getOccupancyReport()
  } catch (error) {
    console.error(
      'Failed to load occupancy report:',
      error
    )
  }
}

onMounted(() => {
  loadOccupancy()
})
</script>
<style scoped>
/* =====================================================
   CONNECT OCCUPANCY TO MANAGER SIDEBAR
   ===================================================== */

.occupancy-page {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background: #f8faf9;
}



/* Header stays attached to sidebar */
.occupancy-page .topbar {
  width: 100%;
  margin: 0;
  box-sizing: border-box;
}

/* Page content */
.occupancy-page .content-area {
  width: 100%;
  box-sizing: border-box;
  padding: 30px;
}

/* =====================================================
   OCCUPANCY PAGE
   ===================================================== */

.occupancy-page {
  width: 100%;
  min-height: 100vh;
  background: #f8faf9;
  box-sizing: border-box;
  overflow-x: hidden;
}

/* =====================================================
   TOPBAR
   ===================================================== */

.occupancy-page .topbar {
  position: relative !important;
  top: auto !important;
  left: auto !important;
  right: auto !important;

  width: 100%;
  min-height: 100px;
  box-sizing: border-box;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 24px 30px;

  background: #ffffff;
  border-bottom: 1px solid #e8eeee;

  z-index: 10;
}

.page-title {
  margin: 0;
  font-size: 28px;
  line-height: 1.2;
  font-weight: 700;
  color: var(--navy, #063b32);
}

.brand-serif {
  font-family: Georgia, "Times New Roman", serif;
}

.page-subtitle {
  margin-top: 6px;
  color: #71807b;
  font-size: 14px;
}

.topbar-date {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64736e;
  font-size: 14px;
  white-space: nowrap;
}

/* =====================================================
   MAIN CONTENT
   ===================================================== */

.content-area {
  width: 100%;
  box-sizing: border-box;
  padding: 30px;
}

/* =====================================================
   LOADING
   ===================================================== */

.loading-box {
  min-height: 300px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  color: var(--blue, #008f72);
}

.loading-box .spinner-border {
  width: 24px;
  height: 24px;
}

/* =====================================================
   ERROR
   ===================================================== */

.alert {
  margin: 30px;
}

/* =====================================================
   SUMMARY CARDS
   ===================================================== */

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;

  width: 100%;
  margin-bottom: 25px;

  align-items: stretch;
}

.stat-card {
  min-width: 0;

  background: #ffffff;
  border: 1px solid #e8eeee;
  border-radius: 14px;

  padding: 22px;

  display: flex;
  align-items: center;
  gap: 16px;

  box-shadow: 0 3px 12px rgba(6, 59, 50, 0.04);

  box-sizing: border-box;
}

.stat-icon {
  width: 48px;
  height: 48px;

  flex: 0 0 48px;

  border-radius: 12px;

  background: var(--blue-light, #e6f5f1);
  color: var(--blue, #008f72);

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 21px;
}

.occupied-icon {
  background: #eaf5f2;
}

.available-icon {
  background: #eef8f5;
}

.rate-icon {
  background: #e6f5f1;
}

.stat-content {
  min-width: 0;
}

.stat-label {
  color: #74827e;
  font-size: 13px;
  margin-bottom: 4px;
}

.stat-value {
  color: var(--navy, #063b32);
  font-size: 26px;
  font-weight: 700;
  line-height: 1.2;
}

.stat-description {
  color: #98a49f;
  font-size: 12px;
  margin-top: 3px;
}

/* =====================================================
   DASHBOARD GRID
   ===================================================== */

.dashboard-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);

  gap: 25px;

  width: 100%;
}

/* =====================================================
   CARDS
   ===================================================== */

.card-box {
  min-width: 0;

  background: #ffffff;
  border: 1px solid #e8eeee;
  border-radius: 14px;

  padding: 24px;

  box-shadow: 0 3px 12px rgba(6, 59, 50, 0.04);

  box-sizing: border-box;
}

.card-header {
  margin-bottom: 25px;
}

.card-header h2 {
  margin: 0;

  color: var(--navy, #063b32);

  font-size: 18px;
  line-height: 1.3;
  font-weight: 700;
}

.card-header p {
  margin: 5px 0 0;

  color: #85918d;
  font-size: 13px;
}

/* =====================================================
   DONUT CHART
   ===================================================== */

.donut-wrapper {
  min-height: 260px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 45px;
}

.donut-chart {
  width: 190px;
  height: 190px;

  flex: 0 0 190px;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;
}

.donut-chart::before {
  content: "";

  position: absolute;

  width: 135px;
  height: 135px;

  background: #ffffff;
  border-radius: 50%;
}

.donut-center {
  position: relative;
  z-index: 1;

  text-align: center;
}

.donut-center strong {
  display: block;

  color: var(--navy, #063b32);

  font-size: 28px;
  line-height: 1.2;
  font-weight: 700;
}

.donut-center span {
  color: #85918d;
  font-size: 12px;
}

/* =====================================================
   LEGEND
   ===================================================== */

.legend {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.legend-dot,
.status-dot {
  width: 10px;
  height: 10px;

  flex: 0 0 10px;

  border-radius: 50%;
}

.occupied-dot {
  background: var(--blue, #008f72);
}

.available-dot {
  background: var(--blue-light, #e6f5f1);
  border: 1px solid #c9e5dd;
  box-sizing: border-box;
}

.other-dot {
  background: #b8c5c1;
}

.legend-item strong {
  display: block;

  color: var(--navy, #063b32);

  font-size: 15px;
}

.legend-item span:last-child {
  color: #8a9692;
  font-size: 12px;
}

/* =====================================================
   DETAILS
   ===================================================== */

.details-list {
  display: flex;
  flex-direction: column;
}

.detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 17px 0;

  border-bottom: 1px solid #edf1ef;
}

.detail-row:first-child {
  padding-top: 0;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.detail-info strong {
  display: block;

  color: var(--navy, #063b32);

  font-size: 14px;
}

.detail-info small {
  display: block;

  margin-top: 3px;

  color: #8b9793;
  font-size: 12px;
}

.detail-value {
  color: var(--navy, #063b32);

  font-size: 18px;
  font-weight: 700;
}

.total-row {
  margin-top: 5px;

  padding-top: 18px;

  border-top: 1px solid #e1e9e6;
}

/* =====================================================
   PROGRESS
   ===================================================== */

.progress-section {
  margin-top: 25px;

  padding-top: 20px;

  border-top: 1px solid #edf1ef;
}

.progress-header {
  display: flex;
  justify-content: space-between;

  margin-bottom: 9px;

  color: #66736f;
  font-size: 13px;
}

.progress-header strong {
  color: var(--navy, #063b32);
}

.progress {
  width: 100%;
  height: 9px;

  background: var(--blue-light, #e6f5f1);

  border-radius: 20px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;

  background: var(--blue, #008f72);

  border-radius: 20px;

  transition: width 0.4s ease;
}

/* =====================================================
   EMPTY STATE
   ===================================================== */

.empty-state {
  margin-top: 25px;

  background: #ffffff;

  border: 1px dashed #cddbd6;
  border-radius: 14px;

  padding: 45px 20px;

  text-align: center;
}

.empty-icon {
  width: 60px;
  height: 60px;

  margin: 0 auto 15px;

  border-radius: 50%;

  background: var(--blue-light, #e6f5f1);
  color: var(--blue, #008f72);

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 25px;
}

.empty-state h3 {
  margin: 0;

  color: var(--navy, #063b32);

  font-size: 18px;
}

.empty-state p {
  margin: 8px auto 0;

  max-width: 420px;

  color: #899590;
  font-size: 13px;
}

/* =====================================================
   RESPONSIVE
   ===================================================== */

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 950px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .donut-wrapper {
    min-height: 240px;
  }
}

@media (max-width: 650px) {
  .occupancy-page .topbar {
    min-height: auto;

    padding: 20px;

    align-items: flex-start;
    flex-direction: column;

    gap: 15px;
  }

  .content-area {
    padding: 20px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .donut-wrapper {
    flex-direction: column;
    gap: 25px;
  }

  .donut-chart {
    width: 170px;
    height: 170px;
    flex-basis: 170px;
  }

  .donut-chart::before {
    width: 120px;
    height: 120px;
  }
}
</style>