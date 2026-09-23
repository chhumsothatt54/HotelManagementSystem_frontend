<template>
  <header class="manager-topbar">

    <!-- LEFT -->
    <div class="topbar-left">

      <div>
        

        <h1 class="topbar-title">
          {{ pageTitle }}
        </h1>

        <p class="topbar-subtitle">
          {{ pageSubtitle }}
        </p>
      </div>

    </div>

    <!-- RIGHT -->
    <div class="topbar-right">

      <!-- Date -->
      <div class="date-pill">
        <i class="bi bi-calendar3"></i>

        <span>
          {{ currentDate }}
        </span>
      </div>

      <!-- Notification -->
      <RouterLink
      to="/manager/Notifications"
        class="icon-btn"
        type="button"
        aria-label="Notifications"
      >
        <i class="bi bi-bell"></i>

        <span class="notification-dot"></span>
      </RouterLink>

      <!-- Manager -->
      <RouterLink
        to="/manager/profile"
        class="user-chip"
      >
        <div class="user-avatar">

          <img
            v-if="avatarUrl"
            :src="avatarUrl"
            alt="Manager profile"
          />

          <span v-else>
            {{ managerInitial }}
          </span>

        </div>

        <div class="user-info">
          <div class="user-name">
            {{ managerName }}
          </div>

          <div class="user-role">
            {{ managerRole }}
          </div>
        </div>

        <i class="bi bi-chevron-down user-arrow"></i>
      </RouterLink>

    </div>

  </header>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

import { useManagerStore } from "@/stores/manager";

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
*/

const route = useRoute();

/*
|--------------------------------------------------------------------------
| Manager Store
|--------------------------------------------------------------------------
*/

const managerStore = useManagerStore();

/*
|--------------------------------------------------------------------------
| Profile
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
| Page Title
|--------------------------------------------------------------------------
*/

const pageInfo = {
  "manager-dashboard": {
    title: "Dashboard",
    subtitle: "Overview of your hotel",
  },

  "manager-hotel": {
    title: "Manage Hotel",
    subtitle: "Manage your hotel information",
  },

  "manager-profile": {
    title: "Profile",
    subtitle: "Manage your account information",
  },

  "manager-hotel-image": {
    title: "Hotel Images",
    subtitle: "Manage your hotel photos",
  },

  "manager-room": {
    title: "Rooms",
    subtitle: "Manage hotel rooms",
  },

  "manager-room-type": {
    title: "Room Types",
    subtitle: "Manage your room types",
  },

  "manager-room-image": {
    title: "Room Images",
    subtitle: "Manage room photos",
  },

  "manager-amenity": {
    title: "Amenities",
    subtitle: "Manage hotel amenities",
  },

  "manager-connect-amenity": {
    title: "Connect Amenities",
    subtitle: "Assign amenities to rooms",
  },

  "manager-price": {
    title: "Pricing",
    subtitle: "Manage room pricing",
  },

  "manager-booking": {
    title: "Bookings",
    subtitle: "Manage hotel reservations",
  },

  "manager-revenue": {
    title: "Revenue",
    subtitle: "View hotel revenue",
  },

  "manager-occupancy": {
    title: "Occupancy",
    subtitle: "View room occupancy",
  },

  "manager-revenue-report": {
    title: "Revenue Reports",
    subtitle: "Analyze hotel revenue",
  },

  "manager-occupancy-report": {
    title: "Booking Reports",
    subtitle: "Analyze hotel bookings",
  },
};

const pageTitle = computed(() => {
  return (
    pageInfo[route.name]?.title ||
    "Manager Portal"
  );
});

const pageSubtitle = computed(() => {
  return (
    pageInfo[route.name]?.subtitle ||
    "Manage your hotel"
  );
});

/*
|--------------------------------------------------------------------------
| Current Date
|--------------------------------------------------------------------------
*/

const currentDate = computed(() => {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  ).format(new Date());
});
</script>

<style scoped>
/*
|--------------------------------------------------------------------------
| TOPBAR
|--------------------------------------------------------------------------
*/

.manager-topbar {
  min-height: 78px;

  padding: 18px 28px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 24px;

  background: var(--page-bg);

  position: sticky;
  top: 0;

  z-index: 100;

  border-bottom: 1px solid rgba(231, 234, 233, 0.8);
}

/*
|--------------------------------------------------------------------------
| LEFT
|--------------------------------------------------------------------------
*/

.topbar-left {
  min-width: 0;
}

.topbar-eyebrow {
  color: var(--accent);

  font-size: 0.68rem;

  font-weight: 700;

  letter-spacing: 0.1em;

  margin-bottom: 3px;
}

.topbar-title {
  margin: 0;

  color: #1c2624;

  font-family: Georgia, "Times New Roman", serif;

  font-size: 1.65rem;

  font-weight: 700;

  line-height: 1.2;
}

.topbar-subtitle {
  margin: 4px 0 0;

  color: var(--text-muted);

  font-size: 0.85rem;
}

/*
|--------------------------------------------------------------------------
| RIGHT
|--------------------------------------------------------------------------
*/

.topbar-right {
  display: flex;

  align-items: center;

  gap: 12px;

  flex-shrink: 0;
}

/*
|--------------------------------------------------------------------------
| DATE
|--------------------------------------------------------------------------
*/

.date-pill {
  display: flex;

  align-items: center;

  gap: 8px;

  padding: 9px 13px;

  background: #ffffff;

  border: 1px solid var(--card-border);

  border-radius: 10px;

  color: #394542;

  font-size: 0.82rem;

  font-weight: 600;

  white-space: nowrap;
}

.date-pill i {
  color: var(--accent);

  font-size: 0.9rem;
}

/*
|--------------------------------------------------------------------------
| NOTIFICATION
|--------------------------------------------------------------------------
*/

.icon-btn {
  position: relative;

  width: 40px;
  height: 40px;

  border-radius: 50%;

  border: 1px solid var(--card-border);

  background: #ffffff;

  color: #3a4644;

  display: flex;

  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition: all 0.2s ease;
}

.icon-btn:hover {
  background: var(--accent);

  color: #ffffff;

  border-color: var(--accent);

  transform: translateY(-1px);
}

.icon-btn i {
  font-size: 1rem;
}

.notification-dot {
  position: absolute;

  top: 8px;
  right: 8px;

  width: 7px;
  height: 7px;

  background: #e35d5d;

  border: 2px solid #ffffff;

  border-radius: 50%;
}

/*
|--------------------------------------------------------------------------
| USER CHIP
|--------------------------------------------------------------------------
*/

.user-chip {
  display: flex;

  align-items: center;

  gap: 9px;

  padding: 5px 8px;

  border-radius: 12px;

  text-decoration: none;

  color: inherit;

  transition: background 0.2s ease;
}

.user-chip:hover {
  background: #ffffff;

  text-decoration: none;

  color: inherit;
}

/*
|--------------------------------------------------------------------------
| USER AVATAR
|--------------------------------------------------------------------------
*/

.user-avatar {
  width: 40px;
  height: 40px;

  min-width: 40px;

  border-radius: 50%;

  overflow: hidden;

  background: var(--accent);

  color: #ffffff;

  display: flex;

  align-items: center;
  justify-content: center;

  font-size: 0.9rem;

  font-weight: 700;
}

.user-avatar img {
  width: 100%;
  height: 100%;

  object-fit: cover;

  display: block;
}

/*
|--------------------------------------------------------------------------
| USER INFO
|--------------------------------------------------------------------------
*/

.user-info {
  min-width: 100px;
}

.user-name {
  color: #1c2624;

  font-size: 0.84rem;

  font-weight: 700;

  white-space: nowrap;
}

.user-role {
  color: var(--text-muted);

  font-size: 0.7rem;

  margin-top: 2px;

  white-space: nowrap;
}

.user-arrow {
  color: #8a9793;

  font-size: 0.7rem;

  margin-left: 2px;
}

/*
|--------------------------------------------------------------------------
| RESPONSIVE
|--------------------------------------------------------------------------
*/

@media (max-width: 991px) {
  .manager-topbar {
    padding: 15px 20px;
  }

  .date-pill {
    display: none;
  }
}

@media (max-width: 700px) {
  .topbar-subtitle {
    display: none;
  }

  .topbar-title {
    font-size: 1.35rem;
  }

  .user-info,
  .user-arrow {
    display: none;
  }
}
</style>