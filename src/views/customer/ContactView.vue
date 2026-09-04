<template>
  <div>
    <!-- NAVBAR -->
    <NavbarView />

    <!-- HERO -->
    <section class="hero pb-0">
      <div class="eyebrow">GET IN TOUCH</div>

      <h1>We'd love to hear from you</h1>

      <p>
        Questions about a booking, becoming a host, or just want to say hi —
        our team in Phnom Penh is here to help.
      </p>
    </section>

    <!-- CONTACT CARD -->
    <div class="search-card contact-card">
      <div class="row g-0">

        <!-- LEFT: CONTACT INFO -->
        <div class="col-lg-5 contact-info">
          <h5 class="contact-info-title">Contact information</h5>
          <p class="contact-info-sub">
            Reach out any way that works for you — we typically reply
            within a few hours.
          </p>

          <div class="contact-item" v-for="c in contactMethods" :key="c.label">
            <div class="contact-icon">{{ c.icon }}</div>
            <div>
              <div class="contact-label">{{ c.label }}</div>
              <div class="contact-value">{{ c.value }}</div>
            </div>
          </div>

          <hr class="contact-divider">

          <div class="contact-label mb-2">Follow us</div>
          <div class="d-flex gap-2">
            <button class="icon-btn social-btn" v-for="s in socials" :key="s.name">
              {{ s.icon }}
            </button>
          </div>
        </div>

        <!-- RIGHT: FORM -->
        <div class="col-lg-7">
          <div class="contact-form">

            <div v-if="submitted" class="success-box">
              ✅ Thanks, {{ form.name.split(' ')[0] || 'there' }}! Your message has been sent.
              We'll get back to you soon.
            </div>

            <form v-else @submit.prevent="submitForm">
              <div class="row g-3">

                <div class="col-md-6 search-field">
                  <label>Full name</label>
                  <input type="text" class="form-control" v-model="form.name" placeholder="Sokha Chan" required>
                </div>

                <div class="col-md-6 search-field">
                  <label>Email</label>
                  <input type="email" class="form-control" v-model="form.email" placeholder="sokha@email.com" required>
                </div>

                <div class="col-md-6 search-field">
                  <label>Phone (optional)</label>
                  <input type="tel" class="form-control" v-model="form.phone" placeholder="+855 12 345 678">
                </div>

                <div class="col-md-6 search-field">
                  <label>Subject</label>
                  <select class="form-select" v-model="form.subject" required>
                    <option value="" disabled>Select a topic</option>
                    <option v-for="t in subjects" :key="t">{{ t }}</option>
                  </select>
                </div>

                <div class="col-12 search-field">
                  <label>Message</label>
                  <textarea
                    class="form-control"
                    rows="5"
                    v-model="form.message"
                    placeholder="Tell us how we can help..."
                    required
                  ></textarea>
                </div>

                <div class="col-12">
                  <button type="submit" class="btn btn-primary-brand w-100" :disabled="sending">
                    {{ sending ? 'Sending...' : 'Send Message' }}
                  </button>
                </div>

              </div>
            </form>

          </div>
        </div>

      </div>
    </div>

    <!-- OFFICES -->
    <section class="container">
      <h2 class="section-title">Our offices</h2>
      <p class="section-sub mb-4">
        Drop by if you're in the area — coffee's on us.
      </p>

      <div class="row g-4">
        <div class="col-sm-6 col-lg-4" v-for="o in offices" :key="o.city">
          <div class="office-card">
            <div class="feature-icon">📍</div>
            <h6>{{ o.city }}</h6>
            <p class="office-address">{{ o.address }}</p>
            <p class="office-hours">{{ o.hours }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="container pt-2">
      <h2 class="section-title">Frequently asked questions</h2>
      <p class="section-sub mb-4">
        Can't find what you're looking for? Send us a message above.
      </p>

      <div class="faq-item" v-for="(f, i) in faqs" :key="f.q">
        <button class="faq-question" @click="toggleFaq(i)">
          <span>{{ f.q }}</span>
          <span>{{ openFaq === i ? '−' : '+' }}</span>
        </button>
        <div class="faq-answer" v-show="openFaq === i">
          {{ f.a }}
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <FooterView />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import NavbarView from '@/components/layout/customer/NavbarView.vue'
import FooterView from '@/components/layout/customer/FooterView.vue'

const form = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const subjects = ref([
  'Booking question',
  'Cancellation / refund',
  'Become a host',
  'Partnership',
  'Other'
])

const sending = ref(false)
const submitted = ref(false)

function submitForm() {
  sending.value = true
  // Replace with a real API call, e.g. axios.post('/api/contact', { ...form })
  setTimeout(() => {
    sending.value = false
    submitted.value = true
    console.log('Contact form submitted:', { ...form })
  }, 900)
}

const contactMethods = ref([
  { icon: '✉️', label: 'Email', value: 'hello@angkorstay.com' },
  { icon: '📞', label: 'Phone', value: '+855 23 456 789' },
  { icon: '📍', label: 'Address', value: 'Street 240, Phnom Penh, Cambodia' },
  { icon: '🕐', label: 'Hours', value: 'Mon–Sat, 8:00 AM – 6:00 PM' }
])

const socials = ref([
  { name: 'Facebook', icon: '📘' },
  { name: 'Instagram', icon: '📸' },
  { name: 'Telegram', icon: '✈️' }
])

const offices = ref([
  {
    city: 'Phnom Penh (HQ)',
    address: 'Street 240, Daun Penh, Phnom Penh',
    hours: 'Mon–Sat, 8:00 AM – 6:00 PM'
  },
  {
    city: 'Siem Reap',
    address: 'Wat Bo Road, Siem Reap',
    hours: 'Mon–Sat, 9:00 AM – 5:00 PM'
  },
  {
    city: 'Sihanoukville',
    address: 'Ekareach Street, Sihanoukville',
    hours: 'Mon–Fri, 9:00 AM – 5:00 PM'
  }
])

const faqs = ref([
  {
    q: 'How do I cancel or change a booking?',
    a: 'Go to your Bookings page, select the reservation, and choose Cancel or Modify. Refund eligibility depends on the host\'s cancellation policy.'
  },
  {
    q: 'How do I list my property on AngkorStay?',
    a: 'Fill out the "Become a Host" form above or email us at hello@angkorstay.com — our team will guide you through verification and listing setup.'
  },
  {
    q: 'Is there a fee for booking through AngkorStay?',
    a: 'A small service fee is added at checkout, shown clearly before you confirm. There are no hidden charges.'
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept major credit/debit cards, ABA PayWay, and pay-at-hotel for select stays.'
  }
])

const openFaq = ref(null)
function toggleFaq(i) {
  openFaq.value = openFaq.value === i ? null : i
}
</script>

<style scoped>
.contact-card {
  padding: 0;
  overflow: hidden;
}

.contact-info {
  background: var(--navy);
  color: #fff;
  padding: 2.2rem 1.8rem;
}

.contact-info-title {
  font-family: 'Fraunces', serif;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.contact-info-sub {
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.88rem;
  margin-bottom: 1.8rem;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  margin-bottom: 1.2rem;
}

.contact-icon {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

.contact-label {
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.contact-value {
  font-size: 0.9rem;
  font-weight: 600;
}

.contact-divider {
  border-color: rgba(255, 255, 255, 0.15);
  margin: 1.4rem 0;
}

.social-btn {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.social-btn:hover {
  background: rgba(255, 255, 255, 0.22);
  color: #fff;
}

.contact-form {
  padding: 2.2rem 1.8rem;
}

.success-box {
  background: var(--blue-light);
  color: var(--navy);
  border-radius: 10px;
  padding: 1.2rem;
  font-weight: 500;
  text-align: center;
}

/* OFFICES */
.office-card {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: #fff;
  padding: 1.4rem;
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.office-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(6, 59, 50, 0.1);
}

.office-card h6 {
  font-weight: 700;
  color: var(--navy);
  margin: 0.4rem 0 0.3rem;
}

.office-address {
  font-size: 0.85rem;
  color: var(--muted);
  margin-bottom: 0.2rem;
}

.office-hours {
  font-size: 0.8rem;
  color: var(--muted);
  margin: 0;
}

/* FAQ */
.faq-item {
  border-bottom: 1px solid var(--line);
}

.faq-question {
  width: 100%;
  background: none;
  border: none;
  text-align: left;
  padding: 1.1rem 0;
  font-weight: 600;
  color: var(--navy);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
}

.faq-answer {
  padding: 0 0 1.1rem;
  color: var(--muted);
  font-size: 0.9rem;
  line-height: 1.5;
}

@media (max-width: 991px) {
  .contact-info {
    padding: 1.8rem;
  }
}
</style>