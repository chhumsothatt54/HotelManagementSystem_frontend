<template>
  <nav class="navbar navbar-expand-lg bg-white sticky-top border-bottom py-3">
    <div class="container">
      <RouterLink to="/" class="navbar-brand navbar-brand-custom">
        Angkor<span class="dot">Stay</span>
      </RouterLink>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navMain">
        <ul class="navbar-nav mx-auto nav-custom">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link" active-class="active" exact-active-class="active">
              Hotel
            </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink to="/booking" class="nav-link" active-class="active">
              Bookings
            </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink to="/contact" class="nav-link" active-class="active">
              Contact
            </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink to="/about" class="nav-link" active-class="active">
              About
            </RouterLink>
          </li>
        </ul>

        <div class="d-flex align-items-center gap-2 mt-3 mt-lg-0">
          <button class="icon-btn">♡</button>

          <button class="icon-btn">
            🔔
            <span class="badge-dot"></span>
          </button>

          <RouterLink to="/profile" class="avatar-chip">
            <div class="avatar-circle">S</div>
            <span class="fw-semibold small">Sokha</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
</script>