<template>
  <div class="d-flex vh-100 overflow-hidden bg-light">
    <aside 
      class="bg-dark text-white d-flex flex-column flex-shrink-0 p-3 shadow" 
      :class="{ 'sidebar-collapsed': isSidebarCollapsed }"
      style="width: 260px; transition: width 0.2s ease;"
    >
      <a href="#" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none px-2">
        <i class="bi bi-building-gear fs-4 me-2 text-warning"></i>
        <span class="fs-5 fw-bold" v-if="!isSidebarCollapsed">GrandAdmin</span>
      </a>
      <hr class="border-secondary">

      <ul class="nav nav-pills flex-column mb-auto overflow-y-auto custom-scrollbar pe-1">
        <li class="nav-item">
          <button 
            class="nav-link w-100 text-start d-flex align-items-center" 
            :class="{ active: currentView === 'dashboard' }"
            @click="currentView = 'dashboard'"
          >
            <i class="bi bi-speedometer2 me-2"></i>
            <span>Dashboard</span>
          </button>
        </li>

        <li class="nav-item mt-2">
          <small class="text-uppercase text-muted px-2 fs-7 fw-bold">User Access</small>
        </li>
        <li>
          <button 
            class="nav-link w-100 text-start d-flex align-items-center" 
            :class="{ active: currentView === 'users' }"
            @click="currentView = 'users'"
          >
            <i class="bi bi-people me-2"></i>
            <span>Manage Users</span>
          </button>
        </li>
        <li>
          <button 
            class="nav-link w-100 text-start d-flex align-items-center" 
            :class="{ active: currentView === 'managers' }"
            @click="currentView = 'managers'"
          >
            <i class="bi bi-person-badge me-2"></i>
            <span>Hotel Managers</span>
          </button>
        </li>

        <li class="nav-item mt-2">
          <small class="text-uppercase text-muted px-2 fs-7 fw-bold">Inventory</small>
        </li>
        <li>
          <button 
            class="nav-link w-100 text-start d-flex align-items-center" 
            :class="{ active: currentView === 'hotels' }"
            @click="currentView = 'hotels'"
          >
            <i class="bi bi-building me-2"></i>
            <span>Manage Hotels</span>
          </button>
        </li>
        <li>
          <button 
            class="nav-link w-100 text-start d-flex align-items-center" 
            :class="{ active: currentView === 'room-types' }"
            @click="currentView = 'room-types'"
          >
            <i class="bi bi-tags me-2"></i>
            <span>Room Types</span>
          </button>
        </li>
        <li>
          <button 
            class="nav-link w-100 text-start d-flex align-items-center" 
            :class="{ active: currentView === 'rooms' }"
            @click="currentView = 'rooms'"
          >
            <i class="bi bi-door-open me-2"></i>
            <span>Manage Rooms</span>
          </button>
        </li>
        <li>
          <button 
            class="nav-link w-100 text-start d-flex align-items-center" 
            :class="{ active: currentView === 'amenities' }"
            @click="currentView = 'amenities'"
          >
            <i class="bi bi-stars me-2"></i>
            <span>Manage Amenities</span>
          </button>
        </li>

        <li class="nav-item mt-2">
          <small class="text-uppercase text-muted px-2 fs-7 fw-bold">Operations</small>
        </li>
        <li>
          <button 
            class="nav-link w-100 text-start d-flex align-items-center" 
            :class="{ active: currentView === 'bookings' }"
            @click="currentView = 'bookings'"
          >
            <i class="bi bi-calendar-check me-2"></i>
            <span>Bookings</span>
          </button>
        </li>
        <li>
          <button 
            class="nav-link w-100 text-start d-flex align-items-center" 
            :class="{ active: currentView === 'payments' }"
            @click="currentView = 'payments'"
          >
            <i class="bi bi-credit-card me-2"></i>
            <span>Payments</span>
          </button>
        </li>
        <li>
          <button 
            class="nav-link w-100 text-start d-flex align-items-center" 
            :class="{ active: currentView === 'reviews' }"
            @click="currentView = 'reviews'"
          >
            <i class="bi bi-star me-2"></i>
            <span>Reviews</span>
          </button>
        </li>

        <li class="nav-item mt-2">
          <small class="text-uppercase text-muted px-2 fs-7 fw-bold">Reports</small>
        </li>
        <li>
          <button 
            class="nav-link w-100 text-start d-flex align-items-center" 
            :class="{ active: currentView === 'revenue' }"
            @click="currentView = 'revenue'"
          >
            <i class="bi bi-graph-up-arrow me-2"></i>
            <span>Revenue Reports</span>
          </button>
        </li>
        <li>
          <button 
            class="nav-link w-100 text-start d-flex align-items-center" 
            :class="{ active: currentView === 'occupancy' }"
            @click="currentView = 'occupancy'"
          >
            <i class="bi bi-pie-chart me-2"></i>
            <span>Occupancy Reports</span>
          </button>
        </li>

        <li class="nav-item mt-2">
          <small class="text-uppercase text-muted px-2 fs-7 fw-bold">System</small>
        </li>
        <li>
          <button 
            class="nav-link w-100 text-start d-flex align-items-center" 
            :class="{ active: currentView === 'notifications' }"
            @click="currentView = 'notifications'"
          >
            <i class="bi bi-bell me-2"></i>
            <span>Notifications</span>
            <span class="badge bg-danger rounded-pill ms-auto" v-if="unreadNotificationsCount > 0">
              {{ unreadNotificationsCount }}
            </span>
          </button>
        </li>
        <li>
          <button 
            class="nav-link w-100 text-start d-flex align-items-center" 
            :class="{ active: currentView === 'audit-logs' }"
            @click="currentView = 'audit-logs'"
          >
            <i class="bi bi-journal-text me-2"></i>
            <span>Audit Logs</span>
          </button>
        </li>
      </ul>

      <hr class="border-secondary">
      
      <div class="dropdown">
        <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
          <img src="https://via.placeholder.com/32" alt="Admin" width="32" height="32" class="rounded-circle me-2">
          <strong>System Admin</strong>
        </a>
        <ul class="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
          <li><a class="dropdown-item" href="#">Profile</a></li>
          <li><a class="dropdown-item" href="#">Settings</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="#">Sign out</a></li>
        </ul>
      </div>
    </aside>

    <div class="d-flex flex-column flex-grow-1 h-100 overflow-hidden">
      
      <header class="navbar navbar-expand-lg navbar-white bg-white border-bottom px-4 py-2 shadow-sm">
        <div class="container-fluid p-0">
          <span class="navbar-brand text-muted fs-6 mb-0">
            Hotel Management System / <strong class="text-dark">{{ activePageTitle }}</strong>
          </span>

          <div class="d-flex align-items-center gap-3">
            <form class="d-none d-md-flex" role="search">
              <input class="form-control form-control-sm me-2" type="search" placeholder="Search..." aria-label="Search">
            </form>

            <button class="btn btn-outline-secondary btn-sm position-relative" @click="currentView = 'notifications'">
              <i class="bi bi-bell"></i>
              <span class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                <span class="visually-hidden">New alerts</span>
              </span>
            </button>
          </div>
        </div>
      </header>

      <main class="flex-grow-1 overflow-y-auto p-4">
        
        <section v-if="currentView === 'dashboard'">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="h4 mb-0 fw-bold">System Overview</h2>
            <button class="btn btn-sm btn-primary">
              <i class="bi bi-download me-1"></i> Export Summary
            </button>
          </div>

          <div class="row g-3 mb-4">
            <div class="col-12 col-sm-6 col-xl-3">
              <div class="card border-0 shadow-sm">
                <div class="card-body d-flex align-items-center">
                  <div class="bg-primary-subtle text-primary p-3 rounded-circle me-3">
                    <i class="bi bi-building fs-4"></i>
                  </div>
                  <div>
                    <h6 class="card-subtitle text-muted mb-1">Total Hotels</h6>
                    <h3 class="card-title mb-0 fw-bold">24</h3>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12 col-sm-6 col-xl-3">
              <div class="card border-0 shadow-sm">
                <div class="card-body d-flex align-items-center">
                  <div class="bg-success-subtle text-success p-3 rounded-circle me-3">
                    <i class="bi bi-calendar-check fs-4"></i>
                  </div>
                  <div>
                    <h6 class="card-subtitle text-muted mb-1">Active Bookings</h6>
                    <h3 class="card-title mb-0 fw-bold">1,420</h3>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12 col-sm-6 col-xl-3">
              <div class="card border-0 shadow-sm">
                <div class="card-body d-flex align-items-center">
                  <div class="bg-warning-subtle text-warning p-3 rounded-circle me-3">
                    <i class="bi bi-currency-dollar fs-4"></i>
                  </div>
                  <div>
                    <h6 class="card-subtitle text-muted mb-1">Total Revenue</h6>
                    <h3 class="card-title mb-0 fw-bold">$128,450</h3>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12 col-sm-6 col-xl-3">
              <div class="card border-0 shadow-sm">
                <div class="card-body d-flex align-items-center">
                  <div class="bg-info-subtle text-info p-3 rounded-circle me-3">
                    <i class="bi bi-door-open fs-4"></i>
                  </div>
                  <div>
                    <h6 class="card-subtitle text-muted mb-1">Avg Occupancy</h6>
                    <h3 class="card-title mb-0 fw-bold">82%</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0 fw-bold">Recent System Bookings</h5>
              <button class="btn btn-sm btn-outline-primary" @click="currentView = 'bookings'">View All</button>
            </div>
            <div class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Booking ID</th>
                    <th>Guest</th>
                    <th>Hotel Name</th>
                    <th>Room Type</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>#BK-9021</td>
                    <td>Jane Doe</td>
                    <td>Grand Hyatt Phnom Penh</td>
                    <td>Deluxe Suite</td>
                    <td><span class="badge bg-success">Confirmed</span></td>
                    <td>$450.00</td>
                  </tr>
                  <tr>
                    <td>#BK-9022</td>
                    <td>John Smith</td>
                    <td>Marriott Siem Reap</td>
                    <td>Standard King</td>
                    <td><span class="badge bg-warning text-dark">Pending</span></td>
                    <td>$210.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section v-else>
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 class="h4 mb-1 fw-bold">{{ activePageTitle }}</h2>
              <p class="text-muted small mb-0">Manage system settings and records for {{ activePageTitle.toLowerCase() }}.</p>
            </div>
            <button class="btn btn-primary btn-sm">
              <i class="bi bi-plus-lg me-1"></i> Add New Record
            </button>
          </div>

          <div class="card border-0 shadow-sm p-4">
            <div class="d-flex justify-content-between mb-3">
              <div class="input-group input-group-sm w-25">
                <input type="text" class="form-control" placeholder="Search records...">
                <button class="btn btn-outline-secondary" type="button"><i class="bi bi-search"></i></button>
              </div>
              <div class="btn-group btn-group-sm" role="group">
                <button type="button" class="btn btn-outline-secondary">Filter</button>
                <button type="button" class="btn btn-outline-secondary">Export</button>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead class="table-light">
                  <tr>
                    <th><input type="checkbox" class="form-check-input"></th>
                    <th>ID</th>
                    <th>Name / Details</th>
                    <th>Created At</th>
                    <th>Status</th>
                    <th class="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><input type="checkbox" class="form-check-input"></td>
                    <td>#001</td>
                    <td>Sample {{ activePageTitle }} Entry</td>
                    <td>Sep 02, 2026</td>
                    <td><span class="badge bg-success">Active</span></td>
                    <td class="text-end">
                      <button class="btn btn-sm btn-outline-primary me-1"><i class="bi bi-pencil"></i></button>
                      <button class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </main>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'

// --- Navigation & View State ---
const currentView = ref('dashboard')
const isSidebarCollapsed = ref(false)

// Mock notification counter
const unreadNotificationsCount = ref(3)

// --- View Title Mapping ---
const viewTitles = {
  'dashboard': 'Dashboard Overview',
  'users': 'Manage Users',
  'managers': 'Manage Hotel Managers',
  'hotels': 'Manage Hotels',
  'room-types': 'Manage Room Types',
  'rooms': 'Manage Rooms',
  'amenities': 'Manage Amenities',
  'bookings': 'Manage Bookings',
  'payments': 'Manage Payments',
  'reviews': 'Manage Reviews',
  'revenue': 'Revenue Reports',
  'occupancy': 'Occupancy Reports',
  'notifications': 'Manage Notifications',
  'audit-logs': 'View Audit Logs'
}

// Compute current page title dynamically
const activePageTitle = computed(() => {
  return viewTitles[currentView.value] || 'Dashboard'
})

// Toggle sidebar collapse state
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}
</script>