<template>
  <div class="manage-hotel-container">
    <!-- Top bar -->
    <div class="topbar bg-white  p-4 rounded shadow-sm d-flex justify-content-between align-items-center">
      <div>
        <h1 class="page-title brand-serif m-0" style="font-size: 1.75rem; font-weight: 700; color: #2c3e50;">Manage Hotel</h1>
        <div class="page-subtitle text-muted mt-1">
          Manage your account and property information
        </div>
      </div>
      <div class="d-flex align-items-center gap-3">
        <!-- Notification -->
        <div class="icon-btn" style="position: relative; cursor: pointer;">
          <i class="bi bi-bell fs-5 text-secondary"></i>
          <span class="dot" style="position: absolute; top: 0; right: 0; width: 8px; height: 8px; background-color: #ef4444; border-radius: 50%;"></span>
        </div>
      </div>
    </div>

    <div class="card main-card mt-5 ">
      <div class="card-body p-4 mt-5">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h4 class="mb-1 text-dark fw-bold">Hotel Information</h4>
            <div class="text-muted small">Manage your account and property information</div>
          </div>
        </div>

        <!-- Table -->
        <div class="table-responsive">
          <table class="table custom-table align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>PHONE</th>
                <th>CITY</th>
                <th>STATUS</th>
                <th class="text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="managerStore.loading && !showModal">
                <td colspan="7" class="text-center py-5">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
              <tr v-else-if="managerStore.hotel">
                <td class="text-muted">#{{ managerStore.hotel.id }}</td>
                <td class="fw-bold text-dark">{{ managerStore.hotel.name }}</td>
                <td class="text-muted">{{ managerStore.hotel.email || '-' }}</td>
                <td class="text-muted">{{ managerStore.hotel.phone || '-' }}</td>
                <td class="text-muted">{{ managerStore.hotel.city || '-' }}</td>
                <td>
                  <span class="badge" :class="{
                    'bg-success': managerStore.hotel.status === 'active' || managerStore.hotel.status === 'approved',
                    'bg-warning text-dark': managerStore.hotel.status === 'pending',
                    'bg-danger': managerStore.hotel.status === 'rejected' || managerStore.hotel.status === 'inactive',
                    'bg-secondary': !managerStore.hotel.status
                  }">
                    {{ managerStore.hotel.status ? managerStore.hotel.status.toUpperCase() : 'UNKNOWN' }}
                  </span>
                </td>
                <td class="text-center">
                  <button class="btn btn-action btn-edit me-2" @click="openEditModal" title="Edit Hotel">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button class="btn btn-action btn-delete" @click="confirmDelete" title="Delete Hotel">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-else>
                <td colspan="7" class="text-center py-5 text-muted">
                  No hotel information available. Please create one to get started.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Action under table -->
        <div class="mt-4" v-if="!managerStore.hotel && !managerStore.loading">
           <button class="btn btn-create-hotel" @click="openCreateModal">
             Create Hotel
           </button>
        </div>
      </div>
    </div>

    <!-- Vue-controlled Modal -->
    <div v-if="showModal" class="modal-backdrop fade show" style="z-index: 1040;"></div>
    <div class="modal fade" :class="{ 'show d-block': showModal }" tabindex="-1" style="z-index: 1050;" @click.self="closeModal">
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header border-bottom-0 pb-0">
            <h5 class="modal-title fw-bold">{{ isEditing ? 'Edit Hotel' : 'Create Hotel' }}</h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body py-4">
            <!-- Error Alert -->
            <div v-if="managerStore.error" class="alert alert-danger alert-dismissible fade show" role="alert">
              {{ managerStore.error }}
              <button type="button" class="btn-close" @click="managerStore.error = null" aria-label="Close"></button>
            </div>

            <form id="hotelForm" @submit.prevent="handleSubmit">
              <div class="row g-4">
                <!-- Basic Info -->
                <div class="col-12">
                  <h6 class="mb-2 text-primary fw-bold">Basic Information</h6>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Hotel Name <span class="text-danger">*</span></label>
                  <input type="text" class="form-control form-control-sm" v-model="form.name" required>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Email Address</label>
                  <input type="email" class="form-control form-control-sm" v-model="form.email">
                </div>

                <div class="col-md-6">
                  <label class="form-label">Phone Number</label>
                  <input type="text" class="form-control form-control-sm" v-model="form.phone">
                </div>

                <div class="col-12">
                  <label class="form-label">Description</label>
                  <textarea class="form-control form-control-sm" v-model="form.description" rows="3"></textarea>
                </div>

                <!-- Location -->
                <div class="col-12 mt-4">
                  <h6 class="mb-2 text-primary fw-bold">Location Details</h6>
                </div>

                <div class="col-12">
                  <label class="form-label">Address <span class="text-danger">*</span></label>
                  <input type="text" class="form-control form-control-sm" v-model="form.address" required>
                </div>

                <div class="col-md-4">
                  <label class="form-label">City <span class="text-danger">*</span></label>
                  <input type="text" class="form-control form-control-sm" v-model="form.city" required>
                </div>

                <div class="col-md-4">
                  <label class="form-label">Province / State</label>
                  <input type="text" class="form-control form-control-sm" v-model="form.province">
                </div>

                <div class="col-md-4">
                  <label class="form-label">Country <span class="text-danger">*</span></label>
                  <input type="text" class="form-control form-control-sm" v-model="form.country" required>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Latitude</label>
                  <input type="number" step="any" class="form-control form-control-sm" v-model="form.latitude">
                </div>

                <div class="col-md-6">
                  <label class="form-label">Longitude</label>
                  <input type="number" step="any" class="form-control form-control-sm" v-model="form.longitude">
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer border-top-0 pt-0">
            <button type="button" class="btn btn-light" @click="closeModal" :disabled="managerStore.loading">Cancel</button>
            <button type="submit" form="hotelForm" class="btn btn-primary px-4" :disabled="managerStore.loading">
              <span v-if="managerStore.loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {{ isEditing ? 'Update Hotel' : 'Save Hotel' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useManagerStore } from '@/stores/manager';

const managerStore = useManagerStore();

const showModal = ref(false);
const isEditing = ref(false);

const form = reactive({
  name: '',
  description: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  country: '',
  province: '',
  latitude: '',
  longitude: ''
});

onMounted(async () => {
  try {
    await managerStore.getMyHotel();
  } catch (error) {
    if (error?.response?.status !== 404) {
      console.error('Error fetching hotel:', error);
    }
  }
});

const populateForm = () => {
  if (managerStore.hotel) {
    const h = managerStore.hotel;
    form.name = h.name || '';
    form.description = h.description || '';
    form.phone = h.phone || '';
    form.email = h.email || '';
    form.address = h.address || '';
    form.city = h.city || '';
    form.country = h.country || '';
    form.province = h.province || '';
    form.latitude = h.latitude || '';
    form.longitude = h.longitude || '';
  }
};

const resetForm = () => {
  form.name = '';
  form.description = '';
  form.phone = '';
  form.email = '';
  form.address = '';
  form.city = '';
  form.country = '';
  form.province = '';
  form.latitude = '';
  form.longitude = '';
};

const openCreateModal = () => {
  isEditing.value = false;
  resetForm();
  managerStore.error = null;
  showModal.value = true;
};

const openEditModal = () => {
  isEditing.value = true;
  populateForm();
  managerStore.error = null;
  showModal.value = true;
};

const closeModal = () => {
  if (!managerStore.loading) {
    showModal.value = false;
  }
};

const handleSubmit = async () => {
  try {
    const payload = { ...form };
    if (payload.latitude === '') payload.latitude = null;
    if (payload.longitude === '') payload.longitude = null;

    if (isEditing.value) {
      await managerStore.updateHotel(managerStore.hotel.id, payload);
      // Removed alert to improve UX, modal just closes smoothly
    } else {
      await managerStore.createHotel(payload);
    }
    showModal.value = false;
  } catch (error) {
    console.error('Submit error:', error);
  }
};

const confirmDelete = async () => {
  if (confirm('Are you sure you want to delete this hotel? This action cannot be undone.')) {
    try {
      await managerStore.deleteHotel(managerStore.hotel.id);
    } catch (error) {
      if (error?.response?.status === 409) {
        alert('Cannot delete hotel: It has active bookings.');
      } else {
        alert('An error occurred while deleting the hotel.');
      }
      console.error('Delete error:', error);
    }
  }
};
</script>

<style scoped>
.manage-hotel-container {
  padding: 1.5rem;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.main-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}

.custom-table {
  margin-bottom: 0;
}

.custom-table th {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #6c757d;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #edf2f7;
  padding: 1rem 0.75rem;
}

.custom-table td {
  padding: 1.25rem 0.75rem;
  border-bottom: 1px solid #edf2f7;
  vertical-align: middle;
}

.custom-table tr:last-child td {
  border-bottom: none;
}

.btn-action {
  width: 32px;
  height: 32px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: white;
  transition: all 0.2s;
}

.btn-edit {
  border: 1px solid #e2e8f0;
  color: #3b82f6;
}
.btn-edit:hover {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.btn-delete {
  border: 1px solid #e2e8f0;
  color: #ef4444;
}
.btn-delete:hover {
  border-color: #ef4444;
  background-color: #fef2f2;
}

.btn-create-hotel {
  background-color: #127369;
  color: white;
  font-weight: 500;
  border-radius: 6px;
  padding: 0.6rem 1.5rem;
  border: none;
  transition: background-color 0.2s;
}
.btn-create-hotel:hover {
  background-color: #0f6259;
  color: white;
}

.modal-content {
  border-radius: 12px;
}
.modal-header {
  padding: 1.5rem 1.5rem 0.5rem;
}
.modal-body {
  padding: 1.5rem;
}
.modal-footer {
  padding: 0.5rem 1.5rem 1.5rem;
}

.form-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.4rem;
}
.form-control-sm {
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}
.form-control-sm:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>