<template>
  <div class="am-app">
    <!-- Mobile Overlay -->
    <div
      v-if="sidebarOpen"
      class="am-overlay"
      @click="sidebarOpen = false"
    ></div>

    <!-- Sidebar -->
    <aside
      class="am-sidebar"
      :class="{ 'am-sidebar--open': sidebarOpen }"
    >
      <div class="am-brand">
        <div class="am-brand-mark">A</div>

        <div class="am-brand-text">
          <strong>StayLink Platform</strong>
          <span>Admin Console</span>
        </div>

        <button
          class="am-mobile-close"
          type="button"
          aria-label="Close menu"
          @click="sidebarOpen = false"
        >
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <nav class="am-nav">
        <div
          v-for="group in navGroups"
          :key="group.title"
          class="am-nav-group"
        >
          <div class="am-nav-label">
            {{ group.title }}
          </div>

          <button
            v-for="item in group.items"
            :key="item.key"
            type="button"
            class="am-nav-item"
            :class="{ active: activeView === item.key }"
            @click="setView(item.key)"
          >
            <i :class="item.icon"></i>
            <span>{{ item.label }}</span>

            <span
              v-if="item.key === 'hotels' && pendingHotelsCount"
              class="am-nav-badge"
            >
              {{ pendingHotelsCount }}
            </span>

            <span
              v-if="item.key === 'notifications' && unreadCount"
              class="am-nav-badge"
            >
              {{ unreadCount }}
            </span>
          </button>
          
        </div>
      </nav>

      <div class="am-sidebar-footer">
        <button type="button" class="am-manager-mini">
          <div class="am-avatar">A</div>

          <div class="am-manager-info">
            <strong>Platform Admin</strong>
            <span>Administrator</span>
          </div>

          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </aside>

    <!-- Main -->
    <main class="am-main">
      <header class="am-topbar">
        <button
          class="am-menu-button"
          type="button"
          aria-label="Open menu"
          @click="sidebarOpen = true"
        >
          <i class="bi bi-list"></i>
        </button>

        <div class="am-page-heading">
          <h1>{{ currentNavItem.label }}</h1>
          <span>{{ currentNavItem.description }}</span>
        </div>

        <div class="am-topbar-actions">
          <button
            type="button"
            class="am-icon-button"
            aria-label="Notifications"
            @click="setView('notifications')"
          >
            <i class="bi bi-bell"></i>
            <span v-if="unreadCount" class="am-notification-dot"></span>
          </button>

          <div class="am-user">
            <div class="am-avatar">A</div>

            <div class="am-user-info">
              <strong>Platform Admin</strong>
              <span>Administrator</span>
            </div>

            <i class="bi bi-chevron-down"></i>
          </div>
        </div>
      </header>

      <section class="am-content">

        <!-- ================= DASHBOARD ================= -->
        <div v-if="activeView === 'dashboard'">

          <div class="am-welcome">
            <div>
              <span class="am-eyebrow">OVERVIEW</span>
              <h2>Platform overview</h2>
              <p>Here is what's happening across all properties today.</p>
            </div>

            <div class="am-date">
              <i class="bi bi-calendar3"></i>
              {{ today }}
            </div>
          </div>

          <div class="am-stat-grid">
            <div
              v-for="stat in dashboardStats"
              :key="stat.label"
              class="am-stat-card"
            >
              <div class="am-stat-top">
                <span>{{ stat.label }}</span>

                <div class="am-stat-icon" :class="stat.iconClass">
                  <i :class="stat.icon"></i>
                </div>
              </div>

              <div class="am-stat-value">{{ stat.value }}</div>

              <div class="am-stat-meta">
                <span class="neutral">{{ stat.meta }}</span>
              </div>
            </div>
          </div>

          <div class="am-card">
            <div class="am-card-header">
              <div>
                <h3>Pending hotel approvals</h3>
                <p>Hotels waiting for your review</p>
              </div>

              <button
                class="am-link-button"
                type="button"
                @click="setView('hotels')"
              >
                View all
                <i class="bi bi-arrow-right"></i>
              </button>
            </div>

            <div class="am-table-wrap">
              <table class="am-table">
                <thead>
                  <tr>
                    <th>Hotel</th>
                    <th>Manager</th>
                    <th>Location</th>
                    <th>Rooms</th>
                    <th class="text-right">Status</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="h in pendingHotels" :key="h.id">
                    <td><strong>{{ h.name }}</strong></td>
                    <td>{{ h.manager_name }}</td>
                    <td>{{ h.city }}, {{ h.country }}</td>
                    <td>{{ h.rooms }}</td>
                    <td class="text-right">
                      <span class="am-status pending">{{ h.status }}</span>
                    </td>
                  </tr>

                  <tr v-if="!pendingHotels.length">
                    <td colspan="5" class="am-table-empty">
                      No hotels pending approval.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ================= USERS ================= -->
        <div v-if="activeView === 'users'">

          <div class="am-section-heading">
            <div>
              <span class="am-eyebrow">USER MANAGEMENT</span>
              <h2>Users</h2>
              <p>View, update and manage platform accounts.</p>
            </div>
          </div>

          <div class="am-toolbar">
            <div class="am-search">
              <i class="bi bi-search"></i>
              <input
                v-model="userSearch"
                type="text"
                placeholder="Search by name or email..."
              />
            </div>
          </div>

          <div class="am-card">
            <div class="am-table-wrap">
              <table class="am-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th class="text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="u in filteredUsers" :key="u.id">
                    <td>
                      <div class="am-cell-user">
                        <div class="am-cell-avatar">
                          {{ initials(u.name) }}
                        </div>

                        <div>
                          <strong>{{ u.name }}</strong>
                          <span>{{ u.email }}</span>
                        </div>
                      </div>
                    </td>

                    <td>{{ u.phone }}</td>
                    <td>{{ u.role === "hotel_manager" ? "Hotel Manager" : "Customer" }}</td>

                    <td>
                      <span class="am-status" :class="u.status">
                        {{ u.status }}
                      </span>
                    </td>

                    <td>{{ u.created_at }}</td>

                    <td class="text-right">
                      <div class="am-table-actions">
                        <button
                          class="am-table-action"
                          @click="openUserModal(u, 'view')"
                        >
                          <i class="bi bi-eye"></i>
                        </button>

                        <button
                          class="am-table-action"
                          @click="openUserModal(u, 'edit')"
                        >
                          <i class="bi bi-pencil"></i>
                        </button>

                        <button
                          class="am-table-action"
                          @click="toggleUserStatus(u)"
                        >
                          <i
                            class="bi"
                            :class="u.status === 'active' ? 'bi-pause-circle' : 'bi-play-circle'"
                          ></i>
                        </button>

                        <button
                          class="am-table-action danger"
                          @click="deleteUser(u.id)"
                        >
                          <i class="bi bi-trash3"></i>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr v-if="!filteredUsers.length">
                    <td colspan="6" class="am-table-empty">No users found.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ================= HOTEL MANAGERS ================= -->
        <div v-if="activeView === 'managers'">

          <div class="am-section-heading">
            <div>
              <span class="am-eyebrow">USER MANAGEMENT</span>
              <h2>Hotel Managers</h2>
              <p>Users with the hotel_manager role.</p>
            </div>

            <button
              type="button"
              class="am-primary-button"
              @click="openManagerModal"
            >
              <i class="bi bi-plus-lg"></i>
              Add Manager
            </button>
          </div>

          <div class="am-card">
            <div class="am-table-wrap">
              <table class="am-table">
                <thead>
                  <tr>
                    <th>Manager</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Joined</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="m in managers" :key="m.id">
                    <td>
                      <div class="am-cell-user">
                        <div class="am-cell-avatar">
                          {{ initials(m.name) }}
                        </div>

                        <div>
                          <strong>{{ m.name }}</strong>
                          <span>{{ m.email }}</span>
                        </div>
                      </div>
                    </td>

                    <td>{{ m.phone }}</td>

                    <td>
                      <span class="am-status" :class="m.status">
                        {{ m.status }}
                      </span>
                    </td>

                    <td>{{ m.created_at }}</td>
                  </tr>

                  <tr v-if="!managers.length">
                    <td colspan="4" class="am-table-empty">
                      No hotel managers yet.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ================= HOTELS ================= -->
        <div v-if="activeView === 'hotels'">

          <div class="am-section-heading">
            <div>
              <span class="am-eyebrow">PROPERTIES</span>
              <h2>Hotels</h2>
              <p>Approve, reject, or manage hotels created by managers.</p>
            </div>
          </div>

          <div class="am-filters">
            <button
              v-for="f in hotelFilters"
              :key="f"
              :class="{ active: hotelFilter === f }"
              @click="hotelFilter = f"
            >
              {{ f === "All" ? "All" : f.charAt(0).toUpperCase() + f.slice(1) }}
            </button>
          </div>

          <div class="am-card">
            <div class="am-table-wrap">
              <table class="am-table">
                <thead>
                  <tr>
                    <th>Hotel</th>
                    <th>Manager</th>
                    <th>Location</th>
                    <th>Rooms</th>
                    <th>Status</th>
                    <th class="text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="h in filteredHotels" :key="h.id">
                    <td><strong>{{ h.name }}</strong></td>
                    <td>{{ h.manager_name }}</td>
                    <td>{{ h.city }}, {{ h.country }}</td>
                    <td>{{ h.rooms }}</td>

                    <td>
                      <span class="am-status" :class="h.status">
                        {{ h.status }}
                      </span>
                    </td>

                    <td class="text-right">
                      <div class="am-table-actions">
                        <button
                          v-if="h.status === 'pending'"
                          class="am-table-action"
                          title="Approve"
                          @click="approveHotel(h)"
                        >
                          <i class="bi bi-check-lg"></i>
                        </button>

                        <button
                          v-if="h.status === 'pending'"
                          class="am-table-action danger"
                          title="Reject"
                          @click="rejectHotel(h)"
                        >
                          <i class="bi bi-x-lg"></i>
                        </button>

                        <select
                          v-if="h.status !== 'pending'"
                          class="am-status-select"
                          v-model="h.status"
                        >
                          <option value="approved">approved</option>
                          <option value="rejected">rejected</option>
                          <option value="inactive">inactive</option>
                        </select>

                        <button
                          class="am-table-action danger"
                          @click="deleteHotel(h.id)"
                        >
                          <i class="bi bi-trash3"></i>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr v-if="!filteredHotels.length">
                    <td colspan="6" class="am-table-empty">No hotels found.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        

        <!-- ================= ROOM TYPES ================= -->
        <div v-if="activeView === 'roomTypes'">

          <div class="am-section-heading">
            <div>
              <span class="am-eyebrow">PROPERTIES</span>
              <h2>Room Types</h2>
              <p>Configure room categories across hotels.</p>
            </div>

            <button
              type="button"
              class="am-primary-button"
              @click="openRoomTypeModal()"
            >
              <i class="bi bi-plus-lg"></i>
              Add Room Type
            </button>
          </div>

          <div class="am-card">
            <div class="am-table-wrap">
              <table class="am-table">
                <thead>
                  <tr>
                    <th>Room Type</th>
                    <th>Hotel</th>
                    <th>Max Guests</th>
                    <th>Price / Night</th>
                    <th class="text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="rt in roomTypes" :key="rt.id">
                    <td><strong>{{ rt.name }}</strong></td>
                    <td>{{ rt.hotel_name }}</td>
                    <td>{{ rt.max_guests }}</td>
                    <td>${{ rt.price_per_night }}</td>

                    <td class="text-right">
                      <div class="am-table-actions">
                        <button
                          class="am-table-action"
                          @click="openRoomTypeModal(rt)"
                        >
                          <i class="bi bi-pencil"></i>
                        </button>

                        <button
                          class="am-table-action danger"
                          @click="deleteRoomType(rt.id)"
                        >
                          <i class="bi bi-trash3"></i>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr v-if="!roomTypes.length">
                    <td colspan="5" class="am-table-empty">
                      No room types yet.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ================= ROOMS ================= -->
        <div v-if="activeView === 'rooms'">

          <div class="am-section-heading">
            <div>
              <span class="am-eyebrow">PROPERTIES</span>
              <h2>Rooms</h2>
              <p>Manage individual rooms across hotels.</p>
            </div>

            <button
              type="button"
              class="am-primary-button"
              @click="openRoomModal"
            >
              <i class="bi bi-plus-lg"></i>
              Add Room
            </button>
          </div>

          <div class="am-card">
            <div class="am-table-wrap">
              <table class="am-table">
                <thead>
                  <tr>
                    <th>Room</th>
                    <th>Hotel</th>
                    <th>Type</th>
                    <th>Floor</th>
                    <th>Status</th>
                    <th class="text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="r in rooms" :key="r.id">
                    <td><strong>{{ r.room_number }}</strong></td>
                    <td>{{ r.hotel_name }}</td>
                    <td>{{ r.room_type }}</td>
                    <td>Floor {{ r.floor }}</td>

                    <td>
                      <span class="am-status" :class="r.status">
                        {{ r.status }}
                      </span>
                    </td>

                    <td class="text-right">
                      <div class="am-table-actions">
                        <button
                          class="am-table-action danger"
                          @click="deleteRoom(r.id)"
                        >
                          <i class="bi bi-trash3"></i>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr v-if="!rooms.length">
                    <td colspan="6" class="am-table-empty">No rooms yet.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ================= AMENITIES ================= -->
        <div v-if="activeView === 'amenities'">

          <div class="am-section-heading">
            <div>
              <span class="am-eyebrow">PROPERTIES</span>
              <h2>Amenities</h2>
              <p>Manage the amenities available to hotels.</p>
            </div>
          </div>

          <div class="am-card">
            <div class="am-add-row">
              <input
                v-model="newAmenity"
                type="text"
                class="am-input"
                placeholder="Add a new amenity..."
                @keyup.enter="addAmenity"
              />

              <button
                type="button"
                class="am-primary-button"
                @click="addAmenity"
              >
                <i class="bi bi-plus-lg"></i>
                Add
              </button>
            </div>

            <div class="am-chip-list">
              <div
                v-for="a in amenities"
                :key="a.id"
                class="am-chip"
              >
                <i class="bi" :class="a.icon"></i>
                <span>{{ a.name }}</span>

                <button type="button" @click="removeAmenity(a.id)">
                  <i class="bi bi-x"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ================= BOOKINGS ================= -->
        <div v-if="activeView === 'bookings'">

          <div class="am-section-heading">
            <div>
              <span class="am-eyebrow">RESERVATIONS</span>
              <h2>Bookings</h2>
              <p>All reservations across the platform.</p>
            </div>
          </div>

          <div class="am-filters">
            <button
              v-for="f in bookingFilters"
              :key="f"
              :class="{ active: bookingFilter === f }"
              @click="bookingFilter = f"
            >
              {{ f === "All" ? "All" : f.replace("_", " ") }}
            </button>
          </div>

          <div class="am-card">
            <div class="am-table-wrap">
              <table class="am-table">
                <thead>
                  <tr>
                    <th>Booking</th>
                    <th>Guest</th>
                    <th>Hotel</th>
                    <th>Room</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Status</th>
                    <th class="text-right">Amount</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="b in filteredBookings" :key="b.id">
                    <td><strong>{{ b.id }}</strong></td>
                    <td>{{ b.guest_name }}</td>
                    <td>{{ b.hotel_name }}</td>
                    <td>{{ b.room_number }}</td>
                    <td>{{ b.check_in }}</td>
                    <td>{{ b.check_out }}</td>

                    <td>
                      <span class="am-status" :class="b.status">
                        {{ b.status.replace("_", " ") }}
                      </span>
                    </td>

                    <td class="text-right">
                      <strong>${{ b.total_amount }}</strong>
                    </td>
                  </tr>

                  <tr v-if="!filteredBookings.length">
                    <td colspan="8" class="am-table-empty">
                      No bookings found.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ================= PAYMENTS ================= -->
        <div v-if="activeView === 'payments'">

          <div class="am-section-heading">
            <div>
              <span class="am-eyebrow">RESERVATIONS</span>
              <h2>Payments</h2>
              <p>Payment transactions for all bookings.</p>
            </div>
          </div>

          <div class="am-card">
            <div class="am-table-wrap">
              <table class="am-table">
                <thead>
                  <tr>
                    <th>Transaction</th>
                    <th>Booking</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Paid At</th>
                    <th class="text-right">Amount</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="p in payments" :key="p.id">
                    <td><strong>{{ p.transaction_id }}</strong></td>
                    <td>{{ p.booking_id }}</td>
                    <td>{{ p.payment_method.replace("_", " ") }}</td>

                    <td>
                      <span class="am-status" :class="p.status">
                        {{ p.status }}
                      </span>
                    </td>

                    <td>{{ p.paid_at }}</td>

                    <td class="text-right">
                      <strong>${{ p.amount }}</strong>
                    </td>
                  </tr>

                  <tr v-if="!payments.length">
                    <td colspan="6" class="am-table-empty">
                      No payments found.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ================= REVIEWS ================= -->
        <div v-if="activeView === 'reviews'">

          <div class="am-section-heading">
            <div>
              <span class="am-eyebrow">RESERVATIONS</span>
              <h2>Reviews</h2>
              <p>Moderate guest reviews.</p>
            </div>
          </div>

          <div class="am-card">
            <div class="am-table-wrap">
              <table class="am-table">
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>Hotel</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Status</th>
                    <th class="text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="r in reviews" :key="r.id">
                    <td><strong>{{ r.guest_name }}</strong></td>
                    <td>{{ r.hotel_name }}</td>

                    <td>
                      {{ r.rating }}
                      <i class="bi bi-star-fill review-star"></i>
                    </td>

                    <td class="review-comment">{{ r.comment }}</td>

                    <td>
                      <span class="am-status" :class="r.status">
                        {{ r.status }}
                      </span>
                    </td>

                    <td class="text-right">
                      <div class="am-table-actions">
                        <button
                          v-if="r.status !== 'approved'"
                          class="am-table-action"
                          title="Approve"
                          @click="setReviewStatus(r, 'approved')"
                        >
                          <i class="bi bi-check-lg"></i>
                        </button>

                        <button
                          v-if="r.status !== 'hidden'"
                          class="am-table-action"
                          title="Hide"
                          @click="setReviewStatus(r, 'hidden')"
                        >
                          <i class="bi bi-eye-slash"></i>
                        </button>

                        <button
                          class="am-table-action danger"
                          @click="deleteReview(r.id)"
                        >
                          <i class="bi bi-trash3"></i>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr v-if="!reviews.length">
                    <td colspan="6" class="am-table-empty">
                      No reviews found.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ================= REVENUE REPORT ================= -->
        <div v-if="activeView === 'revenueReport'">

          <div class="am-section-heading">
            <div>
              <span class="am-eyebrow">REPORTS</span>
              <h2>Revenue Report</h2>
              <p>Revenue performance by hotel.</p>
            </div>

            <button
              type="button"
              class="am-primary-button"
              @click="exportRevenue"
            >
              <i class="bi bi-download"></i>
              Export CSV
            </button>
          </div>

          <div class="am-card am-report-filters-card">
            <div class="am-form-grid">
              <div class="am-form-group">
                <label>From</label>
                <input v-model="revenueReportFrom" type="date" class="am-input" />
              </div>

              <div class="am-form-group">
                <label>To</label>
                <input v-model="revenueReportTo" type="date" class="am-input" />
              </div>
            </div>
          </div>

          <div class="am-card">
            <div class="am-card-header">
              <div>
                <h3>Revenue by Hotel</h3>
                <p>{{ revenueReportFrom }} to {{ revenueReportTo }}</p>
              </div>
            </div>

            <div>
              <div
                v-for="item in revenueByHotel"
                :key="item.name"
                class="am-report-hotel-row"
              >
                <div class="am-report-hotel">
                  <div class="am-report-hotel-icon">
                    <i class="bi bi-building"></i>
                  </div>

                  <div>
                    <strong>{{ item.name }}</strong>
                    <span>{{ item.bookings }} bookings</span>
                  </div>
                </div>

                <strong class="am-report-amount">${{ item.revenue }}</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- ================= OCCUPANCY REPORT ================= -->
        <div v-if="activeView === 'occupancyReport'">

          <div class="am-section-heading">
            <div>
              <span class="am-eyebrow">REPORTS</span>
              <h2>Occupancy Report</h2>
              <p>Occupancy rate per hotel (Occupied Rooms / Total Rooms × 100).</p>
            </div>

            <button
              type="button"
              class="am-primary-button"
              @click="exportOccupancy"
            >
              <i class="bi bi-download"></i>
              Export CSV
            </button>
          </div>

          <div class="am-card">
            <div
              v-for="item in occupancyByHotel"
              :key="item.name"
              class="am-occupancy-bar-row"
            >
              <strong>{{ item.name }}</strong>

              <div class="am-occupancy-track">
                <div
                  class="am-occupancy-fill"
                  :style="{ width: `${item.rate}%` }"
                ></div>
              </div>

              <span class="am-occupancy-pct">{{ item.rate }}%</span>
            </div>
          </div>
        </div>

        <!-- ================= NOTIFICATIONS ================= -->
        <div v-if="activeView === 'notifications'">

          <div class="am-section-heading">
            <div>
              <span class="am-eyebrow">SYSTEM</span>
              <h2>Notifications</h2>
              <p>System-level notifications for admins.</p>
            </div>

            <button
              type="button"
              class="am-secondary-button"
              @click="markAllRead"
            >
              <i class="bi bi-check2-all"></i>
              Mark all read
            </button>
          </div>

          <div class="am-card">
            <div class="am-notif-list">
              <div
                v-for="n in notifications"
                :key="n.id"
                class="am-notif-row"
                :class="{ unread: !n.is_read }"
              >
                <div class="am-notif-icon">
                  <i class="bi bi-bell"></i>
                </div>

                <div class="am-notif-body">
                  <strong>{{ n.title }}</strong>
                  <p>{{ n.message }}</p>
                </div>

                <div class="am-notif-side">
                  <span class="am-notif-time">{{ n.created_at }}</span>

                  <button
                    v-if="!n.is_read"
                    class="am-link-button"
                    @click="markNotificationRead(n)"
                  >
                    Mark read
                  </button>
                </div>
              </div>

              <div v-if="!notifications.length" class="am-empty-state">
                <i class="bi bi-bell-slash"></i>
                <h3>No notifications</h3>
                <p>You're all caught up.</p>
              </div>
            </div>
          </div>
        </div>

      </section>
    </main>

    <!-- ================= USER MODAL ================= -->
    <div
      v-if="userModal.open"
      class="am-modal-backdrop"
      @click.self="userModal.open = false"
    >
      <div class="am-modal">
        <div class="am-modal-header">
          <div>
            <span class="am-eyebrow">USER MANAGEMENT</span>
            <h3>{{ userModal.mode === "edit" ? "Edit User" : "User Detail" }}</h3>
          </div>

          <button
            type="button"
            class="am-modal-close"
            @click="userModal.open = false"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="am-modal-body">
          <div v-if="userModal.mode === 'view'" class="am-detail-grid">
            <div><span>Name</span><strong>{{ userModal.form.name }}</strong></div>
            <div><span>Email</span><strong>{{ userModal.form.email }}</strong></div>
            <div><span>Phone</span><strong>{{ userModal.form.phone }}</strong></div>
            <div><span>Role</span><strong>{{ userModal.form.role }}</strong></div>
            <div><span>Status</span><strong>{{ userModal.form.status }}</strong></div>
            <div><span>Joined</span><strong>{{ userModal.form.created_at }}</strong></div>
          </div>

          <div v-else class="am-form-grid">
            <div class="am-form-group">
              <label>Name</label>
              <input v-model="userModal.form.name" type="text" class="am-input" />
            </div>

            <div class="am-form-group">
              <label>Phone</label>
              <input v-model="userModal.form.phone" type="text" class="am-input" />
            </div>

            <div class="am-form-group full">
              <label>Email</label>
              <input v-model="userModal.form.email" type="email" class="am-input" />
            </div>
          </div>
        </div>

        <div class="am-modal-footer">
          <button class="am-secondary-button" @click="userModal.open = false">
            Close
          </button>

          <button
            v-if="userModal.mode === 'edit'"
            class="am-primary-button"
            @click="saveUser"
          >
            <i class="bi bi-check-lg"></i>
            Save Changes
          </button>
        </div>
      </div>
    </div>

    <!-- ================= MANAGER MODAL ================= -->
    <div
      v-if="managerModal.open"
      class="am-modal-backdrop"
      @click.self="managerModal.open = false"
    >
      <div class="am-modal">
        <div class="am-modal-header">
          <div>
            <span class="am-eyebrow">USER MANAGEMENT</span>
            <h3>Add Hotel Manager</h3>
          </div>

          <button
            type="button"
            class="am-modal-close"
            @click="managerModal.open = false"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="am-modal-body">
          <div class="am-form-grid">
            <div class="am-form-group">
              <label>Name</label>
              <input v-model="managerModal.form.name" type="text" class="am-input" />
            </div>

            <div class="am-form-group">
              <label>Phone</label>
              <input v-model="managerModal.form.phone" type="text" class="am-input" />
            </div>

            <div class="am-form-group full">
              <label>Email</label>
              <input v-model="managerModal.form.email" type="email" class="am-input" />
            </div>

            <div class="am-form-group full">
              <label>Temporary Password</label>
              <input v-model="managerModal.form.password" type="text" class="am-input" />
            </div>
          </div>
        </div>

        <div class="am-modal-footer">
          <button class="am-secondary-button" @click="managerModal.open = false">
            Cancel
          </button>

          <button class="am-primary-button" @click="createManager">
            <i class="bi bi-check-lg"></i>
            Create Manager
          </button>
        </div>
      </div>
    </div>

    <!-- ================= ROOM TYPE MODAL ================= -->
    <div
      v-if="roomTypeModal.open"
      class="am-modal-backdrop"
      @click.self="roomTypeModal.open = false"
    >
      <div class="am-modal">
        <div class="am-modal-header">
          <div>
            <span class="am-eyebrow">PROPERTIES</span>
            <h3>{{ roomTypeModal.form.id ? "Edit Room Type" : "Add Room Type" }}</h3>
          </div>

          <button
            type="button"
            class="am-modal-close"
            @click="roomTypeModal.open = false"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="am-modal-body">
          <div class="am-form-grid">
            <div class="am-form-group full">
              <label>Hotel</label>

              <select v-model="roomTypeModal.form.hotel_id" class="am-input">
                <option v-for="h in hotels" :key="h.id" :value="h.id">
                  {{ h.name }}
                </option>
              </select>
            </div>

            <div class="am-form-group full">
              <label>Name</label>
              <input v-model="roomTypeModal.form.name" type="text" class="am-input" />
            </div>

            <div class="am-form-group">
              <label>Max Guests</label>
              <input
                v-model.number="roomTypeModal.form.max_guests"
                type="number"
                min="1"
                class="am-input"
              />
            </div>

            <div class="am-form-group">
              <label>Price / Night</label>
              <input
                v-model.number="roomTypeModal.form.price_per_night"
                type="number"
                min="0"
                class="am-input"
              />
            </div>

            <div class="am-form-group full">
              <label>Description</label>
              <textarea
                v-model="roomTypeModal.form.description"
                class="am-input am-textarea"
                rows="3"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="am-modal-footer">
          <button class="am-secondary-button" @click="roomTypeModal.open = false">
            Cancel
          </button>

          <button class="am-primary-button" @click="saveRoomType">
            <i class="bi bi-check-lg"></i>
            Save
          </button>
        </div>
      </div>
    </div>

    <!-- ================= ROOM MODAL ================= -->
    <div
      v-if="roomModal.open"
      class="am-modal-backdrop"
      @click.self="roomModal.open = false"
    >
      <div class="am-modal">
        <div class="am-modal-header">
          <div>
            <span class="am-eyebrow">PROPERTIES</span>
            <h3>Add Room</h3>
          </div>

          <button
            type="button"
            class="am-modal-close"
            @click="roomModal.open = false"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="am-modal-body">
          <div class="am-form-grid">
            <div class="am-form-group full">
              <label>Hotel</label>

              <select v-model="roomModal.form.hotel_id" class="am-input">
                <option v-for="h in hotels" :key="h.id" :value="h.id">
                  {{ h.name }}
                </option>
              </select>
            </div>

            <div class="am-form-group full">
              <label>Room Type</label>

              <select v-model="roomModal.form.room_type_id" class="am-input">
                <option v-for="t in roomTypes" :key="t.id" :value="t.id">
                  {{ t.name }}
                </option>
              </select>
            </div>

            <div class="am-form-group">
              <label>Room Number</label>
              <input
                v-model="roomModal.form.room_number"
                type="text"
                class="am-input"
                placeholder="e.g. 305"
              />
            </div>

            <div class="am-form-group">
              <label>Floor</label>
              <input
                v-model.number="roomModal.form.floor"
                type="number"
                min="1"
                class="am-input"
              />
            </div>

            <div class="am-form-group full">
              <label>Status</label>

              <select v-model="roomModal.form.status" class="am-input">
                <option value="available">available</option>
                <option value="occupied">occupied</option>
                <option value="maintenance">maintenance</option>
              </select>
            </div>
          </div>
        </div>

        <div class="am-modal-footer">
          <button class="am-secondary-button" @click="roomModal.open = false">
            Cancel
          </button>

          <button class="am-primary-button" @click="saveRoomAdmin">
            <i class="bi bi-check-lg"></i>
            Save Room
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";

/* =========================================================
   NAVIGATION
========================================================= */

const sidebarOpen = ref(false);
const activeView = ref("dashboard");

const navGroups = [
  {
    title: "Overview",
    items: [
      {
        key: "dashboard",
        label: "Dashboard",
        description: "Platform performance overview",
        icon: "bi bi-grid-1x2",
      },
    ],
  },
  {
    title: "Users",
    items: [
      {
        key: "users",
        label: "Users",
        description: "Manage platform accounts",
        icon: "bi bi-people",
      },
      {
        key: "managers",
        label: "Hotel Managers",
        description: "Manage hotel manager accounts",
        icon: "bi bi-person-badge",
      },
    ],
  },
  {
    title: "Properties",
    items: [
      {
        key: "hotels",
        label: "Hotels",
        description: "Approve and manage hotels",
        icon: "bi bi-building",
      },
      {
        key: "roomTypes",
        label: "Room Types",
        description: "Manage room categories",
        icon: "bi bi-grid",
      },
      {
        key: "rooms",
        label: "Rooms",
        description: "Manage individual rooms",
        icon: "bi bi-door-open",
      },
      {
        key: "amenities",
        label: "Amenities",
        description: "Manage available amenities",
        icon: "bi bi-stars",
      },
    ],
  },
  {
    title: "Reservations",
    items: [
      {
        key: "bookings",
        label: "Bookings",
        description: "View all platform bookings",
        icon: "bi bi-calendar-check",
      },
      {
        key: "payments",
        label: "Payments",
        description: "View payment transactions",
        icon: "bi bi-credit-card",
      },
      {
        key: "reviews",
        label: "Reviews",
        description: "Moderate guest reviews",
        icon: "bi bi-star",
      },
    ],
  },
  {
    title: "Reports",
    items: [
      {
        key: "revenueReport",
        label: "Revenue Report",
        description: "Revenue by day, month, year, hotel",
        icon: "bi bi-graph-up-arrow",
      },
      {
        key: "occupancyReport",
        label: "Occupancy Report",
        description: "Occupancy rate per hotel",
        icon: "bi bi-pie-chart",
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        key: "notifications",
        label: "Notifications",
        description: "System notifications",
        icon: "bi bi-bell",
      },
    ],
  },
];

const currentNavItem = computed(() => {
  for (const group of navGroups) {
    const item = group.items.find((item) => item.key === activeView.value);
    if (item) return item;
  }
  return navGroups[0].items[0];
});

function setView(view) {
  activeView.value = view;
  sidebarOpen.value = false;
}

/* =========================================================
   DATE
========================================================= */

const todayDate = new Date();

const today = computed(() =>
  todayDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
);

/* =========================================================
   USERS
========================================================= */

const users = ref([
  { id: 1, name: "Chan Dara", email: "chan.dara@example.com", phone: "012 345 671", role: "customer", status: "active", created_at: "2026-01-14" },
  { id: 2, name: "Sara Lim", email: "sara.lim@example.com", phone: "012 345 672", role: "customer", status: "active", created_at: "2026-02-02" },
  { id: 3, name: "John Carter", email: "john.carter@example.com", phone: "012 345 673", role: "customer", status: "inactive", created_at: "2026-02-20" },
  { id: 4, name: "Ly Sreymom", email: "ly.sreymom@example.com", phone: "012 345 674", role: "customer", status: "active", created_at: "2026-03-05" },
  { id: 5, name: "Dara Manager", email: "dara@hotel.com", phone: "012 888 999", role: "hotel_manager", status: "active", created_at: "2026-01-02" },
  { id: 6, name: "Sokha Manager", email: "sokha@example.com", phone: "012 345 678", role: "hotel_manager", status: "active", created_at: "2025-11-18" },
]);

const userSearch = ref("");

const filteredUsers = computed(() => {
  const term = userSearch.value.trim().toLowerCase();
  if (!term) return users.value;

  return users.value.filter(
    (u) =>
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
  );
});

const userModal = reactive({
  open: false,
  mode: "view",
  form: {},
});

function openUserModal(user, mode) {
  userModal.form = { ...user };
  userModal.mode = mode;
  userModal.open = true;
}

function saveUser() {
  const index = users.value.findIndex((u) => u.id === userModal.form.id);
  if (index !== -1) users.value[index] = { ...userModal.form };
  userModal.open = false;
}

function toggleUserStatus(user) {
  user.status = user.status === "active" ? "inactive" : "active";
}

function deleteUser(id) {
  if (!confirm("Delete this user? This cannot be undone.")) return;
  users.value = users.value.filter((u) => u.id !== id);
}

/* =========================================================
   HOTEL MANAGERS
========================================================= */

const managers = computed(() =>
  users.value.filter((u) => u.role === "hotel_manager")
);

const managerModal = reactive({
  open: false,
  form: { name: "", email: "", phone: "", password: "" },
});

function openManagerModal() {
  managerModal.form = { name: "", email: "", phone: "", password: "" };
  managerModal.open = true;
}

function createManager() {
  if (!managerModal.form.name || !managerModal.form.email) {
    alert("Please provide at least a name and email.");
    return;
  }

  const id = Math.max(0, ...users.value.map((u) => u.id)) + 1;

  users.value.push({
    id,
    name: managerModal.form.name,
    email: managerModal.form.email,
    phone: managerModal.form.phone,
    role: "hotel_manager",
    status: "active",
    created_at: new Date().toISOString().slice(0, 10),
  });

  managerModal.open = false;
}

/* =========================================================
   HOTELS
========================================================= */

const hotels = ref([
  { id: 1, manager_id: 6, manager_name: "Sokha Manager", name: "Mekong Riverside Hotel", city: "Phnom Penh", country: "Cambodia", status: "approved", rooms: 5, created_at: "2025-11-20" },
  { id: 2, manager_id: 5, manager_name: "Dara Manager", name: "Angkor Boutique Suites", city: "Siem Reap", country: "Cambodia", status: "pending", rooms: 12, created_at: "2026-08-19" },
  { id: 3, manager_id: 5, manager_name: "Dara Manager", name: "Sihanoukville Bay Resort", city: "Sihanoukville", country: "Cambodia", status: "approved", rooms: 20, created_at: "2026-04-02" },
  { id: 4, manager_id: 6, manager_name: "Sokha Manager", name: "Battambang Heritage Inn", city: "Battambang", country: "Cambodia", status: "rejected", rooms: 8, created_at: "2026-07-11" },
]);

const hotelFilters = ["All", "pending", "approved", "rejected", "inactive"];
const hotelFilter = ref("All");

const filteredHotels = computed(() =>
  hotelFilter.value === "All"
    ? hotels.value
    : hotels.value.filter((h) => h.status === hotelFilter.value)
);

const pendingHotels = computed(() =>
  hotels.value.filter((h) => h.status === "pending")
);

const pendingHotelsCount = computed(() => pendingHotels.value.length);

function approveHotel(h) {
  h.status = "approved";
}

function rejectHotel(h) {
  h.status = "rejected";
}

function deleteHotel(id) {
  if (!confirm("Delete this hotel permanently?")) return;
  hotels.value = hotels.value.filter((h) => h.id !== id);
}

/* =========================================================
   ROOM TYPES
========================================================= */

const roomTypes = ref([
  { id: 1, hotel_id: 1, hotel_name: "Mekong Riverside Hotel", name: "Deluxe King", max_guests: 2, price_per_night: 65 },
  { id: 2, hotel_id: 1, hotel_name: "Mekong Riverside Hotel", name: "Twin Standard", max_guests: 2, price_per_night: 45 },
  { id: 3, hotel_id: 1, hotel_name: "Mekong Riverside Hotel", name: "Family Suite", max_guests: 4, price_per_night: 95 },
  { id: 4, hotel_id: 3, hotel_name: "Sihanoukville Bay Resort", name: "Ocean View Suite", max_guests: 3, price_per_night: 110 },
]);

const roomTypeModal = reactive({
  open: false,
  form: {},
});

function openRoomTypeModal(rt = null) {
  roomTypeModal.form = rt
    ? { ...rt }
    : {
        id: null,
        hotel_id: hotels.value[0]?.id,
        name: "",
        description: "",
        max_guests: 2,
        price_per_night: 50,
      };

  roomTypeModal.open = true;
}

function saveRoomType() {
  const f = roomTypeModal.form;

  if (!f.name || !f.hotel_id) {
    alert("Please complete the room type fields.");
    return;
  }

  const hotel = hotels.value.find((h) => h.id === Number(f.hotel_id));

  if (f.id) {
    const index = roomTypes.value.findIndex((r) => r.id === f.id);

    roomTypes.value[index] = {
      ...f,
      hotel_id: Number(f.hotel_id),
      hotel_name: hotel?.name,
    };
  } else {
    const id = Math.max(0, ...roomTypes.value.map((r) => r.id)) + 1;

    roomTypes.value.push({
      ...f,
      id,
      hotel_id: Number(f.hotel_id),
      hotel_name: hotel?.name,
    });
  }

  roomTypeModal.open = false;
}

function deleteRoomType(id) {
  if (!confirm("Delete this room type?")) return;
  roomTypes.value = roomTypes.value.filter((r) => r.id !== id);
}

/* =========================================================
   ROOMS
========================================================= */

const rooms = ref([
  { id: 1, hotel_id: 1, hotel_name: "Mekong Riverside Hotel", room_type: "Deluxe King", room_number: "101", floor: 1, status: "available" },
  { id: 2, hotel_id: 1, hotel_name: "Mekong Riverside Hotel", room_type: "Deluxe King", room_number: "102", floor: 1, status: "occupied" },
  { id: 3, hotel_id: 1, hotel_name: "Mekong Riverside Hotel", room_type: "Twin Standard", room_number: "201", floor: 2, status: "available" },
  { id: 4, hotel_id: 3, hotel_name: "Sihanoukville Bay Resort", room_type: "Ocean View Suite", room_number: "305", floor: 3, status: "maintenance" },
]);

const roomModal = reactive({
  open: false,
  form: {},
});

function openRoomModal() {
  roomModal.form = {
    hotel_id: hotels.value[0]?.id,
    room_type_id: roomTypes.value[0]?.id,
    room_number: "",
    floor: 1,
    status: "available",
  };

  roomModal.open = true;
}

function saveRoomAdmin() {
  const f = roomModal.form;

  if (!f.hotel_id || !f.room_type_id || !f.room_number) {
    alert("Please complete all room fields.");
    return;
  }

  const hotel = hotels.value.find((h) => h.id === Number(f.hotel_id));
  const type = roomTypes.value.find((r) => r.id === Number(f.room_type_id));
  const id = Math.max(0, ...rooms.value.map((r) => r.id)) + 1;

  rooms.value.push({
    id,
    hotel_id: Number(f.hotel_id),
    hotel_name: hotel?.name,
    room_type: type?.name,
    room_number: f.room_number,
    floor: Number(f.floor),
    status: f.status,
  });

  roomModal.open = false;
}

function deleteRoom(id) {
  if (!confirm("Delete this room?")) return;
  rooms.value = rooms.value.filter((r) => r.id !== id);
}

/* =========================================================
   AMENITIES
========================================================= */

const amenities = ref([
  { id: 1, name: "Free WiFi", icon: "bi-wifi" },
  { id: 2, name: "Parking", icon: "bi-p-square" },
  { id: 3, name: "Swimming Pool", icon: "bi-water" },
  { id: 4, name: "Air Conditioning", icon: "bi-snow" },
  { id: 5, name: "Breakfast", icon: "bi-cup-hot" },
  { id: 6, name: "Gym", icon: "bi-bicycle" },
]);

const newAmenity = ref("");

function addAmenity() {
  const value = newAmenity.value.trim();
  if (!value) return;

  const id = Math.max(0, ...amenities.value.map((a) => a.id)) + 1;
  amenities.value.push({ id, name: value, icon: "bi-check-circle" });
  newAmenity.value = "";
}

function removeAmenity(id) {
  amenities.value = amenities.value.filter((a) => a.id !== id);
}

/* =========================================================
   BOOKINGS
========================================================= */

const bookings = ref([
  { id: "BK001", guest_name: "Chan Dara", hotel_name: "Mekong Riverside Hotel", room_number: "101", check_in: "2026-09-03", check_out: "2026-09-05", total_amount: 130, status: "pending" },
  { id: "BK002", guest_name: "Sara Lim", hotel_name: "Mekong Riverside Hotel", room_number: "201", check_in: "2026-09-02", check_out: "2026-09-04", total_amount: 90, status: "confirmed" },
  { id: "BK003", guest_name: "John Carter", hotel_name: "Sihanoukville Bay Resort", room_number: "305", check_in: "2026-09-01", check_out: "2026-09-06", total_amount: 550, status: "checked_in" },
  { id: "BK004", guest_name: "Ly Sreymom", hotel_name: "Angkor Boutique Suites", room_number: "12", check_in: "2026-08-28", check_out: "2026-08-31", total_amount: 285, status: "checked_out" },
  { id: "BK005", guest_name: "Marc Dubois", hotel_name: "Mekong Riverside Hotel", room_number: "202", check_in: "2026-09-10", check_out: "2026-09-12", total_amount: 90, status: "cancelled" },
  { id: "BK006", guest_name: "Pich Sopheak", hotel_name: "Battambang Heritage Inn", room_number: "4", check_in: "2026-09-15", check_out: "2026-09-16", total_amount: 65, status: "rejected" },
]);

const bookingFilters = ["All", "pending", "confirmed", "checked_in", "checked_out", "cancelled", "rejected"];
const bookingFilter = ref("All");

const filteredBookings = computed(() =>
  bookingFilter.value === "All"
    ? bookings.value
    : bookings.value.filter((b) => b.status === bookingFilter.value)
);

/* =========================================================
   PAYMENTS
========================================================= */

const payments = ref([
  { id: 1, booking_id: "BK002", amount: 90, payment_method: "card", transaction_id: "TXN-9081", status: "paid", paid_at: "2026-08-30" },
  { id: 2, booking_id: "BK003", amount: 550, payment_method: "card", transaction_id: "TXN-9082", status: "paid", paid_at: "2026-08-29" },
  { id: 3, booking_id: "BK004", amount: 285, payment_method: "bank_transfer", transaction_id: "TXN-9070", status: "paid", paid_at: "2026-08-27" },
  { id: 4, booking_id: "BK001", amount: 130, payment_method: "card", transaction_id: "TXN-9099", status: "pending", paid_at: "-" },
  { id: 5, booking_id: "BK005", amount: 90, payment_method: "card", transaction_id: "TXN-9060", status: "failed", paid_at: "-" },
]);

/* =========================================================
   REVIEWS
========================================================= */

const reviews = ref([
  { id: 1, guest_name: "Chan Dara", hotel_name: "Mekong Riverside Hotel", rating: 5, comment: "Wonderful stay, very clean and friendly staff.", status: "approved" },
  { id: 2, guest_name: "Sara Lim", hotel_name: "Mekong Riverside Hotel", rating: 4, comment: "Good location near the river, breakfast could be better.", status: "approved" },
  { id: 3, guest_name: "Marc Dubois", hotel_name: "Sihanoukville Bay Resort", rating: 2, comment: "Room was not ready on arrival.", status: "pending" },
  { id: 4, guest_name: "Pich Sopheak", hotel_name: "Battambang Heritage Inn", rating: 1, comment: "Contains inappropriate language.", status: "hidden" },
]);

function setReviewStatus(r, status) {
  r.status = status;
}

function deleteReview(id) {
  if (!confirm("Delete this review?")) return;
  reviews.value = reviews.value.filter((r) => r.id !== id);
}

/* =========================================================
   NOTIFICATIONS
========================================================= */

const notifications = ref([
  { id: 1, title: "New hotel pending approval", message: "Angkor Boutique Suites submitted for review.", type: "hotel", is_read: false, created_at: "2026-09-03 08:12" },
  { id: 2, title: "Payment failed", message: "Transaction TXN-9060 for booking BK005 failed.", type: "payment", is_read: false, created_at: "2026-09-02 19:45" },
  { id: 3, title: "New review flagged", message: "A review on Battambang Heritage Inn was flagged by a user.", type: "review", is_read: true, created_at: "2026-09-01 14:03" },
  { id: 4, title: "Manager account created", message: "Dara Manager account was created.", type: "user", is_read: true, created_at: "2026-08-30 10:20" },
]);

const unreadCount = computed(
  () => notifications.value.filter((n) => !n.is_read).length
);

function markNotificationRead(n) {
  n.is_read = true;
}

function markAllRead() {
  notifications.value.forEach((n) => (n.is_read = true));
}

/* =========================================================
   REPORTS
========================================================= */

const revenueReportFrom = ref("2026-08-01");
const revenueReportTo = ref("2026-08-31");

const revenueByHotel = computed(() =>
  hotels.value
    .map((h) => {
      const hBookings = bookings.value.filter(
        (b) =>
          b.hotel_name === h.name &&
          b.status !== "cancelled" &&
          b.status !== "rejected"
      );

      const revenue = hBookings.reduce((sum, b) => sum + b.total_amount, 0);

      return { name: h.name, bookings: hBookings.length, revenue };
    })
    .sort((a, b) => b.revenue - a.revenue)
);

const occupancyByHotel = computed(() =>
  hotels.value.map((h) => {
    const hRooms = rooms.value.filter((r) => r.hotel_id === h.id);
    const total = hRooms.length || h.rooms || 0;
    const occupied = hRooms.filter((r) => r.status === "occupied").length;
    const rate = total ? Math.round((occupied / total) * 100) : 0;

    return { name: h.name, total, occupied, rate };
  })
);

/* =========================================================
   DASHBOARD STATS
========================================================= */

const totalRevenue = computed(() =>
  payments.value
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0)
);

const pendingBookingsCount = computed(
  () => bookings.value.filter((b) => b.status === "pending").length
);

const dashboardStats = computed(() => [
  {
    label: "Total Users",
    value: users.value.length,
    icon: "bi bi-people",
    iconClass: "green",
    meta: `${managers.value.length} hotel managers`,
  },
  {
    label: "Total Hotels",
    value: hotels.value.length,
    icon: "bi bi-building",
    iconClass: "blue",
    meta: `${pendingHotelsCount.value} pending approval`,
  },
  {
    label: "Total Rooms",
    value: rooms.value.length,
    icon: "bi bi-door-open",
    iconClass: "gold",
    meta: "Across all properties",
  },
  {
    label: "Total Bookings",
    value: bookings.value.length,
    icon: "bi bi-calendar-check",
    iconClass: "green",
    meta: `${pendingBookingsCount.value} pending`,
  },
  {
    label: "Total Revenue",
    value: `$${totalRevenue.value.toLocaleString()}`,
    icon: "bi bi-cash-stack",
    iconClass: "blue",
    meta: "From paid bookings",
  },
  {
    label: "Pending Bookings",
    value: pendingBookingsCount.value,
    icon: "bi bi-hourglass-split",
    iconClass: "red",
    meta: "Awaiting confirmation",
  },
]);

/* =========================================================
   HELPERS
========================================================= */

function initials(name) {
  return (name || "?").charAt(0).toUpperCase();
}

function downloadCSV(rows, filename) {
  const csv = rows
    .map((row) =>
      row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

function exportRevenue() {
  downloadCSV(
    [
      ["Hotel", "Bookings", "Revenue"],
      ...revenueByHotel.value.map((r) => [r.name, r.bookings, r.revenue]),
    ],
    "revenue-report.csv"
  );
}

function exportOccupancy() {
  downloadCSV(
    [
      ["Hotel", "Total Rooms", "Occupied", "Occupancy Rate"],
      ...occupancyByHotel.value.map((r) => [
        r.name,
        r.total,
        r.occupied,
        `${r.rate}%`,
      ]),
    ],
    "occupancy-report.csv"
  );
}
</script>

<style scoped>
/* =========================================================
   DESIGN SYSTEM
========================================================= */

.am-app {
  --navy: #063B32;
  --blue: #087F68;
  --blue-light: #E8F6F2;
  --sky: #39A98A;
  --ink: #17231F;
  --muted: #6B7772;
  --footer-bg: #F5F7F6;
  --line: #E1E9E5;
  --bg-soft: #F4F8F6;
  --gold: #7fad69;
  --red: #B24A38;
  --red-light: #FCEBE7;
  --amber: #9A6A00;
  --amber-light: #FFF5DC;
  --radius: 12px;

  min-height: 100vh;
  background: var(--bg-soft);
  color: var(--ink);
  display: flex;
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

/* =========================================================
   SIDEBAR
========================================================= */

.am-sidebar {
  width: 270px;
  min-width: 270px;
  height: 100vh;
  position: sticky;
  top: 0;
  background: var(--navy);
  color: white;
  display: flex;
  flex-direction: column;
  z-index: 100;
}

.am-brand {
  min-height: 82px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(255,255,255,.1);
}

.am-brand-mark {
  width: 42px;
  height: 42px;
  border-radius: 11px;
  background: var(--gold);
  color: var(--navy);
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 18px;
}

.am-brand-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.am-brand-text strong {
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.am-brand-text span {
  margin-top: 3px;
  font-size: 11px;
  color: rgba(255,255,255,.6);
}

.am-nav {
  flex: 1;
  min-height: 0;
  padding: 20px 12px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.am-nav::-webkit-scrollbar {
  display: none;
}

.am-nav-group {
  margin-bottom: 22px;
}

.am-nav-label {
  padding: 0 12px 8px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: rgba(255,255,255,.38);
}

.am-nav-item {
  width: 100%;
  border: 0;
  background: transparent;
  color: rgba(255,255,255,.68);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 12px;
  margin: 3px 0;
  border-radius: 9px;
  cursor: pointer;
  text-align: left;
  font-size: 13px;
  transition:
    background .2s ease,
    color .2s ease;
}

.am-nav-item i {
  width: 20px;
  font-size: 16px;
}

.am-nav-item:hover {
  background: rgba(255,255,255,.08);
  color: white;
}

.am-nav-item.active {
  background: var(--blue);
  color: white;
  box-shadow: 0 7px 18px rgba(8,127,104,.25);
}

.am-nav-badge {
  margin-left: auto;
  background: var(--amber-light);
  color: var(--amber);
  font-size: 9px;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 20px;
}

.am-nav-item.active .am-nav-badge {
  background: rgba(255,255,255,.25);
  color: white;
}

.am-sidebar-footer {
  padding: 15px;
  border-top: 1px solid rgba(255,255,255,.1);
}

.am-manager-mini {
  width: 100%;
  border: 0;
  background: transparent;
  color: white;
  padding: 8px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
  cursor: pointer;
  transition: background .2s ease;
}

.am-manager-mini:hover {
  background: rgba(255,255,255,.08);
}

.am-manager-info {
  flex: 1;
  min-width: 0;
}

.am-manager-mini strong {
  display: block;
  font-size: 12px;
}

.am-manager-mini span {
  display: block;
  margin-top: 3px;
  color: rgba(255,255,255,.5);
  font-size: 10px;
}

.am-manager-mini > i {
  color: rgba(255,255,255,.45);
  font-size: 11px;
}

.am-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--blue);
  color: white;
  font-weight: 700;
  flex-shrink: 0;
}

.am-mobile-close {
  display: none;
}

/* =========================================================
   MAIN
========================================================= */

.am-main {
  flex: 1;
  min-width: 0;
}

.am-topbar {
  height: 82px;
  padding: 0 30px;
  background: white;
  border-bottom: 1px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 50;
}

.am-page-heading h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 750;
  color: var(--navy);
}

.am-page-heading span {
  display: block;
  margin-top: 3px;
  color: var(--muted);
  font-size: 12px;
}

.am-topbar-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.am-icon-button {
  width: 38px;
  height: 38px;
  border: 1px solid var(--line);
  background: white;
  border-radius: 50%;
  color: var(--navy);
  cursor: pointer;
  position: relative;
}

.am-notification-dot {
  position: absolute;
  top: 7px;
  right: 7px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--gold);
}

.am-user {
  display: flex;
  align-items: center;
  gap: 9px;
}

.am-user-info {
  min-width: 130px;
}

.am-user-info strong {
  display: block;
  color: var(--ink);
  font-size: 12px;
}

.am-user-info span {
  display: block;
  margin-top: 3px;
  color: var(--muted);
  font-size: 10px;
}

.am-user > i {
  color: var(--muted);
  font-size: 11px;
}

.am-menu-button {
  display: none;
  border: 0;
  background: transparent;
  font-size: 23px;
  color: var(--navy);
}

/* =========================================================
   CONTENT
========================================================= */

.am-content {
  padding: 32px;
  max-width: 1600px;
  margin: auto;
  width: 100%;
}

.am-welcome,
.am-section-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
  margin-bottom: 26px;
}

.am-eyebrow {
  display: block;
  color: var(--blue);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.4px;
  margin-bottom: 7px;
}

.am-welcome h2,
.am-section-heading h2 {
  margin: 0;
  font-size: 27px;
  color: var(--navy);
  letter-spacing: -.5px;
}

.am-welcome p,
.am-section-heading p {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 13px;
}

.am-date {
  background: white;
  border: 1px solid var(--line);
  border-radius: 9px;
  padding: 10px 14px;
  color: var(--muted);
  font-size: 12px;
}

.am-date i {
  color: var(--blue);
  margin-right: 6px;
}

/* =========================================================
   BUTTONS
========================================================= */

.am-primary-button,
.am-secondary-button {
  border: 0;
  border-radius: 9px;
  padding: 11px 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: .2s ease;
}

.am-primary-button {
  background: var(--blue);
  color: white;
  box-shadow: 0 5px 14px rgba(8,127,104,.18);
}

.am-primary-button:hover {
  background: var(--navy);
  transform: translateY(-1px);
}

.am-secondary-button {
  background: var(--blue-light);
  color: var(--blue);
}

.am-secondary-button:hover {
  background: #d9eee8;
}

.am-link-button {
  border: 0;
  background: transparent;
  color: var(--blue);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.am-link-button i {
  margin-left: 4px;
}

/* =========================================================
   STATS
========================================================= */

.am-stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-bottom: 20px;
}

.am-stat-card,
.am-card {
  background: white;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: 0 4px 18px rgba(6,59,50,.035);
}

.am-stat-card {
  padding: 20px;
}

.am-stat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--muted);
  font-size: 12px;
  font-weight: 600;
}

.am-stat-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: grid;
  place-items: center;
}

.am-stat-icon.green {
  background: var(--blue-light);
  color: var(--blue);
}

.am-stat-icon.blue {
  background: #EAF5F2;
  color: var(--sky);
}

.am-stat-icon.gold {
  background: var(--amber-light);
  color: var(--amber);
}

.am-stat-icon.red {
  background: var(--red-light);
  color: var(--red);
}

.am-stat-value {
  margin-top: 14px;
  font-size: 28px;
  font-weight: 800;
  color: var(--navy);
}

.am-stat-meta {
  margin-top: 8px;
  display: flex;
  gap: 7px;
  align-items: center;
  color: var(--muted);
  font-size: 10px;
}

.neutral {
  color: var(--muted);
}

/* =========================================================
   CARDS
========================================================= */

.am-card {
  padding: 22px;
}

.am-report-filters-card {
  margin-bottom: 20px;
}

.am-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 20px;
}

.am-card-header h3 {
  margin: 0;
  color: var(--navy);
  font-size: 15px;
}

.am-card-header p {
  margin: 5px 0 0;
  color: var(--muted);
  font-size: 11px;
}

/* =========================================================
   TABLE
========================================================= */

.am-table-wrap {
  width: 100%;
  overflow-x: auto;
}

.am-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 760px;
}

.am-table th {
  text-align: left;
  padding: 10px 12px;
  border-bottom: 1px solid var(--line);
  color: var(--muted);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .6px;
}

.am-table td {
  padding: 13px 12px;
  border-bottom: 1px solid var(--line);
  font-size: 12px;
  color: var(--muted);
}

.am-table tbody tr:last-child td {
  border-bottom: 0;
}

.am-table td strong {
  color: var(--ink);
}

.text-right {
  text-align: right !important;
}

.am-cell-user {
  display: flex;
  align-items: center;
  gap: 9px;
}

.am-cell-user > div:last-child {
  display: flex;
  flex-direction: column;
}

.am-cell-user span {
  margin-top: 2px;
  font-size: 9px;
  color: var(--muted);
}

.am-cell-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--blue-light);
  color: var(--blue);
  display: grid;
  place-items: center;
  font-weight: 700;
  flex-shrink: 0;
}

.am-status {
  display: inline-flex;
  padding: 5px 8px;
  border-radius: 20px;
  font-size: 9px;
  font-weight: 700;
}

.am-status.pending,
.am-status.hidden {
  background: var(--amber-light);
  color: var(--amber);
}

.am-status.confirmed,
.am-status.approved,
.am-status.active,
.am-status.paid {
  background: var(--blue-light);
  color: var(--blue);
}

.am-status.checked_in {
  background: #DDF2EA;
  color: #247253;
}

.am-status.checked_out,
.am-status.inactive {
  background: #EEF2F0;
  color: #5D6964;
}

.am-status.cancelled,
.am-status.rejected,
.am-status.failed {
  background: var(--red-light);
  color: var(--red);
}

.am-table-action {
  width: 31px;
  height: 31px;
  border: 1px solid var(--line);
  background: white;
  border-radius: 7px;
  color: var(--blue);
  cursor: pointer;
}

.am-table-action:hover {
  background: var(--blue-light);
}

.am-table-action.danger {
  color: var(--red);
}

.am-table-actions {
  display: flex;
  justify-content: flex-end;
  gap: 5px;
}

.am-table-empty {
  text-align: center !important;
  padding: 40px !important;
}

.am-status-select {
  border: 1px solid var(--line);
  background: white;
  border-radius: 7px;
  padding: 7px 9px;
  color: var(--ink);
  font-size: 10px;
  outline: 0;
}

/* =========================================================
   FILTERS / TOOLBAR
========================================================= */

.am-filters {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}

.am-filters button {
  border: 1px solid var(--line);
  background: white;
  color: var(--muted);
  border-radius: 20px;
  padding: 8px 13px;
  font-size: 10px;
  font-weight: 650;
  cursor: pointer;
}

.am-filters button:hover,
.am-filters button.active {
  background: var(--blue);
  border-color: var(--blue);
  color: white;
}

.am-toolbar {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 18px;
  flex-wrap: wrap;
}

.am-search {
  position: relative;
  flex: 1;
  min-width: 200px;
  max-width: 320px;
}

.am-search input {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--line);
  border-radius: 9px;
  padding: 10px 12px 10px 34px;
  font-size: 12px;
  outline: 0;
}

.am-search input:focus {
  border-color: var(--blue);
  box-shadow: 0 0 0 3px var(--blue-light);
}

.am-search i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted);
  font-size: 12px;
}

/* =========================================================
   FORMS
========================================================= */

.am-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.am-form-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.am-form-group.full {
  grid-column: 1 / -1;
}

.am-form-group label {
  color: var(--ink);
  font-size: 11px;
  font-weight: 700;
}

.am-input {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--line);
  border-radius: 9px;
  background: white;
  color: var(--ink);
  padding: 11px 12px;
  outline: none;
  font-size: 12px;
  transition: border .2s ease, box-shadow .2s ease;
  font-family: inherit;
}

.am-input:focus {
  border-color: var(--blue);
  box-shadow: 0 0 0 3px var(--blue-light);
}

.am-textarea {
  resize: vertical;
}

/* =========================================================
   AMENITIES
========================================================= */

.am-add-row {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
}

.am-add-row .am-input {
  flex: 1;
}

.am-chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.am-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 10px 9px 12px;
  border-radius: 30px;
  background: var(--blue-light);
  color: var(--blue);
  font-size: 11px;
  font-weight: 600;
}

.am-chip i:first-child {
  font-size: 11px;
}

.am-chip button {
  border: 0;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  padding: 0;
}

/* =========================================================
   REVIEWS
========================================================= */

.review-star {
  color: #B27A00;
  font-size: 10px;
}

.review-comment {
  max-width: 260px;
}

/* =========================================================
   REPORTS
========================================================= */

.am-report-hotel-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid var(--line);
}

.am-report-hotel-row:last-child {
  border-bottom: 0;
}

.am-report-hotel {
  display: flex;
  align-items: center;
  gap: 11px;
}

.am-report-hotel-icon {
  width: 38px;
  height: 38px;
  border-radius: 9px;
  background: var(--blue-light);
  color: var(--blue);
  display: grid;
  place-items: center;
}

.am-report-hotel strong {
  display: block;
  color: var(--ink);
  font-size: 12px;
}

.am-report-hotel span {
  display: block;
  margin-top: 3px;
  color: var(--muted);
  font-size: 10px;
}

.am-report-amount {
  color: var(--navy);
  font-size: 14px;
}

.am-occupancy-bar-row {
  display: grid;
  grid-template-columns: 150px 1fr 50px;
  align-items: center;
  gap: 14px;
  padding: 11px 0;
}

.am-occupancy-bar-row strong {
  font-size: 12px;
  color: var(--ink);
}

.am-occupancy-track {
  height: 9px;
  background: var(--blue-light);
  border-radius: 10px;
  overflow: hidden;
}

.am-occupancy-fill {
  height: 100%;
  background: var(--blue);
  border-radius: inherit;
}

.am-occupancy-pct {
  text-align: right;
  font-size: 11px;
  font-weight: 700;
  color: var(--navy);
}

/* =========================================================
   NOTIFICATIONS
========================================================= */

.am-notif-list {
  display: flex;
  flex-direction: column;
}

.am-notif-row {
  display: flex;
  gap: 14px;
  padding: 16px 4px;
  border-bottom: 1px solid var(--line);
}

.am-notif-row:last-child {
  border-bottom: 0;
}

.am-notif-row.unread {
  background: var(--blue-light);
  border-radius: 9px;
  padding-left: 14px;
  padding-right: 14px;
}

.am-notif-icon {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: white;
  color: var(--blue);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.am-notif-body {
  flex: 1;
}

.am-notif-body strong {
  display: block;
  color: var(--ink);
  font-size: 12px;
}

.am-notif-body p {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 11px;
}

.am-notif-side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.am-notif-time {
  color: var(--muted);
  font-size: 10px;
  white-space: nowrap;
}

/* =========================================================
   EMPTY
========================================================= */

.am-empty-state {
  padding: 70px 20px;
  background: white;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  text-align: center;
}

.am-empty-state i {
  color: var(--blue);
  font-size: 35px;
}

.am-empty-state h3 {
  margin: 12px 0 5px;
  color: var(--navy);
  font-size: 16px;
}

.am-empty-state p {
  margin: 0;
  color: var(--muted);
  font-size: 11px;
}

/* =========================================================
   MODAL
========================================================= */

.am-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(6,59,50,.55);
  backdrop-filter: blur(3px);
  display: grid;
  place-items: center;
  padding: 20px;
  z-index: 500;
}

.am-modal {
  width: min(600px, 100%);
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 25px 70px rgba(6,59,50,.2);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.am-modal-header {
  padding: 22px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid var(--line);
}

.am-modal-header h3 {
  margin: 0;
  color: var(--navy);
  font-size: 20px;
}

.am-modal-close {
  width: 35px;
  height: 35px;
  border: 0;
  border-radius: 8px;
  background: var(--bg-soft);
  color: var(--muted);
  cursor: pointer;
  flex-shrink: 0;
}

.am-modal-body {
  padding: 22px;
  overflow-y: auto;
}

.am-modal-footer {
  padding: 15px 22px;
  border-top: 1px solid var(--line);
  background: var(--footer-bg);
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.am-detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 20px;
}

.am-detail-grid div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.am-detail-grid span {
  color: var(--muted);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .5px;
}

.am-detail-grid strong {
  color: var(--ink);
  font-size: 13px;
}

/* =========================================================
   OVERLAY
========================================================= */

.am-overlay {
  display: none;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1200px) {
  .am-stat-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .am-sidebar {
    position: fixed;
    left: -280px;
    top: 0;
    bottom: 0;
    transition: left .25s ease;
  }

  .am-sidebar--open {
    left: 0;
  }

  .am-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.35);
    z-index: 90;
  }

  .am-menu-button {
    display: block;
  }

  .am-topbar {
    padding: 0 20px;
    gap: 15px;
  }

  .am-page-heading {
    flex: 1;
  }

  .am-user-info {
    display: none;
  }

  .am-content {
    padding: 22px;
  }
}

@media (max-width: 650px) {
  .am-content {
    padding: 16px;
  }

  .am-topbar {
    height: 70px;
    padding: 0 15px;
  }

  .am-page-heading h1 {
    font-size: 16px;
  }

  .am-page-heading span {
    font-size: 10px;
  }

  .am-icon-button {
    display: none;
  }

  .am-welcome,
  .am-section-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .am-welcome h2,
  .am-section-heading h2 {
    font-size: 22px;
  }

  .am-stat-grid {
    grid-template-columns: 1fr;
  }

  .am-form-grid {
    grid-template-columns: 1fr;
  }

  .am-form-group.full {
    grid-column: auto;
  }

  .am-detail-grid {
    grid-template-columns: 1fr;
  }

  .am-add-row {
    flex-direction: column;
  }

  .am-occupancy-bar-row {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .am-occupancy-pct {
    text-align: left;
  }

  .am-section-heading .am-primary-button,
  .am-section-heading .am-secondary-button {
    width: 100%;
  }
}
</style>