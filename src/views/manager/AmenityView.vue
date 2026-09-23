<template>
  <div class="amenity-page px-4 py-3">
    <!-- Header Section -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
      <div>
        <span
          class="badge bg-emerald-subtle text-emerald text-uppercase fw-semibold mb-2 px-2.5 py-1 rounded-pill"
          style="font-size: 0.7rem; letter-spacing: 0.5px;"
        >
          AMENITIES MANAGEMENT
        </span>
        <h2 class="fw-bold text-dark mb-1 h3">Amenity List</h2>
        <p class="text-muted small mb-0">
          Manage the amenities that can be assigned to rooms.
        </p>
      </div>

      <div class="d-flex align-items-center gap-2">
        <span class="badge bg-light text-secondary border px-3 py-2 rounded-pill fw-medium">
          {{ manager.amenityList.length }} {{ manager.amenityList.length === 1 ? 'Amenity' : 'Amenities' }}
        </span>
        <button
          class="btn btn-emerald rounded-3 px-3.5 py-2 fw-medium d-flex align-items-center gap-2 shadow-sm"
          @click="openCreateModal"
        >
          <i class="bi bi-plus-lg fs-6"></i>
          <span>Add Amenity</span>
        </button>
      </div>
    </div>

    <!-- Main Content State -->
    <!-- Loading State -->
    <div v-if="manager.loading" class="card border-0 shadow-sm rounded-4 p-5 text-center text-muted">
      <div class="spinner-border spinner-border-sm text-emerald me-2" role="status"></div>
      <span class="small">Loading amenities...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="manager.error" class="alert alert-danger border-0 shadow-sm rounded-3 fade show d-flex align-items-center" role="alert">
      <i class="bi bi-exclamation-circle-fill fs-5 me-2.5"></i>
      <div class="flex-grow-1 small">{{ manager.error }}</div>
    </div>

    <!-- Amenity Card Table -->
    <div v-else class="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
      <!-- Empty State -->
      <div v-if="manager.amenityList.length === 0" class="text-center py-5 px-3">
        <div class="empty-icon-circle mx-auto mb-3 d-flex align-items-center justify-content-center">
          <i class="bi bi-stars fs-4 text-emerald"></i>
        </div>
        <h6 class="fw-semibold text-dark small mb-1">No amenities yet</h6>
        <p class="text-muted extra-small mb-3">Create your first amenity to use it with your rooms.</p>
        <button class="btn btn-emerald rounded-3 px-3 py-2 fw-medium btn-sm" @click="openCreateModal">
          <i class="bi bi-plus-lg me-1"></i> Create Amenity
        </button>
      </div>

      <!-- Table View -->
      <div v-else class="table-responsive">
        <table class="table align-middle mb-0 custom-table">
          <thead>
            <tr class="text-uppercase text-secondary">
              <th scope="col" class="py-3 px-3 fw-bold extra-small tracking-wider" style="width: 50px;">#</th>
              <th scope="col" class="py-3 px-3 fw-bold extra-small tracking-wider">AMENITY</th>
              <th scope="col" class="py-3 px-3 fw-bold extra-small tracking-wider">DESCRIPTION</th>
              <th scope="col" class="py-3 px-3 fw-bold extra-small tracking-wider" style="width: 120px;">STATUS</th>
              <th scope="col" class="py-3 px-3 fw-bold extra-small tracking-wider text-end" style="width: 100px;">ACTION</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(amenity, index) in manager.amenityList" :key="amenity.id" class="table-row">
              <td class="py-3.5 px-3 text-muted extra-small">{{ index + 1 }}</td>
              
              <td class="py-3.5 px-3">
                <div class="d-flex align-items-center gap-2.5">
                  <div class="icon-avatar d-flex align-items-center justify-content-center rounded-3 bg-emerald-subtle text-emerald">
                    <i class="bi bi-stars"></i>
                  </div>
                  <span class="fw-semibold text-dark small">{{ amenity.name }}</span>
                </div>
              </td>

              <td class="py-3.5 px-3 text-muted extra-small" style="max-width: 300px;">
                <span class="text-truncate d-block">{{ amenity.description || "No description provided" }}</span>
              </td>

              <td class="py-3.5 px-3">
                <span
                  class="badge rounded-pill px-2.5 py-1.5 fw-medium extra-small"
                  :class="amenity.status === 'active' ? 'bg-emerald-subtle text-emerald' : 'bg-light text-secondary border'"
                >
                  {{ amenity.status || 'active' }}
                </span>
              </td>

              <td class="py-3.5 px-3 text-end">
                <div class="d-flex align-items-center justify-content-end gap-1">
                  <button
                    class="btn btn-icon btn-light-emerald btn-sm rounded-2"
                    title="Edit"
                    @click="openEditModal(amenity)"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                    class="btn btn-icon btn-light-danger btn-sm rounded-2"
                    title="Delete"
                    @click="deleteAmenity(amenity)"
                  >
                    <i class="bi bi-trash3"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Overlay -->
    <div v-if="showModal" class="modal-backdrop-custom d-flex align-items-center justify-content-center" @click.self="closeModal">
      <div class="modal-card bg-white rounded-4 shadow-lg overflow-hidden w-100" style="max-width: 480px;">
        <div class="p-4 border-bottom d-flex align-items-center justify-content-between">
          <div>
            <h5 class="fw-bold text-dark mb-1">
              {{ editingAmenity ? "Edit Amenity" : "Create Amenity" }}
            </h5>
            <p class="text-muted extra-small mb-0">
              {{ editingAmenity ? "Update amenity details below." : "Add a new amenity option for hotel rooms." }}
            </p>
          </div>
          <button class="btn-close ms-auto shadow-none" @click="closeModal"></button>
        </div>

        <form @submit.prevent="saveAmenity" class="p-4">
          <!-- Name Field -->
          <div class="mb-3">
            <label class="form-label fw-semibold text-dark extra-small mb-1">
              Amenity Name <span class="text-danger">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              class="form-control custom-input"
              placeholder="e.g. High-Speed Wi-Fi"
              required
            />
          </div>

          <!-- Description Field -->
          <div class="mb-3">
            <label class="form-label fw-semibold text-dark extra-small mb-1">Description</label>
            <textarea
              v-model="form.description"
              class="form-control custom-input"
              rows="3"
              placeholder="Brief summary of this amenity..."
            ></textarea>
          </div>

          <!-- Status Field -->
          <div class="mb-4">
            <label class="form-label fw-semibold text-dark extra-small mb-1">Status</label>
            <select v-model="form.status" class="form-select custom-input">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <!-- Actions -->
          <div class="d-flex align-items-center justify-content-end gap-2">
            <button type="button" class="btn btn-light rounded-3 px-3.5 py-2 fw-medium text-secondary" @click="closeModal">
              Cancel
            </button>
            <button type="submit" class="btn btn-emerald rounded-3 px-3.5 py-2 fw-medium" :disabled="manager.loading">
              <span v-if="manager.loading" class="spinner-border spinner-border-sm me-1" role="status"></span>
              <i v-else class="bi bi-check-lg me-1"></i>
              {{ editingAmenity ? "Update Amenity" : "Create Amenity" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useManagerStore } from "@/stores/manager";

const manager = useManagerStore();

const showModal = ref(false);
const editingAmenity = ref(null);

const form = ref({
  name: "",
  icon: "bi-stars",
  description: "",
  status: "active",
});

onMounted(async () => {
  await manager.getAmenityList();
});

function resetForm() {
  form.value = {
    name: "",
    icon: "bi-stars",
    description: "",
    status: "active",
  };
}

function openCreateModal() {
  editingAmenity.value = null;
  resetForm();
  showModal.value = true;
}

function openEditModal(amenity) {
  editingAmenity.value = amenity;
  form.value = {
    name: amenity.name || "",
    icon: amenity.icon || "bi-stars",
    description: amenity.description || "",
    status: amenity.status || "active",
  };
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  editingAmenity.value = null;
  resetForm();
}

async function saveAmenity() {
  try {
    const payload = {
      name: form.value.name,
      icon: form.value.icon,
      description: form.value.description || null,
      status: form.value.status,
    };

    if (editingAmenity.value) {
      await manager.updateAmenity(editingAmenity.value.id, payload);
    } else {
      await manager.createAmenity(payload);
    }

    closeModal();
  } catch (error) {
    console.error("Failed to save amenity:", error);
  }
}

async function deleteAmenity(amenity) {
  const confirmed = confirm(`Are you sure you want to delete "${amenity.name}"?`);
  if (!confirmed) return;

  try {
    await manager.deleteAmenity(amenity.id);
  } catch (error) {
    console.error("Failed to delete amenity:", error);
  }
}
</script>

<style scoped>
/* Helpers & Typography */
.extra-small {
  font-size: 0.75rem;
}

.tracking-wider {
  letter-spacing: 0.05em;
}


.text-emerald {
  color: #059669;
}

/* Emerald Primary Action */
.btn-emerald {
  background-color: #059669;
  color: #ffffff;
  border: none;
  transition: all 0.2s ease;
  
}

.btn-emerald:hover:not(:disabled) {
  background-color: #047857;
  color: #ffffff;
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
  background-color: #f8fafc;
}

.custom-table td {
  border-bottom: 1px solid #f1f5f9;
}

.icon-avatar {
  width: 32px;
  height: 32px;
  font-size: 0.9rem;
}

/* Button Icon Actions */
.btn-icon {
  width: 32px;
  height: 32px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.btn-light-emerald {
  background-color: transparent;
  color: #059669;
}

.btn-light-emerald:hover {
  background-color: #ecfdf5;
  color: #047857;
}

.btn-light-danger {
  background-color: transparent;
  color: #ef4444;
}

.btn-light-danger:hover {
  background-color: #fef2f2;
  color: #dc2626;
}

/* Form Inputs */
.custom-input {
  border-color: #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.custom-input:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

/* Empty State Circle */
.empty-icon-circle {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background-color: #ecfdf5;
}

/* Modal Backdrop */
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(2px);
  z-index: 1050;
  padding: 1rem;
}
</style>