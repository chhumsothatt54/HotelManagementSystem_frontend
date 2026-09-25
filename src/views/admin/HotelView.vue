<template>
  <div class="page-container">
    <!-- Topbar -->
    <AdminTopbar title="Hotels" subtitle="Platform performance overview" />

    <div class="content-area">
      <!-- Header -->
      <div class="page-header mb-4">
        <div class="category-tag">PROPERTIES</div>
        <h1 class="main-title">Hotels</h1>
        <p class="main-subtitle">Approve, reject, or manage hotels created by managers.</p>
      </div>

      <!-- Filter Tabs -->
      <div class="filter-tabs">
        <button v-for="tab in filterTabs" :key="tab.value" class="tab-pill" :class="{ active: activeTab === tab.value }"
          @click="activeTab = tab.value">
          {{ tab.label }}
        </button>
      </div>

      <!-- Table Card Container -->
      <div class="table-card">
        <div class="table-responsive">
          <table class="custom-table align-middle">
            <thead>
              <tr>
                <th>HOTEL</th>
                <th>MANAGER</th>
                <th>LOCATION</th>
                <th>ROOMS</th>
                <th>STATUS</th>
                <th class="text-end">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <!-- Loading State -->
              <tr v-if="loading">
                <td colspan="6" class="text-center py-5 text-muted">Loading hotels data...</td>
              </tr>

              <!-- Empty State -->
              <tr v-else-if="!filteredHotels.length">
                <td colspan="6" class="text-center py-5 text-muted">No hotels found for this filter.</td>
              </tr>

              <!-- Data Rows -->
              <tr v-for="hotel in filteredHotels" :key="hotel.id" v-else>
                <td class="fw-bold hotel-name">
                  <div class="d-flex align-items-center gap-3">
                    <div v-if="hotel.images && hotel.images.length" class="border-0 rounded text-center overflow-hidden"
                      style="width: 48px; height: 48px; flex-shrink: 0;">
                      <img
                        :src="hotel.images[0].image.startsWith('http') ? hotel.images[0].image : (hotel.images[0].image.startsWith('uploads/') ? `http://127.0.0.1:8000/${hotel.images[0].image}` : `http://127.0.0.1:8000/storage/${hotel.images[0].image}`)"
                        style="width: 100%; height: 100%; object-fit: cover;" alt="Hotel Image" />
                    </div>
                    <div v-else class="bg-light text-dark d-flex align-items-center justify-content-center rounded"
                      style="width: 48px; height: 48px; font-weight: 600; font-size: 16px; flex-shrink: 0; border: 1px solid #e5e7eb;">
                      H
                    </div>
                    <span>{{ hotel.name }}</span>
                  </div>
                </td>
                <td class="text-secondary">
                  <div class="d-flex align-items-center gap-2">
                    <div v-if="hotel.manager && hotel.manager.avatar" class="border-0"
                      style="width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0; overflow: hidden;">
                      <img
                        :src="hotel.manager.avatar.startsWith('http') ? hotel.manager.avatar : (hotel.manager.avatar.startsWith('uploads/') ? `http://127.0.0.1:8000/${hotel.manager.avatar}` : `http://127.0.0.1:8000/storage/${hotel.manager.avatar}`)"
                        style="width: 100%; height: 100%; object-fit: cover;" alt="Manager Avatar" />
                    </div>
                    <div v-else class="bg-light text-dark d-flex align-items-center justify-content-center"
                      style="width: 32px; height: 32px; border-radius: 50%; font-weight: 600; font-size: 13px; flex-shrink: 0; border: 1px solid #e5e7eb;">
                      {{ (hotel.manager?.name || hotel.manager_name || 'M').charAt(0).toUpperCase() }}
                    </div>
                    <span>{{ hotel.manager?.name || hotel.manager_name || 'N/A' }}</span>
                  </div>
                </td>
                <td class="text-secondary">
                  <a v-if="hotel.address || hotel.location"
                    :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.address || hotel.location)}`"
                    target="_blank" class="text-decoration-none text-primary">
                    <i class="bi bi-geo-alt-fill me-1"></i>
                    {{ hotel.address || hotel.location }}
                  </a>
                  <span v-else>N/A</span>
                </td>
                <td class="text-secondary fw-semibold">{{ hotel.rooms_count ?? hotel.rooms?.length ?? 0 }} Rooms</td>
                <td>
                  <span class="status-badge" :class="hotel.status?.toLowerCase()">
                    {{ hotel.status }}
                  </span>
                </td>
                <td>
                  <div class="d-flex align-items-center justify-content-end gap-2">
                    <!-- Actions for Pending status: Check and X buttons -->
                    <template v-if="hotel.status?.toLowerCase() === 'pending'">
                      <button class="icon-action-btn check-btn" title="Approve"
                        @click="changeStatus(hotel.id, 'approved')">
                        <i class="bi bi-check"></i>
                      </button>
                      <button class="icon-action-btn cross-btn" title="Reject"
                        @click="changeStatus(hotel.id, 'rejected')">
                        <i class="bi bi-x-lg"></i>
                      </button>
                    </template>

                    <!-- Status Select Dropdown for non-pending -->
                    <div v-else class="status-select-wrapper">
                      <select :value="hotel.status?.toLowerCase()" class="status-select"
                        @change="changeStatus(hotel.id, $event.target.value)">
                        <option value="pending">pending</option>
                        <option value="approved">approved</option>
                        <option value="rejected">rejected</option>
                        <option value="inactive">inactive</option>
                      </select>
                    </div>

                    <!-- Delete Button -->
                    <button class="icon-action-btn delete-btn" title="Delete Hotel" @click="deleteHotel(hotel.id)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AdminTopbar from '@/components/layout/admin/AdminTopbar.vue'
import { ref, computed, onMounted } from 'vue';
import { useAdminStore } from '@/stores/admin';

const adminStore = useAdminStore();
const loading = ref(false);
const activeTab = ref('all');

const filterTabs = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Inactive', value: 'inactive' },
];

const loadHotels = async () => {
  loading.value = true;
  try {
    await adminStore.getHotels();
  } catch (error) {
    console.error('Failed to load hotels:', error);
  } finally {
    loading.value = false;
  }
};

// Safe getter for hotels list array
const rawHotels = computed(() => {
  const data = adminStore.allHotel;
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  return [];
});

// Filter list based on selected tab
const filteredHotels = computed(() => {
  if (activeTab.value === 'all') return rawHotels.value;
  return rawHotels.value.filter(
    (hotel) => hotel.status?.toLowerCase() === activeTab.value.toLowerCase()
  );
});

const changeStatus = async (id, status) => {
  try {
    await adminStore.updateHotelStatus(id, status);
    await loadHotels();
  } catch (error) {
    console.error('Failed to update status:', error);
  }
};

const deleteHotel = async (id) => {
  if (confirm('Are you sure you want to delete this hotel?')) {
    try {
      await adminStore.deleteHotel(id);
      await loadHotels();
    } catch (error) {
      console.error('Failed to delete hotel:', error);
      alert('Failed to delete hotel.');
    }
  }
};

onMounted(() => {
  loadHotels();
});
</script>

<style scoped>
.page-container {
  background-color: #f3f7f5;
  min-height: 100vh;
  font-family: system-ui, -apple-system, sans-serif;
}

/* Topbar Styles */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #eef2f0;
}

.topbar-title {
  color: var(--text-main, #111827);
}

.icon-btn {
  background: var(--bg-card, #ffffff);
  border: 1px solid #e2e8f0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  color: #0f766e;
}

.dot {
  position: absolute;
  top: 10px;
  right: 12px;
  width: 6px;
  height: 6px;
  background-color: #10b981;
  border-radius: 50%;
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px;
  border-radius: 30px;
  background: var(--bg-card, #ffffff);
  cursor: pointer;
}

.avatar-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #0f766e;
  color: var(--bg-card, white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
}

.font-sm {
  font-size: 13px;
}

.font-xs {
  font-size: 11px;
}

/* Content Area */
.content-area {
  padding: 32px 40px;
}

/* Header Styling */
.category-tag {
  color: #0f766e;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
  margin-bottom: 4px;
}

.main-title {
  font-size: 28px;
  font-family: Georgia, 'Times New Roman', serif;
  color: var(--text-main, #111827);
  font-weight: 600;
  margin-bottom: 6px;
}

.main-subtitle {
  color: var(--text-muted, #6b7280);
  font-size: 14px;
  margin-bottom: 24px;
}

/* Filter Pills */
.filter-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
}

.tab-pill {
  border: 1px solid #eef2f0;
  background: var(--bg-card, #ffffff);
  color: var(--text-main, #374151);
  padding: 6px 18px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
}

.tab-pill.active {
  background-color: #0f766e;
  border-color: #0f766e;
  color: var(--bg-card, #ffffff);
}

.tab-pill:hover:not(.active) {
  background-color: var(--bg-card, #f9fafb);
}

/* Card & Table */
.table-card {
  background: var(--bg-card, #ffffff);
  border-radius: 12px;
  border: 1px solid #eef2f0;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
}

.custom-table th {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted, #6b7280);
  letter-spacing: 0.5px;
  padding: 16px 12px;
  border-bottom: 1px solid var(--bg-card, #f3f4f6);
  text-transform: uppercase;
}

.custom-table td {
  padding: 18px 12px;
  border-bottom: 1px solid var(--bg-card, #f9fafb);
  font-size: 14px;
}

.hotel-name {
  color: var(--text-main, #111827);
}

/* Status Badges */
.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: lowercase;
}

.status-badge.approved {
  background-color: #dcfce7;
  color: #0f766e;
}

.status-badge.pending {
  background-color: #fef3c7;
  color: #b45309;
}

.status-badge.rejected {
  background-color: #fee2e2;
  color: #991b1b;
}

.status-badge.inactive {
  background-color: #f1f5f9;
  color: #64748b;
}

/* Controls & Buttons */
.status-select-wrapper {
  display: inline-block;
}

.status-select {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 6px 24px 6px 12px;
  font-size: 13px;
  color: var(--text-main, #374151);
  background-color: var(--bg-card, #ffffff);
  outline: none;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 12px;
}

.icon-action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background-color: var(--bg-card, #ffffff);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 13px;
}

.check-btn {
  color: #10b981;
}

.check-btn:hover {
  background-color: #ecfdf5;
  border-color: #10b981;
}

.cross-btn {
  color: #ef4444;
}

.cross-btn:hover {
  background-color: #fef2f2;
  border-color: #ef4444;
}

.delete-btn {
  color: #ef4444;
}

.delete-btn:hover {
  background-color: #fef2f2;
  border-color: #fca5a5;
}
</style>
