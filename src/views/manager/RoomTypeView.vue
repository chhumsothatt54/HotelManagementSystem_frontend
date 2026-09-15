<template>
  <div class="room-types-container p-4">
    <!-- Topbar Section -->
    <div class="topbar bg-white p-3 rounded-3 shadow-sm d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="page-title brand-serif h4 mb-1 text-dark fw-bold">Room Management</h1>
        <div class="page-subtitle text-muted small">
          Manage your account and property information
        </div>
      </div>

      <div class="d-flex align-items-center gap-3">
        <button class="btn btn-light position-relative rounded-circle p-2 shadow-sm border-0" type="button">
          <i class="bi bi-bell text-secondary"></i>
          <span class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
        </button>
      </div>
    </div>

    <!-- Main Content Header -->
    <div class="page-content">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <div class="badge bg-emerald-subtle text-emerald text-uppercase fw-bold mb-1 px-2 py-1" style="font-size: 0.725rem; letter-spacing: 0.5px;">
            ROOM CATEGORIES
          </div>
          <h2 class="fw-bold text-dark mb-1">Room Types</h2>
          <p class="text-muted small mb-0">Configure room categories and specifications.</p>
        </div>

        <!-- Add Room Type Button -->
        <button
          type="button"
          class="btn btn-emerald d-flex align-items-center justify-content-center gap-2 px-3 py-2 shadow-sm fw-semibold"
          @click="openAddModal"
        >
          <i class="bi bi-plus-lg fs-6"></i>
          <span>Add Room Type</span>
        </button>
      </div>

      <!-- Alert Messages -->
      <div v-if="managerStore.error" class="alert alert-danger alert-dismissible fade show mb-4 shadow-sm" role="alert">
        <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ managerStore.error }}
        <button type="button" class="btn-close" @click="managerStore.clearError()"></button>
      </div>

      <div v-if="successMessage" class="alert alert-success alert-dismissible fade show mb-4 shadow-sm" role="alert">
        <i class="bi bi-check-circle-fill me-2"></i> {{ successMessage }}
        <button type="button" class="btn-close" @click="successMessage = ''"></button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-emerald" role="status"></div>
        <p class="text-muted mt-2 small">Loading room categories...</p>
      </div>

      <!-- Cards Grid -->
      <div v-else class="row g-4">
        <div v-if="!roomTypes.length" class="col-12 text-center py-5 bg-white border rounded-3 shadow-sm">
          <i class="bi bi-door-closed display-4 text-muted mb-3 d-block"></i>
          <h5 class="fw-bold text-dark">No Room Types Found</h5>
          <p class="text-muted small mb-3">Get started by creating your first room category.</p>
          <button type="button" class="btn btn-emerald btn-sm" @click="openAddModal">
            <i class="bi bi-plus-lg me-1"></i> Add Room Type
          </button>
        </div>

        <div
          v-else
          v-for="rt in roomTypes"
          :key="rt.id || rt._id"
          class="col-12 col-md-6 col-xl-4"
        >
          <div class="card h-100 border-0 shadow-sm rounded-3 custom-card bg-white">
            <div class="card-body p-4 d-flex flex-column justify-content-between">
              <div>
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <h5 class="fw-bold text-dark mb-0 fs-5">{{ rt.name }}</h5>
                  <div class="d-flex gap-1">
                    <!-- Edit Button -->
                    <button
                      type="button"
                      class="btn btn-icon text-secondary"
                      title="Edit"
                      @click="openEditModal(rt)"
                    >
                      <i class="bi bi-pencil-square fs-5"></i>
                    </button>
                    <!-- Delete Button -->
                    <button
                      type="button"
                      class="btn btn-icon text-danger"
                      title="Delete"
                      @click="handleDelete(rt.id || rt._id)"
                    >
                      <i class="bi bi-trash3 fs-5"></i>
                    </button>
                  </div>
                </div>

                <p class="text-muted small mb-4 line-clamp-2">
                  {{ rt.description || 'No description provided.' }}
                </p>
              </div>

              <div class="border-top pt-3 mt-2">
                <div class="row g-2 text-secondary small">
                  <div class="col-6 d-flex align-items-center">
                    <i class="bi bi-people-fill text-emerald me-2"></i>
                    <span><strong>{{ rt.max_guests || rt.capacity || 2 }}</strong> Guests</span>
                  </div>
                  <div class="col-6 d-flex align-items-center justify-content-end">
                    <i class="bi bi-tag-fill text-emerald me-1"></i>
                    <span class="fw-bold text-dark fs-6">${{ Number(rt.price_per_night || rt.base_price || 0).toFixed(2) }}</span>
                    <span class="text-muted micro-text">/night</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Custom Vue Overlay Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="custom-modal-overlay" @click.self="closeModal">
        <div class="custom-modal-dialog">
          <div class="custom-modal-content">
            <div class="modal-header px-4 py-3 bg-light border-bottom">
              <h5 class="modal-title fw-bold text-dark m-0">
                {{ isEditing ? 'Edit Room Type' : 'Add New Room Type' }}
              </h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>

            <form @submit.prevent="handleSubmit">
              <div class="modal-body p-4">
                <!-- Name -->
                <div class="mb-3">
                  <label class="form-label fw-semibold small text-dark">Room Type Name</label>
                  <input
                    v-model="form.name"
                    type="text"
                    class="form-control"
                    placeholder="e.g. Deluxe Suite"
                    required
                  />
                </div>

                <!-- Description -->
                <div class="mb-3">
                  <label class="form-label fw-semibold small text-dark">Description</label>
                  <textarea
                    v-model="form.description"
                    class="form-control"
                    rows="3"
                    placeholder="Describe amenities or view..."
                  ></textarea>
                </div>

                <div class="row g-3">
                  <!-- Capacity -->
                  <div class="col-6">
                    <label class="form-label fw-semibold small text-dark">Max Guests</label>
                    <input
                      v-model.number="form.max_guests"
                      type="number"
                      min="1"
                      class="form-control"
                      required
                    />
                  </div>

                  <!-- Price -->
                  <div class="col-6">
                    <label class="form-label fw-semibold small text-dark">Price / Night ($)</label>
                    <input
                      v-model.number="form.price_per_night"
                      type="number"
                      step="0.01"
                      min="0"
                      class="form-control"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
              </div>

              <div class="modal-footer px-4 py-3 bg-light border-top d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-outline-secondary px-3" @click="closeModal">
                  Cancel
                </button>
                <button type="submit" class="btn btn-emerald px-4" :disabled="submitting">
                  <span v-if="submitting" class="spinner-border spinner-border-sm me-1"></span>
                  {{ submitting ? 'Saving...' : (isEditing ? 'Update' : 'Save') }}
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useManagerStore } from '@/stores/manager'

const managerStore = useManagerStore()

const loading = ref(false)
const submitting = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const selectedId = ref(null)
const successMessage = ref('')

const form = reactive({
  name: '',
  description: '',
  max_guests: 2,
  price_per_night: '',
  status: 'active'
})

const roomTypes = computed(() => managerStore.roomTypes || [])

const openAddModal = () => {
  isEditing.value = false
  selectedId.value = null
  Object.assign(form, {
    name: '',
    description: '',
    max_guests: 2,
    price_per_night: '',
    status: 'active'
  })
  showModal.value = true
}

const openEditModal = (roomType) => {
  isEditing.value = true
  selectedId.value = roomType.id || roomType._id
  Object.assign(form, {
    name: roomType.name || '',
    description: roomType.description || '',
    max_guests: roomType.max_guests || roomType.capacity || 2,
    price_per_night: roomType.price_per_night || roomType.base_price || '',
    status: roomType.status || 'active'
  })
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const handleSubmit = async () => {
  submitting.value = true
  successMessage.value = ''
  if (managerStore.clearError) managerStore.clearError()

  // ផ្ញើ payload ដោយបញ្ជូលទាំង price_per_night និង base_price ដើម្បីការពារ backend ប្រើប្រាស់ field ខុសគ្នា
  const payload = {
    ...form,
    base_price: form.price_per_night,
    capacity: form.max_guests
  }

  try {
    if (isEditing.value) {
      await managerStore.updateRoomType(selectedId.value, payload)
      successMessage.value = 'Room type updated successfully!'
    } else {
      await managerStore.createRoomType(payload)
      successMessage.value = 'Room type created successfully!'
    }
    closeModal()
    // Refresh List ឡើងវិញ
    if (managerStore.getRoomTypes) {
      await managerStore.getRoomTypes()
    }
  } catch (err) {
    console.error('Save failed:', err)
  } finally {
    submitting.value = false
  }
}

const handleDelete = async (id) => {
  if (!confirm('Are you sure you want to delete this room type?')) return
  successMessage.value = ''
  try {
    await managerStore.deleteRoomType(id)
    successMessage.value = 'Room type deleted successfully.'
    if (managerStore.getRoomTypes) {
      await managerStore.getRoomTypes()
    }
  } catch (err) {
    console.error('Delete failed:', err)
  }
}

onMounted(async () => {
  loading.value = true
  try {
    if (managerStore.getRoomTypes) {
      await managerStore.getRoomTypes()
    }
  } catch (err) {
    console.error('Fetch error:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* Emerald UI Colors */
.btn-emerald {
  background-color: #059669;
  color: #ffffff;
  border: none;
  border-radius: 0.375rem;
}

.btn-emerald:hover {
  background-color: #047857;
  color: #ffffff;
}

.bg-emerald-subtle {
  background-color: #d1fae5;
}

.text-emerald {
  color: #059669;
}

.btn-icon {
  background: transparent;
  border: none;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.btn-icon:hover {
  background-color: #f3f4f6;
}

.custom-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.custom-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.1) !important;
}

.micro-text {
  font-size: 0.75rem;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Modal Styling Setup */
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
  max-width: 520px;
  margin: 1rem;
}

.custom-modal-content {
  background: #ffffff;
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