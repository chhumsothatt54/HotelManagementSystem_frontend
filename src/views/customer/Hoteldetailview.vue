<template>
  <div class="hotel-detail-page">
    <!-- NAVBAR -->
    <NavbarView />

    <!-- CONTENT CONTAINER -->
    <div class="container py-5 text-center mt-5" v-if="isLoading">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="text-muted mt-2">Loading hotel details...</p>
    </div>

    <div class="container py-4 content-container mb-5" v-else-if="hotel">
      <!-- BREADCRUMB / BACK LINK -->
      <div class="mb-3">
        <router-link to="/" class="text-decoration-none text-muted small">
          ← Back to all stays
        </router-link>
      </div>

      <!-- HOTEL HEADER -->
      <div class="mb-4">
        <h1 class="hotel-title">{{ hotel.name }}</h1>
        <div class="d-flex align-items-center gap-3 text-muted small">
          <span>📍 {{ hotel.location }}</span>
          <span>★ {{ hotel.rating }} ({{ hotel.reviewsCount }} reviews)</span>
        </div>
      </div>

      <!-- GALLERY / MAIN IMAGE -->
      <div class="hotel-gallery mb-5">
        <div class="row g-3">
          <div class="col-md-8" style="overflow: hidden; max-height: 500px;">
            <img :src="hotel.img" :alt="hotel.name" class="main-img rounded-3 w-100 h-100 object-fit-cover" />
          </div>
          <div class="col-md-4 d-none d-md-flex flex-column gap-3" style="overflow: hidden; max-height: 500px;">
            <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop" class="sub-img rounded-3 w-100 h-50 object-fit-cover" />
            <img src="https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop" class="sub-img rounded-3 w-100 h-50 object-fit-cover" />
          </div>
        </div>
      </div>

      <!-- CONTENT GRID -->
      <div class="row g-4">
        <!-- LEFT COLUMN: DESCRIPTION & ROOMS -->
        <div class="col-lg-8">
          <!-- ABOUT -->
          <div class="mb-5">
            <h3 class="fw-bold mb-3">About this hotel</h3>
            <p class="text-secondary leading-relaxed">
              {{ hotel.description }}
            </p>
          </div>

          <!-- AMENITIES -->
          <div class="mb-5">
            <h4 class="fw-bold mb-3">Popular Amenities</h4>
            <div class="d-flex flex-wrap gap-2">
              <span class="badge bg-light text-dark border px-3 py-2 fw-normal" v-for="a in hotel.amenities" :key="a">
                {{ a }}
              </span>
            </div>
          </div>

          <hr class="my-4" />

          <!-- CHOOSE A ROOM -->
          <div>
            <h3 class="fw-bold my-4">Choose a room</h3>
            
            <div class="d-flex flex-column gap-3">
              <div 
                v-for="room in hotel.rooms" 
                :key="room.id"
                class="room-card border rounded-3 overflow-hidden transition-all"
                :class="{ 'border-emerald bg-light-emerald': selectedRoom?.id === room.id }"
              >
                <div class="row g-0 align-items-stretch">
                  <!-- ROOM IMAGE -->
                  <div class="col-md-4 col-12">
                    <img 
                      :src="room.img || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=600&auto=format&fit=crop'" 
                      :alt="room.name" style="max-height: 100px;"
                      class="room-img w-100 h-100 object-fit-cover"
                    />
                  </div>

                  <!-- ROOM DETAILS -->
                  <div class="col-md-8 col-12 p-3 d-flex flex-column justify-content-between">
                    <div>
                      <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h5 class="fw-bold mb-1">{{ room.name }}</h5>
                          <div class="text-muted small mb-2">
                            {{ room.bed }} · {{ room.view }} · {{ room.size }}
                          </div>
                        </div>
                        <div class="text-end ms-2">
                          <span class="fs-4 fw-bold text-dark">${{ room.price }}</span>
                          <span class="text-muted small"> /night</span>
                        </div>
                      </div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                      <div class="d-flex flex-wrap gap-1">
                        <span class="badge bg-light text-secondary border" v-for="f in room.features" :key="f">
                          {{ f }}
                        </span>
                      </div>

                      <button 
                        class="btn btn-sm px-3 fw-semibold"
                        :class="selectedRoom?.id === room.id ? 'btn-emerald' : 'btn-outline-emerald'"
                        @click="selectRoom(room)"
                      >
                        {{ selectedRoom?.id === room.id ? 'Selected' : 'Book This Room' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: BOOKING CARD -->
        <div class="col-lg-4">
          <div class="booking-card-wrapper">
            <div class="card border rounded-4 p-4 shadow-sm">
              <div class="d-flex align-items-baseline gap-2 mb-2">
                <span v-if="hotel.oldPrice" class="text-muted text-decoration-line-through fs-5">
                  ${{ hotel.oldPrice }}
                </span>
                <span class="display-6 fw-bold text-dark">
                  ${{ selectedRoom ? selectedRoom.price : hotel.price }}
                </span>
                <span class="text-muted">/night</span>
              </div>

              <div class="text-muted small mb-3">
                ★ {{ hotel.rating }} · {{ hotel.reviewsCount }} reviews
              </div>

              <div v-if="selectedRoom" class="alert alert-emerald py-2 px-3 mb-3 small fw-semibold">
                Selected: {{ selectedRoom.name }}
              </div>

              <button 
                class="btn btn-emerald w-100 py-2 fw-semibold"
                @click="goToBooking"
              >
                Proceed to Booking
              </button>

              <p class="text-center text-muted small mt-3 mb-0">
                You won't be charged yet. You'll choose your dates and payment method next.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <FooterView />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavbarView from '@/components/layout/customer/NavbarView.vue'
import FooterView from '@/components/layout/customer/FooterView.vue'

const route = useRoute()
const router = useRouter()


const hotel = ref(null)
const selectedRoom = ref(null)
const isLoading = ref(true)

import { useCustomerStore } from '@/stores/customer'
const customerStore = useCustomerStore()

async function loadHotelData(id) {
  window.scrollTo({ top: 0, behavior: 'instant' })
  isLoading.value = true;
  
  try {
    const hotelId = Number(id)
    
    // Fetch hotel and rooms in parallel
    const [hotelData, roomsData] = await Promise.all([
      customerStore.getHotelDetail(hotelId),
      customerStore.getHotelRooms(hotelId).catch(() => ({ data: [] }))
    ])
    
    const h = hotelData.data || hotelData;
    const roomsList = roomsData.data || roomsData;

    // Get the first image or a default fallback
    let image = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop';
    if (h.images && h.images.length > 0) {
      const primaryImage = h.images.find(img => img.is_primary);
      const imgObj = primaryImage || h.images[0];
      const imgPath = imgObj.image || imgObj.image_url;

      if (imgPath && !imgPath.startsWith('http')) {
        image = `http://127.0.0.1:8000/storage/${imgPath}`;
      } else if (imgPath) {
        image = imgPath;
      }
    }

    hotel.value = {
      id: h.id,
      name: h.name,
      location: `${h.city || ''}, ${h.country || ''}`.replace(/^, |, $/g, ''),
      rating: h.rating || 4.5,
      reviewsCount: h.reviews_count || 42,
      price: h.price || 50,
      oldPrice: null,
      img: image,
      description: h.description || 'Welcome to our beautiful property. Experience refined elegance and top-tier services.',
      amenities: h.amenities || ['Free WiFi', 'Pool', 'Breakfast Included', 'River View', 'Spa'],
      rooms: []
    }

    // Map rooms
    if (Array.isArray(roomsList) && roomsList.length > 0) {
      hotel.value.rooms = roomsList.map(r => {
        let rImage = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=600&auto=format&fit=crop';
        
        // Sometimes room images might be in r.room_type.images or r.images
        const roomImages = r.images || (r.room_type && r.room_type.images) || [];
        if (roomImages.length > 0) {
          const rImgObj = roomImages[0];
          const rImgPath = rImgObj.image || rImgObj.image_url;
          if (rImgPath && !rImgPath.startsWith('http')) {
            rImage = `http://127.0.0.1:8000/storage/${rImgPath}`;
          } else if (rImgPath) {
            rImage = rImgPath;
          }
        }

        const rt = r.room_type || {};
        return {
          id: r.id,
          name: rt.name || r.name || 'Standard Room',
          bed: rt.bed_type || r.bed_type || '1 Double Bed',
          view: rt.view || r.view || 'City View',
          size: rt.size ? `${rt.size} m²` : (r.size ? `${r.size} m²` : '28 m²'),
          price: rt.price_per_night || r.price_per_night || r.price || 50,
          img: rImage,
          features: rt.features || r.features || ['Free WiFi', 'AC', 'TV']
        }
      })
    }

    if (hotel.value.rooms.length > 0) {
      selectedRoom.value = hotel.value.rooms[0]
    }
  } catch (err) {
    console.error('Failed to load hotel detail:', err);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  loadHotelData(route.params.id)
  console.log(hotel.value);
  
  
})

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadHotelData(newId)
    }
  }
)

function selectRoom(room) {
  selectedRoom.value = room
}

function goToBooking() {
  if (!selectedRoom.value) {
    alert('សូមជ្រើសរើសបន្ទប់ជាមុនសិន!')
    return
  }
  window.scrollTo(0, 0)
  router.push({
    path: '/booking',
    query: {
      hotelId: hotel.value.id,
      roomId: selectedRoom.value.id
    }
  })
}
</script>

<style scoped>
/* 🟢 ១. រុញ NavbarView ឱ្យនៅស្រទាប់លើគេបង្អស់ពីក្នុងទំព័រនេះ */
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

/* 🟢 ២. រុញ Content ចុះក្រោមឱ្យផុតពី Navbar */
.content-container {
  padding-top: 100px !important;
}

/* សម្រាប់អេក្រង់ទូរស័ព្ទ (Mobile View) */
@media (max-width: 767.98px) {
  .content-container {
    padding-top: 100px !important;
  }
}

/* 🟢 ៣. កំណត់ Sticky Booking Card ឱ្យអណ្តែតក្រោម Navbar យ៉ាងមានរបៀប */
.booking-card-wrapper {
  position: sticky;
  top: 95px;
  z-index: 10;
}

/* EMERALD / GREEN THEME COLORS */
.btn-emerald {
  background-color: #087f68;
  color: #ffffff;
  border: 1px solid #087f68;
}

.btn-emerald:hover {
  background-color: #063b32;
  color: #ffffff;
}

.btn-outline-emerald {
  background-color: transparent;
  color: #087f68;
  border: 1px solid #087f68;
}

.btn-outline-emerald:hover {
  background-color: #087f68;
  color: #ffffff;
}

.border-emerald {
  border-color: #087f68 !important;
}

.bg-light-emerald {
  background-color: #e8f6f2 !important;
}

.alert-emerald {
  background-color: #e8f6f2;
  color: #063b32;
  border: 1px solid #b8d9ce;
}

.main-img {
  height: 380px;
}

.sub-img {
  height: 182px;
}

/* ROOM CARD & IMAGE STYLES */
.room-card {
  transition: all 0.2s ease-in-out;
}

.room-img {
  min-height: 150px;
  height: 100%;
}

@media (max-width: 767.98px) {
  .content-container {
    padding-top: 75px;
  }
  
  .room-img {
    height: 180px;
  }
}

.hotel-title {
  font-family: 'Fraunces', serif;
  color: #063b32;
  font-weight: 700;
}
</style>