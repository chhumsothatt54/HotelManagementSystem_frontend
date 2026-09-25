<template>
  <div class="notification-page">

    <!-- PAGE CONTENT -->
    <main class="notification-content">

      <!-- HEADER -->
      <div class="page-header">
        <div>
          <div class="breadcrumb">
            Manager
            <span>/</span>
            Notifications
          </div>

          <h1 class="page-title">
            Notifications
          </h1>

          <p class="page-subtitle">
            Booking and payment activities from your hotel.
          </p>
        </div>

        <button
          v-if="unreadCount > 0"
          class="mark-all-btn"
          @click="markAllAsRead"
        >
          <i class="bi bi-check2-all"></i>
          Mark all as read
        </button>
      </div>

      <!-- SUMMARY -->
      <div class="notification-summary">

        <div class="summary-card">
          <div class="summary-icon total">
            <i class="bi bi-bell"></i>
          </div>

          <div>
            <span class="summary-label">Total</span>
            <strong>{{ notifications.length }}</strong>
          </div>
        </div>

        <div class="summary-card">
          <div class="summary-icon unread">
            <i class="bi bi-envelope"></i>
          </div>

          <div>
            <span class="summary-label">Unread</span>
            <strong>{{ unreadCount }}</strong>
          </div>
        </div>

        <div class="summary-card">
          <div class="summary-icon booking">
            <i class="bi bi-calendar-check"></i>
          </div>

          <div>
            <span class="summary-label">Bookings</span>
            <strong>{{ bookingNotifications.length }}</strong>
          </div>
        </div>

        <div class="summary-card">
          <div class="summary-icon payment">
            <i class="bi bi-credit-card"></i>
          </div>

          <div>
            <span class="summary-label">Payments</span>
            <strong>{{ paymentNotifications.length }}</strong>
          </div>
        </div>

      </div>

      <!-- TOOLBAR -->
      <div class="notification-toolbar">

        <div class="filter-tabs">

          <button
            :class="{ active: activeFilter === 'all' }"
            @click="activeFilter = 'all'"
          >
            All
            <span>{{ notifications.length }}</span>
          </button>

          <button
            :class="{ active: activeFilter === 'unread' }"
            @click="activeFilter = 'unread'"
          >
            Unread
            <span>{{ unreadCount }}</span>
          </button>

          <button
            :class="{ active: activeFilter === 'booking' }"
            @click="activeFilter = 'booking'"
          >
            Bookings
          </button>

          <button
            :class="{ active: activeFilter === 'payment' }"
            @click="activeFilter = 'payment'"
          >
            Payments
          </button>

        </div>

        <div class="search-box">
          <i class="bi bi-search"></i>

          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search notifications..."
          />
        </div>

      </div>

      <!-- LOADING -->
      <div
        v-if="loading"
        class="notification-card loading-card"
      >
        <div class="loading-spinner"></div>

        <p>Loading notifications...</p>
      </div>

      <!-- ERROR -->
      <div
        v-else-if="error"
        class="notification-card error-card"
      >
        <div class="empty-icon error">
          <i class="bi bi-exclamation-triangle"></i>
        </div>

        <h3>Unable to load notifications</h3>

        <p>{{ error }}</p>

        <button
          class="reset-btn"
          @click="loadNotifications"
        >
          Try again
        </button>
      </div>

      <!-- NOTIFICATIONS -->
      <section
        v-else
        class="notification-card"
      >

        <div class="notification-card-header">

          <div>
            <h2>Recent Activities</h2>

            <p>
              Real booking and payment activities
            </p>
          </div>

          <span class="notification-count">
            {{ filteredNotifications.length }}
          </span>

        </div>

        <div
          v-if="filteredNotifications.length"
          class="notification-list"
        >

          <div
            v-for="notification in filteredNotifications"
            :key="notification.id"
            class="notification-item"
            :class="{ unread: !notification.read }"
            @click="markAsRead(notification)"
          >

            <!-- ICON -->
            <div
              class="notification-icon"
              :class="notification.type"
            >
              <i :class="notification.icon"></i>
            </div>

            <!-- INFORMATION -->
            <div class="notification-info">

              <div class="notification-top">

                <h3>
                  {{ notification.title }}
                </h3>

                <span class="notification-time">
                  {{ formatTime(notification.date) }}
                </span>

              </div>

              <p>
                {{ notification.message }}
              </p>

              <div class="notification-meta">

                <span
                  class="type-label"
                  :class="notification.type"
                >
                  {{ notification.typeLabel }}
                </span>

                <span
                  v-if="notification.bookingNumber"
                  class="booking-number"
                >
                  {{ notification.bookingNumber }}
                </span>

                <span
                  v-if="notification.paymentMethod"
                  class="payment-method"
                >
                  {{ notification.paymentMethod }}
                </span>

                <span
                  v-if="!notification.read"
                  class="unread-label"
                >
                  New
                </span>

              </div>

            </div>

          </div>

        </div>

        <!-- EMPTY -->
        <div
          v-else
          class="empty-notifications"
        >

          <div class="empty-icon">
            <i class="bi bi-bell-slash"></i>
          </div>

          <h3>No notifications found</h3>

          <p>
            There are no booking or payment notifications here.
          </p>

          <button
            v-if="activeFilter !== 'all' || searchQuery"
            class="reset-btn"
            @click="resetFilters"
          >
            Reset filters
          </button>

        </div>

      </section>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useManagerStore } from '@/stores/manager'

const managerStore = useManagerStore()

const loading = ref(false)
const error = ref('')

const activeFilter = ref('all')
const searchQuery = ref('')

const notifications = ref([])

/*
|--------------------------------------------------------------------------
| Local read state
|--------------------------------------------------------------------------
|
| Until you create a real notifications table/backend endpoint,
| read/unread is kept in localStorage.
|
*/

const READ_STORAGE_KEY = 'angkorstay_manager_read_notifications'

const getReadNotifications = () => {
  try {
    return JSON.parse(
      localStorage.getItem(READ_STORAGE_KEY) || '[]'
    )
  } catch {
    return []
  }
}

const saveReadNotifications = (ids) => {
  localStorage.setItem(
    READ_STORAGE_KEY,
    JSON.stringify(ids)
  )
}

/*
|--------------------------------------------------------------------------
| Load real booking/payment data
|--------------------------------------------------------------------------
*/

const loadNotifications = async () => {
  loading.value = true;
  error.value = "";

  try {
    await managerStore.getBookings(1);

    const bookings = managerStore.bookings || [];

    console.log("BOOKINGS FOR NOTIFICATIONS:", bookings);

    notifications.value = buildNotifications(bookings);
  } catch (err) {
    console.error("Failed to load notifications:", err);

    error.value =
      err?.response?.data?.message ||
      "Failed to load booking and payment notifications.";
  } finally {
    loading.value = false;
  }
};

/*
|--------------------------------------------------------------------------
| Convert bookings + payments into notifications
|--------------------------------------------------------------------------
*/

const buildNotifications = (bookings) => {

  const result = []

  const readIds = getReadNotifications()

  bookings.forEach((booking) => {

    /*
    |--------------------------------------------------------------------------
    | BOOKING NOTIFICATION
    |--------------------------------------------------------------------------
    */

    result.push({
      id: `booking-${booking.id}`,
      type: 'booking',
      typeLabel: 'Booking',

      title: getBookingTitle(booking),

      message: getBookingMessage(booking),

      bookingNumber:
        booking.booking_number ||
        `#${booking.id}`,

      paymentMethod: null,

      date:
        booking.created_at ||
        booking.updated_at,

      read: readIds.includes(`booking-${booking.id}`),

      icon: getBookingIcon(booking)
    })

    /*
    |--------------------------------------------------------------------------
    | PAYMENT NOTIFICATIONS
    |--------------------------------------------------------------------------
    */

    const payments = Array.isArray(booking.payments)
      ? booking.payments
      : []

    payments.forEach((payment) => {

      result.push({
        id: `payment-${payment.id}`,

        type: 'payment',

        typeLabel: 'Payment',

        title: getPaymentTitle(payment),

        message: getPaymentMessage(
          payment,
          booking
        ),

        bookingNumber:
          booking.booking_number ||
          `#${booking.id}`,

        paymentMethod:
          formatPaymentMethod(
            payment.payment_method
          ),

        date:
          payment.created_at ||
          payment.paid_at ||
          booking.updated_at,

        read: readIds.includes(
          `payment-${payment.id}`
        ),

        icon: getPaymentIcon(payment)
      })

    })

  })

  /*
  |--------------------------------------------------------------------------
  | Latest first
  |--------------------------------------------------------------------------
  */

  return result.sort((a, b) => {
    return new Date(b.date || 0) -
           new Date(a.date || 0)
  })
}

/*
|--------------------------------------------------------------------------
| Booking text
|--------------------------------------------------------------------------
*/

const getBookingTitle = (booking) => {

  const status =
    String(booking.status || '')
      .toLowerCase()

  switch (status) {

    case 'pending':
      return 'New Booking Received'

    case 'approved':
    case 'confirmed':
      return 'Booking Approved'

    case 'rejected':
      return 'Booking Rejected'

    case 'cancelled':
      return 'Booking Cancelled'

    case 'completed':
      return 'Booking Completed'

    default:
      return 'Booking Updated'
  }
}

const getBookingMessage = (booking) => {

  const bookingNumber =
    booking.booking_number ||
    `#${booking.id}`

  const guest =
    booking.guest_name ||
    booking.customer?.name ||
    'Guest'

  const status =
    String(booking.status || 'updated')
      .toLowerCase()

  if (status === 'pending') {
    return `${guest} created booking ${bookingNumber}.`
  }

  if (
    status === 'approved' ||
    status === 'confirmed'
  ) {
    return `Booking ${bookingNumber} for ${guest} has been approved.`
  }

  if (status === 'cancelled') {
    return `Booking ${bookingNumber} for ${guest} has been cancelled.`
  }

  if (status === 'rejected') {
    return `Booking ${bookingNumber} for ${guest} has been rejected.`
  }

  if (status === 'completed') {
    return `Booking ${bookingNumber} for ${guest} has been completed.`
  }

  return `Booking ${bookingNumber} for ${guest} was updated.`
}

const getBookingIcon = (booking) => {

  const status =
    String(booking.status || '')
      .toLowerCase()

  if (status === 'cancelled') {
    return 'bi bi-calendar-x'
  }

  if (status === 'rejected') {
    return 'bi bi-calendar-x'
  }

  if (
    status === 'approved' ||
    status === 'confirmed'
  ) {
    return 'bi bi-calendar-check'
  }

  if (status === 'completed') {
    return 'bi bi-check-circle'
  }

  return 'bi bi-calendar-plus'
}

/*
|--------------------------------------------------------------------------
| Payment text
|--------------------------------------------------------------------------
*/

const getPaymentTitle = (payment) => {

  const status =
    String(payment.status || '')
      .toLowerCase()

  if (status === 'paid') {
    return 'Payment Received'
  }

  if (status === 'pending') {
    return 'Payment Pending'
  }

  if (status === 'failed') {
    return 'Payment Failed'
  }

  if (status === 'cancelled') {
    return 'Payment Cancelled'
  }

  return 'Payment Updated'
}

const getPaymentMessage = (
  payment,
  booking
) => {

  const amount =
    Number(payment.amount || 0)
      .toFixed(2)

  const bookingNumber =
    booking.booking_number ||
    `#${booking.id}`

  const status =
    String(payment.status || '')
      .toLowerCase()

  if (status === 'paid') {
    return `$${amount} payment received for booking ${bookingNumber}.`
  }

  if (status === 'pending') {
    return `$${amount} payment is pending for booking ${bookingNumber}.`
  }

  if (status === 'failed') {
    return `Payment of $${amount} failed for booking ${bookingNumber}.`
  }

  return `Payment of $${amount} was updated for booking ${bookingNumber}.`
}

const getPaymentIcon = (payment) => {

  const status =
    String(payment.status || '')
      .toLowerCase()

  if (status === 'paid') {
    return 'bi bi-credit-card'
  }

  if (status === 'pending') {
    return 'bi bi-clock-history'
  }

  if (status === 'failed') {
    return 'bi bi-x-circle'
  }

  return 'bi bi-credit-card'
}

/*
|--------------------------------------------------------------------------
| Payment method
|--------------------------------------------------------------------------
*/

const formatPaymentMethod = (method) => {

  if (!method) {
    return ''
  }

  const value =
    String(method)
      .toLowerCase()

  if (value === 'cash') {
    return 'Cash'
  }

  if (value === 'bakong') {
    return 'Bakong QR'
  }

  if (value === 'bakong_qr') {
    return 'Bakong QR'
  }

  return String(method)
    .replaceAll('_', ' ')
    .replace(/\b\w/g, char =>
      char.toUpperCase()
    )
}

/*
|--------------------------------------------------------------------------
| Computed
|--------------------------------------------------------------------------
*/

const bookingNotifications = computed(() => {
  return notifications.value.filter(
    item => item.type === 'booking'
  )
})

const paymentNotifications = computed(() => {
  return notifications.value.filter(
    item => item.type === 'payment'
  )
})

const unreadCount = computed(() => {
  return notifications.value.filter(
    item => !item.read
  ).length
})

const filteredNotifications = computed(() => {

  let result = notifications.value

  if (activeFilter.value === 'unread') {
    result = result.filter(
      item => !item.read
    )
  }

  if (
    activeFilter.value === 'booking' ||
    activeFilter.value === 'payment'
  ) {
    result = result.filter(
      item =>
        item.type === activeFilter.value
    )
  }

  const query =
    searchQuery.value
      .trim()
      .toLowerCase()

  if (query) {

    result = result.filter(item => {

      return (
        item.title
          .toLowerCase()
          .includes(query) ||

        item.message
          .toLowerCase()
          .includes(query) ||

        item.bookingNumber
          ?.toLowerCase()
          .includes(query) ||

        item.paymentMethod
          ?.toLowerCase()
          .includes(query)
      )
    })
  }

  return result
})

/*
|--------------------------------------------------------------------------
| Read / unread
|--------------------------------------------------------------------------
*/

const markAsRead = (notification) => {

  if (notification.read) {
    return
  }

  notification.read = true

  const readIds =
    getReadNotifications()

  if (!readIds.includes(notification.id)) {
    readIds.push(notification.id)
  }

  saveReadNotifications(readIds)
}

const markAllAsRead = () => {

  const readIds =
    getReadNotifications()

  notifications.value.forEach(
    notification => {

      notification.read = true

      if (
        !readIds.includes(
          notification.id
        )
      ) {
        readIds.push(
          notification.id
        )
      }
    }
  )

  saveReadNotifications(readIds)
}

/*
|--------------------------------------------------------------------------
| Filters
|--------------------------------------------------------------------------
*/

const resetFilters = () => {
  activeFilter.value = 'all'
  searchQuery.value = ''
}

/*
|--------------------------------------------------------------------------
| Date formatting
|--------------------------------------------------------------------------
*/

const formatTime = (date) => {

  if (!date) {
    return ''
  }

  const notificationDate =
    new Date(date)

  const now = new Date()

  const seconds =
    Math.floor(
      (now - notificationDate) / 1000
    )

  if (seconds < 60) {
    return 'Just now'
  }

  const minutes =
    Math.floor(seconds / 60)

  if (minutes < 60) {
    return `${minutes} min ago`
  }

  const hours =
    Math.floor(minutes / 60)

  if (hours < 24) {
    return `${hours} hr ago`
  }

  const days =
    Math.floor(hours / 24)

  if (days < 7) {
    return `${days} day${days > 1 ? 's' : ''} ago`
  }

  return notificationDate.toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }
  )
}

onMounted(() => {
  loadNotifications()
})
</script>

<style scoped>
.notification-page {
  min-height: 100vh;
  background: #f5f7f8;
  color: #102033;
}

/* =========================
   CONTENT
========================= */

.notification-content {
  padding: 32px 36px 50px;
  max-width: 1500px;
  margin: 0 auto;
}

/* =========================
   HEADER
========================= */

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 25px;
  margin-bottom: 28px;
}

.breadcrumb {
  display: flex;
  gap: 10px;
  align-items: center;
  color: #8b98a7;
  font-size: 13px;
  margin-bottom: 8px;
}

.breadcrumb span {
  color: #c5ccd3;
}

.page-title {
  margin: 0;
  color: #102033;
  font-size: 32px;
  font-weight: 750;
  letter-spacing: -0.6px;
}

.page-subtitle {
  margin: 7px 0 0;
  color: #748091;
  font-size: 14px;
}

.mark-all-btn {
  border: 1px solid #d9e3df;
  background: var(--bg-card, white);
  color: #087f68;
  padding: 11px 17px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 650;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: 0.2s ease;
}

.mark-all-btn:hover {
  background: #087f68;
  color: var(--bg-card, white);
  border-color: #087f68;
}

/* =========================
   SUMMARY
========================= */

.notification-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-bottom: 24px;
}

.summary-card {
  background: var(--bg-card, white);
  border: 1px solid #e7ecea;
  border-radius: 14px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 3px 15px rgba(16, 32, 51, 0.035);
}

.summary-icon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.summary-icon.total {
  background: #e8f5f1;
  color: #087f68;
}

.summary-icon.unread {
  background: #eef3fa;
  color: #345a82;
}

.summary-icon.booking {
  background: #edf8f4;
  color: #087f68;
}

.summary-icon.payment {
  background: #f8f3e9;
  color: #9a742f;
}

.summary-label {
  display: block;
  color: #8a95a2;
  font-size: 12px;
  margin-bottom: 3px;
}

.summary-card strong {
  color: #102033;
  font-size: 22px;
}

/* =========================
   TOOLBAR
========================= */

.notification-toolbar {
  background: var(--bg-card, white);
  border: 1px solid #e7ecea;
  border-radius: 14px;
  padding: 14px 16px;
  margin-bottom: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.filter-tabs {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}

.filter-tabs button {
  border: none;
  background: transparent;
  color: #778392;
  padding: 9px 13px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.filter-tabs button:hover {
  background: #f1f7f5;
  color: #087f68;
}

.filter-tabs button.active {
  background: #e7f4f0;
  color: #087f68;
}

.filter-tabs button span {
  margin-left: 5px;
  font-size: 11px;
  opacity: 0.75;
}

.search-box {
  width: 260px;
  height: 40px;
  border: 1px solid #e0e6e4;
  border-radius: 9px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 9px;
  background: #fafcfc;
}

.search-box i {
  color: #98a3ad;
  font-size: 14px;
}

.search-box input {
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  color: #102033;
  font-size: 13px;
}

.search-box input::placeholder {
  color: #a4adb6;
}

/* =========================
   NOTIFICATION CARD
========================= */

.notification-card {
  background: var(--bg-card, white);
  border: 1px solid #e7ecea;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 3px 18px rgba(16, 32, 51, 0.035);
}

.notification-card-header {
  padding: 22px 24px;
  border-bottom: 1px solid #edf0ef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-card-header h2 {
  margin: 0;
  color: #102033;
  font-size: 17px;
  font-weight: 700;
}

.notification-card-header p {
  margin: 5px 0 0;
  color: #89939f;
  font-size: 12px;
}

.notification-count {
  min-width: 30px;
  height: 30px;
  padding: 0 8px;
  border-radius: 15px;
  background: #e8f5f1;
  color: #087f68;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}

/* =========================
   NOTIFICATION ITEM
========================= */

.notification-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid #eef1f0;
  cursor: pointer;
  transition: 0.2s ease;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item:hover {
  background: #fafcfb;
}

.notification-item.unread {
  background: #f5fbf9;
}

.notification-item.unread:hover {
  background: #f0f9f6;
}

.notification-icon {
  flex-shrink: 0;
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
}

.notification-icon.booking {
  background: #e6f5f0;
  color: #087f68;
}

.notification-icon.payment {
  background: #f8f1df;
  color: #98752e;
}

.notification-icon.system {
  background: #edf1f6;
  color: #4d6075;
}

.notification-info {
  min-width: 0;
  flex: 1;
  padding-right: 25px;
}

.notification-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;
}

.notification-top h3 {
  margin: 0;
  color: #182a3c;
  font-size: 14px;
  font-weight: 700;
}

.notification-item.unread .notification-top h3 {
  color: #087f68;
}

.notification-time {
  flex-shrink: 0;
  color: #9aa4ae;
  font-size: 11px;
}

.notification-info p {
  margin: 6px 0 10px;
  color: #6e7b88;
  font-size: 13px;
  line-height: 1.55;
}

.notification-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.type-label {
  padding: 4px 8px;
  border-radius: 5px;
  font-size: 10px;
  font-weight: 700;
}

.type-label.booking {
  background: #e8f5f1;
  color: #087f68;
}

.type-label.payment {
  background: #f8f1df;
  color: #98752e;
}

.type-label.system {
  background: #edf1f6;
  color: #4d6075;
}

.unread-label {
  color: #087f68;
  font-size: 10px;
  font-weight: 700;
}

.notification-more {
  position: absolute;
  top: 18px;
  right: 18px;
  border: none;
  background: transparent;
  color: #a3adb5;
  width: 28px;
  height: 28px;
  border-radius: 7px;
  cursor: pointer;
  opacity: 0;
  transition: 0.2s ease;
}

.notification-item:hover .notification-more {
  opacity: 1;
}

.notification-more:hover {
  background: #f0f2f2;
  color: #d34d4d;
}

/* =========================
   EMPTY
========================= */

.empty-notifications {
  padding: 75px 20px;
  text-align: center;
}

.empty-icon {
  width: 70px;
  height: 70px;
  margin: 0 auto 18px;
  border-radius: 50%;
  background: #edf5f3;
  color: #087f68;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 27px;
}

.empty-notifications h3 {
  margin: 0 0 7px;
  color: #253548;
  font-size: 17px;
}

.empty-notifications p {
  margin: 0;
  color: #8c98a4;
  font-size: 13px;
}

.reset-btn {
  margin-top: 20px;
  border: none;
  background: #087f68;
  color: var(--bg-card, white);
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.reset-btn:hover {
  background: #066c59;
}

/* =========================
   RESPONSIVE
========================= */

@media (max-width: 1100px) {
  .notification-summary {
    grid-template-columns: repeat(2, 1fr);
  }

  .notification-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .search-box {
    width: 100%;
  }
}

@media (max-width: 700px) {
  .notification-content {
    padding: 22px 16px 40px;
  }

  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .notification-summary {
    grid-template-columns: 1fr;
  }

  .filter-tabs {
    width: 100%;
    overflow-x: auto;
    flex-wrap: nowrap;
  }

  .filter-tabs button {
    white-space: nowrap;
  }

  .notification-item {
    padding: 17px 16px;
  }

  .notification-icon {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }

  .notification-top {
    display: block;
  }

  .notification-time {
    display: block;
    margin-top: 5px;
  }

  .notification-card-header {
    padding: 18px;
  }
}
</style>