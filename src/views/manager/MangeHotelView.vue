<template>
  <div class="manage-hotel-wrapper">


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

                  <!-- <label>
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

                  </div> -->

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
.page-content{
  padding-left: 0 rem !important; 
  padding-right: 0 rem !important;
  padding-top: 0 !important;
  margin-top: 0 !important;
}
/* =========================================================
   MANAGE HOTEL — PREMIUM HOTEL ADMIN UI
========================================================= */

.manage-hotel-wrapper {
  --navy: #102033;
  --navy-light: #1b3048;

  --green: #087f68;
  --green-dark: #066653;
  --green-soft: #e9f7f3;
  --green-border: #ccece4;

  --text: #17212b;
  --muted: #718096;
  --muted-light: #9aa6b2;

  --border: #e5e9ed;
  --border-light: #eef1f4;

  --bg: #f5f7f8;
  --card: #ffffff;

  --danger: #c2412d;
  --danger-soft: #fff0ec;

  --warning: #a56b00;
  --warning-soft: #fff7df;

  min-height: 100vh;
  background:
    radial-gradient(
      circle at top right,
      rgba(8, 127, 104, 0.05),
      transparent 28%
    ),
    var(--bg);

  color: var(--text);

  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;

  font-size: 13px;
  padding: 30px 34px 70px;
}


/* =========================================================
   PAGE CONTENT
========================================================= */

.page-content {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
}


/* =========================================================
   TOPBAR
========================================================= */

.topbar {
  min-height: 82px;
  margin-bottom: 28px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 4px;
}

.page-title {
  margin: 0;

  color: var(--navy);

  font-family: "Lora", Georgia, serif;

  font-size: 30px;
  line-height: 1.2;
  font-weight: 700;

  letter-spacing: -0.5px;
}

.page-subtitle {
  margin: 7px 0 0;

  color: var(--muted);

  font-size: 13px;
  line-height: 1.5;
}


/* =========================================================
   ERROR ALERT
========================================================= */

.error-alert {
  display: flex;
  align-items: center;

  gap: 14px;

  padding: 15px 17px;
  margin-bottom: 24px;

  border: 1px solid #f3cbc2;
  border-radius: 13px;

  background: var(--danger-soft);

  box-shadow: 0 5px 18px rgba(194, 65, 45, 0.05);
}

.error-icon {
  width: 38px;
  height: 38px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 10px;

  background: #ffe1da;
  color: var(--danger);

  font-size: 15px;
}

.error-content {
  flex: 1;

  display: flex;
  flex-direction: column;

  gap: 3px;
}

.error-content strong {
  color: #9d3523;
  font-size: 13px;
  font-weight: 700;
}

.error-content span {
  color: #7c392c;

  font-size: 12px;
  line-height: 1.5;
}

.error-close {
  width: 32px;
  height: 32px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 0;
  border-radius: 9px;

  background: transparent;
  color: var(--danger);

  cursor: pointer;

  transition: all 0.2s ease;
}

.error-close:hover {
  background: rgba(194, 65, 45, 0.1);
}


/* =========================================================
   SECTION HEADER
========================================================= */

.section-header {
  margin-bottom: 22px;
}

.section-label {
  display: inline-flex;
  align-items: center;

  padding: 5px 10px;

  margin-bottom: 9px;

  border-radius: 20px;

  background: var(--green-soft);
  color: var(--green);

  font-size: 10px;
  font-weight: 800;

  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.section-header h2 {
  margin: 0;

  color: var(--navy);

  font-family: "Lora", Georgia, serif;

  font-size: 25px;
  line-height: 1.25;
  font-weight: 700;

  letter-spacing: -0.3px;
}

.section-header p {
  margin: 7px 0 0;

  max-width: 680px;

  color: var(--muted);

  font-size: 13px;
  line-height: 1.6;
}


/* =========================================================
   EMPTY CREATE HOTEL
========================================================= */

.create-hotel-section {
  min-height: calc(100vh - 190px);

  display: flex;
  align-items: center;
  justify-content: center;
}

.create-hotel-card {
  position: relative;

  width: 100%;
  max-width: 650px;

  padding: 58px 48px;

  overflow: hidden;

  text-align: center;

  background: var(--card);

  border: 1px solid var(--border);
  border-radius: 22px;

  box-shadow:
    0 15px 45px rgba(16, 32, 51, 0.07),
    0 2px 8px rgba(16, 32, 51, 0.03);
}

.create-hotel-card::before {
  content: "";

  position: absolute;

  width: 220px;
  height: 220px;

  top: -110px;
  right: -80px;

  border-radius: 50%;

  background: rgba(8, 127, 104, 0.07);
}

.create-hotel-icon {
  position: relative;

  width: 82px;
  height: 82px;

  margin: 0 auto 22px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 22px;

  background: linear-gradient(
    135deg,
    var(--green-soft),
    #dff4ed
  );

  color: var(--green);

  font-size: 34px;

  box-shadow:
    0 10px 25px rgba(8, 127, 104, 0.1);
}

.create-hotel-card h2 {
  margin: 0;

  color: var(--navy);

  font-family: "Lora", Georgia, serif;

  font-size: 28px;
  font-weight: 700;
}

.create-hotel-card p {
  max-width: 470px;

  margin: 12px auto 28px;

  color: var(--muted);

  font-size: 13px;
  line-height: 1.7;
}

.create-hotel-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 8px;

  padding: 12px 20px;

  border: 0;
  border-radius: 10px;

  background: var(--green);
  color: var(--bg-card, white);

  font-size: 12px;
  font-weight: 700;

  cursor: pointer;

  box-shadow:
    0 8px 18px rgba(8, 127, 104, 0.2);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.create-hotel-btn:hover {
  background: var(--green-dark);

  transform: translateY(-2px);

  box-shadow:
    0 12px 24px rgba(8, 127, 104, 0.25);
}


/* =========================================================
   HOTEL LAYOUT
========================================================= */

.hotel-layout {
  display: grid;

  grid-template-columns: 320px minmax(0, 1fr);

  gap: 24px;

  align-items: start;
}


/* =========================================================
   PROFILE CARD
========================================================= */

.profile-card {
  position: sticky;
  top: 24px;

  overflow: hidden;

  background: var(--card);

  border: 1px solid var(--border);
  border-radius: 18px;

  box-shadow:
    0 10px 30px rgba(16, 32, 51, 0.05);
}

.profile-top {
  position: relative;

  padding: 28px 22px 24px;

  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;

  background: linear-gradient( 180deg, #f1faf7 0%, var(--bg-card, #ffffff) 100% );

  border-bottom: 1px solid var(--border-light);
}

.hotel-avatar {
  width: 92px;
  height: 92px;

  margin-bottom: 16px;

  padding: 4px;

  border-radius: 50%;

  background: var(--bg-card, white);

  box-shadow:
    0 8px 25px rgba(16, 32, 51, 0.12);
}

.hotel-profile-image {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;

  border-radius: 50%;

  border: 1px solid var(--border);
}

.hotel-avatar-placeholder {
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: var(--green-soft);

  color: var(--green);

  font-size: 32px;
}

.profile-main h3 {
  max-width: 250px;

  margin: 0 auto;

  color: var(--navy);

  font-family: "Lora", Georgia, serif;

  font-size: 18px;
  line-height: 1.35;
  font-weight: 700;
}

.manager-badge {
  display: inline-flex;
  align-items: center;

  gap: 5px;

  margin-top: 10px;

  padding: 6px 11px;

  border-radius: 20px;

  background: var(--green-soft);
  color: var(--green-dark);

  font-size: 10px;
  font-weight: 800;
}


/* =========================================================
   PROFILE INFORMATION
========================================================= */

.profile-info {
  padding: 22px;

  display: flex;
  flex-direction: column;

  gap: 17px;
}

.profile-info-item {
  display: flex;
  align-items: center;

  gap: 12px;
}

.info-icon {
  width: 36px;
  height: 36px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 10px;

  background: var(--green-soft);
  color: var(--green);

  font-size: 14px;
}

.profile-info-item > div:last-child {
  min-width: 0;

  display: flex;
  flex-direction: column;

  gap: 3px;
}

.profile-info-item small {
  color: var(--muted-light);

  font-size: 10px;
  font-weight: 600;

  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.profile-info-item span {
  color: var(--text);

  font-size: 12.5px;
  font-weight: 600;

  overflow-wrap: anywhere;
}


/* =========================================================
   ACCOUNT STATUS
========================================================= */

.account-status-card {
  margin: 0 22px 22px;
  padding: 14px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 12px;

  border: 1px solid var(--border-light);
  border-radius: 12px;

  background: #fafcfb;
}

.account-status-left {
  display: flex;
  align-items: center;

  gap: 10px;
}

.account-status-icon {
  width: 36px;
  height: 36px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 9px;

  background: var(--green-soft);
  color: var(--green);

  font-size: 15px;
}

.account-status-title {
  color: var(--text);

  font-size: 11px;
  font-weight: 800;
}

.account-status-sub {
  margin-top: 2px;

  color: var(--muted-light);

  font-size: 9.5px;
}

.badge-status {
  display: inline-flex;
  align-items: center;

  gap: 6px;

  padding: 6px 10px;

  border-radius: 20px;

  font-size: 9px;
  font-weight: 800;

  text-transform: uppercase;
  letter-spacing: 0.04em;

  white-space: nowrap;
}

.status-dot {
  width: 6px;
  height: 6px;

  border-radius: 50%;

  background: currentColor;
}

.badge-confirmed {
  background: #e7f7ef;
  color: #18734f;
}

.badge-cancelled {
  background: #fff0ec;
  color: #b13d29;
}

.badge-pending {
  background: #fff7df;
  color: #9a6500;
}

.badge-default {
  background: #f0f2f4;
  color: #68717d;
}


/* =========================================================
   DETAILS CARD
========================================================= */

.details-card {
  background: var(--card);

  border: 1px solid var(--border);
  border-radius: 18px;

  padding: 28px;

  box-shadow:
    0 10px 30px rgba(16, 32, 51, 0.04);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 20px;
}

.card-header h3 {
  margin: 0;

  color: var(--navy);

  font-family: "Lora", Georgia, serif;

  font-size: 19px;
  font-weight: 700;
}

.card-header p {
  margin: 5px 0 0;

  color: var(--muted);

  font-size: 11.5px;
  line-height: 1.5;
}

.divider {
  height: 1px;

  margin: 22px 0 24px;

  background: var(--border-light);
}


/* =========================================================
   FORM GRID
========================================================= */

.form-grid {
  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 19px 20px;
}

.form-group {
  display: flex;
  flex-direction: column;

  gap: 7px;
}

.form-group.full {
  grid-column: 1 / -1;
}

.form-group label {
  color: var(--navy);

  font-size: 11.5px;
  font-weight: 700;
}

.form-group label span {
  color: var(--danger);
}

.form-group > small {
  color: var(--muted);

  font-size: 9.5px;
}


/* =========================================================
   INPUTS
========================================================= */

.input-box {
  position: relative;

  display: flex;
  align-items: center;
}

.input-box > i:first-child {
  position: absolute;

  left: 13px;

  color: #8b98a5;

  font-size: 13px;

  pointer-events: none;

  transition: color 0.2s ease;
}

.input-box input {
  width: 100%;

  min-height: 43px;

  padding: 11px 38px 11px 37px;

  border: 1px solid var(--border);

  border-radius: 10px;

  outline: none;

  background: var(--bg-card, #ffffff);
  color: var(--text);

  font-size: 12px;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.input-box input:hover {
  border-color: #cfd7de;
}

.input-box input:focus {
  border-color: var(--green);

  background: #fcfffe;

  box-shadow:
    0 0 0 4px rgba(8, 127, 104, 0.09);
}

.input-box:focus-within > i:first-child {
  color: var(--green);
}

.input-box input[readonly] {
  background: #f7f9fa;

  color: #7c8792;

  cursor: not-allowed;
}

.email-linked {
  left: auto !important;
  right: 13px;

  color: var(--green) !important;
}

.email-hint {
  display: inline-flex;
  align-items: center;

  gap: 5px;

  color: var(--green) !important;

  font-size: 9.5px !important;
  font-weight: 600;
}


/* =========================================================
   TEXTAREA
========================================================= */

textarea {
  width: 100%;

  min-height: 105px;

  padding: 12px 14px;

  border: 1px solid var(--border);
  border-radius: 10px;

  outline: none;

  background: var(--bg-card, white);
  color: var(--text);

  font-family: inherit;
  font-size: 12px;

  resize: vertical;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

textarea:hover {
  border-color: #cfd7de;
}

textarea:focus {
  border-color: var(--green);

  box-shadow:
    0 0 0 4px rgba(8, 127, 104, 0.09);
}


/* =========================================================
   BUTTONS
========================================================= */

.save-btn,
.cancel-btn {
  min-height: 40px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 7px;

  border-radius: 9px;

  font-size: 11px;
  font-weight: 800;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.save-btn {
  padding: 0 17px;

  border: 1px solid var(--green);

  background: var(--green);
  color: var(--bg-card, white);

  box-shadow:
    0 6px 14px rgba(8, 127, 104, 0.17);
}

.save-btn:hover:not(:disabled) {
  background: var(--green-dark);

  transform: translateY(-1px);

  box-shadow:
    0 9px 18px rgba(8, 127, 104, 0.23);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cancel-btn {
  padding: 0 15px;

  border: 1px solid var(--border);

  background: var(--bg-card, white);
  color: #64748b;
}

.cancel-btn:hover {
  border-color: #cbd5df;

  background: #f8fafb;

  color: var(--text);
}


/* =========================================================
   FORM ACTIONS
========================================================= */

.form-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  gap: 10px;

  margin-top: 25px;
  padding-top: 20px;

  border-top: 1px solid var(--border-light);
}


/* =========================================================
   CREATE FORM
========================================================= */

.section {
  width: 100%;
}


/* =========================================================
   RESPONSIVE — TABLET
========================================================= */

@media (max-width: 1050px) {

  .manage-hotel-wrapper {
    padding: 26px 24px 60px;
  }

  .hotel-layout {
    grid-template-columns: 280px minmax(0, 1fr);

    gap: 18px;
  }

  .details-card {
    padding: 23px;
  }
}


/* =========================================================
   RESPONSIVE — MOBILE
========================================================= */

@media (max-width: 850px) {

  .hotel-layout {
    grid-template-columns: 1fr;
  }

  .profile-card {
    position: relative;
    top: auto;
  }

  .profile-top {
    flex-direction: row;

    text-align: left;

    padding: 20px;
  }

  .hotel-avatar {
    width: 72px;
    height: 72px;

    margin: 0 15px 0 0;
  }

  .profile-main h3 {
    margin: 0;

    font-size: 17px;
  }
}


@media (max-width: 650px) {

  .manage-hotel-wrapper {
    padding: 20px 15px 45px;
  }

  .page-title {
    font-size: 25px;
  }

  .page-subtitle {
    font-size: 12px;
  }

  .section-header h2 {
    font-size: 22px;
  }

  .details-card {
    padding: 20px 16px;
    border-radius: 15px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group.full {
    grid-column: auto;
  }

  .card-header {
    flex-direction: column;
  }

  .card-header .save-btn {
    width: 100%;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions button {
    width: 100%;
  }

  .create-hotel-card {
    padding: 42px 22px;

    border-radius: 18px;
  }

  .create-hotel-card h2 {
    font-size: 24px;
  }

  .create-hotel-card p {
    font-size: 12px;
  }
}


@media (max-width: 430px) {

  .profile-top {
    flex-direction: column;

    align-items: center;

    text-align: center;
  }

  .hotel-avatar {
    margin: 0 0 12px;
  }

  .account-status-card {
    align-items: flex-start;
  }

  .account-status-left {
    align-items: flex-start;
  }

  .badge-status {
    margin-top: 2px;
  }
}


/* =========================================================
   SMALL POLISH
========================================================= */

button,
input,
textarea {
  -webkit-tap-highlight-color: transparent;
}

::selection {
  background: rgba(8, 127, 104, 0.16);
  color: var(--navy);
}

</style>