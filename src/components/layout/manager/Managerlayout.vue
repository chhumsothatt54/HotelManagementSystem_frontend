<template>
  <div class="manager-layout">

    <!-- EXISTING SIDEBAR -->
    <ManagerSidebar />

    <!-- RIGHT SIDE -->
    <div class="manager-main">

      <!-- REUSABLE TOPBAR -->
      <ManagerTopBar
        :title="pageTitle"
        :subtitle="pageSubtitle"
      />

      <!-- PAGE CONTENT -->
      <main class="manager-content">
        <router-view />
      </main>

    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import ManagerSidebar from '@/components/manager/ManagerSidebar.vue'
import ManagerTopBar from '@/components/manager/ManagerTopBar.vue'

const route = useRoute()

const pageInfo = {
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Property performance overview'
  },

  manageHotel: {
    title: 'Manage Hotel',
    subtitle: 'Manage your property information'
  },

  hotelImages: {
    title: 'Hotel Images',
    subtitle: 'Manage your property images'
  },

  rooms: {
    title: 'Rooms',
    subtitle: 'Manage your hotel rooms'
  },

  roomTypes: {
    title: 'Room Types',
    subtitle: 'Manage room types and pricing'
  },

  roomImages: {
    title: 'Room Images',
    subtitle: 'Manage your room images'
  },

  pricing: {
    title: 'Pricing',
    subtitle: 'Manage room pricing'
  },

  amenities: {
    title: 'Amenities',
    subtitle: 'Manage hotel amenities'
  },

  connectAmenities: {
    title: 'Connect Amenities',
    subtitle: 'Connect amenities to rooms'
  },

  bookings: {
    title: 'Bookings',
    subtitle: 'Manage your hotel bookings'
  },

  revenue: {
    title: 'Revenue',
    subtitle: 'Track your hotel revenue'
  },

  occupancy: {
    title: 'Occupancy',
    subtitle: 'Monitor room occupancy'
  },

  reports: {
    title: 'Booking Reports',
    subtitle: 'Reservation reports'
  }
}

const currentPage = computed(() => {
  return pageInfo[route.name] || {
    title: 'Manager Portal',
    subtitle: 'Hotel management'
  }
})

const pageTitle = computed(() => currentPage.value.title)

const pageSubtitle = computed(() => currentPage.value.subtitle)
</script>

<style scoped>
.manager-layout {
  display: flex;

  min-height: 100vh;

  background: var(--bg-soft, #f5f8f7);
}

.manager-main {
  flex: 1;

  min-width: 0;

  margin-left: 0;
}

.manager-content {
  padding: 28px 36px;

  min-height: calc(100vh - 105px);
}

@media (max-width: 768px) {

  .manager-content {
    padding: 20px 16px;
  }

}

[data-bs-theme="dark"] .manager-layout { background-color: #0f172a !important; }

</style>