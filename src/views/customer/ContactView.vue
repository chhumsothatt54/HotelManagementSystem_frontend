<template>
  <div>
    <!-- NAVBAR -->
    <NavbarView />

    <!-- HERO -->
    <section class="contact-hero">
      <div class="container text-center">
        <div class="eyebrow-premium">GET IN TOUCH</div>
        <h1 class="hero-title">We'd love to hear from you</h1>
        <p class="hero-subtitle mx-auto">
          Questions about a booking, becoming a host, or just want to say hi —
          our team in Phnom Penh is here to help.
        </p>
      </div>
    </section>

    <!-- CONTACT CARD -->
    <div class="container contact-container">
      <div class="contact-card-premium">
        <div class="row g-0 h-100">

          <!-- LEFT: CONTACT INFO -->
          <div class="col-lg-5 contact-info-premium p-5 d-flex flex-column justify-content-between">
            <div>
              <h3 class="info-title">Contact Information</h3>
              <p class="info-sub">
                Reach out any way that works for you — we typically reply within a few hours.
              </p>

              <div class="contact-methods mt-5">
                <div class="method-item" v-for="c in contactMethods" :key="c.label">
                  <div class="method-icon">
                    <i :class="c.iconClass"></i>
                  </div>
                  <div>
                    <div class="method-label">{{ c.label }}</div>
                    <div class="method-value">{{ c.value }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="social-links mt-5 pt-4 border-top-premium">
              <div class="method-label mb-3">Follow Us</div>
              <div class="d-flex gap-3">
                <a href="#" class="social-btn" v-for="s in socials" :key="s.name">
                  <i :class="s.iconClass"></i>
                </a>
              </div>
            </div>
          </div>

          <!-- RIGHT: FORM -->
          <div class="col-lg-7 p-5 bg-white">
            <div class="contact-form-wrapper">
              
              <div v-if="submitted" class="success-state text-center py-5">
                <div class="success-icon mb-4"><i class="bi bi-check-circle-fill"></i></div>
                <h3 class="success-title">Message Sent!</h3>
                <p class="text-muted">
                  Thanks, {{ form.name.split(' ')[0] || 'there' }}! We've received your message and will get back to you shortly.
                </p>
                <button class="btn btn-outline-premium mt-4" @click="resetForm">Send another message</button>
              </div>

              <form v-else @submit.prevent="submitForm" class="contact-form">
                <h4 class="form-title mb-4">Send us a message</h4>
                <div class="row g-4">
                  <div class="col-md-6 form-group-premium">
                    <label>Full Name</label>
                    <input type="text" class="form-control" v-model="form.name" placeholder="e.g. Sokha Chan" required>
                  </div>

                  <div class="col-md-6 form-group-premium">
                    <label>Email Address</label>
                    <input type="email" class="form-control" v-model="form.email" placeholder="e.g. sokha@email.com" required>
                  </div>

                  <div class="col-md-6 form-group-premium">
                    <label>Phone Number <span class="text-muted fw-normal">(Optional)</span></label>
                    <input type="tel" class="form-control" v-model="form.phone" placeholder="+855 12 345 678">
                  </div>

                  <div class="col-md-6 form-group-premium">
                    <label>Subject</label>
                    <select class="form-select" v-model="form.subject" required>
                      <option value="" disabled>Select a topic...</option>
                      <option v-for="t in subjects" :key="t">{{ t }}</option>
                    </select>
                  </div>

                  <div class="col-12 form-group-premium">
                    <label>Message</label>
                    <textarea
                      class="form-control"
                      rows="5"
                      v-model="form.message"
                      placeholder="Tell us how we can help..."
                      required
                    ></textarea>
                  </div>

                  <div class="col-12 mt-4">
                    <button type="submit" class="btn btn-save-premium w-100 py-3" :disabled="sending">
                      <span v-if="sending">
                        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Sending...
                      </span>
                      <span v-else>Send Message</span>
                    </button>
                  </div>
                </div>
              </form>

            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- OFFICES -->
    <section class="offices-section py-5 bg-light-premium">
      <div class="container py-4">
        <div class="text-center mb-5">
          <h2 class="section-title-premium">Our Offices</h2>
          <p class="section-subtitle">Drop by if you're in the area — coffee's on us.</p>
        </div>

        <div class="row g-4 justify-content-center">
          <div class="col-md-6 col-lg-4" v-for="o in offices" :key="o.city">
            <div class="office-card-premium h-100">
              <div class="office-icon mb-3"><i class="bi bi-geo-alt-fill"></i></div>
              <h5 class="office-city">{{ o.city }}</h5>
              <p class="office-address mb-2">{{ o.address }}</p>
              <p class="office-hours"><i class="bi bi-clock me-2"></i>{{ o.hours }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="faq-section container py-5 my-4">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="text-center mb-5">
            <h2 class="section-title-premium">Frequently Asked Questions</h2>
            <p class="section-subtitle">Can't find what you're looking for? Send us a message above.</p>
          </div>

          <div class="accordion custom-accordion" id="faqAccordion">
            <div class="accordion-item" v-for="(f, i) in faqs" :key="i">
              <h2 class="accordion-header" :id="'heading' + i">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse' + i" aria-expanded="false" :aria-controls="'collapse' + i">
                  {{ f.q }}
                </button>
              </h2>
              <div :id="'collapse' + i" class="accordion-collapse collapse" :aria-labelledby="'heading' + i" data-bs-parent="#faqAccordion">
                <div class="accordion-body">
                  {{ f.a }}
                </div>
              </div>
            </div>
          </div>
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
  // Mock API call
  setTimeout(() => {
    sending.value = false
    submitted.value = true
    console.log('Contact form submitted:', { ...form })
  }, 1200)
}

function resetForm() {
  form.name = ''
  form.email = ''
  form.phone = ''
  form.subject = ''
  form.message = ''
  submitted.value = false
}

const contactMethods = ref([
  { iconClass: 'bi bi-envelope-fill', label: 'Email', value: 'hello@staynest.com' },
  { iconClass: 'bi bi-telephone-fill', label: 'Phone', value: '+855 23 456 789' },
  { iconClass: 'bi bi-geo-alt-fill', label: 'Address', value: 'Street 240, Phnom Penh, Cambodia' },
  { iconClass: 'bi bi-clock-fill', label: 'Hours', value: 'Mon–Sat, 8:00 AM – 6:00 PM' }
])

const socials = ref([
  { name: 'Facebook', iconClass: 'bi bi-facebook' },
  { name: 'Instagram', iconClass: 'bi bi-instagram' },
  { name: 'Telegram', iconClass: 'bi bi-telegram' }
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
    a: 'Go to your Bookings page in your profile, select the reservation, and choose Cancel or Modify. Refund eligibility depends on the host\'s cancellation policy.'
  },
  {
    q: 'How do I list my property on StayNest?',
    a: 'Simply register an account and apply to become a Hotel Manager, or email us at hello@staynest.com — our team will guide you through verification and listing setup.'
  },
  {
    q: 'Is there a fee for booking through StayNest?',
    a: 'A small service fee is added at checkout, shown clearly before you confirm. There are no hidden charges.'
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept major credit/debit cards, ABA PayWay, and pay-at-hotel options for select properties.'
  }
])
</script>

<style scoped>
/* NAVBAR FIX */
:deep(nav),
:deep(.navbar),
:deep(header) {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  z-index: 1050 !important;
  background-color: #ffffff !important;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05) !important;
}

/* HERO SECTION */
.contact-hero {
  background: linear-gradient(135deg, rgba(6, 59, 50, 0.85) 0%, rgba(8, 127, 104, 0.75) 100%), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000&auto=format&fit=crop') center/cover no-repeat;
  color: #fff;
  padding: 10rem 0 8rem;
  margin-top: 0;
  position: relative;
  overflow: hidden;
}

.contact-hero::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('https://www.transparenttextures.com/patterns/cubes.png');
  opacity: 0.1;
  pointer-events: none;
}

.eyebrow-premium {
  color: #E8F6F2;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.hero-title {
  font-family: 'Fraunces', 'Playfair Display', serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: #E8F6F2;
  max-width: 600px;
  line-height: 1.6;
}

/* CONTACT CARD */
.contact-container {
  margin-top: -5rem;
  position: relative;
  z-index: 10;
  margin-bottom: 3rem;
}

.contact-card-premium {
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(6, 59, 50, 0.15);
}

/* LEFT PANEL */
.contact-info-premium {
  background: #063B32;
  color: #fff;
  position: relative;
  overflow: hidden;
}

.contact-info-premium::before {
  content: '';
  position: absolute;
  bottom: -50px;
  right: -50px;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: rgba(8, 127, 104, 0.2);
  filter: blur(40px);
}

.info-title {
  font-family: 'Fraunces', 'Playfair Display', serif;
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.info-sub {
  color: #E1E9E5;
  font-size: 0.95rem;
  line-height: 1.6;
}

.method-item {
  display: flex;
  align-items: flex-start;
  gap: 1.2rem;
  margin-bottom: 1.5rem;
}

.method-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: #E8F6F2;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.method-item:hover .method-icon {
  background: #087F68;
  transform: translateY(-2px);
}

.method-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.2rem;
}

.method-value {
  font-size: 1rem;
  font-weight: 500;
  color: #fff;
}

.border-top-premium {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.social-btn {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-btn:hover {
  background: #fff;
  color: #063B32;
  transform: translateY(-3px);
}

/* RIGHT PANEL (FORM) */
.form-title {
  font-family: 'Fraunces', 'Playfair Display', serif;
  color: #063B32;
  font-size: 1.6rem;
  font-weight: 700;
}

.form-group-premium label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #063B32;
  margin-bottom: 0.5rem;
}

.form-group-premium .form-control,
.form-group-premium .form-select {
  border: 1px solid #E1E9E5;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  color: #212529;
  background: #FAFAFA;
  transition: all 0.2s ease;
}

.form-group-premium .form-control:focus,
.form-group-premium .form-select:focus {
  border-color: #087F68;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(8, 127, 104, 0.1);
}

.btn-save-premium {
  background: #087F68;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.btn-save-premium:hover:not(:disabled) {
  background: #063B32;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(8, 127, 104, 0.2);
}

.btn-save-premium:disabled {
  background: #E1E9E5;
  color: #6B7772;
  cursor: not-allowed;
}

/* SUCCESS STATE */
.success-icon {
  font-size: 4rem;
  color: #087F68;
}
.success-title {
  font-family: 'Fraunces', 'Playfair Display', serif;
  color: #063B32;
  margin-bottom: 1rem;
}
.btn-outline-premium {
  border: 1px solid #087F68;
  color: #087F68;
  background: transparent;
  font-weight: 600;
  border-radius: 8px;
  padding: 0.6rem 1.5rem;
  transition: all 0.3s ease;
}
.btn-outline-premium:hover {
  background: #087F68;
  color: #fff;
}

/* OFFICES SECTION */
.bg-light-premium {
  background: #F8FBF9;
}

.section-title-premium {
  font-family: 'Fraunces', 'Playfair Display', serif;
  color: #063B32;
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  color: #6B7772;
  font-size: 1.05rem;
}

.office-card-premium {
  background: #fff;
  border: 1px solid #E1E9E5;
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s ease;
}

.office-card-premium:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(6, 59, 50, 0.08);
  border-color: #087F68;
}

.office-icon {
  font-size: 2rem;
  color: #087F68;
}

.office-city {
  color: #063B32;
  font-weight: 700;
  font-size: 1.25rem;
}

.office-address {
  color: #6B7772;
  font-size: 0.95rem;
}

.office-hours {
  color: #087F68;
  font-size: 0.9rem;
  font-weight: 500;
}

/* FAQ ACCORDION */
.custom-accordion .accordion-item {
  border: 1px solid #E1E9E5;
  border-radius: 12px;
  margin-bottom: 1rem;
  overflow: hidden;
  background: #fff;
}

.custom-accordion .accordion-button {
  font-weight: 600;
  color: #063B32;
  padding: 1.25rem 1.5rem;
  background: #fff;
  box-shadow: none;
}

.custom-accordion .accordion-button:not(.collapsed) {
  color: #087F68;
  background: #F8FBF9;
  border-bottom: 1px solid #E1E9E5;
}

.custom-accordion .accordion-button:focus {
  box-shadow: none;
  border-color: rgba(8, 127, 104, 0.2);
}

.custom-accordion .accordion-body {
  padding: 1.5rem;
  color: #6B7772;
  line-height: 1.6;
}

@media (max-width: 991px) {
  .contact-info-premium, .contact-form-wrapper {
    padding: 2.5rem !important;
  }
}
</style>