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
                <RouterLink to="/admin/dashboard" class="sidebar-link active">
                    <i class="fa-solid fa-table-cells-large"></i>
                    <span class="link-text">Dashboard</span>
                </RouterLink>

                <div class="nav-section-label">Users</div>
                <RouterLink to="/admin/user" class="sidebar-link">
                    <i class="fa-solid fa-users"></i>
                    <span class="link-text">Users</span>
                </RouterLink>
                <a href="#" class="sidebar-link">
                    <i class="fa-regular fa-id-badge"></i>
                    <span class="link-text">Hotel Managers</span>
                </a>

                <div class="nav-section-label">Properties</div>
                <a href="#" class="sidebar-link">
                    <i class="fa-solid fa-building"></i>
                    <span class="link-text">Hotels</span>
                </a>
                <a href="#" class="sidebar-link">
                    <i class="fa-solid fa-border-all"></i>
                    <span class="link-text">Room Types</span>
                </a>
                <a href="#" class="sidebar-link">
                    <i class="fa-solid fa-door-open"></i>
                    <span class="link-text">Rooms</span>
                </a>
                <a href="#" class="sidebar-link">
                    <i class="fa-solid fa-wand-magic-sparkles"></i>
                    <span class="link-text">Amenities</span>
                </a>

                <div class="nav-section-label">Reservations</div>
                <a href="#" class="sidebar-link">
                    <i class="fa-regular fa-calendar-check"></i>
                    <span class="link-text">Bookings</span>
                </a>
                <div class="nav-section-label">Reservations</div>
                <a href="#" class="sidebar-link">
                    <i class="fa-regular fa-calendar-check"></i>
                    <span class="link-text">Bookings</span>
                </a>
                <div class="nav-section-label">Reservations</div>
                <a href="#" class="sidebar-link">
                    <i class="fa-regular fa-calendar-check"></i>
                    <span class="link-text">Bookings</span>
                </a>
                <div class="nav-section-label">Reservations</div>
                <a href="#" class="sidebar-link">
                    <i class="fa-regular fa-calendar-check"></i>
                    <span class="link-text">Bookings</span>
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