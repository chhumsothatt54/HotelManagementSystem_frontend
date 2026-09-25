<template>
  <div class="pricing-container">
    <div class="page-content">
      <!-- Section Header -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <br>
          <span
            class="badge bg-emerald-subtle text-emerald text-uppercase fw-semibold mb-2 px-2.5 py-1 rounded-pill"
            style="font-size: 0.7rem; letter-spacing: 0.5px;"
          >
            ROOM MANAGEMENT
          </span>
          <h2 class="fw-bold text-dark mb-1 h3">Pricing Configuration</h2>
          <p class="text-muted small mb-0">
            Configure default room rates and seasonal price adjustments.
          </p>
        </div>

        <div>
          <button
            class="btn btn-emerald rounded-3 px-3.5 py-2 fw-medium d-flex align-items-center gap-2 shadow-sm"
            @click="handleSave"
            :disabled="managerStore.loading || saving || !localRoomTypes.length"
          >
            <span
              v-if="saving"
              class="spinner-border spinner-border-sm"
              role="status"
            ></span>
            <i v-else class="bi bi-check-lg fs-6"></i>
            <span>{{ saving ? 'Saving Changes...' : 'Save Pricing' }}</span>
          </button>
        </div>
      </div>

      <!-- Alert Messages -->
      <div
        v-if="successMessage"
        class="alert alert-success border-0 shadow-sm rounded-3 fade show mb-4 d-flex align-items-center"
        role="alert"
      >
        <i class="bi bi-check-circle-fill fs-5 me-2.5 text-emerald"></i>
        <div class="flex-grow-1 small">{{ successMessage }}</div>
        <button
          type="button"
          class="btn-close ms-auto"
          @click="successMessage = null"
        ></button>
      </div>

      <div
        v-if="managerStore.error"
        class="alert alert-danger border-0 shadow-sm rounded-3 fade show mb-4 d-flex align-items-center"
        role="alert"
      >
        <i class="bi bi-exclamation-triangle-fill fs-5 me-2.5"></i>
        <div class="flex-grow-1 small">{{ managerStore.error }}</div>
        <button
          type="button"
          class="btn-close ms-auto"
          @click="managerStore.clearError?.()"
        ></button>
      </div>

      <!-- Main Pricing Card -->
      <div class="card border-0 shadow-sm rounded-4 bg-white p-4">
        <div class="table-responsive">
          <table class="table align-middle mb-0 custom-table">
            <thead>
              <tr class="text-uppercase text-secondary">
                <th scope="col" class="py-3 px-3 fw-bold extra-small tracking-wider" style="width: 40%;">
                  ROOM CATEGORY
                </th>
                <th scope="col" class="py-3 px-3 fw-bold extra-small tracking-wider" style="width: 25%;">
                  MAX CAPACITY
                </th>
                <th scope="col" class="py-3 px-3 fw-bold extra-small tracking-wider" style="width: 35%;">
                  PRICE PER NIGHT
                </th>
              </tr>
            </thead>

            <tbody>
              <!-- Loading State -->
              <tr v-if="managerStore.loading && !localRoomTypes.length">
                <td colspan="3" class="text-center py-5 text-muted">
                  <div class="spinner-border spinner-border-sm text-emerald me-2" role="status"></div>
                  <span class="small">Fetching pricing plans...</span>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-else-if="!localRoomTypes.length">
                <td colspan="3" class="text-center py-5">
                  <div class="empty-icon-circle mx-auto mb-3 d-flex align-items-center justify-content-center">
                    <i class="bi bi-tag fs-4 text-muted"></i>
                  </div>
                  <h6 class="fw-semibold text-dark small mb-1">No Room Categories Found</h6>
                  <p class="text-muted extra-small mb-0">Please create room categories first to manage pricing.</p>
                </td>
              </tr>

              <!-- Room Rows -->
              <tr v-else v-for="room in localRoomTypes" :key="room.id || room._id" class="table-row">
                <!-- Room Name & Info -->
                <td class="py-3.5 px-3">
                  <div class="fw-semibold text-dark">{{ room.name }}</div>
                  <span v-if="room.description" class="text-muted extra-small text-truncate d-block" style="max-width: 280px;">
                    {{ room.description }}
                  </span>
                </td>

                <!-- Capacity Badge -->
                <td class="py-3.5 px-3">
                  <span class="badge bg-light text-secondary rounded-pill px-2.5 py-1.5 fw-normal small">
                    <i class="bi bi-person me-1"></i>{{ room.max_guests }} {{ room.max_guests > 1 ? 'Guests' : 'Guest' }}
                  </span>
                </td>

                <!-- Price Input Group -->
                <td class="py-3.5 px-3">
                  <div class="input-group custom-input-group">
                    <span class="input-group-text border-end-0 bg-light text-muted fw-medium px-3">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      class="form-control price-input border-start-0 ps-1"
                      placeholder="0.00"
                      v-model.number="room.price_per_night"
                    />
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
import { ref, onMounted, watch } from 'vue'
import { useManagerStore } from '@/stores/manager'

const managerStore = useManagerStore()

const localRoomTypes = ref([])
const saving = ref(false)
const successMessage = ref(null)

onMounted(async () => {
  await managerStore.getRoomTypes()
})

// Sync Pinia store to reactive form state
watch(
  () => managerStore.roomTypes,
  (newVal) => {
    localRoomTypes.value = JSON.parse(JSON.stringify(newVal || []))
  },
  { immediate: true, deep: true }
)

const handleSave = async () => {
  saving.value = true
  successMessage.value = null
  managerStore.clearError?.()

  try {
    const updatePromises = localRoomTypes.value.map((room) =>
      managerStore.updateRoomType(room.id || room._id, {
        price_per_night: room.price_per_night
      })
    )

    await Promise.all(updatePromises)
    successMessage.value = 'Room prices updated successfully!'
    await managerStore.getRoomTypes()
  } catch (err) {
    console.error('Failed to update pricing:', err)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
/* Topbar & Page Container Resets */
.pricing-container,
.page-content {
  padding-left: 1rem !important; 
  padding-right: 1rem !important;
  padding-top: 0 !important;
  margin-top: 0 !important;
}

/* Typography & Accent Badges */
.extra-small {
  font-size: 0.75rem;
}

.tracking-wider {
  letter-spacing: 0.05em;
}


.text-emerald {
  color: #059669;
}

/* Buttons */
.btn-emerald {
  background-color: #059669;
  color: var(--bg-card, #ffffff);
  border: none;
  transition: all 0.2s ease;
}

.btn-emerald:hover:not(:disabled) {
  background-color: #047857;
  color: var(--bg-card, #ffffff);
}

/* Table Styling */
.custom-table {
  border-collapse: separate;
  border-spacing: 0;
}

.custom-table thead th {
  border-bottom: 1px solid #f1f5f9;
  background-color: #fafafa;
}

.custom-table tbody tr {
  transition: background-color 0.15s ease;
}

.custom-table tbody tr:hover {
  background-color: var(--bg-soft, #f8fafc);
}

.custom-table td {
  border-bottom: 1px solid #f1f5f9;
}

/* Form Input Control */
.custom-input-group {
  max-width: 220px;
}

.custom-input-group .input-group-text {
  border-color: #e2e8f0;
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
}

.price-input {
  border-color: #e2e8f0;
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  font-weight: 600;
  color: #0f172a;
  background-color: var(--bg-soft, #f8fafc);
  transition: all 0.2s ease;
}

.price-input:focus {
  background-color: var(--bg-card, #ffffff);
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  outline: none;
}

/* Empty State Helper */
.empty-icon-circle {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background-color: var(--bg-soft, #f8fafc);
  border: 1px dashed #e2e8f0;
}
</style>