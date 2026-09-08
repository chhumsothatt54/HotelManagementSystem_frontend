<template>

    <!-- Top bar -->
    <div class="topbar bg-white">
        <div>
            <h1 class="page-title brand-serif">Hotel Image</h1>
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
       
            <!-- Subheader Action Area -->
            <div class="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <div class="text-uppercase fw-bold" style="font-size: 10px; color: var(--blue); letter-spacing: 0.5px;">PROPERTY SETUP</div>
                    <h2 class="fw-bold mb-0" style="font-size: 22px; color: var(--navy);">Hotel Images</h2>
                    <p class="text-muted mb-0" style="font-size: 13px;">Manage the images displayed for your hotel.</p>
                </div>
                <button class="btn-primary-custom">
                    <i class="bi bi-cloud-upload"></i> Upload Images
                </button>
            </div>

            <!-- Hotel Images Gallery Grid -->
            <div class="row g-3 mb-4">
                <div class="col-6 col-md-3">
                    <div class="hotel-img-card">
                        <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80" alt="Resort Pool">
                        <span class="img-tag">Image 1</span>
                        <button class="delete-btn" title="Delete Image"><i class="bi bi-trash"></i></button>
                    </div>
                </div>
                <div class="col-6 col-md-3">
                    <div class="hotel-img-card">
                        <img src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80" alt="Bedroom Suite">
                        <span class="img-tag">Image 2</span>
                        <button class="delete-btn" title="Delete Image"><i class="bi bi-trash"></i></button>
                    </div>
                </div>
                <div class="col-6 col-md-3">
                    <div class="hotel-img-card">
                        <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80" alt="Hotel Exterior">
                        <span class="img-tag">Image 3</span>
                        <button class="delete-btn" title="Delete Image"><i class="bi bi-trash"></i></button>
                    </div>
                </div>
                <div class="col-6 col-md-3">
                    <div class="hotel-img-card">
                        <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80" alt="Sunset View Pool">
                        <span class="img-tag">Image 4</span>
                        <button class="delete-btn" title="Delete Image"><i class="bi bi-trash"></i></button>
                    </div>
                </div>
            </div>

            
       

    </div>

</template>

<script setup>

</script>
<style scoped>
/* Layout Structure */
        .app-wrapper {
            display: flex;
            min-height: 100vh;
        }

        /* Sidebar Styling */
        .sidebar {
            width: var(--sidebar-width);
            background-color: var(--navy);
            color: #ffffff;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            z-index: 1000;
        }

        .sidebar-brand {
            padding: 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .brand-avatar {
            width: 38px;
            height: 38px;
            background-color: var(--sky);
            color: #ffffff;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
        }

        .brand-text .title {
            font-size: 14px;
            font-weight: 700;
            line-height: 1.2;
        }

        .brand-text .subtitle {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.6);
        }

        .sidebar-menu {
            padding: 16px 12px;
            overflow-y: auto;
            flex-grow: 1;
        }

        .menu-section-label {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: var(--sky);
            font-weight: 700;
            margin: 16px 8px 8px;
        }

        .nav-link-custom {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 12px;
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.2s ease;
        }

        .nav-link-custom:hover {
            color: #ffffff;
            background-color: rgba(255, 255, 255, 0.05);
        }

        .nav-link-custom.active {
            color: #ffffff;
            background-color: var(--blue);
        }

        .sidebar-footer {
            padding: 16px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            background-color: rgba(0, 0, 0, 0.1);
        }

        .user-card-sm {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #ffffff;
        }

        /* Main Content Styling */
        .main-wrapper {
            margin-left: var(--sidebar-width);
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            min-width: 0;
        }

        /* Top Bar */
        .topbar {
            height: 72px;
            background: #ffffff;
            border-bottom: 1px solid var(--line);
            padding: 0 32px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 999;
        }

        .page-title-text {
            font-size: 20px;
            font-weight: 700;
            color: var(--ink);
            margin: 0;
        }

        .page-subtitle-text {
            font-size: 12px;
            color: var(--muted);
            margin: 0;
        }

        /* Notification Icon */
        .icon-btn {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            border: 1px solid var(--line);
            background: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--ink);
            position: relative;
            cursor: pointer;
            transition: 0.2s;
        }

        .icon-btn:hover {
            background-color: var(--bg-soft);
        }

        .notification-dot {
            position: absolute;
            top: 8px;
            right: 8px;
            width: 8px;
            height: 8px;
            background-color: var(--gold);
            border-radius: 50%;
            border: 2px solid #ffffff;
        }

        /* User Chip Right */
        .user-chip {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 4px 12px 4px 4px;
            border: 1px solid var(--line);
            border-radius: 50px;
            cursor: pointer;
            background: #ffffff;
        }

        .avatar-circle {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color: var(--navy);
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 700;
        }

        /* Content Area */
        .content-area {
            padding: 28px 32px;
            flex-grow: 1;
        }

        /* Custom Buttons */
        .btn-primary-custom {
            background-color: var(--blue);
            color: #ffffff;
            border: none;
            border-radius: 8px;
            padding: 8px 16px;
            font-size: 13px;
            font-weight: 600;
            transition: 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        .btn-primary-custom:hover {
            background-color: var(--navy);
            color: #ffffff;
        }

        /* Cards Styling */
        .card-custom {
            background: #ffffff;
            border: 1px solid var(--line);
            border-radius: var(--radius);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
            padding: 20px;
            height: 100%;
        }

        .stat-icon-wrapper {
            width: 42px;
            height: 42px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
        }

        .stat-icon-wrapper.blue {
            background-color: var(--blue-light);
            color: var(--blue);
        }

        .stat-icon-wrapper.gold {
            background-color: #FEF7E6;
            color: var(--gold);
        }

        .stat-value {
            font-size: 26px;
            font-weight: 700;
            color: var(--ink);
            margin: 10px 0 2px;
        }

        .stat-label {
            font-size: 12px;
            color: var(--muted);
            font-weight: 500;
        }

        /* Hotel Image Cards */
        .hotel-img-card {
            position: relative;
            border-radius: var(--radius);
            overflow: hidden;
            border: 1px solid var(--line);
            aspect-ratio: 16 / 10;
        }

        .hotel-img-card img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .hotel-img-card .img-tag {
            position: absolute;
            bottom: 12px;
            left: 12px;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            color: #ffffff;
            font-size: 11px;
            padding: 2px 8px;
            border-radius: 4px;
        }

        .hotel-img-card .delete-btn {
            position: absolute;
            bottom: 12px;
            right: 12px;
            width: 28px;
            height: 28px;
            background: #ffffff;
            color: #dc3545;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }

        /* Table Styling */
        .custom-table {
            width: 100%;
            margin: 0;
        }

        .custom-table th {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--muted);
            font-weight: 600;
            border-bottom: 1px solid var(--line);
            padding: 12px 16px;
            background: var(--bg-soft);
        }

        .custom-table td {
            font-size: 13px;
            padding: 14px 16px;
            border-bottom: 1px solid var(--line);
            vertical-align: middle;
        }

        .badge-status {
            padding: 4px 8px;
            border-radius: 50px;
            font-size: 11px;
            font-weight: 600;
        }

        .badge-status.approved {
            background-color: var(--blue-light);
            color: var(--blue);
        }

        .badge-status.pending {
            background-color: #FEF7E6;
            color: #B47D00;
        }

        /* Donut Chart Visual */
        .donut-chart-container {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: conic-gradient(var(--blue) 0% 75%, var(--line) 75% 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
        }

        .donut-chart-inner {
            width: 88px;
            height: 88px;
            background: #ffffff;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
</style>