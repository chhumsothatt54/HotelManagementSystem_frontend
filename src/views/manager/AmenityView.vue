<template>

    <!-- Top bar -->
    <div class="topbar bg-white">
        <div>
            <h1 class="page-title brand-serif">Amenity</h1>
            <div class="page-subtitle">Property performance overview</div>
        </div>
        <div class="d-flex align-items-center gap-3">
            <div class="icon-btn"><i class="bi bi-bell"></i><span class="dot"></span></div>
            <div class="user-chip">
                <div class="avatar-circle">M</div>
                <div>
                    <div class="name">Sokha Manager</div>
                    <div class="sub">Mekong Riverside Hotel</div>
                </div>
                <i class="bi bi-chevron-down text-muted small"></i>
            </div>
        </div>
    </div>
    <div class="page-content">

        <!-- Weekly revenue -->
        <div class="mb-1 text-uppercase fw-bold" style="font-size: 0.725rem; letter-spacing: 0.5px; color: var(--primary-emerald);">ROOM MANAGEMENT</div>
      <h2 class="fw-bold mb-1" style="color: #1f2937;">Amenities</h2>
      <p class="text-muted mb-4" style="font-size: 0.875rem;">Manage the facilities available to your guests.</p>

      <!-- Amenities Content Card -->
      <div class="content-card">
        
        <!-- Input & Add Button Group -->
        <div class="row g-2 mb-4 align-items-center">
          <div class="col">
            <input type="text" class="form-control form-control-input" placeholder="Add a new amenity...">
          </div>
          <div class="col-auto">
            <button class="btn btn-emerald d-flex align-items-center gap-1">
              <i class="bi bi-plus-lg"></i> Add
            </button>
          </div>
        </div>

        <!-- Amenities Chip Tags List -->
        <div class="d-flex flex-wrap gap-2">
          
          <div class="amenity-chip">
            <i class="bi bi-check-circle-fill"></i>
            <span>Free Wi-Fi</span>
            <button type="button" class="btn-close-chip"><i class="bi bi-x-lg"></i></button>
          </div>

          <div class="amenity-chip">
            <i class="bi bi-check-circle-fill"></i>
            <span>Air conditioning</span>
            <button type="button" class="btn-close-chip"><i class="bi bi-x-lg"></i></button>
          </div>

          <div class="amenity-chip">
            <i class="bi bi-check-circle-fill"></i>
            <span>Rooftop pool</span>
            <button type="button" class="btn-close-chip"><i class="bi bi-x-lg"></i></button>
          </div>

          <div class="amenity-chip">
            <i class="bi bi-check-circle-fill"></i>
            <span>Free breakfast</span>
            <button type="button" class="btn-close-chip"><i class="bi bi-x-lg"></i></button>
          </div>

          <div class="amenity-chip">
            <i class="bi bi-check-circle-fill"></i>
            <span>Airport shuttle</span>
            <button type="button" class="btn-close-chip"><i class="bi bi-x-lg"></i></button>
          </div>

          <div class="amenity-chip">
            <i class="bi bi-check-circle-fill"></i>
            <span>Fitness center</span>
            <button type="button" class="btn-close-chip"><i class="bi bi-x-lg"></i></button>
          </div>

        </div>

      </div>
    

    </div>

</template>

<script setup>

</script>
<style scoped>

/* Sidebar Styling */
    .sidebar {
      width: 250px;
      background-color: var(--sidebar-bg);
      color: #ffffff;
      flex-shrink: 0;
      min-height: 100vh;
    }

    .sidebar .nav-link {
      color: rgba(255, 255, 255, 0.7);
      padding: 0.6rem 1rem;
      border-radius: 8px;
      margin-bottom: 2px;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .sidebar .nav-link:hover {
      color: #ffffff;
      background-color: var(--sidebar-hover);
    }

    .sidebar .nav-link.active {
      color: #ffffff;
      background-color: var(--sidebar-active);
      font-weight: 500;
    }

    .sidebar-category {
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: rgba(255, 255, 255, 0.4);
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
      padding-left: 1rem;
    }

    /* Top Navigation Header */
    .top-header {
      background-color: #ffffff;
      border-bottom: 1px solid #e5e7eb;
      padding: 1rem 2rem;
    }

    /* Avatar Icons */
    .avatar-box {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background-color: var(--primary-emerald);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.9rem;
    }

    .avatar-circle {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: var(--primary-emerald);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.9rem;
    }

    /* Card Container */
    .content-card {
      background-color: #ffffff;
      border: none;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
      padding: 1.75rem;
    }

    /* Form Inputs & Buttons */
    .form-control-input {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 0.6rem 1rem;
      font-size: 0.875rem;
    }

    .form-control-input:focus {
      outline: none;
      border-color: var(--primary-emerald);
      box-shadow: 0 0 0 0.2rem rgba(10, 122, 92, 0.15);
    }

    .btn-emerald {
      background-color: var(--primary-emerald);
      color: #ffffff;
      border: none;
      font-weight: 500;
      border-radius: 8px;
      padding: 0.6rem 1.5rem;
      font-size: 0.875rem;
    }

    .btn-emerald:hover {
      background-color: var(--primary-emerald-hover);
      color: #ffffff;
    }

    /* Amenity Tag Pill */
    .amenity-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background-color: var(--tag-bg);
      color: var(--tag-text);
      padding: 0.45rem 0.85rem;
      border-radius: 20px;
      font-size: 0.8125rem;
      font-weight: 600;
    }

    .amenity-chip .btn-close-chip {
      color: var(--tag-text);
      opacity: 0.5;
      cursor: pointer;
      font-size: 0.75rem;
      background: none;
      border: none;
      padding: 0;
      line-height: 1;
    }

    .amenity-chip .btn-close-chip:hover {
      opacity: 1;
    }
</style>