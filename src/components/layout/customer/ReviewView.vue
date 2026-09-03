<template>
  <div>
    <section class="container">

      <h2 class="section-title text-center">
        What guests are saying
      </h2>

      <div class="row g-4 mt-2">

        <div class="col-md-4" v-for="r in reviews" :key="r.name">
          <div class="review-card">

            <div class="review-stars">
              ★★★★★
            </div>

            <p class="review-text">
              {{ r.text }}
            </p>

            <div class="d-flex align-items-center gap-2">
              <div class="review-avatar">
                {{ r.name[0] }}
              </div>

              <div>
                <div class="review-name">
                  {{ r.name }}
                </div>

                <div class="review-loc">
                  {{ r.location }}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  </div>

</template>

<script setup>
import { ref, computed } from 'vue'
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