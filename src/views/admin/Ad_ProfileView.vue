<template>
    <div class="page-container">
        <!-- Topbar -->
        <AdminTopbar title="Profile Settings" subtitle="Platform performance overview" />

        <!-- Header Area for Profile -->
        <div class="header-section">
            <div>
                <div class="header-tag">ACCOUNT</div>
                <h2 class="header-title">My Profile</h2>
            </div>
            <div>
                <button class="btn btn-save" @click="saveProfile" :disabled="isSaving">
                    <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="fa-solid fa-check me-2"></i> 
                    {{ isSaving ? 'Saving...' : (saved ? 'Saved!' : 'Save Changes') }}
                </button>
            </div>
        </div>

        <!-- Main Content -->
        <div class="content-wrapper px-4 pb-4">
            <div class="row g-4">
                <!-- Left Column: Profile Card -->
                <div class="col-md-4">
                    <div class="profile-card">
                        <input type="file" ref="fileInput" @change="handleFileUpload" class="d-none" accept="image/*" />
                        <div class="avatar-large mx-auto mb-3 position-relative" @click="triggerFileInput" style="cursor: pointer;">
                            <img v-if="userAvatar" :src="userAvatar" alt="Admin Avatar" class="w-100 h-100 rounded-circle object-fit-cover" />
                            <span v-else>{{ userInitial }}</span>
                            <div class="camera-icon-badge">
                                <i class="bi bi-camera-fill"></i>
                            </div>
                        </div>
                        <h4 class="profile-name mb-1">{{ user.firstName }} {{ user.lastName }}</h4>
                        <div class="profile-role mb-4">{{ user.role }}</div>
                        <hr class="card-divider">
                        <div class="d-flex align-items-center justify-content-center text-muted font-sm mt-3">
                            <i class="fa-solid fa-shield-halved me-2"></i> StayLink Platform
                        </div>
                    </div>
                </div>

                <!-- Right Column: Forms -->
                <div class="col-md-8">
                    <!-- Personal Information Card -->
                    <div class="form-card mb-4">
                        <div class="card-title">Personal Information</div>
                        <div class="card-subtitle mb-4">Update your account information.</div>
                        
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">First Name</label>
                                <input type="text" class="form-control" v-model="user.firstName">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Last Name</label>
                                <input type="text" class="form-control" v-model="user.lastName">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" v-model="user.email">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Phone</label>
                                <input type="text" class="form-control" v-model="user.phone">
                            </div>
                            <div class="col-md-12">
                                <label class="form-label">Role</label>
                                <input type="text" class="form-control bg-light" :value="user.role" disabled>
                            </div>
                        </div>
                    </div>

                    <!-- Security Card -->
                    <div class="form-card">
                        <div class="card-title text-dark">Security</div>
                        <div class="card-subtitle mb-4">Update your password. Leave blank if unchanged.</div>
                        
                        <div v-if="pwdSuccess" class="alert alert-success py-2 mb-3">
                            <i class="bi bi-check-circle me-1"></i> <span class="ms-1 font-sm">{{ pwdSuccess }}</span>
                        </div>
                        <div v-if="pwdError" class="alert alert-danger py-2 mb-3">
                            <i class="bi bi-exclamation-circle me-1"></i> <span class="ms-1 font-sm">{{ pwdError }}</span>
                        </div>

                        <div class="row g-3">
                            <div class="col-md-12">
                                <label class="form-label">Current Password</label>
                                <input type="password" class="form-control" v-model="pwdForm.current_password" placeholder="........">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">New Password</label>
                                <input type="password" class="form-control" v-model="pwdForm.new_password" placeholder="........">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Confirm Password</label>
                                <input type="password" class="form-control" v-model="pwdForm.new_password_confirmation" placeholder="........">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import AdminTopbar from '@/components/layout/admin/AdminTopbar.vue'
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAdminStore } from '@/stores/admin'
import api from '@/api/http'

const authStore = useAuthStore()
const adminStore = useAdminStore()

const user = reactive({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: ''
})

const pwdForm = reactive({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
})

const fileInput = ref(null)
const avatarFile = ref(null)
const avatarPreview = ref(null)
const isSaving = ref(false)
const saved = ref(false)
const pwdError = ref('')
const pwdSuccess = ref('')

onMounted(async () => {
    await loadUserData()
})

async function loadUserData() {
    try {
        await authStore.getMe()
        if (authStore.user) {
            const names = (authStore.user.name || '').trim().split(' ')
            user.firstName = names[0] || ''
            user.lastName = names.slice(1).join(' ') || ''
            user.email = authStore.user.email || ''
            user.phone = authStore.user.phone || ''
            user.role = authStore.user.role === 'admin' ? 'Administrator' : authStore.user.role === 'hotel_manager' ? 'Hotel Manager' : 'User'
        }
    } catch (error) {
        console.error("Failed to load admin profile", error)
    }
}

const userAvatar = computed(() => {
    if (avatarPreview.value) return avatarPreview.value
    if (authStore.user?.avatar) {
        const path = authStore.user.avatar
        return path.startsWith('http') ? path : `http://127.0.0.1:8000/storage/${path}`
    }
    return null
})

const userInitial = computed(() => {
    return user.firstName ? user.firstName.charAt(0).toUpperCase() : 'A'
})

function triggerFileInput() {
    fileInput.value?.click()
}

function handleFileUpload(event) {
    const file = event.target.files[0]
    if (file) {
        avatarFile.value = file
        avatarPreview.value = URL.createObjectURL(file)
    }
}

async function saveProfile() {
    isSaving.value = true
    pwdError.value = ''
    pwdSuccess.value = ''
    
    try {
        const formData = new FormData()
        formData.append('name', `${user.firstName} ${user.lastName}`.trim())
        formData.append('email', user.email)
        formData.append('phone', user.phone || '')

        if (avatarFile.value) {
            formData.append('avatar', avatarFile.value)
        }

        await adminStore.updateProfile(formData)

        if (pwdForm.new_password || pwdForm.new_password_confirmation || pwdForm.current_password) {
            if (!pwdForm.current_password) {
                 pwdError.value = "Current password is required to change password."
                 isSaving.value = false
                 return
            }
            const pwdResult = await authStore.changePassword({
                current_password: pwdForm.current_password,
                password: pwdForm.new_password,
                password_confirmation: pwdForm.new_password_confirmation
            })
            if (!pwdResult.success) {
                pwdError.value = pwdResult.message || "Failed to update password."
            } else {
                pwdSuccess.value = "Profile and password updated!"
                pwdForm.current_password = ''
                pwdForm.new_password = ''
                pwdForm.new_password_confirmation = ''
            }
        } else {
            pwdSuccess.value = "Profile updated successfully!"
        }

        saved.value = true
        await authStore.getMe() // refresh state globally

        setTimeout(() => {
            saved.value = false
            pwdSuccess.value = ''
        }, 3000)

    } catch (error) {
        console.error("Failed to save changes", error)
        pwdError.value = error.response?.data?.message || error.message || "Failed to save profile"
    } finally {
        isSaving.value = false
    }
}
</script>

<style scoped>
.page-container {
    background-color: #f6f8f7;
    min-height: 100vh;
}

/* Topbar Styles */
.topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid #eef2f0;
}
.icon-btn {
    background: #f1f5f9;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    position: relative;
    cursor: pointer;
}
.dot {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 8px;
    height: 8px;
    background-color: #ef4444;
    border-radius: 50%;
}
.user-chip {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6px 12px;
    border-radius: 30px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    cursor: pointer;
}
.avatar-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #035e4e;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 14px;
}
.font-sm { font-size: 13px; }
.font-xs { font-size: 11px; }

/* Profile Page Styles */
.header-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 24px 24px 32px 24px;
}

.header-tag {
    font-size: 11px;
    font-weight: 800;
    color: #0f766e;
    letter-spacing: 1px;
    margin-bottom: 4px;
}

.header-title {
    font-size: 24px;
    color: #1e293b;
    margin-bottom: 4px;
    font-family: 'Georgia', serif; /* Gives the classic serif look from the design */
}

.header-subtitle {
    font-size: 14px;
    color: #64748b;
}

.btn-save {
    background-color: #0f766e;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.2s;
}

.btn-save:hover {
    background-color: #0d6059;
    color: white;
}

.profile-card {
    background-color: #ffffff;
    border-radius: 12px;
    border: 1px solid #eef2f0;
    padding: 32px 24px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

.avatar-large {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background-color: #0f766e;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    font-weight: bold;
    box-shadow: 0 8px 16px rgba(15, 118, 110, 0.2);
}

.profile-name {
    font-size: 18px;
    color: #1e293b;
    font-family: 'Georgia', serif;
}

.profile-role {
    font-size: 13px;
    font-weight: 600;
    color: #0f766e;
}

.card-divider {
    border-color: #e2e8f0;
    opacity: 0.5;
    margin: 20px 0;
}

.form-card {
    background-color: #ffffff;
    border-radius: 12px;
    border: 1px solid #eef2f0;
    padding: 24px 32px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

.card-title {
    font-size: 16px;
    font-weight: 600;
    color: #0f766e;
}

.card-subtitle {
    font-size: 13px;
    color: #64748b;
}

.form-label {
    font-size: 12px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 8px;
}

.form-control {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 10px 16px;
    font-size: 14px;
    color: #334155;
}

.form-control:focus {
    border-color: #0f766e;
    box-shadow: 0 0 0 0.2rem rgba(15, 118, 110, 0.25);
}

.font-sm {
    font-size: 13px;
}

.camera-icon-badge {
    position: absolute;
    bottom: 0;
    right: 0;
    background-color: white;
    color: #0f766e;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    font-size: 14px;
}
</style>
