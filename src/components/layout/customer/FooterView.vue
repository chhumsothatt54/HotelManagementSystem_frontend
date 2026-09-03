<template>
    <div>
        <footer>

            <div class="container">
                <div class="row g-4">

                    <div class="col-lg-4">
                        <div class="foot-brand mb-2">
                            AngkorStay
                        </div>

                        <p class="desc">
                            Independent stays across Cambodia —
                            from riverfront heritage hotels to
                            cliffside villas — booked directly.
                        </p>
                    </div>

                    <div class="col-6 col-lg-2">

                        <h6>Explore</h6>

                        <a href="#" v-for="d in destinations" :key="d.name">
                            {{ d.name }}
                        </a>

                    </div>

                    <div class="col-6 col-lg-2">

                        <h6>Company</h6>

                        <a href="#">Our Team</a>
                        <a href="#">Contact</a>

                    </div>
                    <div class="col-6 col-lg-2">

                        <h6>Account</h6>

                        <a href="#">My Bookings</a>
                        <a href="#">Wishlist</a>
                        <a href="#">Profile</a>
                        <a href="#">Notifications</a>
                    </div>

                    <div class="col-lg-2">

                        <h6>Get travel deals</h6>

                        <p class="desc mb-2">
                            One email a month, mostly discount codes.
                        </p>

                        <input type="email" class="form-control form-control-sm newsletter-input"
                            placeholder="you@example.com">

                        <button class="btn btn-primary-brand btn-sm mt-2">
                            Subscribe
                        </button>

                    </div>

                </div>

                <div class="footer-bottom d-flex flex-wrap justify-content-between">
                    <span>
                        © 2026 AngkorStay. Customer portal.
                    </span>

                    <span>
                        Phnom Penh · Siem Reap · Sihanoukville ·
                        Battambang · Kampot · Kep
                    </span>
                </div>

            </div>
        </footer>
    </div>

</template>

<script setup>
import { ref } from 'vue';
const destinations = ref([
  {
    name: 'Phnom Penh',
    count: 1,
    img: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=400&auto=format&fit=crop'
  },
  {
    name: 'Siem Reap',
    count: 1,
    img: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?q=80&w=400&auto=format&fit=crop'
  },
  {
    name: 'Sihanoukville',
    count: 1,
    img: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=400&auto=format&fit=crop'
  },
  {
    name: 'Battambang',
    count: 1,
    img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400&auto=format&fit=crop'
  },
  {
    name: 'Kampot',
    count: 1,
    img: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=400&auto=format&fit=crop'
  },
  {
    name: 'Kep',
    count: 1,
    img: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=400&auto=format&fit=crop'
  }
])
</script>
