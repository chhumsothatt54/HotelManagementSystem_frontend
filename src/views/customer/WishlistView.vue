<template>
  <div class="page-wrapper">
    <NavbarView />
    
    <div class="container py-5 mt-4" style="min-height: 70vh;">
      <div class="d-flex justify-content-between align-items-end mb-5 flex-wrap gap-3">
        <div>
          <h2 class="section-title-premium mb-2">Your Wishlist</h2>
          <p class="section-sub-premium mb-0">Hotels you've saved for your future stays.</p>
        </div>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else-if="!wishlist.data || wishlist.data.length === 0" class="text-center py-5 bg-white rounded shadow-sm border">
        <i class="bi bi-heart text-muted" style="font-size: 3rem;"></i>
        <h3 class="mt-3 fw-bold">No saved hotels yet</h3>
        <p class="text-muted mb-4">
          Start exploring and add some hotels to your wishlist to see them here.
        </p>
        <router-link to="/" class="btn btn-primary px-4 py-2" style="background-color: #064e3b; border-color: #064e3b;">
          Explore Hotels
        </router-link>
      </div>

      <div v-else class="row g-4">
        <div class="col-md-6 col-lg-4" v-for="item in wishlist.data" :key="item.id">
          <div class="stay-card-premium">
            <div class="stay-img-wrap-premium">
              <img v-if="getPrimaryImage(item.hotel)" :src="getImageUrl(getPrimaryImage(item.hotel))" :alt="item.hotel.name">
              <div v-else class="w-100 h-100 d-flex align-items-center justify-content-center bg-light text-muted">
                <i class="bi bi-image" style="font-size: 2rem;"></i>
              </div>
              <button class="stay-fav-premium active" @click.prevent="openModal(item.hotel.id)" title="Remove from wishlist">
                <i class="bi bi-heart-fill text-danger"></i>
              </button>
            </div>
            
            <div class="stay-body-premium">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h3 class="stay-name-premium text-truncate" style="max-width: 200px;">{{ item.hotel.name }}</h3>
                  <div class="stay-loc-premium"><i class="bi bi-geo-alt-fill me-1 text-muted"></i>{{ item.hotel.city || 'Location N/A' }}</div>
                </div>
                <div class="stay-rating-premium">
                  <i class="bi bi-star-fill text-warning me-1"></i>{{ item.hotel.rating || 'New' }}
                </div>
              </div>

              <div class="mt-3">
                 <p class="text-muted" style="font-size: 0.9rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                   {{ item.hotel.description || 'Experience a wonderful stay at our beautiful hotel.' }}
                 </p>
              </div>

              <div class="d-flex justify-content-between align-items-end mt-4 pt-3 border-top-premium">
                <div class="price-box">
                  <span class="price-now-premium"></span>
                  <span class="price-unit-premium">/night</span>
                </div>
                <router-link :to="`/hotel/${item.hotel.id}`" class="btn btn-view-hotel-premium">
                  View Hotel
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Pagination -->
      <div v-if="wishlist.last_page > 1" class="mt-5 d-flex justify-content-center">
         <span class="text-muted small">More pages coming soon...</span>
      </div>
    </div>
    
    <FooterView />

    <!-- Remove Confirmation Modal -->
    <div v-if="showModal" class="modal-backdrop fade show" style="z-index: 1040;"></div>
    <div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="z-index: 1050;" @click.self="closeModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow" style="border-radius: 16px;">
          <div class="modal-header border-bottom-0 pb-0 mt-2">
            <h5 class="modal-title fw-bold" style="color: #064e3b;">Remove from Wishlist</h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-muted pt-3 pb-4">
            Are you sure you want to remove this hotel from your wishlist?
          </div>
          <div class="modal-footer border-top-0 pt-0 mb-2">
            <button type="button" class="btn btn-light rounded-3 px-4" @click="closeModal">Cancel</button>
            <button type="button" class="btn btn-danger rounded-3 px-4" @click="confirmRemove" :disabled="isRemoving">
              <span v-if="isRemoving" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useCustomerStore } from '@/stores/customer';
import NavbarView from '@/components/layout/customer/NavbarView.vue'
import FooterView from '@/components/layout/customer/FooterView.vue'

const store = useCustomerStore();
const loading = ref(true);
const showModal = ref(false);
const itemToRemove = ref(null);
const isRemoving = ref(false);

const wishlist = computed(() => store.wishlist);

const fetchWishlist = async () => {
  loading.value = true;
  try {
    await store.getWishlist();
  } catch (error) {
    // Error silently handled
  } finally {
    loading.value = false;
  }
};

const openModal = (hotelId) => {
  itemToRemove.value = hotelId;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  itemToRemove.value = null;
};

const confirmRemove = async () => {
  if (!itemToRemove.value) return;
  
  isRemoving.value = true;
  try {
    await store.removeFromWishlist(itemToRemove.value);
    closeModal();
  } catch (error) {
    // Error silently handled
  } finally {
    isRemoving.value = false;
  }
};

const getPrimaryImage = (hotel) => {
  if (!hotel.images || hotel.images.length === 0) return null;
  const primary = hotel.images.find(img => img.is_primary);
  return primary ? (primary.image_url || primary.image) : (hotel.images[0].image_url || hotel.images[0].image);
};

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
  return `${baseUrl}/storage/${path}`;
};

const getStartingPrice = (hotel) => {
  if (!hotel.room_types || hotel.room_types.length === 0) return '50.00';
  const prices = hotel.room_types.map(rt => parseFloat(rt.price_per_night || rt.price));
  return Math.min(...prices).toFixed(2);
};

onMounted(() => {
  fetchWishlist();
});
</script>

<style>
/* Fallback styles in case HomeView styles are not loaded globally */
.section-title-premium {
  font-family: 'Playfair Display', serif;
  font-size: 2.2rem;
  font-weight: 700;
  color: #064e3b;
}

.section-sub-premium {
  color: var(--text-muted, #6b7280);
  font-size: 1.05rem;
}

.stay-card-premium {
  background: var(--bg-card, #fff);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0,0,0,0.03);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--bg-card, #f3f4f6);
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
  color: var(--text-muted, #9ca3af);
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
  color: #064e3b;
  margin-bottom: 0.3rem;
}

.stay-loc-premium {
  color: var(--text-muted, #6b7280);
  font-size: 0.85rem;
}

.stay-rating-premium {
  font-weight: 600;
  color: var(--text-main, #111827);
  font-size: 0.95rem;
  display: flex;
  align-items: center;
}

.border-top-premium {
  border-top: 1px solid var(--bg-card, #f3f4f6);
}

.price-box {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
}

.price-now-premium {
  color: #064e3b;
  font-weight: 700;
  font-size: 1.3rem;
}

.price-unit-premium {
  color: var(--text-muted, #6b7280);
  font-size: 0.85rem;
}

.btn-view-hotel-premium {
  background: #064e3b;
  color: var(--bg-card, #fff);
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-view-hotel-premium:hover {
  background: #065f46;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(6, 78, 59, 0.2);
  color: var(--bg-card, white);
}
</style>
