<template>
  <div>
    <NavbarView />

    <div v-if="hotel">
      <!-- BACK LINK -->
      <div class="container pt-4">
        <router-link to="/" class="back-link">
          ← Back to all stays
        </router-link>
      </div>

      <!-- GALLERY -->
      <section class="container pt-3 pb-0">
        <div class="gallery-grid">
          <div class="gallery-main">
            <img :src="hotel.img" :alt="hotel.name">
            <span v-if="hotel.tag" class="stay-tag gallery-tag">
              {{ hotel.tag }}
            </span>
          </div>

          <div class="gallery-side">
            <div class="gallery-thumb" v-for="n in 4" :key="n">
              <img :src="hotel.img" :alt="hotel.name">
            </div>
          </div>
        </div>
      </section>

      <!-- HEADER -->
      <section class="container pt-4 pb-2">
        <div class="row">
          <div class="col-lg-8">

            <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
              <div>
                <h1 class="hotel-title">{{ hotel.name }}</h1>
                <div class="hotel-loc">📍 {{ hotel.location }}</div>
              </div>

              <div class="d-flex align-items-center gap-2">
                <div class="rating-badge">
                  ★ {{ hotel.rating }}
                </div>
                <button class="stay-fav detail-fav" :class="{ active: hotel.fav }" @click="hotel.fav = !hotel.fav">
                  {{ hotel.fav ? '♥' : '♡' }}
                </button>
              </div>
            </div>

            <div class="stay-amenities mt-3 mb-4">
              <span class="amenity-pill" v-for="a in hotel.amenities" :key="a">
                {{ a }}
              </span>
            </div>

            <hr class="section-divider">

            <!-- DESCRIPTION -->
            <div class="detail-block">
              <h2 class="block-title">About this stay</h2>
              <p class="block-text">
                {{ hotel.description || defaultDescription }}
              </p>
            </div>

            <hr class="section-divider">

            <!-- AMENITIES FULL -->
            <div class="detail-block">
              <h2 class="block-title">What this place offers</h2>
              <div class="row g-3">
                <div class="col-6 col-md-4" v-for="a in hotel.amenities" :key="a">
                  <div class="amenity-full">
                    <span class="amenity-dot"></span>
                    {{ a }}
                  </div>
                </div>
              </div>
            </div>

            <hr class="section-divider">

            <!-- ROOMS -->
            <div class="detail-block">
              <h2 class="block-title">Available rooms</h2>

              <div class="rooms-card">
                <div class="room-row" v-for="room in rooms" :key="room.name">
                  <div>
                    <div class="room-name">{{ room.name }}</div>
                    <div class="room-sub">{{ room.desc }}</div>
                  </div>

                  <div class="d-flex align-items-center gap-3">
                    <div class="room-price">${{ room.price }}<span class="price-unit">/night</span></div>
                    <button class="btn btn-outline-brand btn-sm">Select</button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- BOOKING CARD -->
          <div class="col-lg-4">
            <div class="booking-card">
              <div class="d-flex align-items-baseline gap-1 mb-3">
                <span v-if="hotel.oldPrice" class="price-strike me-1">${{ hotel.oldPrice }}</span>
                <span class="price-now booking-price">${{ hotel.price }}</span>
                <span class="price-unit">/night</span>
              </div>

              <div class="search-field mb-2">
                <label>Check-in</label>
                <input type="date" class="form-control" v-model="booking.checkin">
              </div>

              <div class="search-field mb-2">
                <label>Check-out</label>
                <input type="date" class="form-control" v-model="booking.checkout">
              </div>

              <div class="search-field mb-3">
                <label>Guests</label>
                <input type="number" min="1" class="form-control" v-model="booking.guests">
              </div>

              <button class="btn btn-primary-brand w-100 mb-3">
                Reserve now
              </button>

              <p class="booking-note">You won't be charged yet</p>

              <hr class="section-divider">

              <div class="d-flex justify-content-between booking-line">
                <span>${{ hotel.price }} x {{ nights }} nights</span>
                <span>${{ hotel.price * nights }}</span>
              </div>

              <div class="d-flex justify-content-between booking-line">
                <span>Service fee</span>
                <span>${{ serviceFee }}</span>
              </div>

              <hr class="section-divider">

              <div class="d-flex justify-content-between booking-total">
                <span>Total</span>
                <span>${{ hotel.price * nights + serviceFee }}</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      <ReviewView />
    </div>

    <!-- NOT FOUND -->
    <div v-else class="container not-found">
      <div class="not-found-icon">🏨</div>
      <h2 class="section-title">Hotel not found</h2>
      <p class="section-sub mb-4">The stay you're looking for doesn't exist or was removed.</p>
      <router-link to="/" class="btn btn-primary-brand">
        Back to all stays
      </router-link>
    </div>

    <FooterView />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import FooterView from '@/components/layout/customer/FooterView.vue'

import NavbarView from '@/components/layout/customer/NavbarView.vue'

const route = useRoute()

// NOTE: this list must match the "id"s used on the list page's
// "View Hotel" links. Keep both arrays in sync, or move this into
// a shared composable/store once your app grows.
const stays = ref([
  {
    id: 1,
    name: 'Riverside Heritage Hotel',
    location: 'Phnom Penh, Cambodia',
    rating: 4.7,
    price: 41,
    oldPrice: 45,
    tag: 'Popular',
    fav: false,
    amenities: ['Free WiFi', 'Pool', 'Breakfast Included'],
    img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'Temple Grove Boutique',
    location: 'Siem Reap, Cambodia',
    rating: 4.9,
    price: 60,
    fav: false,
    amenities: ['Free WiFi', 'Pool', 'Breakfast Included'],
    img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Sokha Bay Seaview',
    location: 'Sihanoukville, Cambodia',
    rating: 4.4,
    price: 32,
    oldPrice: 38,
    tag: '-15%',
    fav: false,
    amenities: ['Beach Access', 'Free WiFi', 'Restaurant'],
    img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 4,
    name: 'Old Market Homestay',
    location: 'Battambang, Cambodia',
    rating: 4.6,
    price: 22,
    fav: false,
    amenities: ['Free WiFi', 'Breakfast Included', 'Bicycle Rental'],
    img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 5,
    name: 'Kampot Riverside Lodge',
    location: 'Kampot, Cambodia',
    rating: 4.8,
    price: 50,
    fav: false,
    amenities: ['Free WiFi', 'Pool', 'Restaurant'],
    img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 6,
    name: 'Kep Cliffside Villas',
    location: 'Kep, Cambodia',
    rating: 4.5,
    price: 42,
    fav: false,
    amenities: ['Sea View', 'Free WiFi', 'Free Parking'],
    img: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=800&auto=format&fit=crop'
  }
])

const hotel = computed(() =>
  stays.value.find(s => s.id === Number(route.params.id))
)

const defaultDescription =
  'A handpicked stay offering comfort and character, just steps from local landmarks. Enjoy thoughtful service, warm hospitality, and easy access to everything worth seeing nearby.'

const rooms = computed(() => {
  if (!hotel.value) return []
  return [
    { name: 'Standard Room', desc: '1 queen bed · City view', price: hotel.value.price },
    { name: 'Deluxe Room', desc: '1 king bed · Balcony', price: hotel.value.price + 15 },
    { name: 'Suite', desc: '2 beds · Living area · Best view', price: hotel.value.price + 35 }
  ]
})

const booking = ref({
  checkin: '',
  checkout: '',
  guests: 2
})

const nights = computed(() => {
  if (!booking.value.checkin || !booking.value.checkout) return 1
  const diff = new Date(booking.value.checkout) - new Date(booking.value.checkin)
  const n = Math.round(diff / (1000 * 60 * 60 * 24))
  return n > 0 ? n : 1
})

const serviceFee = 8
</script>

<style scoped>
.back-link {
  color: var(--muted);
  font-weight: 600;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: var(--blue);
}

/* GALLERY */
.gallery-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 0.75rem;
  height: 420px;
}

.gallery-main {
  position: relative;
  border-radius: var(--radius);
  overflow: hidden;
}

.gallery-main img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-tag {
  top: 1rem;
  left: 1rem;
}

.gallery-side {
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  grid-auto-flow: column;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.gallery-thumb {
  border-radius: var(--radius);
  overflow: hidden;
}

.gallery-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* HEADER */
.hotel-title {
  font-size: clamp(1.5rem, 2.6vw, 2.1rem);
  font-weight: 600;
  color: var(--navy);
  margin-bottom: 0.3rem;
}

.hotel-loc {
  color: var(--muted);
  font-size: 0.95rem;
}

.rating-badge {
  background: var(--blue-light);
  color: var(--navy);
  font-weight: 700;
  font-size: 0.9rem;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
}

.detail-fav {
  position: static;
  background: #fff;
  border: 1px solid var(--line);
}

.section-divider {
  border: none;
  border-top: 1px solid var(--line);
  margin: 1.8rem 0;
}

/* DETAIL BLOCKS */
.block-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--navy);
  margin-bottom: 0.8rem;
}

.block-text {
  color: var(--ink);
  font-size: 0.95rem;
  line-height: 1.6;
}

.amenity-full {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--ink);
}

.amenity-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--blue);
  flex-shrink: 0;
}

/* ROOMS CARD */
.rooms-card {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 0 1.25rem;
  box-shadow: 0 12px 30px rgba(6, 59, 50, 0.08);
}

.room-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--line);
}

.room-row:last-child {
  border-bottom: none;
}

.room-name {
  font-weight: 700;
  color: var(--navy);
  font-size: 0.95rem;
}

.room-sub {
  color: var(--muted);
  font-size: 0.82rem;
}

.room-price {
  font-weight: 700;
  color: var(--navy);
  font-size: 1rem;
}

/* BOOKING CARD */
.booking-card {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 1.5rem;
  position: sticky;
  top: 1.5rem;
  box-shadow: 0 12px 30px rgba(6, 59, 50, 0.08);
}

.booking-price {
  font-size: 1.4rem;
}

.booking-note {
  text-align: center;
  color: var(--muted);
  font-size: 0.8rem;
  margin: 0;
}

.booking-line {
  color: var(--ink);
  font-size: 0.88rem;
  margin-bottom: 0.6rem;
}

.booking-total {
  font-weight: 700;
  color: var(--navy);
  font-size: 1rem;
}

/* NOT FOUND */
.not-found {
  text-align: center;
  padding: 6rem 1rem;
}

.not-found-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

@media (max-width: 767px) {
  .gallery-grid {
    grid-template-columns: 1fr;
    height: auto;
  }

  .gallery-main {
    height: 240px;
  }

  .gallery-side {
    display: none;
  }

  .booking-card {
    position: static;
    margin-top: 2rem;
  }
}
</style>