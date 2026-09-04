<template>
  <div>
    <!-- NAVBAR -->
    <NavbarView />

    <!-- HERO -->
    <section class="hero pb-0 profile-hero">
      <div class="eyebrow"></div>
      <h1></h1>
      <p>Manage your bookings, favorites, and account details.</p>
    </section>

    <!-- PROFILE CARD -->
    <div class=" container search-card profile-card py-5 w-100 mb-5">
      <div class="row g-4">

        <!-- LEFT: AVATAR & QUICK INFO -->
        <div class="col-lg-4 profile-side">
          <div class="profile-avatar-wrap">
            <div class="profile-avatar">{{ user.initials }}</div>
            <button class="avatar-edit-btn" title="Change photo">📷</button>
          </div>

          <div class="profile-name">{{ user.name }}</div>
          <div class="profile-email">{{ user.email }}</div>

          <span class="member-badge">{{ user.membership }} Member</span>

          <hr class="profile-divider">

          <div class="profile-stat-row">
            <div class="profile-stat">
              <div class="stat-number">{{ user.totalBookings }}</div>
              <div class="stat-label">Bookings</div>
            </div>
            <div class="profile-stat">
              <div class="stat-number">{{ favorites.length }}</div>
              <div class="stat-label">Favorites</div>
            </div>
            <div class="profile-stat">
              <div class="stat-number">{{ user.reviewsWritten }}</div>
              <div class="stat-label">Reviews</div>
            </div>
          </div>
        </div>

        <!-- RIGHT: TABS -->
        <div class="col-lg-8">
          <div class="profile-tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              class="profile-tab"
              :class="{ active: activeTab === tab.id }"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>

          <!-- TAB: BOOKINGS -->
          <div v-if="activeTab === 'bookings'" class="tab-panel">
            <div class="booking-row" v-for="b in bookings" :key="b.id">
              <img :src="b.img" :alt="b.hotel" class="booking-thumb">

              <div class="flex-grow-1">
                <div class="stay-name">{{ b.hotel }}</div>
                <div class="stay-loc">📍 {{ b.location }}</div>
                <div class="booking-dates">{{ b.checkin }} → {{ b.checkout }}</div>
              </div>

              <div class="text-end">
                <span class="status-badge" :class="b.status.toLowerCase()">{{ b.status }}</span>
                <div class="price-now mt-1">${{ b.total }}</div>
              </div>
            </div>

            <div v-if="!bookings.length" class="empty-state">
              You have no bookings yet.
            </div>
          </div>

          <!-- TAB: FAVORITES -->
          <div v-if="activeTab === 'favorites'" class="tab-panel">
            <div class="row g-3">
              <div class="col-sm-6" v-for="f in favorites" :key="f.name">
                <div class="fav-mini-card">
                  <img :src="f.img" :alt="f.name">
                  <div class="p-2">
                    <div class="stay-name" style="font-size: 0.92rem;">{{ f.name }}</div>
                    <div class="stay-loc">📍 {{ f.location }}</div>
                    <div class="price-now" style="font-size: 1rem;">${{ f.price }}<span class="price-unit">/night</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="!favorites.length" class="empty-state">
              You haven't saved any stays yet.
            </div>
          </div>

          <!-- TAB: SETTINGS -->
          <div v-if="activeTab === 'settings'" class="tab-panel">
            <div class="row g-3">
              <div class="col-md-6 search-field">
                <label>Full name</label>
                <input type="text" class="form-control" v-model="user.name">
              </div>

              <div class="col-md-6 search-field">
                <label>Email</label>
                <input type="email" class="form-control" v-model="user.email">
              </div>

              <div class="col-md-6 search-field">
                <label>Phone</label>
                <input type="tel" class="form-control" v-model="user.phone">
              </div>

              <div class="col-md-6 search-field">
                <label>Country</label>
                <select class="form-select" v-model="user.country">
                  <option>Cambodia</option>
                  <option>Thailand</option>
                  <option>Vietnam</option>
                  <option>Other</option>
                </select>
              </div>

              <div class="col-12">
                <button class="btn btn-primary-brand" @click="saveSettings">
                  {{ saved ? 'Saved ✓' : 'Save Changes' }}
                </button>
              </div>
            </div>

            <hr class="profile-divider">

            <h6 class="fw-bold" style="color: var(--navy);">Password</h6>
            <div class="row g-3">
              <div class="col-md-6 search-field">
                <label>New password</label>
                <input type="password" class="form-control" v-model="password.new" placeholder="••••••••">
              </div>

              <div class="col-md-6 search-field">
                <label>Confirm password</label>
                <input type="password" class="form-control" v-model="password.confirm" placeholder="••••••••">
              </div>

              <div class="col-12">
                <button class="btn btn-outline-brand">Update Password</button>
              </div>
            </div>

            <hr class="profile-divider">

            <div class="danger-zone">
              <div>
                <div class="fw-semibold" style="color: var(--navy);">Delete account</div>
                <div class="stay-loc mb-0">This will permanently remove your account and data.</div>
              </div>
              <button class="btn btn-outline-danger btn-sm">Delete</button>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <FooterView />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import NavbarView from '@/components/layout/customer/NavbarView.vue'
import FooterView from '@/components/layout/customer/FooterView.vue'

const activeTab = ref('bookings')

const tabs = ref([
  { id: 'bookings', label: 'My Bookings' },
  { id: 'favorites', label: 'Favorites' },
  { id: 'settings', label: 'Settings' }
])

const user = reactive({
  name: 'Sokha Chan',
  email: 'sokha.chan@email.com',
  phone: '+855 12 345 678',
  country: 'Cambodia',
  initials: 'S',
  membership: 'Gold',
  totalBookings: 6,
  reviewsWritten: 3
})

const password = reactive({
  new: '',
  confirm: ''
})

const saved = ref(false)
function saveSettings() {
  // Replace with a real API call, e.g. axios.put('/api/profile', { ...user })
  saved.value = true
  setTimeout(() => (saved.value = false), 2000)
}

const bookings = ref([
  {
    id: 1,
    hotel: 'Riverside Heritage Hotel',
    location: 'Phnom Penh, Cambodia',
    checkin: 'Sep 12, 2026',
    checkout: 'Sep 15, 2026',
    status: 'Upcoming',
    total: 123,
    img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 2,
    hotel: 'Kampot Riverside Lodge',
    location: 'Kampot, Cambodia',
    checkin: 'Jul 3, 2026',
    checkout: 'Jul 6, 2026',
    status: 'Completed',
    total: 150,
    img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 3,
    hotel: 'Temple Grove Boutique',
    location: 'Siem Reap, Cambodia',
    checkin: 'May 20, 2026',
    checkout: 'May 22, 2026',
    status: 'Cancelled',
    total: 120,
    img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=200&auto=format&fit=crop'
  }
])

const favorites = ref([
  {
    name: 'Old Market Homestay',
    location: 'Battambang, Cambodia',
    price: 22,
    img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=400&auto=format&fit=crop'
  },
  {
    name: 'Kep Cliffside Villas',
    location: 'Kep, Cambodia',
    price: 42,
    img: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=400&auto=format&fit=crop'
  }
])
</script>

<style scoped>
.profile-hero {
  padding-bottom: 0;
}

.profile-card {
  padding: 1.6rem;
  width: 500px;
}

.profile-side {
  border-right: 1px solid var(--line);
  text-align: center;
  padding-right: 1.5rem;
}

.profile-avatar-wrap {
  position: relative;
  width: 84px;
  height: 84px;
  margin: 0 auto 0.9rem;
}

.profile-avatar {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: var(--blue);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: 700;
}

.avatar-edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #fff;
  background: var(--navy);
  color: #fff;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-name {
  font-weight: 700;
  color: var(--navy);
  font-size: 1.05rem;
}

.profile-email {
  font-size: 0.85rem;
  color: var(--muted);
  margin-bottom: 0.7rem;
}

.member-badge {
  display: inline-block;
  background: var(--blue-light);
  color: var(--blue);
  font-weight: 600;
  font-size: 0.75rem;
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
}

.profile-divider {
  border-color: var(--line);
  margin: 1.2rem 0;
}

.profile-stat-row {
  display: flex;
  justify-content: space-around;
}

.profile-stat .stat-number {
  font-weight: 700;
  color: var(--navy);
  font-size: 1.2rem;
}

.profile-stat .stat-label {
  font-size: 0.72rem;
  color: var(--muted);
}

/* TABS */
.profile-tabs {
  display: flex;
  gap: 0.4rem;
  border-bottom: 1px solid var(--line);
  margin-bottom: 1.4rem;
  flex-wrap: wrap;
}

.profile-tab {
  background: none;
  border: none;
  padding: 0.6rem 0.2rem;
  margin-right: 1.2rem;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--muted);
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.profile-tab:hover {
  color: var(--blue);
}

.profile-tab.active {
  color: var(--blue);
  border-bottom-color: var(--blue);
}

/* BOOKINGS TAB */
.booking-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 0.8rem;
  margin-bottom: 0.9rem;
}

.booking-thumb {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.booking-dates {
  font-size: 0.8rem;
  color: var(--muted);
  margin-top: 0.2rem;
}

.status-badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.22rem 0.6rem;
  border-radius: 999px;
}

.status-badge.upcoming {
  background: var(--blue-light);
  color: var(--blue);
}

.status-badge.completed {
  background: #EEF2F0;
  color: var(--muted);
}

.status-badge.cancelled {
  background: #FBEAEC;
  color: #D65A6A;
}

/* FAVORITES TAB */
.fav-mini-card {
  border: 1px solid var(--line);
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
}

.fav-mini-card img {
  width: 100%;
  height: 110px;
  object-fit: cover;
}

/* SETTINGS TAB */
.danger-zone {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #F3D6DA;
  background: #FFF7F8;
  border-radius: 10px;
  padding: 1rem;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.empty-state {
  text-align: center;
  color: var(--muted);
  padding: 2rem 0;
  font-size: 0.9rem;
}

@media (max-width: 991px) {
  .profile-side {
    border-right: none;
    border-bottom: 1px solid var(--line);
    padding-right: 0;
    padding-bottom: 1.4rem;
    margin-bottom: 1.4rem;
  }
}
</style>