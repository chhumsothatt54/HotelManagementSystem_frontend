<template>
  <div class="amenity-page">

    <!-- Top bar -->
  <div class="topbar bg-white">
    <div>
      <h1 class="page-title brand-serif">Booking</h1>
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

      <button class="add-btn"  @click="openCreateModal">
        <i class="bi bi-plus-lg"></i>
        Add Amenity
      </button>
    </div>
  </div>

    <!-- Content -->
    <div class="content">

      <!-- Loading -->
      <div v-if="manager.loading" class="loading-box">
        <div class="spinner"></div>
        <span>Loading amenities...</span>
      </div>

      <!-- Error -->
      <div v-else-if="manager.error" class="error-box">
        <i class="bi bi-exclamation-circle"></i>
        {{ manager.error }}
      </div>

      <!-- Amenity Card -->
      <div v-else class="amenity-card">

        <div class="card-header">
          <div>
            <h2>Amenity List</h2>
            <p>
              Manage the amenities that can be assigned to rooms.
            </p>
          </div>

          <span class="count-badge">
            {{ manager.amenityList.length }} Amenities
          </span>
        </div>

        <!-- Empty -->
        <div
          v-if="manager.amenityList.length === 0"
          class="empty-state"
        >
          <div class="empty-icon">
            <i class="bi bi-stars"></i>
          </div>

          <h3>No amenities yet</h3>

          <p>
            Create your first amenity to use it with your rooms.
          </p>

          <button class="add-btn" @click="openCreateModal">
            <i class="bi bi-plus-lg"></i>
            Create Amenity
          </button>
        </div>

        <!-- Table -->
        <div v-else class="table-wrapper">
          <table class="amenity-table">

            <thead>
              <tr>
                <th>#</th>
                <th>Amenity</th>
                <th>Icon</th>
                <th>Description</th>
                <th>Status</th>
                <th class="action-column">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(amenity, index) in manager.amenityList"
                :key="amenity.id"
              >
                <td class="number">
                  {{ index + 1 }}
                </td>

                <td>
                  <div class="amenity-name">
                    <div class="amenity-icon">
                      <i
                        :class="amenity.icon || 'bi bi-stars'"
                      ></i>
                    </div>

                    <span>{{ amenity.name }}</span>
                  </div>
                </td>

                <td>
                  <span class="icon-text">
                    {{ amenity.icon || '—' }}
                  </span>
                </td>

                <td class="description">
                  {{ amenity.description || 'No description' }}
                </td>

                <td>
                  <span
                    class="status"
                    :class="amenity.status === 'active'
                      ? 'active'
                      : 'inactive'"
                  >
                    {{ amenity.status || 'active' }}
                  </span>
                </td>

                <td>
                  <div class="actions">

                    <button
                      class="action-btn edit"
                      title="Edit"
                      @click="openEditModal(amenity)"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>

                    <button
                      class="action-btn delete"
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
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="modal-overlay"
      @click.self="closeModal"
    >

      <div class="modal-card">

        <div class="modal-header">

          <div>
            <h2>
              {{ editingAmenity
                ? 'Edit Amenity'
                : 'Create Amenity'
              }}
            </h2>

            <p>
              {{
                editingAmenity
                  ? 'Update amenity information'
                  : 'Add a new amenity to your hotel'
              }}
            </p>
          </div>

          <button
            class="close-btn"
            @click="closeModal"
          >
            <i class="bi bi-x-lg"></i>
          </button>

        </div>

        <form @submit.prevent="saveAmenity">

          <!-- Name -->
          <div class="form-group">
            <label>
              Amenity Name
              <span>*</span>
            </label>

            <input
              v-model="form.name"
              type="text"
              placeholder="Example: Free WiFi"
              required
            />
          </div>

          <!-- Icon -->
          <div class="form-group">
            <label>Bootstrap Icon</label>

            <input
              v-model="form.icon"
              type="text"
              placeholder="Example: bi-wifi"
            />

            <small>
              Example: <b>bi-wifi</b>, <b>bi-tv</b>,
              <b>bi-snow</b>
            </small>
          </div>

          <!-- Description -->
          <div class="form-group">
            <label>Description</label>

            <textarea
              v-model="form.description"
              rows="4"
              placeholder="Describe this amenity..."
            ></textarea>
          </div>

          <!-- Status -->
          <div class="form-group">
            <label>Status</label>

            <select v-model="form.status">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <!-- Footer -->
          <div class="modal-footer">

            <button
              type="button"
              class="cancel-btn"
              @click="closeModal"
            >
              Cancel
            </button>

            <button
              type="submit"
              class="save-btn"
              :disabled="manager.loading"
            >
              <i
                v-if="manager.loading"
                class="bi bi-arrow-repeat spin"
              ></i>

              <i
                v-else
                class="bi bi-check-lg"
              ></i>

              {{ editingAmenity ? 'Update Amenity' : 'Create Amenity' }}
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
  icon: "",
  description: "",
  status: "active",
});

onMounted(async () => {
  await manager.getAmenityList();
});

function resetForm() {
  form.value = {
    name: "",
    icon: "",
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
    icon: amenity.icon || "",
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
      icon: form.value.icon || null,
      description: form.value.description || null,
      status: form.value.status,
    };

    if (editingAmenity.value) {
      await manager.updateAmenity(
        editingAmenity.value.id,
        payload
      );
    } else {
      await manager.createAmenity(payload);
    }

    closeModal();

    alert(
      editingAmenity.value
        ? "Amenity updated successfully."
        : "Amenity created successfully."
    );

  } catch (error) {
    console.error(error);
  }
}

async function deleteAmenity(amenity) {
  const confirmed = confirm(
    `Are you sure you want to delete "${amenity.name}"?`
  );

  if (!confirmed) return;

  try {
    await manager.deleteAmenity(amenity.id);

    alert("Amenity deleted successfully.");

  } catch (error) {
    console.error(error);
  }
}
</script>

<style scoped>
.amenity-page {
  min-height: 100vh;
  background: var(--page-bg);
  color: #17231f;
}

/* =========================
   TOPBAR
========================= */

.topbar {
  min-height: var(--topbar-height);
  padding: 22px 30px;

  background: #ffffff;
  border-bottom: 1px solid var(--card-border);

  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-title {
  margin: 0;

  font-family: Georgia, "Times New Roman", serif;
  font-size: 30px;
  font-weight: 600;

  color: var(--sidebar-bg);
}

.page-subtitle {
  margin: 5px 0 0;

  color: var(--text-muted);
  font-size: 14px;
}

/* =========================
   CONTENT
========================= */

.content {
  padding: 30px;
}

/* =========================
   BUTTONS
========================= */

.add-btn,
.save-btn {
  border: none;
  background: var(--accent);
  color: #ffffff;

  padding: 11px 18px;
  border-radius: 9px;

  font-size: 14px;
  font-weight: 600;

  display: inline-flex;
  align-items: center;
  gap: 8px;

  cursor: pointer;

  transition: 0.2s;
}

.add-btn:hover,
.save-btn:hover {
  background: var(--accent-light);
  transform: translateY(-1px);
}

/* =========================
   CARD
========================= */

.amenity-card {
  background: #ffffff;

  border: 1px solid var(--card-border);
  border-radius: 14px;

  overflow: hidden;
}

.card-header {
  padding: 22px 24px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  border-bottom: 1px solid var(--card-border);
}

.card-header h2 {
  margin: 0;

  font-family: Georgia, "Times New Roman", serif;
  font-size: 21px;

  color: var(--sidebar-bg);
}

.card-header p {
  margin: 5px 0 0;

  color: var(--text-muted);
  font-size: 13px;
}

.count-badge {
  padding: 7px 12px;

  border-radius: 20px;

  background: #e8f6f2;
  color: var(--accent);

  font-size: 13px;
  font-weight: 600;
}

/* =========================
   TABLE
========================= */

.table-wrapper {
  overflow-x: auto;
}

.amenity-table {
  width: 100%;
  border-collapse: collapse;
}

.amenity-table th {
  padding: 15px 20px;

  background: #fafcfb;

  color: var(--text-muted);

  font-size: 12px;
  font-weight: 700;

  text-align: left;
  text-transform: uppercase;

  letter-spacing: 0.4px;
}

.amenity-table td {
  padding: 16px 20px;

  border-top: 1px solid var(--card-border);

  font-size: 14px;
}

.amenity-table tbody tr:hover {
  background: #fafdfc;
}

.number {
  color: var(--text-muted);
}

.amenity-name {
  display: flex;
  align-items: center;
  gap: 12px;

  font-weight: 600;
}

.amenity-icon {
  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 9px;

  background: #e8f6f2;
  color: var(--accent);

  font-size: 18px;
}

.icon-text {
  color: var(--text-muted);
  font-size: 13px;
}

.description {
  max-width: 260px;
  color: var(--text-muted);
}

.status {
  display: inline-flex;

  padding: 5px 10px;

  border-radius: 20px;

  font-size: 12px;
  font-weight: 600;
}

.status.active {
  background: #e8f6f2;
  color: var(--accent);
}

.status.inactive {
  background: #f1f2f2;
  color: var(--text-muted);
}

.action-column {
  text-align: center;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 7px;
}

.action-btn {
  width: 34px;
  height: 34px;

  border: 1px solid var(--card-border);
  border-radius: 8px;

  background: #ffffff;

  cursor: pointer;

  transition: 0.2s;
}

.action-btn.edit {
  color: var(--accent);
}

.action-btn.edit:hover {
  background: #e8f6f2;
}

.action-btn.delete {
  color: #c94c4c;
}

.action-btn.delete:hover {
  background: #fff1f1;
}

/* =========================
   EMPTY
========================= */

.empty-state {
  padding: 70px 20px;
  text-align: center;
}

.empty-icon {
  width: 65px;
  height: 65px;

  margin: 0 auto 18px;

  border-radius: 50%;

  background: #e8f6f2;
  color: var(--accent);

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 27px;
}

.empty-state h3 {
  margin: 0 0 8px;

  color: var(--sidebar-bg);
}

.empty-state p {
  margin: 0 0 20px;

  color: var(--text-muted);
}

/* =========================
   MODAL
========================= */

.modal-overlay {
  position: fixed;
  inset: 0;

  background: rgba(12, 59, 52, 0.45);

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 20px;

  z-index: 1000;
}

.modal-card {
  width: 100%;
  max-width: 520px;

  background: #ffffff;

  border-radius: 16px;

  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);

  overflow: hidden;
}

.modal-header {
  padding: 22px 24px;

  display: flex;
  justify-content: space-between;

  border-bottom: 1px solid var(--card-border);
}

.modal-header h2 {
  margin: 0;

  color: var(--sidebar-bg);

  font-family: Georgia, "Times New Roman", serif;
}

.modal-header p {
  margin: 5px 0 0;

  color: var(--text-muted);
  font-size: 13px;
}

.close-btn {
  width: 35px;
  height: 35px;

  border: none;
  background: #f4f6f5;

  border-radius: 8px;

  color: var(--text-muted);

  cursor: pointer;
}

.close-btn:hover {
  background: #e7eae9;
}

/* =========================
   FORM
========================= */

form {
  padding: 24px;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;

  margin-bottom: 7px;

  color: #27332f;

  font-size: 13px;
  font-weight: 600;
}

.form-group label span {
  color: #d34d4d;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;

  box-sizing: border-box;

  border: 1px solid #dfe4e2;

  border-radius: 8px;

  padding: 11px 12px;

  outline: none;

  font-family: inherit;
  font-size: 14px;

  transition: 0.2s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: var(--accent);

  box-shadow: 0 0 0 3px rgba(8, 127, 104, 0.08);
}

.form-group textarea {
  resize: vertical;
}

.form-group small {
  display: block;

  margin-top: 5px;

  color: var(--text-muted);

  font-size: 11px;
}

/* =========================
   MODAL FOOTER
========================= */

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  margin-top: 24px;
}

.cancel-btn {
  border: 1px solid var(--card-border);

  background: #ffffff;
  color: var(--text-muted);

  padding: 10px 17px;

  border-radius: 8px;

  cursor: pointer;
}

.cancel-btn:hover {
  background: #f4f6f5;
}

/* =========================
   LOADING / ERROR
========================= */

.loading-box,
.error-box {
  padding: 50px;

  background: #ffffff;

  border: 1px solid var(--card-border);
  border-radius: 14px;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;

  color: var(--text-muted);
}

.error-box {
  color: #c94c4c;
}

.spinner {
  width: 20px;
  height: 20px;

  border: 2px solid #dce7e4;
  border-top-color: var(--accent);

  border-radius: 50%;

  animation: spin 0.7s linear infinite;
}

.spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* =========================
   RESPONSIVE
========================= */

@media (max-width: 768px) {
  .topbar {
    align-items: flex-start;
    flex-direction: column;
    gap: 15px;
  }

  .content {
    padding: 18px;
  }

  .card-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }
}
</style>