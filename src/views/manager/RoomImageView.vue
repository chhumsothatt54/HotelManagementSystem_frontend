<template>
  <div class="room-images-container">
    <div class="page-content">
      <!-- Section Header -->
      <div class="mb-4"><br>
        <span class="badge bg-emerald-subtle text-emerald text-uppercase fw-semibold mb-2 px-2.5 py-1 rounded-pill" style="font-size: 0.7rem; letter-spacing: 0.5px;">
          MEDIA MANAGEMENT
        </span>
        <h2 class="fw-bold text-dark mb-1 h3">Room Type Gallery</h2>
        <p class="text-muted small mb-0">Upload high-resolution images for each room category to attract guests.</p>
      </div>

      <!-- Alert Messages -->
      <div v-if="managerStore.error" class="alert alert-danger border-0 shadow-sm rounded-3 fade show mb-4 d-flex align-items-center" role="alert">
        <i class="bi bi-exclamation-triangle-fill fs-5 me-2.5"></i>
        <div class="flex-grow-1 small">{{ managerStore.error }}</div>
        <button type="button" class="btn-close ms-auto" @click="managerStore.clearError?.()"></button>
      </div>

      <div v-if="successMessage" class="alert alert-success border-0 shadow-sm rounded-3 fade show mb-4 d-flex align-items-center" role="alert">
        <i class="bi bi-check-circle-fill fs-5 me-2.5 text-emerald"></i>
        <div class="flex-grow-1 small">{{ successMessage }}</div>
        <button type="button" class="btn-close ms-auto" @click="successMessage = ''"></button>
      </div>

      <!-- Main Layout Grid -->
      <div class="row g-4">
        <!-- Sidebar Selector & Upload Form -->
        <div class="col-12 col-lg-4">
          <div class="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
            <h5 class="fw-bold text-dark mb-3 h6 text-uppercase tracking-wider text-secondary">Upload Media</h5>

            <!-- Dropdown Selection -->
            <div class="mb-4">
              <label class="form-label fw-medium small text-secondary mb-1.5">Target Room Type</label>
              <select v-model="selectedRoomTypeId" class="form-select custom-select" :disabled="managerStore.loading">
                <option value="" disabled>Select room category</option>
                <option v-for="room in roomTypes" :key="room.id || room._id" :value="room.id || room._id">
                  {{ room.name }}
                </option>
              </select>
            </div>

            <!-- Drag & Drop Upload Container -->
            <div
              class="upload-zone rounded-4 p-4 text-center d-flex flex-column align-items-center justify-content-center"
              :class="{ 'dragging': isDragging, 'opacity-50 pointer-events-none': uploading }"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
              @click="triggerFileInput"
            >
              <input
                ref="fileInput"
                type="file"
                accept="image/png, image/jpeg, image/webp"
                multiple
                class="d-none"
                @change="handleFileSelect"
              />

              <div class="upload-icon-circle mb-3 d-flex align-items-center justify-content-center">
                <i v-if="!uploading" class="bi bi-cloud-arrow-up-fill fs-3 text-emerald"></i>
                <div v-else class="spinner-border spinner-border-sm text-emerald" role="status"></div>
              </div>

              <h6 class="fw-semibold text-dark mb-1 small">
                {{ uploading ? 'Uploading images...' : 'Click or Drag files here' }}
              </h6>
              <p class="text-muted extra-small mb-0">
                PNG, JPG, or WEBP (Max 5MB per file)
              </p>
            </div>
          </div>
        </div>

        <!-- Image Gallery Showcase -->
        <div class="col-12 col-lg-8">
          <div class="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div class="d-flex align-items-center gap-2">
                <h5 class="fw-bold text-dark mb-0 h6">
                  Uploaded Media
                </h5>
                <span class="badge bg-light text-secondary rounded-pill fw-normal px-2.5 py-1" style="font-size: 0.75rem;">
                  {{ currentRoomImages.length }} Photos
                </span>
              </div>
              <span class="badge bg-emerald-subtle text-emerald fw-semibold px-2.5 py-1.5 rounded-3">
                {{ selectedRoomName }}
              </span>
            </div>

            <hr class="text-secondary opacity-10 my-3" />

            <!-- Loading State -->
            <div v-if="loadingImages" class="text-center py-5">
              <div class="spinner-border text-emerald spinner-border-sm" role="status"></div>
              <p class="text-muted small mt-2 mb-0">Fetching gallery items...</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="!currentRoomImages.length" class="empty-state-box text-center py-5 rounded-4 d-flex flex-column align-items-center justify-content-center">
              <div class="empty-icon-circle mb-3 d-flex align-items-center justify-content-center">
                <i class="bi bi-images fs-3 text-muted"></i>
              </div>
              <h6 class="fw-semibold text-dark small mb-1">No Photos Available</h6>
              <p class="text-muted extra-small mb-0">Select a room type and upload images to see them here.</p>
            </div>

            <!-- Image Cards Grid -->
            <div v-else class="row g-3">
              <div
                v-for="img in currentRoomImages"
                :key="img.id || img.url"
                class="col-6 col-sm-4 col-md-3"
              >
                <div class="gallery-card rounded-3 overflow-hidden position-relative">
                  <img :src="img.url" :alt="selectedRoomName" class="w-100 h-100 object-fit-cover" />
                  
                  <!-- Overlay Controls -->
                  <div class="gallery-overlay d-flex align-items-center justify-content-center gap-2">
                    <button
                      type="button"
                      class="btn btn-white btn-action rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                      title="Preview Image"
                      @click="previewImage(img.url)"
                    >
                      <i class="bi bi-eye text-dark fs-6"></i>
                    </button>
                    <button
                      type="button"
                      class="btn btn-white btn-action rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                      title="Delete Image"
                      :disabled="deletingId === img.id"
                      @click.stop="deleteImage(img.id)"
                    >
                      <i v-if="deletingId !== img.id" class="bi bi-trash text-danger fs-6"></i>
                      <span v-else class="spinner-border spinner-border-sm text-danger" style="width: 1rem; height: 1rem;"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="activePreviewUrl" class="custom-modal-overlay" @click="activePreviewUrl = null">
          <div class="preview-dialog p-2" @click.stop>
            <img :src="activePreviewUrl" class="img-fluid rounded-4 shadow-lg max-preview-img" />
            <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-3" @click="activePreviewUrl = null"></button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useManagerStore } from '@/stores/manager'

const managerStore = useManagerStore()

const fileInput = ref(null)
const selectedRoomTypeId = ref('')
const isDragging = ref(false)
const uploading = ref(false)
const deletingId = ref(null)
const loadingImages = ref(false)
const successMessage = ref('')
const activePreviewUrl = ref(null)

// Computed properties mapped from Pinia
const roomTypes = computed(() => managerStore.roomTypes || [])
const currentRoomImages = computed(() => managerStore.roomImages || [])

const selectedRoomName = computed(() => {
  const room = roomTypes.value.find((r) => (r.id || r._id) === selectedRoomTypeId.value)
  return room ? room.name : 'Select Category'
})

// Fetch room images when selected room type changes
watch(selectedRoomTypeId, async (newId) => {
  if (!newId) return
  loadingImages.value = true
  try {
    await managerStore.getRoomImages(newId)
  } catch (err) {
    console.error('Failed to fetch room images:', err)
  } finally {
    loadingImages.value = false
  }
})

const triggerFileInput = () => {
  if (!selectedRoomTypeId.value) {
    alert('Please select a room type first.')
    return
  }
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files || [])
  if (files.length) uploadFiles(files)
}

const handleDrop = (event) => {
  isDragging.value = false
  if (!selectedRoomTypeId.value) {
    alert('Please select a room type first.')
    return
  }
  const files = Array.from(event.dataTransfer.files || [])
  if (files.length) uploadFiles(files)
}

const uploadFiles = async (files) => {
  const validTypes = ['image/png', 'image/jpeg', 'image/webp']
  const validFiles = files.filter((file) => validTypes.includes(file.type))

  if (!validFiles.length) {
    alert('Only PNG, JPG, or WEBP images are supported.')
    return
  }

  uploading.value = true
  successMessage.value = ''
  try {
    const formData = new FormData()
    formData.append('room_type_id', selectedRoomTypeId.value)
    validFiles.forEach((file) => formData.append('images[]', file))

    await managerStore.uploadRoomImages(formData)
    successMessage.value = 'Images uploaded successfully!'
  } catch (err) {
    console.error('Upload failed:', err)
  } finally {
    uploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

const deleteImage = async (imageId) => {
  if (!confirm('Are you sure you want to delete this image?')) return

  deletingId.value = imageId
  successMessage.value = ''
  try {
    await managerStore.deleteRoomImage(imageId, selectedRoomTypeId.value)
    successMessage.value = 'Image deleted successfully.'
  } catch (err) {
    console.error('Failed to delete image:', err)
  } finally {
    deletingId.value = null
  }
}

const previewImage = (url) => {
  activePreviewUrl.value = url
}

onMounted(async () => {
  try {
    await Promise.all([
      managerStore.getProfile?.(),
      managerStore.getMyHotel?.(),
      managerStore.getRoomTypes?.()
    ])

    if (roomTypes.value.length) {
      selectedRoomTypeId.value = roomTypes.value[0].id || roomTypes.value[0]._id
    }
  } catch (err) {
    console.error('Failed to initialize room images page:', err)
  }
})
</script>

<style scoped>
/* Page Layout Reset */
.room-images-container,
.page-content {
  padding-left: 1rem !important; 
  padding-right: 1rem !important;
  padding-top: 0 !important;
  margin-top: 0 !important;
}

/* Typography & Badges */
.extra-small {
  font-size: 0.75rem;
}

.tracking-wider {
  letter-spacing: 0.05em;
}

.text-emerald {
  color: #059669;
}

/* Custom Select Dropdown */
.custom-select {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  color: #1e293b;
  background-color: var(--bg-soft, #f8fafc);
  transition: all 0.2s ease;
}

.custom-select:focus {
  background-color: var(--bg-card, #ffffff);
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

/* Upload Zone Styling */
.upload-zone {
  border: 2px dashed #e2e8f0;
  background-color: var(--bg-soft, #f8fafc);
  min-height: 180px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.upload-zone:hover, 
.upload-zone.dragging {
  border-color: #10b981;
  background-color: #f0fdf4;
}

.upload-icon-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--bg-card, #ffffff);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

/* Empty State Styling */
.empty-state-box {
  background-color: var(--bg-soft, #f8fafc);
  border: 1px dashed #e2e8f0;
  min-height: 240px;
}

.empty-icon-circle {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background-color: var(--bg-card, #ffffff);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

/* Gallery Cards & Hover Overlay */
.gallery-card {
  aspect-ratio: 4 / 3;
  background-color: #f1f5f9;
}

.gallery-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(3px);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.gallery-card:hover .gallery-overlay {
  opacity: 1;
}

.btn-white {
  background-color: var(--bg-card, #ffffff);
  border: none;
}

.btn-action {
  width: 36px;
  height: 36px;
  padding: 0;
  transition: transform 0.15s ease;
}

.btn-action:hover {
  transform: scale(1.08);
}

/* Modal Styling & Animations */
.custom-modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  cursor: pointer;
}

.max-preview-img {
  max-height: 85vh;
  max-width: 90vw;
  object-fit: contain;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.pointer-events-none {
  pointer-events: none;
}
</style>