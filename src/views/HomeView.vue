<template>
  <div class="page-wrapper">
    <!-- NAVBAR -->
    <NavbarView />

    <!-- HERO -->
    <section class="hero-premium">
      <div class="hero-overlay"></div>
      <div class="container hero-content">
        <div class="hero-eyebrow">CAMBODIA, CURATED</div>
        <h1 class="hero-title">Stays worth the journey</h1>
        <p class="hero-subtitle">
          From riverside boutique rooms in Phnom Penh to temple-view suites in Siem Reap — find your next stay.
        </p>
      </div>
    </section>

    <!-- SEARCH -->
    <div class="container search-container">
      <div class="search-card-premium">
        <div class="row g-3 align-items-end">
          <div class="col-md-3 search-field-premium">
            <label>Search Keyword</label>
            <div class="input-wrapper">
              <i class="bi bi-search"></i>
              <input type="text" class="form-control" placeholder="Hotel name..." v-model="search.keyword">
            </div>
          </div>

          <div class="col-md-2 search-field-premium">
            <label>City</label>
            <div class="input-wrapper">
              <i class="bi bi-geo-alt"></i>
              <select class="form-select" v-model="search.location">
                <option>All provinces</option>
                <option v-for="d in destinations" :key="d.name">{{ d.name }}</option>
              </select>
            </div>
          </div>

          <div class="col-md-2 search-field-premium">
            <label>Check-in</label>
            <input type="date" class="form-control" v-model="search.checkin">
          </div>

          <div class="col-md-2 search-field-premium">
            <label>Check-out</label>
            <input type="date" class="form-control" v-model="search.checkout">
          </div>

          <div class="col-md-2 search-field-premium">
            <label>Guests</label>
            <div class="input-wrapper">
              <i class="bi bi-people"></i>
              <input type="number" min="1" class="form-control" v-model="search.guests">
            </div>
          </div>

          <div class="col-md-1 search-field-premium">
            <button class="btn btn-search-premium w-100" @click="executeSearch">
              <i class="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- STAYS -->
    <section class="container py-5 mt-4">
      <div class="d-flex justify-content-between align-items-end mb-5 flex-wrap gap-3">
        <div>
          <h2 class="section-title-premium mb-2">View Hotels <span class="badge-count">{{ stays.length }}</span></h2>
          <p class="section-sub-premium mb-0">Handpicked places, booked direct.</p>
        </div>

      </div>

      <div class="row g-4">
        <div class="col-md-6 col-lg-4" v-for="s in sortedStays" :key="s.id">
          <div class="stay-card-premium">
            <div class="stay-img-wrap-premium">
              <img :src="s.img" :alt="s.name">
              <span v-if="s.tag" class="stay-tag-premium">{{ s.tag }}</span>
              <button class="stay-fav-premium" :class="{ active: s.fav }" @click="toggleWishlist(s)">
                <i class="bi" :class="s.fav ? 'bi-heart-fill text-danger' : 'bi-heart'"></i>
              </button>
            </div>
            
            <div class="stay-body-premium">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h3 class="stay-name-premium">{{ s.name }}</h3>
                  <div class="stay-loc-premium"><i class="bi bi-geo-alt-fill me-1 text-muted"></i>{{ s.location }}</div>
                </div>
                <div class="stay-rating-premium">
                  <i class="bi bi-star-fill text-warning me-1"></i>{{ s.rating }}
                </div>
              </div>

              <div class="stay-amenities-premium">
                <span class="amenity-pill-premium" v-for="a in s.amenities" :key="a">{{ a }}</span>
              </div>

              <div class="d-flex justify-content-between align-items-end mt-4 pt-3 border-top-premium">
                <div class="price-box">
                  <span v-if="s.oldPrice" class="price-strike-premium">${{ s.oldPrice }}</span>
                  <span class="price-now-premium">${{ s.price }}</span>
                  <span class="price-unit-premium">/night</span>
                </div>
                <button class="btn btn-view-hotel-premium" @click="goToDetail(s.id)">View Hotel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- REVIEWS -->
    <ReviewView />

    <!-- FOOTER -->
    <FooterView />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavbarView from '@/components/layout/customer/NavbarView.vue'
import FooterView from '@/components/layout/customer/FooterView.vue'
import ReviewView from '@/components/layout/customer/ReviewView.vue'
import { useCustomerStore } from '@/stores/customer'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const customerStore = useCustomerStore()
const authStore = useAuthStore()

const search = ref({
  keyword: '',
  location: 'All provinces',
  checkin: '',
  checkout: '',
  guests: 2
})

const sortBy = ref('recommended')
const destinations = computed(() => {
  if (!customerStore.hotels || customerStore.hotels.length === 0) return []
  
  const cities = new Set()
  customerStore.hotels.forEach(h => {
    if (h.city) {
      cities.add(h.city)
    }
  })
  
  return Array.from(cities).map(city => ({ name: city }))
})

onMounted(async () => {
  try {
    await customerStore.getHotels()
    if (authStore.isLogin) {
      await customerStore.getWishlist()
    }
  } catch (err) {
    console.error('Failed to load data:', err)
  }
})

const stays = computed(() => {
  if (!customerStore.hotels || customerStore.hotels.length === 0) return []

  const wishlistHotelIds = customerStore.wishlist?.data?.map(w => w.hotel_id) || []

  return customerStore.hotels.map(h => {
    let basePrice = 15;
    let ams = ['Free WiFi', 'Pool', 'Breakfast Included'];
    let image = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop';
    
    if (h.images && h.images.length > 0) {
      const primaryImage = h.images.find(img => img.is_primary);
      const imgPath = primaryImage ? primaryImage.image : h.images[0].image;

      if (imgPath && !imgPath.startsWith('http')) {
        image = `http://127.0.0.1:8000/storage/${imgPath}`;
      } else if (imgPath) {
        image = imgPath;
      }
    }

    return {
      id: h.id,
      name: h.name,
      location: `${h.city || ''}, ${h.country || ''}`.replace(/^, |, $/g, ''),
      rating: 4.5,
      price: basePrice,
      oldPrice: null,
      tag: 'Popular',
      fav: wishlistHotelIds.includes(h.id),
      amenities: ams,
      img: image
    }
  })
})

const filteredStays = computed(() => {
  let arr = [...stays.value]
  
  if (search.value.keyword) {
    const kw = search.value.keyword.toLowerCase()
    arr = arr.filter(s => s.name.toLowerCase().includes(kw))
  }
  
  // Local fallback filter for location just in case
  if (search.value.location && search.value.location !== 'All provinces') {
    arr = arr.filter(s => s.location.includes(search.value.location))
  }
  
  return arr
})

const sortedStays = computed(() => {
  const arr = [...filteredStays.value]
  if (sortBy.value === 'price-asc') arr.sort((a, b) => a.price - b.price)
  if (sortBy.value === 'price-desc') arr.sort((a, b) => b.price - a.price)
  if (sortBy.value === 'rating') arr.sort((a, b) => b.rating - a.rating)
  return arr
})

async function executeSearch() {
  const params = {}
  if (search.value.location && search.value.location !== 'All provinces') {
    params.city = search.value.location
  }
  
  try {
    await customerStore.getHotels(params)
  } catch (err) {
    console.error('Search failed:', err)
  }
}

function goToDetail(id) {
  router.push({ name: 'hotel-detail', params: { id } })
}

async function toggleWishlist(s) {
  if (!authStore.isLogin) {
    router.push('/login')
    return
  }
  
  try {
    if (s.fav) {
      await customerStore.removeFromWishlist(s.id)
    } else {
      await customerStore.addToWishlist(s.id)
    }
  } catch (error) {
    console.error('Wishlist toggle failed:', error)
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');

:root {
  --color-emerald-900: #064e3b;
  --color-emerald-800: #065f46;
  --color-gold-500: #065f46;
  --color-gold-600: #b45309;
  --color-bg-light: #f9fafb;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--color-bg-light);
  color: #111827;
}

/* HERO */
.hero-premium {
  position: relative;
  height: 65vh;
  min-height: 500px;
  background: url('/cambodia_hotel_hero.jpg') center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(6, 78, 59, 0.4) 0%, rgba(17, 24, 39, 0.7) 100%);
}

.hero-content {
  position: relative;
  z-index: 2;
  color: #fff;
  animation: fadeUp 1s ease-out;
}

.hero-eyebrow {
  font-weight: 600;
  letter-spacing: 0.15em;
  font-size: 0.85rem;
  color: var(--color-gold-500);
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(3rem, 5vw, 5rem);
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.hero-subtitle {
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
  opacity: 0.9;
  line-height: 1.6;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* SEARCH CARD */
.search-container {
  position: relative;
  z-index: 10;
  margin-top: -4rem;
}

.search-card-premium {
  background: #fff;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(6, 78, 59, 0.08);
}

.search-field-premium label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-wrapper {
  position: relative;
}

.input-wrapper i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.search-field-premium .form-control,
.search-field-premium .form-select {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  color: #111827;
  transition: all 0.2s ease;
}

.input-wrapper .form-control,
.input-wrapper .form-select {
  padding-left: 2.5rem;
}

.search-field-premium .form-control:focus,
.search-field-premium .form-select:focus {
  border-color: var(--color-gold-500);
  box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.1);
}

.btn-search-premium {
  background: var(--color-gold-500);
  color: #fff;
  border: none;
  border-radius: 10px;
  height: 48px;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.btn-search-premium:hover {
  background: var(--color-gold-600);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(217, 119, 6, 0.2);
}

/* STAYS SECTION */
.section-title-premium {
  font-family: 'Playfair Display', serif;
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--color-emerald-900);
}

.badge-count {
  background: #f3f4f6;
  color: #4b5563;
  font-size: 1rem;
  padding: 0.2rem 0.8rem;
  border-radius: 99px;
  vertical-align: middle;
  font-family: 'Inter', sans-serif;
}

.section-sub-premium {
  color: #6b7280;
  font-size: 1.05rem;
}

.custom-sort-select {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0.6rem 2.5rem 0.6rem 1rem;
  font-weight: 500;
  color: #4b5563;
}

.stay-card-premium {
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0,0,0,0.03);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #f3f4f6;
  height: 100%;
}

.stay-card-premium:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(6, 78, 59, 0.12);
}

.stay-img-wrap-premium {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
}

.stay-img-wrap-premium img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.stay-card-premium:hover .stay-img-wrap-premium img {
  transform: scale(1.05);
}

.stay-tag-premium {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  color: var(--color-emerald-900);
  padding: 0.4rem 0.8rem;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.stay-fav-premium {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255,255,255,0.9);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: #9ca3af;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.stay-fav-premium:hover {
  transform: scale(1.1);
  color: #ef4444;
}

.stay-body-premium {
  padding: 1.5rem;
}

.stay-name-premium {
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--color-emerald-900);
  margin-bottom: 0.3rem;
}

.stay-loc-premium {
  color: #6b7280;
  font-size: 0.85rem;
}

.stay-rating-premium {
  font-weight: 600;
  color: #111827;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
}

.stay-amenities-premium {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 1rem;
}

.amenity-pill-premium {
  background: #f3f4f6;
  color: #4b5563;
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-weight: 500;
}

.border-top-premium {
  border-top: 1px solid #f3f4f6;
}

.price-box {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
}

.price-strike-premium {
  color: #9ca3af;
  text-decoration: line-through;
  font-size: 0.85rem;
}

.price-now-premium {
  color: var(--color-emerald-900);
  font-weight: 700;
  font-size: 1.3rem;
}

.price-unit-premium {
  color: #6b7280;
  font-size: 0.85rem;
}

.btn-view-hotel-premium {
  background: var(--color-emerald-900);
  color: #fff;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.btn-view-hotel-premium:hover {
  background: var(--color-emerald-800);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(6, 78, 59, 0.2);
}
</style>