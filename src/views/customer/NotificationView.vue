<template>
  <div class="notification-page bg-light min-vh-100">
    <NavbarView />

    <main class="container py-5">
      <!-- HEADER -->
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 class="section-title fw-bold text-dark mb-1">Notifications</h2>
          <p class="section-sub text-muted small mb-0">Stay updated on your booking status</p>
        </div>

        <button 
          v-if="unreadCount > 0" 
          @click="markAllAsRead" 
          class="btn btn-outline-brand btn-sm px-3 rounded-pill"
          :disabled="customerStore.loading"
        >
          <i class="bi bi-check2-all me-1"></i> Mark all as read
        </button>
      </div>

      <!-- CONTENT -->
      <div class="row">
        <div class="col-12 col-lg-8 mx-auto">
          <!-- LOADING STATE -->
          <div v-if="customerStore.loading && !customerStore.notifications?.length" class="text-center py-5">
            <div class="spinner-border text-brand" role="status"></div>
            <p class="text-muted mt-3">Loading your notifications...</p>
          </div>

          <!-- EMPTY STATE -->
          <div v-else-if="!customerStore.notifications?.length" class="card border-0 shadow-sm rounded-4 text-center py-5">
            <div class="card-body py-5">
              <div class="empty-icon-wrapper mb-3 mx-auto">
                <i class="bi bi-bell-slash text-muted" style="font-size: 2.5rem;"></i>
              </div>
              <h5 class="fw-bold text-dark">No notifications yet</h5>
              <p class="text-muted small">When there are updates on your bookings, they will appear here.</p>
            </div>
          </div>

          <!-- NOTIFICATION LIST -->
          <div v-else class="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div class="list-group list-group-flush">
              <div 
                v-for="notification in customerStore.notifications" 
                :key="notification.id"
                class="list-group-item notification-item p-4 border-bottom"
                :class="{ 'unread': !notification.is_read }"
                @click="markAsRead(notification)"
              >
                <div class="d-flex gap-3">
                  <!-- ICON -->
                  <div class="notification-icon rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center" :class="getIconClass(notification)">
                    <i class="bi" :class="getIcon(notification)"></i>
                  </div>
                  
                  <!-- CONTENT -->
                  <div class="flex-grow-1">
                    <div class="d-flex justify-content-between align-items-start mb-1">
                      <h6 class="mb-0 fw-bold" :class="{'text-dark': !notification.is_read, 'text-secondary': notification.is_read}">
                        {{ notification.data?.title || getTitle(notification) }}
                      </h6>
                      <small class="text-muted ms-2 date-text">{{ formatDate(notification.created_at) }}</small>
                    </div>
                    <p class="mb-0 text-muted small notification-text">
                      {{ notification.data?.message || getMessage(notification) }}
                    </p>
                  </div>
                  
                  <!-- UNREAD DOT -->
                  <div v-if="!notification.is_read" class="unread-dot flex-shrink-0 mt-2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <FooterView />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavbarView from '@/components/layout/customer/NavbarView.vue'
import FooterView from '@/components/layout/customer/FooterView.vue'
import { useCustomerStore } from '@/stores/customer'

const router = useRouter()
const customerStore = useCustomerStore()

onMounted(async () => {
  await fetchNotifications()
})

const fetchNotifications = async () => {
  try {
    await customerStore.getNotifications()
  } catch (error) {
    console.error('Error fetching notifications:', error)
  }
}

const unreadCount = computed(() => {
  return customerStore.notifications?.filter(n => !n.is_read).length || 0
})

const markAllAsRead = async () => {
  try {
    await customerStore.readAllNotifications()
    await fetchNotifications()
  } catch (error) {
    console.error('Error marking all as read:', error)
  }
}

const markAsRead = async (notification) => {
  if (notification.is_read) return
  
  try {
    await customerStore.readNotification(notification.id)
    notification.is_read = true
    
    // Optional: Route to booking details if notification is about a booking
    if (notification.data?.booking_id) {
      router.push(`/customer/booking-detail`) // Assuming this route exists and handles showing bookings
    }
  } catch (error) {
    console.error('Error marking as read:', error)
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.abs(now - date) / 36e5
  
  if (diffInHours < 24) {
    // Show time if today
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }
  // Show date if older
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Fallback logic in case data object doesn't have title/message
const getTitle = (notification) => {
  const type = notification.type?.toLowerCase() || ''
  if (type.includes('confirm')) return 'Booking Confirmed'
  if (type.includes('check_in') || type.includes('checkin')) return 'Checked In'
  if (type.includes('cancel')) return 'Booking Cancelled'
  return 'System Notification'
}

const getMessage = (notification) => {
  return 'You have a new update regarding your booking status.'
}

const getIcon = (notification) => {
  const type = (notification.type || '').toLowerCase()
  const title = (notification.data?.title || '').toLowerCase()
  
  if (type.includes('confirm') || title.includes('confirm')) return 'bi-check-circle-fill'
  if (type.includes('check') || title.includes('check')) return 'bi-door-open-fill'
  if (type.includes('cancel') || title.includes('cancel')) return 'bi-x-circle-fill'
  if (type.includes('payment') || title.includes('payment')) return 'bi-credit-card-fill'
  
  return 'bi-bell-fill'
}

const getIconClass = (notification) => {
  const type = (notification.type || '').toLowerCase()
  const title = (notification.data?.title || '').toLowerCase()
  
  if (type.includes('confirm') || title.includes('confirm')) return 'bg-success-subtle text-success'
  if (type.includes('check') || title.includes('check')) return 'bg-primary-subtle text-primary'
  if (type.includes('cancel') || title.includes('cancel')) return 'bg-danger-subtle text-danger'
  if (type.includes('payment') || title.includes('payment')) return 'bg-warning-subtle text-warning-emphasis'
  
  return 'bg-secondary-subtle text-secondary'
}
</script>

<style scoped>
.text-brand {
  color: #087F68;
}

.btn-outline-brand {
  color: #087F68;
  border-color: #087F68;
  font-weight: 500;
}

.btn-outline-brand:hover {
  background-color: #087F68;
  color: #fff;
}

.empty-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-item {
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border-left: 4px solid transparent;
}

.notification-item:hover {
  background-color: #f8f9fa;
}

.notification-item.unread {
  background-color: #f0fdfa;
  border-left-color: #087F68;
}

.notification-icon {
  width: 48px;
  height: 48px;
  font-size: 1.25rem;
}

.date-text {
  font-size: 0.75rem;
  white-space: nowrap;
}

.notification-text {
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.unread-dot {
  width: 10px;
  height: 10px;
  background-color: #087F68;
  border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(8, 127, 104, 0.2);
}
</style>
