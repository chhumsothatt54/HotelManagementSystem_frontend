<template>

  <div>

    <!-- NAVBAR -->
    <NavbarView />

    <!-- HERO -->
    <section class="hero pb-0">
      <div class="eyebrow">CAMBODIA, CURATED</div>
      <h1>Stays worth the journey</h1>
      <p>
        From riverside boutique rooms in Phnom Penh to
        temple-view suites in Siem Reap — find your next stay.
      </p>
    </section>
    <!-- SEARCH -->
    <div class="search-card">
      <div class="row g-3 align-items-end">

        <div class="col-md-3 search-field">
          <label>Search Keyword</label>
          <input type="text" class="form-control" placeholder="Hotel name, description..." v-model="search.keyword">
        </div>

        <div class="col-md-2 search-field">
          <label>City</label>
          <select class="form-select" v-model="search.location">
            <option>All provinces</option>
            <option v-for="d in destinations" :key="d.name">
              {{ d.name }}
            </option>
          </select>
        </div>

        <div class="col-md-2 search-field">
          <label>Check-in</label>
          <input type="date" class="form-control" v-model="search.checkin">
        </div>

        <div class="col-md-2 search-field">
          <label>Check-out</label>
          <input type="date" class="form-control" v-model="search.checkout">
        </div>

        <div class="col-md-2 search-field">
          <label>Guests</label>
          <input type="number" min="1" class="form-control" v-model="search.guests">
        </div>

        <div class="col-md-1 search-field">
          <button class="btn btn-primary-brand w-100">
            🔍
          </button>
        </div>

      </div>
    </div>
    <!-- STAYS -->
    <section class="container pt-2 pt-3">
      <div class="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-2">
        <div>
          <h2 class="section-title mb-1">
            View Hotels {{ stays.length }}
          </h2>
          <p class="section-sub mb-0">
            Handpicked places, booked direct.
          </p>
        </div>
        <select class="form-select w-auto" v-model="sortBy">
          <option value="recommended">
            Sort: Recommended
          </option>
          <option value="price-asc">
            Price: Low to High
          </option>
          <option value="price-desc">
            Price: High to Low
          </option>
          <option value="rating">
            Top Rated

          </option>

        </select>

      </div>



      <div class="row g-4">
        <div class="col-sm-6 col-lg-4" v-for="s in sortedStays" :key="s.id">
          <div class="stay-card">
            <div class="stay-img-wrap">
              <img :src="s.img" :alt="s.name">
              <span v-if="s.tag" class="stay-tag">

                {{ s.tag }}
              </span>



              <button class="stay-fav" :class="{ active: s.fav }" @click="s.fav = !s.fav">

                {{ s.fav ? '♥' : '♡' }}

              </button>



            </div>



            <div class="stay-body">



              <div class="d-flex justify-content-between align-items-start">

                <div>



                  <div class="stay-name">

                    {{ s.name }}

                  </div>



                  <div class="stay-loc">

                    📍 {{ s.location }}

                  </div>



                </div>



                <div class="stay-rating">

                  ★ {{ s.rating }}

                </div>

              </div>



              <div class="stay-amenities">



                <span class="amenity-pill" v-for="a in s.amenities" :key="a">

                  {{ a }}

                </span>



              </div>



              <div class="d-flex justify-content-between align-items-center mt-2">

                <div>



                  <span v-if="s.oldPrice" class="price-strike me-1">

                    ${{ s.oldPrice }}

                  </span>



                  <span class="price-now">

                    ${{ s.price }}

                  </span>



                  <span class="price-unit">

                    /night

                  </span>



                </div>



                <!-- ភ្ជាប់ប៊ូតុងទៅកាន់ Hotel Detail -->

                <button class="btn btn-outline-brand btn-sm" @click="goToDetail(s.id)">

                  View Hotel

                </button>



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

import FooterView from '@/components/layout/customer/FooterView.vue'


import ReviewView from '../components/layout/customer/ReviewView.vue'

import NavbarView from '@/components/layout/customer/NavbarView.vue'



const router = useRouter()



const search = ref({
  keyword: '',
  location: 'All provinces',
  checkin: '',
  checkout: '',
  guests: 2
})

const sortBy = ref('recommended')

import { useCustomerStore } from '@/stores/customer'

const customerStore = useCustomerStore()

onMounted(async () => {
  try {
    await customerStore.getHotels()
  } catch (err) {
    console.error('Failed to load hotels:', err)
  }
})

const stays = computed(() => {
  if (!customerStore.hotels || customerStore.hotels.length === 0) return []

  return customerStore.hotels.map(h => {
    // Attempt to extract the lowest room price if rooms are loaded, else a default or property price
    let basePrice = 50;

    // Attempt to extract amenities if they exist
    let ams = ['Free WiFi', 'Pool', 'Breakfast Included'];

    // Get the first image or a default fallback
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
      rating: 4.5, // Default rating if not provided by backend
      price: basePrice,
      oldPrice: null,
      tag: 'Popular',
      fav: false,
      amenities: ams,
      img: image
    }
  })
})

const sortedStays = computed(() => {
  const arr = [...stays.value]

  if (sortBy.value === 'price-asc') {
    arr.sort((a, b) => a.price - b.price)
  }

  if (sortBy.value === 'price-desc') {
    arr.sort((a, b) => b.price - a.price)
  }

  if (sortBy.value === 'rating') {
    arr.sort((a, b) => b.rating - a.rating)
  }

  return arr
})

// Function បញ្ជូនទៅកាន់ Hotel Detail View

function goToDetail(id) {

  router.push({ name: 'hotel-detail', params: { id } })

}

</script>



<style>
:root {

  --navy: #063B32;

  --blue: #087F68;

  --blue-light: #E8F6F2;

  --sky: #39A98A;



  --ink: #17231F;

  --muted: #6B7772;



  --footer-bg: #F5F7F6;



  --line: #E1E9E5;

  --bg-soft: #F4F8F6;



  --gold: #F4B942;



  --radius: 12px;

}

* {

  box-sizing: border-box;

}



html {

  scroll-behavior: smooth;

}



body {

  font-family: 'Inter', sans-serif;

  color: var(--ink);

  background: #fff;

  -webkit-font-smoothing: antialiased;

}



h1,

h2,

h3,

.display-font {

  font-family: 'Fraunces', serif;

  letter-spacing: -0.01em;

}



a {

  text-decoration: none;

}



/* ========================================

   BUTTONS

======================================== */



.btn-primary-brand {

  background: #087F68;

  border: 1px solid #087F68;

  color: #fff;

  font-weight: 600;

  border-radius: 8px;

  transition: all 0.2s ease;

}



.btn-primary-brand:hover {

  background: #063B32;

  border-color: #063B32;

  color: #fff;

  transform: translateY(-1px);

}



.btn-outline-brand {

  background: #fff;

  border: 1px solid #D7E5E0;

  color: #063B32;

  font-weight: 600;

  border-radius: 8px;

  transition: all 0.2s ease;

}



.btn-outline-brand:hover {

  background: #E8F6F2;

  border-color: #087F68;

  color: #087F68;

}



/* ========================================

   NAVBAR

======================================== */



.navbar {

  background: #fff !important;

  border-bottom: 1px solid #EEF2F0;

}



.navbar-brand-custom {

  font-family: 'Fraunces', serif;

  font-weight: 600;

  font-size: 1.35rem;

  color: #063B32;

}



.navbar-brand-custom .dot {

  color: #087F68;

}



.nav-custom .nav-link {

  color: #17231F;

  font-weight: 500;

  font-size: 0.95rem;

  padding: 0.4rem 0.9rem;

  transition: color 0.2s ease;

}



.nav-custom .nav-link:hover {

  color: #087F68;

}



.nav-custom .nav-link.active {

  color: #087F68;

  font-weight: 600;

}



/* ========================================

   ICON BUTTON

======================================== */



.icon-btn {

  width: 38px;

  height: 38px;

  border-radius: 50%;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  color: #6B7772;

  background: transparent;

  border: none;

  position: relative;

  transition: all 0.2s ease;

}



.icon-btn:hover {

  background: #E8F6F2;

  color: #087F68;

}



.badge-dot {

  position: absolute;

  top: 4px;

  right: 5px;

  width: 8px;

  height: 8px;

  border-radius: 50%;

  background: #087F68;

  border: 2px solid #fff;

}



/* ========================================

   PROFILE

======================================== */



.avatar-chip {

  display: flex;

  align-items: center;

  gap: 0.5rem;

  padding: 0.3rem 0.7rem 0.3rem 0.3rem;

  border-radius: 999px;

  border: 1px solid #E1E9E5;

  background: #fff;

}



.avatar-circle {

  width: 28px;

  height: 28px;

  border-radius: 50%;

  background: #087F68;

  color: #fff;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 0.75rem;

  font-weight: 700;

}



/* ========================================

   HERO

======================================== */



.hero {

  position: relative;



  background:

    linear-gradient(90deg,

      rgba(232, 246, 242, 0.96) 0%,

      rgba(232, 246, 242, 0.88) 30%,

      rgba(232, 246, 242, 0.25) 60%,

      rgba(6, 59, 50, 0.25) 100%),

    url('https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1600&auto=format&fit=crop') center / cover no-repeat;



  padding: 5.5rem 1rem 8rem;

  text-align: center;

  color: #063B32;

}



.hero .eyebrow {

  color: #087F68;

  font-weight: 600;

  font-size: 0.85rem;

  letter-spacing: 0.02em;

}



.hero h1 {

  font-size: clamp(2.1rem, 4.2vw, 3.4rem);

  font-weight: 600;

  margin: 0.6rem 0 0.8rem;

  color: #063B32;

}



.hero p {

  max-width: 560px;

  margin: 0 auto;

  color: #52635D;

  font-size: 1.02rem;

}



/* ========================================

   SEARCH CARD

======================================== */



.search-card {

  max-width: 1040px;

  margin: -4.5rem auto 0;

  background: #fff;

  border-radius: 18px;

  border: 1px solid #E1E9E5;



  box-shadow:

    0 12px 30px rgba(6, 59, 50, 0.10);



  padding: 1.4rem;

  position: relative;

  z-index: 5;

}



.search-field label {

  font-size: 0.75rem;

  font-weight: 600;

  color: #6B7772;

  margin-bottom: 0.25rem;

  display: block;

}



.search-field .form-control,

.search-field .form-select {

  border: 1px solid #E1E9E5;

  padding: 0.55rem 0.7rem;

  font-size: 0.92rem;

  border-radius: 8px;

  color: #17231F;

  background: #fff;

}



.search-field .form-control:focus,

.search-field .form-select:focus {

  border-color: #087F68;

  box-shadow: 0 0 0 3px #E8F6F2;

}



/* ========================================

   SECTIONS

======================================== */



section {

  padding: 4rem 0;

}



.section-title {

  font-size: 1.6rem;

  font-weight: 600;

  color: #063B32;

  margin-bottom: 0.25rem;

}



.section-sub {

  color: #6B7772;

  font-size: 0.95rem;

}



/* ========================================

   DESTINATIONS

======================================== */



.dest-card {

  position: relative;

  border-radius: 14px;

  overflow: hidden;

  aspect-ratio: 3 / 3.6;

  cursor: pointer;

  isolation: isolate;

  transition:

    transform 0.2s ease,

    box-shadow 0.2s ease;

}



.dest-card img {

  width: 100%;

  height: 100%;

  object-fit: cover;

  transition: transform 0.4s ease;

}



.dest-card:hover {

  transform: translateY(-3px);

  box-shadow: 0 14px 30px rgba(6, 59, 50, 0.15);

}



.dest-card:hover img {

  transform: scale(1.06);

}



.dest-card::after {

  content: "";

  position: absolute;

  inset: 0;



  background:

    linear-gradient(180deg,

      rgba(6, 59, 50, 0) 40%,

      rgba(6, 59, 50, 0.75) 100%);

}



.dest-card .dest-label {

  position: absolute;

  left: 0.8rem;

  bottom: 0.7rem;

  z-index: 2;

  color: #fff;

  font-weight: 600;

  font-size: 0.9rem;

}



.dest-card .dest-count {

  position: absolute;

  left: 0.8rem;

  bottom: 0.15rem;

  z-index: 2;

  color: #D9EDE6;

  font-size: 0.72rem;

}



.dest-card.active {

  outline: 2px solid #087F68;

  outline-offset: 3px;

}



/* ========================================

   HOTEL CARDS

======================================== */



.stay-card {

  border: 1px solid #E1E9E5;

  border-radius: 14px;

  overflow: hidden;

  background: #fff;

  height: 100%;



  transition:

    box-shadow 0.2s ease,

    transform 0.2s ease,

    border-color 0.2s ease;

}



.stay-card:hover {

  border-color: #B8D9CE;

  box-shadow: 0 12px 28px rgba(6, 59, 50, 0.12);

  transform: translateY(-3px);

}



.stay-img-wrap {

  position: relative;

  aspect-ratio: 16 / 11;

  overflow: hidden;

  background: #F4F8F6;

}



.stay-img-wrap img {

  width: 100%;

  height: 100%;

  object-fit: cover;

  transition: transform 0.4s ease;

}



.stay-card:hover .stay-img-wrap img {

  transform: scale(1.03);

}



/* ========================================

   HOTEL TAG

======================================== */



.stay-tag {

  position: absolute;

  top: 0.7rem;

  left: 0.7rem;



  background: #087F68;

  color: #fff;



  padding: 0.25rem 0.6rem;

  border-radius: 999px;



  font-size: 0.72rem;

  font-weight: 600;

}



.stay-tag.discount {

  background: #087F68;

}



/* ========================================

   FAVORITE

======================================== */



.stay-fav {

  position: absolute;

  top: 0.6rem;

  right: 0.6rem;



  width: 32px;

  height: 32px;



  border-radius: 50%;



  background: rgba(255, 255, 255, 0.94);



  display: flex;

  align-items: center;

  justify-content: center;



  border: none;

  color: #6B7772;



  transition: all 0.2s ease;

}



.stay-fav:hover {

  color: #087F68;

  transform: scale(1.05);

}



.stay-fav.active {

  color: #D65A6A;

}



/* ========================================

   HOTEL CONTENT

======================================== */



.stay-body {

  padding: 1rem 1.1rem 1.1rem;

}



.stay-name {

  font-weight: 700;

  font-size: 1.02rem;

  color: #063B32;

  margin-bottom: 0.15rem;

}



.stay-loc {

  color: #6B7772;

  font-size: 0.82rem;

  margin-bottom: 0.55rem;

}



.stay-rating {

  display: inline-flex;

  align-items: center;

  gap: 0.25rem;



  font-size: 0.82rem;

  font-weight: 600;



  color: #063B32;

}



.stay-amenities {

  display: flex;

  flex-wrap: wrap;

  gap: 0.35rem;

  margin: 0.6rem 0;

}



.amenity-pill {

  font-size: 0.72rem;

  color: #6B7772;

  background: #F4F8F6;



  padding: 0.22rem 0.55rem;

  border-radius: 999px;

}



.price-strike {

  color: #6B7772;

  text-decoration: line-through;

  font-size: 0.82rem;

}



.price-now {

  color: #063B32;

  font-weight: 700;

  font-size: 1.15rem;

}



.price-unit {

  color: #6B7772;

  font-size: 0.8rem;

}



/* ========================================

   FEATURES

======================================== */



.features-strip {

  background: #F4F8F6;

}



.feature-item .feature-icon {

  width: 46px;

  height: 46px;



  border-radius: 12px;



  background: #E8F6F2;

  color: #087F68;



  display: flex;

  align-items: center;

  justify-content: center;



  margin-bottom: 0.9rem;

}



.feature-item h6 {

  font-weight: 700;

  color: #063B32;

}



.feature-item p {

  color: #6B7772;

  font-size: 0.88rem;

  margin: 0;

}



/* ========================================

   REVIEWS

======================================== */



.review-card {

  border: 1px solid #E1E9E5;

  border-radius: 14px;



  padding: 1.4rem;



  height: 100%;

  background: #fff;



  transition:

    transform 0.2s ease,

    box-shadow 0.2s ease;

}



.review-card:hover {

  transform: translateY(-2px);



  box-shadow:

    0 12px 25px rgba(6, 59, 50, 0.08);

}



.review-stars {

  color: #F4B942;

  font-size: 0.85rem;

  letter-spacing: 1px;

}



.review-text {

  color: #17231F;

  font-size: 0.92rem;

  margin: 0.7rem 0 1rem;

}



.review-avatar {

  width: 34px;

  height: 34px;



  border-radius: 50%;



  background: #087F68;

  color: #fff;



  font-weight: 600;

  font-size: 0.86rem;



  display: flex;

  align-items: center;

  justify-content: center;

}



.review-name {

  font-weight: 600;

  color: #063B32;

}



.review-loc {

  font-size: 0.78rem;

  color: #6B7772;

}



/* ========================================

   NEWSLETTER

======================================== */



.newsletter {

  background: #087F68;

  color: #fff;

  border-radius: 14px;

}



.newsletter-input {

  background: #fff;

  border: 1px solid #fff;

  color: #17231F;

  border-radius: 8px;

}



.newsletter-input:focus {

  background: #fff;

  color: #17231F;

  border-color: #fff;



  box-shadow:

    0 0 0 3px rgba(255, 255, 255, 0.2);

}



.newsletter-input::placeholder {

  color: #8A9691;

}



/* ========================================

   FOOTER

======================================== */



footer {

  background: #F5F7F6;

  color: #6B7772;

  padding: 3.2rem 0 1.4rem;



  border-top: 1px solid #E1E9E5;

}



footer h6 {

  color: #063B32;



  font-weight: 700;

  font-size: 0.82rem;



  letter-spacing: 0.03em;

  text-transform: uppercase;



  margin-bottom: 1rem;

}



footer a {

  color: #087F68;



  font-size: 0.88rem;

  display: block;



  margin-bottom: 0.55rem;



  font-weight: 500;



  transition: color 0.2s ease;

}



footer a:hover {

  color: #063B32;

}



footer .foot-brand {

  font-family: 'Fraunces', serif;



  color: #063B32;



  font-size: 1.25rem;

  font-weight: 600;

}



footer p.desc {

  font-size: 0.86rem;

  color: #6B7772;



  max-width: 280px;

}



.footer-bottom {

  border-top: 1px solid #E1E9E5;



  margin-top: 2.2rem;

  padding-top: 1.2rem;



  font-size: 0.78rem;

  color: #8A9691;

}



/* ========================================

   RESPONSIVE

======================================== */



@media (max-width: 767px) {

  .search-card {

    margin-top: -3rem;

    padding: 1rem;

  }



  .hero {

    padding: 3.5rem 1rem 7rem;

  }



  .hero h1 {

    font-size: 2.2rem;

  }



  .section-title {

    font-size: 1.4rem;

  }



  .navbar-brand-custom {

    font-size: 1.2rem;

  }

}
</style>