<template>

    <aside id="sidebar">
        <button class="sidebar-toggle" id="sidebarToggle" title="Collapse sidebar">
            <i class="fa-solid fa-chevron-left"></i>
        </button>

        <div class="brand-box">
            <div class="brand-logo">A</div>
            <div class="brand-text">
                <div class="brand-title">Admin Hotel</div>
                <div class="brand-sub">Admin Console</div>
            </div>
        </div>

        <div class="sidebar-content">
            <div class="nav-section-label">Overview</div>
            <RouterLink to="/admin/dashboard" class="sidebar-link " active-class="active" exact-active-class="active">
                <i class="bi bi-grid"></i>
                <span class="link-text">Dashboard</span>
            </RouterLink>

            <div class="nav-section-label">Users</div>
            <RouterLink to="/admin/user" class="sidebar-link" active-class="active" exact-active-class="active">
                <i class="bi bi-person-badge"></i>
                <span class="link-text">Users</span>
            </RouterLink>
            <RouterLink to="/admin/hotel-manager" class="sidebar-link" active-class="active" exact-active-class="active">
                <i class="bi bi-building-fill"></i>
                <span class="link-text">Hotel Managers</span>
            </RouterLink>

            <div class="nav-section-label">Properties</div>
            <a href="#" class="sidebar-link">
                <i class="bi bi-buildings-fill"></i>
                <span class="link-text">Hotels</span>
            </a>
            <a href="#" class="sidebar-link">
                <i class="bi bi-ui-checks-grid"></i>
                <span class="link-text">Room Types</span>
            </a>
            <a href="#" class="sidebar-link">
                <i class="bi bi-door-open"></i>
                <span class="link-text">Rooms</span>
            </a>
            <a href="#" class="sidebar-link">
                <i class="bi bi-stars"></i>
                <span class="link-text">Amenities</span>
            </a>

            <div class="nav-section-label">Bookings</div>
            <a href="#" class="sidebar-link">
                <i class="bi bi-calendar-check"></i>
                <span class="link-text">Bookings</span>
            </a>
            <a href="#" class="sidebar-link">
                <i class="bi bi-credit-card"></i>
                <span class="link-text">Payments</span>
            </a>
            <a href="#" class="sidebar-link">
                <i class="bi bi-star"></i>
                <span class="link-text">Reviews</span>
            </a>
            <div class="nav-section-label">Report</div>

            <a href="#" class="sidebar-link">
                <i class="bi bi-graph-up-arrow"></i>
                <span class="link-text">Revenue Report</span>
            </a>
            <a href="#" class="sidebar-link">
                <i class="bi bi-pie-chart"></i>
                <span class="link-text">Occupancy Report</span>
            </a>
        </div>

        <div class="sidebar-footer">
            <div class="sidebar-user">
                <div class="avatar-circle">P</div>
                <div class="link-text">
                    <div class="name">Platform Admin</div>
                    <div class="role">Administrator</div>
                </div>
                <i class="fa-solid fa-chevron-right link-text ms-auto text-white-50"></i>
            </div>
        </div>
    </aside>
</template>

<script setup>
</script>