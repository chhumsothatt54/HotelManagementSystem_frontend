<template>
  <nav class="navbar navbar-expand-lg sticky-top py-3 custom-glass-navbar">
    <div class="container">
      <RouterLink to="/" class="navbar-brand navbar-brand-custom d-flex align-items-center gap-2">
        <div class="brand-logo-mark">A</div>
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
          <li class="nav-item">
            <RouterLink to="/booking-detail" class="nav-link custom-link" active-class="active">
              Bookings
            </RouterLink>
          </li>
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
          <button class="icon-btn" title="Favorites">♡</button>
          
          <button class="icon-btn position-relative" title="Notifications">
            <i class="bi bi-bell"></i>
            <span class="badge-dot"></span>
          </button>

          <template v-if="!authStore.isLogin">
            <RouterLink to="/login" class="login-btn text-decoration-none">
              <i class="bi bi-person"></i>
              <span>Login</span>
            </RouterLink>
          </template>

          <template v-else>
            <div class="dropdown">
              <div class="profile-chip text-decoration-none" data-bs-toggle="dropdown" aria-expanded="false">
                <div class="avatar-circle overflow-hidden border-0 p-0" v-if="authStore.user?.avatar">
                  <img :src="authStore.user.avatar.startsWith('http') ? authStore.user.avatar : `http://127.0.0.1:8000/storage/${authStore.user.avatar}`" class="w-100 h-100 object-fit-cover" alt="User Avatar">
                </div>
                <div class="avatar-circle" v-else>{{ userInitials }}</div>
                <span class="fw-semibold small profile-name">{{ authStore.user?.name || 'Profile' }}</span>
                <i class="bi bi-chevron-down ms-1 text-muted small-chevron"></i>
              </div>
              
              <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-3 rounded-4 custom-dropdown p-2">
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
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const userInitials = computed(() => {
  if (authStore.user && authStore.user.name) {
    return authStore.user.name.charAt(0).toUpperCase();
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
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
}

.brand-logo-mark {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #064e3b 0%, #047857 100%);
  color: #fff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  font-size: 1.3rem;
  box-shadow: 0 4px 10px rgba(6, 78, 59, 0.2);
}

.navbar-brand-custom .brand-text {
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  font-size: 1.4rem;
  color: #111827;
  letter-spacing: -0.01em;
}

.navbar-brand-custom .dot {
  color: #d97706; /* Warm gold accent */
}

.custom-link {
  color: #4b5563 !important;
  font-weight: 500;
  font-size: 0.95rem;
  padding: 0.5rem 1rem !important;
  border-radius: 8px;
  transition: all 0.2s ease;
  position: relative;
}

.custom-link:hover {
  color: #064e3b !important;
  background: rgba(6, 78, 59, 0.05);
}

.custom-link.active {
  color: #064e3b !important;
  font-weight: 600;
}

.custom-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background-color: #d97706;
  border-radius: 3px 3px 0 0;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
  background: #f3f4f6;
  border: none;
  font-size: 1.1rem;
  transition: all 0.2s ease;
}

.icon-btn:hover {
  background: #e5e7eb;
  color: #111827;
  transform: translateY(-1px);
}

.badge-dot {
  position: absolute;
  top: 8px;
  right: 10px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
  border: 2px solid #f3f4f6;
}

.login-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  background: #064e3b;
  color: #fff !important;
  border-radius: 99px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(6, 78, 59, 0.15);
}

.login-btn:hover {
  background: #047857;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(6, 78, 59, 0.2);
}

.profile-chip {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.4rem 1rem 0.4rem 0.4rem;
  border-radius: 99px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s ease;
}

.profile-chip:hover {
  background: #e5e7eb;
  border-color: #d1d5db;
}

.avatar-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(217, 119, 6, 0.2);
}

.profile-name {
  color: #111827;
}

.small-chevron {
  font-size: 0.7rem;
}

.custom-dropdown {
  min-width: 240px;
  animation: dropdownFade 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.dropdown-item {
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #4b5563;
  transition: background-color 0.15s ease;
}

.dropdown-item:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.dropdown-item.text-danger:hover {
  background-color: #fef2f2;
  color: #dc2626 !important;
}

@keyframes dropdownFade {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>