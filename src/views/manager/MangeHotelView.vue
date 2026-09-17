<template>
  <div class="manage-hotel-wrapper">

    <!-- ================= TOPBAR ================= -->
    <div class="topbar bg-white">
      <div>
        <h1 class="page-title brand-serif">Manage hotel</h1>
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
      </div>
    </div>


    <!-- ================= PAGE CONTENT ================= -->
    <main class="page-content">

      <!-- ================= ERROR ================= -->
      <div
        v-if="managerStore.error"
        class="error-alert"
      >
        <div class="error-icon">
          <i class="bi bi-exclamation-triangle-fill"></i>
        </div>

        <div class="error-content">
          <strong>Something went wrong</strong>
          <span>{{ managerStore.error }}</span>
        </div>

        <button
          class="error-close"
          @click="
            managerStore.clearError
              ? managerStore.clearError()
              : managerStore.error = null
          "
        >
          <i class="bi bi-x-lg"></i>
        </button>
      </div>


      <!-- ================================================= -->
      <!-- NO HOTEL YET -->
      <!-- ================================================= -->
      <section
        v-if="!managerStore.hotel && !showCreateForm"
        class="create-hotel-section"
      >

        <div class="create-hotel-card">

          <div class="create-hotel-icon">
            <i class="bi bi-building-add"></i>
          </div>

          <span class="section-label">
            Hotel management
          </span>

          <h2>
            Create Your Hotel
          </h2>

          <p>
            You haven't created a hotel yet.
            Create your hotel profile to start managing
            your property information.
          </p>

          <button
            class="create-hotel-btn"
            @click="openCreateForm"
          >
            <i class="bi bi-plus-lg"></i>
            Create Hotel
          </button>

        </div>

      </section>


      <!-- ================================================= -->
      <!-- CREATE HOTEL FORM -->
      <!-- ================================================= -->
      <section
        v-if="!managerStore.hotel && showCreateForm"
        class="section"
      >

        <div class="section-header">

          <span class="section-label">
            Hotel management
          </span>

          <h2>
            Create Hotel
          </h2>

          <p>
            Enter your hotel information to create your property.
          </p>

        </div>


        <div class="details-card">

          <div class="card-header">

            <div>
              <h3>
                Property Information
              </h3>

              <p>
                Enter your hotel's basic information.
              </p>
            </div>

            <button
              type="button"
              class="cancel-btn"
              @click="cancelCreate"
            >
              <i class="bi bi-x-lg"></i>
              Cancel
            </button>

          </div>


          <div class="divider"></div>


          <form
            id="hotelCreateForm"
            @submit.prevent="handleSubmit"
          >

            <div class="form-grid">

              <!-- HOTEL NAME -->
              <div class="form-group">

                <label>
                  Hotel Name <span>*</span>
                </label>

                <div class="input-box">

                  <i class="bi bi-building"></i>

                  <input
                    type="text"
                    v-model="form.name"
                    placeholder="Enter hotel name"
                    required
                  />

                </div>

              </div>


              <!-- EMAIL -->
              <div class="form-group">

                <label>
                  Email
                </label>

                <div class="input-box">

                  <i class="bi bi-envelope"></i>

                  <input
                    type="email"
                    :value="
                      managerStore.profile?.email ||
                      managerStore.user?.email ||
                      ''
                    "
                    readonly
                  />

                  <i class="bi bi-link-45deg email-linked"></i>

                </div>

                <small class="email-hint">
                  <i class="bi bi-info-circle"></i>
                  Linked to your manager account
                </small>

              </div>


              <!-- PHONE -->
              <div class="form-group">

                <label>
                  Phone <span>*</span>
                </label>

                <div class="input-box">

                  <i class="bi bi-telephone"></i>

                  <input
                    type="text"
                    v-model="form.phone"
                    placeholder="+855 xx xxx xxx"
                    required
                  />

                </div>

              </div>


              <!-- CITY -->
              <div class="form-group">

                <label>
                  City <span>*</span>
                </label>

                <div class="input-box">

                  <i class="bi bi-geo-alt"></i>

                  <input
                    type="text"
                    v-model="form.city"
                    placeholder="Enter city"
                    required
                  />

                </div>

              </div>


              <!-- ADDRESS -->
              <div class="form-group full">

                <label>
                  Address <span>*</span>
                </label>

                <div class="input-box">

                  <i class="bi bi-pin-map"></i>

                  <input
                    type="text"
                    v-model="form.address"
                    placeholder="Enter property address"
                    required
                  />

                </div>

              </div>


              <!-- COUNTRY -->
              <div class="form-group">

                <label>
                  Country <span>*</span>
                </label>

                <div class="input-box">

                  <i class="bi bi-globe2"></i>

                  <input
                    type="text"
                    v-model="form.country"
                    placeholder="Cambodia"
                    required
                  />

                </div>

              </div>


              <!-- PROVINCE -->
              <div class="form-group">

                <label>
                  Province / State <span>*</span>
                </label>

                <div class="input-box">

                  <i class="bi bi-map"></i>

                  <input
                    type="text"
                    v-model="form.province"
                    placeholder="Enter province"
                    required
                  />

                </div>

              </div>


              <!-- LATITUDE -->
              <div class="form-group">

                <label>
                  Latitude <span>*</span>
                </label>

                <div class="input-box">

                  <i class="bi bi-compass"></i>

                  <input
                    type="number"
                    step="any"
                    min="-90"
                    max="90"
                    v-model="form.latitude"
                    placeholder="11.5564"
                    required
                  />

                </div>

                <small>
                  Range: -90 to 90
                </small>

              </div>


              <!-- LONGITUDE -->
              <div class="form-group">

                <label>
                  Longitude <span>*</span>
                </label>

                <div class="input-box">

                  <i class="bi bi-compass"></i>

                  <input
                    type="number"
                    step="any"
                    min="-180"
                    max="180"
                    v-model="form.longitude"
                    placeholder="104.9282"
                    required
                  />

                </div>

                <small>
                  Range: -180 to 180
                </small>

              </div>


              <!-- DESCRIPTION -->
              <div class="form-group full">

                <label>
                  Description <span>*</span>
                </label>

                <textarea
                  v-model="form.description"
                  placeholder="Describe your hotel..."
                  rows="3"
                  required
                ></textarea>

              </div>

            </div>


            <!-- FORM ACTIONS -->
            <div class="form-actions">

              <button
                type="button"
                class="cancel-btn"
                @click="cancelCreate"
              >
                Cancel
              </button>

              <button
                type="submit"
                class="save-btn"
                :disabled="managerStore.loading"
              >

                <span
                  v-if="managerStore.loading"
                  class="spinner-border spinner-border-sm"
                ></span>

                <i
                  v-else
                  class="bi bi-check-lg"
                ></i>

                {{
                  managerStore.loading
                    ? 'Creating...'
                    : 'Create Hotel'
                }}

              </button>

            </div>

          </form>

        </div>

      </section>


      <!-- ================================================= -->
      <!-- HOTEL EXISTS -->
      <!-- ================================================= -->
      <section
        v-if="managerStore.hotel"
        class="section"
      >

        <div class="section-header">

          <span class="section-label">
            Property information
          </span>

          <h2>
            Hotel Details
          </h2>

          <p>
            Manage your hotel's basic information and contact details.
          </p>

        </div>


        <div class="hotel-layout">


          <!-- ================= PROFILE ================= -->
          <div class="profile-card">

            <div class="profile-top">

              <!-- HOTEL AVATAR -->
              <div class="hotel-avatar">

                <img
                  v-if="managerStore.images?.length"
                  :src="
                    managerStore.images[0]?.url ||
                    managerStore.images[0]
                  "
                  alt="Hotel"
                  class="hotel-profile-image"
                />

                <div
                  v-else
                  class="hotel-avatar-placeholder"
                >
                  <i class="bi bi-building"></i>
                </div>

              </div>


             


              <!-- PROFILE NAME -->
              <div class="profile-main">

                <h3>
                  {{
                    form.name ||
                    managerStore.hotel?.name ||
                    'Hotel Name'
                  }}
                </h3>

                <span class="manager-badge">

                  <i class="bi bi-patch-check-fill"></i>

                  {{
                    managerStore.user?.role ||
                    'Hotel Manager'
                  }}

                </span>

              </div>

            </div>


            <!-- PROFILE INFORMATION -->
            <div class="profile-info">


              <!-- LOCATION -->
              <div class="profile-info-item">

                <div class="info-icon">
                  <i class="bi bi-geo-alt"></i>
                </div>

                <div>

                  <small>
                    Location
                  </small>

                  <span>
                    {{
                      form.city ||
                      managerStore.hotel?.city ||
                      'Not specified'
                    }}
                  </span>

                </div>

              </div>


              <!-- EMAIL -->
              <div class="profile-info-item">

                <div class="info-icon">
                  <i class="bi bi-envelope"></i>
                </div>

                <div>

                  <small>
                    Email
                  </small>

                  <span>
                    {{
                      managerStore.profile?.email ||
                      managerStore.user?.email ||
                      'Not specified'
                    }}
                  </span>

                </div>

              </div>


              <!-- PHONE -->
              <div class="profile-info-item">

                <div class="info-icon">
                  <i class="bi bi-telephone"></i>
                </div>

                <div>

                  <small>
                    Phone
                  </small>

                  <span>
                    {{
                      form.phone ||
                      managerStore.hotel?.phone ||
                      'Not specified'
                    }}
                  </span>

                </div>

              </div>

            </div><br><hr>

             <!-- ==================== ACCOUNT STATUS ==================== -->
              <div class="account-status-card">

                <div class="account-status-left">

                  <div class="account-status-icon">
                    <i class="bi bi-shield-check"></i>
                  </div>

                  <div>
                    <div class="account-status-title">
                      Account Status
                    </div>

                    <div class="account-status-sub">
                      Your hotel account status
                    </div>
                  </div>

                </div>

                <span
                  class="badge-status"
                  :class="
                    getAccountStatusClass(
                      managerStore.hotel?.status
                    )
                  "
                >
                  <span class="status-dot"></span>

                  {{
                    formatAccountStatus(
                      managerStore.hotel?.status
                    )
                  }}
                </span>

              </div>

          </div>


          <!-- ================= DETAILS ================= -->
          <div class="details-card">

            <div class="card-header">

              <div>

                <h3>
                  Property Information
                </h3>

                <p>
                  Update your hotel's information.
                </p>

              </div>


              <button
                type="submit"
                form="hotelForm"
                class="save-btn"
                :disabled="managerStore.loading"
              >

                <span
                  v-if="managerStore.loading"
                  class="spinner-border spinner-border-sm"
                ></span>

                <i
                  v-else
                  class="bi bi-check-lg"
                ></i>

                {{
                  managerStore.loading
                    ? 'Saving...'
                    : 'Save Changes'
                }}

              </button>

            </div>


            <div class="divider"></div>


            <form
              id="hotelForm"
              @submit.prevent="handleSubmit"
            >

              <div class="form-grid">


                <!-- HOTEL NAME -->
                <div class="form-group">

                  <label>
                    Hotel Name <span>*</span>
                  </label>

                  <div class="input-box">

                    <i class="bi bi-building"></i>

                    <input
                      type="text"
                      v-model="form.name"
                      placeholder="Enter hotel name"
                      required
                    />

                  </div>

                </div>


                <!-- EMAIL -->
                <div class="form-group">

                  <label>
                    Email
                  </label>

                  <div class="input-box">

                    <i class="bi bi-envelope"></i>

                    <input
                      type="email"
                      :value="
                        managerStore.profile?.email ||
                        managerStore.user?.email ||
                        ''
                      "
                      readonly
                    />

                    <i class="bi bi-link-45deg email-linked"></i>

                  </div>

                  <small class="email-hint">
                    <i class="bi bi-info-circle"></i>
                    Linked to your manager account
                  </small>

                </div>


                <!-- PHONE -->
                <div class="form-group">

                  <label>
                    Phone <span>*</span>
                  </label>

                  <div class="input-box">

                    <i class="bi bi-telephone"></i>

                    <input
                      type="text"
                      v-model="form.phone"
                      placeholder="+855 xx xxx xxx"
                      required
                    />

                  </div>

                </div>


                <!-- CITY -->
                <div class="form-group">

                  <label>
                    City <span>*</span>
                  </label>

                  <div class="input-box">

                    <i class="bi bi-geo-alt"></i>

                    <input
                      type="text"
                      v-model="form.city"
                      placeholder="Enter city"
                      required
                    />

                  </div>

                </div>


                <!-- ADDRESS -->
                <div class="form-group full">

                  <label>
                    Address <span>*</span>
                  </label>

                  <div class="input-box">

                    <i class="bi bi-pin-map"></i>

                    <input
                      type="text"
                      v-model="form.address"
                      placeholder="Enter property address"
                      required
                    />

                  </div>

                </div>


                <!-- COUNTRY -->
                <div class="form-group">

                  <label>
                    Country <span>*</span>
                  </label>

                  <div class="input-box">

                    <i class="bi bi-globe2"></i>

                    <input
                      type="text"
                      v-model="form.country"
                      placeholder="Cambodia"
                      required
                    />

                  </div>

                </div>


                <!-- PROVINCE -->
                <div class="form-group">

                  <label>
                    Province / State <span>*</span>
                  </label>

                  <div class="input-box">

                    <i class="bi bi-map"></i>

                    <input
                      type="text"
                      v-model="form.province"
                      placeholder="Enter province"
                      required
                    />

                  </div>

                </div>


                <!-- LATITUDE -->
                <div class="form-group">

                  <label>
                    Latitude <span>*</span>
                  </label>

                  <div class="input-box">

                    <i class="bi bi-compass"></i>

                    <input
                      type="number"
                      step="any"
                      min="-90"
                      max="90"
                      v-model="form.latitude"
                      placeholder="11.5564"
                      required
                    />

                  </div>

                  <small>
                    Range: -90 to 90
                  </small>

                </div>


                <!-- LONGITUDE -->
                <div class="form-group">

                  <label>
                    Longitude <span>*</span>
                  </label>

                  <div class="input-box">

                    <i class="bi bi-compass"></i>

                    <input
                      type="number"
                      step="any"
                      min="-180"
                      max="180"
                      v-model="form.longitude"
                      placeholder="104.9282"
                      required
                    />

                  </div>

                  <small>
                    Range: -180 to 180
                  </small>

                </div>


                <!-- DESCRIPTION -->
                <div class="form-group full">

                  <label>
                    Description <span>*</span>
                  </label>

                  <textarea
                    v-model="form.description"
                    placeholder="Describe your hotel..."
                    rows="3"
                    required
                  ></textarea>

                </div>

              </div>

            </form>

          </div>

        </div>

      </section>

    </main>

  </div>
</template>


<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useManagerStore } from '@/stores/manager'

const managerStore = useManagerStore()

const showCreateForm = ref(false)

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
})


/* ============================================================
   LOAD HOTEL
============================================================ */

onMounted(async () => {
  try {
    await managerStore.getMyHotel()

    if (managerStore.hotel) {
      populateForm()

      // Load hotel images for profile picture
      await managerStore.getHotelImages()
    }

  } catch (err) {
    console.error('Initialization error:', err)
  }
})


/* ============================================================
   POPULATE FORM
============================================================ */

const populateForm = () => {

  if (!managerStore.hotel) return

  const h = managerStore.hotel

  form.name = h.name || ''
  form.description = h.description || ''
  form.phone = h.phone || ''

  form.email =
    managerStore.profile?.email ||
    managerStore.user?.email ||
    h.email ||
    ''

  form.address = h.address || ''
  form.city = h.city || ''
  form.country = h.country || ''
  form.province = h.province || ''
  form.latitude = h.latitude ?? ''
  form.longitude = h.longitude ?? ''
}


/* ============================================================
   CREATE HOTEL
============================================================ */

const openCreateForm = () => {

  showCreateForm.value = true

  // Clear form before creating
  Object.keys(form).forEach((key) => {
    form[key] = ''
  })

  form.email =
    managerStore.profile?.email ||
    managerStore.user?.email ||
    ''
}


/* ============================================================
   CANCEL CREATE
============================================================ */

const cancelCreate = () => {

  showCreateForm.value = false

  Object.keys(form).forEach((key) => {
    form[key] = ''
  })
}


/* ============================================================
   SUBMIT
============================================================ */

const handleSubmit = async () => {

  try {

    const payload = {
      ...form,

      email:
        managerStore.profile?.email ||
        managerStore.user?.email ||
        form.email
    }


    // CREATE HOTEL
    if (!managerStore.hotel) {

      await managerStore.createHotel(payload)

      // After successful creation
      if (managerStore.hotel) {

        populateForm()

        showCreateForm.value = false

        // Load hotel images
        await managerStore.getHotelImages()
      }

      return
    }


    // UPDATE HOTEL
    await managerStore.updateHotel(
      managerStore.hotel.id,
      payload
    )

    populateForm()

  } catch (error) {

    console.error('Submit error:', error)

  }
}


/* ============================================================
   ACCOUNT STATUS
============================================================ */

function formatAccountStatus(status) {

  if (!status) {
    return 'Unknown'
  }

  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase())
}


function getAccountStatusClass(status) {

  switch (status) {

    case 'active':
    case 'approved':
      return 'badge-confirmed'

    case 'inactive':
    case 'suspended':
    case 'rejected':
      return 'badge-cancelled'

    case 'pending':
      return 'badge-pending'

    default:
      return 'badge-default'
  }
}
</script>


<style scoped>

/* ============================================================
   ACCOUNT STATUS
============================================================ */

.account-status-card {
  width: 100%;
  background: white;
  border: 1px solid #edf0ee;
  border-radius: 14px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
  box-shadow: 0 2px 8px rgba(30, 45, 36, 0.03);
}

.account-status-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.account-status-icon {
  width: 42px;
  height: 42px;
  border-radius: 11px;
  background: #e9f5ed;
  color: #43815b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.account-status-title {
  font-size: 14px;
  font-weight: 700;
  color: #344039;
}

.account-status-sub {
  margin-top: 2px;
  font-size: 11px;
  color: #89928d;
}

.account-status-card .badge-status {
  padding: 6px 11px;
  gap: 6px;
  display: inline-flex;
  align-items: center;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}


/* ACCOUNT STATUS COLORS */

.badge-confirmed {
  background: #e5f2ec;
  color: #2f7d5c;
}

.badge-cancelled {
  background: #fbebe6;
  color: #b3432b;
}

.badge-pending {
  background: #fff4d6;
  color: #a56a00;
}

.badge-default {
  background: #f1f3f5;
  color: #6b7280;
}


/* =========================================
   DESIGN TOKENS
========================================= */

.manage-hotel-wrapper {
  --navy: #16233f;
  --green: #2f7d5c;
  --green-dark: #24614a;
  --green-soft: #e5f2ec;
  --text: #1f2937;
  --muted: #6b7280;
  --border: #e5e7eb;
  --bg: #f6f7f9;
  --card: #ffffff;
  --danger: #b3432b;
  --danger-soft: #fbebe6;

  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 13px;
  padding: 28px 32px 60px;
}


/* =========================================
   TOPBAR
========================================= */

/* ============================================================
   TOP BAR
============================================================ */

.topbar {
    min-height: 78px;
    padding: 18px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #edf0ee;
}

.page-title {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
}

.page-subtitle {
    color: #8a938e;
    font-size: 13px;
    margin-top: 2px;
}

.page-subtitle {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 13px;
}

.notification-btn {
  position: relative;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--card);
  color: var(--navy);
  font-size: 16px;
  cursor: pointer;
  transition: .2s;
}

.notification-btn:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.notification-dot {
  position: absolute;
  top: 9px;
  right: 10px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--danger);
  border: 2px solid var(--card);
}


/* =========================================
   PAGE CONTENT
========================================= */

.page-content {
  max-width: 1080px;
  margin: 0 auto;
}


/* =========================================
   ERROR ALERT
========================================= */

.error-alert {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  margin-bottom: 22px;
  border: 1px solid #f0c9bd;
  border-radius: 10px;
  background: var(--danger-soft);
}

.error-icon {
  flex-shrink: 0;
  color: var(--danger);
  font-size: 16px;
  margin-top: 1px;
}

.error-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.error-content strong {
  color: var(--danger);
  font-size: 12.5px;
}

.error-content span {
  color: #7a3620;
  font-size: 12px;
  line-height: 1.5;
}

.error-close {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--danger);
  cursor: pointer;
  transition: .2s;
}

.error-close:hover {
  background: rgba(179, 67, 43, .12);
}


/* =========================================
   SECTION HEADER
========================================= */

.section {
  display: block;
}

.section-header {
  margin-bottom: 18px;
}

.section-label {
  display: inline-block;
  color: var(--green);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: .02em;
  margin-bottom: 6px;
}

.section-header h2 {
  margin: 0;
  color: var(--navy);
  font-family: 'Lora', serif;
  font-size: 21px;
  font-weight: 700;
}

.section-header p {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 12.5px;
}


/* =========================================
   CREATE HOTEL EMPTY STATE
========================================= */

.create-hotel-section {
  min-height: calc(100vh - 160px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.create-hotel-card {
  width: 100%;
  max-width: 600px;
  padding: 50px 40px;
  text-align: center;
  background: white;
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(15, 23, 42, .04);
}

.create-hotel-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  background: var(--green-soft);
  color: var(--green);
  font-size: 30px;
}

.create-hotel-card .section-label {
  margin-bottom: 6px;
}

.create-hotel-card h2 {
  margin: 0;
  color: var(--navy);
  font-family: 'Lora', serif;
  font-size: 25px;
  font-weight: 700;
}

.create-hotel-card p {
  max-width: 430px;
  margin: 10px auto 22px;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.7;
}

.create-hotel-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 11px 18px;
  border: none;
  border-radius: 8px;
  background: var(--green);
  color: white;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: .2s;
}

.create-hotel-btn:hover {
  background: var(--green-dark);
  transform: translateY(-1px);
}


/* =========================================
   DETAILS / FORM CARD
========================================= */

.details-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 22px 24px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, .03);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.card-header h3 {
  margin: 0;
  color: var(--navy);
  font-family: 'Lora', serif;
  font-size: 16.5px;
  font-weight: 700;
}

.card-header p {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 12px;
}

.divider {
  height: 1px;
  background: var(--border);
  margin: 18px 0 20px;
}


/* =========================================
   FORM GRID
========================================= */

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group.full {
  grid-column: 1 / -1;
}

.form-group label {
  color: var(--navy);
  font-size: 12px;
  font-weight: 600;
}

.form-group label span {
  color: var(--danger);
}

.form-group > small {
  color: var(--muted);
  font-size: 10.5px;
}

.input-box {
  position: relative;
  display: flex;
  align-items: center;
}

.input-box i {
  position: absolute;
  left: 12px;
  color: var(--muted);
  font-size: 13px;
  pointer-events: none;
}

.input-box input {
  width: 100%;
  padding: 10px 12px 10px 34px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: white;
  color: var(--text);
  font-size: 12.5px;
  transition: .2s;
}

.input-box input:focus {
  outline: none;
  border-color: var(--green);
  box-shadow: 0 0 0 3px var(--green-soft);
}

.input-box input[readonly] {
  background: #f8fafc;
  color: var(--muted);
  cursor: not-allowed;
}

textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: white;
  color: var(--text);
  font-size: 12.5px;
  font-family: inherit;
  resize: vertical;
  transition: .2s;
}

textarea:focus {
  outline: none;
  border-color: var(--green);
  box-shadow: 0 0 0 3px var(--green-soft);
}


/* =========================================
   CANCEL / SAVE BUTTONS
========================================= */

.cancel-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 9px 13px;
  border: 1px solid var(--border);
  border-radius: 7px;
  background: white;
  color: #64748b;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: .2s;
}

.cancel-btn:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
  color: var(--text);
}

.save-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 9px 16px;
  border: none;
  border-radius: 7px;
  background: var(--green);
  color: white;
  font-size: 10.5px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: .2s;
}

.save-btn:hover:not(:disabled) {
  background: var(--green-dark);
  transform: translateY(-1px);
}

.save-btn:disabled {
  opacity: .65;
  cursor: not-allowed;
  transform: none;
}


/* =========================================
   FORM ACTIONS
========================================= */

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid var(--border);
}


/* =========================================
   HOTEL LAYOUT
========================================= */

.hotel-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  align-items: start;
}


/* =========================================
   PROFILE CARD
========================================= */

.profile-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 22px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, .03);
}

.profile-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-bottom: 18px;
  margin-bottom: 18px;
  border-bottom: 1px solid var(--border);
}

.hotel-avatar {
  width: 64px;
  height: 64px;
  margin-bottom: 12px;
}

.profile-main h3 {
  margin: 0;
  color: var(--navy);
  font-family: 'Lora', serif;
  font-size: 15.5px;
  font-weight: 700;
  line-height: 1.35;
}

.manager-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 8px;
  padding: 4px 10px;
  border-radius: 20px;
  background: var(--green-soft);
  color: var(--green-dark);
  font-size: 10px;
  font-weight: 700;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.profile-info-item {
  display: flex;
  align-items: flex-start;
  gap: 11px;
}

.profile-info-item > div:last-child {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.profile-info-item small {
  color: var(--muted);
  font-size: 10.5px;
}

.profile-info-item span {
  color: var(--text);
  font-size: 12.5px;
  font-weight: 500;
  overflow-wrap: anywhere;
}

.info-icon {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: var(--green-soft);
  color: var(--green);
  font-size: 13px;
}


/* =========================================
   HOTEL AVATAR
========================================= */

.hotel-avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--green-soft);
  color: var(--green);
  font-size: 25px;
}

.hotel-profile-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  border-radius: 50%;
  border: 1px solid var(--border);
}


/* =========================================
   EMAIL LINKED
========================================= */

.email-linked {
  left: auto !important;
  right: 10px;
  color: var(--green) !important;
}

.email-hint {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--green) !important;
  font-size: 10.5px;
}


/* =========================================
   RESPONSIVE
========================================= */

@media (max-width: 900px) {

  .hotel-layout {
    grid-template-columns: 1fr;
  }

}

@media (max-width: 600px) {

  .manage-hotel-wrapper {
    padding: 20px 16px 40px;
  }

  .topbar {
    flex-wrap: wrap;
  }

  .page-title {
    font-size: 22px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .create-hotel-card {
    padding: 35px 22px;
  }

  .create-hotel-card h2 {
    font-size: 21px;
  }

  .card-header {
    flex-direction: column;
  }

  .card-header .save-btn {
    align-self: stretch;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions button {
    width: 100%;
  }

  .account-status-card {
    padding: 13px 14px;
  }

  .account-status-title {
    font-size: 13px;
  }

  .account-status-sub {
    font-size: 10px;
  }

}
</style>