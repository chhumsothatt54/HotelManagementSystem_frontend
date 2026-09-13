<template>
  <!-- Top bar -->
  <div class="topbar bg-white">
    <div>
      <h1 class="page-title brand-serif">Profile</h1>
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

  <!-- Page content -->
  <div class="page-content">
    <div class="panel-card">
      <!-- Header -->
      <div
        class="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4"
      >
        <div>
          <p class="eyebrow mb-1">ACCOUNT</p>

          <h2 class="page-title">My Profile</h2>

          <p class="page-sub">
            Manage your personal information and account settings.
          </p>
        </div>

        <button
          type="button"
          class="btn-brand"
          :disabled="managerStore.loading"
          @click="saveChanges"
        >
          <span
            v-if="managerStore.loading"
            class="spinner-border spinner-border-sm me-2"
          ></span>

          <i v-else class="bi bi-check-lg me-1"></i>

          {{ managerStore.loading ? "Saving..." : "Save Changes" }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="initialLoading" class="text-center py-5">
        <div class="spinner-border" role="status"></div>

        <p class="text-muted mt-3 mb-0">Loading profile...</p>
      </div>

      <template v-else>
        <!-- Error -->
        <div
          v-if="managerStore.error"
          class="alert alert-danger py-2 px-3 mb-3"
        >
          <div class="d-flex justify-content-between align-items-center">
            <span>
              {{ managerStore.error }}
            </span>

            <button
              type="button"
              class="btn-close"
              @click="managerStore.clearError()"
            ></button>
          </div>
        </div>

        <!-- Success -->
        <div v-if="justSaved" class="alert alert-success py-2 px-3 mb-3">
          <i class="bi bi-check-circle me-2"></i>
          Profile updated successfully.
        </div>

        <div class="row g-4">
          <!-- ========================= -->
          <!-- PROFILE CARD -->
          <!-- ========================= -->
          <div class="col-12 col-lg-4">
            <div class="card-panel h-100 text-center">
              <!-- Avatar -->
              <div class="profile-avatar mx-auto">
                <div class="profile-avatar-inner">
                  {{ profileInitial }}
                </div>
              </div>

              <!-- Name -->
              <p class="profile-name mb-1">
                {{ fullName }}
              </p>

              <!-- Role -->
              <p class="profile-role mb-3">
                {{ profileRole }}
              </p>

              <!-- Hotel -->
              <div class="profile-hotel">
                <i class="bi bi-building me-2"></i>
                {{ hotelName }}
              </div>
            </div>
          </div>

          <!-- ========================= -->
          <!-- PERSONAL INFORMATION -->
          <!-- ========================= -->
          <div class="col-12 col-lg-8">
            <div class="card-panel h-100">
              <h2>Personal Information</h2>

              <p class="panel-desc">Update your account information.</p>

              <form @submit.prevent="saveChanges">
  <div class="mb-3">
    <label class="form-label">Full Name</label>
    <input
      v-model="form.name"
      type="text"
      class="form-control"
      required
    />
  </div>

  <div class="mb-3">
    <label class="form-label">Email</label>
    <input
      v-model="form.email"
      type="email"
      class="form-control"
      required
    />
  </div>

  <div class="mb-3">
    <label class="form-label">Phone</label>
    <input
      v-model="form.phone"
      type="text"
      class="form-control"
    />
  </div>

  <div class="mb-3">
    <label class="form-label">Role</label>
    <input
      v-model="form.role"
      type="text"
      class="form-control"
      disabled
    />
  </div>
</form>
            </div>
          </div>

          <!-- ========================= -->
          <!-- HOTEL INFORMATION -->
          <!-- ========================= -->
          <div class="col-12">
            <div class="card-panel">
              <h2>Hotel Information</h2>

              <p class="panel-desc">Information about your managed property.</p>

              <div class="row g-3">
                <!-- Hotel Name -->
                <div class="col-md-6">
                  <label class="form-label"> Hotel Name </label>

                  <input
                    :value="hotelName"
                    type="text"
                    class="form-control"
                    disabled
                  />
                </div>

                <!-- Hotel ID -->
                <div class="col-md-6">
                  <label class="form-label"> Hotel ID </label>

                  <input
                    :value="hotel?.id || 'N/A'"
                    type="text"
                    class="form-control"
                    disabled
                  />
                </div>

                <!-- Address -->
                <div class="col-md-12">
                  <label class="form-label"> Address </label>

                  <input
                    :value="hotel?.address || 'No address available'"
                    type="text"
                    class="form-control"
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- ========================= -->
          <!-- SECURITY -->
          <!-- ========================= -->
          <div class="col-12">
  <div class="card-panel">
    <h2>Security</h2>

    <p class="panel-desc">
      Manage your account security.
    </p>

    <div class="security-row">

      <div class="d-flex align-items-center gap-3">

        <div class="security-icon">
          <i class="bi bi-lock-fill"></i>
        </div>

        <div>
          <p class="security-title mb-1">
            Password
          </p>

          <p class="security-sub mb-0">
            Keep your account secure with a strong password.
          </p>
        </div>

      </div>

      <div class="d-flex align-items-center gap-2">

        <!-- Forgot Password -->
        <RouterLink
          to="/forgot-password"
          class="btn-forgot"
        >
          Forgot Password
        </RouterLink>

        <!-- Change Password -->
        <RouterLink
          to="/manager/change-password"
          class="btn-outline-brand"
        >
          Change Password
        </RouterLink>

      </div>

    </div>
  </div>
</div>
        </div>
      </template>
    </div>
  </div>
</template>


<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useManagerStore } from "@/stores/manager";

const managerStore = useManagerStore();

// ==========================================
// STORE DATA
// ==========================================

const profile = computed(() => managerStore.profile);

const hotel = computed(() => managerStore.hotel);

// ==========================================
// LOCAL STATE
// ==========================================

const initialLoading = ref(true);

const justSaved = ref(false);

// ==========================================
// FORM
// ==========================================

const form = reactive({
  name: "",
  email: "",
  phone: "",
  role: "",
});

// ==========================================
// WATCH PROFILE
// Automatically put API data into form
// ==========================================

watch(
  profile,
  (newProfile) => {
    if (!newProfile) {
      return;
    }

    form.name = newProfile.name || "";
    form.email = newProfile.email || "";
    form.phone = newProfile.phone || "";
    form.role = newProfile.role || "";
  },
  {
    immediate: true,
    deep: true,
  }
);

// ==========================================
// FULL NAME
// ==========================================

const fullName = computed(() => {
  return profile.value?.name || "Manager";
});

// ==========================================
// PROFILE INITIAL
// ==========================================

const profileInitial = computed(() => {
  return profile.value?.name?.charAt(0).toUpperCase() || "M";
});

// ==========================================
// ROLE
// ==========================================

const profileRole = computed(() => {
  return profile.value?.role || "Hotel Manager";
});

// ==========================================
// HOTEL NAME
// ==========================================

const hotelName = computed(() => {
  return hotel.value?.name || "No hotel yet";
});

// ==========================================
// LOAD PROFILE
// Uses getMyHotel()
// ==========================================

async function loadProfile() {
  initialLoading.value = true;

  try {
    await Promise.all([managerStore.getProfile(), managerStore.getMyHotel()]);
  } catch (error) {
    console.error("Failed to load profile data:", error);
  } finally {
    initialLoading.value = false;
  }
}

// ==========================================
// SAVE PROFILE
// ==========================================

async function saveChanges() {
    justSaved.value = false;

    try {
        await managerStore.updateProfile({
            name: form.name,
            email: form.email,
            phone: form.phone,
        });

        justSaved.value = true;
    } catch (error) {
        console.error("Failed to update profile:", error);
    }
}

// ==========================================
// CHANGE PASSWORD
// ==========================================

function changePassword() {
  console.log("TODO: open change-password modal");
}

// ==========================================
// ON MOUNT
// ==========================================

onMounted(() => {
  loadProfile();
});
</script>

<style scoped>
.font-display {
  font-family: "Lora", serif;
}

/* ---------- Sidebar ---------- */
.sidebar {
  width: var(--sidebar-w);
  background: var(--navy);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  overflow-y: auto;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.4rem 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.brand-mark {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: var(--sky);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Lora", serif;
  font-weight: 700;
  font-size: 1.15rem;
  flex-shrink: 0;
}

.brand-name {
  color: #fff;
  font-weight: 700;
  font-size: 0.95rem;
  line-height: 1.25;
  margin: 0;
}

.brand-sub {
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.74rem;
  margin: 0;
}

.sidebar-section-label {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.69rem;
  letter-spacing: 0.08em;
  font-weight: 600;
  text-transform: uppercase;
  padding: 1.1rem 1.25rem 0.4rem;
}

.sidebar-nav {
  padding: 0 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.62rem 0.75rem;
  border-radius: 9px;
  color: rgba(255, 255, 255, 0.72);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background 0.15s ease, color 0.15s ease;
}

.sidebar-link i {
  font-size: 1.02rem;
  width: 1.1rem;
  text-align: center;
}

.sidebar-link:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

.sidebar-link.active {
  background: var(--blue);
  color: #fff;
}

.sidebar-footer {
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.9rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.sidebar-footer .avatar-sm {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--sky);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-family: "Lora", serif;
  flex-shrink: 0;
}

.sidebar-footer-name {
  color: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0;
}
.sidebar-footer-role {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.74rem;
  margin: 0;
}

/* ---------- Main area ---------- */
.main-wrap {
  margin-left: var(--sidebar-w);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.topbar {
  background: #fff;
  border-bottom: 1px solid var(--line);
  padding: 1.1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.topbar h1 {
  font-family: "Lora", serif;
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0;
  color: var(--ink);
}

.topbar p {
  margin: 0;
  color: var(--muted);
  font-size: 0.85rem;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  color: var(--ink);
}

.icon-btn .dot {
  position: absolute;
  top: 9px;
  right: 10px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--sky);
}

.topbar-user {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.3rem 0.5rem 0.3rem 0.3rem;
  border-radius: 10px;
  cursor: pointer;
}

.topbar-user:hover {
  background: var(--bg-soft);
}

.avatar-chip {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--navy);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-family: "Lora", serif;
}

.topbar-user-name {
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.2;
}
.topbar-user-sub {
  font-size: 0.74rem;
  color: var(--muted);
  margin: 0;
}

/* ---------- Content ---------- */
.content {
  padding: 1.75rem 2rem 3rem;
  flex: 1;
}

.eyebrow {
  color: var(--blue);
  font-weight: 700;
  font-size: 0.74rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.page-title {
  font-family: "Lora", serif;
  font-size: 2.1rem;
  font-weight: 600;
  margin: 0.2rem 0 0.25rem;
  color: var(--ink);
}

.page-sub {
  color: var(--muted);
  font-size: 0.92rem;
}

.btn-brand {
  background: var(--blue);
  border: 1px solid var(--blue);
  color: #fff;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 0.6rem 1.15rem;
  border-radius: 9px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-brand:hover {
  background: var(--navy);
  border-color: var(--navy);
  color: #fff;
}
.btn-brand:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.btn-outline-brand {
  background: var(--blue-light);
  border: 1px solid var(--blue-light);
  color: var(--blue);
  font-weight: 600;
  font-size: 0.85rem;
  padding: 0.55rem 1.05rem;
  border-radius: 9px;
}

.btn-outline-brand:hover {
  background: var(--sky);
  border-color: var(--sky);
  color: #fff;
}

.card-panel {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 1.6rem;
}

.card-panel h2 {
  font-size: 1.02rem;
  font-weight: 700;
  margin: 0 0 0.2rem;
}

.card-panel .panel-desc {
  color: var(--muted);
  font-size: 0.84rem;
  margin-bottom: 1.4rem;
}

.profile-avatar {
  width: 108px;
  height: 108px;
  border-radius: 50%;
  background: var(--blue-light);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.profile-avatar-inner {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: var(--blue);
  color: #fff;
  font-family: "Lora", serif;
  font-weight: 700;
  font-size: 2.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-name {
  font-family: "Lora", serif;
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 0.1rem;
}

.profile-role {
  text-align: center;
  color: var(--blue);
  font-weight: 600;
  font-size: 0.85rem;
  margin-bottom: 1.2rem;
}

.profile-hotel {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--muted);
  font-size: 0.85rem;
  border-top: 1px solid var(--line);
  padding-top: 1.1rem;
}

.form-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 0.4rem;
}

.form-control,
.form-select {
  border: 1px solid var(--line);
  border-radius: 9px;
  padding: 0.62rem 0.85rem;
  font-size: 0.88rem;
  background: #fff;
}

.form-control:focus,
.form-select:focus {
  border-color: var(--sky);
  box-shadow: 0 0 0 0.2rem var(--blue-light);
}

.security-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.security-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: var(--blue-light);
  color: var(--blue);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.05rem;
  flex-shrink: 0;
}

.security-title {
  font-weight: 700;
  font-size: 0.9rem;
  margin: 0;
}
.security-sub {
  color: var(--muted);
  font-size: 0.8rem;
  margin: 0;
}
.btn-forgot {
  border: none;
  background: transparent;
  color: var(--blue);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  padding: 8px 10px;
  transition: 0.2s;
}

.btn-forgot:hover {
  color: var(--navy);
  text-decoration: underline;
}

.btn-outline-brand {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 9px 16px;

  border: 1px solid var(--blue);
  border-radius: 8px;

  background: white;
  color: var(--blue);

  font-size: 13px;
  font-weight: 700;

  text-decoration: none;

  transition: 0.2s;
}

.btn-outline-brand:hover {
  background: var(--blue);
  color: white;
}

@media (max-width: 991.98px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.2s ease;
    z-index: 1050;
  }
  .sidebar.show {
    transform: translateX(0);
  }
  .main-wrap {
    margin-left: 0;
  }
}
</style>