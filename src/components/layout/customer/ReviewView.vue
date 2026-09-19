<template>
  <section class="container py-5">
    <div class="text-center mb-5">
      <h2 class="section-title">What Guests Are Saying</h2>
      <p class="text-muted mt-2">Discover why our guests love staying with us</p>
    </div>

    <div class="row g-4 mt-2 mb-5">
      <div class="col-md-4" v-for="r in reviews" :key="r.name">
        <div class="review-card h-100">
          <div class="card-body p-4 d-flex flex-column h-100">
            <div class="review-stars mb-3">
              <span v-for="n in 5" :key="n">★</span>
            </div>
            
            <p class="review-text flex-grow-1">
              "{{ r.text }}"
            </p>

            <div class="d-flex align-items-center mt-4">
              <div class="review-avatar">
                {{ r.name[0] }}
              </div>
              <div class="ms-3 text-start">
                <h6 class="review-name mb-0">{{ r.name }}</h6>
                <small class="review-loc">{{ r.location }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const reviews = ref([
  {
    name: 'Sophea K.',
    location: 'Phnom Penh',
    text: 'Booked a riverside room the same day I searched — check-in was seamless.'
  },
  {
    name: 'Daniel R.',
    location: 'Siem Reap',
    text: 'The temple-view rooftop pool alone was worth the trip out to Siem Reap.'
  },
  {
    name: 'Chantha V.',
    location: 'Kampot',
    text: 'The lodge arranged a sunset boat cruise I never would have found on my own.'
  }
])
</script>

<style scoped>
.section-title {
  font-weight: 800;
  font-size: 2.5rem;
  background: linear-gradient(135deg, #064e3b 0%, #047857 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.review-card {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  position: relative;
}

.review-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #f6d365 0%, #fda085 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.review-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  border-color: rgba(0, 0, 0, 0.1);
}

.review-card:hover::before {
  opacity: 1;
}

.review-stars {
  color: #fbbf24;
  font-size: 1.25rem;
  letter-spacing: 2px;
}

.review-text {
  font-size: 1.05rem;
  line-height: 1.6;
  color: #4b5563;
  font-style: italic;
  position: relative;
  z-index: 1;
}

.review-avatar {
  width: 48px;
  height: 48px;
background: linear-gradient(135deg, #064e3b 0%, #047857 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
}

.review-name {
  font-weight: 700;
  color: #1f2937;
  font-size: 1rem;
}

.review-loc {
  color: #6b7280;
  font-size: 0.85rem;
  display: block;
}
</style>