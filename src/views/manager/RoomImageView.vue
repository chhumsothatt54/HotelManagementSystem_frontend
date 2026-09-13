<template>
  <!-- Top bar -->
  <div class="topbar bg-white">
    <div>
      <h1 class="page-title brand-serif">Room Images</h1>
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
    <div class="mb-1 text-uppercase fw-bold" style="font-size: 0.725rem; letter-spacing: 0.5px; color: var(--blue);">
      ROOM MANAGEMENT
    </div>
    <h2 class="fw-bold mb-1" style="color: #1f2937;">Room Images</h2>
    <p class="text-muted mb-4" style="font-size: 0.875rem;">Upload images for each room type.</p>

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

    <!-- Content Card -->
    <div class="content-card">
      <!-- Dropdown Selection -->
      <div class="mb-4">
        <label class="form-label fw-bold small text-dark mb-2">Select Room Type</label>
        <select v-model="selectedRoomTypeId" class="form-select" :disabled="managerStore.loading">
          <option value="" disabled>Select a room type</option>
          <option v-for="room in roomTypes" :key="room.id" :value="room.id">
            {{ room.name }}
          </option>
        </select>
      </div>

      <!-- Drag & Drop Upload Container -->
      <div
        class="upload-zone mb-4"
        :class="{ 'dragging': isDragging, 'opacity-50 pointer-events-none': uploading }"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
        @click="triggerFileInput"
        style="cursor: pointer;"
      >
        <input
          ref="fileInput"
          type="file"
          accept="image/png, image/jpeg, image/webp"
          multiple
          class="d-none"
          @change="handleFileSelect"
        />

        <div class="upload-icon">
          <i v-if="!uploading" class="bi bi-cloud-arrow-up"></i>
          <div v-else class="spinner-border spinner-border-sm text-emerald" role="status"></div>
        </div>
        <h6 class="fw-bold text-dark mb-1" style="font-size: 0.9rem;">
          {{ uploading ? 'Uploading images...' : 'Upload room images' }}
        </h6>
        <p class="text-muted mb-0" style="font-size: 0.75rem;">
          Drag & drop or click to browse (PNG, JPG or WEBP)
        </p>
      </div>

      <!-- Loading State for Images -->
      <div v-if="loadingImages" class="text-center py-4">
        <div class="spinner-border text-emerald" role="status"></div>
        <p class="text-muted small mt-2">Loading room images...</p>
      </div>

      <!-- Image Gallery Preview -->
      <div v-else class="d-flex flex-wrap gap-3">
        <!-- Empty State -->
        <div v-if="!currentRoomImages.length" class="text-muted small py-3">
          No images uploaded for this room type yet.
        </div>

        <!-- Image Cards -->
        <div
          v-for="img in currentRoomImages"
          :key="img.id || img.url"
          class="image-preview-card position-relative"
        >
          <img :src="img.url" :alt="selectedRoomName" />
          <button
            class="btn-delete-img"
            type="button"
            title="Delete image"
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

// Computed properties mapped from Pinia
const profile = computed(() => managerStore.profile || {})
const hotel = computed(() => managerStore.hotel || {})
const roomTypes = computed(() => managerStore.roomTypes || [])
const currentRoomImages = computed(() => managerStore.roomImages || [])

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

const selectedRoomName = computed(() => {
  const room = roomTypes.value.find((r) => r.id === selectedRoomTypeId.value)
  return room ? room.name : 'Room Image'
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

// Trigger Hidden File Input
const triggerFileInput = () => {
  if (!selectedRoomTypeId.value) {
    alert('Please select a room type first.')
    return
  }
  fileInput.value?.click()
}

// Handle File Input Change
const handleFileSelect = (event) => {
  const files = Array.from(event.target.files || [])
  if (files.length) uploadFiles(files)
}

// Handle Drag & Drop
const handleDrop = (event) => {
  isDragging.value = false
  if (!selectedRoomTypeId.value) {
    alert('Please select a room type first.')
    return
  }
  const files = Array.from(event.dataTransfer.files || [])
  if (files.length) uploadFiles(files)
}

// Process Upload to Backend Store
const uploadFiles = async (files) => {
  const validTypes = ['image/png', 'image/jpeg', 'image/webp']
  const validFiles = files.filter((file) => validTypes.includes(file.type))

  if (!validFiles.length) {
    alert('Only PNG, JPG, or WEBP images are supported.')
    return
  }

  uploading.value = true
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

// Delete Image
const deleteImage = async (imageId) => {
  if (!confirm('Are you sure you want to delete this image?')) return

  deletingId.value = imageId
  try {
    await managerStore.deleteRoomImage(imageId, selectedRoomTypeId.value)
    successMessage.value = 'Image deleted successfully.'
  } catch (err) {
    console.error('Failed to delete image:', err)
  } finally {
    deletingId.value = null
  }
}

// Fetch Initial Data on Mount
onMounted(async () => {
  try {
    await Promise.all([
      managerStore.getProfile?.(),
      managerStore.getMyHotel?.(),
      managerStore.getRoomTypes?.()
    ])

    // Pre-select first room type if available
    if (roomTypes.value.length) {
      selectedRoomTypeId.value = roomTypes.value[0].id
    }
  } catch (err) {
    console.error('Failed to initialize room images page:', err)
  }
})
</script>

<style scoped>
.upload-zone.dragging {
  border-color: var(--primary-emerald, #10b981) !important;
  background-color: rgba(16, 185, 129, 0.05);
}
.pointer-events-none {
  pointer-events: none;
}
</style>
<style scoped>

/* Sidebar Styling */
    .sidebar {
      width: 250px;
      background-color: var(--sidebar-bg);
      color: #ffffff;
      flex-shrink: 0;
      min-height: 100vh;
    }

    .sidebar .nav-link {
      color: rgba(255, 255, 255, 0.7);
      padding: 0.6rem 1rem;
      border-radius: 8px;
      margin-bottom: 2px;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .sidebar .nav-link:hover {
      color: #ffffff;
      background-color: var(--sidebar-hover);
    }

    .sidebar .nav-link.active {
      color: #ffffff;
      background-color: var(--sidebar-active);
      font-weight: 500;
    }

    .sidebar-category {
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: rgba(255, 255, 255, 0.4);
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
      padding-left: 1rem;
    }

    /* Top Header Bar */
    .top-header {
      background-color: #ffffff;
      border-bottom: 1px solid #e5e7eb;
      padding: 1rem 2rem;
    }

    /* Avatar Icons */
    .avatar-box {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background-color: var(--primary-emerald);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.9rem;
    }

    .avatar-circle {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: var(--primary-emerald);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.9rem;
    }

    /* Form Card Container */
    .content-card {
      background-color: #ffffff;
      border: none;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
      padding: 1.75rem;
    }

    /* Dropzone Upload Styling */
    .upload-zone {
      border: 2px dashed var(--upload-border);
      background-color: var(--upload-bg);
      border-radius: 10px;
      padding: 2.5rem 1rem;
      text-align: center;
      cursor: pointer;
      transition: background-color 0.2s, border-color 0.2s;
    }

    .upload-zone:hover {
      background-color: #e4f2ee;
      border-color: var(--primary-emerald);
    }

    .upload-icon {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      background-color: #ffffff;
      color: var(--primary-emerald);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      margin-bottom: 0.75rem;
    }

    /* Image Card Preview */
    .image-preview-card {
      width: 200px;
      height: 140px;
      border-radius: 10px;
      overflow: hidden;
      position: relative;
    }

    .image-preview-card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .btn-delete-img {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 28px;
      height: 28px;
      background-color: #ffffff;
      color: #dc2626;
      border: none;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.15);
      cursor: pointer;
      transition: background-color 0.15s;
    }

    .btn-delete-img:hover {
      background-color: #fee2e2;
    }

    .form-select {
      border-color: #e5e7eb;
      border-radius: 8px;
      padding: 0.6rem 0.9rem;
      font-size: 0.875rem;
    }

    .form-select:focus {
      border-color: var(--primary-emerald);
      box-shadow: 0 0 0 0.2rem rgba(10, 122, 92, 0.15);
    }
</style>