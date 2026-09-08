<template>
  <div>
    <!-- NAVBAR -->
    <NavbarView />

    <!-- HERO -->
    <section class="hero about-hero">
      <div class="container">
        <div class="eyebrow">ABOUT US</div>
        <h1>About AngkorStay</h1>
        <p>Get to know the team behind AngkorStay.</p>
      </div>
    </section>

    <section class="container py-5">

      <!-- COMPANY INFO -->
      <div class="about-card mb-5">
        <h3 class="about-card-title">AngkorStay</h3>
        <p class="about-card-text">
          AngkorStay is a hotel booking platform that connects travelers with hotels
          and homestays across Cambodia. We make it simple to search, compare, and
          book a stay — from riverside boutique hotels to seaside resorts — all in
          one place.
        </p>
      </div>

      <!-- TEAM -->
      <h4 class="team-heading">Our Team</h4>

      <div class="row g-4">
        <div class="col-md-4" v-for="member in team" :key="member.name">
          <div class="team-card">
            <div class="team-avatar">{{ member.initials }}</div>
            <div class="team-name">{{ member.name }}</div>
            <span class="team-role-badge">{{ member.role }}</span>
          </div>
        </div>
      </div>

    </section>

    <!-- FOOTER -->
    <FooterView />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import NavbarView from '@/components/layout/customer/NavbarView.vue'
import FooterView from '@/components/layout/customer/FooterView.vue'

const team = ref([
  { name: 'Sokha Manager', role: 'Team Leader', initials: 'S' },
  { name: 'Dara Chan', role: 'Team Member', initials: 'D' },
  { name: 'Chenda Pov', role: 'Team Member', initials: 'C' }
])
</script>

<style scoped>
.about-hero {
  padding-bottom: 0;
}

.about-card {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: #fff;
  padding: 1.6rem;
}

.about-card-title {
  color: var(--navy);
  font-weight: 800;
  margin-bottom: 0.6rem;
}

.about-card-text {
  color: var(--muted);
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
}

.team-heading {
  color: var(--navy);
  font-weight: 700;
  margin-bottom: 1.2rem;
}

.team-card {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: #fff;
  padding: 2rem 1rem;
  text-align: center;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.team-card:hover {
  box-shadow: 0 10px 24px rgba(6, 59, 50, 0.08);
  transform: translateY(-2px);
}

.team-avatar {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: var(--blue);
  color: #fff;
  font-size: 1.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.team-name {
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 0.6rem;
}

.team-role-badge {
  display: inline-block;
  border: 1px solid var(--blue);
  color: var(--blue);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.8rem;
  border-radius: 999px;
}
</style>