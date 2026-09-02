<template>
  <div class="hm-app">
    <!-- Sidebar -->
    <aside class="hm-sidebar" :class="{ 'hm-sidebar--open': sidebarOpen }">
      <div class="hm-brand">
        <div class="hm-brand__mark">{{ hotel.name.charAt(0) }}</div>
        <div class="hm-brand__text">
          <!-- <div class="hm-brand__name">{{ hotel.name }}</div> -->
          <div class="hm-brand__role">Hotel Manager</div>
        </div>
      </div>

      <nav class="hm-nav">
        <div v-for="group in navGroups" :key="group.label" class="hm-nav__group">
          <div class="hm-nav__label">{{ group.label }}</div>
          <button
            v-for="item in group.items"
            :key="item.key"
            class="hm-nav__item"
            :class="{ 'hm-nav__item--active': activeView === item.key }"
            @click="setView(item.key)"
          >
            <i :class="item.icon"></i>
            <span>{{ item.en }}</span>
            <small class="hm-nav__km">{{ item.km }}</small>
          </button>
        </div>
      </nav>
    </aside>

    <div v-if="sidebarOpen" class="hm-backdrop d-lg-none" @click="sidebarOpen = false"></div>

    <!-- Main -->
    <div class="hm-main">
      <!-- Topbar -->
      <header class="hm-topbar">
        <button class="btn btn-sm hm-burger d-lg-none" @click="sidebarOpen = !sidebarOpen">
          <i class="bi bi-list"></i>
        </button>
        <div class="hm-topbar__title">
          <h1>{{ currentNavItem.en }}</h1>
          <p>{{ currentNavItem.km }}</p>
        </div>
        <div class="hm-topbar__actions">
          <button class="btn btn-light hm-icon-btn"><i class="bi bi-bell"></i></button>
          <div class="hm-user">
            <div class="hm-user__avatar">M</div>
            <div class="hm-user__meta">
              <div class="hm-user__name">Sokha Manager</div>
              <div class="hm-user__sub">{{ hotel.name }}</div>
            </div>
          </div>
        </div>
      </header>

      <main class="hm-content">

        <!-- ============ DASHBOARD ============ -->
        <section v-if="activeView === 'dashboard'">
          <div class="row g-3 mb-3">
            <div class="col-6 col-xl-3" v-for="stat in dashboardStats" :key="stat.label">
              <div class="hm-card hm-stat">
                <div class="hm-stat__icon" :style="{ background: stat.tint }">
                  <i :class="stat.icon"></i>
                </div>
                <div>
                  <div class="hm-stat__value">{{ stat.value }}</div>
                  <div class="hm-stat__label">{{ stat.label }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="row g-3">
            <div class="col-12 col-xl-7">
              <div class="hm-card">
                <div class="hm-card__head">
                  <h2>Recent Bookings</h2>
                  <button class="btn btn-sm hm-btn-ghost" @click="setView('bookings')">View all</button>
                </div>
                <div class="table-responsive">
                  <table class="table hm-table align-middle mb-0">
                    <thead>
                      <tr><th>Guest</th><th>Room</th><th>Check-in</th><th>Status</th><th class="text-end">Total</th></tr>
                    </thead>
                    <tbody>
                      <tr v-for="b in bookings.slice(0,5)" :key="b.id">
                        <td>{{ b.guest }}</td>
                        <td>{{ b.room }}</td>
                        <td>{{ b.checkIn }}</td>
                        <td><span class="hm-badge" :class="statusClass(b.status)">{{ b.status }}</span></td>
                        <td class="text-end">${{ b.total.toFixed(2) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="col-12 col-xl-5">
              <div class="hm-card mb-3">
                <div class="hm-card__head"><h2>Occupancy Rate</h2></div>
                <div class="hm-occupancy">
                  <div class="hm-occupancy__ring" :style="ringStyle(occupancyRate)">
                    <span>{{ occupancyRate }}%</span>
                  </div>
                  <ul class="hm-occupancy__legend">
                    <li><span class="dot dot--filled"></span>Occupied ({{ occupiedRooms }})</li>
                    <li><span class="dot dot--empty"></span>Available ({{ totalRooms - occupiedRooms }})</li>
                  </ul>
                </div>
              </div>
              <div class="hm-card">
                <div class="hm-card__head"><h2>This Week's Revenue</h2></div>
                <div class="hm-bars">
                  <div class="hm-bars__col" v-for="d in weekRevenue" :key="d.day">
                    <div class="hm-bars__bar" :style="{ height: (d.amount / weekRevenueMax * 100) + '%' }"></div>
                    <span>{{ d.day }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ============ HOTEL PROFILE ============ -->
        <section v-if="activeView === 'profile'">
          <div class="hm-card">
            <div class="hm-card__head"><h2>Hotel Profile</h2><p>Basic information guests see on your listing.</p></div>
            <form class="row g-3" @submit.prevent>
              <div class="col-md-6">
                <label class="hm-label">Hotel name</label>
                <input v-model="hotel.name" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="hm-label">Star rating</label>
                <select v-model="hotel.stars" class="form-select">
                  <option v-for="n in 5" :key="n" :value="n">{{ n }} star</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="hm-label">Phone</label>
                <input v-model="hotel.phone" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="hm-label">Email</label>
                <input v-model="hotel.email" class="form-control" />
              </div>
              <div class="col-12">
                <label class="hm-label">Address</label>
                <input v-model="hotel.address" class="form-control" />
              </div>
              <div class="col-12">
                <label class="hm-label">Description</label>
                <textarea v-model="hotel.description" rows="4" class="form-control"></textarea>
              </div>
              <div class="col-12">
                <label class="hm-label">Check-in / Check-out policy</label>
                <div class="row g-2">
                  <div class="col-sm-6"><input v-model="hotel.checkInTime" class="form-control" placeholder="Check-in time e.g. 14:00" /></div>
                  <div class="col-sm-6"><input v-model="hotel.checkOutTime" class="form-control" placeholder="Check-out time e.g. 12:00" /></div>
                </div>
              </div>
              <div class="col-12 d-flex gap-2">
                <button class="btn hm-btn-primary" type="submit">Save changes</button>
                <button class="btn hm-btn-ghost" type="button">Discard</button>
              </div>
            </form>
          </div>
        </section>

        <!-- ============ HOTEL IMAGES ============ -->
        <section v-if="activeView === 'hotelImages'">
          <div class="hm-card">
            <div class="hm-card__head">
              <h2>Hotel Images</h2>
              <label class="btn hm-btn-primary btn-sm mb-0">
                <i class="bi bi-upload me-1"></i>Upload image
                <input type="file" accept="image/*" multiple class="d-none" @change="onUploadHotelImage" />
              </label>
            </div>
            <div class="hm-gallery">
              <div class="hm-gallery__item" v-for="(img, i) in hotelImages" :key="i">
                <img :src="img.url" :alt="img.name" />
                <button class="hm-gallery__remove" @click="hotelImages.splice(i,1)"><i class="bi bi-trash"></i></button>
              </div>
              <div v-if="!hotelImages.length" class="hm-empty">No images uploaded yet — add photos of the lobby, exterior, and facilities.</div>
            </div>
          </div>
        </section>

        <!-- ============ ROOMS ============ -->
        <section v-if="activeView === 'rooms'">
          <div class="hm-card">
            <div class="hm-card__head">
              <h2>Manage Rooms</h2>
              <button class="btn hm-btn-primary btn-sm" @click="openRoomModal(null)"><i class="bi bi-plus-lg me-1"></i>Add room</button>
            </div>
            <div class="table-responsive">
              <table class="table hm-table align-middle mb-0">
                <thead><tr><th>Room No.</th><th>Type</th><th>Floor</th><th>Status</th><th class="text-end">Actions</th></tr></thead>
                <tbody>
                  <tr v-for="r in rooms" :key="r.id">
                    <td>{{ r.number }}</td>
                    <td>{{ r.type }}</td>
                    <td>{{ r.floor }}</td>
                    <td><span class="hm-badge" :class="roomStatusClass(r.status)">{{ r.status }}</span></td>
                    <td class="text-end">
                      <button class="btn btn-sm hm-btn-ghost" @click="openRoomModal(r)">Edit</button>
                      <button class="btn btn-sm hm-btn-danger-ghost" @click="rooms = rooms.filter(x=>x.id!==r.id)">Remove</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Add/Edit Room Modal -->
          <div class="hm-modal" v-if="roomModal.open">
            <div class="hm-modal__backdrop" @click="roomModal.open = false"></div>
            <div class="hm-modal__panel">
              <h3>{{ roomModal.form.id ? 'Edit room' : 'Add room' }}</h3>
              <div class="row g-2">
                <div class="col-6"><label class="hm-label">Room number</label><input v-model="roomModal.form.number" class="form-control" /></div>
                <div class="col-6"><label class="hm-label">Floor</label><input v-model="roomModal.form.floor" class="form-control" /></div>
                <div class="col-6">
                  <label class="hm-label">Room type</label>
                  <select v-model="roomModal.form.type" class="form-select">
                    <option v-for="t in roomTypes" :key="t.id" :value="t.name">{{ t.name }}</option>
                  </select>
                </div>
                <div class="col-6">
                  <label class="hm-label">Status</label>
                  <select v-model="roomModal.form.status" class="form-select">
                    <option>Available</option><option>Occupied</option><option>Maintenance</option>
                  </select>
                </div>
              </div>
              <div class="d-flex gap-2 mt-3">
                <button class="btn hm-btn-primary" @click="saveRoom">Save room</button>
                <button class="btn hm-btn-ghost" @click="roomModal.open=false">Cancel</button>
              </div>
            </div>
          </div>
        </section>

        <!-- ============ ROOM TYPES ============ -->
        <section v-if="activeView === 'roomTypes'">
          <div class="hm-card">
            <div class="hm-card__head">
              <h2>Manage Room Types</h2>
              <button class="btn hm-btn-primary btn-sm" @click="roomTypes.push({id:Date.now(),name:'New Type',capacity:2,size:'—',bed:'Queen'})"><i class="bi bi-plus-lg me-1"></i>Add type</button>
            </div>
            <div class="table-responsive">
              <table class="table hm-table align-middle mb-0">
                <thead><tr><th>Type name</th><th>Capacity</th><th>Size (m²)</th><th>Bed</th><th class="text-end">Actions</th></tr></thead>
                <tbody>
                  <tr v-for="t in roomTypes" :key="t.id">
                    <td><input v-model="t.name" class="hm-inline-input" /></td>
                    <td><input v-model="t.capacity" type="number" class="hm-inline-input hm-inline-input--sm" /></td>
                    <td><input v-model="t.size" class="hm-inline-input hm-inline-input--sm" /></td>
                    <td><input v-model="t.bed" class="hm-inline-input" /></td>
                    <td class="text-end"><button class="btn btn-sm hm-btn-danger-ghost" @click="roomTypes = roomTypes.filter(x=>x.id!==t.id)">Remove</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- ============ ROOM IMAGES ============ -->
        <section v-if="activeView === 'roomImages'">
          <div class="hm-card">
            <div class="hm-card__head">
              <h2>Upload Room Images</h2>
              <select v-model="selectedRoomTypeForImages" class="form-select form-select-sm w-auto">
                <option v-for="t in roomTypes" :key="t.id" :value="t.name">{{ t.name }}</option>
              </select>
            </div>
            <label class="hm-dropzone">
              <i class="bi bi-images"></i>
              <span>Drop images here or click to upload for <strong>{{ selectedRoomTypeForImages }}</strong></span>
              <input type="file" accept="image/*" multiple class="d-none" @change="onUploadRoomImage" />
            </label>
            <div class="hm-gallery mt-3">
              <div class="hm-gallery__item" v-for="(img, i) in roomImages[selectedRoomTypeForImages] || []" :key="i">
                <img :src="img.url" :alt="img.name" />
                <button class="hm-gallery__remove" @click="roomImages[selectedRoomTypeForImages].splice(i,1)"><i class="bi bi-trash"></i></button>
              </div>
            </div>
          </div>
        </section>

        <!-- ============ AMENITIES ============ -->
        <section v-if="activeView === 'amenities'">
          <div class="hm-card">
            <div class="hm-card__head">
              <h2>Manage Amenities</h2>
              <div class="d-flex gap-2">
                <input v-model="newAmenity" class="form-control form-control-sm" placeholder="Add amenity e.g. Rooftop pool" @keyup.enter="addAmenity" />
                <button class="btn hm-btn-primary btn-sm" @click="addAmenity">Add</button>
              </div>
            </div>
            <div class="hm-chips">
              <span class="hm-chip" v-for="(a,i) in amenities" :key="i">
                <i class="bi" :class="a.icon"></i>{{ a.name }}
                <button @click="amenities.splice(i,1)"><i class="bi bi-x"></i></button>
              </span>
            </div>
          </div>
        </section>

        <!-- ============ ROOM PRICING ============ -->
        <section v-if="activeView === 'pricing'">
          <div class="hm-card">
            <div class="hm-card__head"><h2>Manage Room Pricing</h2><p>Set nightly rates per room type and season.</p></div>
            <div class="table-responsive">
              <table class="table hm-table align-middle mb-0">
                <thead><tr><th>Room type</th><th>Base rate</th><th>Weekend rate</th><th>Peak season rate</th><th class="text-end">Actions</th></tr></thead>
                <tbody>
                  <tr v-for="p in pricing" :key="p.id">
                    <td>{{ p.type }}</td>
                    <td><div class="input-group input-group-sm hm-price-input"><span class="input-group-text">$</span><input v-model.number="p.base" type="number" class="form-control" /></div></td>
                    <td><div class="input-group input-group-sm hm-price-input"><span class="input-group-text">$</span><input v-model.number="p.weekend" type="number" class="form-control" /></div></td>
                    <td><div class="input-group input-group-sm hm-price-input"><span class="input-group-text">$</span><input v-model.number="p.peak" type="number" class="form-control" /></div></td>
                    <td class="text-end"><button class="btn btn-sm hm-btn-primary">Save</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- ============ BOOKINGS ============ -->
        <section v-if="activeView === 'bookings'">
          <div class="hm-card">
            <div class="hm-card__head">
              <h2>Manage Bookings</h2>
              <div class="hm-tabs">
                <button v-for="f in bookingFilters" :key="f" class="hm-tabs__btn" :class="{ 'hm-tabs__btn--active': bookingFilter===f }" @click="bookingFilter=f">{{ f }}</button>
              </div>
            </div>
            <div class="table-responsive">
              <table class="table hm-table align-middle mb-0">
                <thead><tr><th>Guest</th><th>Room</th><th>Check-in</th><th>Check-out</th><th>Status</th><th class="text-end">Actions</th></tr></thead>
                <tbody>
                  <tr v-for="b in filteredBookings" :key="b.id">
                    <td>{{ b.guest }}</td>
                    <td>{{ b.room }}</td>
                    <td>{{ b.checkIn }}</td>
                    <td>{{ b.checkOut }}</td>
                    <td><span class="hm-badge" :class="statusClass(b.status)">{{ b.status }}</span></td>
                    <td class="text-end">
                      <div class="hm-action-group">
                        <button v-if="b.status==='Pending'" class="btn btn-sm hm-btn-success" @click="b.status='Confirmed'">Confirm</button>
                        <button v-if="b.status==='Pending'" class="btn btn-sm hm-btn-danger-ghost" @click="b.status='Rejected'">Reject</button>
                        <button v-if="b.status==='Confirmed'" class="btn btn-sm hm-btn-primary" @click="b.status='Checked-in'">Check-in</button>
                        <button v-if="b.status==='Checked-in'" class="btn btn-sm hm-btn-primary" @click="b.status='Checked-out'">Check-out</button>
                        <button v-if="['Pending','Confirmed'].includes(b.status)" class="btn btn-sm hm-btn-ghost" @click="b.status='Cancelled'">Cancel</button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="!filteredBookings.length"><td colspan="6" class="text-center hm-empty">No bookings in this view.</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- ============ REVENUE ============ -->
        <section v-if="activeView === 'revenue'">
          <div class="row g-3 mb-3">
            <div class="col-md-4"><div class="hm-card hm-stat"><div class="hm-stat__icon" style="background:#1B4B43"><i class="bi bi-cash-stack"></i></div><div><div class="hm-stat__value">${{ totalRevenue.toLocaleString() }}</div><div class="hm-stat__label">Total revenue (MTD)</div></div></div></div>
            <div class="col-md-4"><div class="hm-card hm-stat"><div class="hm-stat__icon" style="background:#C89B3C"><i class="bi bi-graph-up-arrow"></i></div><div><div class="hm-stat__value">${{ avgDailyRevenue.toFixed(0) }}</div><div class="hm-stat__label">Avg. daily revenue</div></div></div></div>
            <div class="col-md-4"><div class="hm-card hm-stat"><div class="hm-stat__icon" style="background:#2F6B4F"><i class="bi bi-receipt"></i></div><div><div class="hm-stat__value">${{ avgRevPerBooking.toFixed(0) }}</div><div class="hm-stat__label">Avg. per booking</div></div></div></div>
          </div>
          <div class="hm-card">
            <div class="hm-card__head"><h2>Revenue — last 7 days</h2></div>
            <div class="hm-bars hm-bars--tall">
              <div class="hm-bars__col" v-for="d in weekRevenue" :key="d.day">
                <span class="hm-bars__amount">${{ d.amount }}</span>
                <div class="hm-bars__bar" :style="{ height: (d.amount / weekRevenueMax * 100) + '%' }"></div>
                <span>{{ d.day }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- ============ OCCUPANCY RATE ============ -->
        <section v-if="activeView === 'occupancy'">
          <div class="hm-card">
            <div class="hm-card__head"><h2>Occupancy Rate</h2></div>
            <div class="hm-occupancy hm-occupancy--large">
              <div class="hm-occupancy__ring" :style="ringStyle(occupancyRate)"><span>{{ occupancyRate }}%</span></div>
              <div>
                <p class="hm-occupancy__desc">{{ occupiedRooms }} of {{ totalRooms }} rooms occupied today.</p>
                <ul class="hm-occupancy__legend">
                  <li><span class="dot dot--filled"></span>Occupied ({{ occupiedRooms }})</li>
                  <li><span class="dot dot--empty"></span>Available ({{ totalRooms - occupiedRooms }})</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <!-- ============ BOOKING REPORTS ============ -->
        <section v-if="activeView === 'bookingReports'">
          <div class="hm-card">
            <div class="hm-card__head">
              <h2>Booking Reports</h2>
              <div class="d-flex gap-2">
                <input type="date" class="form-control form-control-sm" />
                <input type="date" class="form-control form-control-sm" />
                <button class="btn hm-btn-primary btn-sm"><i class="bi bi-download me-1"></i>Export</button>
              </div>
            </div>
            <div class="table-responsive">
              <table class="table hm-table align-middle mb-0">
                <thead><tr><th>Guest</th><th>Room</th><th>Check-in</th><th>Check-out</th><th>Status</th><th class="text-end">Total</th></tr></thead>
                <tbody>
                  <tr v-for="b in bookings" :key="b.id">
                    <td>{{ b.guest }}</td><td>{{ b.room }}</td><td>{{ b.checkIn }}</td><td>{{ b.checkOut }}</td>
                    <td><span class="hm-badge" :class="statusClass(b.status)">{{ b.status }}</span></td>
                    <td class="text-end">${{ b.total.toFixed(2) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- ============ REVENUE REPORTS ============ -->
        <section v-if="activeView === 'revenueReports'">
          <div class="hm-card">
            <div class="hm-card__head">
              <h2>Revenue Reports</h2>
              <div class="d-flex gap-2">
                <select class="form-select form-select-sm w-auto">
                  <option>This month</option><option>Last month</option><option>This quarter</option><option>This year</option>
                </select>
                <button class="btn hm-btn-primary btn-sm"><i class="bi bi-download me-1"></i>Export</button>
              </div>
            </div>
            <div class="table-responsive">
              <table class="table hm-table align-middle mb-0">
                <thead><tr><th>Room type</th><th>Bookings</th><th>Nights sold</th><th class="text-end">Revenue</th></tr></thead>
                <tbody>
                  <tr v-for="r in revenueByType" :key="r.type">
                    <td>{{ r.type }}</td><td>{{ r.bookings }}</td><td>{{ r.nights }}</td>
                    <td class="text-end">${{ r.revenue.toLocaleString() }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="fw-semibold"><td colspan="3">Total</td><td class="text-end">${{ totalRevenue.toLocaleString() }}</td></tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>

      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HotelManagerDashboard',
  data() {
    return {
      sidebarOpen: false,
      activeView: 'dashboard',
      newAmenity: '',
      selectedRoomTypeForImages: 'Deluxe King',
      bookingFilter: 'All',
      bookingFilters: ['All', 'Pending', 'Confirmed', 'Checked-in', 'Checked-out', 'Cancelled', 'Rejected'],

      navGroups: [
        {
          label: 'Overview',
          items: [
            { key: 'dashboard', en: 'Hotel Dashboard', km: 'ផ្ទាំងគ្រប់គ្រង', icon: 'bi bi-grid-1x2' },
          ],
        },
        {
          label: 'Property Setup',
          items: [
            { key: 'profile', en: 'Manage Hotel Profile', km: 'គ្រប់គ្រងព័ត៌មានសណ្ឋាគារ', icon: 'bi bi-building' },
            { key: 'hotelImages', en: 'Upload Hotel Images', km: 'បញ្ចូលរូបភាពសណ្ឋាគារ', icon: 'bi bi-image' },
          ],
        },
        {
          label: 'Rooms',
          items: [
            { key: 'rooms', en: 'Manage Rooms', km: 'គ្រប់គ្រងបន្ទប់', icon: 'bi bi-door-closed' },
            { key: 'roomTypes', en: 'Manage Room Types', km: 'គ្រប់គ្រងប្រភេទបន្ទប់', icon: 'bi bi-columns-gap' },
            { key: 'roomImages', en: 'Upload Room Images', km: 'បញ្ចូលរូបភាពបន្ទប់', icon: 'bi bi-images' },
            { key: 'amenities', en: 'Manage Amenities', km: 'គ្រប់គ្រងសម្ភារៈបន្ថែម', icon: 'bi bi-stars' },
            { key: 'pricing', en: 'Manage Room Pricing', km: 'គ្រប់គ្រងតម្លៃបន្ទប់', icon: 'bi bi-tag' },
          ],
        },
        {
          label: 'Bookings',
          items: [
            { key: 'bookings', en: 'Manage Bookings', km: 'គ្រប់គ្រងការកក់', icon: 'bi bi-journal-check' },
          ],
        },
        {
          label: 'Insights',
          items: [
            { key: 'revenue', en: 'View Revenue', km: 'មើលចំណូល', icon: 'bi bi-cash-coin' },
            { key: 'occupancy', en: 'View Occupancy Rate', km: 'អត្រាកក់បន្ទប់', icon: 'bi bi-pie-chart' },
            { key: 'bookingReports', en: 'Booking Reports', km: 'របាយការណ៍ការកក់', icon: 'bi bi-file-earmark-text' },
            { key: 'revenueReports', en: 'Revenue Reports', km: 'របាយការណ៍ចំណូល', icon: 'bi bi-file-earmark-bar-graph' },
          ],
        },
      ],

      hotel: {
        name: 'Mekong Riverside Hotel',
        stars: 4,
        phone: '+855 12 345 678',
        email: 'contact@mekongriverside.com',
        address: 'Sisowath Quay, Phnom Penh, Cambodia',
        description: 'A riverside hotel offering comfortable rooms, a rooftop pool, and easy access to the city center.',
        checkInTime: '14:00',
        checkOutTime: '12:00',
      },

      hotelImages: [
        { name: 'lobby.jpg', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400' },
        { name: 'exterior.jpg', url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400' },
        { name: 'pool.jpg', url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400' },
      ],

      rooms: [
        { id: 1, number: '101', type: 'Deluxe King', floor: '1', status: 'Available' },
        { id: 2, number: '102', type: 'Deluxe King', floor: '1', status: 'Occupied' },
        { id: 3, number: '201', type: 'Twin Standard', floor: '2', status: 'Available' },
        { id: 4, number: '202', type: 'Twin Standard', floor: '2', status: 'Maintenance' },
        { id: 5, number: '301', type: 'Family Suite', floor: '3', status: 'Occupied' },
      ],

      roomTypes: [
        { id: 1, name: 'Deluxe King', capacity: 2, size: 28, bed: '1 King bed' },
        { id: 2, name: 'Twin Standard', capacity: 2, size: 22, bed: '2 Twin beds' },
        { id: 3, name: 'Family Suite', capacity: 4, size: 42, bed: '1 King + 2 Twin' },
      ],

      roomImages: {
        'Deluxe King': [
          { name: 'deluxe1.jpg', url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400' },
        ],
        'Twin Standard': [],
        'Family Suite': [],
      },

      amenities: [
        { name: 'Free Wi-Fi', icon: 'bi-wifi' },
        { name: 'Air conditioning', icon: 'bi-snow' },
        { name: 'Rooftop pool', icon: 'bi-water' },
        { name: 'Free breakfast', icon: 'bi-cup-hot' },
        { name: 'Airport shuttle', icon: 'bi-airplane' },
        { name: 'Fitness center', icon: 'bi-heart-pulse' },
      ],

      pricing: [
        { id: 1, type: 'Deluxe King', base: 65, weekend: 78, peak: 95 },
        { id: 2, type: 'Twin Standard', base: 45, weekend: 55, peak: 70 },
        { id: 3, type: 'Family Suite', base: 95, weekend: 115, peak: 140 },
      ],

      bookings: [
        { id: 1, guest: 'Chan Dara', room: '101 · Deluxe King', checkIn: '2026-09-03', checkOut: '2026-09-05', status: 'Pending', total: 130 },
        { id: 2, guest: 'Sara Lim', room: '201 · Twin Standard', checkIn: '2026-09-02', checkOut: '2026-09-04', status: 'Confirmed', total: 90 },
        { id: 3, guest: 'John Carter', room: '102 · Deluxe King', checkIn: '2026-09-01', checkOut: '2026-09-06', status: 'Checked-in', total: 325 },
        { id: 4, guest: 'Ly Sreymom', room: '301 · Family Suite', checkIn: '2026-08-28', checkOut: '2026-08-31', status: 'Checked-out', total: 285 },
        { id: 5, guest: 'Marc Dubois', room: '202 · Twin Standard', checkIn: '2026-09-10', checkOut: '2026-09-12', status: 'Cancelled', total: 90 },
        { id: 6, guest: 'Pich Sopheak', room: '101 · Deluxe King', checkIn: '2026-09-15', checkOut: '2026-09-16', status: 'Rejected', total: 65 },
      ],

      weekRevenue: [
        { day: 'Mon', amount: 320 }, { day: 'Tue', amount: 410 }, { day: 'Wed', amount: 280 },
        { day: 'Thu', amount: 460 }, { day: 'Fri', amount: 590 }, { day: 'Sat', amount: 710 }, { day: 'Sun', amount: 540 },
      ],

      revenueByType: [
        { type: 'Deluxe King', bookings: 18, nights: 34, revenue: 2210 },
        { type: 'Twin Standard', bookings: 12, nights: 21, revenue: 945 },
        { type: 'Family Suite', bookings: 7, nights: 15, revenue: 1425 },
      ],

      roomModal: { open: false, form: { id: null, number: '', floor: '', type: '', status: 'Available' } },
    };
  },
  computed: {
    currentNavItem() {
      for (const g of this.navGroups) {
        const found = g.items.find(i => i.key === this.activeView);
        if (found) return found;
      }
      return { en: '', km: '' };
    },
    totalRooms() { return this.rooms.length; },
    occupiedRooms() { return this.rooms.filter(r => r.status === 'Occupied').length; },
    occupancyRate() { return this.totalRooms ? Math.round((this.occupiedRooms / this.totalRooms) * 100) : 0; },
    weekRevenueMax() { return Math.max(...this.weekRevenue.map(d => d.amount)); },
    totalRevenue() { return this.revenueByType.reduce((s, r) => s + r.revenue, 0); },
    avgDailyRevenue() { return this.weekRevenue.reduce((s, d) => s + d.amount, 0) / this.weekRevenue.length; },
    avgRevPerBooking() {
      const totalBookings = this.revenueByType.reduce((s, r) => s + r.bookings, 0);
      return totalBookings ? this.totalRevenue / totalBookings : 0;
    },
    dashboardStats() {
      return [
        { label: 'Bookings today', value: this.bookings.filter(b => b.checkIn === '2026-09-02').length, icon: 'bi bi-calendar-check', tint: '#1B4B43' },
        { label: 'Pending confirmations', value: this.bookings.filter(b => b.status === 'Pending').length, icon: 'bi bi-hourglass-split', tint: '#C89B3C' },
        { label: 'Occupancy rate', value: this.occupancyRate + '%', icon: 'bi bi-pie-chart', tint: '#2F6B4F' },
        { label: 'Revenue (MTD)', value: '$' + this.totalRevenue.toLocaleString(), icon: 'bi bi-cash-stack', tint: '#B3432B' },
      ];
    },
    filteredBookings() {
      if (this.bookingFilter === 'All') return this.bookings;
      return this.bookings.filter(b => b.status === this.bookingFilter);
    },
  },
  methods: {
    setView(key) { this.activeView = key; this.sidebarOpen = false; },
    statusClass(status) {
      return {
        Pending: 'hm-badge--amber',
        Confirmed: 'hm-badge--blue',
        'Checked-in': 'hm-badge--green',
        'Checked-out': 'hm-badge--gray',
        Cancelled: 'hm-badge--red',
        Rejected: 'hm-badge--red',
      }[status] || 'hm-badge--gray';
    },
    roomStatusClass(status) {
      return {
        Available: 'hm-badge--green',
        Occupied: 'hm-badge--blue',
        Maintenance: 'hm-badge--amber',
      }[status] || 'hm-badge--gray';
    },
    ringStyle(pct) {
      return {
        background: `conic-gradient(#1B4B43 ${pct * 3.6}deg, #E7E2D8 0deg)`,
      };
    },
    onUploadHotelImage(e) {
      const files = Array.from(e.target.files || []);
      files.forEach(f => this.hotelImages.push({ name: f.name, url: URL.createObjectURL(f) }));
      e.target.value = '';
    },
    onUploadRoomImage(e) {
      const files = Array.from(e.target.files || []);
      if (!this.roomImages[this.selectedRoomTypeForImages]) this.roomImages[this.selectedRoomTypeForImages] = [];
      files.forEach(f => this.roomImages[this.selectedRoomTypeForImages].push({ name: f.name, url: URL.createObjectURL(f) }));
      e.target.value = '';
    },
    addAmenity() {
      if (!this.newAmenity.trim()) return;
      this.amenities.push({ name: this.newAmenity.trim(), icon: 'bi-check2-circle' });
      this.newAmenity = '';
    },
    openRoomModal(room) {
      this.roomModal.form = room ? { ...room } : { id: null, number: '', floor: '', type: this.roomTypes[0]?.name || '', status: 'Available' };
      this.roomModal.open = true;
    },
    saveRoom() {
      const f = this.roomModal.form;
      if (f.id) {
        const idx = this.rooms.findIndex(r => r.id === f.id);
        if (idx !== -1) this.rooms.splice(idx, 1, { ...f });
      } else {
        this.rooms.push({ ...f, id: Date.now() });
      }
      this.roomModal.open = false;
    },
  },
};
</script>

<style scoped>
:root { color-scheme: light; }

.hm-app {
  --hm-primary: #1B4B43;
  --hm-primary-dark: #123430;
  --hm-gold: #C89B3C;
  --hm-bg: #F1F3F0;
  --hm-surface: #FFFFFF;
  --hm-text: #23281F;
  --hm-muted: #6E766A;
  --hm-border: #E3E7DF;
  --hm-red: #B3432B;
  --hm-green: #2F6B4F;
  --hm-blue: #2E5A8C;

  display: flex;
  min-height: 100vh;
  background: var(--hm-bg);
  color: var(--hm-text);
  font-family: 'Inter', 'Noto Sans Khmer', system-ui, -apple-system, sans-serif;
}

/* Sidebar */
.hm-sidebar {
  width: 268px;
  background: var(--hm-primary-dark);
  color: #EFEFEA;
  flex-shrink: 0;
  padding: 20px 14px;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  z-index: 40;
}
.hm-brand { display: flex; align-items: center; gap: 12px; padding: 8px 10px 20px; }
.hm-brand__mark {
  width: 40px; height: 40px; border-radius: 10px;
  background: var(--hm-gold); color: #1B2119; font-weight: 700;
  display: flex; align-items: center; justify-content: center; font-size: 18px;
}
.hm-brand__name { font-weight: 600; font-size: 0.95rem; line-height: 1.2; }
.hm-brand__role { font-size: 0.75rem; color: #B7C4B9; }

.hm-nav__group { margin-bottom: 18px; }
.hm-nav__label {
  font-size: 0.7rem; letter-spacing: 0.02em; color: #8CA093;
  padding: 4px 10px; margin-bottom: 2px;
}
.hm-nav__item {
  width: 100%; display: flex; align-items: center; gap: 10px;
  background: transparent; border: none; color: #D9E0D6;
  padding: 9px 10px; border-radius: 8px; font-size: 0.87rem;
  text-align: left; cursor: pointer; transition: background 0.15s;
}
.hm-nav__item i { font-size: 1rem; width: 18px; text-align: center; color: #9FB2A2; }
.hm-nav__item:hover { background: rgba(255,255,255,0.06); }
.hm-nav__item--active { background: var(--hm-gold); color: #1B2119; font-weight: 600; }
.hm-nav__item--active i { color: #1B2119; }
.hm-nav__km { margin-left: auto; font-size: 0.68rem; color: #96A899; white-space: nowrap; }
.hm-nav__item--active .hm-nav__km { color: #4A3D18; }

.hm-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.35); z-index: 35; }

/* Main */
.hm-main { flex: 1; min-width: 0; display: flex; flex-direction: column; }

.hm-topbar {
  display: flex; align-items: center; gap: 12px;
  padding: 16px 24px; background: var(--hm-surface);
  border-bottom: 1px solid var(--hm-border);
  position: sticky; top: 0; z-index: 20;
}
.hm-burger { border: 1px solid var(--hm-border); }
.hm-topbar__title h1 { font-size: 1.15rem; font-weight: 600; margin: 0; }
.hm-topbar__title p { font-size: 0.78rem; color: var(--hm-muted); margin: 0; }
.hm-topbar__actions { margin-left: auto; display: flex; align-items: center; gap: 14px; }
.hm-icon-btn { border: 1px solid var(--hm-border); border-radius: 8px; }
.hm-user { display: flex; align-items: center; gap: 8px; }
.hm-user__avatar {
  width: 34px; height: 34px; border-radius: 50%; background: var(--hm-primary);
  color: white; display: flex; align-items: center; justify-content: center; font-weight: 600;
}
.hm-user__name { font-size: 0.85rem; font-weight: 600; line-height: 1.1; }
.hm-user__sub { font-size: 0.72rem; color: var(--hm-muted); }

.hm-content { padding: 22px 24px 40px; max-width: 1280px; width: 100%; margin: 0 auto; }

/* Cards */
.hm-card {
  background: var(--hm-surface); border: 1px solid var(--hm-border);
  border-radius: 12px; padding: 18px 20px; margin-bottom: 0;
}
.hm-card__head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 14px; flex-wrap: wrap; }
.hm-card__head h2 { font-size: 1rem; font-weight: 600; margin: 0; }
.hm-card__head p { font-size: 0.8rem; color: var(--hm-muted); margin: 2px 0 0; }

/* Stats */
.hm-stat { display: flex; align-items: center; gap: 14px; }
.hm-stat__icon {
  width: 44px; height: 44px; border-radius: 10px; color: white;
  display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0;
}
.hm-stat__value { font-size: 1.3rem; font-weight: 700; line-height: 1.1; }
.hm-stat__label { font-size: 0.78rem; color: var(--hm-muted); }

/* Table */
.hm-table thead th { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.03em; color: var(--hm-muted); border-bottom: 1px solid var(--hm-border); font-weight: 600; padding-bottom: 10px; }
.hm-table td { font-size: 0.85rem; border-bottom: 1px solid var(--hm-border); padding: 10px 8px; }
.hm-table tr:last-child td { border-bottom: none; }

/* Badges */
.hm-badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 0.72rem; font-weight: 600; }
.hm-badge--amber { background: #FBEFD9; color: #8A5B12; }
.hm-badge--green { background: #E1F0E6; color: var(--hm-green); }
.hm-badge--blue { background: #E3EBF5; color: var(--hm-blue); }
.hm-badge--gray { background: #EDEEEA; color: #5A6154; }
.hm-badge--red { background: #F6E2DC; color: var(--hm-red); }

/* Buttons */
.hm-btn-primary { background: var(--hm-primary); color: white; border: none; }
.hm-btn-primary:hover { background: var(--hm-primary-dark); color: white; }
.hm-btn-ghost { background: transparent; border: 1px solid var(--hm-border); color: var(--hm-text); }
.hm-btn-success { background: var(--hm-green); color: white; border: none; }
.hm-btn-danger-ghost { background: transparent; border: 1px solid #E7C9BE; color: var(--hm-red); }
.hm-action-group { display: inline-flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }

/* Occupancy ring */
.hm-occupancy { display: flex; align-items: center; gap: 20px; }
.hm-occupancy--large .hm-occupancy__ring { width: 150px; height: 150px; font-size: 1.5rem; }
.hm-occupancy__ring {
  width: 110px; height: 110px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 1.15rem; position: relative; flex-shrink: 0;
}
.hm-occupancy__ring::before {
  content: ''; position: absolute; inset: 12px; border-radius: 50%; background: var(--hm-surface);
}
.hm-occupancy__ring span { position: relative; z-index: 1; }
.hm-occupancy__legend { list-style: none; padding: 0; margin: 0; font-size: 0.82rem; }
.hm-occupancy__legend li { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.hm-occupancy__desc { font-size: 0.85rem; color: var(--hm-muted); margin-bottom: 10px; }
.dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
.dot--filled { background: var(--hm-primary); }
.dot--empty { background: #E7E2D8; }

/* Bars */
.hm-bars { display: flex; align-items: flex-end; gap: 10px; height: 130px; }
.hm-bars--tall { height: 220px; }
.hm-bars__col { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 6px; height: 100%; }
.hm-bars__bar { width: 100%; max-width: 34px; background: var(--hm-primary); border-radius: 6px 6px 0 0; min-height: 4px; }
.hm-bars__col span:last-child { font-size: 0.72rem; color: var(--hm-muted); }
.hm-bars__amount { font-size: 0.68rem; color: var(--hm-muted); }

/* Gallery */
.hm-gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
.hm-gallery__item { position: relative; border-radius: 10px; overflow: hidden; aspect-ratio: 4/3; border: 1px solid var(--hm-border); }
.hm-gallery__item img { width: 100%; height: 100%; object-fit: cover; display: block; }
.hm-gallery__remove {
  position: absolute; top: 6px; right: 6px; background: rgba(0,0,0,0.55); color: white;
  border: none; border-radius: 6px; width: 26px; height: 26px; font-size: 0.8rem;
}
.hm-dropzone {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  border: 1.5px dashed var(--hm-border); border-radius: 10px; padding: 30px;
  color: var(--hm-muted); font-size: 0.85rem; cursor: pointer; text-align: center;
}
.hm-dropzone i { font-size: 1.6rem; color: var(--hm-primary); }
.hm-empty { color: var(--hm-muted); font-size: 0.85rem; padding: 14px 0; }

/* Chips */
.hm-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.hm-chip {
  display: inline-flex; align-items: center; gap: 6px;
  background: #EEF2EB; border-radius: 999px; padding: 6px 12px; font-size: 0.82rem;
}
.hm-chip i:first-child { color: var(--hm-primary); }
.hm-chip button { border: none; background: transparent; color: var(--hm-muted); line-height: 1; padding: 0; margin-left: 2px; }

/* Tabs */
.hm-tabs { display: flex; gap: 4px; flex-wrap: wrap; background: #F1F3F0; border-radius: 8px; padding: 4px; }
.hm-tabs__btn { border: none; background: transparent; padding: 6px 12px; border-radius: 6px; font-size: 0.78rem; color: var(--hm-muted); }
.hm-tabs__btn--active { background: var(--hm-surface); color: var(--hm-text); font-weight: 600; box-shadow: 0 1px 2px rgba(0,0,0,0.08); }

/* Inline inputs */
.hm-inline-input { border: 1px solid transparent; background: transparent; padding: 4px 6px; border-radius: 6px; width: 100%; font-size: 0.85rem; }
.hm-inline-input:hover, .hm-inline-input:focus { border-color: var(--hm-border); background: #FAFAF7; outline: none; }
.hm-inline-input--sm { width: 80px; }
.hm-price-input { max-width: 120px; }
.hm-label { font-size: 0.78rem; font-weight: 600; color: var(--hm-muted); margin-bottom: 4px; display: block; }

/* Modal */
.hm-modal { position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; }
.hm-modal__backdrop { position: absolute; inset: 0; background: rgba(20,24,18,0.45); }
.hm-modal__panel { position: relative; background: var(--hm-surface); border-radius: 12px; padding: 22px; width: 100%; max-width: 420px; margin: 16px; }
.hm-modal__panel h3 { font-size: 1rem; font-weight: 600; margin-bottom: 14px; }

@media (max-width: 991px) {
  .hm-sidebar { position: fixed; left: 0; top: 0; transform: translateX(-100%); transition: transform 0.2s ease; }
  .hm-sidebar--open { transform: translateX(0); }
}
</style>