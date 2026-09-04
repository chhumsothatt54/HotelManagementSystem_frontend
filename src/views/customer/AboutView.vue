<template>
  <div>
    <!-- NAVBAR -->
    <NavbarView />

    <!-- HERO -->
    <section class="hero pb-0">
      <div class="eyebrow">OUR STORY</div>

      <h1>Built by travelers, for travelers</h1>

      <p>
        AngkorStay connects you directly with Cambodia's best independent
        hotels, homestays, and boutique retreats — no middlemen, no markups.
      </p>
    </section>

    <!-- STATS STRIP -->
    <div class="search-card stats-card">
      <div class="row g-3 text-center">
        <div class="col-6 col-md-3" v-for="stat in stats" :key="stat.label">
          <div class="stat-number">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>

    <!-- OUR STORY -->
    <section class="container">
      <div class="row g-5 align-items-center">
        <div class="col-lg-6">
          <img
            src="https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=900&auto=format&fit=crop"
            alt="Cambodia landscape"
            class="story-img"
          >
        </div>

        <div class="col-lg-6">
          <h2 class="section-title">Why we started AngkorStay</h2>

          <p class="section-sub mb-3">
            We noticed something: the most memorable stays in Cambodia were
            never the big chain hotels — they were the riverside guesthouses
            in Kampot, the family-run homestays in Battambang, and the
            boutique rooms tucked behind Siem Reap's temples.
          </p>

          <p class="section-sub mb-3">
            So in 2023, a small team of local hosts and travelers built a
            platform to put those places front and center — with fair
            pricing, direct booking, and zero hidden fees.
          </p>

          <p class="section-sub mb-0">
            Today, AngkorStay works with hosts across six provinces, helping
            them reach travelers while keeping more of what they earn.
          </p>
        </div>
      </div>
    </section>

    <!-- VALUES -->
    <section class="features-strip">
      <div class="container">
        <h2 class="section-title text-center">What we stand for</h2>
        <p class="section-sub text-center mb-5">
          The principles behind every stay we list.
        </p>

        <div class="row g-4">
          <div class="col-md-3 col-sm-6" v-for="v in values" :key="v.title">
            <div class="feature-item text-center text-md-start">
              <div class="feature-icon mx-auto mx-md-0">
                {{ v.icon }}
              </div>

              <h6>{{ v.title }}</h6>
              <p>{{ v.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TEAM -->
    <section class="container">
      <h2 class="section-title">Meet the team</h2>
      <p class="section-sub mb-4">
        A small group based in Phnom Penh, working with hosts nationwide.
      </p>

      <div class="row g-4">
        <div class="col-sm-6 col-lg-3" v-for="m in team" :key="m.name">
          <div class="team-card text-center">
            <div class="team-avatar mx-auto">
              {{ m.initials }}
            </div>

            <div class="team-name">{{ m.name }}</div>
            <div class="team-role">{{ m.role }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA / NEWSLETTER -->
    <section class="container">
      <div class="newsletter p-4 p-md-5 text-center">
        <h3 class="mb-2" style="color: #fff;">Have a place worth listing?</h3>

        <p class="mb-4" style="color: rgba(255,255,255,0.85);">
          Join AngkorStay as a host and start welcoming guests directly.
        </p>

        <div class="d-flex justify-content-center gap-2 flex-wrap">
          <input
            type="email"
            class="form-control newsletter-input"
            placeholder="you@email.com"
            style="max-width: 280px;"
          >
          <button class="btn btn-primary-brand" style="background:#fff; color:#087F68; border-color:#fff;">
            Become a Host
          </button>
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

const stats = ref([
  { value: '150+', label: 'Verified stays' },
  { value: '6', label: 'Provinces covered' },
  { value: '12k+', label: 'Happy guests' },
  { value: '4.7★', label: 'Average rating' }
])

const values = ref([
  {
    icon: '🤝',
    title: 'Direct booking',
    desc: 'No third-party markups — hosts keep more, guests pay less.'
  },
  {
    icon: '🏡',
    title: 'Local first',
    desc: 'We prioritize independent hosts and family-run stays.'
  },
  {
    icon: '🔒',
    title: 'Trust & safety',
    desc: 'Every listing is verified before it goes live.'
  },
  {
    icon: '🌱',
    title: 'Sustainable travel',
    desc: 'Supporting communities across Cambodia\'s provinces.'
  }
])

const team = ref([
  { name: 'Sokha Chan', role: 'Co-Founder & CEO', initials: 'SC' },
  { name: 'Dara Pich', role: 'Co-Founder & Product', initials: 'DP' },
  { name: 'Lina Sok', role: 'Head of Host Relations', initials: 'LS' },
  { name: 'Vuthy Meng', role: 'Engineering Lead', initials: 'VM' }
])
</script>

<style scoped>
.stats-card {
  padding: 1.6rem;
}

.stat-number {
  font-family: 'Fraunces', serif;
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--navy);
}

.stat-label {
  font-size: 0.82rem;
  color: var(--muted);
  margin-top: 0.2rem;
}

.story-img {
  width: 100%;
  height: 100%;
  min-height: 320px;
  object-fit: cover;
  border-radius: var(--radius);
}

.team-card {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: #fff;
  padding: 1.6rem 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.team-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(6, 59, 50, 0.1);
}

.team-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--blue);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 0.8rem;
}

.team-name {
  font-weight: 700;
  color: var(--navy);
  font-size: 0.95rem;
}

.team-role {
  font-size: 0.8rem;
  color: var(--muted);
}

@media (max-width: 767px) {
  .story-img {
    min-height: 220px;
  }
}
</style>