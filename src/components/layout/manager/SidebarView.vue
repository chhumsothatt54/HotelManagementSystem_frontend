<template>
  <aside
    id="sidebar"
    :class="{ collapsed: props.sidebarCollapsed }"
  >
    <!-- ==============================
         BRAND
    =============================== -->

    <RouterLink to="/" class="brand-box">
      <div class="brand-logo">
        <img
          src="@/assets/image/hotel_logo.jpg"
          alt="AngkorStay"
          class="hotel-logo-image"
        />
      </div>

      <div class="brand-text">
        <div class="brand-title">
          {{ hotelName }}
        </div>

        <div class="brand-sub">
          Manager Portal
        </div>
      </div>
    </RouterLink>

    <!-- ==============================
         TOGGLE BUTTON
    =============================== -->

    <button
      class="sidebar-toggle"
      @click="emit('toggle-sidebar')"
      type="button"
      :aria-label="
        props.sidebarCollapsed
          ? 'Expand sidebar'
          : 'Collapse sidebar'
      "
    >
      <i
        :class="
          props.sidebarCollapsed
            ? 'bi bi-chevron-right'
            : 'bi bi-chevron-left'
        "
      ></i>
    </button>

    <!-- ==============================
         SCROLLABLE CONTENT
    =============================== -->

    <div class="sidebar-content">

      <!-- ==============================
           OVERVIEW
      =============================== -->

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

      <RouterLink
        to="/manager/manager-hotel"
        class="sidebar-link"
        active-class="active"
      >
        <i class="bi bi-person-vcard"></i>

        <span class="link-text">
          Manage Hotel
        </span>
      </RouterLink>

      <!-- ==============================
           PROPERTY SETUP
      =============================== -->

      <div class="nav-section-label">
        PROPERTY SETUP
      </div>

      <!-- Profile intentionally hidden -->

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

      <!-- ==============================
           ROOMS & PRICING
      =============================== -->

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

      <!-- ==============================
           AMENITIES
      =============================== -->

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

      <!-- ==============================
           BOOKING
      =============================== -->

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

      <!-- ==============================
           INSIGHTS
      =============================== -->

      <div class="nav-section-label">
        INSIGHTS
      </div>

      <RouterLink
        to="/manager/BookingReport"
        class="sidebar-link"
        active-class="active"
      >
        <i class="bi bi-file-earmark-bar-graph"></i>

        <span class="link-text">
          Booking Reports
        </span>
      </RouterLink>

      <RouterLink
        to="/manager/RevenueReport"
        class="sidebar-link"
        active-class="active"
      >
        <i class="bi bi-file-earmark-text"></i>

        <span class="link-text">
          Revenue Reports
        </span>
      </RouterLink>
      <RouterLink
        to="/manager/Notifications"
        class="sidebar-link"
        active-class="active"
      >
        <i class="bi bi-bell"></i>

        <span class="link-text">
          Notification
        </span>
      </RouterLink>
    </div>

    <!-- ==============================
         FOOTER / MANAGER PROFILE
    =============================== -->

    <div class="sidebar-footer">
      <RouterLink
        to="/manager/profile"
        class="sidebar-user"
      >
        <!-- Avatar -->

        <div class="avatar-circle">
          <img
            v-if="avatarUrl"
            :src="avatarUrl"
            alt="Manager profile"
            class="sidebar-avatar-image"
          />

          <span v-else>
            {{ managerInitial }}
          </span>
        </div>

        <!-- Manager information -->

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
import { computed, onMounted } from "vue";
import { useManagerStore } from "@/stores/manager";

/*
|--------------------------------------------------------------------------
| Props
|--------------------------------------------------------------------------
*/

const props = defineProps({
  sidebarCollapsed: {
    type: Boolean,
    default: false,
  },
});

/*
|--------------------------------------------------------------------------
| Emits
|--------------------------------------------------------------------------
*/

const emit = defineEmits([
  "toggle-sidebar",
]);

/*
|--------------------------------------------------------------------------
| Manager Store
|--------------------------------------------------------------------------
*/

const managerStore = useManagerStore();

/*
|--------------------------------------------------------------------------
| Hotel
|--------------------------------------------------------------------------
*/

const hotel = computed(() => {
  return managerStore.hotel || {};
});

const hotelName = computed(() => {
  return hotel.value?.name || "My Hotel";
});

const hotelImageUrl = computed(() => {
  const images = managerStore.images || [];

  if (!images.length) {
    return "";
  }

  const firstImage = images[0];

  if (typeof firstImage === "string") {
    return firstImage;
  }

  return firstImage?.url || "";
});

const hotelInitial = computed(() => {
  return hotelName.value
    .charAt(0)
    .toUpperCase();
});

/*
|--------------------------------------------------------------------------
| Manager Profile
|--------------------------------------------------------------------------
*/

const profile = computed(() => {
  return managerStore.profile || {};
});

const managerName = computed(() => {
  return (
    profile.value?.name ||
    profile.value?.full_name ||
    "Manager"
  );
});

const managerRole = computed(() => {
  return (
    profile.value?.role ||
    "Hotel Manager"
  );
});

const managerInitial = computed(() => {
  return managerName.value
    .charAt(0)
    .toUpperCase();
});

/*
|--------------------------------------------------------------------------
| Avatar
|--------------------------------------------------------------------------
*/

const avatarUrl = computed(() => {
  if (!profile.value?.avatar) {
    return "";
  }

  if (
    profile.value.avatar.startsWith("http")
  ) {
    return profile.value.avatar;
  }

  return `http://127.0.0.1:8000/${profile.value.avatar}`;
});

/*
|--------------------------------------------------------------------------
| Load Sidebar Data
|--------------------------------------------------------------------------
*/

async function loadSidebarData() {
  try {
    await Promise.all([
      managerStore.getMyHotel(),
      managerStore.getProfile(),
      managerStore.getHotelImages(),
    ]);
  } catch (error) {
    console.error(
      "Failed to load sidebar data:",
      error
    );
  }
}

/*
|--------------------------------------------------------------------------
| Mounted
|--------------------------------------------------------------------------
*/

onMounted(() => {
  loadSidebarData();
});
</script>

<style scoped>
/*
|--------------------------------------------------------------------------
| Brand
|--------------------------------------------------------------------------
*/

.brand-box {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.brand-box:hover {
  text-decoration: none;
  color: inherit;
}

.brand-logo {
  width: 42px;
  height: 42px;
  min-width: 42px;

  border-radius: 10px;

  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;
}

.hotel-logo-image {
  width: 100%;
  height: 100%;

  object-fit: cover;

  display: block;
}

/*
|--------------------------------------------------------------------------
| Avatar
|--------------------------------------------------------------------------
*/

.avatar-circle {
  width: 38px;
  height: 38px;
  min-width: 38px;

  border-radius: 50%;

  overflow: hidden;

  background: var(--accent);

  color: var(--bg-card, #ffffff);

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 600;
}

.sidebar-avatar-image {
  width: 100%;
  height: 100%;

  object-fit: cover;

  display: block;
}

/*
|--------------------------------------------------------------------------
| Sidebar User
|--------------------------------------------------------------------------
*/

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
  color: var(--bg-card, #ffffff);

  font-size: 14px;

  font-weight: 600;
}

.sidebar-user .role {
  color: #9fb6b0;

  font-size: 12px;

  margin-top: 2px;
}

.sidebar-user:hover .name {
  color: var(--bg-card, #ffffff);
}
</style>