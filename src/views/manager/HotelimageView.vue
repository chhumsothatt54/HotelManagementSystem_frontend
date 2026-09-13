<template>
    <!-- Top bar -->
    <div class="topbar bg-white">
        <div>
            <h1 class="page-title brand-serif">Hotel Image</h1>
            <div class="page-subtitle">Property performance overview</div>
        </div>
        <div class="d-flex align-items-center gap-3">
            <div class="icon-btn"><i class="bi bi-bell"></i><span class="dot"></span></div>
            <!-- <div class="user-chip">
                <div class="avatar-circle">M</div>
                <div>
                    <div class="name">Sokha Manager</div>
                    <div class="sub">Mekong Riverside Hotel</div>
                </div>
                <i class="bi bi-chevron-down text-muted small"></i>
            </div> -->
        </div>
    </div>

    <div class="page-content">
        <!-- Subheader Action Area -->
        <div class="d-flex align-items-center justify-content-between mb-4">
            <div>
                <div class="text-uppercase fw-bold" style="font-size: 10px; color: var(--blue); letter-spacing: 0.5px;">PROPERTY SETUP</div>
                <h2 class="fw-bold mb-0" style="font-size: 22px; color: var(--navy);">Hotel Images</h2>
                <p class="text-muted mb-0" style="font-size: 13px;">Manage the images displayed for your hotel.</p>
            </div>
            
            <!-- Hidden File Input Triggered by Button -->
            <input 
                type="file" 
                ref="fileInput" 
                class="d-none" 
                accept="image/*" 
                multiple 
                @change="handleFileUpload" 
            />
            
            <button 
                class="btn-primary-custom" 
                @click="triggerFileInput" 
                :disabled="managerStore.loading"
            >
                <span v-if="managerStore.loading" class="spinner-border spinner-border-sm me-1" role="status"></span>
                <i v-else class="bi bi-cloud-upload"></i> Upload Images
            </button>
        </div>

        <!-- Error Notification -->
        <div v-if="managerStore.error" class="alert alert-danger alert-dismissible fade show mb-4" role="alert">
            {{ managerStore.error }}
            <button type="button" class="btn-close" @click="managerStore.clearError()"></button>
        </div>

        <!-- Hotel Images Gallery Grid -->
        <div class="row g-3 mb-4">
            <!-- Loading State -->
            <div v-if="managerStore.loading && !managerStore.images?.length" class="col-12 text-center py-5 text-muted">
                <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                Loading images...
            </div>

            <!-- Empty State -->
            <div v-else-if="!managerStore.images?.length" class="col-12 text-center py-5 text-muted">
                No images uploaded yet. Click "Upload Images" to add your property photos.
            </div>

            <!-- Dynamic Image List -->
            <div 
                v-else 
                v-for="(img, index) in managerStore.images" 
                :key="imageId || index" 
                class="col-6 col-md-3"
            >
                <div class="hotel-img-card">
                    <img :src="img.url || img" :alt="img.caption || 'Hotel Image ' + (index + 1)">
                    <span class="img-tag">Image {{ index + 1 }}</span>
                    <button 
                        class="delete-btn" 
                        title="Delete Image" 
                        @click="handleDelete(img.id || index)"
                        :disabled="deletingId === (img.id || index)"
                    >
                        <span v-if="deletingId === (img.id || index)" class="spinner-border spinner-border-sm" role="status"></span>
                        <i v-else class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useManagerStore } from '@/stores/manager' // កែប្រែ path ទៅតាមទីតាំង store របស់អ្នក

const managerStore = useManagerStore()
const fileInput = ref(null)
const deletingId = ref(null)

// ទាញយកព័ត៌មានរូបភាពពី API នៅពេល Mounted
onMounted(async () => {
    try {
        await managerStore.getHotelImages()
    } catch (err) {
        console.error('Failed to load images:', err)
    }
})

// Trigger click ទៅលើ Hidden Native File Input
const triggerFileInput = () => {
    fileInput.value.click()
}

// Upload រូបភាពទៅកាន់ REST API
const handleFileUpload = async (event) => {
    const files = event.target.files

    if (!files || !files.length) {
        return
    }

    try {
        for (const file of files) {
            const formData = new FormData()

            formData.append('image', file)

            await managerStore.uploadHotelImages(formData)
        }

        await managerStore.getHotelImages()

        event.target.value = ''
    } catch (err) {
        console.error('Failed to upload image:', err)
    }
}

// លុបរូបភាពតាមរយៈ REST API
const handleDelete = async (imageId) => {
    deletingId.value = imageId
    try {
        await managerStore.deleteHotelImage(imageId)
    } catch (err) {
        console.error('Failed to delete image:', err)
    } finally {
        deletingId.value = null
    }
}
</script>
<style scoped>


        /* Main Content Styling */
        .main-wrapper {
            margin-left: var(--sidebar-width);
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            min-width: 0;
        }

        

        /* User Chip Right */
        .user-chip {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 4px 12px 4px 4px;
            border: 1px solid var(--line);
            border-radius: 50px;
            cursor: pointer;
            background: #ffffff;
        }

        .avatar-circle {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color: var(--navy);
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 700;
        }

        /* Content Area */
        .content-area {
            padding: 28px 32px;
            flex-grow: 1;
        }

        /* Custom Buttons */
        .btn-primary-custom {
            background-color: var(--blue);
            color: #ffffff;
            border: none;
            border-radius: 8px;
            padding: 8px 16px;
            font-size: 13px;
            font-weight: 600;
            transition: 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        .btn-primary-custom:hover {
            background-color: var(--navy);
            color: #ffffff;
        }

        /* Cards Styling */
        .card-custom {
            background: #ffffff;
            border: 1px solid var(--line);
            border-radius: var(--radius);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
            padding: 20px;
            height: 100%;
        }

        .stat-icon-wrapper {
            width: 42px;
            height: 42px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
        }

        .stat-icon-wrapper.blue {
            background-color: var(--blue-light);
            color: var(--blue);
        }

        .stat-icon-wrapper.gold {
            background-color: #FEF7E6;
            color: var(--gold);
        }

        .stat-value {
            font-size: 26px;
            font-weight: 700;
            color: var(--ink);
            margin: 10px 0 2px;
        }

        .stat-label {
            font-size: 12px;
            color: var(--muted);
            font-weight: 500;
        }

        /* Hotel Image Cards */
        .hotel-img-card {
            position: relative;
            border-radius: var(--radius);
            overflow: hidden;
            border: 1px solid var(--line);
            aspect-ratio: 16 / 10;
        }

        .hotel-img-card img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .hotel-img-card .img-tag {
            position: absolute;
            bottom: 12px;
            left: 12px;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            color: #ffffff;
            font-size: 11px;
            padding: 2px 8px;
            border-radius: 4px;
        }

        .hotel-img-card .delete-btn {
            position: absolute;
            bottom: 12px;
            right: 12px;
            width: 28px;
            height: 28px;
            background: #ffffff;
            color: #dc3545;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }

        /* Table Styling */
        .custom-table {
            width: 100%;
            margin: 0;
        }

        .custom-table th {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--muted);
            font-weight: 600;
            border-bottom: 1px solid var(--line);
            padding: 12px 16px;
            background: var(--bg-soft);
        }

        .custom-table td {
            font-size: 13px;
            padding: 14px 16px;
            border-bottom: 1px solid var(--line);
            vertical-align: middle;
        }

        .badge-status {
            padding: 4px 8px;
            border-radius: 50px;
            font-size: 11px;
            font-weight: 600;
        }

        .badge-status.approved {
            background-color: var(--blue-light);
            color: var(--blue);
        }

        .badge-status.pending {
            background-color: #FEF7E6;
            color: #B47D00;
        }

        /* Donut Chart Visual */
        .donut-chart-container {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: conic-gradient(var(--blue) 0% 75%, var(--line) 75% 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
        }

        .donut-chart-inner {
            width: 88px;
            height: 88px;
            background: #ffffff;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
</style>