<template>

    <!-- Top bar -->
    <div class="topbar bg-white">
        <div>
            <h1 class="page-title brand-serif">Rooms</h1>
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
        <div class="mb-1 text-uppercase text-emerald fw-bold" style="font-size: 0.725rem; letter-spacing: 0.5px; color: var(--primary-emerald);">ROOM MANAGEMENT</div>
      
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="fw-bold mb-0" style="color: #1f2937;">Rooms</h2>
        <button class="btn btn-emerald d-flex align-items-center gap-2">
          <i class="bi bi-plus-lg"></i> Add Room
        </button>
      </div>
      
      <p class="text-muted mb-4" style="font-size: 0.875rem;">Manage individual rooms and their availability.</p>

      <!-- Data Table Card Container -->
      <div class="card-table-wrapper">
        <div class="table-responsive">
          <table class="table align-middle mb-0">
            <thead>
              <tr class="text-uppercase">
                <th scope="col" style="width: 15%;">ROOM</th>
                <th scope="col" style="width: 20%;">FLOOR</th>
                <th scope="col" style="width: 25%;">ROOM TYPE</th>
                <th scope="col" style="width: 25%;">STATUS</th>
                <th scope="col" class="text-end" style="width: 15%;">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="fw-bold">101</td>
                <td class="text-muted">Floor 1</td>
                <td class="text-muted">Deluxe King</td>
                <td class="text-muted" style="font-size: 0.8rem;">Available</td>
                <td class="text-end">
                  <button class="btn btn-icon-action me-1" title="Edit"><i class="bi bi-pencil text-success"></i></button>
                  <button class="btn btn-icon-action" title="Delete"><i class="bi bi-trash text-danger"></i></button>
                </td>
              </tr>
              <tr>
                <td class="fw-bold">102</td>
                <td class="text-muted">Floor 1</td>
                <td class="text-muted">Deluxe King</td>
                <td class="text-muted" style="font-size: 0.8rem;">Occupied</td>
                <td class="text-end">
                  <button class="btn btn-icon-action me-1" title="Edit"><i class="bi bi-pencil text-success"></i></button>
                  <button class="btn btn-icon-action" title="Delete"><i class="bi bi-trash text-danger"></i></button>
                </td>
              </tr>
              <tr>
                <td class="fw-bold">201</td>
                <td class="text-muted">Floor 2</td>
                <td class="text-muted">Twin Standard</td>
                <td class="text-muted" style="font-size: 0.8rem;">Available</td>
                <td class="text-end">
                  <button class="btn btn-icon-action me-1" title="Edit"><i class="bi bi-pencil text-success"></i></button>
                  <button class="btn btn-icon-action" title="Delete"><i class="bi bi-trash text-danger"></i></button>
                </td>
              </tr>
              <tr>
                <td class="fw-bold">202</td>
                <td class="text-muted">Floor 2</td>
                <td class="text-muted">Twin Standard</td>
                <td class="text-muted" style="font-size: 0.8rem;">Maintenance</td>
                <td class="text-end">
                  <button class="btn btn-icon-action me-1" title="Edit"><i class="bi bi-pencil text-success"></i></button>
                  <button class="btn btn-icon-action" title="Delete"><i class="bi bi-trash text-danger"></i></button>
                </td>
              </tr>
              <tr>
                <td class="fw-bold">301</td>
                <td class="text-muted">Floor 3</td>
                <td class="text-muted">Family Suite</td>
                <td class="text-muted" style="font-size: 0.8rem;">Occupied</td>
                <td class="text-end">
                  <button class="btn btn-icon-action me-1" title="Edit"><i class="bi bi-pencil text-success"></i></button>
                  <button class="btn btn-icon-action" title="Delete"><i class="bi bi-trash text-danger"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
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

    /* Action Buttons & Badges */
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

    .btn-icon-action {
      width: 32px;
      height: 32px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
      background-color: #ffffff;
    }

    .btn-icon-action:hover {
      background-color: #f9fafb;
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

    /* Card Scaffolding */
    .card-table-wrapper {
      background-color: #ffffff;
      border-radius: 12px;
      border: none;
      box-shadow: 0 1px 3px rgba(0,0,0,0.02);
      padding: 1.5rem;
    }

    .table th {
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      color: #6b7280;
      border-bottom-width: 1px;
      padding-bottom: 1rem;
    }

    .table td {
      padding: 1.2rem 0.5rem;
      color: #374151;
      font-size: 0.875rem;
      border-bottom-color: #f3f4f6;
    }

</style>