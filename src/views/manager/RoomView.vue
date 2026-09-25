<template>
  <div class="rooms-container p-4">

    <!-- Main Content Header -->
    <div class="page-content">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <div class="badge bg-emerald-subtle text-emerald text-uppercase fw-bold mb-1 px-2 py-1" style="font-size: 0.725rem; letter-spacing: 0.5px;">
            ROOM MANAGEMENT
          </div>
          <h2 class="fw-bold text-dark mb-1">Property Rooms</h2>
          <p class="text-muted small mb-0">Manage individual rooms, layout specs, and their real-time availability.</p>
        </div>

        <!-- Add Room Button -->
        <button
          type="button"
          class="btn btn-emerald d-flex align-items-center justify-content-center gap-2 px-3 py-2 shadow-sm fw-semibold"
          @click="openAddModal"
        >
          <i class="bi bi-plus-lg fs-6"></i>
          <span>Add Room</span>
        </button>
      </div>

      <!-- Stats Summary Cards -->
      <div class="row g-3 mb-4">
        <div class="col-6 col-md-3">
          <div class="card border-0 shadow-sm rounded-3 bg-white p-3">
            <span class="text-muted micro-text fw-bold text-uppercase">Total Rooms</span>
            <h3 class="fw-bold text-dark mb-0 mt-1">{{ rooms.length }}</h3>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card border-0 shadow-sm rounded-3 bg-white p-3 border-start border-4 border-success">
            <span class="text-muted micro-text fw-bold text-uppercase">Available</span>
            <h3 class="fw-bold text-success mb-0 mt-1">{{ countStatus('available') }}</h3>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card border-0 shadow-sm rounded-3 bg-white p-3 border-start border-4 border-warning">
            <span class="text-muted micro-text fw-bold text-uppercase">Maintenance</span>
            <h3 class="fw-bold text-warning mb-0 mt-1">{{ countStatus('maintenance') }}</h3>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card border-0 shadow-sm rounded-3 bg-white p-3 border-start border-4 border-secondary">
            <span class="text-muted micro-text fw-bold text-uppercase">Inactive</span>
            <h3 class="fw-bold text-secondary mb-0 mt-1">{{ countStatus('inactive') }}</h3>
          </div>
        </div>
      </div>

      <!-- Alert Messages -->
      <div v-if="managerStore.error" class="alert alert-danger alert-dismissible fade show mb-4 shadow-sm" role="alert">
        <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ managerStore.error }}
        <button type="button" class="btn-close" @click="managerStore.clearError?.()"></button>
      </div>

      <div v-if="successMessage" class="alert alert-success alert-dismissible fade show mb-4 shadow-sm" role="alert">
        <i class="bi bi-check-circle-fill me-2"></i> {{ successMessage }}
        <button type="button" class="btn-close" @click="successMessage = ''"></button>
      </div>

      <!-- Data Table Card Wrapper -->
      <div class="card border-0 shadow-sm rounded-3 bg-white overflow-hidden">
        <!-- Filter & Search Bar -->
        <div class="p-3 border-bottom bg-light d-flex flex-column flex-md-row gap-2 justify-content-between align-items-md-center">
          <div class="input-group search-input-group style-search">
            <span class="input-group-text bg-white border-end-0"><i class="bi bi-search text-muted"></i></span>
            <input v-model="searchQuery" type="text" class="form-control border-start-0" placeholder="Search room number..." />
          </div>
          <div class="d-flex gap-2">
            <select v-model="statusFilter" class="form-select form-select-sm" style="width: 150px;">
              <option value="">All Statuses</option>
              <option value="available">Available</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-emerald" role="status"></div>
          <p class="text-muted mt-2 small">Loading rooms data...</p>
        </div>

        <!-- Table Content -->
        <div v-else class="table-responsive">
          <table class="table align-middle mb-0 table-hover">
            <thead class="bg-light border-bottom">
              <tr class="text-uppercase text-secondary" style="font-size: 0.725rem; letter-spacing: 0.6px;">
                <th scope="col" class="py-3 px-4">ROOM NUMBER</th>
                <th scope="col" class="py-3">FLOOR</th>
                <th scope="col" class="py-3">ROOM TYPE</th>
                <th scope="col" class="py-3">STATUS</th>
                <th scope="col" class="py-3 px-4 text-end">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!filteredRooms.length">
                <td colspan="5" class="text-center py-5 text-muted">
                  <i class="bi bi-inbox display-6 d-block text-muted mb-2"></i>
                  <span>No rooms found matching your criteria.</span>
                </td>
              </tr>
              <tr v-for="room in filteredRooms" :key="room.id || room._id">
                <td class="px-4 py-3">
                  <div class="d-flex align-items-center">
                    <div class="room-icon-box me-3 rounded-2 d-flex align-items-center justify-content-center bg-light text-emerald fw-bold">
                      <i class="bi bi-door-closed fs-5"></i>
                    </div>
                    <div>
                      <span class="fw-bold text-dark d-block">Room {{ room.room_number || room.number || room.name }}</span>
                    </div>
                  </div>
                </td>
                <td class="text-secondary fw-medium">Floor {{ room.floor || 1 }}</td>
                <td>
                  <span class="badge bg-light text-dark border fw-normal px-2 py-1">
                    {{ getRoomTypeName(room.room_type_id || room.type_id || room.room_type) }}
                  </span>
                </td>
                <td>
                  <span :class="getStatusBadgeClass(room.status)">
                    {{ formatStatus(room.status) }}
                  </span>
                </td>
                <td class="text-end px-4">
                  <button
                    type="button"
                    class="btn btn-icon me-1 text-secondary"
                    title="Edit Room"
                    @click="openEditModal(room)"
                  >
                    <i class="bi bi-pencil-square fs-6"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-icon text-danger"
                    title="Delete Room"
                    @click="deleteRoom(room.id || room._id)"
                  >
                    <i class="bi bi-trash3 fs-6"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Custom Vue Teleport Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="custom-modal-overlay" @click.self="closeModal">
        <div class="custom-modal-dialog">
          <div class="custom-modal-content">
            <div class="modal-header px-4 py-3 bg-light border-bottom d-flex justify-content-between align-items-center">
              <h5 class="modal-title fw-bold text-dark m-0">
                {{ isEditing ? 'Edit Room Specification' : 'Add New Room' }}
              </h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>

            <form @submit.prevent="handleSubmit">
              <div class="modal-body p-4">
                <div class="row g-3 mb-3">
                  <div class="col-6">
                    <label class="form-label fw-semibold small text-dark">Room Number</label>
                    <input
                      v-model="form.room_number"
                      type="text"
                      class="form-control"
                      placeholder="e.g. 101"
                      required
                    />
                  </div>

                  <div class="col-6">
                    <label class="form-label fw-semibold small text-dark">Floor</label>
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
                  <label class="form-label fw-semibold small text-dark">Room Type</label>
                  <select v-model="form.room_type_id" class="form-select" required>
                    <option value="" disabled>Select room type</option>
                    <option
                      v-for="type in roomTypes"
                      :key="type.id || type._id"
                      :value="type.id || type._id"
                    >
                      {{ type.name }}
                    </option>
                  </select>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold small text-dark">Current Status</label>
                  <select v-model="form.status" class="form-select" required>
                    <option value="available">Available</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div class="modal-footer px-4 py-3 bg-light border-top d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-outline-secondary px-3" @click="closeModal">
                  Cancel
                </button>
                <button type="submit" class="btn btn-emerald px-4" :disabled="submitting">
                  <span v-if="submitting" class="spinner-border spinner-border-sm me-1"></span>
                  {{ submitting ? 'Saving...' : (isEditing ? 'Update Room' : 'Create Room') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>
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
const searchQuery = ref('')
const statusFilter = ref('')

const form = reactive({
  room_number: '',
  floor: 1,
  room_type_id: '',
  status: 'available'
})

// Mapped Pinia Store Data
const rooms = computed(() => managerStore.rooms || [])
const roomTypes = computed(() => managerStore.roomTypes || [])

const filteredRooms = computed(() => {
  return rooms.value.filter((room) => {
    const roomNum = String(room.room_number || room.number || room.name || '').toLowerCase()
    const matchesSearch = roomNum.includes(searchQuery.value.toLowerCase())
    const matchesStatus = statusFilter.value ? (room.status || '').toLowerCase() === statusFilter.value : true
    return matchesSearch && matchesStatus
  })
})

const countStatus = (statusKey) => {
  return rooms.value.filter(r => (r.status || '').toLowerCase() === statusKey).length
}

const openAddModal = () => {
  isEditing.value = false
  selectedRoomId.value = null
  Object.assign(form, {
    room_number: '',
    floor: 1,
    room_type_id: roomTypes.value[0]?.id || roomTypes.value[0]?._id || '',
    status: 'available'
  })
  showModal.value = true
}

const openEditModal = (room) => {
  isEditing.value = true
  selectedRoomId.value = room.id || room._id
  Object.assign(form, {
    room_number: room.room_number || room.number || room.name || '',
    floor: room.floor || 1,
    room_type_id: typeof room.room_type === 'object' ? (room.room_type?.id || room.room_type?._id) : (room.room_type_id || room.type_id || ''),
    status: (room.status || 'available').toLowerCase()
  })
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const getRoomTypeName = (typeIdOrObject) => {
  if (typeof typeIdOrObject === 'object' && typeIdOrObject?.name) {
    return typeIdOrObject.name
  }
  const match = roomTypes.value.find((t) => (t.id || t._id) === typeIdOrObject)
  return match ? match.name : typeIdOrObject || 'Standard'
}

const formatStatus = (status) => {
  if (!status) return 'Available'
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
}

const getStatusBadgeClass = (status) => {
  const normalized = (status || '').toLowerCase()
  if (normalized === 'available') return 'badge bg-success-subtle text-success border border-success-subtle'
  // if (normalized === 'occupied') return 'badge bg-primary-subtle text-primary border border-primary-subtle'
  if (normalized === 'maintenance') return 'badge bg-warning-subtle text-warning border border-warning-subtle'
  if (normalized === 'inactive') return 'badge bg-secondary-subtle text-secondary border border-secondary-subtle'
  return 'badge bg-secondary-subtle text-secondary border border-secondary-subtle'
}

const handleSubmit = async () => {
  submitting.value = true
  successMessage.value = ''
  if (managerStore.clearError) managerStore.clearError()

  const payload = { ...form }

  try {
    if (isEditing.value) {
      await managerStore.updateRoom?.(selectedRoomId.value, payload)
      successMessage.value = 'Room updated successfully!'
    } else {
      await managerStore.createRoom?.(payload)
      successMessage.value = 'Room created successfully!'
    }
    closeModal()
    if (managerStore.getRooms) await managerStore.getRooms()
  } catch (err) {
    console.error('Failed to save room:', err)
  } finally {
    submitting.value = false
  }
}

const deleteRoom = async (id) => {
  if (!confirm('Are you sure you want to delete this room?')) return
  successMessage.value = ''
  try {
    await managerStore.deleteRoom?.(id)
    successMessage.value = 'Room deleted successfully.'
    if (managerStore.getRooms) await managerStore.getRooms()
  } catch (err) {
    console.error('Failed to delete room:', err)
  }
}

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
.page-content{
  padding-left: 1rem !important; 
  padding-right: 1rem !important;
  padding-top: 0 !important;
  margin-top: 0 !important;
}
/* Theme & Emerald UI Colors */
.btn-emerald {
  background-color: #059669;
  color: var(--bg-card, #ffffff);
  border: none;
  border-radius: 0.375rem;
}

.btn-emerald:hover {
  background-color: #047857;
  color: var(--bg-card, #ffffff);
}


.text-emerald {
  color: #059669;
}

.btn-icon {
  background: transparent;
  border: none;
  padding: 0.25rem 0.4rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.btn-icon:hover {
  background-color: var(--bg-card, #f3f4f6);
}

.room-icon-box {
  width: 38px;
  height: 38px;
}

.micro-text {
  font-size: 0.725rem;
}

.style-search {
  max-width: 280px;
}

/* Custom Vue Teleport Modal Overlay */
.custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
}

.custom-modal-dialog {
  width: 100%;
  max-width: 500px;
  margin: 1rem;
}

.custom-modal-content {
  background: var(--bg-card, #ffffff);
  border-radius: 0.625rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  animation: modalScale 0.2s ease-out;
}

@keyframes modalScale {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>