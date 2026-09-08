<template>
  <div>
    <!-- NAVBAR -->
    <NavbarView />

    <!-- PAGE HEADER -->
    <section class="booking-header">
      <div class="container">
        <div class="eyebrow">CONFIRM YOUR STAY</div>
        <h1>Complete your booking</h1>
        <p>You're just a few steps away from your stay at {{ hotel.name }}.</p>
      </div>
    </section>

    <section class="container py-5">
      <div class="row g-4">

        <!-- LEFT: FORM -->
        <div class="col-lg-7">

          <!-- STEP 1: DATES & GUESTS -->
          <div class="booking-card mb-4">
            <h5 class="booking-card-title">1. Dates &amp; Guests</h5>

            <div class="row g-3">
              <div class="col-md-4">
                <label class="form-label-sm">Check-in</label>
                <input type="date" class="form-control" v-model="booking.checkin">
              </div>

              <div class="col-md-4">
                <label class="form-label-sm">Check-out</label>
                <input type="date" class="form-control" v-model="booking.checkout">
              </div>

              <div class="col-md-4">
                <label class="form-label-sm">Guests</label>
                <input type="number" min="1" class="form-control" v-model.number="booking.guests">
              </div>
            </div>

            <div class="nights-pill mt-3" v-if="nights > 0">
              {{ nights }} night{{ nights > 1 ? 's' : '' }} stay
            </div>
          </div>

          <!-- STEP 2: SELECTED ROOM SUMMARY -->
          <div class="booking-card mb-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="booking-card-title mb-0">2. Selected Room</h5>
              <router-link :to="`/hotel/${hotel.id}`" class="change-room-link">
                Change Room
              </router-link>
            </div>

            <div v-if="selectedRoomObj" class="selected-room-box">
              <div class="room-img-wrap">
                <img :src="selectedRoomObj.img" :alt="selectedRoomObj.name" class="room-img">
              </div>

              <div class="room-info">
                <div class="room-name">{{ selectedRoomObj.name }}</div>
                <div class="room-desc">{{ selectedRoomObj.desc }}</div>
                <div class="stay-amenities mt-2">
                  <span class="amenity-pill" v-for="a in selectedRoomObj.amenities" :key="a">{{ a }}</span>
                </div>
              </div>

              <div class="room-price">
                <div class="price-now">${{ selectedRoomObj.price }}</div>
                <div class="price-unit">/night</div>
              </div>
            </div>
          </div>

          <!-- STEP 3: GUEST DETAILS -->
          <div class="booking-card mb-4">
            <h5 class="booking-card-title">3. Guest details</h5>

            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label-sm">Full name</label>
                <input type="text" class="form-control" v-model="guest.name" placeholder="Sokha Chan">
              </div>

              <div class="col-md-6">
                <label class="form-label-sm">Email</label>
                <input type="email" class="form-control" v-model="guest.email" placeholder="sokha@email.com">
              </div>

              <div class="col-md-6">
                <label class="form-label-sm">Phone</label>
                <input type="tel" class="form-control" v-model="guest.phone" placeholder="+855 12 345 678">
              </div>

              <div class="col-md-6">
                <label class="form-label-sm">Special requests</label>
                <input type="text" class="form-control" v-model="guest.notes" placeholder="Optional">
              </div>
            </div>
          </div>

          <!-- STEP 4: PAYMENT -->
          <div class="booking-card">
            <h5 class="booking-card-title">4. Payment method</h5>

            <div class="payment-option" v-for="p in paymentMethods" :key="p.id"
                 :class="{ active: booking.payment === p.id }"
                 @click="booking.payment = p.id">
              <span>{{ p.icon }}</span>
              <span class="fw-semibold">{{ p.label }}</span>
            </div>
          </div>

        </div>

        <!-- RIGHT: SUMMARY -->
        <div class="col-lg-5">
          <div class="summary-card">

            <div class="stay-img-wrap summary-img">
              <img :src="hotel.img" :alt="hotel.name">
            </div>

            <div class="p-3">
              <div class="stay-name">{{ hotel.name }}</div>
              <div class="stay-loc mb-2">📍 {{ hotel.location }}</div>
              <div class="stay-rating mb-3">★ {{ hotel.rating }}</div>

              <hr>

              <div class="d-flex justify-content-between summary-line">
                <span>Room</span>
                <span class="fw-semibold">{{ selectedRoomObj?.name || '—' }}</span>
              </div>

              <div class="d-flex justify-content-between summary-line">
                <span>Check-in</span>
                <span class="fw-semibold">{{ booking.checkin || '—' }}</span>
              </div>

              <div class="d-flex justify-content-between summary-line">
                <span>Check-out</span>
                <span class="fw-semibold">{{ booking.checkout || '—' }}</span>
              </div>

              <div class="d-flex justify-content-between summary-line">
                <span>Guests</span>
                <span class="fw-semibold">{{ booking.guests }}</span>
              </div>

              <hr>

              <div class="d-flex justify-content-between summary-line">
                <span>${{ selectedRoomPrice }} x {{ nights }} night{{ nights !== 1 ? 's' : '' }}</span>
                <span>${{ roomTotal }}</span>
              </div>

              <div class="d-flex justify-content-between summary-line">
                <span>Service fee</span>
                <span>${{ serviceFee }}</span>
              </div>

              <hr>

              <div class="d-flex justify-content-between summary-total">
                <span>Total</span>
                <span>${{ total }}</span>
              </div>

              <button
                class="btn btn-primary-brand w-100 mt-3"
                :disabled="!canConfirm"
                @click="confirmBooking"
              >
                Confirm Booking
              </button>

              <p class="summary-note">
                You won't be charged yet. Review your details before confirming.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>

    <FooterView />
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import NavbarView from '@/components/layout/customer/NavbarView.vue'
import FooterView from '@/components/layout/customer/FooterView.vue'

const route = useRoute()

const mockHotels = [
  {
    id: 1,
    name: 'Riverside Heritage Hotel',
    location: 'Phnom Penh, Cambodia',
    rating: 4.7,
    img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop',
    rooms: [
      {
        id: 101,
        name: 'Deluxe King Room',
        desc: '1 King Bed · City View · 35 m²',
        price: 41,
        img: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=600&auto=format&fit=crop',
        amenities: ['Free WiFi', 'Balcony', 'AC']
      },
      {
        id: 102,
        name: 'River Suite',
        desc: '1 King Bed · River View · 50 m²',
        price: 65,
        img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600&auto=format&fit=crop',
        amenities: ['Free WiFi', 'Bathtub', 'Breakfast']
      }
    ]
  },
  {
    id: 2,
    name: 'Temple Grove Boutique',
    location: 'Siem Reap, Cambodia',
    rating: 4.9,
    img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800&auto=format&fit=crop',
    rooms: [
      {
        id: 201,
        name: 'Deluxe Pool View Room',
        desc: '1 King Bed · Pool View · 32 m²',
        price: 60,
        img: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=600&auto=format&fit=crop',
        amenities: ['Free WiFi', 'AC']
      },
      {
        id: 202,
        name: 'Angkor Garden Villa',
        desc: '1 King Bed · Garden View · 55 m²',
        price: 95,
        img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600&auto=format&fit=crop',
        amenities: ['Free WiFi', 'Private Pool', 'Breakfast']
      }
    ]
  },
  {
    id: 3,
    name: 'Sokha Bay Seaview',
    location: 'Sihanoukville, Cambodia',
    rating: 4.4,
    img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop',
    rooms: [
      {
        id: 301,
        name: 'Standard Ocean Room',
        desc: '1 Double Bed · Sea View · 28 m²',
        price: 32,
        img: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600&auto=format&fit=crop',
        amenities: ['Free WiFi', 'Balcony', 'AC']
      },
      {
        id: 302,
        name: 'Deluxe Beachfront Suite',
        desc: '1 King Bed · Direct Beach Access · 45 m²',
        price: 58,
        img: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=600&auto=format&fit=crop',
        amenities: ['Free WiFi', 'Mini Bar', 'Breakfast']
      }
    ]
  }
]

const hotel = computed(() => {
  const queryHotelId = Number(route.query.hotelId || route.params.id)
  return mockHotels.find(h => h.id === queryHotelId) || mockHotels[0]
})

const rooms = computed(() => hotel.value?.rooms || [])

const paymentMethods = ref([
  { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'aba', label: 'ABA PayWay', icon: '📱' },
  { id: 'cash', label: 'Pay at Hotel', icon: '🏨' }
])

const booking = reactive({
  checkin: '',
  checkout: '',
  guests: 2,
  roomId: null,
  payment: ''
})

const guest = reactive({
  name: '',
  email: '',
  phone: '',
  notes: ''
})

watch(
  () => route.query,
  (newQuery) => {
    const qRoomId = Number(newQuery.roomId)
    const foundRoom = rooms.value.find(r => r.id === qRoomId)
    
    if (foundRoom) {
      booking.roomId = foundRoom.id
    } else if (rooms.value.length > 0) {
      booking.roomId = rooms.value[0].id
    }
  },
  { immediate: true }
)

const nights = computed(() => {
  if (!booking.checkin || !booking.checkout) return 0
  const inDate = new Date(booking.checkin)
  const outDate = new Date(booking.checkout)
  const diff = (outDate - inDate) / (1000 * 60 * 60 * 24)
  return diff > 0 ? diff : 0
})

const selectedRoomObj = computed(() => {
  return rooms.value.find(r => r.id === booking.roomId)
})

const selectedRoomPrice = computed(() => {
  return selectedRoomObj.value ? selectedRoomObj.value.price : 0
})

const roomTotal = computed(() => selectedRoomPrice.value * nights.value)
const serviceFee = computed(() => (roomTotal.value > 0 ? 5 : 0))
const total = computed(() => roomTotal.value + serviceFee.value)

const canConfirm = computed(() =>
  booking.checkin &&
  booking.checkout &&
  nights.value > 0 &&
  booking.roomId &&
  booking.payment &&
  guest.name &&
  guest.email
)

function confirmBooking() {
  if (!canConfirm.value) return
  alert(`Booking confirmed for ${guest.name}! Total: $${total.value}`)
}
</script>

<style scoped>
/* FIX NAVBAR OVERLAP */
:deep(nav),
:deep(.navbar),
:deep(header) {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  z-index: 1050 !important;
  background-color: #ffffff !important;
}

.booking-header {
  background: #f8f9fa;
  padding: 6rem 0 2rem;
  text-align: left;
}

.booking-header .eyebrow {
  color: #087F68;
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: 0.02em;
}

.booking-header h1 {
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  color: #063B32;
  margin: 0.4rem 0 0.4rem;
  font-family: 'Fraunces', serif;
}

.booking-header p {
  color: #6B7772;
  margin: 0;
}

.booking-card {
  border: 1px solid #E1E9E5;
  border-radius: 12px;
  background: #fff;
  padding: 1.4rem;
}

.booking-card-title {
  color: #063B32;
  font-weight: 700;
  margin-bottom: 0;
}

.form-label-sm {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6B7772;
  margin-bottom: 0.25rem;
  display: block;
}

.nights-pill {
  display: inline-block;
  background: #E8F6F2;
  color: #087F68;
  font-weight: 600;
  font-size: 0.82rem;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
}

/* SELECTED ROOM DISPLAY STYLES */
.selected-room-box {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  border: 1px solid #087F68;
  border-radius: 12px;
  padding: 0.8rem;
  background: #E8F6F2;
}

.change-room-link {
  color: #087F68;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
}

.change-room-link:hover {
  text-decoration: underline;
}

.room-img-wrap {
  width: 110px;
  height: 85px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
}

.room-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.room-info {
  flex-grow: 1;
}

.room-name {
  font-weight: 700;
  color: #063B32;
  font-size: 1rem;
}

.room-desc {
  color: #6B7772;
  font-size: 0.85rem;
}

.room-price {
  text-align: right;
  white-space: nowrap;
  padding-right: 0.5rem;
}

.price-now {
  font-weight: 700;
  color: #063B32;
  font-size: 1.15rem;
}

.price-unit {
  font-size: 0.75rem;
  color: #6B7772;
}

@media (max-width: 576px) {
  .selected-room-box {
    flex-direction: column;
    align-items: flex-start;
  }
  .room-img-wrap {
    width: 100%;
    height: 140px;
  }
  .room-price {
    text-align: left;
    margin-top: 0.5rem;
  }
}

/* PAYMENT OPTIONS */
.payment-option {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border: 1px solid #E1E9E5;
  border-radius: 10px;
  padding: 0.8rem 1rem;
  margin-bottom: 0.6rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.payment-option:hover {
  border-color: #087F68;
}

.payment-option.active {
  border-color: #087F68;
  background: #E8F6F2;
}

/* SUMMARY CARD */
.summary-card {
  border: 1px solid #E1E9E5;
  border-radius: 12px;
  background: #fff;
  overflow: hidden;
  position: sticky;
  top: 95px;
  z-index: 10;
}

.summary-img img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.stay-name {
  font-weight: 700;
  color: #063B32;
  font-size: 1.1rem;
}

.stay-loc, .stay-rating {
  font-size: 0.85rem;
  color: #6B7772;
}

.summary-line {
  font-size: 0.9rem;
  color: #212529;
  padding: 0.3rem 0;
}

.summary-total {
  font-weight: 700;
  font-size: 1.1rem;
  color: #063B32;
}

.summary-note {
  font-size: 0.75rem;
  color: #6B7772;
  margin-top: 0.6rem;
  margin-bottom: 0;
}

.btn-primary-brand {
  background: #087F68;
  color: #fff;
  border: none;
}

.btn-primary-brand:hover {
  background: #063B32;
  color: #fff;
}

.amenity-pill {
  display: inline-block;
  background: #fff;
  color: #087F68;
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  margin-right: 0.3rem;
  border: 1px solid #E1E9E5;
}
</style>