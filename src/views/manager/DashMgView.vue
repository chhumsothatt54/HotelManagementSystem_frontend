<template>

    <!-- Top bar -->
    <div class="topbar bg-white">
        <div>
            <h1 class="page-title brand-serif">Dashboard</h1>
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

        <!-- Welcome row -->
        <div class="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
            <div>
                <h2 class="welcome-heading">Welcome back, Manager</h2>
            </div>
            <div class="date-pill"><i class="bi bi-calendar3"></i> Sep 3, 2026</div>
        </div>

        <!-- Stat cards -->
        <div class="row g-3 mb-4">
            <div class="col-12 col-sm-6 col-xl-3">
                <div class="stat-card h-100">
                    <div class="d-flex justify-content-between align-items-start">
                        <span class="stat-label">Total Rooms</span>
                        <span class="stat-icon"><i class="bi bi-door-open"></i></span>
                    </div>
                    <div class="stat-value">5</div>
                    <div class="stat-foot"><i class="bi bi-building me-1"></i>Property inventory</div>
                </div>
            </div>
            <div class="col-12 col-sm-6 col-xl-3">
                <div class="stat-card h-100">
                    <div class="d-flex justify-content-between align-items-start">
                        <span class="stat-label">Occupied Rooms</span>
                        <span class="stat-icon"><i class="bi bi-person-check"></i></span>
                    </div>
                    <div class="stat-value">2</div>
                    <div class="stat-foot up"><i class="bi bi-arrow-up"></i> 40% occupancy</div>
                </div>
            </div>
            <div class="col-12 col-sm-6 col-xl-3">
                <div class="stat-card h-100">
                    <div class="d-flex justify-content-between align-items-start">
                        <span class="stat-label">Today's Bookings</span>
                        <span class="stat-icon"><i class="bi bi-calendar-check"></i></span>
                    </div>
                    <div class="stat-value">1</div>
                    <div class="stat-foot"><i class="bi bi-bookmark me-1"></i>New arrivals</div>
                </div>
            </div>
            <div class="col-12 col-sm-6 col-xl-3">
                <div class="stat-card h-100">
                    <div class="d-flex justify-content-between align-items-start">
                        <span class="stat-label">Revenue</span>
                        <span class="stat-icon"><i class="bi bi-graph-up-arrow"></i></span>
                    </div>
                    <div class="stat-value">$4,580</div>
                    <div class="stat-foot up"><i class="bi bi-arrow-up"></i> Monthly revenue</div>
                </div>
            </div>
        </div>

        <!-- Bookings + Occupancy -->
        <div class="row g-3 mb-4">
            <div class="col-12 col-xl-8">
                <div class="panel-card h-100">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <div class="panel-title">Recent Bookings</div>
                            <div class="panel-sub">Latest reservations at your property</div>
                        </div>
                        <a href="#" class="view-all-link">View all <i class="bi bi-arrow-right"></i></a>
                    </div>

                    <div class="table-responsive">
                        <table class="table bookings mb-0">
                            <thead>
                                <tr>
                                    <th>Guest</th>
                                    <th>Room</th>
                                    <th>Stay</th>
                                    <th>Status</th>
                                    <th class="text-end">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="d-flex align-items-center gap-2">
                                            <div class="guest-avatar">C</div>
                                            <div>
                                                <div class="guest-name">Chan Dara</div>
                                                <div class="guest-id">#BK001</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>101</td>
                                    <td>2026-09-03 <i class="bi bi-arrow-right text-muted small"></i> 2026-09-05
                                    </td>
                                    <td><span class="badge-status badge-pending">Pending</span></td>
                                    <td class="amount-cell">$130</td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="d-flex align-items-center gap-2">
                                            <div class="guest-avatar">S</div>
                                            <div>
                                                <div class="guest-name">Sara Lim</div>
                                                <div class="guest-id">#BK002</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>201</td>
                                    <td>2026-09-02 <i class="bi bi-arrow-right text-muted small"></i> 2026-09-04
                                    </td>
                                    <td><span class="badge-status badge-confirmed">Confirmed</span></td>
                                    <td class="amount-cell">$90</td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="d-flex align-items-center gap-2">
                                            <div class="guest-avatar">J</div>
                                            <div>
                                                <div class="guest-name">John Carter</div>
                                                <div class="guest-id">#BK003</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>102</td>
                                    <td>2026-09-01 <i class="bi bi-arrow-right text-muted small"></i> 2026-09-06
                                    </td>
                                    <td><span class="badge-status badge-checkedin">Checked-in</span></td>
                                    <td class="amount-cell">$325</td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="d-flex align-items-center gap-2">
                                            <div class="guest-avatar">L</div>
                                            <div>
                                                <div class="guest-name">Ly Sreymom</div>
                                                <div class="guest-id">#BK004</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>301</td>
                                    <td>2026-08-28 <i class="bi bi-arrow-right text-muted small"></i> 2026-08-31
                                    </td>
                                    <td><span class="badge-status badge-checkedout">Checked-out</span></td>
                                    <td class="amount-cell">$285</td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="d-flex align-items-center gap-2">
                                            <div class="guest-avatar">M</div>
                                            <div>
                                                <div class="guest-name">Marc Dubois</div>
                                                <div class="guest-id">#BK005</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>202</td>
                                    <td>2026-09-10 <i class="bi bi-arrow-right text-muted small"></i> 2026-09-12
                                    </td>
                                    <td><span class="badge-status badge-cancelled">Cancelled</span></td>
                                    <td class="amount-cell">$90</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="col-12 col-xl-4">
                <div class="panel-card h-100">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                            <div class="panel-title">Occupancy</div>
                            <div class="panel-sub">Current room utilization</div>
                        </div>
                        <i class="bi bi-bar-chart-line text-muted"></i>
                    </div>

                    <div class="donut-wrap">
                        <div class="donut-center">
                            <div class="donut-pct">40%</div>
                            <div class="donut-label">Occupied</div>
                        </div>
                    </div>

                    <div class="d-flex justify-content-between px-2">
                        <div><span class="legend-dot" style="background:var(--accent)"></span>Occupied</div>
                        <div class="fw-semibold">2</div>
                    </div>
                    <div class="d-flex justify-content-between px-2 mt-2">
                        <div><span class="legend-dot" style="background:#e7eee9"></span>Available</div>
                        <div class="fw-semibold">3</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Weekly revenue -->
        <div class="panel-card">
            <div class="d-flex justify-content-between align-items-start mb-4">
                <div>
                    <div class="panel-title">Weekly Revenue</div>
                    <div class="panel-sub">Revenue performance for the last 7 days</div>
                </div>
                <div class="text-end">
                    <div class="panel-sub mb-1">This week</div>
                    <div class="fw-bold fs-5">$3310</div>
                </div>
            </div>

            <div class="chart-row" id="weeklyChart">
                <!-- bars injected by JS -->
            </div>
        </div>

    </div>

</template>

<script setup>

</script>