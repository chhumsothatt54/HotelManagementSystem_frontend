<template>

    <!-- Top bar -->
    <div class="topbar bg-white">
        <div>
            <h1 class="page-title brand-serif">Room Image</h1>
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
      <h2 class="fw-bold mb-1" style="color: #1f2937;">Room Images</h2>
      <p class="text-muted mb-4" style="font-size: 0.875rem;">Upload images for each room type.</p>

      <!-- Content Card -->
      <div class="content-card">
        
        <!-- Dropdown Selection -->
        <div class="mb-4">
          <label class="form-label fw-bold small text-dark mb-2">Select Room Type</label>
          <select class="form-select">
            <option selected>Deluxe King</option>
            <option>Twin Standard</option>
            <option>Family Suite</option>
          </select>
        </div>

        <!-- Drag & Drop Upload Container -->
        <div class="upload-zone mb-4">
          <div class="upload-icon">
            <i class="bi bi-cloud-arrow-up"></i>
          </div>
          <h6 class="fw-bold text-dark mb-1" style="font-size: 0.9rem;">Upload room images</h6>
          <p class="text-muted mb-0" style="font-size: 0.75rem;">PNG, JPG or WEBP</p>
        </div>

        <!-- Image Gallery Preview -->
        <div class="d-flex flex-wrap gap-3">
          <div class="image-preview-card">
            <img src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80" alt="Deluxe Room Image">
            <button class="btn-delete-img" type="button" title="Delete image">
              <i class="bi bi-trash"></i>
            </button>
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

    /* Top Header Bar */
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

    /* Form Card Container */
    .content-card {
      background-color: #ffffff;
      border: none;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
      padding: 1.75rem;
    }

    /* Dropzone Upload Styling */
    .upload-zone {
      border: 2px dashed var(--upload-border);
      background-color: var(--upload-bg);
      border-radius: 10px;
      padding: 2.5rem 1rem;
      text-align: center;
      cursor: pointer;
      transition: background-color 0.2s, border-color 0.2s;
    }

    .upload-zone:hover {
      background-color: #e4f2ee;
      border-color: var(--primary-emerald);
    }

    .upload-icon {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      background-color: #ffffff;
      color: var(--primary-emerald);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      margin-bottom: 0.75rem;
    }

    /* Image Card Preview */
    .image-preview-card {
      width: 200px;
      height: 140px;
      border-radius: 10px;
      overflow: hidden;
      position: relative;
    }

    .image-preview-card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .btn-delete-img {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 28px;
      height: 28px;
      background-color: #ffffff;
      color: #dc2626;
      border: none;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.15);
      cursor: pointer;
      transition: background-color 0.15s;
    }

    .btn-delete-img:hover {
      background-color: #fee2e2;
    }

    .form-select {
      border-color: #e5e7eb;
      border-radius: 8px;
      padding: 0.6rem 0.9rem;
      font-size: 0.875rem;
    }

    .form-select:focus {
      border-color: var(--primary-emerald);
      box-shadow: 0 0 0 0.2rem rgba(10, 122, 92, 0.15);
    }
</style>