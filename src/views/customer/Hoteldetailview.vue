<template>
  <div class="hotel-detail-page">
    <!-- NAVBAR -->
    <NavbarView />

    <!-- CONTENT CONTAINER -->
    <div class="container py-4 content-container" v-if="hotel">
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
          <div class="col-md-8">
            <img :src="hotel.img" :alt="hotel.name" class="main-img rounded-3 w-100 h-100 object-fit-cover" />
          </div>
          <div class="col-md-4 d-none d-md-flex flex-column gap-3">
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
            <h3 class="fw-bold mb-4">Choose a room</h3>
            
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
                      :alt="room.name" 
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

const mockHotels = [
  {
    id: 1,
    name: 'Riverside Heritage Hotel',
    location: 'Phnom Penh, Cambodia',
    rating: 4.7,
    reviewsCount: 42,
    price: 41,
    oldPrice: 45,
    img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop',
    description: 'Experience refined elegance overlooking the Mekong River. Featuring classic French-colonial design, lush gardens, rooftop lounges, and spacious modern rooms.',
    amenities: ['Free WiFi', 'Pool', 'Breakfast Included', 'River View', 'Spa'],
    rooms: [
      { id: 101, name: 'Standard Heritage Room', bed: '1 Double Bed', view: 'City View', size: '28 m²', price: 41, img: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=600&auto=format&fit=crop', features: ['Free WiFi', 'AC', 'TV'] },
      { id: 102, name: 'Riverfront Deluxe Suite', bed: '1 King Bed', view: 'Mekong River View', size: '45 m²', price: 65, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600&auto=format&fit=crop', features: ['Free WiFi', 'Balcony', 'Breakfast'] }
    ]
  },
  {
    id: 2,
    name: 'Temple Grove Boutique',
    location: 'Siem Reap, Cambodia',
    rating: 4.9,
    reviewsCount: 88,
    price: 60,
    img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800&auto=format&fit=crop',
    description: 'A serene sanctuary close to Angkor Wat. Modern tropical aesthetic with traditional Khmer art accents, private balconies, and a saltwater swimming pool.',
    amenities: ['Free WiFi', 'Pool', 'Breakfast Included', 'Airport Shuttle', 'Bar'],
    rooms: [
      { id: 201, name: 'Deluxe Pool View Room', bed: '1 King Bed', view: 'Pool View', size: '32 m²', price: 60, img: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600&auto=format&fit=crop', features: ['Free WiFi', 'Balcony', 'AC'] },
      { id: 202, name: 'Angkor Garden Villa', bed: '1 King Bed', view: 'Garden View', size: '55 m²', price: 95, img: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=600&auto=format&fit=crop', features: ['Free WiFi', 'Mini Bar', 'Bathtub'] }
    ]
  },
  {
    id: 3,
    name: 'Sokha Bay Seaview',
    location: 'Sihanoukville, Cambodia',
    rating: 4.4,
    reviewsCount: 52,
    price: 32,
    oldPrice: 38,
    img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop',
    description: 'Relax with uninterrupted views of the Gulf of Thailand. Enjoy direct beach access, coastal cuisine, rooftop bars, and sunset views.',
    amenities: ['Beach Access', 'Free WiFi', 'Restaurant', 'Pool', 'Bar'],
    rooms: [
      { id: 301, name: 'Standard Ocean Room', bed: '1 Double Bed', view: 'Sea View', size: '28 m²', price: 32, img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=600&auto=format&fit=crop', features: ['Free WiFi', 'Balcony', 'AC'] },
      { id: 302, name: 'Deluxe Beachfront Suite', bed: '1 King Bed', view: 'Direct Beach Access', size: '45 m²', price: 58, img: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=600&auto=format&fit=crop', features: ['Free WiFi', 'Mini Bar', 'Breakfast'] }
    ]
  },
  {
    id: 4,
    name: 'Bamboo River Sanctuary',
    location: 'Battambang, Cambodia',
    rating: 4.6,
    reviewsCount: 35,
    price: 45,
    img: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=800&auto=format&fit=crop',
    description: 'An eco-friendly sanctuary tucked along the Sangker River. Serene atmosphere, sustainable architecture, and peaceful nature views.',
    amenities: ['Free WiFi', 'River View', 'Bicycle Rental', 'Garden', 'Restaurant'],
    rooms: [
      { id: 401, name: 'Bamboo Riverside Suite', bed: '1 King Bed', view: 'River View', size: '35 m²', price: 45, img: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=600&auto=format&fit=crop', features: ['Free WiFi', 'Balcony', 'AC'] },
      { id: 402, name: 'Tropical Garden Bungalow', bed: '1 Queen Bed', view: 'Garden View', size: '30 m²', price: 55, img: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=600&auto=format&fit=crop', features: ['Free WiFi', 'Patio', 'Breakfast'] }
    ]
  },
  {
    id: 5,
    name: 'Kampot Cliffside Villa',
    location: 'Kampot, Cambodia',
    rating: 4.8,
    reviewsCount: 64,
    price: 75,
    img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop',
    description: 'Breathtaking cliffside villa overlooking the Kampot River and Bokor Mountain. Perfect for romantic retreats and relaxing stays.',
    amenities: ['Free WiFi', 'Infinity Pool', 'Mountain View', 'Restaurant', 'Bar'],
    rooms: [
      { id: 501, name: 'Cliffside Deluxe Villa', bed: '1 King Bed', view: 'Mountain & River View', size: '45 m²', price: 75, img: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=600&auto=format&fit=crop', features: ['Free WiFi', 'Private Balcony', 'Mini Bar'] },
      { id: 502, name: 'Sunset Pool Villa', bed: '1 King Bed', view: 'Panoramic Sunset View', size: '60 m²', price: 110, img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=600&auto=format&fit=crop', features: ['Free WiFi', 'Private Pool', 'Bathtub'] }
    ]
  },
  {
    id: 6,
    name: 'Kep Beach Resort',
    location: 'Kep, Cambodia',
    rating: 4.5,
    reviewsCount: 29,
    price: 50,
    img: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop',
    description: 'Peaceful beachfront stay just minutes from the famous Kep Crab Market. Enjoy seaside dining, fresh seafood, and tranquil sea breezes.',
    amenities: ['Sea View', 'Free WiFi', 'Pool', 'Seafood Restaurant', 'Bar'],
    rooms: [
      { id: 601, name: 'Seaview Superior Room', bed: '1 Queen Bed', view: 'Sea View', size: '30 m²', price: 50, img: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=600&auto=format&fit=crop', features: ['Free WiFi', 'AC', 'Balcony'] },
      { id: 602, name: 'Kep Horizon Suite', bed: '1 King Bed', view: 'Ocean View', size: '50 m²', price: 85, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600&auto=format&fit=crop', features: ['Free WiFi', 'Mini Bar', 'Breakfast'] }
    ]
  }
]

const hotel = ref(null)
const selectedRoom = ref(null)

function loadHotelData(id) {
  window.scrollTo({ top: 0, behavior: 'instant' })
  
  const hotelId = Number(id)
  const found = mockHotels.find(h => h.id === hotelId)
  
  if (found) {
    hotel.value = found
    if (found.rooms && found.rooms.length > 0) {
      selectedRoom.value = found.rooms[0]
    }
  } else {
    hotel.value = mockHotels[0]
    selectedRoom.value = mockHotels[0].rooms[0]
  }
}

onMounted(() => {
  loadHotelData(route.params.id)
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