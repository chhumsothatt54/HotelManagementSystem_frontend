<template>

  <!-- Top bar -->
  <div class="topbar bg-white">
    <div>
      <h1 class="page-title brand-serif">Profile</h1>
      <div class="page-subtitle">Property performance overview</div>
    </div>

    <div class="d-flex align-items-center gap-3">

      <div class="icon-btn">
        <i class="bi bi-bell"></i>
        <span class="dot"></span>
      </div>

      <div class="user-chip">

        <div class="avatar-circle">
          
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
      </div>

    </div>
  </div>


  <div class="page-content">

    <div class="panel-card">

      <!-- Header -->
      <div
        class="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4"
      >

        <div>
          <p class="eyebrow mb-1">Account</p>

          <h2 class="page-title">
            My Profile
          </h2>

          <p class="page-sub">
            Manage your personal information and account settings.
          </p>
        </div>

        <button
          type="button"
          class="btn-brand"
          @click="saveChanges"
        >
          <i class="bi bi-check-lg"></i>
          Save Changes
        </button>

      </div>


      <div class="row g-4">

        <!-- Avatar card -->
        <div class="col-12 col-lg-4">

          <div class="card-panel h-100">

            <div class="profile-avatar">
              <div class="profile-avatar-inner">
                {{ profileInitial }}
              </div>
            </div>

            <p class="profile-name">
              {{ fullName }}
            </p>

            <p class="profile-role">
              {{ profileRole }}
            </p>

            <div class="profile-hotel">
              <i class="bi bi-building"></i>
              {{ hotelName }}
            </div>

          </div>

        </div>


        <!-- Personal info card -->
        <div class="col-12 col-lg-8">

          <div class="card-panel h-100">

            <h2>
              Personal Information
            </h2>

            <p class="panel-desc">
              Update your account information.
            </p>


            <form @submit.prevent="saveChanges">

              <!-- First + Last Name -->
              <div class="row g-3 mb-3">

                <div class="col-md-6">

                  <label class="form-label">
                    First Name
                  </label>

                  <input
                    v-model="form.first_name"
                    type="text"
                    class="form-control"
                    placeholder="First Name"
                  />

                </div>


                <div class="col-md-6">

                  <label class="form-label">
                    Last Name
                  </label>

                  <input
                    v-model="form.last_name"
                    type="text"
                    class="form-control"
                    placeholder="Last Name"
                  />

                </div>

              </div>


              <!-- Email + Phone -->
              <div class="row g-3 mb-3">

                <div class="col-md-6">

                  <label class="form-label">
                    Email
                  </label>

                  <input
                    v-model="form.email"
                    type="email"
                    class="form-control"
                    placeholder="Email"
                  />

                </div>


                <div class="col-md-6">

                  <label class="form-label">
                    Phone
                  </label>

                  <input
                    v-model="form.phone"
                    type="text"
                    class="form-control"
                    placeholder="Phone"
                  />

                </div>

              </div>


              <!-- Role -->
              <div class="row g-3">

                <div class="col-md-6">

                  <label class="form-label">
                    Role
                  </label>

                  <input
                    v-model="form.role"
                    type="text"
                    class="form-control"
                    disabled
                  />

                </div>

              </div>

            </form>

          </div>

        </div>


        <!-- Security card -->
        <div class="col-12">

          <div class="card-panel">

            <h2>
              Security
            </h2>

            <p class="panel-desc">
              Manage your account security.
            </p>


            <div class="security-row">

              <div class="d-flex align-items-center gap-3">

                <div class="security-icon">
                  <i class="bi bi-lock-fill"></i>
                </div>

                <div>

                  <p class="security-title">
                    Password
                  </p>

                  <p class="security-sub">
                    Last updated recently
                  </p>

                </div>

              </div>


              <button
                type="button"
                class="btn-outline-brand"
                @click="changePassword"
              >
                Change Password
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>

</template>


<script setup>
import { computed, onMounted, reactive } from 'vue'
import { useManagerStore } from '@/stores/manager'

const managerStore = useManagerStore()

const profile = computed(() => managerStore.profile)

const form = reactive({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: ''
})

const fullName = computed(() => {
    if (!profile.value) {
        return 'Manager'
    }

    return `${profile.value.first_name} ${profile.value.last_name}`
})

const profileInitial = computed(() => {
    return profile.value?.first_name?.charAt(0).toUpperCase() || 'M'
})

const profileRole = computed(() => {
    return profile.value?.role || 'Hotel Manager'
})


// Load profile from API
async function loadProfile() {
    await managerStore.getProfile()

    if (!managerStore.profile) {
        return
    }

    form.first_name = managerStore.profile.first_name
    form.last_name = managerStore.profile.last_name
    form.email = managerStore.profile.email
    form.phone = managerStore.profile.phone
    form.role = managerStore.profile.role
}


// Save button
function saveChanges() {
    console.log('Profile data:', form)
}


// Change password
function changePassword() {
    console.log('Change password')
}


// Load when page opens
onMounted(() => {
    loadProfile()
})
</script>

<style scoped> 
.font-display {
    font-family: 'Lora', serif;
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
    gap: .75rem;
    padding: 1.4rem 1.25rem;
    border-bottom: 1px solid rgba(255,255,255,.08);
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
    font-family: 'Lora', serif;
    font-weight: 700;
    font-size: 1.15rem;
    flex-shrink: 0;
  }
 
  .brand-name {
    color: #fff;
    font-weight: 700;
    font-size: .95rem;
    line-height: 1.25;
    margin: 0;
  }
 
  .brand-sub {
    color: rgba(255,255,255,.55);
    font-size: .74rem;
    margin: 0;
  }
 
  .sidebar-section-label {
    color: rgba(255,255,255,.4);
    font-size: .69rem;
    letter-spacing: .08em;
    font-weight: 600;
    text-transform: uppercase;
    padding: 1.1rem 1.25rem .4rem;
  }
 
  .sidebar-nav {
    padding: 0 .75rem;
    display: flex;
    flex-direction: column;
    gap: .15rem;
  }
 
  .sidebar-link {
    display: flex;
    align-items: center;
    gap: .7rem;
    padding: .62rem .75rem;
    border-radius: 9px;
    color: rgba(255,255,255,.72);
    text-decoration: none;
    font-size: .875rem;
    font-weight: 500;
    transition: background .15s ease, color .15s ease;
  }
 
  .sidebar-link i { font-size: 1.02rem; width: 1.1rem; text-align: center; }
 
  .sidebar-link:hover {
    background: rgba(255,255,255,.06);
    color: #fff;
  }
 
  .sidebar-link.active {
    background: var(--blue);
    color: #fff;
  }
 
  .sidebar-footer {
    margin-top: auto;
    border-top: 1px solid rgba(255,255,255,.08);
    padding: .9rem 1rem;
    display: flex;
    align-items: center;
    gap: .7rem;
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
    font-family: 'Lora', serif;
    flex-shrink: 0;
  }
 
  .sidebar-footer-name { color: #fff; font-size: .85rem; font-weight: 600; margin: 0; }
  .sidebar-footer-role { color: rgba(255,255,255,.5); font-size: .74rem; margin: 0; }
 
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
    font-family: 'Lora', serif;
    font-size: 1.4rem;
    font-weight: 600;
    margin: 0;
    color: var(--ink);
  }
 
  .topbar p {
    margin: 0;
    color: var(--muted);
    font-size: .85rem;
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
    gap: .6rem;
    padding: .3rem .5rem .3rem .3rem;
    border-radius: 10px;
    cursor: pointer;
  }
 
  .topbar-user:hover { background: var(--bg-soft); }
 
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
    font-family: 'Lora', serif;
  }
 
  .topbar-user-name { font-size: .85rem; font-weight: 600; margin: 0; line-height: 1.2; }
  .topbar-user-sub { font-size: .74rem; color: var(--muted); margin: 0; }
 
  /* ---------- Content ---------- */
  .content {
    padding: 1.75rem 2rem 3rem;
    flex: 1;
  }
 
  .eyebrow {
    color: var(--blue);
    font-weight: 700;
    font-size: .74rem;
    letter-spacing: .06em;
    text-transform: uppercase;
  }
 
  .page-title {
    font-family: 'Lora', serif;
    font-size: 2.1rem;
    font-weight: 600;
    margin: .2rem 0 .25rem;
    color: var(--ink);
  }
 
  .page-sub {
    color: var(--muted);
    font-size: .92rem;
  }
 
  .btn-brand {
    background: var(--blue);
    border: 1px solid var(--blue);
    color: #fff;
    font-weight: 600;
    font-size: .875rem;
    padding: .6rem 1.15rem;
    border-radius: 9px;
    display: inline-flex;
    align-items: center;
    gap: .5rem;
  }
 
  .btn-brand:hover { background: var(--navy); border-color: var(--navy); color: #fff; }
 
  .btn-outline-brand {
    background: var(--blue-light);
    border: 1px solid var(--blue-light);
    color: var(--blue);
    font-weight: 600;
    font-size: .85rem;
    padding: .55rem 1.05rem;
    border-radius: 9px;
  }
 
  .btn-outline-brand:hover { background: var(--sky); border-color: var(--sky); color: #fff; }
 
  .card-panel {
    background: #fff;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    padding: 1.6rem;
  }
 
  .card-panel h2 {
    font-size: 1.02rem;
    font-weight: 700;
    margin: 0 0 .2rem;
  }
 
  .card-panel .panel-desc {
    color: var(--muted);
    font-size: .84rem;
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
    font-family: 'Lora', serif;
    font-weight: 700;
    font-size: 2.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
 
  .profile-name {
    font-family: 'Lora', serif;
    font-size: 1.25rem;
    font-weight: 600;
    text-align: center;
    margin-bottom: .1rem;
  }
 
  .profile-role {
    text-align: center;
    color: var(--blue);
    font-weight: 600;
    font-size: .85rem;
    margin-bottom: 1.2rem;
  }
 
  .profile-hotel {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .5rem;
    color: var(--muted);
    font-size: .85rem;
    border-top: 1px solid var(--line);
    padding-top: 1.1rem;
  }
 
  .form-label {
    font-size: .82rem;
    font-weight: 600;
    color: var(--ink);
    margin-bottom: .4rem;
  }
 
  .form-control, .form-select {
    border: 1px solid var(--line);
    border-radius: 9px;
    padding: .62rem .85rem;
    font-size: .88rem;
    background: #fff;
  }
 
  .form-control:focus, .form-select:focus {
    border-color: var(--sky);
    box-shadow: 0 0 0 .2rem var(--blue-light);
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
 
  .security-title { font-weight: 700; font-size: .9rem; margin: 0; }
  .security-sub { color: var(--muted); font-size: .8rem; margin: 0; }
 
  @media (max-width: 991.98px) {
    .sidebar { transform: translateX(-100%); transition: transform .2s ease; z-index: 1050; }
    .sidebar.show { transform: translateX(0); }
    .main-wrap { margin-left: 0; }
  }
</style>