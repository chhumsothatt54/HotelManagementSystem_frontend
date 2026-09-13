<template>
  <aside
    id="sidebar"
    :class="{ collapsed: sidebarCollapsed }"
  >
    <!-- Fixed Header -->
    <div class="brand-box">
      <div class="brand-logo">
        {{ hotelInitial }}
      </div>

      <div class="brand-text">
        <div class="brand-title">
          {{ hotelName }}
        </div>

        <div class="brand-sub">
          Manager Portal
        </div>
      </div>
    </div>

    <!-- Toggle Button -->
    <button
      class="sidebar-toggle"
      @click="sidebarCollapsed = !sidebarCollapsed"
      type="button"
    >
      <i
        :class="
          sidebarCollapsed
            ? 'bi bi-chevron-right'
            : 'bi bi-chevron-left'
        "
      ></i>
    </button>

    <!-- Scrollable Middle Content -->
    <div class="sidebar-content">

      <!-- OVERVIEW -->
      <div class="nav-section-label">
        OVERVIEW
      </div>

      <RouterLink
        to="/manager/dashboard"
        class="sidebar-link"
        active-class="active"
      >
        <i class="bi bi-grid-1x2-fill"></i>
        <span class="link-text">
          Dashboard
        </span>
      </RouterLink>


      <!-- PROPERTY SETUP -->
      <div class="nav-section-label">
        PROPERTY SETUP
      </div>

      <RouterLink
        to="/manager/profile"
        class="sidebar-link"
        active-class="active"
      >
        <i class="bi bi-person"></i>
        <span class="link-text">
          Profile
        </span>
      </RouterLink>

      <RouterLink
        to="/manager/hotel-image"
        class="sidebar-link"
        active-class="active"
      >
        <i class="bi bi-images"></i>
        <span class="link-text">
          Hotel Images
        </span>
      </RouterLink>


      <!-- ROOMS & PRICING -->
      <div class="nav-section-label">
        ROOMS &amp; PRICING
      </div>

      <RouterLink
        to="/manager/room"
        class="sidebar-link"
        active-class="active"
      >
        <i class="bi bi-door-closed"></i>
        <span class="link-text">
          Rooms
        </span>
      </RouterLink>

      <RouterLink
        to="/manager/room-type"
        class="sidebar-link"
        active-class="active"
      >
        <i class="bi bi-grid-3x3-gap"></i>
        <span class="link-text">
          Room Types
        </span>
      </RouterLink>

      <RouterLink
        to="/manager/room-image"
        class="sidebar-link"
        active-class="active"
      >
        <i class="bi bi-image"></i>
        <span class="link-text">
          Room Images
        </span>
      </RouterLink>

      <RouterLink
        to="/manager/price"
        class="sidebar-link"
        active-class="active"
      >
        <i class="bi bi-tag"></i>
        <span class="link-text">
          Pricing
        </span>
      </RouterLink>


      <!-- AMENITIES -->
      <div class="nav-section-label">
        AMENITIES
      </div>

      <RouterLink
        to="/manager/amenity"
        class="sidebar-link"
        active-class="active"
      >
        <i class="bi bi-stars"></i>
        <span class="link-text">
          Amenities
        </span>
      </RouterLink>

      <RouterLink
        to="/manager/connect-amenity"
        class="sidebar-link"
        active-class="active"
      >
        <i class="bi bi-patch-plus-fill"></i>
        <span class="link-text">
          Connect Amenities
        </span>
      </RouterLink>


      <!-- BOOKING -->
      <div class="nav-section-label">
        BOOKING
      </div>

      <RouterLink
        to="/manager/booking"
        class="sidebar-link"
        active-class="active"
      >
        <i class="bi bi-calendar-check"></i>
        <span class="link-text">
          Booking
        </span>
      </RouterLink>


      <!-- INSIGHTS -->
      <div class="nav-section-label">
        INSIGHTS
      </div>

      <RouterLink
        to="/manager/revenue"
        class="sidebar-link"
        active-class="active"
      >
        <i class="bi bi-graph-up-arrow"></i>
        <span class="link-text">
          Revenue
        </span>
      </RouterLink>

      <RouterLink
        to="/manager/occupancy"
        class="sidebar-link"
        active-class="active"
      >
        <i class="bi bi-pie-chart"></i>
        <span class="link-text">
          Occupancy
        </span>
      </RouterLink>

      <RouterLink
        to="/manager/booking-reports"
        class="sidebar-link"
        active-class="active"
      >
        <i class="bi bi-file-earmark-bar-graph"></i>
        <span class="link-text">
          Booking Reports
        </span>
      </RouterLink>

      <RouterLink
        to="/manager/revenue-reports"
        class="sidebar-link"
        active-class="active"
      >
        <i class="bi bi-file-earmark-text"></i>
        <span class="link-text">
          Revenue Reports
        </span>
      </RouterLink>

    </div>


    <!-- Footer -->
    <div class="sidebar-footer">
  <RouterLink
    to="/manager/profile"
    class="sidebar-user"
  >
    <div class="avatar-circle">
      {{ managerInitial }}
    </div>

    <div class="flex-grow-1 link-text">
      <div class="name">
        {{ managerName }}
      </div>

      <div class="role">
        {{ managerRole }}
      </div>
    </div>

    <i
      class="bi bi-chevron-right link-text"
    ></i>
  </RouterLink>
</div>

  </aside>
</template>


<script setup>
import {
  ref,
  computed,
  onMounted
} from 'vue'

import { useManagerStore } from '@/stores/manager'


/*
|--------------------------------------------------------------------------
| Sidebar State
|--------------------------------------------------------------------------
*/

const sidebarCollapsed = ref(false)


/*
|--------------------------------------------------------------------------
| Manager Store
|--------------------------------------------------------------------------
*/

const managerStore = useManagerStore()


/*
|--------------------------------------------------------------------------
| Hotel
|--------------------------------------------------------------------------
*/

const hotel = computed(() => {
  return managerStore.hotel || {}
})

const hotelName = computed(() => {
  return hotel.value?.name || 'My Hotel'
})

const hotelInitial = computed(() => {
  return hotelName.value
    .charAt(0)
    .toUpperCase()
})


/*
|--------------------------------------------------------------------------
| Manager Profile
|--------------------------------------------------------------------------
*/

const profile = computed(() => {
  return managerStore.profile || {}
})

const managerName = computed(() => {
  return (
    profile.value?.name ||
    profile.value?.full_name ||
    'Manager'
  )
})

const managerRole = computed(() => {
  return profile.value?.role || 'Hotel Manager'
})

const managerInitial = computed(() => {
  return managerName.value
    .charAt(0)
    .toUpperCase()
})


/*
|--------------------------------------------------------------------------
| Load Sidebar Data
|--------------------------------------------------------------------------
*/

async function loadSidebarData() {
  try {
    await Promise.all([
      managerStore.getMyHotel(),
      managerStore.getProfile()
    ])
  } catch (error) {
    console.error(
      'Failed to load sidebar data:',
      error
    )
  }
}


/*
|--------------------------------------------------------------------------
| Mounted
|--------------------------------------------------------------------------
*/

onMounted(() => {
  loadSidebarData()
})
</script>
<style scoped>
.sidebar-user {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  text-decoration: none;
  cursor: pointer;
}

.sidebar-user:hover {
  text-decoration: none;
}

.sidebar-user .name {
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
}

.sidebar-user .role {
  color: #9fb6b0;
  font-size: 12px;
  margin-top: 2px;
}

.sidebar-user:hover .name {
  color: #ffffff;
}

.avatar-circle {
  width: 38px;
  height: 38px;
  min-width: 38px;
  border-radius: 50%;
  background: var(--blue);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}
</style>