<template>
  <div class="register-page">

    <!-- ==================== LEFT SHOWCASE ==================== -->
    <section class="register-showcase">
      <div class="showcase-overlay"></div>

      <div class="showcase-content">
        <div class="brand">
          <div class="brand-icon">
            <i class="bi bi-building"></i>
          </div>

          <span>StayNest</span>
        </div>

        <div class="showcase-text">
          <span class="eyebrow">YOUR NEXT STAY STARTS HERE</span>

          <h1>
            Stay somewhere
            <br />
            <span>you'll love.</span>
          </h1>

          <p>
            Discover beautiful hotels, comfortable rooms,
            and unforgettable stays with StayNest.
          </p>
        </div>

        <div class="showcase-footer">
          <div class="footer-item">
            <i class="bi bi-shield-check"></i>
            <span>Secure booking</span>
          </div>

          <div class="footer-item">
            <i class="bi bi-heart"></i>
            <span>Trusted stays</span>
          </div>

          <div class="footer-item">
            <i class="bi bi-headset"></i>
            <span>24/7 support</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== RIGHT PANEL ==================== -->
    <section class="register-panel">

      <!-- ==================== REGISTER FORM ==================== -->
      <div class="register-container">
        <div class="form-header">
          <div class="mobile-logo">
            <div class="brand-icon">
              <i class="bi bi-building"></i>
            </div>

            <span>StayNest</span>
          </div>

          <span class="form-eyebrow">GET STARTED</span>

          <h2>Create your account</h2>

          <p>
            Join StayNest and start discovering your perfect stay.
          </p>
        </div>

        <!-- Name + Phone -->
        <div class="two-columns">

          <div class="form-group">
            <label for="name">Full name</label>

            <div class="input-wrapper" :class="{ error: errors.name }">
              <i class="bi bi-person input-icon"></i>

              <input id="name" v-model="form.name" type="text" placeholder="Enter your name" autocomplete="name" />
            </div>

            <small v-if="errors.name" class="error-text">
              {{ errors.name }}
            </small>
          </div>

          <div class="form-group">
            <label for="phone">
              Phone
              <span class="optional">(optional)</span>
            </label>

            <div class="input-wrapper" :class="{ error: errors.phone }">
              <i class="bi bi-telephone input-icon"></i>

              <input id="phone" v-model="form.phone" type="tel" placeholder="012 345 678" autocomplete="tel" />
            </div>

            <small v-if="errors.phone" class="error-text">
              {{ errors.phone }}
            </small>
          </div>

        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="email">Email address</label>

          <div class="input-wrapper" :class="{ error: errors.email }">
            <i class="bi bi-envelope input-icon"></i>

            <input id="email" v-model="form.email" type="email" placeholder="you@example.com" autocomplete="email" />
          </div>

          <small v-if="errors.email" class="error-text">
            {{ errors.email }}
          </small>
        </div>

        <!-- Password -->
        <div class="form-group">
          <label for="password">Password</label>

          <div class="input-wrapper" :class="{ error: errors.password }">
            <i class="bi bi-lock input-icon"></i>

            <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'"
              placeholder="Create a password" autocomplete="new-password" />

            <button type="button" class="password-toggle" @click="showPassword = !showPassword">
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>

          <small v-if="errors.password" class="error-text">
            {{ errors.password }}
          </small>
        </div>

        <!-- Confirm Password -->
        <div class="form-group">
          <label for="confirmPassword">Confirm password</label>

          <div class="input-wrapper" :class="{ error: errors.confirmPassword }">
            <i class="bi bi-shield-lock input-icon"></i>

            <input id="confirmPassword" v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Repeat your password" autocomplete="new-password" />

            <button type="button" class="password-toggle" @click="showConfirmPassword = !showConfirmPassword">
              <i :class="showConfirmPassword
                ? 'bi bi-eye-slash'
                : 'bi bi-eye'
                "></i>
            </button>
          </div>

          <small v-if="errors.confirmPassword" class="error-text">
            {{ errors.confirmPassword }}
          </small>
        </div>

        <!-- General Error -->
        <div v-if="registerError" class="alert-error">
          <i class="bi bi-exclamation-circle"></i>
          <span>{{ registerError }}</span>
        </div>

        <!-- Register Button -->
        <button type="submit" class="submit-button" :disabled="isLoading" @click="handleRegister">
          <span v-if="!isLoading">
            Create Account
            <i class="bi bi-arrow-right"></i>
          </span>

          <span v-else class="loading-content">
            <span class="spinner"></span>
            Creating account...
          </span>
        </button>

        <!-- Login -->
        <div class="login-link">
          Already have an account?
          <router-link to="/login">
            Sign in
          </router-link>
        </div>
      </div>

    </section>

    <!-- ==================== CONFIRM EMAIL MODAL ==================== -->
    <Teleport to="body">
      <div v-if="showConfirmModal" class="modal-overlay" @click.self="closeConfirmModal">
        <div class="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirmModalTitle">

          <div class="confirm-icon">
            <i class="bi bi-envelope-check"></i>
          </div>

          <h3 id="confirmModalTitle">Confirm your email</h3>

          <p>
            Please confirm this is the email you want to use for your
            StayNest account:
          </p>

          <div class="confirm-email-box">
            {{ form.email }}
          </div>

          <div class="confirm-modal-actions">
            <button type="button" class="modal-btn modal-btn-cancel" @click="closeConfirmModal">
              Cancel
            </button>

            <button type="button" class="my-auto modal-btn modal-btn-confirm" @click="confirmRegister">
              Confirm
            </button>
          </div>

        </div>
      </div>
    </Teleport>

  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

const router = useRouter()

const isLoading = ref(false)
const registerError = ref('')

const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Confirm email modal
const showConfirmModal = ref(false)

const Isvalidate = ref(true)

const auth = useAuthStore()

const form = ref({
  name: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'customer'
})

const errors = ref({
  name: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: ''
})


const validated = () => {

  Isvalidate.value = true

  errors.value = {
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/


  if (!form.value.name) {
    errors.value.name = 'Name is required'
    Isvalidate.value = false
  }


  if (!form.value.email) {

    errors.value.email = 'Email is required'
    Isvalidate.value = false

  } else if (!emailRegex.test(form.value.email)) {

    errors.value.email = 'Email is invalid'
    Isvalidate.value = false

  }


  if (!form.value.password) {

    errors.value.password = 'Password is required'
    Isvalidate.value = false

  } else if (form.value.password.length < 8) {

    errors.value.password = 'Password must be at least 8 characters'
    Isvalidate.value = false

  }


  if (!form.value.confirmPassword) {

    errors.value.confirmPassword =
      'Confirm password is required'

    Isvalidate.value = false

  } else if (
    form.value.confirmPassword !== form.value.password
  ) {

    errors.value.confirmPassword =
      'Confirm password does not match'

    Isvalidate.value = false
  }


  return Isvalidate.value
}


// Step 1: Validate and show modal
const handleRegister = () => {

  if (!validated()) return

  showConfirmModal.value = true
}


// Step 2: Close modal
const closeConfirmModal = () => {

  showConfirmModal.value = false
}


// Step 3: Confirm and call API
const confirmRegister = async () => {

  try {

    isLoading.value = true

    await auth.register(
      form.value.name,
      form.value.phone,
      form.value.email,
      form.value.password,
      form.value.confirmPassword
    )

    showConfirmModal.value = false

    // Open Gmail after successful register
    window.location.assign('https://mail.google.com/mail/u/0/#inbox');

  } catch (error) {

    registerError.value =
      error.response?.data?.message ||
      error.message ||
      'Register failed'

  } finally {

    isLoading.value = false

  }
}
</script>

<style scoped>
.register-page {
  width: 100%;
  height: 100vh;
  min-height: 650px;

  display: grid;
  grid-template-columns: 43% 57%;

  overflow: hidden;

  background: white;
  color: var(--ink);

  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

/* =====================================================
   LEFT SHOWCASE
===================================================== */

.register-showcase {
  position: relative;

  height: 100vh;
  overflow: hidden;

  background:
    linear-gradient(135deg,
      rgba(6, 59, 50, 0.95),
      rgba(8, 127, 104, 0.72)),
    url("https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85") center / cover no-repeat;
}

.showcase-overlay {
  position: absolute;
  inset: 0;

  background:
    linear-gradient(180deg,
      rgba(6, 59, 50, 0.35) 0%,
      rgba(6, 59, 50, 0.15) 40%,
      rgba(6, 59, 50, 0.88) 100%);
}

.showcase-content {
  position: relative;
  z-index: 2;

  height: 100%;

  display: flex;
  flex-direction: column;

  padding: 48px 52px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;

  color: white;

  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.brand-icon {
  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 11px;

  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.25);

  backdrop-filter: blur(10px);

  color: white;
  font-size: 19px;
}

.showcase-text {
  margin-top: auto;
  margin-bottom: auto;

  max-width: 520px;
}

.eyebrow,
.form-eyebrow {
  display: inline-block;

  margin-bottom: 15px;

  font-size: 11px;
  font-weight: 800;

  letter-spacing: 1.8px;
}

.showcase-text .eyebrow {
  color: rgba(255, 255, 255, 0.75);
}

.showcase-text h1 {
  margin: 0;

  color: white;

  font-size: clamp(42px, 4vw, 64px);
  line-height: 1.05;

  font-weight: 800;
  letter-spacing: -2.5px;
}

.showcase-text h1 span {
  color: #9BE2CF;
}

.showcase-text p {
  max-width: 440px;

  margin-top: 24px;

  color: rgba(255, 255, 255, 0.78);

  font-size: 16px;
  line-height: 1.7;
}

.showcase-footer {
  display: flex;
  align-items: center;
  gap: 24px;

  color: rgba(255, 255, 255, 0.78);
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 12px;
}

.footer-item i {
  color: #9BE2CF;
  font-size: 15px;
}

/* =====================================================
   RIGHT PANEL
===================================================== */

.register-panel {
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 30px 55px;

  overflow-y: auto;
  overflow-x: hidden;

  background: white;

  scrollbar-width: none;
  -ms-overflow-style: none;
}

.register-panel::-webkit-scrollbar {
  display: none;
}

.register-container {
  width: 100%;
  max-width: 540px;
}

.form-header {
  margin-bottom: 25px;
}

.form-eyebrow {
  margin-bottom: 8px;

  color: var(--blue);
}

.form-header h2 {
  margin: 0;

  color: var(--ink);

  font-size: 30px;
  line-height: 1.15;

  font-weight: 800;
  letter-spacing: -0.8px;
}

.form-header p {
  margin: 9px 0 0;

  color: var(--muted);

  font-size: 14px;
  line-height: 1.6;
}

.mobile-logo {
  display: none;
}

/* =====================================================
   FORM
===================================================== */

.form-group {
  margin-bottom: 16px;
}

.form-group>label {
  display: block;

  margin-bottom: 7px;

  color: var(--ink);

  font-size: 12px;
  font-weight: 700;
}

.optional {
  color: #9AA5A0;
  font-weight: 500;
}

.two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.input-wrapper {
  position: relative;

  height: 48px;

  display: flex;
  align-items: center;

  border: 1px solid var(--line);
  border-radius: 10px;

  background: white;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.input-wrapper:focus-within {
  border-color: var(--blue);

  box-shadow:
    0 0 0 3px rgba(8, 127, 104, 0.09);
}

.input-wrapper.error {
  border-color: #D85D5D;
}

.input-icon {
  width: 44px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #8A9691;

  font-size: 15px;
}

.input-wrapper input {
  flex: 1;

  height: 100%;

  padding: 0 13px 0 0;

  border: 0;
  outline: 0;

  background: transparent;

  color: var(--ink);

  font-size: 13px;
}

.input-wrapper input::placeholder {
  color: #A8B1AD;
}

.password-toggle {
  width: 44px;
  height: 100%;

  border: 0;
  background: transparent;

  color: #899590;

  cursor: pointer;

  font-size: 15px;
}

.password-toggle:hover {
  color: var(--blue);
}

.error-text {
  display: block;

  margin-top: 5px;

  color: #D85D5D;

  font-size: 11px;
  line-height: 1.4;
}

/* =====================================================
   ROLE
===================================================== */

.role-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.role-card {
  position: relative;

  min-height: 72px;

  display: flex;
  align-items: center;

  padding: 12px;

  border: 1px solid var(--line);
  border-radius: 10px;

  background: white;

  text-align: left;

  cursor: pointer;

  transition: all 0.2s ease;
}

.role-card:hover {
  border-color: #BBDDD4;
  background: var(--bg-soft);
}

.role-card.selected {
  border-color: var(--blue);
  background: var(--blue-light);

  box-shadow:
    0 0 0 1px var(--blue);
}

.role-icon {
  width: 36px;
  height: 36px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 9px;

  background: #EDF4F1;

  color: var(--blue);

  font-size: 16px;
}

.role-card.selected .role-icon {
  background: white;
}

.role-info {
  min-width: 0;

  display: flex;
  flex-direction: column;

  margin-left: 9px;
}

.role-info strong {
  color: var(--ink);

  font-size: 12px;
  font-weight: 750;
}

.role-info span {
  margin-top: 3px;

  color: var(--muted);

  font-size: 9px;
  line-height: 1.3;
}

.role-check {
  width: 19px;
  height: 19px;

  flex-shrink: 0;

  margin-left: auto;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #CCD8D3;
  border-radius: 50%;

  color: white;
  font-size: 11px;
}

.role-card.selected .role-check {
  border-color: var(--blue);
  background: var(--blue);
}

/* =====================================================
   ERROR ALERT
===================================================== */

.alert-error {
  display: flex;
  align-items: center;
  gap: 9px;

  margin-bottom: 12px;
  padding: 11px 13px;

  border: 1px solid #F1D0D0;
  border-radius: 8px;

  background: #FFF6F6;

  color: #B74B4B;

  font-size: 11px;
}

.alert-error i {
  font-size: 14px;
}

/* =====================================================
   BUTTON
===================================================== */

.submit-button {
  width: 100%;
  height: 49px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 8px;

  border: 0;
  border-radius: 10px;

  background: var(--blue);

  color: white;

  font-size: 13px;
  font-weight: 750;

  cursor: pointer;

  transition:
    background 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.submit-button:hover:not(:disabled) {
  background: var(--navy);

  transform: translateY(-1px);

  box-shadow:
    0 7px 18px rgba(6, 59, 50, 0.16);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-content {
  display: flex;
  align-items: center;
  gap: 9px;
}

.spinner {
  width: 15px;
  height: 15px;

  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: white;

  border-radius: 50%;

  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.login-link {
  margin-top: 17px;

  color: var(--muted);

  font-size: 12px;

  text-align: center;
}

.login-link a {
  margin-left: 3px;

  color: var(--blue);

  font-weight: 750;

  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}

/* =====================================================
   CONFIRM EMAIL MODAL
===================================================== */

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(6, 59, 50, 0.45);
  backdrop-filter: blur(2px);
}

.confirm-modal {
  width: 100%;
  max-width: 380px;

  padding: 28px 26px 24px;

  border-radius: 14px;

  background: white;

  box-shadow: 0 20px 50px rgba(6, 59, 50, 0.25);

  text-align: center;
}

.confirm-icon {
  width: 52px;
  height: 52px;

  margin: 0 auto 16px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: var(--blue-light);

  color: var(--blue);

  font-size: 22px;
}

.confirm-modal h3 {
  margin: 0 0 8px;

  color: var(--ink);

  font-size: 18px;
  font-weight: 800;
}

.confirm-modal p {
  margin: 0 0 14px;

  color: var(--muted);

  font-size: 13px;
  line-height: 1.6;
}

.confirm-email-box {
  padding: 10px 14px;

  margin-bottom: 20px;

  border: 1px solid var(--line);
  border-radius: 8px;

  background: var(--bg-soft);

  color: var(--ink);

  font-size: 13px;
  font-weight: 700;

  word-break: break-all;
}

.confirm-modal-actions {
  display: flex;
  gap: 10px;
}

.modal-btn {
  flex: 1;
  height: 44px;

  border-radius: 9px;

  font-size: 13px;
  font-weight: 750;

  cursor: pointer;

  transition: background 0.2s ease, transform 0.2s ease;
}

.modal-btn-cancel {
  border: 1px solid var(--line);
  background: white;
  color: var(--ink);
}

.modal-btn-cancel:hover {
  background: var(--bg-soft);
}

.modal-btn-confirm {
  border: 0;
  background: var(--blue);
  color: white;
}

.modal-btn-confirm:hover {
  background: var(--navy);
  transform: translateY(-1px);
}

/* =====================================================
   RESPONSIVE
===================================================== */

@media (max-width: 1100px) {
  .register-page {
    grid-template-columns: 38% 62%;
  }

  .showcase-content {
    padding: 40px;
  }

  .register-panel {
    padding: 25px 40px;
  }

  .showcase-text h1 {
    font-size: 46px;
  }
}

@media (max-width: 850px) {
  .register-page {
    grid-template-columns: 1fr;
    min-height: 100vh;
    height: auto;
    overflow: visible;
  }

  .register-showcase {
    display: none;
  }

  .register-panel {
    min-height: 100vh;
    height: auto;

    align-items: flex-start;

    padding: 30px 24px 40px;

    overflow-y: visible;
  }

  .mobile-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;

    margin-bottom: 30px;

    color: var(--navy);

    font-size: 21px;
    font-weight: 800;
  }

  .mobile-logo .brand-icon {
    width: 36px;
    height: 36px;

    background: var(--blue-light);

    color: var(--blue);

    border: 0;

    font-size: 16px;
  }

  .register-container {
    max-width: 540px;
  }
}

@media (max-width: 600px) {
  .register-panel {
    padding: 25px 18px 35px;
  }

  .form-header h2 {
    font-size: 26px;
  }

  .two-columns {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .role-options {
    grid-template-columns: 1fr;
  }

  .role-card {
    min-height: 66px;
  }
}
</style>