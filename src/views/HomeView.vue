<template>
  <div>
    <!-- NAVBAR -->
    <nav class="navbar navbar-expand-lg app-navbar sticky-top">
      <div class="container">
        <a class="navbar-brand" href="#" @click.prevent="goHome"><i class="bi bi-buildings-fill me-2"></i>GY</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navMain">
          <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2 mt-2 mt-lg-0">
            <li class="nav-item"><a class="nav-link" :class="{active:page==='search'}" href="#" @click.prevent="goHome">Hotel</a></li>
            <li class="nav-item"><a class="nav-link" :class="{active:page==='history'}" href="#" @click.prevent="page='history'">Bookings</a></li>
            <li class="nav-item"><a class="nav-link" :class="{active:page==='team'}" href="#" @click.prevent="page='team'">Team</a></li>
            <li class="nav-item"><a class="nav-link" :class="{active:page==='contact'}" href="#" @click.prevent="page='contact'">Contact</a></li>
            <li class="nav-item">
              <a class="nav-link" :class="{active:page==='wishlist'}" href="#" @click.prevent="page='wishlist'">
                <i class="bi" :class="wishlist.length ? 'bi-heart-fill' : 'bi-heart'"></i>
                <span v-if="wishlist.length" class="badge rounded-pill bg-gold-badge">{{ wishlist.length }}</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{active:page==='notifications'}" href="#" @click.prevent="page='notifications'">
                <i class="bi bi-bell"></i>
                <span v-if="unreadCount" class="badge rounded-pill bg-gold-badge">{{ unreadCount }}</span>
              </a>
            </li>

            <li class="nav-item ms-lg-2">
              <a class="nav-link profile-pill" :class="{active:page==='profile'}" href="#" @click.prevent="page='profile'">
                <span class="avatar-mini">{{ initials }}</span>{{ user.name.split(' ')[0] }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <Transition name="fade" mode="out-in">
      <div :key="page">

        <!-- ================= SEARCH PAGE ================= -->
        <section v-if="page==='search'">
          <div class="hero-search text-center">
            <div class="container">
              <div class="eyebrow">Cambodia, curated</div>
              <h1 class="brand-font">Stays worth the journey</h1>
              <p class="mb-0 hero-sub">From riverside boutique rooms in Phnom Penh to temple-view suites in Siem Reap — find your next stay.</p>
            </div>
          </div>

          <div class="container">
            <div class="search-card p-3 p-md-4">
              <div class="row g-2 align-items-end">
                <div class="col-md-4">
                  <label class="form-label small fw-semibold">Location</label>
                  <select v-model="query.location" class="form-select">
                    <option value="">All provinces</option>
                    <option v-for="d in destinations" :key="d.name" :value="d.name">{{ d.name }}</option>
                  </select>
                </div>
                <div class="col-md-2">
                  <label class="form-label small fw-semibold">Check-in</label>
                  <input v-model="query.checkin" type="date" class="form-control">
                </div>
                <div class="col-md-2">
                  <label class="form-label small fw-semibold">Check-out</label>
                  <input v-model="query.checkout" type="date" class="form-control">
                </div>
                <div class="col-md-2">
                  <label class="form-label small fw-semibold">Guests</label>
                  <input v-model.number="query.guests" type="number" min="1" max="10" class="form-control">
                </div>
                <div class="col-md-2 d-grid">
                  <button class="btn btn-gold" @click="runSearch"><i class="bi bi-search me-1"></i>Search</button>
                </div>
              </div>
            </div>
          </div>

          <!-- DESTINATIONS STRIP -->
          <div class="container pt-5">
            <div class="d-flex justify-content-between align-items-end mb-3 flex-wrap gap-2">
              <div>
                <h6 class="fw-bold mb-1">Browse by destination</h6>
                <div class="text-muted small">Six regions, six different reasons to visit.</div>
              </div>
            </div>
            <div class="row g-3 dest-row">
              <div class="col-6 col-md-2" v-for="d in destinations" :key="d.name">
                <div class="dest-card" @click="browseDestination(d.name)">
                  <img :src="d.image" :alt="d.name">
                  <div class="dest-overlay">
                    <div class="fw-semibold small">{{ d.name }}</div>
                    <div class="dest-count">{{ countByLocation(d.name) }} stays</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="container pt-5">
            <!-- RECENTLY VIEWED -->
            <div v-if="recentlyViewedHotels.length" class="mb-5">
              <h6 class="fw-bold mb-3"><i class="bi bi-clock-history me-2"></i>Recently viewed</h6>
              <div class="d-flex gap-3 recent-scroll pb-2">
                <div class="recent-card" v-for="h in recentlyViewedHotels" :key="h.id" @click="viewHotel(h.id)">
                  <img :src="h.image" :alt="h.name">
                  <div class="recent-overlay">
                    <div class="fw-semibold small">{{ h.name }}</div>
                    <div class="small">${{ h.priceFrom }}/night</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row g-4 pb-5">
              <!-- FILTERS -->


              <!-- RESULTS -->
              <div class="col-lg-12">
                <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                  <div class="text-muted small">{{ filteredHotels.length }} stays found</div>
                  <div class="d-flex align-items-center gap-2">
                    <div class="view-toggle">
                      <button class="btn btn-sm" :class="viewMode==='grid' ? 'btn-gold' : 'btn-outline-secondary'" @click="viewMode='grid'"><i class="bi bi-grid-3x3-gap"></i></button>
                      <button class="btn btn-sm" :class="viewMode==='list' ? 'btn-gold' : 'btn-outline-secondary'" @click="viewMode='list'"><i class="bi bi-list-ul"></i></button>
                    </div>
                    <select v-model="sortBy" class="form-select form-select-sm w-auto">
                      <option value="recommended">Sort: Recommended</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="rating">Rating</option>
                    </select>
                  </div>
                </div>

                <div class="row g-4" :class="{'row-list': viewMode==='list'}">
                  <div :class="viewMode==='grid' ? 'col-md-4' : 'col-12'" v-for="h in filteredHotels" :key="h.id">
                    <div class="hotel-card" :class="{'hotel-card-list d-flex': viewMode==='list'}">
                      <div class="img-wrap" :class="{'img-wrap-list': viewMode==='list'}">
                        <img :src="h.image" :alt="h.name">
                        <span v-if="h.popular" class="ribbon-badge">Popular</span>
                        <span v-if="h.discount" class="discount-badge">-{{ h.discount }}%</span>
                        <button class="wishlist-btn" @click.stop="toggleWishlist(h.id)">
                          <i class="bi" :class="isWishlisted(h.id) ? 'bi-heart-fill' : 'bi-heart'"></i>
                        </button>
                      </div>
                      <div class="p-3 flex-grow-1">
                        <div class="d-flex justify-content-between align-items-start">
                          <h5 class="mb-1">{{ h.name }}</h5>
                          <span class="rating-chip"><i class="bi bi-star-fill me-1"></i>{{ h.rating }}</span>
                        </div>
                        <div class="text-muted small mb-2"><i class="bi bi-geo-alt me-1"></i>{{ h.location }}</div>
                        <div class="d-flex flex-wrap gap-1 mb-3">
                          <span class="amenity-badge" v-for="am in h.amenities.slice(0,3)" :key="am">{{ am }}</span>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                          <div>
                            <span v-if="h.discount" class="text-muted text-decoration-line-through small me-1">${{ h.priceFrom }}</span>
                            <span class="price-tag">${{ discountedPrice(h) }}</span>
                            <span class="text-muted small"> / night</span>
                          </div>
                          <button class="btn btn-outline-teal btn-sm" @click="viewHotel(h.id)">View Hotel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="!filteredHotels.length" class="text-center text-muted py-5">
                    <i class="bi bi-emoji-frown fs-1 d-block mb-3" style="color:var(--gold);"></i>
                    <p class="mb-3">No stays match your filters — try widening your search.</p>
                    <button class="btn btn-outline-teal btn-sm" @click="resetFilters">Clear filters</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- WHY BOOK WITH US -->
          <div class="why-band">
            <div class="container">
              <div class="row g-4">
                <div class="col-md-4" v-for="f in whyFeatures" :key="f.title">
                  <div class="why-item">
                    <i class="bi" :class="f.icon"></i>
                    <h6 class="fw-bold mt-2 mb-1">{{ f.title }}</h6>
                    <p class="small mb-0">{{ f.body }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TESTIMONIAL STRIP -->
          <div class="container py-5">
            <h6 class="fw-bold text-center mb-4">What guests are saying</h6>
            <div class="row g-4">
              <div class="col-md-4" v-for="t in testimonials" :key="t.author">
                <div class="testimonial-card h-100">
                  <div class="text-warning mb-2"><i class="bi bi-star-fill" v-for="n in t.rating" :key="n"></i></div>
                  <p class="small mb-3">{{ t.quote }}</p>
                  <div class="d-flex align-items-center gap-2">
                    <span class="avatar-mini avatar-mini-dark">{{ t.initials }}</span>
                    <div class="small">
                      <div class="fw-semibold">{{ t.author }}</div>
                      <div class="text-muted">{{ t.location }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ================= WISHLIST PAGE ================= -->
        <section v-if="page==='wishlist'" class="container py-4">
          <h3 class="mb-4"><i class="bi bi-heart-fill me-2" style="color:var(--gold);"></i>My Wishlist</h3>
          <div v-if="!wishlistedHotels.length" class="text-muted text-center py-5">
            <i class="bi bi-heart fs-1 d-block mb-3"></i>Tap the heart on any hotel to save it here.
          </div>
          <div class="row g-4">
            <div class="col-md-4" v-for="h in wishlistedHotels" :key="h.id">
              <div class="hotel-card">
                <div class="img-wrap">
                  <img :src="h.image" :alt="h.name">
                  <button class="wishlist-btn" @click.stop="toggleWishlist(h.id)"><i class="bi bi-heart-fill"></i></button>
                </div>
                <div class="p-3">
                  <h6 class="mb-1">{{ h.name }}</h6>
                  <div class="text-muted small mb-2"><i class="bi bi-geo-alt me-1"></i>{{ h.location }}</div>
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="price-tag">${{ discountedPrice(h) }}</span>
                    <button class="btn btn-outline-teal btn-sm" @click="viewHotel(h.id)">View</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ================= HOTEL DETAIL PAGE ================= -->
        <section v-if="page==='hotel' && selectedHotel" class="container py-4">
          <nav class="breadcrumb-nav small mb-3">
            <a href="#" @click.prevent="page='search'">Search</a>
            <i class="bi bi-chevron-right mx-2"></i>
            <span class="text-muted">{{ selectedHotel.name }}</span>
          </nav>

          <div class="row g-4">
            <div class="col-lg-8">
              <div class="gallery-main mb-2 position-relative">
                <img :src="galleryImage" :alt="selectedHotel.name">
                <button class="wishlist-btn wishlist-btn-lg" @click="toggleWishlist(selectedHotel.id)">
                  <i class="bi" :class="isWishlisted(selectedHotel.id) ? 'bi-heart-fill' : 'bi-heart'"></i>
                </button>
              </div>
              <div class="d-flex gap-2 flex-wrap">
                <img v-for="(img,i) in selectedHotel.gallery" :key="i" :src="img" class="gallery-thumb" :class="{active: galleryImage===img}" @click="galleryImage=img">
              </div>
            </div>
            <div class="col-lg-4">
              <h2 class="mb-1">{{ selectedHotel.name }}</h2>
              <div class="text-muted mb-2"><i class="bi bi-geo-alt me-1"></i>{{ selectedHotel.location }}</div>
              <span class="rating-chip"><i class="bi bi-star-fill me-1"></i>{{ selectedHotel.rating }} · {{ selectedHotel.reviews.length }} reviews</span>
              <p class="mt-3">{{ selectedHotel.description }}</p>
              <h6 class="fw-bold mt-3">Amenities</h6>
              <div class="d-flex flex-wrap gap-1">
                <span class="amenity-badge" v-for="am in selectedHotel.amenities" :key="am">{{ am }}</span>
              </div>
              <button class="btn btn-outline-teal btn-sm w-100 mt-3" @click="shareHotel(selectedHotel)"><i class="bi bi-share me-1"></i>Share this hotel</button>
            </div>
          </div>

          <h4 class="mt-5 mb-3">Rooms</h4>
          <div class="row g-4">
            <div class="col-md-4" v-for="r in visibleRoomTypes" :key="r.id">
              <div class="room-card h-100 d-flex flex-column">
                <img :src="r.image" :alt="r.name">
                <div class="p-3 d-flex flex-column flex-grow-1">
                  <h6 class="fw-bold">{{ r.name }}</h6>
                  <div class="text-muted small mb-2"><i class="bi bi-people me-1"></i>Up to {{ r.capacity }} guests</div>
                  <div class="d-flex flex-wrap gap-1 mb-3">
                    <span class="amenity-badge" v-for="am in r.amenities" :key="am">{{ am }}</span>
                  </div>
                  <div class="mt-auto">
                    <div class="mb-2"><span class="price-tag">${{ r.price }}</span> <span class="text-muted small">/ night</span></div>
                    <button class="btn btn-gold btn-sm w-100" :disabled="!r.available" @click="startBooking(r)">
                      {{ r.available ? 'Check Availability & Book' : 'Unavailable' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="rooms-more-wrap" v-if="hasMoreRooms">
            <button class="btn btn-outline-teal btn-sm" @click="toggleRoomsExpanded">
              <i class="bi me-1" :class="roomsExpanded ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
              {{ roomsExpanded ? 'View Fewer Rooms' : `View More Rooms (${selectedHotel.roomTypes.length - roomsPageSize})` }}
            </button>
          </div>

          <div class="d-flex justify-content-between align-items-center mt-5 mb-3">
            <h4 class="mb-0">Guest Reviews</h4>
            <select v-model="reviewSort" class="form-select form-select-sm w-auto" v-if="selectedHotel.reviews.length">
              <option value="newest">Newest</option>
              <option value="highest">Highest rated</option>
              <option value="lowest">Lowest rated</option>
            </select>
          </div>
          <div v-if="!selectedHotel.reviews.length" class="text-muted">No reviews yet.</div>
          <div class="border-bottom py-3" v-for="(rev,i) in sortedReviews" :key="i">
            <div class="d-flex justify-content-between">
              <strong>{{ rev.author }}</strong>
              <span class="text-warning"><i class="bi bi-star-fill" v-for="n in rev.rating" :key="n"></i></span>
            </div>
            <p class="mb-0 text-muted small">{{ rev.comment }}</p>
          </div>
        </section>

        <!-- ================= BOOKING FLOW ================= -->
        <section v-if="page==='booking' && bookingRoom" class="container py-4">
          <nav class="breadcrumb-nav small mb-3">
            <a href="#" @click.prevent="page='search'">Search</a>
            <i class="bi bi-chevron-right mx-2"></i>
            <a href="#" @click.prevent="page='hotel'">{{ bookingHotel.name }}</a>
            <i class="bi bi-chevron-right mx-2"></i>
            <span class="text-muted">Book {{ bookingRoom.name }}</span>
          </nav>

          <div class="step-track">
            <template v-for="(label,i) in ['Dates','Guest Info','Payment','Confirmed']" :key="i">
              <div class="d-flex align-items-center">
                <div class="step-pill" :class="{active: bookingStep===i+1, done: bookingStep>i+1}">
                  <i v-if="bookingStep>i+1" class="bi bi-check-lg"></i><span v-else>{{ i+1 }}</span>
                </div>
                <span class="step-label">{{ label }}</span>
              </div>
              <div class="step-line" v-if="i<3"></div>
            </template>
          </div>

          <div class="row justify-content-center g-4">
            <div class="col-lg-7">

              <!-- STEP 1: dates -->
              <div v-if="bookingStep===1" class="card p-4">
                <h5 class="mb-3">Select your dates</h5>
                <div class="row g-3">
                  <div class="col-6">
                    <label class="form-label small fw-semibold">Check-in</label>
                    <input v-model="query.checkin" type="date" class="form-control">
                  </div>
                  <div class="col-6">
                    <label class="form-label small fw-semibold">Check-out</label>
                    <input v-model="query.checkout" type="date" class="form-control">
                  </div>
                  <div class="col-6">
                    <label class="form-label small fw-semibold">Guests</label>
                    <input v-model.number="query.guests" type="number" min="1" :max="bookingRoom.capacity" class="form-control">
                  </div>
                </div>
                <div class="alert alert-warning mt-3 mb-0" v-if="nights<=0">Check-out must be after check-in.</div>
                <button class="btn btn-gold mt-4" :disabled="nights<=0" @click="bookingStep=2">Continue</button>
              </div>

              <!-- STEP 2: guest info -->
              <div v-if="bookingStep===2" class="card p-4">
                <h5 class="mb-3">Guest information</h5>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label small fw-semibold">Full name</label>
                    <input v-model="guestInfo.name" type="text" class="form-control" :class="{'is-invalid': guestTouched && !guestInfo.name}">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small fw-semibold">Email</label>
                    <input v-model="guestInfo.email" type="email" class="form-control" :class="{'is-invalid': guestTouched && !isValidEmail}">
                    <div class="invalid-feedback" v-if="guestTouched && !isValidEmail">Enter a valid email address.</div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small fw-semibold">Phone</label>
                    <input v-model="guestInfo.phone" type="text" class="form-control">
                  </div>
                  <div class="col-12">
                    <label class="form-label small fw-semibold">Special requests (optional)</label>
                    <textarea v-model="guestInfo.notes" class="form-control" rows="2"></textarea>
                  </div>
                </div>
                <div class="d-flex gap-2 mt-4">
                  <button class="btn btn-outline-secondary" @click="bookingStep=1">Back</button>
                  <button class="btn btn-gold" @click="goStep3">Continue</button>
                </div>
              </div>

              <!-- STEP 3: coupon + payment -->
              <div v-if="bookingStep===3" class="card p-4">
                <h5 class="mb-3">Coupon & Payment</h5>

                <label class="form-label small fw-semibold">Coupon code</label>
                <div class="input-group mb-1">
                  <input v-model="couponCode" type="text" class="form-control" placeholder="e.g. WELCOME10">
                  <button class="btn btn-outline-teal" @click="applyCoupon">Apply</button>
                </div>
                <div class="small mb-3" :class="couponMsgOk ? 'text-success' : 'text-danger'" v-if="couponMsg">{{ couponMsg }}</div>

                <hr>
                <label class="form-label small fw-semibold">Card details (demo only)</label>
                <div class="row g-2">
                  <div class="col-12"><input v-model="payment.name" class="form-control" placeholder="Name on card"></div>
                  <div class="col-8"><input v-model="payment.number" class="form-control" placeholder="Card number" maxlength="19"></div>
                  <div class="col-2"><input v-model="payment.exp" class="form-control" placeholder="MM/YY"></div>
                  <div class="col-2"><input v-model="payment.cvv" class="form-control" placeholder="CVV"></div>
                </div>

                <div class="d-flex gap-2 mt-4">
                  <button class="btn btn-outline-secondary" @click="bookingStep=2">Back</button>
                  <button class="btn btn-gold" :disabled="!payment.name || !payment.number" @click="confirmPayment">
                    <span v-if="paying" class="spinner-border spinner-border-sm me-2"></span>{{ paying ? 'Processing...' : 'Pay & Confirm Booking' }}
                  </button>
                </div>
              </div>

              <!-- STEP 4: confirmation / boarding pass -->
              <div v-if="bookingStep===4 && lastBooking">
                <div class="boarding-pass">
                  <div class="stub-top d-flex justify-content-between align-items-center">
                    <div>
                      <div class="stub-eyebrow">Booking Confirmed</div>
                      <h4 class="mb-0 brand-font">{{ lastBooking.hotelName }}</h4>
                    </div>
                    <i class="bi bi-check-circle-fill fs-2 stub-check"></i>
                  </div>
                  <div class="stub-body">
                    <div class="row g-3 mb-3">
                      <div class="col-6"><div class="text-muted small">Room</div><div class="fw-semibold">{{ lastBooking.roomName }}</div></div>
                      <div class="col-6"><div class="text-muted small">Guests</div><div class="fw-semibold">{{ lastBooking.guests }}</div></div>
                      <div class="col-6"><div class="text-muted small">Check-in</div><div class="fw-semibold">{{ lastBooking.checkin }}</div></div>
                      <div class="col-6"><div class="text-muted small">Check-out</div><div class="fw-semibold">{{ lastBooking.checkout }}</div></div>
                    </div>
                  </div>
                  <div class="perforation"><span class="notch left"></span><span class="notch right"></span></div>
                  <div class="stub-body d-flex justify-content-between align-items-center">
                    <div>
                      <div class="text-muted small">Booking reference</div>
                      <div class="pass-code">{{ lastBooking.ref }}</div>
                    </div>
                    <div class="text-end">
                      <div class="text-muted small">Total paid</div>
                      <div class="fw-bold fs-5">${{ lastBooking.total }}</div>
                    </div>
                  </div>
                </div>
                <div class="text-center mt-4 d-flex gap-2 justify-content-center">
                  <button class="btn btn-outline-teal" @click="printBooking"><i class="bi bi-printer me-1"></i>Print</button>
                  <button class="btn btn-gold" @click="page='history'">Go to My Bookings</button>
                </div>
              </div>

            </div>

            <!-- STICKY SUMMARY -->
            <div class="col-lg-4" v-if="bookingStep<4">
              <div class="summary-card">
                <img :src="bookingRoom.image" class="summary-img" :alt="bookingRoom.name">
                <div class="p-3">
                  <div class="text-muted small">{{ bookingHotel.name }}</div>
                  <h6 class="fw-bold mb-2">{{ bookingRoom.name }}</h6>
                  <div class="small text-muted mb-1"><i class="bi bi-calendar3 me-1"></i>{{ query.checkin || '—' }} → {{ query.checkout || '—' }}</div>
                  <div class="small text-muted mb-3"><i class="bi bi-people me-1"></i>{{ query.guests }} guest(s) · {{ nights>0 ? nights : 0 }} night(s)</div>
                  <hr>
                  <div class="d-flex justify-content-between small"><span>{{ nights>0?nights:0 }} night(s) × ${{ bookingRoom.price }}</span><span>${{ subtotal }}</span></div>
                  <div class="d-flex justify-content-between small text-success" v-if="discount>0"><span>Coupon discount</span><span>-${{ discount }}</span></div>
                  <div class="d-flex justify-content-between fw-bold mt-2 fs-5"><span>Total</span><span>${{ total }}</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ================= BOOKING HISTORY ================= -->
        <section v-if="page==='history'" class="container py-4">
          <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <h3 class="mb-0">My Bookings</h3>
            <div class="btn-group btn-group-sm">
              <button class="btn" :class="historyFilter==='all' ? 'btn-gold' : 'btn-outline-secondary'" @click="historyFilter='all'">All</button>
              <button class="btn" :class="historyFilter==='Upcoming' ? 'btn-gold' : 'btn-outline-secondary'" @click="historyFilter='Upcoming'">Upcoming</button>
              <button class="btn" :class="historyFilter==='Completed' ? 'btn-gold' : 'btn-outline-secondary'" @click="historyFilter='Completed'">Completed</button>
              <button class="btn" :class="historyFilter==='Cancelled' ? 'btn-gold' : 'btn-outline-secondary'" @click="historyFilter='Cancelled'">Cancelled</button>
            </div>
          </div>

          <div v-if="!filteredBookings.length" class="text-muted text-center py-5">
            <i class="bi bi-suitcase-lg fs-1 d-block mb-3"></i>No bookings in this category yet.
          </div>
          <div class="card mb-3 p-3" v-for="b in filteredBookings" :key="b.id">
            <div class="d-flex justify-content-between flex-wrap gap-2">
              <div>
                <h6 class="mb-1">{{ b.hotelName }} <span class="text-muted fw-normal">— {{ b.roomName }}</span></h6>
                <div class="text-muted small"><i class="bi bi-calendar3 me-1"></i>{{ b.checkin }} → {{ b.checkout }} · {{ b.guests }} guest(s)</div>
              </div>
              <div class="text-end">
                <span class="status-badge" :class="'status-'+b.status">{{ b.status }}</span>
                <div class="fw-bold mt-1">${{ b.total }}</div>
              </div>
            </div>

            <div class="d-flex gap-2 mt-3 flex-wrap">
              <button class="btn btn-sm btn-outline-secondary" @click="b.showDetails=!b.showDetails">
                {{ b.showDetails ? 'Hide Details' : 'View Details' }}
              </button>
              <button class="btn btn-sm btn-outline-danger" v-if="b.status==='Upcoming'" @click="askCancel(b)">Cancel Booking</button>
              <button class="btn btn-sm btn-outline-teal" v-if="b.status==='Cancelled' && !b.refundRequested" @click="requestRefund(b)">Request Refund</button>
              <span class="small text-success align-self-center" v-if="b.refundRequested"><i class="bi bi-check-circle me-1"></i>Refund requested</span>
              <button class="btn btn-sm btn-gold" v-if="b.status==='Completed' && !b.reviewed" @click="b.showReview=!b.showReview">Write a Review</button>
              <span class="small text-muted align-self-center" v-if="b.reviewed"><i class="bi bi-check-circle me-1"></i>Reviewed</span>
            </div>

            <div class="border-top mt-3 pt-3" v-if="b.showDetails">
              <div class="row small text-muted">
                <div class="col-md-4">Reference: <strong class="text-dark">{{ b.ref }}</strong></div>
                <div class="col-md-4">Guest: <strong class="text-dark">{{ b.guestName }}</strong></div>
                <div class="col-md-4">Nights: <strong class="text-dark">{{ b.nights }}</strong></div>
              </div>
            </div>

            <div class="border-top mt-3 pt-3" v-if="b.showReview">
              <div class="mb-2 star-rate">
                <i v-for="n in 5" :key="n" class="bi" :class="n<=b.draftRating ? 'bi-star-fill filled' : 'bi-star'" @click="b.draftRating=n"></i>
              </div>
              <textarea v-model="b.draftComment" class="form-control mb-2" rows="2" placeholder="Share your experience..."></textarea>
              <button class="btn btn-sm btn-gold" :disabled="!b.draftRating || !b.draftComment" @click="submitReview(b)">Submit Review</button>
            </div>
          </div>
        </section>

        <!-- ================= PROFILE ================= -->
        <section v-if="page==='profile'" class="container py-4 narrow">
          <h3 class="mb-4">Profile</h3>
          <div class="card p-4">
            <div class="text-center mb-3">
              <div class="avatar-circle mx-auto d-flex align-items-center justify-content-center">{{ initials }}</div>
            </div>
            <ul class="nav nav-pills profile-tabs justify-content-center mb-4">
              <li class="nav-item"><a class="nav-link" :class="{active:profileTab==='info'}" href="#" @click.prevent="profileTab='info'">Personal Info</a></li>
              <li class="nav-item"><a class="nav-link" :class="{active:profileTab==='prefs'}" href="#" @click.prevent="profileTab='prefs'">Preferences</a></li>
            </ul>

            <div v-if="profileTab==='info'">
              <label class="form-label small fw-semibold">Full name</label>
              <input v-model="user.name" class="form-control mb-3">
              <label class="form-label small fw-semibold">Email</label>
              <input v-model="user.email" type="email" class="form-control mb-3">
              <label class="form-label small fw-semibold">Phone</label>
              <input v-model="user.phone" class="form-control mb-4">
              <button class="btn btn-gold" @click="saveProfile">Save Changes</button>
            </div>

            <div v-if="profileTab==='prefs'">
              <div class="form-check form-switch mb-3">
                <input class="form-check-input" type="checkbox" id="prefEmail" v-model="prefs.emailUpdates">
                <label class="form-check-label" for="prefEmail">Email me about deals & offers</label>
              </div>
              <div class="form-check form-switch mb-3">
                <input class="form-check-input" type="checkbox" id="prefSms" v-model="prefs.smsReminders">
                <label class="form-check-label" for="prefSms">SMS booking reminders</label>
              </div>
              <div class="form-check form-switch mb-4">
                <input class="form-check-input" type="checkbox" id="prefCurrency" v-model="prefs.showUsd">
                <label class="form-check-label" for="prefCurrency">Show prices in USD</label>
              </div>
              <button class="btn btn-gold" @click="saveProfile">Save Preferences</button>
            </div>
          </div>
        </section>

        <!-- ================= NOTIFICATIONS ================= -->
        <section v-if="page==='notifications'" class="container py-4 narrow-md">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="mb-0">Notifications</h3>
            <button class="btn btn-sm btn-outline-secondary" v-if="unreadCount" @click="markAllRead">Mark all read</button>
          </div>
          <div v-if="!notifications.length" class="text-muted text-center py-5">You're all caught up.</div>
          <div class="notif-item p-3 rounded mb-2" :class="{unread: !n.read}" v-for="n in notifications" :key="n.id" @click="n.read=true">
            <div class="d-flex gap-3">
              <div class="notif-icon"><i class="bi" :class="n.icon"></i></div>
              <div class="flex-grow-1">
                <div class="d-flex justify-content-between">
                  <strong>{{ n.title }}</strong>
                  <span class="text-muted small">{{ n.time }}</span>
                </div>
                <div class="text-muted small">{{ n.body }}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- ================= OUR TEAM ================= -->
        <section v-if="page==='team'">
          <div class="team-hero text-center">
            <div class="container">
              <div class="eyebrow">Who's behind AngkorStay</div>
              <h1 class="brand-font">A small team, based in Phnom Penh</h1>
              <p class="mb-0 hero-sub">We started AngkorStay because booking a guesthouse in Cambodia meant either a phone call in the dark or a 20% markup. Three of us run the whole thing.</p>
            </div>
          </div>

          <div class="container py-5">
            <div class="row g-4 justify-content-center">
              <div class="col-md-4" v-for="m in team" :key="m.name">
                <div class="team-card h-100">
                  <div class="team-photo">
                    <img :src="m.photo" :alt="m.name">
                  </div>
                  <div class="p-3 text-center">
                    <h5 class="mb-0">{{ m.name }}</h5>
                    <div class="team-role mb-2">{{ m.role }}</div>
                    <p class="text-muted small mb-3">{{ m.bio }}</p>
                    <div class="d-flex justify-content-center gap-2">
                      <a v-if="m.email" :href="'mailto:'+m.email" class="social-btn"><i class="bi bi-envelope"></i></a>
                      <a v-if="m.linkedin" href="#" class="social-btn"><i class="bi bi-linkedin"></i></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="team-stats mt-5">
              <div class="row g-4 text-center">
                <div class="col-4">
                  <div class="stat-num">6</div>
                  <div class="stat-label">Provinces covered</div>
                </div>
                <div class="col-4">
                  <div class="stat-num">{{ hotels.length }}</div>
                  <div class="stat-label">Stays listed</div>
                </div>
                <div class="col-4">
                  <div class="stat-num">2024</div>
                  <div class="stat-label">Founded</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ================= CONTACT ================= -->
        <section v-if="page==='contact'">
          <div class="contact-hero text-center">
            <div class="container">
              <div class="eyebrow">We're here to help</div>
              <h1 class="brand-font">Get in touch</h1>
              <p class="mb-0 hero-sub">Questions about a booking, a hotel, or a refund — reach our Phnom Penh team directly.</p>
            </div>
          </div>

          <div class="container py-5">
            <div class="row g-4">
              <!-- CONTACT CHANNELS -->
              <div class="col-lg-4">
                <div class="contact-channel mb-3">
                  <i class="bi bi-envelope"></i>
                  <div>
                    <div class="fw-bold small">Email</div>
                    <div class="text-muted small">support@angkorstay.example</div>
                  </div>
                </div>
                <div class="contact-channel mb-3">
                  <i class="bi bi-telephone"></i>
                  <div>
                    <div class="fw-bold small">Phone</div>
                    <div class="text-muted small">+855 23 555 019 · 8am–8pm ICT</div>
                  </div>
                </div>
                <div class="contact-channel mb-3">
                  <i class="bi bi-geo-alt"></i>
                  <div>
                    <div class="fw-bold small">Office</div>
                    <div class="text-muted small">No. 12, Sisowath Quay, Phnom Penh</div>
                  </div>
                </div>
                <div class="contact-channel">
                  <i class="bi bi-question-circle"></i>
                  <div>
                    <div class="fw-bold small">Booking reference handy?</div>
                    <div class="text-muted small">Include it so we can find your stay faster.</div>
                  </div>
                </div>

                <div class="d-flex gap-2 mt-4">
                  <a href="#" class="social-btn"><i class="bi bi-facebook"></i></a>
                  <a href="#" class="social-btn"><i class="bi bi-instagram"></i></a>
                  <a href="#" class="social-btn"><i class="bi bi-telegram"></i></a>
                </div>
              </div>

              <!-- CONTACT FORM -->
              <div class="col-lg-8">
                <div class="contact-form-card">
                  <div v-if="contactSent" class="text-center py-5">
                    <i class="bi bi-check-circle-fill fs-1 mb-3" style="color:var(--gold);"></i>
                    <h5 class="fw-bold">Message sent</h5>
                    <p class="text-muted mb-4">Thanks, {{ contactForm.name.split(' ')[0] }} — we'll reply to {{ contactForm.email }} within one business day.</p>
                    <button class="btn btn-outline-teal btn-sm" @click="resetContactForm">Send another message</button>
                  </div>
                  <template v-else>
                    <h5 class="fw-bold mb-3">Send us a message</h5>
                    <div class="row g-3">
                      <div class="col-md-6">
                        <label class="form-label small fw-semibold">Full name</label>
                        <input v-model="contactForm.name" type="text" class="form-control" :class="{'is-invalid': contactTouched && !contactForm.name}">
                      </div>
                      <div class="col-md-6">
                        <label class="form-label small fw-semibold">Email</label>
                        <input v-model="contactForm.email" type="email" class="form-control" :class="{'is-invalid': contactTouched && !isValidContactEmail}">
                        <div class="invalid-feedback" v-if="contactTouched && !isValidContactEmail">Enter a valid email address.</div>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label small fw-semibold">Booking reference (optional)</label>
                        <input v-model="contactForm.ref" type="text" class="form-control" placeholder="e.g. AS-2026-9001">
                      </div>
                      <div class="col-md-6">
                        <label class="form-label small fw-semibold">Topic</label>
                        <select v-model="contactForm.topic" class="form-select">
                          <option>Booking question</option>
                          <option>Cancellation or refund</option>
                          <option>Payment issue</option>
                          <option>Feedback</option>
                          <option>Something else</option>
                        </select>
                      </div>
                      <div class="col-12">
                        <label class="form-label small fw-semibold">Message</label>
                        <textarea v-model="contactForm.message" class="form-control" rows="4" :class="{'is-invalid': contactTouched && !contactForm.message}"></textarea>
                      </div>
                    </div>
                    <button class="btn btn-gold mt-4" @click="submitContact">
                      <span v-if="sendingContact" class="spinner-border spinner-border-sm me-2"></span>{{ sendingContact ? 'Sending...' : 'Send Message' }}
                    </button>
                  </template>
                </div>
              </div>
            </div>

            <!-- FAQ -->
            <div class="mt-5">
              <h5 class="fw-bold mb-3">Frequently asked</h5>
              <div class="faq-item" v-for="(f,i) in faqs" :key="i" @click="f.open=!f.open">
                <div class="d-flex justify-content-between align-items-center">
                  <span class="fw-semibold">{{ f.q }}</span>
                  <i class="bi" :class="f.open ? 'bi-dash-lg' : 'bi-plus-lg'"></i>
                </div>
                <p class="text-muted small mt-2 mb-0" v-if="f.open">{{ f.a }}</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </Transition>

    <!-- ================= FOOTER ================= -->
    <footer>
      <div class="container">
        <div class="row gy-4">
          <div class="col-lg-4">
            <span class="brand-font fs-5">AngkorStay</span>
            <p class="small mt-2 mb-0 footer-copy">Independent stays across Cambodia — from riverfront heritage hotels to cliffside villas — booked directly, no middleman markup.</p>
          </div>
          <div class="col-6 col-lg-2">
            <div class="footer-heading">Explore</div>
            <ul class="footer-links">
              <li v-for="d in destinations" :key="'f-'+d.name"><a href="#" @click.prevent="browseDestination(d.name)">{{ d.name }}</a></li>
            </ul>
          </div>
          <div class="col-6 col-lg-2">
            <div class="footer-heading">Company</div>
            <ul class="footer-links">
              <li><a href="#" @click.prevent="page='team'">Our Team</a></li>
              <li><a href="#" @click.prevent="page='contact'">Contact</a></li>
            </ul>
          </div>
          <div class="col-6 col-lg-2">
            <div class="footer-heading">Account</div>
            <ul class="footer-links">
              <li><a href="#" @click.prevent="page='history'">My Bookings</a></li>
              <li><a href="#" @click.prevent="page='wishlist'">Wishlist</a></li>
              <li><a href="#" @click.prevent="page='profile'">Profile</a></li>
              <li><a href="#" @click.prevent="page='notifications'">Notifications</a></li>
            </ul>
          </div>
          <div class="col-lg-4">
            <div class="footer-heading">Get travel deals</div>
            <p class="small footer-copy mb-2">One email a month, mostly discount codes.</p>
            <div class="input-group newsletter-group">
              <input v-model="newsletterEmail" type="email" class="form-control" placeholder="you@example.com">
              <button class="btn btn-gold" @click="subscribeNewsletter">Subscribe</button>
            </div>
          </div>
        </div>
        <div class="footer-bottom d-flex justify-content-between flex-wrap gap-2">
          <span>© 2026 AngkorStay · Customer portal</span>
          <span>Phnom Penh · Siem Reap · Sihanoukville · Battambang · Kampot · Kep</span>
        </div>
      </div>
    </footer>

    <!-- CANCEL CONFIRM MODAL -->
    <div class="confirm-backdrop" v-if="cancelTarget" @click.self="cancelTarget=null">
      <div class="confirm-modal">
        <h6 class="fw-bold mb-2">Cancel this booking?</h6>
        <p class="text-muted small mb-3">This will cancel your stay at {{ cancelTarget.hotelName }} ({{ cancelTarget.checkin }} → {{ cancelTarget.checkout }}). This can't be undone.</p>
        <div class="d-flex gap-2 justify-content-end">
          <button class="btn btn-sm btn-outline-secondary" @click="cancelTarget=null">Keep Booking</button>
          <button class="btn btn-sm btn-danger" @click="doCancel">Yes, Cancel</button>
        </div>
      </div>
    </div>

    <!-- TOAST -->
    <div class="toast-wrap">
      <div class="toast align-items-center text-white bg-dark border-0" :class="{show: toast}" v-if="toast" role="alert">
        <div class="d-flex">
          <div class="toast-body">{{ toast }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const HOTELS = [
  {
    id: 1, name: 'Riverside Heritage Hotel', location: 'Phnom Penh, Cambodia', rating: 4.7, popular: true, discount: 10,
    image: 'https://picsum.photos/seed/angkor-pp1/800/500',
    gallery: ['https://picsum.photos/seed/angkor-pp1/900/560', 'https://picsum.photos/seed/angkor-pp2/900/560', 'https://picsum.photos/seed/angkor-pp3/900/560'],
    description: 'A restored colonial-era building on the Tonle Sap riverfront, blending French-Khmer architecture with modern comfort, minutes from the Royal Palace.',
    amenities: ['Free WiFi', 'Pool', 'Breakfast Included', 'Airport Shuttle', 'Spa'],
    priceFrom: 45,
    roomTypes: [
      { id: 101, name: 'Deluxe River View', capacity: 2, price: 45, available: true, image: 'https://picsum.photos/seed/room-101/600/380', amenities: ['River View', 'King Bed', 'AC'] },
      { id: 102, name: 'Family Suite', capacity: 4, price: 78, available: true, image: 'https://picsum.photos/seed/room-102/600/380', amenities: ['2 Bedrooms', 'Balcony', 'AC'] },
      { id: 103, name: 'Standard Twin', capacity: 2, price: 32, available: false, image: 'https://picsum.photos/seed/room-103/600/380', amenities: ['Twin Beds', 'AC'] }
    ],
    reviews: [{ author: 'Sophea K.', rating: 5, comment: 'Beautiful riverside views and very attentive staff.' }]
  },
  {
    id: 2, name: 'Temple Grove Boutique', location: 'Siem Reap, Cambodia', rating: 4.9, popular: true,
    image: 'https://picsum.photos/seed/angkor-sr1/800/500',
    gallery: ['https://picsum.photos/seed/angkor-sr1/900/560', 'https://picsum.photos/seed/angkor-sr2/900/560', 'https://picsum.photos/seed/angkor-sr3/900/560'],
    description: 'Tucked among tropical gardens ten minutes from Angkor Wat, with a rooftop pool looking toward the temple silhouettes at sunset.',
    amenities: ['Free WiFi', 'Pool', 'Breakfast Included', 'Bicycle Rental', 'Bar'],
    priceFrom: 60,
    roomTypes: [
      { id: 201, name: 'Garden Bungalow', capacity: 2, price: 60, available: true, image: 'https://picsum.photos/seed/room-201/600/380', amenities: ['Garden View', 'Outdoor Shower'] },
      { id: 202, name: 'Pool Access Suite', capacity: 3, price: 95, available: true, image: 'https://picsum.photos/seed/room-202/600/380', amenities: ['Direct Pool Access', 'King Bed'] }
    ],
    reviews: [{ author: 'Daniel R.', rating: 5, comment: 'Closest thing to a resort at this price point near the temples.' }, { author: 'Lina P.', rating: 4, comment: 'Lovely stay, breakfast could use more variety.' }]
  },
  {
    id: 3, name: 'Sokha Bay Seaview', location: 'Sihanoukville, Cambodia', rating: 4.4, discount: 15,
    image: 'https://picsum.photos/seed/angkor-sv1/800/500',
    gallery: ['https://picsum.photos/seed/angkor-sv1/900/560', 'https://picsum.photos/seed/angkor-sv2/900/560'],
    description: 'Beachfront property with direct sand access, a seafood restaurant on stilts, and sunset kayak tours.',
    amenities: ['Beach Access', 'Free WiFi', 'Restaurant', 'Free Parking'],
    priceFrom: 38,
    roomTypes: [
      { id: 301, name: 'Ocean View Room', capacity: 2, price: 38, available: true, image: 'https://picsum.photos/seed/room-301/600/380', amenities: ['Ocean View', 'Balcony'] },
      { id: 302, name: 'Beach Bungalow', capacity: 2, price: 55, available: true, image: 'https://picsum.photos/seed/room-302/600/380', amenities: ['Steps to Beach', 'Hammock'] }
    ],
    reviews: []
  },
  {
    id: 4, name: 'Old Market Homestay', location: 'Battambang, Cambodia', rating: 4.6,
    image: 'https://picsum.photos/seed/angkor-bb1/800/500',
    gallery: ['https://picsum.photos/seed/angkor-bb1/900/560', 'https://picsum.photos/seed/angkor-bb2/900/560'],
    description: 'A family-run guesthouse near the Old Market, known for home-cooked Khmer breakfasts and bicycle city tours.',
    amenities: ['Free WiFi', 'Breakfast Included', 'Bicycle Rental'],
    priceFrom: 22,
    roomTypes: [
      { id: 401, name: 'Cozy Single', capacity: 1, price: 22, available: true, image: 'https://picsum.photos/seed/room-401/600/380', amenities: ['Desk', 'Fan'] },
      { id: 402, name: 'Courtyard Double', capacity: 2, price: 30, available: true, image: 'https://picsum.photos/seed/room-402/600/380', amenities: ['Courtyard View', 'AC'] }
    ],
    reviews: [{ author: 'Marc T.', rating: 5, comment: 'Felt like staying with family — incredible hospitality.' }]
  },
  {
    id: 5, name: 'Kampot Riverside Lodge', location: 'Kampot, Cambodia', rating: 4.8,
    image: 'https://picsum.photos/seed/angkor-kp1/800/500',
    gallery: ['https://picsum.photos/seed/angkor-kp1/900/560', 'https://picsum.photos/seed/angkor-kp2/900/560'],
    description: 'Wooden bungalows on stilts over the Praek Tuek Chhu river, with pepper-farm tours and sunset boat cruises.',
    amenities: ['Free WiFi', 'Pool', 'Restaurant', 'River View'],
    priceFrom: 50,
    roomTypes: [
      { id: 501, name: 'River Bungalow', capacity: 2, price: 50, available: true, image: 'https://picsum.photos/seed/room-501/600/380', amenities: ['River View', 'Terrace'] },
      { id: 502, name: 'Family Villa', capacity: 5, price: 110, available: true, image: 'https://picsum.photos/seed/room-502/600/380', amenities: ['2 Bedrooms', 'Kitchenette'] }
    ],
    reviews: [{ author: 'Chantha V.', rating: 5, comment: 'The sunset boat cruise arranged by the lodge was unforgettable.' }]
  },
  {
    id: 6, name: 'Kep Cliffside Villas', location: 'Kep, Cambodia', rating: 4.5,
    image: 'https://picsum.photos/seed/angkor-kep1/800/500',
    gallery: ['https://picsum.photos/seed/angkor-kep1/900/560', 'https://picsum.photos/seed/angkor-kep2/900/560'],
    description: 'Minimalist villas overlooking the Gulf of Thailand, close to Kep Crab Market and the national park trails.',
    amenities: ['Sea View', 'Free WiFi', 'Free Parking', 'Breakfast Included'],
    priceFrom: 42,
    roomTypes: [
      { id: 601, name: 'Cliffside Studio', capacity: 2, price: 42, available: true, image: 'https://picsum.photos/seed/room-601/600/380', amenities: ['Sea View', 'Kitchenette'] },
      { id: 602, name: 'Sunset Villa', capacity: 4, price: 88, available: false, image: 'https://picsum.photos/seed/room-602/600/380', amenities: ['Private Pool', '2 Bedrooms'] }
    ],
    reviews: []
  }
];

const COUPONS = {
  WELCOME10: { percent: 10 },
  STAY20: { percent: 20, minNights: 2 }
};

const DESTINATIONS = [
  { name: 'Phnom Penh', image: 'https://picsum.photos/seed/dest-pp/400/500' },
  { name: 'Siem Reap', image: 'https://picsum.photos/seed/dest-sr/400/500' },
  { name: 'Sihanoukville', image: 'https://picsum.photos/seed/dest-sv/400/500' },
  { name: 'Battambang', image: 'https://picsum.photos/seed/dest-bb/400/500' },
  { name: 'Kampot', image: 'https://picsum.photos/seed/dest-kp/400/500' },
  { name: 'Kep', image: 'https://picsum.photos/seed/dest-kep/400/500' }
];

const WHY_FEATURES = [
  { icon: 'bi-shield-check', title: 'Book direct, pay less', body: 'No third-party markup — the price you see is what the hotel actually charges.' },
  { icon: 'bi-arrow-counterclockwise', title: 'Free cancellation', body: 'Most rooms can be cancelled up to 24 hours before check-in at no cost.' },
  { icon: 'bi-headset', title: 'Local support', body: 'A Phnom Penh-based team who answers in minutes, not days.' }
];

const TESTIMONIALS = [
  { author: 'Sophea K.', initials: 'SK', location: 'Phnom Penh', rating: 5, quote: 'Booked a riverside room the same day I searched — check-in was seamless.' },
  { author: 'Daniel R.', initials: 'DR', location: 'Siem Reap', rating: 5, quote: 'The temple-view rooftop pool alone was worth the trip out to Siem Reap.' },
  { author: 'Chantha V.', initials: 'CV', location: 'Kampot', rating: 5, quote: 'The lodge arranged a sunset boat cruise I never would have found on my own.' }
];

const TEAM = [
  { name: 'Rithy Sok', role: 'Co-founder & Operations', photo: 'https://picsum.photos/seed/team-rithy/400/480', bio: 'Handles hotel partnerships across all six provinces and answers most of the phone line himself.', email: 'rithy@angkorstay.example', linkedin: true },
  { name: 'Lina Prak', role: 'Co-founder & Product', photo: 'https://picsum.photos/seed/team-lina/400/480', bio: 'Builds and maintains the booking platform, from search filters to the payment flow.', email: 'lina@angkorstay.example', linkedin: true },
  { name: 'Vibol Chan', role: 'Guest Support', photo: 'https://picsum.photos/seed/team-vibol/400/480', bio: 'The person behind most of the replies you get from the contact form, usually within the hour.', email: 'vibol@angkorstay.example', linkedin: false }
];

export default {
  name: 'CustomerApp',
  data() {
    return {
      page: 'search',
      query: { location: '', checkin: '', checkout: '', guests: 2 },
      filters: { maxPrice: 300, roomTypes: [], amenities: [], minRating: 0 },
      sortBy: 'recommended',
      viewMode: 'grid',
      hotels: HOTELS,
      destinations: DESTINATIONS,
      whyFeatures: WHY_FEATURES,
      testimonials: TESTIMONIALS,
      team: TEAM,

      wishlist: [],
      recentlyViewed: [],

      selectedHotelId: null,
      galleryImage: '',
      reviewSort: 'newest',
      roomsExpanded: false,
      roomsPageSize: 3,

      bookingRoom: null,
      bookingHotel: null,
      bookingStep: 1,
      guestInfo: { name: '', email: '', phone: '', notes: '' },
      guestTouched: false,
      couponCode: '',
      couponMsg: '',
      couponMsgOk: false,
      appliedCoupon: null,
      payment: { name: '', number: '', exp: '', cvv: '' },
      paying: false,
      lastBooking: null,

      historyFilter: 'all',
      cancelTarget: null,

      profileTab: 'info',
      prefs: { emailUpdates: true, smsReminders: false, showUsd: true },

      bookings: [
        { id: 9001, hotelName: 'Kampot Riverside Lodge', roomName: 'River Bungalow', checkin: '2026-05-10', checkout: '2026-05-13', nights: 3, guests: 2, guestName: 'Sokha Chan', total: 150, status: 'Completed', ref: 'AS-2026-9001', reviewed: false, showDetails: false, showReview: false, draftRating: 0, draftComment: '' },
        { id: 9002, hotelName: 'Temple Grove Boutique', roomName: 'Garden Bungalow', checkin: '2026-07-01', checkout: '2026-07-02', nights: 1, guests: 2, guestName: 'Sokha Chan', total: 60, status: 'Cancelled', ref: 'AS-2026-9002', refundRequested: false, showDetails: false }
      ],

      notifications: [
        { id: 1, title: 'Booking confirmed', body: 'Your stay at Kampot Riverside Lodge is confirmed.', time: '2 days ago', icon: 'bi-calendar-check', read: false },
        { id: 2, title: 'Payment received', body: 'We received your payment of $150.00.', time: '2 days ago', icon: 'bi-credit-card', read: false },
        { id: 3, title: 'Special offer', body: 'Use code STAY20 for 20% off stays of 2+ nights.', time: '5 days ago', icon: 'bi-gift', read: true }
      ],

      user: { name: 'Sokha Chan', email: 'sokha.chan@example.com', phone: '+855 12 345 678' },
      newsletterEmail: '',
      toast: null,

      contactForm: { name: '', email: '', ref: '', topic: 'Booking question', message: '' },
      contactTouched: false,
      sendingContact: false,
      contactSent: false,
      faqs: [
        { q: 'How do I cancel a booking?', a: 'Go to My Bookings and select Cancel Booking on any upcoming stay — most rooms cancel free up to 24 hours before check-in.', open: false },
        { q: 'When will I get my refund?', a: 'Refunds are requested from the Cancelled tab in My Bookings and typically reach your original payment method within 5–7 business days.', open: false },
        { q: 'Can I change my check-in dates after booking?', a: 'Date changes aren\'t self-service yet — message us with your booking reference and we\'ll update it for you.', open: false }
      ]
    };
  },
  computed: {
    allRoomTypes() {
      const set = new Set();
      this.hotels.forEach(h => h.roomTypes.forEach(r => set.add(r.name)));
      return [...set];
    },
    allAmenities() {
      const set = new Set();
      this.hotels.forEach(h => h.amenities.forEach(a => set.add(a)));
      return [...set];
    },
    filteredHotels() {
      let list = this.hotels.filter(h => {
        const matchLocation = !this.query.location || h.location.toLowerCase().includes(this.query.location.toLowerCase());
        const matchPrice = h.priceFrom <= this.filters.maxPrice;
        const matchRoomType = !this.filters.roomTypes.length || h.roomTypes.some(r => this.filters.roomTypes.includes(r.name));
        const matchAmenities = !this.filters.amenities.length || this.filters.amenities.every(a => h.amenities.includes(a));
        const matchRating = h.rating >= this.filters.minRating;
        return matchLocation && matchPrice && matchRoomType && matchAmenities && matchRating;
      });
      if (this.sortBy === 'price_asc') list = list.slice().sort((a, b) => a.priceFrom - b.priceFrom);
      if (this.sortBy === 'price_desc') list = list.slice().sort((a, b) => b.priceFrom - a.priceFrom);
      if (this.sortBy === 'rating') list = list.slice().sort((a, b) => b.rating - a.rating);
      return list;
    },
    wishlistedHotels() {
      return this.hotels.filter(h => this.wishlist.includes(h.id));
    },
    recentlyViewedHotels() {
      return this.recentlyViewed.map(id => this.hotels.find(h => h.id === id)).filter(Boolean);
    },
    selectedHotel() {
      return this.hotels.find(h => h.id === this.selectedHotelId) || null;
    },
    visibleRoomTypes() {
      if (!this.selectedHotel) return [];
      return this.roomsExpanded
        ? this.selectedHotel.roomTypes
        : this.selectedHotel.roomTypes.slice(0, this.roomsPageSize);
    },
    hasMoreRooms() {
      return !!this.selectedHotel && this.selectedHotel.roomTypes.length > this.roomsPageSize;
    },
    sortedReviews() {
      if (!this.selectedHotel) return [];
      const list = this.selectedHotel.reviews.slice();
      if (this.reviewSort === 'highest') return list.sort((a, b) => b.rating - a.rating);
      if (this.reviewSort === 'lowest') return list.sort((a, b) => a.rating - b.rating);
      return list;
    },
    isValidEmail() {
      return /^\S+@\S+\.\S+$/.test(this.guestInfo.email);
    },
    isValidContactEmail() {
      return /^\S+@\S+\.\S+$/.test(this.contactForm.email);
    },
    nights() {
      if (!this.query.checkin || !this.query.checkout) return 0;
      const a = new Date(this.query.checkin), b = new Date(this.query.checkout);
      return Math.round((b - a) / 86400000);
    },
    subtotal() {
      if (!this.bookingRoom || this.nights <= 0) return 0;
      return this.nights * this.bookingRoom.price;
    },
    discount() {
      if (!this.appliedCoupon) return 0;
      return Math.round(this.subtotal * (this.appliedCoupon.percent / 100));
    },
    total() {
      return Math.max(this.subtotal - this.discount, 0);
    },
    unreadCount() {
      return this.notifications.filter(n => !n.read).length;
    },
    initials() {
      return this.user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    },
    filteredBookings() {
      if (this.historyFilter === 'all') return this.bookings;
      return this.bookings.filter(b => b.status === this.historyFilter);
    }
  },
  methods: {
    goHome() { this.page = 'search'; },
    runSearch() { this.page = 'search'; },
    resetFilters() { this.filters = { maxPrice: 300, roomTypes: [], amenities: [], minRating: 0 }; },
    discountedPrice(h) {
      return h.discount ? Math.round(h.priceFrom * (1 - h.discount / 100)) : h.priceFrom;
    },
    isWishlisted(id) { return this.wishlist.includes(id); },
    toggleWishlist(id) {
      const i = this.wishlist.indexOf(id);
      if (i === -1) { this.wishlist.push(id); this.showToast('Added to wishlist.'); }
      else { this.wishlist.splice(i, 1); this.showToast('Removed from wishlist.'); }
    },
    viewHotel(id) {
      this.selectedHotelId = id;
      this.galleryImage = this.selectedHotel.gallery[0];
      this.reviewSort = 'newest';
      this.roomsExpanded = false;
      this.page = 'hotel';
      this.recentlyViewed = [id, ...this.recentlyViewed.filter(x => x !== id)].slice(0, 6);
      window.scrollTo(0, 0);
    },
    toggleRoomsExpanded() {
      this.roomsExpanded = !this.roomsExpanded;
    },
    shareHotel(h) {
      this.showToast(`Link to "${h.name}" copied to clipboard.`);
    },
    browseDestination(name) {
      this.query.location = name;
      this.resetFilters();
      this.showToast(`Showing stays in ${name}.`);
      this.$nextTick(() => {
        const el = document.querySelector('.filter-panel');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    },
    countByLocation(name) {
      return this.hotels.filter(h => h.location.toLowerCase().includes(name.toLowerCase())).length;
    },
    startBooking(room) {
      this.bookingRoom = room;
      this.bookingHotel = this.selectedHotel;
      this.bookingStep = 1;
      this.guestInfo = { name: this.user.name, email: this.user.email, phone: this.user.phone, notes: '' };
      this.guestTouched = false;
      this.couponCode = '';
      this.couponMsg = '';
      this.appliedCoupon = null;
      this.payment = { name: '', number: '', exp: '', cvv: '' };
      this.page = 'booking';
      window.scrollTo(0, 0);
    },
    goStep3() {
      this.guestTouched = true;
      if (!this.guestInfo.name || !this.isValidEmail) return;
      this.bookingStep = 3;
    },
    applyCoupon() {
      const code = this.couponCode.trim().toUpperCase();
      const c = COUPONS[code];
      if (!c) { this.couponMsg = 'Invalid coupon code.'; this.couponMsgOk = false; this.appliedCoupon = null; return; }
      if (c.minNights && this.nights < c.minNights) { this.couponMsg = `Requires a stay of ${c.minNights}+ nights.`; this.couponMsgOk = false; this.appliedCoupon = null; return; }
      this.appliedCoupon = c;
      this.couponMsg = `Coupon applied: ${c.percent}% off!`;
      this.couponMsgOk = true;
    },
    confirmPayment() {
      this.paying = true;
      setTimeout(() => {
        const ref = 'AS-2026-' + Math.floor(1000 + Math.random() * 9000);
        const booking = {
          id: Date.now(),
          hotelName: this.bookingHotel.name,
          roomName: this.bookingRoom.name,
          checkin: this.query.checkin,
          checkout: this.query.checkout,
          nights: this.nights,
          guests: this.query.guests,
          guestName: this.guestInfo.name,
          total: this.total,
          status: 'Upcoming',
          ref,
          reviewed: false,
          showDetails: false
        };
        this.bookings.unshift(booking);
        this.notifications.unshift({ id: Date.now(), title: 'Booking confirmed', body: `Your stay at ${this.bookingHotel.name} is confirmed.`, time: 'Just now', icon: 'bi-calendar-check', read: false });
        this.lastBooking = booking;
        this.bookingStep = 4;
        this.paying = false;
      }, 700);
    },
    printBooking() { window.print(); },
    askCancel(b) { this.cancelTarget = b; },
    doCancel() {
      if (!this.cancelTarget) return;
      this.cancelTarget.status = 'Cancelled';
      this.cancelTarget.refundRequested = false;
      this.showToast('Booking cancelled.');
      this.cancelTarget = null;
    },
    requestRefund(b) {
      b.refundRequested = true;
      this.notifications.unshift({ id: Date.now(), title: 'Refund requested', body: `Your refund request for ${b.hotelName} is being processed.`, time: 'Just now', icon: 'bi-arrow-counterclockwise', read: false });
      this.showToast('Refund requested.');
    },
    submitReview(b) {
      const hotel = this.hotels.find(h => h.name === b.hotelName);
      if (hotel) hotel.reviews.unshift({ author: this.user.name, rating: b.draftRating, comment: b.draftComment });
      b.reviewed = true;
      b.showReview = false;
      this.showToast('Thanks for your review!');
    },
    submitContact() {
      this.contactTouched = true;
      if (!this.contactForm.name || !this.isValidContactEmail || !this.contactForm.message) return;
      this.sendingContact = true;
      setTimeout(() => {
        this.sendingContact = false;
        this.contactSent = true;
      }, 700);
    },
    resetContactForm() {
      this.contactForm = { name: '', email: '', ref: '', topic: 'Booking question', message: '' };
      this.contactTouched = false;
      this.contactSent = false;
    },
    saveProfile() { this.showToast('Changes saved.'); },
    markAllRead() { this.notifications.forEach(n => n.read = true); },
    subscribeNewsletter() {
      if (!this.newsletterEmail) return;
      this.showToast('Subscribed! Check your inbox for deals.');
      this.newsletterEmail = '';
    },
    showToast(msg) {
      this.toast = msg;
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => { this.toast = null; }, 2500);
    }
  }
};
</script>

<style scoped>
:root {
  --gold: #0e682f;
  --gold-deep: #1c6f9f;
  --teal: #156334;
}
.app-navbar { background: var(--ink, #092b19); }
.app-navbar .navbar-brand { color: var(--gold, #C9A227); font-family: 'Khmer OS Muol Light', sans-serif; font-weight: 600; letter-spacing: .3px; font-size: 1.4rem; }
.app-navbar .nav-link { color: #D7E2E9; font-weight: 500; position: relative; }
.app-navbar .nav-link.active, .app-navbar .nav-link:hover { color: var(--gold, #C9A227); }
.app-navbar .nav-link.active::after { content: ''; position: absolute; left: 0; right: 0; bottom: -6px; height: 2px; background: var(--gold, #C9A227); }
.bg-gold-badge { background: var(--gold, #C9A227); color: var(--ink, #0B1E2D); font-size: .6rem; vertical-align: top; margin-left: 2px; }
.profile-pill { display: flex; align-items: center; gap: .4rem; }
.avatar-mini { width: 1.6rem; height: 1.6rem; border-radius: 50%; background: var(--gold, #C9A227); color: var(--ink, #0B1E2D); font-size: .68rem; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; }
.avatar-mini-dark { background: var(--ink, #0B1E2D); color: var(--gold, #C9A227); width: 2rem; height: 2rem; font-size: .75rem; }

.brand-font { font-family: 'Fraunces', serif; }

.btn-gold { background: var(--gold, #C9A227); border-color: var(--gold, #C9A227); color: var(--ink, #0B1E2D); font-weight: 600; transition: transform .12s ease; }
.btn-gold:hover { background: var(--gold-deep, #96770F); border-color: var(--gold-deep, #96770F); color: #fff; transform: translateY(-1px); }
.btn-outline-teal { color: var(--teal, #155263); border-color: var(--teal, #155263); font-weight: 600; }
.btn-outline-teal:hover { background: var(--teal, #155263); color: #fff; }
.link-teal { color: var(--teal, #155263); font-weight: 600; }

.hero-search {
  background: linear-gradient(rgba(11,30,45,.80), rgba(11,30,45,.55)), url('https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1600&q=70') center/cover no-repeat;
  color: #fff;
  padding: 4.5rem 0 6.5rem;
}
.hero-search .eyebrow { letter-spacing: 2px; text-transform: uppercase; font-size: .75rem; color: var(--gold, #C9A227); }
.hero-search h1 { font-size: 2.6rem; font-weight: 600; }
.hero-sub { max-width: 520px; margin: 0 auto; opacity: .9; }
.search-card { margin-top: -4.5rem; border-radius: 1rem; box-shadow: 0 24px 48px rgba(11,30,45,.18); background: #fff; }

.dest-row .dest-card { position: relative; height: 150px; border-radius: .8rem; overflow: hidden; cursor: pointer; }
.dest-card img { width: 100%; height: 100%; object-fit: cover; transition: transform .3s ease; }
.dest-card:hover img { transform: scale(1.08); }
.dest-overlay { position: absolute; inset: auto 0 0 0; background: linear-gradient(transparent, rgba(11,30,45,.9)); color: #fff; padding: .6rem .7rem; }
.dest-count { font-size: .68rem; opacity: .85; }

.recent-scroll { overflow-x: auto; }
.recent-card { position: relative; flex: 0 0 auto; width: 160px; height: 100px; border-radius: .7rem; overflow: hidden; cursor: pointer; }
.recent-card img { width: 100%; height: 100%; object-fit: cover; }
.recent-overlay { position: absolute; inset: auto 0 0 0; background: linear-gradient(transparent, rgba(11,30,45,.85)); color: #fff; padding: .5rem; }

.view-toggle .btn { border-radius: .4rem !important; }

.hotel-card { border: none; border-radius: .9rem; overflow: hidden; box-shadow: 0 4px 14px rgba(11,30,45,.08); transition: transform .15s ease, box-shadow .15s ease; height: 100%; }
.hotel-card:hover { transform: translateY(-4px); box-shadow: 0 14px 28px rgba(11,30,45,.16); }
.hotel-card:hover .img-wrap img { transform: scale(1.06); }
.hotel-card-list .img-wrap-list { width: 260px; flex: 0 0 260px; height: auto !important; }
.img-wrap { height: 190px; overflow: hidden; position: relative; }
.img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform .3s ease; }
.ribbon-badge { position: absolute; top: 10px; left: 10px; background: var(--teal, #155263); color: #fff; font-size: .68rem; font-weight: 700; padding: .25rem .55rem; border-radius: .35rem; }
.discount-badge { position: absolute; top: 10px; right: 44px; background: var(--danger, #B4413B); color: #fff; font-size: .68rem; font-weight: 700; padding: .25rem .5rem; border-radius: .35rem; }
.wishlist-btn { position: absolute; top: 8px; right: 8px; width: 2rem; height: 2rem; border: none; border-radius: 50%; background: rgba(255,255,255,.9); color: var(--danger, #B4413B); display: flex; align-items: center; justify-content: center; }
.wishlist-btn-lg { width: 2.6rem; height: 2.6rem; font-size: 1.1rem; }
.price-tag { color: var(--teal, #155263); font-weight: 700; font-size: 1.15rem; }
.rating-chip { background: var(--ink, #0B1E2D); color: #fff; font-size: .78rem; font-weight: 600; border-radius: .4rem; padding: .15rem .5rem; white-space: nowrap; }
.amenity-badge { background: #EFF3F5; color: var(--ink-soft, #12354C); font-size: .72rem; font-weight: 500; border-radius: .4rem; padding: .25rem .5rem; }

.filter-panel { background: #fff; border-radius: .9rem; padding: 1.25rem; box-shadow: 0 4px 14px rgba(11,30,45,.06); }
.filter-stars i { font-size: 1.1rem; }

.promo-card { background: var(--ink, #0B1E2D); color: #fff; border-radius: .9rem; padding: 1.25rem; }
.promo-eyebrow { color: var(--gold, #C9A227); font-size: .7rem; letter-spacing: 1px; text-transform: uppercase; margin-bottom: .25rem; }
.promo-card p { color: #C7D3DA; }
.promo-code { display: inline-block; border: 1px dashed var(--gold, #C9A227); color: var(--gold, #C9A227); font-weight: 700; letter-spacing: 2px; padding: .3rem .7rem; border-radius: .4rem; font-size: .82rem; }

.team-hero {
  background: linear-gradient(rgba(11,30,45,.82), rgba(11,30,45,.6)), url('https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1600&q=70') center/cover no-repeat;
  color: #fff;
  padding: 3.5rem 0;
}
.team-hero .eyebrow { letter-spacing: 2px; text-transform: uppercase; font-size: .75rem; color: var(--gold, #C9A227); }
.team-hero h1 { font-size: 2.2rem; font-weight: 600; }

.team-card { background: #fff; border-radius: .9rem; overflow: hidden; box-shadow: 0 4px 14px rgba(11,30,45,.08); }
.team-photo { height: 260px; overflow: hidden; }
.team-photo img { width: 100%; height: 100%; object-fit: cover; }
.team-role { color: var(--teal, #155263); font-weight: 600; font-size: .85rem; }

.team-stats { background: var(--ink, #0B1E2D); border-radius: .9rem; padding: 2rem 1rem; }
.stat-num { color: var(--gold, #C9A227); font-family: 'Fraunces', serif; font-size: 2.2rem; font-weight: 600; }
.stat-label { color: #B8C4CC; font-size: .8rem; }

.contact-hero {
  background: linear-gradient(rgba(11,30,45,.82), rgba(11,30,45,.6)), url('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1600&q=70') center/cover no-repeat;
  color: #fff;
  padding: 3.5rem 0;
}
.contact-hero .eyebrow { letter-spacing: 2px; text-transform: uppercase; font-size: .75rem; color: var(--gold, #C9A227); }
.contact-hero h1 { font-size: 2.2rem; font-weight: 600; }

.contact-channel { display: flex; gap: .9rem; align-items: flex-start; }
.contact-channel i { font-size: 1.2rem; color: var(--teal, #155263); width: 1.6rem; text-align: center; margin-top: .1rem; }
.social-btn { width: 2.2rem; height: 2.2rem; border-radius: 50%; background: #EFF3F5; color: var(--ink, #0B1E2D); display: flex; align-items: center; justify-content: center; }
.social-btn:hover { background: var(--gold, #C9A227); color: var(--ink, #0B1E2D); }

.contact-form-card { background: #fff; border-radius: .9rem; padding: 1.75rem; box-shadow: 0 4px 14px rgba(11,30,45,.08); }

.faq-item { border-bottom: 1px solid #EAE6DC; padding: 1rem 0; cursor: pointer; }
.faq-item:first-of-type { border-top: 1px solid #EAE6DC; }

.why-band { background: #EFF3F5; padding: 3rem 0; margin-top: 1rem; }
.why-item i { font-size: 1.6rem; color: var(--teal, #155263); }
.why-item p { color: var(--muted, #6B7280); }

.testimonial-card { background: #fff; border: 1px solid #EAE6DC; border-radius: .9rem; padding: 1.25rem; }

.gallery-main { border-radius: 1rem; overflow: hidden; height: 380px; }
.gallery-main img { width: 100%; height: 100%; object-fit: cover; }
.gallery-thumb { width: 84px; height: 64px; object-fit: cover; border-radius: .5rem; cursor: pointer; opacity: .65; border: 2px solid transparent; }
.gallery-thumb.active { opacity: 1; border-color: var(--gold, #C9A227); }

.breadcrumb-nav a { color: var(--teal, #155263); font-weight: 600; }

.room-card { border: 1px solid #EAE6DC; border-radius: .9rem; overflow: hidden; }
.room-card img { height: 170px; width: 100%; object-fit: cover; }

.rooms-more-wrap { text-align: center; margin-top: .5rem; }

.step-track { display: flex; align-items: center; justify-content: center; gap: .5rem; margin-bottom: 2rem; flex-wrap: wrap; }
.step-pill { width: 2.3rem; height: 2.3rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #E5E7EB; color: #9CA3AF; font-weight: 700; font-size: .9rem; }
.step-pill.active { background: var(--gold, #C9A227); color: var(--ink, #0B1E2D); }
.step-pill.done { background: var(--teal, #155263); color: #fff; }
.step-label { font-size: .78rem; color: var(--muted, #6B7280); margin-left: .4rem; margin-right: 1rem; }
.step-line { width: 36px; height: 2px; background: #E5E7EB; }

.summary-card { background: #fff; border-radius: 1rem; overflow: hidden; box-shadow: 0 4px 14px rgba(11,30,45,.08); position: sticky; top: 90px; }
.summary-img { width: 100%; height: 140px; object-fit: cover; }

.boarding-pass { background: #fff; border-radius: 1.1rem; box-shadow: 0 24px 48px rgba(11,30,45,.18); overflow: hidden; max-width: 640px; margin: 0 auto; }
.stub-top { background: var(--ink, #0B1E2D); color: #fff; padding: 1.5rem 1.75rem; }
.stub-eyebrow { text-transform: uppercase; font-size: .75rem; letter-spacing: 1px; color: var(--gold, #C9A227); }
.stub-check { color: var(--gold, #C9A227); }
.stub-body { padding: 1.75rem; }
.perforation { position: relative; border-top: 2px dashed #D8D2C4; margin: 0 1.75rem; }
.perforation .notch { position: absolute; top: -15px; width: 30px; height: 30px; background: var(--paper, #FBF9F5); border-radius: 50%; }
.perforation .notch.left { left: -30px; }
.perforation .notch.right { right: -30px; }
.pass-code { font-family: 'Inter', monospace; letter-spacing: 6px; font-weight: 700; color: var(--ink, #0B1E2D); }

.status-badge { font-size: .72rem; font-weight: 700; border-radius: .4rem; padding: .3rem .6rem; text-transform: uppercase; letter-spacing: .4px; }
.status-Upcoming { background: #E7F0E9; color: var(--success, #2F7D53); }
.status-Completed { background: #E7EEF1; color: var(--teal, #155263); }
.status-Cancelled { background: #F5E9E7; color: var(--danger, #B4413B); }

.notif-item { border-left: 3px solid transparent; cursor: pointer; }
.notif-item.unread { border-left-color: var(--gold, #C9A227); background: #FFFBF0; }
.notif-icon { width: 2.4rem; height: 2.4rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #EFF3F5; color: var(--teal, #155263); }

.star-rate i { cursor: pointer; color: #D9D2C4; font-size: 1.3rem; }
.star-rate i.filled { color: var(--gold, #C9A227); }

.avatar-circle { width: 72px; height: 72px; background: var(--ink, #0B1E2D); color: var(--gold, #C9A227); font-size: 1.5rem; font-weight: 700; border-radius: 50%; }
.profile-tabs .nav-link { color: var(--muted, #6B7280); font-weight: 600; }
.profile-tabs .nav-link.active { background: var(--ink, #0B1E2D); color: var(--gold, #C9A227); }

.narrow { max-width: 520px; }
.narrow-md { max-width: 640px; }

.confirm-backdrop { position: fixed; inset: 0; background: rgba(11,30,45,.55); display: flex; align-items: center; justify-content: center; z-index: 3000; }
.confirm-modal { background: #fff; border-radius: .9rem; padding: 1.5rem; max-width: 380px; width: 90%; box-shadow: 0 24px 48px rgba(11,30,45,.25); }

.toast-wrap { position: fixed; bottom: 1.25rem; right: 1.25rem; z-index: 2000; }

.newsletter-group .form-control { border-radius: .5rem 0 0 .5rem; }
.newsletter-group .btn { border-radius: 0 .5rem .5rem 0; }

footer { background: var(--ink, #0B1E2D); color: #B8C4CC; padding: 3rem 0 1.5rem; margin-top: 4rem; }
footer .brand-font { color: var(--gold, #C9A227); }
footer .footer-copy { color: #97A6AE; }
.footer-heading { color: #fff; font-weight: 700; font-size: .8rem; text-transform: uppercase; letter-spacing: .6px; margin-bottom: .8rem; }
.footer-links { list-style: none; padding: 0; margin: 0; }
.footer-links li { margin-bottom: .5rem; }
.footer-links a { color: #B8C4CC; text-decoration: none; font-size: .88rem; }
.footer-links a:hover { color: var(--gold, #C9A227); }
.footer-bottom { border-top: 1px solid rgba(255,255,255,.1); margin-top: 2rem; padding-top: 1.25rem; font-size: .78rem; color: #7C8B93; }

.fade-enter-active, .fade-leave-active { transition: opacity .18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

</style>