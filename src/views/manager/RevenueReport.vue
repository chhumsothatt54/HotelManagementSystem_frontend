<template>
  <div class="revenue-reports-page">

    <!-- Main Content Body -->
    <main class="page-content">
      <!-- Section Title & Action Button -->
      <div class="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <!-- Removed <br> that created extra gap -->
          <span class="eyebrow-text">REVENUE REPORTS</span>
          <h2 class="section-title brand-serif">Revenue Reports</h2>
          <p class="section-subtitle">Analyze your hotel's revenue performance.</p>
        </div>

        <button class="btn-emerald d-inline-flex align-items-center gap-2" @click="exportCSV" :disabled="loading || !revenueReport?.revenue?.length">
          <i class="bi bi-download"></i>
          <span>Export CSV</span>
        </button>
      </div>

      <!-- Error State -->
      <div v-if="error" class="alert alert-danger mb-4">
        {{ error }}
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-emerald"></div>
        <p class="mt-2 text-muted">Loading revenue report...</p>
      </div>

      <template v-else>
        <!-- Card Container with Filters and Metrics -->
        <div class="main-card-panel mb-4">
          <!-- Report Period Filter -->
          <div class="mb-4" style="max-width: 280px;">
            <label class="form-label fw-bold text-ink small mb-2">Report Period</label>
            <select class="form-select custom-select" v-model="selectedPeriod">
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="this_year">This Year</option>
            </select>
          </div>

          <!-- Summary Metric Cards -->
          <div class="row g-3">
            <div class="col-12 col-md-4">
              <div class="metric-card">
                <span class="metric-label">Total Revenue</span>
                <div class="metric-value">${{ totalRevenue.toFixed(0) }}</div>
              </div>
            </div>

            <div class="col-12 col-md-4">
              <div class="metric-card">
                <span class="metric-label">Total Bookings</span>
                <div class="metric-value">{{ totalBookings }}</div>
              </div>
            </div>

            <div class="col-12 col-md-4">
              <div class="metric-card">
                <span class="metric-label">Revenue Days</span>
                <div class="metric-value">{{ revenueReport?.revenue?.length || 0 }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Daily Breakdown Table -->
        <div class="main-card-panel">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <h3 class="h5 fw-bold text-ink m-0">Daily Revenue</h3>
            <button class="btn btn-sm btn-link text-emerald text-decoration-none" @click="loadRevenue">
              <i class="bi bi-arrow-clockwise me-1"></i> Refresh Data
            </button>
          </div>

          <!-- Empty State -->
          <div v-if="!revenueReport?.revenue?.length" class="text-center py-5 text-muted">
            <i class="bi bi-bar-chart fs-1 d-block mb-2 text-secondary"></i>
            <h5 class="fw-bold text-ink">No revenue data</h5>
            <p class="small mb-0">There is no completed booking revenue available yet.</p>
          </div>

          <!-- Revenue Data Table -->
          <div v-else class="table-responsive">
            <table class="table custom-table align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th class="text-end">Revenue</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in revenueReport.revenue" :key="item.date">
                  <td class="text-muted fw-semibold">#{{ index + 1 }}</td>
                  <td>
                    <div class="d-flex align-items-center gap-2">
                      <i class="bi bi-calendar3 text-muted"></i>
                      <span>{{ formatDate(item.date) }}</span>
                    </div>
                  </td>
                  <td class="text-end fw-bold text-ink">
                    ${{ Number(item.revenue).toFixed(2) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useManagerStore } from "@/stores/manager";

const managerStore = useManagerStore();
const selectedPeriod = ref("this_month");

const { revenueReport, loading, error } = storeToRefs(managerStore);

/* Total Revenue Calculation */
const totalRevenue = computed(() => {
  if (!revenueReport.value?.revenue) return 0;
  return revenueReport.value.revenue.reduce(
    (total, item) => total + Number(item.revenue || 0),
    0
  );
});

/* Total Bookings Calculation */
const totalBookings = computed(() => {
  if (!revenueReport.value?.revenue) return 0;
  return revenueReport.value.revenue.reduce(
    (total, item) => total + Number(item.bookings_count || item.bookings || 1),
    0
  );
});

/* Date Formatting */
function formatDate(date) {
  if (!date) return "-";
  return new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/* CSV Export Handler */
function exportCSV() {
  if (!revenueReport.value?.revenue?.length) return;

  const headers = ["Index,Date,Revenue"];
  const rows = revenueReport.value.revenue.map(
    (item, index) => `${index + 1},"${formatDate(item.date)}",${item.revenue}`
  );
  const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `revenue_report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* Load Data */
async function loadRevenue() {
  try {
    await managerStore.getRevenueReport();
  } catch (err) {
    console.error("Failed to load revenue report:", err);
  }
}

onMounted(() => {
  loadRevenue();
});
</script>

<style scoped>
.revenue-reports-page {
  --emerald: #087f68;
  --emerald-hover: #066754;
  --ink: #0f172a;
  --muted: #64748b;
  --line: #e2e8f0;
  --bg-page: #f8fafc;
  --card-bg: #f3f4f6;

  background-color: var(--bg-page);
  min-height: 100vh;
  width: 100%;
}

.brand-serif {
  font-family: "Lora", serif;
}

/* Page Layout */
.page-content {
  padding: 1rem 2rem 2rem 2rem; /* Reduced top padding from 2rem to 1rem */
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

.text-emerald {
  color: var(--emerald) !important;
}

/* Panel Card Container */
.main-card-panel {
  background: #ffffff;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 1.75rem;
}

/* Filter Dropdown Styling */
.custom-select {
  border-radius: 8px;
  border: 1px solid var(--line);
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: var(--ink);
}

.custom-select:focus {
  border-color: var(--emerald);
  box-shadow: 0 0 0 3px rgba(8, 127, 104, 0.15);
}

/* Inner Light Grey Metric Box */
.metric-card {
  background-color: var(--card-bg);
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.metric-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--muted);
  margin-bottom: 0.35rem;
}

.metric-value {
  font-size: 1.65rem;
  font-weight: 800;
  color: var(--ink);
  line-height: 1.1;
}

/* Custom Table Design */
.custom-table th {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--muted);
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--line);
  padding: 0.85rem 0.75rem;
  background-color: #f8fafc;
}

.custom-table td {
  padding: 0.85rem 0.75rem;
  border-bottom: 1px solid var(--line);
  font-size: 0.875rem;
}
</style>