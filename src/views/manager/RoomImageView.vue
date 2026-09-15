<template>
  <div class="room-images-container p-4">
    <!-- Topbar Header -->
    <div class="topbar bg-white p-3 rounded-3 shadow-sm d-flex justify-content-between align-items-center mb-4 border">
      <div>
        <h1 class="page-title brand-serif h4 mb-1 text-dark fw-bold">Room Gallery</h1>
        <div class="page-subtitle text-muted small">
          Manage media assets and visual presentation for your property types
        </div>
      </div>

      <div class="d-flex align-items-center gap-3">
        <button class="btn btn-light position-relative rounded-circle p-2 shadow-sm border-0" type="button">
          <i class="bi bi-bell text-secondary"></i>
          <span class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
        </button>
      </div>
    </div>

    <div class="page-content">
      <!-- Section Header -->
      <div class="mb-4">
        <div class="badge bg-emerald-subtle text-emerald text-uppercase fw-bold mb-1 px-2 py-1" style="font-size: 0.725rem; letter-spacing: 0.5px;">
          MEDIA MANAGEMENT
        </div>
        <h2 class="fw-bold text-dark mb-1">Room Type Gallery</h2>
        <p class="text-muted small mb-0">Upload high-resolution images for each room category to attract guests.</p>
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

      <!-- Main Layout Grid -->
      <div class="row g-4">
        <!-- Sidebar Selector & Upload Form -->
        <div class="col-12 col-lg-4">
          <div class="card border-0 shadow-sm rounded-3 bg-white p-4 h-100">
            <h5 class="fw-bold text-dark mb-3">Upload Media</h5>

            <!-- Dropdown Selection -->
            <div class="mb-4">
              <label class="form-label fw-semibold small text-dark mb-2">Target Room Type</label>
              <select v-model="selectedRoomTypeId" class="form-select form-select-lg" :disabled="managerStore.loading">
                <option value="" disabled>Select room category</option>
                <option v-for="room in roomTypes" :key="room.id || room._id" :value="room.id || room._id">
                  {{ room.name }}
                </option>
              </select>
            </div>

            <!-- Drag & Drop Upload Container -->
            <div
              class="upload-zone rounded-3 p-4 text-center"
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

              <div class="upload-icon-circle mx-auto mb-3 d-flex align-items-center justify-content-center">
                <i v-if="!uploading" class="bi bi-cloud-arrow-up-fill fs-3 text-emerald"></i>
                <div v-else class="spinner-border spinner-border-sm text-emerald" role="status"></div>
              </div>

              <h6 class="fw-bold text-dark mb-1">
                {{ uploading ? 'Uploading images...' : 'Click or Drag files here' }}
              </h6>
              <p class="text-muted small mb-0">
                Supports PNG, JPG, or WEBP (Max 5MB per file)
              </p>
            </div>
          </div>
        </div>

        <!-- Image Gallery Showcase -->
        <div class="col-12 col-lg-8">
          <div class="card border-0 shadow-sm rounded-3 bg-white p-4 h-100">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="fw-bold text-dark mb-0">
                Uploaded Media
                <span class="badge bg-light text-secondary ms-2 fw-normal" style="font-size: 0.8rem;">
                  {{ currentRoomImages.length }} Photos
                </span>
              </h5>
              <span class="badge bg-emerald-subtle text-emerald fw-semibold">
                {{ selectedRoomName }}
              </span>
            </div>

            <hr class="text-muted opacity-25 mt-0 mb-4" />

            <!-- Loading State -->
            <div v-if="loadingImages" class="text-center py-5">
              <div class="spinner-border text-emerald" role="status"></div>
              <p class="text-muted small mt-2">Fetching gallery items...</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="!currentRoomImages.length" class="text-center py-5 border rounded-3 bg-light style-empty-box">
              <i class="bi bi-images display-4 text-muted opacity-50 d-block mb-3"></i>
              <h6 class="fw-semibold text-secondary">No Photos Available</h6>
              <p class="text-muted small mb-0">Select a room type and upload images to see them here.</p>
            </div>

            <!-- Image Cards Grid -->
            <div v-else class="row g-3">
              <div
                v-for="img in currentRoomImages"
                :key="img.id || img.url"
                class="col-6 col-sm-4 col-md-3"
              >
                <div class="gallery-card rounded-3 overflow-hidden position-relative group">
                  <img :src="img.url" :alt="selectedRoomName" class="w-100 h-100 object-fit-cover" />
                  
                  <!-- Overlay Controls -->
                  <div class="gallery-overlay d-flex align-items-center justify-content-center gap-2">
                    <button
                      type="button"
                      class="btn btn-light btn-sm rounded-circle shadow-sm"
                      title="Preview Image"
                      @click="previewImage(img.url)"
                    >
                      <i class="bi bi-eye text-dark"></i>
                    </button>
                    <button
                      type="button"
                      class="btn btn-danger btn-sm rounded-circle shadow-sm"
                      title="Delete Image"
                      :disabled="deletingId === img.id"
                      @click.stop="deleteImage(img.id)"
                    >
                      <i v-if="deletingId !== img.id" class="bi bi-trash"></i>
                      <span v-else class="spinner-border spinner-border-sm"></span>
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
      <div v-if="activePreviewUrl" class="custom-modal-overlay" @click="activePreviewUrl = null">
        <div class="preview-dialog p-2">
          <img :src="activePreviewUrl" class="img-fluid rounded-3 shadow-lg max-preview-img" />
        </div>
      </div>
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
/* Color Accents */
.btn-emerald {
  background-color: #059669;
  color: #ffffff;
  border: none;
}

.bg-emerald-subtle {
  background-color: #d1fae5;
}

.text-emerald {
  color: #059669;
}

/* Upload Zone Styling */
.upload-zone {
  border: 2px dashed #cbd5e1;
  background-color: #f8fafc;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.upload-zone:hover, .upload-zone.dragging {
  border-color: #059669;
  background-color: #ecfdf5;
}

.upload-icon-circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #ffffff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

/* Gallery Cards Grid */
.gallery-card {
  height: 140px;
  background-color: #f1f5f9;
}

.gallery-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(2px);
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.gallery-card:hover .gallery-overlay {
  opacity: 1;
}

.style-empty-box {
  border-style: dashed !important;
}

/* Modal Overlay for Preview */
.custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(4px);
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

.pointer-events-none {
  pointer-events: none;
}
</style>