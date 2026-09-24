<template>
  <div class="about-page">
    <NavbarView />

    <!-- HERO SECTION -->
    <section class="hero-section position-relative overflow-hidden text-center py-5">
      <div class="hero-bg-blob blob-1"></div>
      <div class="hero-bg-blob blob-2"></div>
      
      <div class="container position-relative z-1">
        <div class="logo-wrapper mb-4 mx-auto animate-fade-in-up">
          <img src="@/assets/image/hotel_logo.jpg" alt="AngkorStay Logo" class="brand-logo shadow-sm" />
        </div>
        <div class="eyebrow animate-fade-in-up" style="animation-delay: 0.1s;">ABOUT US</div>
        <h1 class="display-4 fw-bold text-gradient mb-3 animate-fade-in-up" style="animation-delay: 0.2s;">Welcome to AngkorStay</h1>
        <p class="lead text-muted mx-auto hero-subtitle animate-fade-in-up" style="animation-delay: 0.3s;">
          Discover the perfect getaway in Cambodia, tailored for every traveler.
        </p>
      </div>
    </section>

    <!-- CONTENT SECTION -->
    <section class="container mb-5 pb-5">
      
      <!-- VISION / MISSION CARD -->
      <div class="row justify-content-center mb-5 animate-fade-in-up" style="animation-delay: 0.4s;">
        <div class="col-lg-10">
          <div class="glass-card p-5 text-center">
            <h3 class="fw-bold mb-4 text-navy">Our Mission</h3>
            <p class="fs-5 text-secondary leading-relaxed">
              AngkorStay is a premium hotel booking platform that connects travelers with hotels and homestays across Cambodia. 
              We make it simple to search, compare, and book your dream stay — from riverside boutique hotels to seaside resorts — all in one place.
            </p>
          </div>
        </div>
      </div>

      <!-- TEAM SECTION -->
      <div class="text-center mt-5 mb-5 animate-fade-in-up" style="animation-delay: 0.5s;">
        <h2 class="fw-bold text-navy mb-2">Meet Our Team</h2>
        <div class="title-underline mx-auto mb-5"></div>
      </div>

      <div class="row justify-content-center g-4">
        <div class="col-md-4 col-sm-6" v-for="(member, index) in team" :key="member.name">
          <div class="team-card glass-card p-4 text-center h-100 animate-fade-in-up" :style="{ 'animation-delay': `${0.6 + index * 0.1}s` }">
            <div class="avatar-wrapper mx-auto mb-4">
              <img v-if="member.image" :src="member.image" :alt="member.name" class="team-avatar object-fit-cover w-100 h-100" />
              <div v-else class="team-avatar-fallback w-100 h-100 d-flex align-items-center justify-content-center">{{ member.initials }}</div>
            </div>
            <h4 class="team-name fw-bold mb-1">{{ member.name }}</h4>
            <span class="team-role-badge mt-2 mb-4">{{ member.role }}</span>
            
            <div class="social-links d-flex justify-content-center gap-3 mt-auto">
              <a v-if="member.facebook" :href="member.facebook" target="_blank" class="social-icon">
                <i class="bi bi-facebook"></i>
              </a>
              <a v-if="member.github" :href="member.github" target="_blank" class="social-icon">
                <i class="bi bi-github"></i>
              </a>
              <a v-if="member.telegram" :href="member.telegram" target="_blank" class="social-icon">
                <i class="bi bi-telegram"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

    </section>

    <FooterView />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import NavbarView from '@/components/layout/customer/NavbarView.vue'
import FooterView from '@/components/layout/customer/FooterView.vue'

import sothattImg from '@/assets/image/sothatt.png'
import reaksmeyImg from '@/assets/image/reaksmey.png'
import putheaImg from '@/assets/image/puthea.png'

const team = ref([
  { 
    name: 'Sothatt', 
    role: 'Team Leader', 
    image: sothattImg, 
    initials: 'S',
    facebook: 'https://www.facebook.com/share/14o8a1TDPQy/?mibextid=wwXIfr',
    github: 'https://github.com/chhumsothatt54',
    telegram: 'https://t.me/csothatt'
  },
  { 
    name: 'Reaksmey', 
    role: 'Team Member', 
    image: reaksmeyImg, 
    initials: 'R',
    facebook: '#',
    github: '#',
    telegram: '#'
  },
  { 
    name: 'Puthea', 
    role: 'Team Member', 
    image: putheaImg, 
    initials: 'P',
    facebook: '#',
    github: '#',
    telegram: '#'
  }
])
</script>

<style scoped>
/* GENERAL */
.about-page {
  background-color: #f8fafc;
  min-height: 100vh;
  overflow-x: hidden;
}

:root {
  --navy: #063b32;
  --emerald: #087f68;
}

/* HERO SECTION */
.hero-section {
  padding-top: 6rem;
  padding-bottom: 4rem;
}

.hero-subtitle {
  max-width: 600px;
}

.logo-wrapper {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  padding: 6px;
  background: white;
}

.brand-logo {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.eyebrow {
  color: #087f68;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.text-gradient {
  background: linear-gradient(135deg, #063b32 0%, #087f68 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* BLOBS */
.hero-bg-blob {
  position: absolute;
  filter: blur(80px);
  z-index: 0;
  border-radius: 50%;
  opacity: 0.4;
}

.blob-1 {
  width: 400px;
  height: 400px;
  background: #a7f3d0;
  top: -100px;
  left: -100px;
  animation: float 8s ease-in-out infinite alternate;
}

.blob-2 {
  width: 300px;
  height: 300px;
  background: #bfdbfe;
  bottom: -50px;
  right: -50px;
  animation: float 10s ease-in-out infinite alternate-reverse;
}

@keyframes float {
  0% { transform: translateY(0) scale(1); }
  100% { transform: translateY(30px) scale(1.1); }
}

/* GLASS CARD */
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
}

.text-navy {
  color: #063b32;
}

.leading-relaxed {
  line-height: 1.8;
}

/* TEAM */
.title-underline {
  width: 60px;
  height: 4px;
  background: #087f68;
  border-radius: 2px;
}

.team-card {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.team-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(8, 127, 104, 0.15);
  border-color: rgba(8, 127, 104, 0.3);
}

.avatar-wrapper {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  padding: 6px;
  background: linear-gradient(135deg, #087f68 0%, #34d399 100%);
  transition: transform 0.3s ease;
}

.team-card:hover .avatar-wrapper {
  transform: scale(1.05);
}

.team-avatar, .team-avatar-fallback {
  border-radius: 50%;
  border: 4px solid #fff;
}

.team-avatar-fallback {
  background: #063b32;
  color: #fff;
  font-size: 2.5rem;
  font-weight: 700;
}

.team-name {
  color: #063b32;
}

.team-role-badge {
  display: inline-block;
  background: #e6f7f2;
  color: #087f68;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

/* ANIMATIONS */
.animate-fade-in-up {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s forwards ease-out;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* SOCIAL ICONS */
.social-links {
  border-top: 1px solid rgba(8, 127, 104, 0.1);
  padding-top: 1rem;
}

.social-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f1f5f9;
  color: #063b32;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  text-decoration: none;
}

.social-icon:hover {
  background: #087f68;
  color: #fff;
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(8, 127, 104, 0.2);
}
</style>