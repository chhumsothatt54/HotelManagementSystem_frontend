<template>
  <nav class="navbar navbar-expand-lg sticky-top py-3 custom-glass-navbar">
    <div class="container">
      <RouterLink to="/" class="navbar-brand navbar-brand-custom d-flex align-items-center gap-2">
        <div class="brand-logo-mark overflow-hidden border-0 p-0" style="background: transparent; box-shadow: none;">
          <img src="@/assets/image/hotel_logo.jpg" alt="logo" class="w-100 h-100 object-fit-cover">
        </div>
        <span class="brand-text">Angkor<span class="dot">Stay</span></span>
      </RouterLink>

      <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navMain">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navMain">
        <ul class="navbar-nav mx-auto nav-custom gap-1 gap-lg-3">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link custom-link" active-class="active" exact-active-class="active">
              Hotel
            </RouterLink>
          </li>
          <!-- <li class="nav-item">
            <RouterLink to="/booking-detail" class="nav-link custom-link" active-class="active">
              Bookings
            </RouterLink>
          </li> -->
          <li class="nav-item">
            <RouterLink to="/contact" class="nav-link custom-link" active-class="active">
              Contact
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/about" class="nav-link custom-link" active-class="active">
              About
            </RouterLink>
          </li>
        </ul>

        <div class="d-flex align-items-center gap-3 mt-3 mt-lg-0">
          <RouterLink to="/wishlist" class="icon-btn text-decoration-none" title="Favorites">♡</RouterLink>
          
          <RouterLink to="/notification" class="icon-btn position-relative" title="Notifications">
            <i class="bi bi-bell"></i>
            <span class="badge-dot"></span>
          </RouterLink>

          <template v-if="!authStore.isLogin">
            <RouterLink to="/login" class="login-btn text-decoration-none">
              <i class="bi bi-person"></i>
              <span>Login</span>
            </RouterLink>
          </template>

          <template v-else>
            <div class="dropdown profile-dropdown-container">
              <a href="#" class="profile-chip text-decoration-none" @click.prevent="toggleDropdown" :aria-expanded="isDropdownOpen" role="button">
                <div class="avatar-circle overflow-hidden border-0 p-0" v-if="authStore.user?.avatar">
                  <img :src="authStore.user.avatar.startsWith('http') ? authStore.user.avatar : `http://127.0.0.1:8000/storage/${authStore.user.avatar}`" class="w-100 h-100 object-fit-cover" alt="User Avatar">
                </div>
                <div class="avatar-circle" v-else>{{ userInitials }}</div>
                <span class="fw-semibold small profile-name">{{ authStore.user?.name || 'Profile' }}</span>
                <i class="bi bi-chevron-down ms-1 text-muted small-chevron"></i>
              </a>
              
              <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-3 rounded-4 custom-dropdown p-2" :class="{ 'show': isDropdownOpen }">
                <li class="dropdown-header">
                  <div class="fw-bold text-dark">{{ authStore.user?.name || 'User' }}</div>
                  <div class="text-muted small">{{ authStore.user?.email || 'Logged in' }}</div>
                </li>
                <li><hr class="dropdown-divider my-2"></li>
                <li v-if="authStore.user?.role === 'customer'">
                  <RouterLink to="/settings" class="dropdown-item rounded-3">
                    <i class="bi bi-person me-2"></i> Profile
                  </RouterLink>
                </li>
                <li v-else-if="authStore.user?.role === 'admin'">
                  <RouterLink to="/admin/dashboard" class="dropdown-item rounded-3">
                    <i class="bi bi-speedometer2 me-2"></i> Dashboard Admin
                  </RouterLink>
                </li>
                <li v-else-if="authStore.user?.role === 'hotel_manager'">
                  <RouterLink to="/manager/dashboard" class="dropdown-item rounded-3">
                    <i class="bi bi-speedometer2 me-2"></i> Dashboard Manager
                  </RouterLink>
                </li>
                <li><hr class="dropdown-divider my-2"></li>
                <li>
                  <button class="dropdown-item rounded-3 text-danger d-flex align-items-center" @click="handleLogout">
                    <i class="bi bi-box-arrow-right me-2"></i> Logout
                  </button>
                </li>
              </ul>
            </div>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const closeDropdown = (e) => {
  if (!e.target.closest('.profile-dropdown-container')) {
    isDropdownOpen.value = false;
  } else if (e.target.closest('.dropdown-item')) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});

const userInitials = computed(() => {
  if (authStore.user && authStore.user.name) {
    return String(authStore.user.name).charAt(0).toUpperCase();
  }
  return 'U';
});

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');

.custom-glass-navbar {
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3) !important;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Inter', sans-serif;
  padding: 0.8rem 0 !important;
}

.brand-logo-mark {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #0f766e 0%, #042f2e 100%);
  color: #fff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  font-size: 1.4rem;
  box-shadow: 0 4px 15px rgba(15, 118, 110, 0.25);
  transition: transform 0.3s ease;
}

.navbar-brand-custom:hover .brand-logo-mark {
  transform: rotate(-5deg) scale(1.05);
}

.navbar-brand-custom .brand-text {
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  font-size: 1.5rem;
  color: #111827;
  letter-spacing: -0.02em;
  margin-left: 0.25rem;
}

.navbar-brand-custom .dot {
  color: #0f766e;
}

.nav-custom {
  background: rgba(243, 244, 246, 0.6);
  padding: 0.35rem 0.5rem;
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.custom-link {
  color: #4b5563 !important;
  font-weight: 500;
  font-size: 0.95rem;
  padding: 0.5rem 1.2rem !important;
  border-radius: 100px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.custom-link:hover {
  color: #0f766e !important;
  background: rgba(15, 118, 110, 0.08);
}

.custom-link.active {
  color: #0f766e !important;
  font-weight: 600;
  background: rgba(15, 118, 110, 0.12);
  box-shadow: 0 2px 8px rgba(15, 118, 110, 0.05);
}

.icon-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
  background: transparent;
  border: 1px solid transparent;
  font-size: 1.2rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.icon-btn:hover {
  background: #f3f4f6;
  color: #0f766e;
  border-color: #e5e7eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.badge-dot {
  position: absolute;
  top: 10px;
  right: 12px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.2);
}

.login-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.5rem;
  background: linear-gradient(135deg, #0f766e 0%, #042f2e 100%);
  color: #fff !important;
  border-radius: 100px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(15, 118, 110, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(15, 118, 110, 0.3);
}

.profile-chip {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.35rem 1rem 0.35rem 0.35rem;
  border-radius: 100px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.profile-chip:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.avatar-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0f766e 0%, #042f2e 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(15, 118, 110, 0.25);
}

.profile-name {
  color: #1e293b;
  font-weight: 600;
}

.small-chevron {
  font-size: 0.75rem;
  color: #94a3b8;
  transition: transform 0.3s ease;
}

.profile-chip[aria-expanded="true"] .small-chevron {
  transform: rotate(180deg);
}

.custom-dropdown {
  min-width: 260px;
  animation: dropdownFade 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
}

.dropdown-header {
  padding: 1rem 1.25rem;
  background: #f8fafc;
  border-radius: 12px 12px 0 0;
  margin-top: -0.5rem;
}

.dropdown-item {
  padding: 0.7rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: #475569;
  transition: all 0.2s ease;
  margin: 0.25rem 0.5rem;
  width: calc(100% - 1rem);
}

.dropdown-item i {
  color: #94a3b8;
  transition: color 0.2s ease;
}

.dropdown-item:hover {
  background-color: #f1f5f9;
  color: #0f766e;
}

.dropdown-item:hover i {
  color: #0f766e;
}

.dropdown-item.text-danger:hover {
  background-color: #fef2f2;
  color: #ef4444 !important;
}

.dropdown-item.text-danger:hover i {
  color: #ef4444;
}

@keyframes dropdownFade {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>