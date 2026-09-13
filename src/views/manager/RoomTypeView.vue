<template>
  <!-- Top bar -->
  <div class="topbar bg-white">
    <div>
      <h1 class="page-title brand-serif">Room Types</h1>
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
    <div class="mb-1 text-uppercase fw-bold" style="font-size: 0.725rem; letter-spacing: 0.5px;color: var(--blue);">
      ROOM MANAGEMENT
    </div>

    <div class="d-flex justify-content-between align-items-center mb-1">
      <h2 class="fw-bold mb-0" style="color: #1f2937;">Room Types</h2>
      <button class="btn btn-emerald d-flex align-items-center gap-2" @click="openAddModal">
        <i class="bi bi-plus-lg"></i> Add Room Type
      </button>
    </div>

    <p class="text-muted mb-4" style="font-size: 0.875rem;">Configure room categories and specifications.</p>

    <!-- Error Alert -->
    <div v-if="managerStore.error" class="alert alert-danger alert-dismissible fade show mb-4" role="alert">
      {{ managerStore.error }}
      <button type="button" class="btn-close" @click="managerStore.clearError?.()"></button>
    </div>

    <!-- Success Alert -->
    <div v-if="successMessage" class="alert alert-success alert-dismissible fade show mb-4" role="alert">
      {{ successMessage }}
      <button type="button" class="btn-close" @click="successMessage = ''"></button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-emerald" role="status"></div>
      <p class="text-muted mt-2">Loading room categories...</p>
    </div>

    <template v-else>
      <!-- Empty State -->
      <div v-if="!roomTypes.length" class="text-center py-5 text-muted">
        <i class="bi bi-door-closed display-4 d-block mb-2"></i>
        No room types found. Click "Add Room Type" to create one.
      </div>

      <!-- Room Types Grid -->
      <div v-else class="row g-4">
        <div v-for="room in roomTypes" :key="room.id" class="col-12 col-md-6 col-xl-4">
          <div class="room-type-card h-100 d-flex align-items-start gap-3 p-3 border rounded shadow-sm bg-white">
            <div class="room-icon-box p-3 rounded bg-light text-emerald">
              <i class="bi bi-door-closed fs-4"></i>
            </div>
            <div class="flex-grow-1">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="fw-bold text-dark mb-0">{{ room.name }}</h6>
                <button 
                  v-if="managerStore.deleteRoomType" 
                  class="btn btn-link text-danger p-0 border-0" 
                  title="Delete Room Type" 
                  @click="deleteRoomType(room.id)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>

              <div class="spec-item d-flex justify-content-between text-muted small mb-1">
                <span><i class="bi bi-people me-1"></i> Capacity</span>
                <span class="spec-value text-dark fw-semibold">{{ room.capacity || room.max_occupancy || 1 }}</span>
              </div>

              <div class="spec-item d-flex justify-content-between text-muted small mb-1">
                <span><i class="bi bi-aspect-ratio me-1"></i> Size</span>
                <span class="spec-value text-dark fw-semibold">{{ room.size ? `${room.size} m²` : 'N/A' }}</span>
              </div>

              <div class="spec-item d-flex justify-content-between text-muted small">
                <span>Bed</span>
                <span class="spec-value text-dark fw-semibold">{{ room.bed_type || 'N/A' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>

  <!-- Add Room Type Modal -->
  <div
    v-if="showModal"
    class="modal fade show d-block"
    tabindex="-1"
    style="background-color: rgba(0,0,0,0.5);"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold">Add Room Type</h5>
          <button type="button" class="btn-close" @click="closeAddModal"></button>
        </div>

        <form @submit.prevent="handleCreateRoomType">
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label fw-semibold small">Room Type Name</label>
              <input
                v-model="form.name"
                type="text"
                class="form-control"
                placeholder="e.g. Deluxe King"
                required
              />
            </div>

            <div class="row g-3 mb-3">
              <div class="col-6">
                <label class="form-label fw-semibold small">Capacity (Guests)</label>
                <input
                  v-model.number="form.capacity"
                  type="number"
                  min="1"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-6">
                <label class="form-label fw-semibold small">Size (m²)</label>
                <input
                  v-model.number="form.size"
                  type="number"
                  min="1"
                  class="form-control"
                  placeholder="e.g. 28"
                  required
                />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold small">Bed Type</label>
              <input
                v-model="form.bed_type"
                type="text"
                class="form-control"
                placeholder="e.g. 1 King Bed"
                required
              />
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold small">Price per Night ($)</label>
              <input
                v-model.number="form.price"
                type="number"
                min="0"
                step="0.01"
                class="form-control"
                placeholder="e.g. 50.00"
                required
              />
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-light" @click="closeAddModal">Cancel</button>
            <button type="submit" class="btn btn-emerald" :disabled="submitting">
              <span v-if="submitting" class="spinner-border spinner-border-sm me-1"></span>
              {{ submitting ? 'Saving...' : 'Create Room Type' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue'
import { useManagerStore } from '@/stores/manager'

const managerStore = useManagerStore()

const loading = ref(false)
const submitting = ref(false)
const showModal = ref(false)
const successMessage = ref('')

const form = reactive({
  name: '',
  capacity: 2,
  size: null,
  bed_type: '',
  price: null
})

// Mapped Pinia state
const profile = computed(() => managerStore.profile || {})
const hotel = computed(() => managerStore.hotel || {})
const roomTypes = computed(() => managerStore.roomTypes || [])

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

// Modal Toggles
const openAddModal = () => {
  form.name = ''
  form.capacity = 2
  form.size = null
  form.bed_type = '',
  form.price = null
  showModal.value = true
}

const closeAddModal = () => {
  showModal.value = false
}

// Add Room Type
const handleCreateRoomType = async () => {
  submitting.value = true
  try {
    await managerStore.createRoomType?.({
      name: form.name,
      capacity: form.capacity,
      size: form.size,
      bed_type: form.bed_type,
      price: form.price
    })
    successMessage.value = 'Room type created successfully!'
    closeAddModal()
  } catch (err) {
    console.error('Failed to create room type:', err)
  } finally {
    submitting.value = false
  }
}

// Delete Room Type
const deleteRoomType = async (id) => {
  if (!confirm('Are you sure you want to delete this room type?')) return
  try {
    await managerStore.deleteRoomType?.(id)
    successMessage.value = 'Room type deleted successfully.'
  } catch (err) {
    console.error('Failed to delete room type:', err)
  }
}

// Initial Data Fetching
onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([
      managerStore.getProfile?.(),
      managerStore.getMyHotel?.(),
      managerStore.getRoomTypes?.()
    ])
  } catch (err) {
    console.error('Failed to load room types:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.btn-emerald:hover {
  background-color: var(--primary-emerald, #10b981);
  color: #ffffff;
  border: none;
}
.btn-emerald {
  background-color: #059669;
  color: #ffffff;
}
.text-emerald {
  color: var(--primary-emerald, #10b981);
}
</style>