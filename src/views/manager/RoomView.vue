<template>
  <!-- Top bar -->
  <div class="topbar bg-white">
    <div>
      <h1 class="page-title brand-serif">Rooms</h1>
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
    <!-- Section Title -->
    <div
      class="mb-1 text-uppercase text-emerald fw-bold"
      style="font-size: 0.725rem; letter-spacing: 0.5px; color: var(--blue);"
    >
      ROOM MANAGEMENT
    </div>

    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="fw-bold mb-0" style="color: #1f2937;">Rooms</h2>
      <button class="btn btn-emerald d-flex align-items-center gap-2" @click="openAddModal">
        <i class="bi bi-plus-lg"></i> Add Room
      </button>
    </div>

    <p class="text-muted mb-4" style="font-size: 0.875rem;">
      Manage individual rooms and their availability.
    </p>

    <!-- Error Alert -->
    <div
      v-if="managerStore.error"
      class="alert alert-danger alert-dismissible fade show mb-4"
      role="alert"
    >
      {{ managerStore.error }}
      <button type="button" class="btn-close" @click="managerStore.clearError?.()"></button>
    </div>

    <!-- Success Alert -->
    <div
      v-if="successMessage"
      class="alert alert-success alert-dismissible fade show mb-4"
      role="alert"
    >
      {{ successMessage }}
      <button type="button" class="btn-close" @click="successMessage = ''"></button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-emerald" role="status"></div>
      <p class="text-muted mt-2">Loading rooms data...</p>
    </div>

    <!-- Data Table Card Container -->
    <div v-else class="card-table-wrapper border rounded bg-white shadow-sm">
      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead>
            <tr class="text-uppercase" style="font-size: 0.75rem; letter-spacing: 0.5px;">
              <th scope="col" style="width: 15%;">ROOM</th>
              <th scope="col" style="width: 20%;">FLOOR</th>
              <th scope="col" style="width: 25%;">ROOM TYPE</th>
              <th scope="col" style="width: 25%;">STATUS</th>
              <th scope="col" class="text-end" style="width: 15%;">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!rooms.length">
              <td colspan="5" class="text-center py-4 text-muted">
                No rooms found. Click "Add Room" to create one.
              </td>
            </tr>
            <tr v-for="room in rooms" :key="room.id">
              <td class="fw-bold">{{ room.room_number || room.number || room.name }}</td>
              <td class="text-muted">Floor {{ room.floor || 1 }}</td>
              <td class="text-muted">
                {{ getRoomTypeName(room.room_type_id || room.type_id || room.room_type) }}
              </td>
              <td>
                <span :class="getStatusBadgeClass(room.status)">
                  {{ formatStatus(room.status) }}
                </span>
              </td>
              <td class="text-end">
                <button
                  class="btn btn-icon-action me-1"
                  title="Edit"
                  @click="openEditModal(room)"
                >
                  <i class="bi bi-pencil text-success"></i>
                </button>
                <button
                  class="btn btn-icon-action"
                  title="Delete"
                  @click="deleteRoom(room.id)"
                >
                  <i class="bi bi-trash text-danger"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Add/Edit Room Modal -->
  <div
    v-if="showModal"
    class="modal fade show d-block"
    tabindex="-1"
    style="background-color: rgba(0,0,0,0.5);"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold">
            {{ isEditing ? 'Edit Room' : 'Add Room' }}
          </h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <div class="row g-3 mb-3">
              <div class="col-6">
                <label class="form-label fw-semibold small">Room Number</label>
                <input
                  v-model="form.room_number"
                  type="text"
                  class="form-control"
                  placeholder="e.g. 101"
                  required
                />
              </div>

              <div class="col-6">
                <label class="form-label fw-semibold small">Floor</label>
                <input
                  v-model.number="form.floor"
                  type="number"
                  min="1"
                  class="form-control"
                  required
                />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold small">Room Type</label>
              <select v-model="form.room_type_id" class="form-select" required>
                <option value="" disabled>Select room type</option>
                <option
                  v-for="type in roomTypes"
                  :key="type.id"
                  :value="type.id"
                >
                  {{ type.name }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold small">Status</label>
              <select v-model="form.status" class="form-select" required>
                <option value="available">Available</option>
                <!-- <option value="occupied">Occupied</option> -->
                <option value="maintenance">Maintenance</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-light" @click="closeModal">
              Cancel
            </button>
            <button type="submit" class="btn btn-emerald" :disabled="submitting">
              <span v-if="submitting" class="spinner-border spinner-border-sm me-1"></span>
              {{ submitting ? 'Saving...' : (isEditing ? 'Update Room' : 'Create Room') }}
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
const isEditing = ref(false)
const selectedRoomId = ref(null)
const successMessage = ref('')

const form = reactive({
  room_number: '',
  floor: 1,
  room_type_id: '',
  status: 'Available'
})

// Mapped Pinia Store Data
const profile = computed(() => managerStore.profile || {})
const hotel = computed(() => managerStore.hotel || {})
const rooms = computed(() => managerStore.rooms || [])
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

// Room type ID to Name Resolver
const getRoomTypeName = (typeIdOrObject) => {
  if (typeof typeIdOrObject === 'object' && typeIdOrObject?.name) {
    return typeIdOrObject.name
  }
  const match = roomTypes.value.find((t) => t.id === typeIdOrObject)
  return match ? match.name : typeIdOrObject || 'Standard'
}

// Status Formatting Helpers
const formatStatus = (status) => {
  if (!status) return 'Available'
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
}

const getStatusBadgeClass = (status) => {
  const normalized = (status || '').toLowerCase()
  if (normalized === 'available') return 'badge bg-success-subtle text-success border border-success-subtle'
  if (normalized === 'occupied') return 'badge bg-primary-subtle text-primary border border-primary-subtle'
  if (normalized === 'maintenance') return 'badge bg-warning-subtle text-warning border border-warning-subtle'
  if (normalized === 'inactive') return 'badge bg-secondary-subtle text-secondary border border-secondary-subtle'
  return 'badge bg-secondary-subtle text-secondary border border-secondary-subtle'
}

// Modal Handlers
const openAddModal = () => {
  isEditing.value = false
  selectedRoomId.value = null
  form.room_number = ''
  form.floor = 1
  form.room_type_id = roomTypes.value[0]?.id || ''
  form.status = 'Available'
  showModal.value = true
}

const openEditModal = (room) => {
  isEditing.value = true
  selectedRoomId.value = room.id
  form.room_number = room.room_number || room.number || room.name
  form.floor = room.floor || 1
  form.room_type_id = typeof room.room_type === 'object' ? room.room_type?.id : (room.room_type_id || room.type_id || '')
  form.status = formatStatus(room.status)
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

// Create & Edit Actions
const handleSubmit = async () => {
  submitting.value = true
  try {
    if (isEditing.value) {
      await managerStore.updateRoom?.(selectedRoomId.value, { ...form })
      successMessage.value = 'Room updated successfully!'
    } else {
      await managerStore.createRoom?.({ ...form })
      successMessage.value = 'Room created successfully!'
    }
    closeModal()
  } catch (err) {
    console.error('Failed to save room:', err)
  } finally {
    submitting.value = false
  }
}

// Delete Action
const deleteRoom = async (id) => {
  if (!confirm('Are you sure you want to delete this room?')) return
  try {
    await managerStore.deleteRoom?.(id)
    successMessage.value = 'Room deleted successfully.'
  } catch (err) {
    console.error('Failed to delete room:', err)
  }
}

// Initial Fetch
onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([
      managerStore.getProfile?.(),
      managerStore.getMyHotel?.(),
      managerStore.getRoomTypes?.(),
      managerStore.getRooms?.()
    ])
  } catch (err) {
    console.error('Failed to load room management data:', err)
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
.btn-icon-action {
  background: transparent;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}
.btn-icon-action:hover {
  background-color: #f3f4f6;
}
</style>