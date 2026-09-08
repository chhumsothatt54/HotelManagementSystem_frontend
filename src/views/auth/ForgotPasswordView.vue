<template>
  <div class="forgot-page">

    <!-- LEFT -->
    <section class="showcase">
      <div class="overlay"></div>
      <div class="showcase-content">
        <router-link to="/login" class="brand">
          <div class="brand-icon">
            <i class="bi bi-building"></i>
          </div>
          <span>StayNest</span>
        </router-link>
        <div class="showcase-center">
          <span>NEED HELP?</span>

          <h1>
            Get back to
            <br />
            <strong>your account.</strong>
          </h1>

          <p>
            Don't worry. Enter your email and we'll
            send you a verification code to reset your password.
          </p>
        </div>

      </div>
    </section>

    <!-- RIGHT -->
    <section class="panel">

      <div class="container">

        <div class="mobile-logo">
          <div class="brand-icon">
            <i class="bi bi-building"></i>
          </div>

          <span>StayNest</span>
        </div>

        <router-link to="/login" class="back-link">
          <i class="bi bi-arrow-left"></i>
          Back to login
        </router-link>

        <div class="icon">
          <i class="bi bi-lock"></i>
        </div>

        <div class="header">
          <span>RESET PASSWORD</span>

          <h2>Forgot your password?</h2>

          <p>
            Enter the email address associated with your
            account and we'll send you a 6-digit OTP.
          </p>
        </div>

        <div v-if="error" class="error-alert">
          <i class="bi bi-exclamation-circle"></i>
          {{ error }}
        </div>

        <div class="form-group">
          <label>Email address</label>

          <div class="input-wrapper" :class="{ error: emailError }">
            <i class="bi bi-envelope input-icon"></i>

            <input v-model="email" type="email" placeholder="you@example.com" @keyup.enter="sendOtp" />
          </div>

          <small v-if="emailError">
            {{ emailError }}
          </small>
        </div>

        <button class="submit-button" :disabled="loading" @click="forgotPassword">
          <span v-if="!loading">
            Send OTP
            <i class="bi bi-arrow-right"></i>
          </span>

          <span v-else class="loading">
            <span class="spinner"></span>
            Sending OTP...
          </span>
        </button>

        <div class="bottom-link">
          Remember your password?

          <router-link to="/login">
            Sign in
          </router-link>
        </div>
      </div>

    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const emailError = ref('')
const error = ref('')
const loading = ref(false)

function validate() {
  emailError.value = ''

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const trimmedEmail = email.value.trim()

  if (!trimmedEmail) {
    emailError.value = 'Email is required'
    return false
  }

  if (!emailRegex.test(trimmedEmail)) {
    emailError.value = 'Please enter a valid email address'
    return false
  }

  return true
}

async function forgotPassword() {
  error.value = ''

  if (!validate()) return

  loading.value = true

  try {
    const cleanedEmail = email.value.trim()
    await auth.forgotPassword(cleanedEmail)
    sessionStorage.setItem('staynest_otp_email', cleanedEmail)
    sessionStorage.setItem('staynest_otp_flow', 'forgot-password');
    await router.push({
      name: 'input-otp',
      query: { email: cleanedEmail }
    })
  } catch (err) {
    console.error('Forgot Password Error:', err)
    error.value = err.response?.data?.message || err.message || 'Failed to send OTP.'
  } finally {
    loading.value = false
  }
}

const sendOtp = forgotPassword
</script>

<style scoped>
.forgot-page {
  width: 100%;
  height: 100vh;

  display: grid;
  grid-template-columns: 43% 57%;

  overflow: hidden;

  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

.showcase {
  position: relative;

  height: 100vh;

  background:
    linear-gradient(135deg,
      rgba(6, 59, 50, .95),
      rgba(8, 127, 104, .72)),
    url("https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=85") center/cover;
}

.overlay {
  position: absolute;
  inset: 0;

  background:
    linear-gradient(180deg,
      rgba(6, 59, 50, .25),
      rgba(6, 59, 50, .9));
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

  text-decoration: none;
}

.brand-icon {
  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 11px;

  background: rgba(255, 255, 255, .16);

  color: white;
}

.showcase-center {
  margin: auto 0;

  max-width: 500px;
}

.showcase-center>span {
  color: rgba(255, 255, 255, .7);

  font-size: 11px;
  font-weight: 800;

  letter-spacing: 1.8px;
}

.showcase-center h1 {
  margin: 15px 0;

  color: white;

  font-size: 58px;
  line-height: 1.05;

  letter-spacing: -2.5px;
}

.showcase-center strong {
  color: #9BE2CF;
}

.showcase-center p {
  max-width: 440px;

  color: rgba(255, 255, 255, .78);

  font-size: 15px;
  line-height: 1.7;
}

.panel {
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 30px 55px;

  overflow: auto;

  scrollbar-width: none;
}

.panel::-webkit-scrollbar {
  display: none;
}

.container {
  width: 100%;
  max-width: 450px;
}

.mobile-logo {
  display: none;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  margin-bottom: 28px;

  color: var(--muted);

  font-size: 12px;
  font-weight: 650;

  text-decoration: none;
}

.back-link:hover {
  color: var(--blue);
}

.icon {
  width: 65px;
  height: 65px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 20px;

  border-radius: 18px;

  background: var(--blue-light);

  color: var(--blue);

  font-size: 26px;
}

.header>span {
  color: var(--blue);

  font-size: 11px;
  font-weight: 800;

  letter-spacing: 1.7px;
}

.header h2 {
  margin: 8px 0;

  color: var(--ink);

  font-size: 30px;
  font-weight: 800;

  letter-spacing: -.8px;
}

.header p {
  margin-bottom: 28px;

  color: var(--muted);

  font-size: 14px;
  line-height: 1.6;
}

.form-group label {
  display: block;

  margin-bottom: 7px;

  color: var(--ink);

  font-size: 12px;
  font-weight: 700;
}

.input-wrapper {
  height: 49px;

  display: flex;
  align-items: center;

  border: 1px solid var(--line);
  border-radius: 10px;
}

.input-wrapper:focus-within {
  border-color: var(--blue);

  box-shadow:
    0 0 0 3px rgba(8, 127, 104, .09);
}

.input-wrapper.error {
  border-color: #D85D5D;
}

.input-icon {
  width: 45px;

  text-align: center;

  color: #8A9691;
}

.input-wrapper input {
  flex: 1;

  height: 100%;

  border: 0;
  outline: 0;

  color: var(--ink);

  font-size: 13px;
}

.form-group small {
  display: block;

  margin-top: 5px;

  color: #D85D5D;

  font-size: 11px;
}

.error-alert {
  display: flex;
  gap: 8px;
  align-items: center;

  margin-bottom: 15px;
  padding: 11px;

  border-radius: 8px;

  background: #FFF6F6;

  color: #B74B4B;

  font-size: 11px;
}

.submit-button {
  width: 100%;
  height: 49px;

  margin-top: 20px;

  border: 0;
  border-radius: 10px;

  background: var(--blue);

  color: white;

  font-size: 13px;
  font-weight: 750;

  cursor: pointer;
}

.submit-button:hover:not(:disabled) {
  background: var(--navy);
}

.submit-button:disabled {
  opacity: .6;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.spinner {
  width: 15px;
  height: 15px;

  border: 2px solid rgba(255, 255, 255, .4);
  border-top-color: white;

  border-radius: 50%;

  animation: spin .7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.bottom-link {
  margin-top: 18px;

  color: var(--muted);

  font-size: 12px;

  text-align: center;
}

.bottom-link a {
  color: var(--blue);

  font-weight: 750;

  text-decoration: none;
}

.test-info {
  display: flex;
  justify-content: center;
  gap: 7px;

  margin-top: 25px;
  padding: 10px;

  border-radius: 8px;

  background: var(--bg-soft);

  color: var(--muted);

  font-size: 10px;
}

.test-info i {
  color: var(--blue);
}

.test-info strong {
  color: var(--blue);
}

@media(max-width:850px) {
  .forgot-page {
    grid-template-columns: 1fr;

    height: auto;
    min-height: 100vh;
  }

  .showcase {
    display: none;
  }

  .panel {
    min-height: 100vh;
    height: auto;

    align-items: flex-start;

    padding: 30px 20px 40px;
  }

  .mobile-logo {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 9px;

    margin-bottom: 35px;

    color: var(--navy);

    font-size: 21px;
    font-weight: 800;
  }

  .mobile-logo .brand-icon {
    width: 36px;
    height: 36px;

    background: var(--blue-light);

    color: var(--blue);
  }
}
</style>