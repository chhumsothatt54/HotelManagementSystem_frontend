<template>
  <div class="hm-app">
    <!-- Mobile Overlay -->
    <div
      v-if="sidebarOpen"
      class="hm-overlay"
      @click="sidebarOpen = false"
    ></div>

    <!-- Sidebar -->
    <aside
      class="hm-sidebar"
      :class="{ 'hm-sidebar--open': sidebarOpen }"
    >
      <!-- Brand -->
      <div class="hm-brand">
        <div class="hm-brand-mark">
          {{ hotel.name?.charAt(0) || "H" }}
        </div>

        <div class="hm-brand-text">
          <strong>{{ hotel.name }}</strong>
          <span>Manager Portal</span>
        </div>

        <button
          class="hm-mobile-close"
          type="button"
          aria-label="Close menu"
          @click="sidebarOpen = false"
        >
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="hm-nav">
        <div
          v-for="group in navGroups"
          :key="group.title"
          class="hm-nav-group"
        >
          <div class="hm-nav-label">
            {{ group.title }}
          </div>

          <button
            v-for="item in group.items"
            :key="item.key"
            type="button"
            class="hm-nav-item"
            :class="{ active: activeView === item.key }"
            @click="setView(item.key)"
          >
            <i :class="item.icon"></i>
            <span>{{ item.label }}</span>
          </button>
        </div>
      </nav>

      <!-- Sidebar Footer -->
      <div class="hm-sidebar-footer">
        <button
          type="button"
          class="hm-manager-mini"
          @click="setView('managerProfile')"
        >
          <div class="hm-avatar">M</div>

          <div class="hm-manager-info">
            <strong>Sokha Manager</strong>
            <span>Hotel Manager</span>
          </div>

          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </aside>

    <!-- Main -->
    <main class="hm-main">
      <!-- Topbar -->
      <header class="hm-topbar">
        <button
          class="hm-menu-button"
          type="button"
          aria-label="Open menu"
          @click="sidebarOpen = true"
        >
          <i class="bi bi-list"></i>
        </button>

        <div class="hm-page-heading">
          <h1>{{ currentNavItem.label }}</h1>
          <span>{{ currentNavItem.description }}</span>
        </div>

        <div class="hm-topbar-actions">
          <button
            type="button"
            class="hm-icon-button"
            aria-label="Notifications"
          >
            <i class="bi bi-bell"></i>
            <span class="notification-dot"></span>
          </button>

          <div class="hm-user">
            <div class="hm-avatar">M</div>

            <div class="hm-user-info">
              <strong>Sokha Manager</strong>
              <span>{{ hotel.name }}</span>
            </div>

            <i class="bi bi-chevron-down"></i>
          </div>
        </div>
      </header>

      <!-- Content -->
      <section class="hm-content">

        <!-- ================= DASHBOARD ================= -->
        <div v-if="activeView === 'dashboard'">

          <div class="hm-welcome">
            <div>
              <span class="hm-eyebrow">OVERVIEW</span>
              <h2>Welcome back, Manager</h2>
              <p>
                Here is what's happening at {{ hotel.name }} today.
              </p>
            </div>

            <div class="hm-date">
              <i class="bi bi-calendar3"></i>
              {{ today }}
            </div>
          </div>

          <!-- Stats -->
          <div class="hm-stat-grid">
            <div
              v-for="stat in dashboardStats"
              :key="stat.label"
              class="hm-stat-card"
            >
              <div class="hm-stat-top">
                <span>{{ stat.label }}</span>

                <div
                  class="hm-stat-icon"
                  :class="stat.iconClass"
                >
                  <i :class="stat.icon"></i>
                </div>
              </div>

              <div class="hm-stat-value">
                {{ stat.value }}
              </div>

              <div class="hm-stat-meta">
                <span :class="stat.trendClass">
                  <i :class="stat.trendIcon"></i>
                  {{ stat.change }}
                </span>
                <span>{{ stat.period }}</span>
              </div>
            </div>
          </div>

          <!-- Dashboard Grid -->
          <div class="hm-dashboard-grid">

            <!-- Recent Bookings -->
            <div class="hm-card hm-card-large">
              <div class="hm-card-header">
                <div>
                  <h3>Recent Bookings</h3>
                  <p>Latest reservations at your property</p>
                </div>

                <button
                  class="hm-link-button"
                  type="button"
                  @click="setView('bookings')"
                >
                  View all
                  <i class="bi bi-arrow-right"></i>
                </button>
              </div>

              <div class="hm-table-wrap">
                <table class="hm-table">
                  <thead>
                    <tr>
                      <th>Guest</th>
                      <th>Room</th>
                      <th>Stay</th>
                      <th>Status</th>
                      <th class="text-right">Amount</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-for="booking in bookings.slice(0, 5)"
                      :key="booking.id"
                    >
                      <td>
                        <div class="guest-cell">
                          <div class="guest-avatar">
                            {{ booking.guest.charAt(0) }}
                          </div>

                          <div>
                            <strong>{{ booking.guest }}</strong>
                            <span>#{{ booking.id }}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <strong>{{ booking.room }}</strong>
                      </td>

                      <td>
                        <div class="stay-cell">
                          <span>{{ booking.checkIn }}</span>
                          <i class="bi bi-arrow-right"></i>
                          <span>{{ booking.checkOut }}</span>
                        </div>
                      </td>

                      <td>
                        <span
                          class="hm-status"
                          :class="statusClass(booking.status)"
                        >
                          {{ booking.status }}
                        </span>
                      </td>

                      <td class="text-right">
                        <strong>${{ booking.amount }}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Occupancy -->
            <div class="hm-card occupancy-card">
              <div class="hm-card-header">
                <div>
                  <h3>Occupancy</h3>
                  <p>Current room utilization</p>
                </div>

                <i class="bi bi-bar-chart-line hm-card-header-icon"></i>
              </div>

              <div class="occupancy-content">
                <div
                  class="occupancy-ring"
                  :style="ringStyle(occupancyRate)"
                >
                  <div class="occupancy-ring-inner">
                    <strong>{{ occupancyRate }}%</strong>
                    <span>Occupied</span>
                  </div>
                </div>

                <div class="occupancy-summary">
                  <div>
                    <span class="legend-dot occupied"></span>
                    <span>Occupied</span>
                    <strong>{{ occupiedRooms }}</strong>
                  </div>

                  <div>
                    <span class="legend-dot available"></span>
                    <span>Available</span>
                    <strong>{{ totalRooms - occupiedRooms }}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Revenue Chart -->
          <div class="hm-card revenue-chart-card">
            <div class="hm-card-header">
              <div>
                <h3>Weekly Revenue</h3>
                <p>Revenue performance for the last 7 days</p>
              </div>

              <div class="revenue-total">
                <span>This week</span>
                <strong>${{ weekRevenueTotal }}</strong>
              </div>
            </div>

            <div class="hm-bar-chart">
              <div
                v-for="item in weekRevenue"
                :key="item.day"
                class="hm-bar-column"
              >
                <span class="bar-value">
                  ${{ item.amount }}
                </span>

                <div class="bar-track">
                  <div
                    class="bar-fill"
                    :style="{ height: `${barHeight(item.amount)}%` }"
                  ></div>
                </div>

                <span class="bar-label">
                  {{ item.day }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- ================= HOTEL PROFILE ================= -->
        <div v-if="activeView === 'profile'">

          <div class="hm-section-heading">
            <div>
              <span class="hm-eyebrow">PROPERTY SETUP</span>
              <h2>Hotel Profile</h2>
              <p>Manage your hotel's basic information.</p>
            </div>

            <button
              type="button"
              class="hm-primary-button"
              @click="saveHotel"
            >
              <i class="bi bi-check-lg"></i>
              Save Changes
            </button>
          </div>

          <div class="hm-card">
            <div class="hm-form-grid">

              <div class="hm-form-group full">
                <label>Hotel Name</label>
                <input
                  v-model="hotel.name"
                  type="text"
                  class="hm-input"
                />
              </div>

              <div class="hm-form-group">
                <label>Phone</label>
                <input
                  v-model="hotel.phone"
                  type="text"
                  class="hm-input"
                />
              </div>

              <div class="hm-form-group">
                <label>Email</label>
                <input
                  v-model="hotel.email"
                  type="email"
                  class="hm-input"
                />
              </div>

              <div class="hm-form-group full">
                <label>Address</label>
                <input
                  v-model="hotel.address"
                  type="text"
                  class="hm-input"
                />
              </div>

              <div class="hm-form-group">
                <label>Check-in Time</label>
                <input
                  v-model="hotel.checkIn"
                  type="time"
                  class="hm-input"
                />
              </div>

              <div class="hm-form-group">
                <label>Check-out Time</label>
                <input
                  v-model="hotel.checkOut"
                  type="time"
                  class="hm-input"
                />
              </div>

              <div class="hm-form-group full">
                <label>Description</label>
                <textarea
                  v-model="hotel.description"
                  class="hm-input hm-textarea"
                  rows="5"
                ></textarea>
              </div>

            </div>
          </div>
        </div>

        <!-- ================= HOTEL IMAGES ================= -->
        <div v-if="activeView === 'hotelImages'">

          <div class="hm-section-heading">
            <div>
              <span class="hm-eyebrow">PROPERTY SETUP</span>
              <h2>Hotel Images</h2>
              <p>Manage the images displayed for your hotel.</p>
            </div>

            <label class="hm-primary-button upload-button">
              <i class="bi bi-cloud-arrow-up"></i>
              Upload Images
              <input
                type="file"
                multiple
                accept="image/*"
                hidden
                @change="onUploadHotelImage"
              />
            </label>
          </div>

          <div class="hm-image-grid">
            <div
              v-for="(image, index) in hotelImages"
              :key="image.id"
              class="hm-image-card"
            >
              <img
                :src="image.url"
                :alt="`Hotel image ${index + 1}`"
              />

              <div class="hm-image-overlay">
                <span>
                  Image {{ index + 1 }}
                </span>

                <button
                  type="button"
                  class="hm-delete-button"
                  @click="removeHotelImage(index)"
                >
                  <i class="bi bi-trash3"></i>
                </button>
              </div>
            </div>
          </div>

          <div
            v-if="!hotelImages.length"
            class="hm-empty-state"
          >
            <i class="bi bi-images"></i>
            <h3>No hotel images</h3>
            <p>Upload images to showcase your property.</p>
          </div>
        </div> 

        <!-- ================= ROOMS ================= -->
        <div v-if="activeView === 'rooms'">

          <div class="hm-section-heading">
            <div>
              <span class="hm-eyebrow">ROOM MANAGEMENT</span>
              <h2>Rooms</h2>
              <p>Manage individual rooms and their availability.</p>
            </div>

            <button
              type="button"
              class="hm-primary-button"
              @click="openRoomModal()"
            >
              <i class="bi bi-plus-lg"></i>
              Add Room
            </button>
          </div>

          <div class="hm-card">
            <div class="hm-table-wrap">
              <table class="hm-table">
                <thead>
                  <tr>
                    <th>Room</th>
                    <th>Floor</th>
                    <th>Room Type</th>
                    <th>Status</th>
                    <th class="text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="room in rooms"
                    :key="room.id"
                  >
                    <td>
                      <strong class="room-number">
                        {{ room.number }}
                      </strong>
                    </td>

                    <td>
                      Floor {{ room.floor }}
                    </td>

                    <td>
                      {{ room.type }}
                    </td>

                    <td>
                      <span
                        class="hm-status"
                        :class="roomStatusClass(room.status)"
                      >
                        {{ room.status }}
                      </span>
                    </td>

                    <td class="text-right">
                      <div class="table-actions">
                        <button
                          type="button"
                          class="hm-table-action"
                          @click="openRoomModal(room)"
                        >
                          <i class="bi bi-pencil"></i>
                        </button>

                        <button
                          type="button"
                          class="hm-table-action danger"
                          @click="removeRoom(room.id)"
                        >
                          <i class="bi bi-trash3"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ================= ROOM TYPES ================= -->
        <div v-if="activeView === 'roomTypes'">

          <div class="hm-section-heading">
            <div>
              <span class="hm-eyebrow">ROOM MANAGEMENT</span>
              <h2>Room Types</h2>
              <p>Configure room categories and specifications.</p>
            </div>

            <button
              type="button"
              class="hm-primary-button"
              @click="addRoomType"
            >
              <i class="bi bi-plus-lg"></i>
              Add Room Type
            </button>
          </div>

          <div class="hm-room-type-grid">
            <div
              v-for="type in roomTypes"
              :key="type.id"
              class="hm-room-type-card"
            >
              <div class="room-type-icon">
                <i class="bi bi-door-open"></i>
              </div>

              <div class="room-type-content">
                <input
                  v-model="type.name"
                  class="hm-inline-input title"
                  type="text"
                />

                <div class="room-type-details">

                  <div>
                    <i class="bi bi-people"></i>
                    <span>Capacity</span>
                    <strong>{{ type.capacity }}</strong>
                  </div>

                  <div>
                    <i class="bi bi-aspect-ratio"></i>
                    <span>Size</span>
                    <strong>{{ type.size }} m²</strong>
                  </div>

                  <div>
                    <i class="bi bi-bed"></i>
                    <span>Bed</span>
                    <strong>{{ type.bed }}</strong>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ================= ROOM IMAGES ================= -->
        <div v-if="activeView === 'roomImages'">

          <div class="hm-section-heading">
            <div>
              <span class="hm-eyebrow">ROOM MANAGEMENT</span>
              <h2>Room Images</h2>
              <p>Upload images for each room type.</p>
            </div>
          </div>

          <div class="hm-card">
            <div class="hm-form-group">
              <label>Select Room Type</label>

              <select
                v-model="selectedRoomTypeForImages"
                class="hm-input"
              >
                <option
                  v-for="type in roomTypes"
                  :key="type.id"
                  :value="type.name"
                >
                  {{ type.name }}
                </option>
              </select>
            </div>

            <label class="hm-upload-zone">
              <i class="bi bi-cloud-arrow-up"></i>
              <strong>Upload room images</strong>
              <span>PNG, JPG or WEBP</span>

              <input
                type="file"
                multiple
                accept="image/*"
                hidden
                @change="onUploadRoomImage"
              />
            </label>

            <div
              v-if="selectedRoomImages.length"
              class="hm-image-grid room-image-grid"
            >
              <div
                v-for="(image, index) in selectedRoomImages"
                :key="image.id"
                class="hm-image-card"
              >
                <img
                  :src="image.url"
                  :alt="selectedRoomTypeForImages"
                />

                <button
                  type="button"
                  class="hm-delete-button floating"
                  @click="removeRoomImage(index)"
                >
                  <i class="bi bi-trash3"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ================= AMENITIES ================= -->
        <div v-if="activeView === 'amenities'">

          <div class="hm-section-heading">
            <div>
              <span class="hm-eyebrow">ROOM MANAGEMENT</span>
              <h2>Amenities</h2>
              <p>Manage the facilities available to your guests.</p>
            </div>
          </div>

          <div class="hm-card">
            <div class="hm-add-row">
              <input
                v-model="newAmenity"
                type="text"
                class="hm-input"
                placeholder="Add a new amenity..."
                @keyup.enter="addAmenity"
              />

              <button
                type="button"
                class="hm-primary-button"
                @click="addAmenity"
              >
                <i class="bi bi-plus-lg"></i>
                Add
              </button>
            </div>

            <div class="hm-amenity-list">
              <div
                v-for="(amenity, index) in amenities"
                :key="amenity"
                class="hm-amenity-chip"
              >
                <i class="bi bi-check-circle-fill"></i>
                <span>{{ amenity }}</span>

                <button
                  type="button"
                  @click="removeAmenity(index)"
                >
                  <i class="bi bi-x"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ================= PRICING ================= -->
        <div v-if="activeView === 'pricing'">

          <div class="hm-section-heading">
            <div>
              <span class="hm-eyebrow">ROOM MANAGEMENT</span>
              <h2>Pricing</h2>
              <p>Configure your room rates and seasonal pricing.</p>
            </div>

            <button
              type="button"
              class="hm-primary-button"
              @click="savePricing"
            >
              <i class="bi bi-check-lg"></i>
              Save Pricing
            </button>
          </div>

          <div class="hm-card">
            <div class="hm-table-wrap">
              <table class="hm-table pricing-table">
                <thead>
                  <tr>
                    <th>Room Type</th>
                    <th>Base Rate</th>
                    <th>Weekend Rate</th>
                    <th>Peak Rate</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="price in pricing"
                    :key="price.type"
                  >
                    <td>
                      <strong>{{ price.type }}</strong>
                    </td>

                    <td>
                      <div class="price-input">
                        <span>$</span>
                        <input
                          v-model.number="price.base"
                          type="number"
                          min="0"
                        />
                      </div>
                    </td>

                    <td>
                      <div class="price-input">
                        <span>$</span>
                        <input
                          v-model.number="price.weekend"
                          type="number"
                          min="0"
                        />
                      </div>
                    </td>

                    <td>
                      <div class="price-input">
                        <span>$</span>
                        <input
                          v-model.number="price.peak"
                          type="number"
                          min="0"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>


        <!-- ================= MANAGER PROFILE ================= -->
        <div v-if="activeView === 'managerProfile'">

          <div class="hm-section-heading">
            <div>
              <span class="hm-eyebrow">ACCOUNT</span>
              <h2>My Profile</h2>
              <p>Manage your personal information and account settings.</p>
            </div>

            <button
              type="button"
              class="hm-primary-button"
              @click="saveManagerProfile"
            >
              <i class="bi bi-check-lg"></i>
              Save Changes
            </button>
          </div>

          <div class="hm-profile-layout">

            <!-- Profile Card -->
            <div class="hm-card hm-profile-card">

              <div class="hm-profile-avatar">
                M
              </div>

              <h3>Sokha Manager</h3>
              <span class="hm-profile-role">
                Hotel Manager
              </span>

              <div class="hm-profile-hotel">
                <i class="bi bi-building"></i>
                <span>{{ hotel.name }}</span>
              </div>

            </div>

            <!-- Profile Form -->
            <div class="hm-card">
              <div class="hm-card-header">
                <div>
                  <h3>Personal Information</h3>
                  <p>Update your account information.</p>
                </div>
              </div>

              <div class="hm-form-grid">

                <div class="hm-form-group">
                  <label>First Name</label>

                  <input
                    v-model="manager.firstName"
                    type="text"
                    class="hm-input"
                  />
                </div>

                <div class="hm-form-group">
                  <label>Last Name</label>

                  <input
                    v-model="manager.lastName"
                    type="text"
                    class="hm-input"
                  />
                </div>

                <div class="hm-form-group">
                  <label>Email</label>

                  <input
                    v-model="manager.email"
                    type="email"
                    class="hm-input"
                  />
                </div>

                <div class="hm-form-group">
                  <label>Phone</label>

                  <input
                    v-model="manager.phone"
                    type="text"
                    class="hm-input"
                  />
                </div>

                <div class="hm-form-group full">
                  <label>Role</label>

                  <input
                    value="Hotel Manager"
                    type="text"
                    class="hm-input"
                    disabled
                  />
                </div>

              </div>
            </div>

          </div>

          <!-- Security -->
          <div class="hm-card hm-security-card">

            <div class="hm-card-header">
              <div>
                <h3>Security</h3>
                <p>Manage your account security.</p>
              </div>
            </div>

            <div class="hm-security-row">

              <div class="security-icon">
                <i class="bi bi-lock"></i>
              </div>

              <div class="security-content">
                <strong>Password</strong>
                <span>
                  Last updated recently
                </span>
              </div>

              <button
                type="button"
                class="hm-secondary-button"
                @click="changePassword"
              >
                Change Password
              </button>

            </div>

          </div>

        </div>

        <!-- ================= BOOKINGS ================= -->
        <div v-if="activeView === 'bookings'">

          <div class="hm-section-heading">
            <div>
              <span class="hm-eyebrow">RESERVATIONS</span>
              <h2>Bookings</h2>
              <p>Review and manage guest reservations.</p>
            </div>
          </div>

          <div class="booking-filters">
            <button
              v-for="filter in bookingFilters"
              :key="filter"
              type="button"
              :class="{ active: bookingFilter === filter }"
              @click="bookingFilter = filter"
            >
              {{ filter }}
            </button>
          </div>

          <div class="hm-card">
            <div class="hm-table-wrap">
              <table class="hm-table">
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>Room</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th class="text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="booking in filteredBookings"
                    :key="booking.id"
                  >
                    <td>
                      <div class="guest-cell">
                        <div class="guest-avatar">
                          {{ booking.guest.charAt(0) }}
                        </div>

                        <strong>{{ booking.guest }}</strong>
                      </div>
                    </td>

                    <td>{{ booking.room }}</td>
                    <td>{{ booking.checkIn }}</td>
                    <td>{{ booking.checkOut }}</td>

                    <td>
                      <span
                        class="hm-status"
                        :class="statusClass(booking.status)"
                      >
                        {{ booking.status }}
                      </span>
                    </td>

                    <td>
                      <strong>${{ booking.amount }}</strong>
                    </td>

                    <td class="text-right">
                      <select
                        v-model="booking.status"
                        class="hm-status-select"
                      >
                        <option>Pending</option>
                        <option>Confirmed</option>
                        <option>Checked-in</option>
                        <option>Checked-out</option>
                        <option>Cancelled</option>
                        <option>Rejected</option>
                      </select>
                    </td>
                  </tr>

                  <tr v-if="!filteredBookings.length">
                    <td
                      colspan="7"
                      class="table-empty"
                    >
                      No bookings found.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ================= REVENUE ================= -->
        <div v-if="activeView === 'revenue'">

          <div class="hm-section-heading">
            <div>
              <span class="hm-eyebrow">INSIGHTS</span>
              <h2>Revenue</h2>
              <p>Monitor your hotel's financial performance.</p>
            </div>
          </div>

          <div class="hm-stat-grid three">

            <div class="hm-stat-card">
              <div class="hm-stat-top">
                <span>Total Revenue</span>
                <div class="hm-stat-icon green">
                  <i class="bi bi-cash-stack"></i>
                </div>
              </div>

              <div class="hm-stat-value">
                ${{ totalRevenue }}
              </div>

              <div class="hm-stat-meta">
                <span class="positive">
                  <i class="bi bi-arrow-up"></i>
                  12.5%
                </span>
                <span>vs last month</span>
              </div>
            </div>

            <div class="hm-stat-card">
              <div class="hm-stat-top">
                <span>Average Daily</span>
                <div class="hm-stat-icon blue">
                  <i class="bi bi-calendar2-week"></i>
                </div>
              </div>

              <div class="hm-stat-value">
                ${{ avgDailyRevenue }}
              </div>

              <div class="hm-stat-meta">
                <span>Daily average</span>
              </div>
            </div>

            <div class="hm-stat-card">
              <div class="hm-stat-top">
                <span>Average Booking</span>
                <div class="hm-stat-icon gold">
                  <i class="bi bi-receipt"></i>
                </div>
              </div>

              <div class="hm-stat-value">
                ${{ avgRevPerBooking }}
              </div>

              <div class="hm-stat-meta">
                <span>Per reservation</span>
              </div>
            </div>

          </div>

          <div class="hm-card">
            <div class="hm-card-header">
              <div>
                <h3>Revenue by Room Type</h3>
                <p>Performance breakdown</p>
              </div>
            </div>

            <div class="hm-revenue-list">
              <div
                v-for="item in revenueByType"
                :key="item.type"
                class="hm-revenue-row"
              >
                <div class="revenue-room">
                  <div class="revenue-room-icon">
                    <i class="bi bi-door-open"></i>
                  </div>

                  <div>
                    <strong>{{ item.type }}</strong>
                    <span>
                      {{ item.bookings }} bookings ·
                      {{ item.nights }} nights
                    </span>
                  </div>
                </div>

                <strong class="revenue-amount">
                  ${{ item.revenue }}
                </strong>
              </div>
            </div>
          </div>
        </div>

        <!-- ================= OCCUPANCY ================= -->
        <div v-if="activeView === 'occupancy'">

          <div class="hm-section-heading">
            <div>
              <span class="hm-eyebrow">INSIGHTS</span>
              <h2>Occupancy</h2>
              <p>Track room utilization across your property.</p>
            </div>
          </div>

          <div class="hm-card large-occupancy-card">

            <div
              class="large-occupancy-ring"
              :style="ringStyle(occupancyRate)"
            >
              <div class="large-ring-inner">
                <strong>{{ occupancyRate }}%</strong>
                <span>Occupancy</span>
              </div>
            </div>

            <div class="occupancy-details">
              <h3>Current Property Occupancy</h3>
              <p>
                Your property currently has
                <strong>{{ occupiedRooms }}</strong>
                occupied rooms out of
                <strong>{{ totalRooms }}</strong>
                total rooms.
              </p>

              <div class="occupancy-progress">
                <div
                  class="occupancy-progress-fill"
                  :style="{ width: `${occupancyRate}%` }"
                ></div>
              </div>

              <div class="occupancy-numbers">
                <div>
                  <span>Occupied Rooms</span>
                  <strong>{{ occupiedRooms }}</strong>
                </div>

                <div>
                  <span>Available Rooms</span>
                  <strong>
                    {{ totalRooms - occupiedRooms }}
                  </strong>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- ================= BOOKING REPORTS ================= -->
        <div v-if="activeView === 'bookingReports'">

          <div class="hm-section-heading">
            <div>
              <span class="hm-eyebrow">REPORTS</span>
              <h2>Booking Reports</h2>
              <p>Generate reservation reports for your property.</p>
            </div>

            <button
              type="button"
              class="hm-primary-button"
              @click="exportBookings"
            >
              <i class="bi bi-download"></i>
              Export CSV
            </button>
          </div>

          <div class="hm-card">
            <div class="report-filters">

              <div class="hm-form-group">
                <label>Start Date</label>
                <input
                  v-model="reportStartDate"
                  type="date"
                  class="hm-input"
                />
              </div>

              <div class="hm-form-group">
                <label>End Date</label>
                <input
                  v-model="reportEndDate"
                  type="date"
                  class="hm-input"
                />
              </div>

            </div>
          </div>
        </div>

        <!-- ================= REVENUE REPORTS ================= -->
        <div v-if="activeView === 'revenueReports'">

          <div class="hm-section-heading">
            <div>
              <span class="hm-eyebrow">REPORTS</span>
              <h2>Revenue Reports</h2>
              <p>Analyze your hotel's revenue performance.</p>
            </div>

            <button
              type="button"
              class="hm-primary-button"
              @click="exportRevenue"
            >
              <i class="bi bi-download"></i>
              Export CSV
            </button>
          </div>

          <div class="hm-card">
            <div class="report-period">
              <label>Report Period</label>

              <select
                v-model="revenuePeriod"
                class="hm-input"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
            </div>

            <div class="report-summary">
              <div>
                <span>Total Revenue</span>
                <strong>${{ totalRevenue }}</strong>
              </div>

              <div>
                <span>Total Bookings</span>
                <strong>{{ bookings.length }}</strong>
              </div>

              <div>
                <span>Occupancy</span>
                <strong>{{ occupancyRate }}%</strong>
              </div>
            </div>
          </div>
        </div>

      </section>
    </main>

    <!-- ================= ROOM MODAL ================= -->
    <div
      v-if="roomModal.open"
      class="hm-modal-backdrop"
      @click.self="roomModal.open = false"
    >
      <div class="hm-modal">

        <div class="hm-modal-header">
          <div>
            <span class="hm-eyebrow">
              ROOM MANAGEMENT
            </span>

            <h3>
              {{ roomModal.form.id ? "Edit Room" : "Add Room" }}
            </h3>
          </div>

          <button
            type="button"
            class="hm-modal-close"
            @click="roomModal.open = false"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="hm-modal-body">

          <div class="hm-form-grid">

            <div class="hm-form-group">
              <label>Room Number</label>
              <input
                v-model="roomModal.form.number"
                type="text"
                class="hm-input"
                placeholder="e.g. 101"
              />
            </div>

            <div class="hm-form-group">
              <label>Floor</label>
              <input
                v-model="roomModal.form.floor"
                type="number"
                min="1"
                class="hm-input"
                placeholder="1"
              />
            </div>

            <div class="hm-form-group">
              <label>Room Type</label>

              <select
                v-model="roomModal.form.type"
                class="hm-input"
              >
                <option value="" disabled>
                  Select room type
                </option>

                <option
                  v-for="type in roomTypes"
                  :key="type.id"
                  :value="type.name"
                >
                  {{ type.name }}
                </option>
              </select>
            </div>

            <div class="hm-form-group">
              <label>Status</label>

              <select
                v-model="roomModal.form.status"
                class="hm-input"
              >
                <option>Available</option>
                <option>Occupied</option>
                <option>Maintenance</option>
              </select>
            </div>

          </div>
        </div>

        <div class="hm-modal-footer">
          <button
            type="button"
            class="hm-secondary-button"
            @click="roomModal.open = false"
          >
            Cancel
          </button>

          <button
            type="button"
            class="hm-primary-button"
            @click="saveRoom"
          >
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
   DESIGN
========================================================= */

const sidebarOpen = ref(false);
const activeView = ref("dashboard");

/* =========================================================
   HOTEL
========================================================= */

const hotel = reactive({
  name: "Mekong Riverside Hotel",
  stars: 4,
  phone: "+855 12 345 678",
  email: "info@mekongriverside.com",
  address: "Phnom Penh, Cambodia",
  description:
    "A modern riverside hotel offering comfortable rooms, excellent hospitality and convenient access to the city.",
  checkIn: "14:00",
  checkOut: "12:00",
});


const manager = reactive({
  firstName: "Sokha",
  lastName: "Manager",
  email: "sokha@example.com",
  phone: "+855 12 345 678",
});

function saveManagerProfile() {
  alert("Profile updated successfully.");
}

function changePassword() {
  alert("Password change screen will be connected here.");
}

/* =========================================================
   NAVIGATION
========================================================= */


const navGroups = [
  {
  title: "Account",
  items: [
    {
      key: "managerProfile",
      label: "My Profile",
      description: "Manage your manager account",
      icon: "bi bi-person-circle",
    },
  ],
},
  {
    title: "Overview",
    items: [
      {
        key: "dashboard",
        label: "Dashboard",
        description: "Property performance overview",
        icon: "bi bi-grid-1x2",
      },
    ],
  },
  {
    title: "Property Setup",
    items: [
      {
        key: "profile",
        label: "Hotel Profile",
        description: "Manage hotel information",
        icon: "bi bi-building",
      },
      {
        key: "hotelImages",
        label: "Hotel Images",
        description: "Manage property images",
        icon: "bi bi-images",
      },
    ],
  },
  {
    title: "Rooms",
    items: [
      {
        key: "rooms",
        label: "Rooms",
        description: "Manage hotel rooms",
        icon: "bi bi-door-open",
      },
      {
        key: "roomTypes",
        label: "Room Types",
        description: "Configure room categories",
        icon: "bi bi-grid",
      },
      {
        key: "roomImages",
        label: "Room Images",
        description: "Manage room photos",
        icon: "bi bi-image",
      },
      {
        key: "amenities",
        label: "Amenities",
        description: "Manage hotel amenities",
        icon: "bi bi-stars",
      },
      {
        key: "pricing",
        label: "Pricing",
        description: "Manage room pricing",
        icon: "bi bi-tags",
      },
    ],
  },
  {
    title: "Bookings",
    items: [
      {
        key: "bookings",
        label: "Bookings",
        description: "Manage guest reservations",
        icon: "bi bi-calendar-check",
      },
    ],
  },
  {
    title: "Insights",
    items: [
      {
        key: "revenue",
        label: "Revenue",
        description: "Monitor financial performance",
        icon: "bi bi-graph-up-arrow",
      },
      {
        key: "occupancy",
        label: "Occupancy",
        description: "Track room utilization",
        icon: "bi bi-pie-chart",
      },
      {
        key: "bookingReports",
        label: "Booking Reports",
        description: "Reservation reports",
        icon: "bi bi-file-earmark-bar-graph",
      },
      {
        key: "revenueReports",
        label: "Revenue Reports",
        description: "Financial reports",
        icon: "bi bi-file-earmark-spreadsheet",
      },
    ],
  },
];

const currentNavItem = computed(() => {
  for (const group of navGroups) {
    const item = group.items.find(
      (item) => item.key === activeView.value
    );

    if (item) return item;
  }

  return navGroups[0].items[0];
});

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
   HOTEL IMAGES
========================================================= */

const hotelImages = ref([
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1000&q=80",
  },
]);

/* =========================================================
   ROOMS
========================================================= */

const rooms = ref([
  {
    id: 1,
    number: "101",
    floor: 1,
    type: "Deluxe King",
    status: "Available",
  },
  {
    id: 2,
    number: "102",
    floor: 1,
    type: "Deluxe King",
    status: "Occupied",
  },
  {
    id: 3,
    number: "201",
    floor: 2,
    type: "Twin Standard",
    status: "Available",
  },
  {
    id: 4,
    number: "202",
    floor: 2,
    type: "Twin Standard",
    status: "Maintenance",
  },
  {
    id: 5,
    number: "301",
    floor: 3,
    type: "Family Suite",
    status: "Occupied",
  },
]);

/* =========================================================
   ROOM TYPES
========================================================= */

const roomTypes = ref([
  {
    id: 1,
    name: "Deluxe King",
    capacity: 2,
    size: 28,
    bed: "1 King Bed",
  },
  {
    id: 2,
    name: "Twin Standard",
    capacity: 2,
    size: 22,
    bed: "2 Twin Beds",
  },
  {
    id: 3,
    name: "Family Suite",
    capacity: 4,
    size: 42,
    bed: "1 King + 2 Twin",
  },
]);

/* =========================================================
   ROOM IMAGES
========================================================= */

const roomImages = reactive({
  "Deluxe King": [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80",
    },
  ],
  "Twin Standard": [],
  "Family Suite": [],
});

const selectedRoomTypeForImages = ref("Deluxe King");

const selectedRoomImages = computed(() => {
  return roomImages[selectedRoomTypeForImages.value] || [];
});

/* =========================================================
   AMENITIES
========================================================= */

const amenities = ref([
  "Free Wi-Fi",
  "Air conditioning",
  "Rooftop pool",
  "Free breakfast",
  "Airport shuttle",
  "Fitness center",
]);

const newAmenity = ref("");

/* =========================================================
   PRICING
========================================================= */

const pricing = ref([
  {
    type: "Deluxe King",
    base: 65,
    weekend: 78,
    peak: 95,
  },
  {
    type: "Twin Standard",
    base: 45,
    weekend: 55,
    peak: 70,
  },
  {
    type: "Family Suite",
    base: 95,
    weekend: 115,
    peak: 140,
  },
]);

/* =========================================================
   BOOKINGS
========================================================= */

const bookings = ref([
  {
    id: "BK001",
    guest: "Chan Dara",
    room: "101",
    checkIn: "2026-09-03",
    checkOut: "2026-09-05",
    status: "Pending",
    amount: 130,
  },
  {
    id: "BK002",
    guest: "Sara Lim",
    room: "201",
    checkIn: "2026-09-02",
    checkOut: "2026-09-04",
    status: "Confirmed",
    amount: 90,
  },
  {
    id: "BK003",
    guest: "John Carter",
    room: "102",
    checkIn: "2026-09-01",
    checkOut: "2026-09-06",
    status: "Checked-in",
    amount: 325,
  },
  {
    id: "BK004",
    guest: "Ly Sreymom",
    room: "301",
    checkIn: "2026-08-28",
    checkOut: "2026-08-31",
    status: "Checked-out",
    amount: 285,
  },
  {
    id: "BK005",
    guest: "Marc Dubois",
    room: "202",
    checkIn: "2026-09-10",
    checkOut: "2026-09-12",
    status: "Cancelled",
    amount: 90,
  },
  {
    id: "BK006",
    guest: "Pich Sopheak",
    room: "101",
    checkIn: "2026-09-15",
    checkOut: "2026-09-16",
    status: "Rejected",
    amount: 65,
  },
]);

const bookingFilters = [
  "All",
  "Pending",
  "Confirmed",
  "Checked-in",
  "Checked-out",
  "Cancelled",
  "Rejected",
];

const bookingFilter = ref("All");

const filteredBookings = computed(() => {
  if (bookingFilter.value === "All") {
    return bookings.value;
  }

  return bookings.value.filter(
    (booking) =>
      booking.status === bookingFilter.value
  );
});

/* =========================================================
   REVENUE
========================================================= */

const weekRevenue = ref([
  { day: "Mon", amount: 320 },
  { day: "Tue", amount: 410 },
  { day: "Wed", amount: 280 },
  { day: "Thu", amount: 460 },
  { day: "Fri", amount: 590 },
  { day: "Sat", amount: 710 },
  { day: "Sun", amount: 540 },
]);

const revenueByType = ref([
  {
    type: "Deluxe King",
    bookings: 18,
    nights: 34,
    revenue: 2210,
  },
  {
    type: "Twin Standard",
    bookings: 12,
    nights: 21,
    revenue: 945,
  },
  {
    type: "Family Suite",
    bookings: 7,
    nights: 15,
    revenue: 1425,
  },
]);

const revenuePeriod = ref("month");

/* =========================================================
   REPORTS
========================================================= */

const reportStartDate = ref("2026-09-01");
const reportEndDate = ref("2026-09-30");

/* =========================================================
   ROOM MODAL
========================================================= */

const roomModal = reactive({
  open: false,
  form: {
    id: null,
    number: "",
    floor: "",
    type: "",
    status: "Available",
  },
});

/* =========================================================
   COMPUTED
========================================================= */

const totalRooms = computed(() => rooms.value.length);

const occupiedRooms = computed(() =>
  rooms.value.filter(
    (room) => room.status === "Occupied"
  ).length
);

const occupancyRate = computed(() => {
  if (!totalRooms.value) return 0;

  return Math.round(
    (occupiedRooms.value / totalRooms.value) * 100
  );
});

const weekRevenueTotal = computed(() =>
  weekRevenue.value.reduce(
    (total, item) => total + item.amount,
    0
  )
);

const weekRevenueMax = computed(() =>
  Math.max(...weekRevenue.value.map((item) => item.amount))
);

const totalRevenue = computed(() =>
  revenueByType.value.reduce(
    (total, item) => total + item.revenue,
    0
  )
);

const avgDailyRevenue = computed(() =>
  Math.round(totalRevenue.value / 30)
);

const avgRevPerBooking = computed(() => {
  const totalBookings = revenueByType.value.reduce(
    (total, item) => total + item.bookings,
    0
  );

  if (!totalBookings) return 0;

  return Math.round(
    totalRevenue.value / totalBookings
  );
});

const dashboardStats = computed(() => [
  {
    label: "Total Rooms",
    value: totalRooms.value,
    change: "Property inventory",
    period: "",
    icon: "bi bi-door-open",
    iconClass: "green",
    trendClass: "neutral",
    trendIcon: "bi bi-building",
  },
  {
    label: "Occupied Rooms",
    value: occupiedRooms.value,
    change: `${occupancyRate.value}% occupancy`,
    period: "",
    icon: "bi bi-person-check",
    iconClass: "blue",
    trendClass: "positive",
    trendIcon: "bi bi-arrow-up",
  },
  {
    label: "Today's Bookings",
    value: bookings.value.filter(
      (booking) => booking.checkIn === "2026-09-03"
    ).length,
    change: "New arrivals",
    period: "",
    icon: "bi bi-calendar-check",
    iconClass: "gold",
    trendClass: "neutral",
    trendIcon: "bi bi-calendar",
  },
  {
    label: "Revenue",
    value: `$${totalRevenue.value.toLocaleString()}`,
    change: "Monthly revenue",
    period: "",
    icon: "bi bi-cash-stack",
    iconClass: "green",
    trendClass: "positive",
    trendIcon: "bi bi-arrow-up",
  },
]);

/* =========================================================
   METHODS
========================================================= */

function setView(view) {
  activeView.value = view;
  sidebarOpen.value = false;
}

function statusClass(status) {
  return {
    pending: status === "Pending",
    confirmed: status === "Confirmed",
    checkedin: status === "Checked-in",
    checkedout: status === "Checked-out",
    cancelled: status === "Cancelled",
    rejected: status === "Rejected",
  };
}

function roomStatusClass(status) {
  return {
    available: status === "Available",
    occupied: status === "Occupied",
    maintenance: status === "Maintenance",
  };
}

function ringStyle(value) {
  return {
    background: `conic-gradient(
      #087F68 ${value}%,
      #E8F6F2 ${value}% 100%
    )`,
  };
}

function barHeight(amount) {
  if (!weekRevenueMax.value) return 0;

  return Math.max(
    8,
    Math.round(
      (amount / weekRevenueMax.value) * 100
    )
  );
}

function onUploadHotelImage(event) {
  const files = Array.from(event.target.files || []);

  files.forEach((file) => {
    hotelImages.value.push({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
    });
  });

  event.target.value = "";
}

function removeHotelImage(index) {
  hotelImages.value.splice(index, 1);
}

function onUploadRoomImage(event) {
  const files = Array.from(event.target.files || []);

  if (!roomImages[selectedRoomTypeForImages.value]) {
    roomImages[selectedRoomTypeForImages.value] = [];
  }

  files.forEach((file) => {
    roomImages[selectedRoomTypeForImages.value].push({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
    });
  });

  event.target.value = "";
}

function removeRoomImage(index) {
  selectedRoomImages.value.splice(index, 1);
}

function addAmenity() {
  const value = newAmenity.value.trim();

  if (!value) return;

  if (!amenities.value.includes(value)) {
    amenities.value.push(value);
  }

  newAmenity.value = "";
}

function removeAmenity(index) {
  amenities.value.splice(index, 1);
}

function addRoomType() {
  const id =
    Math.max(
      0,
      ...roomTypes.value.map((type) => type.id)
    ) + 1;

  roomTypes.value.push({
    id,
    name: `New Room Type ${id}`,
    capacity: 2,
    size: 25,
    bed: "1 King Bed",
  });
}

function openRoomModal(room = null) {
  if (room) {
    roomModal.form = {
      ...room,
    };
  } else {
    roomModal.form = {
      id: null,
      number: "",
      floor: "",
      type: roomTypes.value[0]?.name || "",
      status: "Available",
    };
  }

  roomModal.open = true;
}

function saveRoom() {
  if (
    !roomModal.form.number ||
    !roomModal.form.floor ||
    !roomModal.form.type
  ) {
    alert("Please complete all room fields.");
    return;
  }

  if (roomModal.form.id) {
    const index = rooms.value.findIndex(
      (room) => room.id === roomModal.form.id
    );

    if (index !== -1) {
      rooms.value[index] = {
        ...roomModal.form,
      };
    }
  } else {
    const id =
      Math.max(
        0,
        ...rooms.value.map((room) => room.id)
      ) + 1;

    rooms.value.push({
      ...roomModal.form,
      id,
    });
  }

  roomModal.open = false;
}

function removeRoom(id) {
  if (!confirm("Are you sure you want to delete this room?")) {
    return;
  }

  rooms.value = rooms.value.filter(
    (room) => room.id !== id
  );
}

function saveHotel() {
  alert("Hotel profile saved successfully.");
}

function savePricing() {
  alert("Pricing updated successfully.");
}

function exportBookings() {
  const rows = [
    [
      "Booking ID",
      "Guest",
      "Room",
      "Check-in",
      "Check-out",
      "Status",
      "Amount",
    ],
    ...bookings.value.map((booking) => [
      booking.id,
      booking.guest,
      booking.room,
      booking.checkIn,
      booking.checkOut,
      booking.status,
      booking.amount,
    ]),
  ];

  downloadCSV(rows, "booking-report.csv");
}

function exportRevenue() {
  const rows = [
    ["Room Type", "Bookings", "Nights", "Revenue"],
    ...revenueByType.value.map((item) => [
      item.type,
      item.bookings,
      item.nights,
      item.revenue,
    ]),
  ];

  downloadCSV(rows, "revenue-report.csv");
}

function downloadCSV(rows, filename) {
  const csv = rows
    .map((row) =>
      row
        .map((value) =>
          `"${String(value).replace(/"/g, '""')}"`
        )
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
</script>

<style scoped>
/* =========================================================
   DESIGN SYSTEM
========================================================= */

.hm-app {
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

.hm-sidebar {
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

.hm-brand {
  min-height: 82px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(255,255,255,.1);
}

.hm-brand-mark {
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

.hm-brand-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.hm-brand-text strong {
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hm-brand-text span {
  margin-top: 3px;
  font-size: 11px;
  color: rgba(255,255,255,.6);
}

.hm-nav {
  flex: 1;
  min-height: 0;
  padding: 20px 12px;
  overflow-y: auto;
  overflow-x: hidden;

  /* Hide scrollbar */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.hm-nav::-webkit-scrollbar {
  display: none;
}

.hm-nav-group {
  margin-bottom: 22px;
}

.hm-nav-label {
  padding: 0 12px 8px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: rgba(255,255,255,.38);
}

.hm-nav-item {
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
    color .2s ease,
    transform .2s ease;
}

.hm-nav-item i {
  width: 20px;
  font-size: 16px;
}

.hm-nav-item:hover {
  background: rgba(255,255,255,.08);
  color: white;
}

.hm-nav-item.active {
  background: var(--blue);
  color: white;
  box-shadow: 0 7px 18px rgba(8,127,104,.25);
}

.hm-sidebar-footer {
  padding: 15px;
  border-top: 1px solid rgba(255,255,255,.1);
}

.hm-manager-mini {
  display: flex;
  align-items: center;
  gap: 10px;
}

.hm-manager-mini strong,
.hm-user-info strong {
  display: block;
  font-size: 12px;
}

.hm-manager-mini span,
.hm-user-info span {
  display: block;
  margin-top: 3px;
  color: rgba(255,255,255,.5);
  font-size: 10px;
}

.hm-avatar {
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

.hm-mobile-close {
  display: none;
}

/* =========================================================
   MAIN
========================================================= */

.hm-main {
  flex: 1;
  min-width: 0;
}

.hm-topbar {
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

.hm-page-heading h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 750;
  color: var(--navy);
}

.hm-page-heading span {
  display: block;
  margin-top: 3px;
  color: var(--muted);
  font-size: 12px;
}

.hm-topbar-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.hm-icon-button {
  width: 38px;
  height: 38px;
  border: 1px solid var(--line);
  background: white;
  border-radius: 50%;
  color: var(--navy);
  cursor: pointer;
  position: relative;
}

.notification-dot {
  position: absolute;
  top: 7px;
  right: 7px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--gold);
}

.hm-user {
  display: flex;
  align-items: center;
  gap: 9px;
}

.hm-user-info {
  min-width: 130px;
}

.hm-user-info strong {
  color: var(--ink);
}

.hm-user-info span {
  color: var(--muted);
}

.hm-user > i {
  color: var(--muted);
  font-size: 11px;
}

.hm-menu-button {
  display: none;
  border: 0;
  background: transparent;
  font-size: 23px;
  color: var(--navy);
}

/* =========================================================
   CONTENT
========================================================= */

.hm-content {
  padding: 32px;
  max-width: 1600px;
  margin: auto;
  width: 100%;
}

.hm-welcome,
.hm-section-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
  margin-bottom: 26px;
}

.hm-eyebrow {
  display: block;
  color: var(--blue);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.4px;
  margin-bottom: 7px;
}

.hm-welcome h2,
.hm-section-heading h2 {
  margin: 0;
  font-size: 27px;
  color: var(--navy);
  letter-spacing: -.5px;
}

.hm-welcome p,
.hm-section-heading p {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 13px;
}

.hm-date {
  background: white;
  border: 1px solid var(--line);
  border-radius: 9px;
  padding: 10px 14px;
  color: var(--muted);
  font-size: 12px;
}

.hm-date i {
  color: var(--blue);
  margin-right: 6px;
}

/* =========================================================
   BUTTONS
========================================================= */

.hm-primary-button,
.hm-secondary-button {
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

.hm-primary-button {
  background: var(--blue);
  color: white;
  box-shadow: 0 5px 14px rgba(8,127,104,.18);
}

.hm-primary-button:hover {
  background: var(--navy);
  transform: translateY(-1px);
}

.hm-secondary-button {
  background: var(--blue-light);
  color: var(--blue);
}

.hm-secondary-button:hover {
  background: #d9eee8;
}

.hm-link-button {
  border: 0;
  background: transparent;
  color: var(--blue);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.hm-link-button i {
  margin-left: 4px;
}

/* =========================================================
   STATS
========================================================= */

.hm-stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-bottom: 20px;
}

.hm-stat-grid.three {
  grid-template-columns: repeat(3, 1fr);
}

.hm-stat-card,
.hm-card {
  background: white;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: 0 4px 18px rgba(6,59,50,.035);
}

.hm-stat-card {
  padding: 20px;
}

.hm-stat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--muted);
  font-size: 12px;
  font-weight: 600;
}

.hm-stat-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: grid;
  place-items: center;
}

.hm-stat-icon.green {
  background: var(--blue-light);
  color: var(--blue);
}

.hm-stat-icon.blue {
  background: #EAF5F2;
  color: var(--sky);
}

.hm-stat-icon.gold {
  background: #FFF5DC;
  color: #B27A00;
}

.hm-stat-value {
  margin-top: 14px;
  font-size: 28px;
  font-weight: 800;
  color: var(--navy);
}

.hm-stat-meta {
  margin-top: 8px;
  display: flex;
  gap: 7px;
  align-items: center;
  color: var(--muted);
  font-size: 10px;
}

.positive {
  color: var(--blue);
  font-weight: 700;
}

.neutral {
  color: var(--muted);
}

/* =========================================================
   CARDS
========================================================= */

.hm-card {
  padding: 22px;
}

.hm-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 20px;
}

.hm-card-header h3 {
  margin: 0;
  color: var(--navy);
  font-size: 15px;
}

.hm-card-header p {
  margin: 5px 0 0;
  color: var(--muted);
  font-size: 11px;
}

.hm-card-header-icon {
  color: var(--blue);
  font-size: 20px;
}

/* =========================================================
   DASHBOARD
========================================================= */

.hm-dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.hm-card-large {
  min-width: 0;
}

.hm-table-wrap {
  width: 100%;
  overflow-x: auto;
}

.hm-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
}

.hm-table th {
  text-align: left;
  padding: 10px 12px;
  border-bottom: 1px solid var(--line);
  color: var(--muted);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .6px;
}

.hm-table td {
  padding: 13px 12px;
  border-bottom: 1px solid var(--line);
  font-size: 12px;
  color: var(--muted);
}

.hm-table tbody tr:last-child td {
  border-bottom: 0;
}

.hm-table td strong {
  color: var(--ink);
}

.text-right {
  text-align: right !important;
}

.guest-cell {
  display: flex;
  align-items: center;
  gap: 9px;
}

.guest-cell > div:last-child {
  display: flex;
  flex-direction: column;
}

.guest-cell span {
  margin-top: 2px;
  font-size: 9px;
  color: var(--muted);
}

.guest-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--blue-light);
  color: var(--blue);
  display: grid;
  place-items: center;
  font-weight: 700;
}

.stay-cell {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
}

.stay-cell i {
  color: var(--sky);
}

.hm-status {
  display: inline-flex;
  padding: 5px 8px;
  border-radius: 20px;
  font-size: 9px;
  font-weight: 700;
}

.hm-status.pending {
  background: #FFF5DC;
  color: #9A6A00;
}

.hm-status.confirmed {
  background: var(--blue-light);
  color: var(--blue);
}

.hm-status.checkedin {
  background: #DDF2EA;
  color: #247253;
}

.hm-status.checkedout {
  background: #EEF2F0;
  color: #5D6964;
}

.hm-status.cancelled,
.hm-status.rejected {
  background: #FCEBE7;
  color: #B24A38;
}

/* =========================================================
   OCCUPANCY
========================================================= */

.occupancy-content {
  min-height: 230px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.occupancy-ring,
.large-occupancy-ring {
  border-radius: 50%;
  display: grid;
  place-items: center;
}

.occupancy-ring {
  width: 150px;
  height: 150px;
}

.occupancy-ring-inner {
  width: 116px;
  height: 116px;
  border-radius: 50%;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.occupancy-ring-inner strong {
  font-size: 28px;
  color: var(--navy);
}

.occupancy-ring-inner span {
  color: var(--muted);
  font-size: 10px;
}

.occupancy-summary {
  width: 100%;
  margin-top: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.occupancy-summary > div {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 7px;
  align-items: center;
  font-size: 10px;
  color: var(--muted);
}

.occupancy-summary strong {
  color: var(--ink);
}

.legend-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.legend-dot.occupied {
  background: var(--blue);
}

.legend-dot.available {
  background: var(--line);
}

/* =========================================================
   BAR CHART
========================================================= */

.revenue-chart-card {
  margin-bottom: 20px;
}

.revenue-total {
  text-align: right;
}

.revenue-total span {
  display: block;
  color: var(--muted);
  font-size: 10px;
}

.revenue-total strong {
  display: block;
  margin-top: 3px;
  color: var(--navy);
  font-size: 18px;
}

.hm-bar-chart {
  height: 230px;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  gap: 15px;
  padding: 10px 10px 0;
}

.hm-bar-column {
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}

.bar-value {
  margin-bottom: 7px;
  color: var(--muted);
  font-size: 9px;
}

.bar-track {
  height: 170px;
  width: 28px;
  background: var(--blue-light);
  border-radius: 8px 8px 4px 4px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.bar-fill {
  width: 100%;
  background: linear-gradient(
    to top,
    var(--navy),
    var(--blue)
  );
  border-radius: 8px 8px 3px 3px;
  transition: height .4s ease;
}

.bar-label {
  margin-top: 9px;
  color: var(--muted);
  font-size: 10px;
}

/* =========================================================
   FORMS
========================================================= */

.hm-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.hm-form-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.hm-form-group.full {
  grid-column: 1 / -1;
}

.hm-form-group label,
.report-period label {
  color: var(--ink);
  font-size: 11px;
  font-weight: 700;
}

.hm-input {
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
}

.hm-input:focus {
  border-color: var(--blue);
  box-shadow: 0 0 0 3px var(--blue-light);
}

.hm-textarea {
  resize: vertical;
}

.upload-button {
  cursor: pointer;
}

/* =========================================================
   IMAGES
========================================================= */

.hm-image-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.hm-image-card {
  height: 190px;
  position: relative;
  overflow: hidden;
  border-radius: var(--radius);
  background: var(--blue-light);
}

.hm-image-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform .3s ease;
}

.hm-image-card:hover img {
  transform: scale(1.04);
}

.hm-image-overlay {
  position: absolute;
  inset: auto 0 0;
  padding: 30px 12px 11px;
  background: linear-gradient(
    transparent,
    rgba(0,0,0,.7)
  );
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  color: white;
  font-size: 10px;
}

.hm-delete-button {
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 8px;
  background: rgba(255,255,255,.9);
  color: #B24A38;
  cursor: pointer;
}

.hm-delete-button.floating {
  position: absolute;
  right: 10px;
  top: 10px;
}

.hm-upload-zone {
  min-height: 180px;
  margin-bottom: 25px;
  border: 2px dashed var(--line);
  border-radius: var(--radius);
  background: var(--bg-soft);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: .2s ease;
}

.hm-upload-zone:hover {
  border-color: var(--blue);
  background: var(--blue-light);
}

.hm-upload-zone > i {
  color: var(--blue);
  font-size: 32px;
  margin-bottom: 10px;
}

.hm-upload-zone strong {
  color: var(--navy);
  font-size: 13px;
}

.hm-upload-zone span {
  color: var(--muted);
  font-size: 10px;
  margin-top: 5px;
}

/* =========================================================
   ROOM TYPES
========================================================= */

.hm-room-type-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.hm-room-type-card {
  background: white;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 20px;
  display: flex;
  gap: 15px;
}

.room-type-icon {
  width: 45px;
  height: 45px;
  flex-shrink: 0;
  border-radius: 11px;
  display: grid;
  place-items: center;
  background: var(--blue-light);
  color: var(--blue);
  font-size: 20px;
}

.room-type-content {
  flex: 1;
}

.hm-inline-input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--navy);
}

.hm-inline-input.title {
  font-size: 15px;
  font-weight: 750;
}

.room-type-details {
  display: grid;
  gap: 9px;
  margin-top: 16px;
}

.room-type-details > div {
  display: grid;
  grid-template-columns: 20px 1fr auto;
  align-items: center;
  gap: 6px;
  color: var(--muted);
  font-size: 10px;
}

.room-type-details i {
  color: var(--blue);
}

.room-type-details strong {
  color: var(--ink);
}

/* =========================================================
   AMENITIES
========================================================= */

.hm-add-row {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
}

.hm-add-row .hm-input {
  flex: 1;
}

.hm-amenity-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hm-amenity-chip {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 10px 9px 12px;
  border-radius: 30px;
  background: var(--blue-light);
  color: var(--blue);
  font-size: 11px;
  font-weight: 600;
}

.hm-amenity-chip > i {
  font-size: 11px;
}

.hm-amenity-chip button {
  border: 0;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  padding: 0;
}

/* =========================================================
   PRICING
========================================================= */

.price-input {
  width: 110px;
  display: flex;
  align-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 0 9px;
  background: white;
}

.price-input span {
  color: var(--muted);
  font-size: 11px;
}

.price-input input {
  width: 100%;
  border: 0;
  outline: 0;
  padding: 9px 5px;
  font-size: 12px;
  color: var(--ink);
}

/* =========================================================
   BOOKINGS
========================================================= */

.booking-filters {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}

.booking-filters button {
  border: 1px solid var(--line);
  background: white;
  color: var(--muted);
  border-radius: 20px;
  padding: 8px 13px;
  font-size: 10px;
  font-weight: 650;
  cursor: pointer;
}

.booking-filters button:hover,
.booking-filters button.active {
  background: var(--blue);
  border-color: var(--blue);
  color: white;
}

.hm-status-select {
  border: 1px solid var(--line);
  background: white;
  border-radius: 7px;
  padding: 7px 9px;
  color: var(--ink);
  font-size: 10px;
  outline: 0;
}

.table-actions {
  display: flex;
  justify-content: flex-end;
  gap: 5px;
}

.hm-table-action {
  width: 31px;
  height: 31px;
  border: 1px solid var(--line);
  background: white;
  border-radius: 7px;
  color: var(--blue);
  cursor: pointer;
}

.hm-table-action:hover {
  background: var(--blue-light);
}

.hm-table-action.danger {
  color: #B24A38;
}

.table-empty {
  text-align: center !important;
  padding: 40px !important;
}

/* =========================================================
   REVENUE
========================================================= */

.hm-revenue-list {
  display: flex;
  flex-direction: column;
}

.hm-revenue-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid var(--line);
}

.hm-revenue-row:last-child {
  border-bottom: 0;
}

.revenue-room {
  display: flex;
  align-items: center;
  gap: 11px;
}

.revenue-room-icon {
  width: 38px;
  height: 38px;
  border-radius: 9px;
  background: var(--blue-light);
  color: var(--blue);
  display: grid;
  place-items: center;
}

.revenue-room strong {
  display: block;
  color: var(--ink);
  font-size: 12px;
}

.revenue-room span {
  display: block;
  margin-top: 3px;
  color: var(--muted);
  font-size: 10px;
}

.revenue-amount {
  color: var(--navy);
  font-size: 14px;
}

/* =========================================================
   MANAGER PROFILE
========================================================= */

.hm-manager-mini {
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

  transition:
    background .2s ease,
    transform .2s ease;
}

.hm-manager-mini:hover {
  background: rgba(255,255,255,.08);
}

.hm-manager-info {
  flex: 1;
  min-width: 0;
}

.hm-manager-mini > i {
  color: rgba(255,255,255,.45);
  font-size: 11px;
}

.hm-profile-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.hm-profile-card {
  min-height: 300px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;
}

.hm-profile-avatar {
  width: 92px;
  height: 92px;

  border-radius: 50%;

  display: grid;
  place-items: center;

  background: var(--blue);
  color: white;

  font-size: 32px;
  font-weight: 800;

  box-shadow:
    0 0 0 8px var(--blue-light);
}

.hm-profile-card h3 {
  margin: 22px 0 4px;
  color: var(--navy);
  font-size: 18px;
}

.hm-profile-role {
  color: var(--blue);
  font-size: 11px;
  font-weight: 700;
}

.hm-profile-hotel {
  display: flex;
  align-items: center;
  gap: 7px;

  margin-top: 20px;
  padding-top: 15px;

  width: 100%;

  justify-content: center;

  border-top: 1px solid var(--line);

  color: var(--muted);
  font-size: 11px;
}

.hm-profile-hotel i {
  color: var(--blue);
}

.hm-security-card {
  margin-bottom: 20px;
}

.hm-security-row {
  display: flex;
  align-items: center;
  gap: 14px;

  padding: 15px;

  border: 1px solid var(--line);
  border-radius: 10px;
}

.security-icon {
  width: 40px;
  height: 40px;

  border-radius: 10px;

  display: grid;
  place-items: center;

  background: var(--blue-light);
  color: var(--blue);
}

.security-content {
  flex: 1;
}

.security-content strong {
  display: block;
  color: var(--ink);
  font-size: 12px;
}

.security-content span {
  display: block;
  margin-top: 3px;

  color: var(--muted);
  font-size: 10px;
}

@media (max-width: 800px) {
  .hm-profile-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 550px) {
  .hm-security-row {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .hm-security-row .hm-secondary-button {
    width: 100%;
  }
}

/* =========================================================
   LARGE OCCUPANCY
========================================================= */

.large-occupancy-card {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 80px;
  min-height: 400px;
}

.large-occupancy-ring {
  width: 260px;
  height: 260px;
  flex-shrink: 0;
}

.large-ring-inner {
  width: 205px;
  height: 205px;
  border-radius: 50%;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.large-ring-inner strong {
  color: var(--navy);
  font-size: 48px;
}

.large-ring-inner span {
  color: var(--muted);
  font-size: 12px;
}

.occupancy-details {
  max-width: 450px;
}

.occupancy-details h3 {
  color: var(--navy);
  font-size: 19px;
  margin: 0 0 8px;
}

.occupancy-details p {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.7;
}

.occupancy-details p strong {
  color: var(--ink);
}

.occupancy-progress {
  height: 9px;
  background: var(--blue-light);
  border-radius: 10px;
  overflow: hidden;
  margin: 25px 0;
}

.occupancy-progress-fill {
  height: 100%;
  background: var(--blue);
  border-radius: inherit;
}

.occupancy-numbers {
  display: flex;
  gap: 45px;
}

.occupancy-numbers span,
.occupancy-numbers strong {
  display: block;
}

.occupancy-numbers span {
  color: var(--muted);
  font-size: 10px;
}

.occupancy-numbers strong {
  color: var(--navy);
  margin-top: 5px;
  font-size: 22px;
}

/* =========================================================
   REPORTS
========================================================= */

.report-filters {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.report-period {
  max-width: 350px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.report-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-top: 30px;
}

.report-summary > div {
  padding: 20px;
  border-radius: 10px;
  background: var(--bg-soft);
}

.report-summary span,
.report-summary strong {
  display: block;
}

.report-summary span {
  color: var(--muted);
  font-size: 10px;
}

.report-summary strong {
  margin-top: 6px;
  color: var(--navy);
  font-size: 23px;
}

/* =========================================================
   EMPTY
========================================================= */

.hm-empty-state {
  padding: 70px 20px;
  background: white;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  text-align: center;
}

.hm-empty-state i {
  color: var(--blue);
  font-size: 35px;
}

.hm-empty-state h3 {
  margin: 12px 0 5px;
  color: var(--navy);
  font-size: 16px;
}

.hm-empty-state p {
  margin: 0;
  color: var(--muted);
  font-size: 11px;
}

/* =========================================================
   MODAL
========================================================= */

.hm-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(6,59,50,.55);
  backdrop-filter: blur(3px);
  display: grid;
  place-items: center;
  padding: 20px;
  z-index: 500;
}

.hm-modal {
  width: min(600px, 100%);
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 25px 70px rgba(6,59,50,.2);
}

.hm-modal-header {
  padding: 22px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid var(--line);
}

.hm-modal-header h3 {
  margin: 0;
  color: var(--navy);
  font-size: 20px;
}

.hm-modal-close {
  width: 35px;
  height: 35px;
  border: 0;
  border-radius: 8px;
  background: var(--bg-soft);
  color: var(--muted);
  cursor: pointer;
}

.hm-modal-body {
  padding: 22px;
}

.hm-modal-footer {
  padding: 15px 22px;
  border-top: 1px solid var(--line);
  background: var(--footer-bg);
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* =========================================================
   OVERLAY
========================================================= */

.hm-overlay {
  display: none;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1200px) {
  .hm-stat-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .hm-image-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .hm-room-type-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .hm-sidebar {
    position: fixed;
    left: -280px;
    top: 0;
    bottom: 0;
    transition: left .25s ease;
  }

  .hm-sidebar--open {
    left: 0;
  }

  .hm-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.35);
    z-index: 90;
  }

  .hm-menu-button {
    display: block;
  }

  .hm-topbar {
    padding: 0 20px;
    gap: 15px;
  }

  .hm-page-heading {
    flex: 1;
  }

  .hm-user-info {
    display: none;
  }

  .hm-content {
    padding: 22px;
  }

  .hm-dashboard-grid {
    grid-template-columns: 1fr;
  }

  .large-occupancy-card {
    gap: 40px;
  }
}

@media (max-width: 650px) {
  .hm-content {
    padding: 16px;
  }

  .hm-topbar {
    height: 70px;
    padding: 0 15px;
  }

  .hm-page-heading h1 {
    font-size: 16px;
  }

  .hm-page-heading span {
    font-size: 10px;
  }

  .hm-icon-button {
    display: none;
  }

  .hm-welcome,
  .hm-section-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .hm-welcome h2,
  .hm-section-heading h2 {
    font-size: 22px;
  }

  .hm-stat-grid,
  .hm-stat-grid.three {
    grid-template-columns: 1fr;
  }

  .hm-form-grid,
  .report-filters {
    grid-template-columns: 1fr;
  }

  .hm-form-group.full {
    grid-column: auto;
  }

  .hm-image-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .hm-room-type-grid {
    grid-template-columns: 1fr;
  }

  .hm-add-row {
    flex-direction: column;
  }

  .large-occupancy-card {
    flex-direction: column;
    gap: 30px;
    padding: 30px 20px;
  }

  .large-occupancy-ring {
    width: 210px;
    height: 210px;
  }

  .large-ring-inner {
    width: 165px;
    height: 165px;
  }

  .large-ring-inner strong {
    font-size: 38px;
  }

  .occupancy-details {
    width: 100%;
  }

  .report-summary {
    grid-template-columns: 1fr;
  }

  .hm-section-heading .hm-primary-button,
  .hm-section-heading .upload-button {
    width: 100%;
  }
}
</style>