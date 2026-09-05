<template>
  <aside id="sidebar" :class="{ collapsed: sidebarCollapsed }">
    <!-- Fixed Header -->
    <div class="brand-box">
      <div class="brand-logo">M</div>
      <div class="brand-text">
        <div class="brand-title">Mekong Hotel</div>
        <div class="brand-sub">Manager Portal</div>
      </div>
    </div>

    <!-- Toggle Button -->
    <button class="sidebar-toggle" @click="sidebarCollapsed = !sidebarCollapsed" type="button">
      <i :class="sidebarCollapsed ? 'bi bi-chevron-right' : 'bi bi-chevron-left'"></i>
    </button>

    <!-- Scrollable Middle Content -->
    <div class="sidebar-content">
      <div class="nav-section-label">OVERVIEW</div>
      <RouterLink to="/manager/dashboard" class="sidebar-link" active-class="active">
        <i class="bi bi-grid-1x2-fill"></i>
        <span class="link-text">Dashboard</span>
      </RouterLink>

      <div class="nav-section-label">PROPERTY SETUP</div>
      <RouterLink to="/manager/profile" class="sidebar-link" active-class="active">
        <i class="bi bi-person"></i>
        <span class="link-text">Profile</span>
      </RouterLink>
      <RouterLink to="/manager/hotel-image" class="sidebar-link" active-class="active">
        <i class="bi bi-images"></i>
        <span class="link-text">Hotel Images</span>
      </RouterLink>

      <div class="nav-section-label">ROOMS</div>
      <RouterLink to="/manager/room" class="sidebar-link" active-class="active">
        <i class="bi bi-door-closed"></i>
        <span class="link-text">Rooms</span>
      </RouterLink>
      <RouterLink to="/manager/room-type" class="sidebar-link" active-class="active">
        <i class="bi bi-grid-3x3-gap"></i>
        <span class="link-text">Room Types</span>
      </RouterLink>
      <RouterLink to="/manager/room-image" class="sidebar-link" active-class="active">
        <i class="bi bi-image"></i>
        <span class="link-text">Room Images</span>
      </RouterLink>
      <RouterLink to="/manager/amenity" class="sidebar-link" active-class="active">
        <i class="bi bi-stars"></i>
        <span class="link-text">Amenities</span>
      </RouterLink>
      <RouterLink to="/manager/price" class="sidebar-link" active-class="active">
        <i class="bi bi-tag"></i>
        <span class="link-text">Pricing</span>
      </RouterLink>

      <div class="nav-section-label">BOOKINGS</div>
      <RouterLink to="/manager/booking" class="sidebar-link" active-class="active">
        <i class="bi bi-calendar-check"></i>
        <span class="link-text">Booking</span>
      </RouterLink>

      <div class="nav-section-label">Insights</div>
      <RouterLink to="/manager/revenue" class="sidebar-link" active-class="active">
        <i class="bi bi-graph-up-arrow"></i>
        <span class="link-text">Revenue</span>
      </RouterLink>
      <RouterLink to="/manager/occupancy" class="sidebar-link" active-class="active">
        <i class="bi bi-pie-chart"></i>
        <span class="link-text">Occupancy</span>
      </RouterLink>
      <RouterLink to="/manager/booking-reports" class="sidebar-link" active-class="active">
        <i class="bi bi-file-earmark-bar-graph"></i>
        <span class="link-text">Booking Reports</span>
      </RouterLink>
      <RouterLink to="/manager/revenue-reports" class="sidebar-link" active-class="active">
        <i class="bi bi-file-earmark-text"></i>
        <span class="link-text">Revenue Reports</span>
      </RouterLink>
    </div>

    <div class="sidebar-footer">
      <div class="sidebar-user">
        <div class="avatar-circle">M</div>
        <div class="flex-grow-1 link-text">
          <div class="name">Sokha Manager</div>
          <div class="role">Hotel Manager</div>
        </div>
        <i class="bi bi-chevron-right link-text" style="color:#9fb6b0;"></i>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'

const sidebarCollapsed = ref(false)
</script>