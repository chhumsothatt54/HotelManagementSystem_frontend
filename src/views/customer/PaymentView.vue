<template>
  <div class="payment-page">
    <!-- NAVBAR -->
    <NavbarView />

    <!-- PAGE HEADER -->
    <section class="payment-header-section">
      <div class="container">
        <div class="badge-step mb-2">FINAL STEP</div>
        <h1 class="page-title">Complete Your Payment</h1>
        <p class="page-subtitle">Review your booking details and select a preferred payment method.</p>
      </div>
    </section>

    <!-- LOADING STATE -->
    <div class="container py-5 text-center my-5" v-if="isLoading">
      <div class="spinner-border text-teal" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="text-muted mt-3 fw-medium">Loading booking details...</p>
    </div>

    <!-- MAIN CONTENT -->
    <section class="container pb-5 mb-5" v-else-if="booking">
      <div class="row g-4">
        
        <!-- LEFT: PAYMENT METHODS -->
        <div class="col-lg-7">
          <div class="custom-card p-4 p-md-4">
            <h4 class="section-heading mb-4">
              <i class="bi bi-wallet2 me-2 text-teal"></i>Payment Method
            </h4>
            
            <div class="payment-options-grid">
              <div 
                class="payment-option-card" 
                v-for="p in paymentMethods" 
                :key="p.id"
                :class="{ active: selectedPayment === p.id }"
                @click="selectPaymentMethod(p.id)"
              >
                <div class="d-flex align-items-center gap-3">
                  <div class="payment-icon-wrapper">
                    <span class="fs-4">{{ p.icon }}</span>
                  </div>
                  <div>
                    <h6 class="mb-1 fw-bold text-dark">{{ p.label }}</h6>
                    <p class="mb-0 text-muted small">{{ p.desc }}</p>
                  </div>
                </div>
                <div class="form-check custom-radio">
                  <input class="form-check-input" type="radio" :name="'paymentMethod'" :checked="selectedPayment === p.id" />
                </div>
              </div>
            </div>

            <!-- PAY AT HOTEL INFO -->
            <div v-if="selectedPayment === 'cash'" class="cash-info-box mt-4 p-4 rounded-4 animate-fade-in">
              <div class="d-flex gap-3">
                <div class="fs-3 text-warning">🏨</div>
                <div>
                  <h6 class="fw-bold text-dark">Pay at Hotel</h6>
                  <p class="text-muted small mb-0">You can pay with cash or card directly at the hotel upon check-in. Your booking will be safely reserved.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- RIGHT: SUMMARY -->
        <div class="col-lg-5">
          <div class="custom-card summary-card p-4">
            <h4 class="section-heading mb-3">Booking Summary</h4>
            
            <div class="hotel-info-preview mb-3 pb-3 border-bottom">
              <div class="stay-name text-teal fw-bold fs-5">{{ booking.hotel?.name || 'Hotel Name' }}</div>
              <div class="stay-loc text-muted small"><i class="bi bi-hash"></i> Booking No: <span class="fw-semibold text-dark">{{ booking.booking_number }}</span></div>
            </div>

            <div class="summary-details">
              <div class="d-flex justify-content-between summary-line mb-2">
                <span class="text-muted">Room</span>
                <span class="fw-semibold text-dark text-end">{{ booking.room?.room_type || 'Standard Room' }} <br><small class="text-muted">({{ booking.room?.room_number || 'TBD' }})</small></span>
              </div>

              <div class="d-flex justify-content-between summary-line mb-2">
                <span class="text-muted">Check-in Date</span>
                <span class="fw-semibold text-dark">{{ booking.check_in || '—' }}</span>
              </div>

              <div class="d-flex justify-content-between summary-line mb-2">
                <span class="text-muted">Check-out Date</span>
                <span class="fw-semibold text-dark">{{ booking.check_out || '—' }}</span>
              </div>

              <div class="d-flex justify-content-between summary-line mb-3">
                <span class="text-muted">Duration</span>
                <span class="fw-semibold text-dark">{{ booking.nights }} Night(s)</span>
              </div>
            </div>

            <hr class="text-muted opacity-25">

            <div class="d-flex justify-content-between align-items-center mb-4">
              <span class="fw-bold text-dark fs-6">Total Amount</span>
              <span class="fs-3 fw-bold text-teal">${{ booking.total_amount }}</span>
            </div>

            <button
              class="btn btn-teal-brand w-100 py-3 rounded-3 shadow-sm fw-bold"
              :disabled="!selectedPayment || isSubmitting"
              @click="confirmPayment"
            >
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {{ selectedPayment === 'bakong' ? 'Proceed with Bakong KHQR' : (selectedPayment === 'cash' ? 'Confirm Booking' : 'Please Select Payment Method') }}
            </button>

            <div class="security-note text-center mt-3">
              <span class="text-muted small"><i class="bi bi-shield-check text-success me-1"></i> Secure and encrypted payment</span>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- BAKONG QR MODAL -->
    <div class="modal fade" id="bakongQrModal" tabindex="-1" aria-labelledby="bakongQrModalLabel" aria-hidden="true" ref="qrModalRef">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-4">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold text-dark" id="bakongQrModalLabel">Scan with Mobile Banking</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="stopPolling"></button>
          </div>
          <div class="modal-body text-center p-4">
            <div class="badge bg-teal-subtle text-teal mb-3 px-3 py-2 rounded-pill fw-semibold">
              🇰🇭 Bakong KHQR Secure Payment
            </div>
            
            <div v-if="qrLoading" class="py-5">
              <div class="spinner-border text-teal" role="status"></div>
              <p class="text-muted small mt-2">Generating QR Code...</p>
            </div>

            <div v-else-if="qrImage" class="qr-content">
              <div class="qr-image-wrapper p-3 bg-white shadow-sm rounded-4 d-inline-block border">
                <img :src="qrImage" alt="Bakong KHQR" class="img-fluid rounded-2" style="width: 230px; height: 230px;" />
              </div>
              
              <div class="mt-3">
                <span class="text-muted small">Total Amount to Pay:</span>
                <h3 class="text-danger fw-bold mt-1">${{ booking?.total_amount }}</h3>
              </div>

              <div class="alert alert-warning py-2 px-3 mt-3 d-inline-flex align-items-center gap-2 small rounded-pill">
                <span class="spinner-grow spinner-grow-sm text-warning" role="status"></span>
                <span>Waiting for payment scan...</span>
              </div>
              
              <!-- Demo Simulate Success Button -->
              <div class="mt-3">
                <button class="btn btn-outline-success btn-sm rounded-pill px-4 fw-semibold" @click="mockPaymentSuccess" type="button">
                  <i class="bi bi-lightning-charge-fill me-1"></i> [Demo] Simulate Payment Success
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <FooterView />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api/http'
import NavbarView from '@/components/layout/customer/NavbarView.vue'
import FooterView from '@/components/layout/customer/FooterView.vue'
import { useCustomerStore } from '@/stores/customer'
import { Modal } from 'bootstrap'

const route = useRoute()
const router = useRouter()
const customerStore = useCustomerStore()

const isLoading = ref(true)
const isSubmitting = ref(false)
const qrLoading = ref(false)
const booking = ref(null)
const selectedPayment = ref(null) 
const qrImage = ref('')
let pollTimer = null
let modalInstance = null
const qrModalRef = ref(null)

const paymentMethods = ref([
  { id: 'bakong', label: 'Bakong KHQR', desc: 'Scan and pay using any mobile banking app', icon: '🇰🇭' },
  { id: 'cash', label: 'Pay at Hotel', desc: 'Pay directly when you arrive at the property', icon: '🏨' }
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
    alert("Failed to load booking details.")
    router.push('/')
  } finally {
    isLoading.value = false
  }

  if (qrModalRef.value) {
    modalInstance = new Modal(qrModalRef.value)
  }
})

async function selectPaymentMethod(id) {
  selectedPayment.value = id
  if (id === 'bakong') {
    await openQrModal()
  } else {
    stopPolling()
  }
}

async function openQrModal() {
  if (!qrImage.value) {
    await generateBakongQR()
  }
  if (modalInstance) {
    modalInstance.show()
    startPolling()
  }
}

async function generateBakongQR() {
  qrLoading.value = true
  try {
    const bookingId = route.query.bookingId
    // កែប្រែពី api.get មកជា api.post វិញដើម្បីដំណោះស្រាយបញ្ហា Method Not Allowed (405)
    const response = await api.post(`/v1/booking/${bookingId}/generate-qr`)

    if (response.data.success) {
      qrImage.value = response.data.qr_image
    }
  } catch (err) {
    console.error('Error generating QR:', err)
    alert('Failed to generate QR Code from Bakong!')
  } finally {
    qrLoading.value = false
  }
}

function startPolling() {
  stopPolling()
  const bookingId = route.query.bookingId

  pollTimer = setInterval(async () => {
    try {
      const response = await api.get(`/v1/booking/${bookingId}/check-status`)

      if (response.data.status === 'paid') {
        stopPolling()
        if (modalInstance) modalInstance.hide()
        alert('Payment successful!')
        router.push({ path: '/booking-detail', query: { id: bookingId } })
      }
    } catch (err) {
      console.error('Polling error:', err)
    }
  }, 3000)
}

function stopPolling() {
  clearInterval(pollTimer)
  pollTimer = null
}

async function mockPaymentSuccess() {
  try {
    const bookingId = route.query.bookingId
    await api.post(`/v1/booking/${bookingId}/mock-success`)

    stopPolling()
    if (modalInstance) modalInstance.hide()
    alert('Payment successful (Demo)!')
    router.push({ path: '/booking-detail', query: { id: bookingId } })
  } catch (err) {
    console.error('Mock success error:', err)
  }
}

async function confirmPayment() {
  if (!selectedPayment.value || isSubmitting.value) return
  
  if (selectedPayment.value === 'bakong') {
    openQrModal()
  } else if (selectedPayment.value === 'cash') {
    isSubmitting.value = true
    try {
      const bookingId = route.query.bookingId
      await customerStore.createPayment({
        booking_id: bookingId,
        amount: booking.value.total_amount,
        payment_method: 'cash',
        transaction_id: 'TRX-' + Date.now()
      })
      
      alert(`Booking submitted successfully! It is now pending manager confirmation. You can pay at the hotel.`)
      router.push({ path: '/booking-detail', query: { id: bookingId } })
    } catch (err) {
      console.error('Failed to confirm payment:', err)
      alert('Failed to process payment. ' + (err.response?.data?.message || ''))
    } finally {
      isSubmitting.value = false
    }
  }
}

onBeforeUnmount(() => {
  stopPolling()
})
</script>

<style scoped>
.payment-page {
  background-color: #f8fafc;
  min-height: 100vh;
}

:deep(nav),
:deep(.navbar),
:deep(header) {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  z-index: 1050 !important;
  background-color: #ffffff !important;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.payment-header-section {
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
  padding: 7rem 0 2.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.badge-step {
  display: inline-block;
  background-color: #d1fae5;
  color: #047857;
  font-weight: 600;
  font-size: 0.8rem;
  padding: 0.35rem 0.8rem;
  border-radius: 50rem;
  letter-spacing: 0.03em;
}

.page-title {
  font-size: clamp(1.7rem, 2.5vw, 2.2rem);
  color: #0f172a;
  font-weight: 800;
  font-family: 'Inter', sans-serif;
  margin-top: 0.3rem;
}

.page-subtitle {
  color: #64748b;
  font-size: 0.95rem;
}

.custom-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01);
}

.section-heading {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1e293b;
}

.payment-options-grid {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.payment-option-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 2px solid #e2e8f0;
  border-radius: 0.85rem;
  padding: 1rem 1.25rem;
  cursor: pointer;
  transition: all 0.25s ease;
  background-color: #ffffff;
}

.payment-option-card:hover {
  border-color: #34d399;
  background-color: #f8fafc;
}

.payment-option-card.active {
  border-color: #059669;
  background-color: #f0fdf4;
  box-shadow: 0 0 0 4px rgba(5, 150, 105, 0.08);
}

.payment-icon-wrapper {
  width: 45px;
  height: 45px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.65rem;
}

.summary-card {
  position: sticky;
  top: 100px;
}

.text-teal {
  color: #059669 !important;
}

.bg-teal-subtle {
  background-color: #d1fae5 !important;
  color: #047857 !important;
}

.btn-teal-brand {
  background: #059669;
  color: #fff;
  border: none;
  transition: all 0.2s;
}

.btn-teal-brand:hover {
  background: #047857;
  color: #fff;
  transform: translateY(-1px);
}

.btn-teal-brand:disabled {
  background: #cbd5e1;
  color: #94a3b8;
  transform: none;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>