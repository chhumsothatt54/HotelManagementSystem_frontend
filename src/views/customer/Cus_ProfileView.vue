<template>
  <div class="page-wrapper profile-bg">
    <!-- NAVBAR -->
    <NavbarView />

    <div class="container py-5 profile-container">
      <div class="d-flex align-items-center mb-5">
        <h2 class="section-title-premium mb-0 me-4">My Account</h2>
        <div class="header-divider"></div>
      </div>

      <div class="row g-5">
        <!-- SIDEBAR TABS -->
        <div class="col-lg-3">
          <div class="tabs-premium-sidebar">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              class="tab-btn-premium"
              :class="{ active: activeTab === tab.id }"
              @click="activeTab = tab.id"
            >
              <i class="bi" :class="tab.icon"></i>
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- CONTENT AREA -->
        <div class="col-lg-9">
          <div v-if="activeTab === 'edit_profile'" class="profile-card-premium">
            <h4 class="card-title-premium mb-4">Personal Information</h4>
            
            <div class="row g-5">
              <!-- AVATAR COLUMN -->
              <div class="col-12 col-md-4 col-xl-3 d-flex flex-column align-items-center">
                <input type="file" ref="fileInput" @change="handleFileUpload" class="d-none" accept="image/*" />
                <div class="avatar-wrapper-premium mb-3" @click="triggerFileInput" style="cursor: pointer;">
                  <div v-if="avatarPreview || (authStore.user && authStore.user.avatar)" class="avatar-circle-premium overflow-hidden border-0">
                    <img :src="avatarPreview || (authStore.user.avatar.startsWith('http') ? authStore.user.avatar : `http://127.0.0.1:8000/storage/${authStore.user.avatar}`)" class="w-100 h-100 object-fit-cover" />
                  </div>
                  <div v-else class="avatar-circle-premium">
                    {{ user.initials }}
                  </div>
                  <button class="camera-btn-premium">
                    <i class="bi bi-camera"></i>
                  </button>
                </div>
              </div>

              <!-- FORM COLUMN -->
              <div class="col-12 col-md-8 col-xl-9">
                <div class="row g-4">
                  <!-- First Name -->
                  <div class="col-md-12 form-group-premium">
                    <label>Name</label>
                    <input type="text" class="form-control" v-model="user.firstName" placeholder="Enter your first name">
                  </div>

                  <!-- Email -->
                  <div class="col-md-6 form-group-premium">
                    <label>Email Address</label>
                    <input type="email" class="form-control" v-model="user.email" placeholder="name@example.com">
                  </div>

                  <!-- Phone -->
                  <div class="col-md-6 form-group-premium">
                    <label>Phone Number</label>
                    <input type="tel" class="form-control" v-model="user.phone" placeholder="+1 (555) 000-0000">
                  </div>
                  <!-- Action Buttons -->
                  <div class="col-12 d-flex justify-content-end gap-3 mt-5 pt-3 border-top-premium">
                    <button class="btn btn-outline-premium" @click="resetForm" :disabled="isSaving">Cancel</button>
                    <button class="btn btn-save-premium" @click="saveChanges" :disabled="isSaving">
                      <span v-if="isSaving">
                        <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                        Saving...
                      </span>
                      <span v-else-if="!saved">Save Changes</span>
                      <span v-else><i class="bi bi-check2 me-1"></i>Saved</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- SECURITY TAB -->
          <div v-else-if="activeTab === 'preferences'" class="profile-card-premium">
            <h4 class="card-title-premium mb-4">Security Settings</h4>
            
            <div class="row g-4">
              <div class="col-12">
                <div class="d-flex align-items-center justify-content-between p-4 border rounded-3 bg-light">
                  <div>
                    <h6 class="fw-bold mb-1">Password</h6>
                    <p class="text-muted mb-0 small">Update your password to keep your account secure.</p>
                  </div>
                  <button class="btn btn-outline-premium py-2 px-4" data-bs-toggle="modal" data-bs-target="#passwordModal">
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- OTHER TABS PLACEHOLDER -->
          <div v-else class="profile-card-premium d-flex flex-column align-items-center justify-content-center text-center py-5">
            <div class="empty-state-icon mb-3">
              <i class="bi bi-tools"></i>
            </div>
            <h4 class="card-title-premium">Work in Progress</h4>
            <p class="text-muted">This section is currently under development. Check back soon.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- PASSWORD CHANGE MODAL -->
    <div class="modal fade" id="passwordModal" tabindex="-1" aria-labelledby="passwordModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 rounded-4 shadow">
          <div class="modal-header border-bottom-0 pb-0">
            <h5 class="modal-title card-title-premium fs-4" id="passwordModalLabel">Change Password</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-4">
            
            <div v-if="pwdSuccess" class="alert alert-success d-flex align-items-center py-2">
              <i class="bi bi-check-circle me-2"></i> <span class="ms-1">{{ pwdSuccess }}</span>
            </div>
            
            <div v-if="pwdError" class="alert alert-danger d-flex align-items-center py-2">
              <i class="bi bi-exclamation-circle me-2"></i> <span class="ms-1">{{ pwdError }}</span>
            </div>

            <form @submit.prevent="submitPasswordChange">
              <div class="form-group-premium mb-3">
                <label>Current Password</label>
                <input type="password" class="form-control" v-model="pwdForm.current_password" required>
              </div>
              
              <div class="form-group-premium mb-3">
                <label>New Password</label>
                <input type="password" class="form-control" v-model="pwdForm.new_password" required minlength="8">
              </div>
              
              <div class="form-group-premium mb-4">
                <label>Confirm New Password</label>
                <input type="password" class="form-control" v-model="pwdForm.new_password_confirmation" required minlength="8">
              </div>

              <button type="submit" class="btn btn-save-premium w-100 py-2" :disabled="isChangingPwd">
                <span v-if="isChangingPwd" class="spinner-border spinner-border-sm me-2"></span>
                {{ isChangingPwd ? 'Updating...' : 'Update Password' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import NavbarView from '@/components/layout/customer/NavbarView.vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/http'

const authStore = useAuthStore()

const activeTab = ref('edit_profile')

const tabs = ref([
  { id: 'edit_profile', label: 'Edit Profile', icon: 'bi-person' },
  { id: 'preferences', label: 'Security', icon: 'bi-sliders' },

])

const user = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  country: 'Vietnam',
  city: 'Hai Phong',
  address: 'Hong Bang',
  zipCode: '180000',
  initials: 'U'
})

const saved = ref(false)
const isSaving = ref(false)
const fileInput = ref(null)
const avatarFile = ref(null)
const avatarPreview = ref(null)

const pwdForm = reactive({
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
})
const isChangingPwd = ref(false)
const pwdSuccess = ref('')
const pwdError = ref('')

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
      
      if (authStore.user.country) user.country = authStore.user.country
      if (authStore.user.city) user.city = authStore.user.city
      if (authStore.user.address) user.address = authStore.user.address
      if (authStore.user.zipCode) user.zipCode = authStore.user.zipCode
      
      user.initials = user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'
    }
  } catch (error) {
    console.error("Failed to fetch user profile:", error)
  }
}

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

function resetForm() {
  avatarFile.value = null
  avatarPreview.value = null
  loadUserData()
}

async function saveChanges() {
  isSaving.value = true
  try {
    const formData = new FormData()
    formData.append('name', `${user.firstName} ${user.lastName}`.trim())
    formData.append('email', user.email)
    formData.append('phone', user.phone || '')
    formData.append('_method', 'PUT') // Required for Laravel PUT with multipart

    if (avatarFile.value) {
      formData.append('avatar', avatarFile.value)
    }

    const res = await api.post('/v1/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    saved.value = true
    await authStore.getMe() // refresh state globally
    user.initials = user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'
    
    setTimeout(() => {
      saved.value = false
    }, 2000)
  } catch (error) {
    console.error("Failed to save changes:", error)
    alert("Failed to save profile: " + (error.response?.data?.message || error.message))
  } finally {
    isSaving.value = false
  }
}

async function submitPasswordChange() {
  isChangingPwd.value = true
  pwdSuccess.value = ''
  pwdError.value = ''
  
  try {
    const result = await authStore.changePassword({
      current_password: pwdForm.current_password,
      password: pwdForm.new_password,
      password_confirmation: pwdForm.new_password_confirmation
    })
    
    if (!result.success) {
      pwdError.value = result.message || "Failed to change password."
      return
    }
    
    pwdSuccess.value = result.message || "Password changed successfully."
    pwdForm.current_password = ''
    pwdForm.new_password = ''
    pwdForm.new_password_confirmation = ''
    
  } catch (err) {
    pwdError.value = "An unexpected error occurred."
  } finally {
    isChangingPwd.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');

.profile-bg {
  background-color: var(--color-bg-light, #f9fafb);
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

.profile-container {
  max-width: 1200px;
}

.section-title-premium {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-emerald-900, #064e3b);
}

.header-divider {
  flex-grow: 1;
  height: 1px;
  background: linear-gradient(90deg, rgba(6, 78, 59, 0.2) 0%, transparent 100%);
}

.section-subtitle-premium {
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-emerald-800, #065f46);
  margin-bottom: 0.5rem;
}

/* SIDEBAR TABS */
.tabs-premium-sidebar {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: #fff;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.02);
  border: 1px solid #f3f4f6;
}

.tab-btn-premium {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: transparent;
  border: none;
  text-align: left;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  color: #6b7280;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.tab-btn-premium i {
  font-size: 1.2rem;
  color: #9ca3af;
  transition: all 0.3s ease;
}

.tab-btn-premium:hover {
  background-color: #f9fafb;
  color: #111827;
}

.tab-btn-premium.active {
  background-color: var(--color-emerald-900, #064e3b);
  color: #fff;
  box-shadow: 0 8px 16px rgba(6, 78, 59, 0.2);
}

.tab-btn-premium.active i {
  color: var(--color-gold-500, #b45309);
}

/* PROFILE CARD */
.profile-card-premium {
  background: #fff;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 15px 40px rgba(0,0,0,0.03);
  border: 1px solid #f3f4f6;
}

.card-title-premium {
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  color: #111827;
  font-size: 1.5rem;
}

/* AVATAR */
.avatar-wrapper-premium {
  position: relative;
  width: 140px;
  height: 140px;
}

.avatar-circle-premium {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  color: var(--color-emerald-900, #064e3b);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  font-weight: 700;
  font-family: 'Playfair Display', serif;
  box-shadow: inset 0 4px 10px rgba(0,0,0,0.05), 0 10px 20px rgba(0,0,0,0.05);
  border: 4px solid #fff;
}

.camera-btn-premium {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #fff;
  color: var(--color-emerald-900, #064e3b);
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.camera-btn-premium:hover {
  transform: translateY(-2px);
  color: var(--color-emerald-800, #065f46);
  box-shadow: 0 6px 16px rgba(0,0,0,0.15);
}

/* FORM FIELDS */
.form-group-premium label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-group-premium .form-control {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 0.8rem 1.2rem;
  font-size: 1rem;
  color: #111827;
  background-color: #f9fafb;
  transition: all 0.3s ease;
}

.form-group-premium .form-control:focus {
  background-color: #fff;
  border-color: var(--color-emerald-900, #064e3b);
  box-shadow: 0 0 0 4px rgba(6, 78, 59, 0.1);
  outline: none;
}

.form-group-premium .form-control::placeholder {
  color: #9ca3af;
  font-weight: 400;
}

/* BUTTONS */
.border-top-premium {
  border-top: 1px solid #f3f4f6;
}

.btn-save-premium {
  background-color: var(--color-emerald-900, #064e3b);
  color: #fff;
  font-weight: 500;
  padding: 0.75rem 2rem;
  border-radius: 12px;
  border: none;
  transition: all 0.3s ease;
}

.btn-save-premium:hover {
  background-color: var(--color-emerald-800, #065f46);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(6, 78, 59, 0.2);
}

.btn-outline-premium {
  background-color: transparent;
  color: #4b5563;
  font-weight: 500;
  padding: 0.75rem 2rem;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.btn-outline-premium:hover {
  background-color: #f3f4f6;
  color: #111827;
}

/* EMPTY STATE */
.empty-state-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: #9ca3af;
}

/* RESPONSIVE */
@media (max-width: 991px) {
  .tabs-premium-sidebar {
    flex-direction: row;
    overflow-x: auto;
    padding: 1rem;
    border-radius: 12px;
  }
  
  .tab-btn-premium {
    padding: 0.75rem 1rem;
    white-space: nowrap;
  }
}
</style>