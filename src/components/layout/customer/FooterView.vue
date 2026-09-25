<template>
  <footer class="custom-footer">
    <div class="container">
      <div class="row g-5">
        <div class="col-lg-4">
          <div class="foot-brand mb-3 d-flex align-items-center gap-2">
            <div class="brand-logo-mark-footer">
              <img src="@/assets/image/hotel_logo.jpg" alt="" class="w-100 h-100 object-fit-cover rounded-2">
            </div>
            <span class="brand-text-footer">Angkor<span class="dot">Stay</span></span>
          </div>
          <p class="desc pe-lg-5">
            Independent stays across Cambodia — from riverfront heritage hotels to cliffside villas — booked directly.
          </p>
        </div>

        <div class="col-6 col-lg-2">
          <h6>Explore</h6>
          <div class="d-flex flex-column gap-2">
            <a href="#" class="footer-link" v-for="d in destinations" :key="d.name">{{ d.name }}</a>
          </div>
        </div>

        <div class="col-6 col-lg-2">
          <h6>Company</h6>
          <div class="d-flex flex-column gap-2">
            <a href="#" class="footer-link">Our Team</a>
            <a href="#" class="footer-link">Contact</a>
            <a href="#" class="footer-link">Careers</a>
          </div>
        </div>

        <div class="col-6 col-lg-2">
          <h6>Account</h6>
          <div class="d-flex flex-column gap-2">
            <a href="#" class="footer-link">My Bookings</a>
            <a href="#" class="footer-link">Wishlist</a>
            <a href="#" class="footer-link">Profile</a>
            <a href="#" class="footer-link">Notifications</a>
          </div>
        </div>

        <div class="col-lg-2">
          <h6>Get travel deals</h6>
          <p class="desc mb-3 small">
            One email a month, mostly discount codes.
          </p>
          <div class="newsletter-wrapper">
            <input type="email" class="form-control newsletter-input" placeholder="you@example.com">
            <button class="btn btn-subscribe mt-2 w-100">Subscribe</button>
          </div>
        </div>
      </div>

      <div class="footer-bottom mt-5 pt-4 d-flex flex-wrap justify-content-between align-items-center border-top-custom">
        <span class="text-muted small">
          © 2026 AngkorStay. Customer portal.
        </span>
        <span class="text-muted small text-end mt-2 mt-md-0">
          Phnom Penh · Siem Reap · Sihanoukville · Battambang · Kampot · Kep
        </span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue';
const destinations = ref([
  { name: 'Phnom Penh' },
  { name: 'Siem Reap' },
  { name: 'Sihanoukville' },
  { name: 'Battambang' },
  { name: 'Kampot' },
  { name: 'Kep' }
])
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');

.custom-footer {
  background-color: #022c22; /* Very dark emerald */
  color: #d1d5db;
  padding: 5rem 0 2rem;
  font-family: 'Inter', sans-serif;
}

.brand-logo-mark-footer {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  color: var(--bg-card, #fff);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  font-size: 1.3rem;
}

.brand-text-footer {
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--bg-card, #fff);
  letter-spacing: -0.01em;
}

.brand-text-footer .dot {
  color: #d97706;
}

.desc {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-muted, #9ca3af);
}

h6 {
  color: var(--bg-card, #fff);
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 1.25rem;
  letter-spacing: 0.02em;
}

.footer-link {
  color: var(--text-muted, #9ca3af);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  display: inline-block;
}

.footer-link:hover {
  color: #d97706;
  transform: translateX(3px);
}

.newsletter-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--bg-card, #fff);
  border-radius: 8px;
  padding: 0.6rem 1rem;
}

.newsletter-input:focus {
  background: rgba(255, 255, 255, 0.1);
  border-color: #d97706;
  box-shadow: none;
  color: var(--bg-card, #fff);
}

.newsletter-input::placeholder {
  color: var(--text-muted, #6b7280);
}

.btn-subscribe {
  background: #d97706;
  color: var(--bg-card, #fff);
  font-weight: 600;
  border-radius: 8px;
  padding: 0.6rem 1rem;
  border: none;
  transition: background-color 0.2s ease;
}

.btn-subscribe:hover {
  background: #b45309;
  color: var(--bg-card, #fff);
}

.border-top-custom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
