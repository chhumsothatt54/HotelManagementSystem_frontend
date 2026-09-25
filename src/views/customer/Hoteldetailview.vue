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
          <a v-if="hotel.address" :href="hotel.address" target="_blank" rel="noopener noreferrer" class="text-primary text-decoration-none">
            🗺️ View Map
          </a>
          <span>★ {{ hotel.rating }} ({{ hotel.reviewsCount }} reviews)</span>
        </div>
      </div>

      <!-- GALLERY / MAIN IMAGE -->
      <div class="hotel-gallery mb-5">
        <div class="gallery-grid">
          <div class="gallery-main">
            <img :src="hotel.images[0]" :alt="hotel.name" class="gallery-img rounded-4 w-100 h-100 object-fit-cover shadow-sm" />
          </div>
          <div class="gallery-sub">
            <img :src="hotel.images[1]" :alt="hotel.name" class="gallery-img rounded-4 w-100 h-100 object-fit-cover shadow-sm" />
          </div>
          <div class="gallery-sub">
            <img :src="hotel.images[2]" :alt="hotel.name" class="gallery-img rounded-4 w-100 h-100 object-fit-cover shadow-sm" />
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
                class="room-card border-0 rounded-4 overflow-hidden mb-4 shadow-sm position-relative"
                :class="{ 'selected-room-ring': selectedRoom?.id === room.id, 'unavailable-room': room.status === 'maintenance' }"
              >
                <!-- UNAVAILABLE OVERLAY -->
                <div v-if="room.status === 'maintenance'" class="unavailable-overlay">
                  <div class="unavailable-badge">
                    <i class="bi bi-lock-fill me-1"></i> Booked / Unavailable
                  </div>
                </div>

                <div class="row g-0 align-items-stretch">
                  <!-- ROOM IMAGE -->
                  <div class="col-md-4 col-12">
                    <img 
                      :src="room.img || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=600&auto=format&fit=crop'" 
                      :alt="room.name" 
                      class="room-img w-100 h-100 object-fit-cover"
                    />
                  </div>

                  <!-- ROOM DETAILS -->
                  <div class="col-md-8 col-12 p-4 d-flex flex-column justify-content-between bg-white">
                    <div>
                      <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h4 class="fw-bold mb-1 room-title">{{ room.name }}</h4>
                          <div class="text-muted small mb-3 d-flex align-items-center gap-2 flex-wrap">
                            <span><i class="bi bi-moon-stars me-1"></i> {{ room.bed }}</span> &bull; 
                            <span><i class="bi bi-window me-1"></i> {{ room.view }}</span> &bull; 
                            <span><i class="bi bi-arrows-fullscreen me-1"></i> {{ room.size }}</span>
                          </div>
                        </div>
                        <div class="text-end ms-2 price-tag">
                          <span class="fs-3 fw-bold text-dark">${{ room.price }}</span>
                          <span class="text-muted small d-block"> /night</span>
                        </div>
                      </div>
                      <p class="text-secondary small mb-3">Experience comfort and luxury in our elegantly designed {{ room.name.toLowerCase() }}.</p>
                    </div>

                    <div class="d-flex justify-content-between align-items-end mt-2 pt-3 border-top">
                      <div class="d-flex flex-wrap gap-2">
                        <span class="badge bg-light text-secondary border rounded-pill px-3 py-2 fw-normal" v-for="f in room.features.slice(0,4)" :key="f">
                          {{ f }}
                        </span>
                      </div>

                      <button 
                        class="btn px-4 py-2 fw-semibold rounded-pill select-btn shadow-sm"
                        :class="selectedRoom?.id === room.id ? 'btn-emerald' : 'btn-outline-emerald'"
                        :disabled="room.status === 'maintenance'"
                        @click="selectRoom(room)"
                      >
                        {{ room.status === 'maintenance' ? 'Unavailable' : (selectedRoom?.id === room.id ? 'Selected' : 'Select Room') }}
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

    // Get up to 3 images or default fallbacks
    let imageList = [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop'
    ];

    if (h.images && h.images.length > 0) {
      // Sort to put primary image first, if available
      const sortedImages = [...h.images].sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0));
      
      const fetchedImages = sortedImages.slice(0, 3).map(imgObj => {
        let imgPath = imgObj.image || imgObj.image_url;
        if (imgPath && !imgPath.startsWith('http')) {
          return `http://127.0.0.1:8000/storage/${imgPath}`;
        }
        return imgPath;
      });

      // Fill in remaining slots if less than 3 images
      for (let i = 0; i < fetchedImages.length; i++) {
        imageList[i] = fetchedImages[i];
      }
      while (fetchedImages.length > 0 && imageList.length > 3) {
        imageList.pop(); // just in case
      }
      // If they only have 1 or 2 images, the remaining slots will use the fallback images
    }

    hotel.value = {
      id: h.id,
      name: h.name,
      location: `${h.city || ''}, ${h.country || ''}`.replace(/^, |, $/g, ''),
      address: h.address || '',
      rating: h.rating || 4.5,
      reviewsCount: h.reviews_count || 42,
      price: h.price || 50,
      oldPrice: null,
      images: imageList,
      img: imageList[0],
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
          features: rt.features || r.features || ['Free WiFi', 'AC', 'TV'],
          status: r.status || 'available'
        }
      })
    }

    const availableRooms = hotel.value.rooms.filter(r => r.status === 'available');
    if (availableRooms.length > 0) {
      selectedRoom.value = availableRooms[0];
    } else if (hotel.value.rooms.length > 0) {
      selectedRoom.value = hotel.value.rooms[0];
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
  background-color: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
}

/* 🟢 ២. រុញ Content ចុះក្រោមឱ្យផុតពី Navbar */
.content-container {
  padding-top: 100px !important;
}

@media (max-width: 767.98px) {
  .content-container {
    padding-top: 80px !important;
  }
}

/* 🟢 ៣. កំណត់ Sticky Booking Card ឱ្យអណ្តែតក្រោម Navbar យ៉ាងមានរបៀប */
.booking-card-wrapper {
  position: sticky;
  top: 110px;
  z-index: 10;
}

/* Premium Typography */
.hotel-title {
  font-family: 'Fraunces', Georgia, serif;
  color: #063b32;
  font-weight: 800;
  font-size: 2.5rem;
  letter-spacing: -0.02em;
}

.room-title {
  font-family: 'Fraunces', Georgia, serif;
  color: #063b32;
}

/* EMERALD / GREEN THEME COLORS */
.btn-emerald {
  background: linear-gradient(135deg, #087f68 0%, #065b4a 100%);
  color: var(--bg-card, #ffffff);
  border: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-emerald:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(8, 127, 104, 0.3);
  color: var(--bg-card, #ffffff);
}

.btn-outline-emerald {
  background-color: transparent;
  color: #087f68;
  border: 1.5px solid #087f68;
  transition: all 0.2s ease;
}

.btn-outline-emerald:hover {
  background-color: #087f68;
  color: var(--bg-card, #ffffff);
}

.alert-emerald {
  background-color: #e8f6f2;
  color: #063b32;
  border: 1px solid #b8d9ce;
  border-radius: 12px;
}

/* GALLERY GRID */
.gallery-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 250px 250px;
  gap: 15px;
}
.gallery-main {
  grid-row: 1 / span 2;
  overflow: hidden;
  border-radius: 16px;
}
.gallery-sub {
  overflow: hidden;
  border-radius: 16px;
}
.gallery-img {
  transition: transform 0.5s ease;
  cursor: pointer;
}
.gallery-img:hover {
  transform: scale(1.03);
}

@media (max-width: 768px) {
  .gallery-grid {
    grid-template-columns: 1fr;
    grid-template-rows: 300px 150px 150px;
  }
}

/* ROOM CARD STYLES */
.room-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  background: var(--bg-card, #ffffff);
}
.room-card:hover {
  box-shadow: 0 10px 25px rgba(0,0,0,0.08) !important;
  transform: translateY(-3px);
}
.selected-room-ring {
  box-shadow: 0 0 0 3px #087f68, 0 10px 25px rgba(0,0,0,0.08) !important;
}

.room-img {
  min-height: 220px;
}

.select-btn {
  transition: all 0.2s ease;
}

/* UNAVAILABLE ROOM STYLES */
.unavailable-room {
  opacity: 0.8;
}
.unavailable-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(2px);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.unavailable-badge {
  background: rgba(220, 53, 69, 0.9);
  color: var(--bg-card, white);
  padding: 10px 20px;
  border-radius: 30px;
  font-weight: 600;
  font-size: 1.1rem;
  box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
  pointer-events: auto;
}
</style>