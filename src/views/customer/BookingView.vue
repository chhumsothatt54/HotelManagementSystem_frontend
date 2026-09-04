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

          <!-- STEP: DATES & GUESTS -->
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

          <!-- STEP: ROOM SELECTION -->
          <div class="booking-card mb-4">
            <h5 class="booking-card-title">2. Choose a room</h5>

            <div
              class="room-option"
              v-for="r in rooms"
              :key="r.name"
              :class="{ active: booking.room === r.name }"
              @click="booking.room = r.name"
            >
              <div>
                <div class="room-name">{{ r.name }}</div>
                <div class="room-desc">{{ r.desc }}</div>
                <div class="stay-amenities mt-1">
                  <span class="amenity-pill" v-for="a in r.amenities" :key="a">{{ a }}</span>
                </div>
              </div>

              <div class="room-price">
                <div class="price-now">${{ r.price }}</div>
                <div class="price-unit">/night</div>
              </div>
            </div>
          </div>

          <!-- STEP: GUEST DETAILS -->
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

          <!-- STEP: PAYMENT -->
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
                <span class="fw-semibold">{{ booking.room || '—' }}</span>
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
import { ref, reactive, computed } from 'vue'
import NavbarView from '@/components/layout/customer/NavbarView.vue'
import FooterView from '@/components/layout/customer/FooterView.vue'

// In a real app, this would come from route params / an API call
const hotel = ref({
  name: 'Riverside Heritage Hotel',
  location: 'Phnom Penh, Cambodia',
  rating: 4.7,
  img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop'
})

const rooms = ref([
  {
    name: 'Standard Room',
    desc: 'Cozy room with garden view',
    price: 41,
    amenities: ['Free WiFi', 'Breakfast Included']
  },
  {
    name: 'Deluxe Room',
    desc: 'Spacious room with river view',
    price: 60,
    amenities: ['Free WiFi', 'Pool Access', 'Breakfast Included']
  },
  {
    name: 'Suite',
    desc: 'Premium suite with balcony',
    price: 95,
    amenities: ['Free WiFi', 'Pool Access', 'Breakfast Included', 'Late Checkout']
  }
])

const paymentMethods = ref([
  { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'aba', label: 'ABA PayWay', icon: '📱' },
  { id: 'cash', label: 'Pay at Hotel', icon: '🏨' }
])

const booking = reactive({
  checkin: '',
  checkout: '',
  guests: 2,
  room: '',
  payment: ''
})

const guest = reactive({
  name: '',
  email: '',
  phone: '',
  notes: ''
})

const nights = computed(() => {
  if (!booking.checkin || !booking.checkout) return 0
  const inDate = new Date(booking.checkin)
  const outDate = new Date(booking.checkout)
  const diff = (outDate - inDate) / (1000 * 60 * 60 * 24)
  return diff > 0 ? diff : 0
})

const selectedRoomPrice = computed(() => {
  const r = rooms.value.find(r => r.name === booking.room)
  return r ? r.price : 0
})

const roomTotal = computed(() => selectedRoomPrice.value * nights.value)
const serviceFee = computed(() => (roomTotal.value > 0 ? 5 : 0))
const total = computed(() => roomTotal.value + serviceFee.value)

const canConfirm = computed(() =>
  booking.checkin &&
  booking.checkout &&
  nights.value > 0 &&
  booking.room &&
  booking.payment &&
  guest.name &&
  guest.email
)

function confirmBooking() {
  if (!canConfirm.value) return
  // Replace with actual API call, e.g. axios.post('/api/bookings', { ...booking, guest })
  console.log('Booking submitted:', { hotel: hotel.value.name, ...booking, guest, total: total.value })
  alert(`Booking confirmed for ${guest.name}! Total: $${total.value}`)
}
</script>

<style scoped>
.booking-header {
  background: var(--bg-soft);
  padding: 3rem 0 2rem;
  text-align: left;
}

.booking-header .eyebrow {
  color: var(--blue);
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: 0.02em;
}

.booking-header h1 {
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  color: var(--navy);
  margin: 0.4rem 0 0.4rem;
}

.booking-header p {
  color: var(--muted);
  margin: 0;
}

.booking-card {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: #fff;
  padding: 1.4rem;
}

.booking-card-title {
  color: var(--navy);
  font-weight: 700;
  margin-bottom: 1rem;
}

.form-label-sm {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--muted);
  margin-bottom: 0.25rem;
  display: block;
}

.nights-pill {
  display: inline-block;
  background: var(--blue-light);
  color: var(--blue);
  font-weight: 600;
  font-size: 0.82rem;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
}

/* ROOM OPTIONS */
.room-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 0.9rem 1rem;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.room-option:hover {
  border-color: var(--sky);
}

.room-option.active {
  border-color: var(--blue);
  background: var(--blue-light);
}

.room-name {
  font-weight: 700;
  color: var(--navy);
}

.room-desc {
  color: var(--muted);
  font-size: 0.85rem;
}

.room-price {
  text-align: right;
  white-space: nowrap;
}

/* PAYMENT OPTIONS */
.payment-option {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 0.8rem 1rem;
  margin-bottom: 0.6rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.payment-option:hover {
  border-color: var(--sky);
}

.payment-option.active {
  border-color: var(--blue);
  background: var(--blue-light);
}

/* SUMMARY CARD */
.summary-card {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: #fff;
  overflow: hidden;
  position: sticky;
  top: 90px;
}

.summary-img {
  aspect-ratio: 16 / 9;
}

.summary-line {
  font-size: 0.9rem;
  color: var(--ink);
  padding: 0.3rem 0;
}

.summary-total {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--navy);
}

.summary-note {
  font-size: 0.75rem;
  color: var(--muted);
  margin-top: 0.6rem;
  margin-bottom: 0;
}
</style>