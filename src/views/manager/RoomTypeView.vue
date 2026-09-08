<template>

    <!-- Top bar -->
    <div class="topbar bg-white">
        <div>
            <h1 class="page-title brand-serif">Romm Type</h1>
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
      
      <div class="d-flex justify-content-between align-items-center mb-1">
        <h2 class="fw-bold mb-0" style="color: #1f2937;">Room Types</h2>
        <button class="btn btn-emerald d-flex align-items-center gap-2">
          <i class="bi bi-plus-lg"></i> Add Room Type
        </button>
      </div>
      
      <p class="text-muted mb-4" style="font-size: 0.875rem;">Configure room categories and specifications.</p>

      <!-- Room Types Grid -->
      <div class="row g-4">

        <!-- Card 1: Deluxe King -->
        <div class="col-12 col-md-6 col-xl-4">
          <div class="room-type-card h-100 d-flex align-items-start gap-3">
            <div class="room-icon-box">
              <i class="bi bi-door-closed"></i>
            </div>
            <div class="flex-grow-1">
              <h6 class="fw-bold text-dark mb-3">Deluxe King</h6>
              <div class="spec-item">
                <span><i class="bi bi-people me-1"></i> Capacity</span>
                <span class="spec-value">2</span>
              </div>
              <div class="spec-item">
                <span><i class="bi bi-aspect-ratio me-1"></i> Size</span>
                <span class="spec-value">28 m²</span>
              </div>
              <div class="spec-item">
                <span>Bed</span>
                <span class="spec-value">1 King Bed</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 2: Twin Standard -->
        <div class="col-12 col-md-6 col-xl-4">
          <div class="room-type-card h-100 d-flex align-items-start gap-3">
            <div class="room-icon-box">
              <i class="bi bi-door-closed"></i>
            </div>
            <div class="flex-grow-1">
              <h6 class="fw-bold text-dark mb-3">Twin Standard</h6>
              <div class="spec-item">
                <span><i class="bi bi-people me-1"></i> Capacity</span>
                <span class="spec-value">2</span>
              </div>
              <div class="spec-item">
                <span><i class="bi bi-aspect-ratio me-1"></i> Size</span>
                <span class="spec-value">22 m²</span>
              </div>
              <div class="spec-item">
                <span>Bed</span>
                <span class="spec-value">2 Twin Beds</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 3: Family Suite -->
        <div class="col-12 col-md-6 col-xl-4">
          <div class="room-type-card h-100 d-flex align-items-start gap-3">
            <div class="room-icon-box">
              <i class="bi bi-door-closed"></i>
            </div>
            <div class="flex-grow-1">
              <h6 class="fw-bold text-dark mb-3">Family Suite</h6>
              <div class="spec-item">
                <span><i class="bi bi-people me-1"></i> Capacity</span>
                <span class="spec-value">4</span>
              </div>
              <div class="spec-item">
                <span><i class="bi bi-aspect-ratio me-1"></i> Size</span>
                <span class="spec-value">42 m²</span>
              </div>
              <div class="spec-item">
                <span>Bed</span>
                <span class="spec-value">1 King + 2 Twin</span>
              </div>
            </div>
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

    /* Action Buttons & Icons */
    .btn-emerald {
      background-color: var(--primary-emerald);
      color: #ffffff;
      border: none;
      font-weight: 500;
      border-radius: 8px;
      padding: 0.5rem 1.25rem;
    }

    .btn-emerald:hover {
      background-color: var(--primary-emerald-hover);
      color: #ffffff;
    }

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

    /* Room Type Cards */
    .room-type-card {
      background-color: #ffffff;
      border: none;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
      padding: 1.25rem;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .room-type-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .room-icon-box {
      width: 48px;
      height: 48px;
      background-color: var(--card-icon-bg);
      color: var(--primary-emerald);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .spec-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8125rem;
      color: #6b7280;
      margin-bottom: 0.5rem;
    }

    .spec-item:last-child {
      margin-bottom: 0;
    }

    .spec-value {
      color: #111827;
      font-weight: 700;
    }
</style>