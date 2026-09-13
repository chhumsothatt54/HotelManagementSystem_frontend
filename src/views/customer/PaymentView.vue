<template>
  <div>
    <!-- NAVBAR -->
    <NavbarView />

    <!-- PAGE HEADER -->
    <section class="booking-header">
      <div class="container">
        <div class="eyebrow">FINAL STEP</div>
        <h1>Complete your payment</h1>
        <p>Review your booking details and select a payment method.</p>
      </div>
    </section>

    <!-- LOADING STATE -->
    <div class="container py-5 text-center mt-5" v-if="isLoading">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="text-muted mt-2">Loading booking details...</p>
    </div>

    <section class="container py-5" v-else-if="booking">
      <div class="row g-4">
        <!-- LEFT: PAYMENT FORM -->
        <div class="col-lg-7">
          <div class="booking-card">
            <h5 class="booking-card-title">Payment method</h5>
            <div class="payment-option" v-for="p in paymentMethods" :key="p.id"
                 :class="{ active: selectedPayment === p.id }"
                 @click="selectedPayment = p.id">
              <span>{{ p.icon }}</span>
              <span class="fw-semibold">{{ p.label }}</span>
            </div>
          </div>
        </div>

        <!-- RIGHT: SUMMARY -->
        <div class="col-lg-5">
          <div class="summary-card">
            <div class="p-4 mt-2">
              <div class="stay-name">{{ booking.hotel?.name || 'Hotel Name' }}</div>
              <div class="stay-loc mb-3">Booking ID: {{ booking.booking_number }}</div>

              <hr>

              <div class="d-flex justify-content-between summary-line">
                <span>Room</span>
                <span class="fw-semibold">{{ booking.room?.room_type || 'Standard Room' }} ({{ booking.room?.room_number || 'TBD' }})</span>
              </div>

              <div class="d-flex justify-content-between summary-line">
                <span>Check-in</span>
                <span class="fw-semibold">{{ booking.check_in || '—' }}</span>
              </div>

              <div class="d-flex justify-content-between summary-line">
                <span>Check-out</span>
                <span class="fw-semibold">{{ booking.check_out || '—' }}</span>
              </div>

              <div class="d-flex justify-content-between summary-line">
                <span>Nights</span>
                <span class="fw-semibold">{{ booking.nights }}</span>
              </div>

              <hr>

              <div class="d-flex justify-content-between summary-total">
                <span>Total Amount</span>
                <span>${{ booking.total_amount }}</span>
              </div>

              <button
                class="btn btn-primary-brand w-100 mt-4"
                :disabled="!selectedPayment || isSubmitting"
                @click="confirmPayment"
              >
                <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Pay Now
              </button>

              <p class="summary-note text-center mt-3">
                Your payment is secure and encrypted.
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavbarView from '@/components/layout/customer/NavbarView.vue'
import FooterView from '@/components/layout/customer/FooterView.vue'
import { useCustomerStore } from '@/stores/customer'

const route = useRoute()
const router = useRouter()
const customerStore = useCustomerStore()

const isLoading = ref(true)
const isSubmitting = ref(false)
const booking = ref(null)
const selectedPayment = ref('')

const paymentMethods = ref([
  { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'aba', label: 'ABA PayWay', icon: '📱' },
  { id: 'cash', label: 'Pay at Hotel', icon: '🏨' }
])

onMounted(async () => {
  const bookingId = route.query.bookingId
  if (!bookingId) {
    alert("No booking ID found. Redirecting to home.")
    router.push('/')
    return
  }
  
  try {
    const res = await customerStore.bookingConfirmation(bookingId)
    booking.value = res.data || res
  } catch (err) {
    console.error('Failed to load booking details:', err)
    alert("Failed to load booking details. You can view it in your profile.")
    router.push('/settings')
  } finally {
    isLoading.value = false
  }
})

async function confirmPayment() {
  if (!selectedPayment.value || isSubmitting.value) return
  
  isSubmitting.value = true
  try {
    const bookingId = route.query.bookingId
    
    await customerStore.createPayment({
      booking_id: bookingId,
      amount: booking.value.total_amount,
      payment_method: selectedPayment.value,
      transaction_id: 'TRX-' + Date.now()
    })
    
    alert(`Payment successful! Your booking is confirmed.`)
    router.push('/settings')
  } catch (err) {
    console.error('Failed to confirm payment:', err)
    alert('Failed to process payment. ' + (err.response?.data?.message || ''))
  } finally {
    isSubmitting.value = false
  }
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
  margin-bottom: 1rem;
}

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

.summary-card {
  border: 1px solid #E1E9E5;
  border-radius: 12px;
  background: #fff;
  overflow: hidden;
  position: sticky;
  top: 95px;
  z-index: 10;
}

.stay-name {
  font-weight: 700;
  color: #063B32;
  font-size: 1.1rem;
}

.stay-loc {
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
  padding: 0.75rem;
  font-weight: 600;
  border-radius: 8px;
}

.btn-primary-brand:hover {
  background: #063B32;
  color: #fff;
}

.btn-primary-brand:disabled {
  background: #E1E9E5;
  color: #6B7772;
  cursor: not-allowed;
}
</style>