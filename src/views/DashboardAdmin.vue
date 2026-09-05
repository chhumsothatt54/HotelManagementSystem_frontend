<template>
    <main>



        <!-- ===================== SIDEBAR ===================== -->
         <SidebarView/>


        <!-- ===================== MAIN ===================== -->
        <main id="main">
            <div class="page-content">
                <RouterView/>

            </div>
        </main>
    </main>
</template>

<script setup>
import SidebarView from '@/components/layout/admin/SidebarView.vue';

</script>

<style>

.brand-serif {
    font-family: Georgia, 'Times New Roman', serif;
}

/* ===== Sidebar ===== */
#sidebar {
    width: var(--sidebar-width);
    height: 100vh;
    background: var(--sidebar-bg);
    color: #cfe3df;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    padding: 1.25rem 1rem;
    overflow: hidden;
    transition: width .2s ease, padding .2s ease;
    z-index: 20;
}

.sidebar-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 0.25rem;
}

.sidebar-content::-webkit-scrollbar {
    width: 4px;
}

.sidebar-content::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 4px;
}

.brand-box {
    display: flex;
    align-items: center;
    gap: .75rem;
    padding: .5rem .25rem 1.25rem .25rem;
    border-bottom: 1px solid rgba(255, 255, 255, .08);
    margin-bottom: 1rem;
}

.brand-logo {
    width: 42px;
    height: 42px;
    background: #9db98f;
    color: #0c3b34;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    border-radius: 10px;
    font-size: 1.1rem;
    flex-shrink: 0;
}

.brand-title {
    color: #fff;
    font-weight: 700;
    font-size: .98rem;
    line-height: 1.2;
    white-space: nowrap;
}

.brand-sub {
    color: #9fb6b0;
    font-size: .78rem;
    white-space: nowrap;
}

#sidebar.collapsed .brand-text,
#sidebar.collapsed .link-text,
#sidebar.collapsed .nav-section-label {
    display: none;
}

#sidebar.collapsed .brand-box {
    justify-content: center;
}

#sidebar.collapsed .sidebar-link {
    justify-content: center;
}

.sidebar-toggle {
    position: absolute;
    top: 22px;
    right: -13px;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: 1px solid var(--card-border);
    background: #fff;
    color: var(--accent);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: .78rem;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, .12);
    z-index: 25;
}

.sidebar-toggle:hover {
    background: var(--accent-light);
    color: #062420;
}

.nav-section-label {
    font-size: .68rem;
    letter-spacing: .06em;
    color: #6f8a83;
    font-weight: 600;
    margin: 1.1rem .5rem .4rem .5rem;
    white-space: nowrap;
}

.sidebar-link {
    display: flex;
    align-items: center;
    gap: .7rem;
    padding: .55rem .7rem;
    border-radius: 8px;
    color: #cfe3df;
    text-decoration: none;
    font-size: .88rem;
    margin-bottom: .15rem;
    transition: background .15s ease, color .15s ease;
    white-space: nowrap;
}

.sidebar-link i {
    font-size: 1rem;
    width: 18px;
    text-align: center;
    flex-shrink: 0;
}

.sidebar-link:hover {
    background: rgba(255, 255, 255, .06);
    color: #fff;
}

.sidebar-link.active {
    background: var(--accent-light);
    color: #062420;
    font-weight: 600;
}

.sidebar-footer {
    margin-top: auto;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, .08);
}

.sidebar-user {
    display: flex;
    align-items: center;
    gap: .6rem;
    padding: .5rem .4rem;
    border-radius: 8px;
    cursor: pointer;
}

#sidebar.collapsed .sidebar-user {
    justify-content: center;
}

.sidebar-user:hover {
    background: rgba(255, 255, 255, .06);
}

.avatar-circle {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: var(--accent-light);
    color: #062420;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: .85rem;
    flex-shrink: 0;
}

.sidebar-user .name {
    color: #fff;
    font-size: .85rem;
    font-weight: 600;
    line-height: 1.2;
}

.sidebar-user .role {
    color: #9fb6b0;
    font-size: .72rem;
}

/* ===== Main ===== */
#main {
    margin-left: var(--sidebar-width);
    padding: 0 2rem 3rem 2rem;
    transition: margin-left .2s ease;
}

#main.expanded {
    margin-left: var(--sidebar-width-collapsed);
}

.topbar {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    position: fixed;
    top: 0;
    left: var(--sidebar-width);
    right: 0;
    z-index: 15;
    min-height: var(--topbar-height);
    padding: 1.25rem 2rem;
    background: var(--page-bg);
    border-bottom: 1px solid var(--card-border);
    transition: left .2s ease;
}

#main.expanded .topbar {
    left: var(--sidebar-width-collapsed);
}

/* Push page content down so it starts below the fixed topbar */
.page-content {
    padding-top: calc(var(--topbar-height) + 1.5rem);
}

.page-title {
    font-size: 1.6rem;
    font-weight: 700;
    margin-bottom: 0;
}

.page-subtitle {
    color: var(--text-muted);
    font-size: .9rem;
}

.icon-btn {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 1px solid var(--card-border);
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    color: #3a4644;
}

.icon-btn .dot {
    position: absolute;
    top: 8px;
    right: 9px;
    width: 7px;
    height: 7px;
    background: var(--accent-light);
    border-radius: 50%;
}

.user-chip {
    display: flex;
    align-items: center;
    gap: .6rem;
    padding: .3rem .5rem;
    border-radius: 10px;
    cursor: pointer;
}

.user-chip .avatar-circle {
    background: var(--accent);
    color: #fff;
}

.user-chip .name {
    font-size: .85rem;
    font-weight: 600;
    margin-bottom: 0;
}

.user-chip .sub {
    font-size: .72rem;
    color: var(--text-muted);
}

.eyebrow {
    color: var(--accent);
    font-weight: 700;
    font-size: .75rem;
    letter-spacing: .06em;
    text-transform: uppercase;
}

.welcome-heading {
    font-family: Georgia, serif;
    font-size: 2rem;
    margin: .2rem 0 .35rem 0;
}

.welcome-sub {
    color: var(--text-muted);
    font-size: .92rem;
}

.date-pill {
    border: 1px solid var(--card-border);
    background: #fff;
    border-radius: 10px;
    padding: .55rem 1rem;
    font-size: .88rem;
    font-weight: 600;
    color: #28322f;
    display: flex;
    align-items: center;
    gap: .5rem;
    white-space: nowrap;
}

/* Cards */
.stat-card,
.panel-card {
    background: #fff;
    border: 1px solid var(--card-border);
    border-radius: 14px;
    padding: 1.25rem 1.35rem;
}

.stat-label {
    font-size: .86rem;
    color: #3a4644;
    font-weight: 500;
}

.stat-icon {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    background: #eef2f0;
    color: var(--accent);
    display: flex;
    align-items: center;
    justify-content: center;
}

.stat-value {
    font-size: 2rem;
    font-weight: 700;
    margin: .6rem 0 .3rem 0;
}

.stat-foot {
    font-size: .78rem;
    color: var(--text-muted);
}

.stat-foot.up {
    color: var(--accent);
    font-weight: 600;
}

.panel-title {
    font-weight: 700;
    font-size: 1.05rem;
    margin-bottom: .15rem;
}

.panel-sub {
    color: var(--text-muted);
    font-size: .82rem;
}

.view-all-link {
    color: var(--accent);
    font-weight: 600;
    font-size: .85rem;
    text-decoration: none;
}

.view-all-link:hover {
    color: var(--accent-light);
}

table.bookings th {
    font-size: .7rem;
    letter-spacing: .05em;
    text-transform: uppercase;
    color: #8a9793;
    font-weight: 600;
    border-bottom: 1px solid var(--card-border);
    padding-bottom: .6rem;
}

table.bookings td {
    vertical-align: middle;
    padding: .8rem 0;
    border-bottom: 1px solid #f1f3f2;
    font-size: .88rem;
}

table.bookings tr:last-child td {
    border-bottom: none;
}

.guest-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #e6efec;
    color: var(--accent);
    font-weight: 700;
    font-size: .8rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.guest-name {
    font-weight: 600;
    font-size: .88rem;
}

.guest-id {
    color: #9aa4a1;
    font-size: .75rem;
}

.amount-cell {
    font-weight: 700;
    text-align: right;
}

.badge-status {
    font-size: .72rem;
    font-weight: 600;
    padding: .3rem .65rem;
    border-radius: 999px;
    display: inline-block;
}

.badge-pending {
    background: #fdf1d6;
    color: #9a6a00;
}

.badge-confirmed {
    background: #e3f6ef;
    color: #0f8a5f;
}

.badge-checkedin {
    background: #d9efe9;
    color: #0c6b56;
}

.badge-checkedout {
    background: #eceeed;
    color: #5c6663;
}

.badge-cancelled {
    background: #fbe4e4;
    color: #c23434;
}

/* Occupancy donut */
.donut-wrap {
    width: 190px;
    height: 190px;
    border-radius: 50%;
    margin: 1rem auto 1.5rem auto;
    display: flex;
    align-items: center;
    justify-content: center;
    background: conic-gradient(var(--accent) 0% 40%, #e7eee9 40% 100%);
    position: relative;
}

.donut-wrap::before {
    content: "";
    position: absolute;
    width: 140px;
    height: 140px;
    background: #fff;
    border-radius: 50%;
}

.donut-center {
    position: relative;
    text-align: center;
}

.donut-pct {
    font-size: 1.7rem;
    font-weight: 700;
}

.donut-label {
    font-size: .78rem;
    color: var(--text-muted);
}

.legend-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    display: inline-block;
    margin-right: .4rem;
}

/* Weekly revenue bars */
.chart-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    height: 220px;
    padding: 0 .5rem;
}

.bar-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
    flex: 1;
}

.bar-value {
    font-size: .78rem;
    color: #5c6663;
    margin-bottom: .5rem;
}

.bar-track {
    width: 28px;
    height: 150px;
    background: #e3efeb;
    border-radius: 6px 6px 0 0;
    display: flex;
    align-items: flex-end;
    overflow: hidden;
}

.bar-fill {
    width: 100%;
    background: linear-gradient(180deg, var(--accent-light), var(--accent));
    border-radius: 6px 6px 0 0;
}

.bar-day {
    margin-top: .6rem;
    font-size: .82rem;
    color: #3a4644;
    font-weight: 500;
}

/* Empty state (used by tables with no rows, e.g. pending approvals) */
.empty-state {
    padding: 2.5rem 0;
    text-align: center;
    color: var(--text-muted);
    font-size: .9rem;
}

@media (max-width: 991px) {
    #sidebar {
        position: static;
        width: 100%;
        min-height: auto;
    }

    #main,
    #main.expanded {
        margin-left: 0;
        padding: 1.25rem;
    }

    .topbar,
    #main.expanded .topbar {
        left: 0;
        padding-left: 1.25rem;
        padding-right: 1.25rem;
    }
}
</style>