<template>
  <div class="reset-page">

    <!-- LEFT -->
    <section class="showcase">
      <div class="overlay"></div>

      <div class="showcase-content">

        <router-link
          to="/login"
          class="brand"
        >
          <div class="brand-icon">
            <i class="bi bi-building"></i>
          </div>

          <span>StayNest</span>
        </router-link>

        <div class="showcase-center">

          <span>
            ALMOST THERE
          </span>

          <h1>
            Create a new
            <br />
            <strong>password.</strong>
          </h1>

          <p>
            Choose a strong password to keep
            your StayNest account secure.
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

        <div class="icon">
          <i class="bi bi-shield-lock"></i>
        </div>

        <div class="header">

          <span>
            RESET PASSWORD
          </span>

          <h2>
            Set a new password
          </h2>

          <p>
            Create a new password for
            <strong>{{ email }}</strong>
          </p>

        </div>

        <!-- ERROR -->
        <div
          v-if="error"
          class="error-alert"
        >
          <i class="bi bi-exclamation-circle"></i>
          {{ error }}
        </div>

        <!-- PASSWORD -->
        <div class="form-group">

          <label>
            New password
          </label>

          <div class="input-wrapper">

            <i class="bi bi-lock input-icon"></i>

            <input
              v-model="password"
              :type="
                showPassword
                  ? 'text'
                  : 'password'
              "
              placeholder="Enter new password"
            />

            <button
              type="button"
              class="toggle"
              @click="
                showPassword =
                  !showPassword
              "
            >
              <i
                :class="
                  showPassword
                    ? 'bi bi-eye-slash'
                    : 'bi bi-eye'
                "
              ></i>
            </button>

          </div>

          <div
            v-if="password"
            class="strength"
          >
            <span
              v-for="i in 4"
              :key="i"
              :class="{
                active:
                  strength >= i
              }"
            ></span>

            <small>
              {{ strengthText }}
            </small>
          </div>

        </div>

        <!-- CONFIRM -->
        <div class="form-group">

          <label>
            Confirm new password
          </label>

          <div
            class="input-wrapper"
            :class="{
              error:
                confirmError
            }"
          >

            <i
              class="bi bi-shield-lock input-icon"
            ></i>

            <input
              v-model="confirmPassword"
              :type="
                showConfirm
                  ? 'text'
                  : 'password'
              "
              placeholder="Repeat new password"
            />

            <button
              type="button"
              class="toggle"
              @click="
                showConfirm =
                  !showConfirm
              "
            >
              <i
                :class="
                  showConfirm
                    ? 'bi bi-eye-slash'
                    : 'bi bi-eye'
                "
              ></i>
            </button>

          </div>

          <small
            v-if="confirmError"
            class="field-error"
          >
            {{ confirmError }}
          </small>

        </div>

        <button
          class="submit-button"
          :disabled="loading"
          @click="resetPassword"
        >
          <span v-if="!loading">
            Reset Password
            <i class="bi bi-check2"></i>
          </span>

          <span
            v-else
            class="loading"
          >
            <span class="spinner"></span>
            Updating...
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
import {
  computed,
  onMounted,
  ref
} from 'vue'

import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')

const password = ref('')
const confirmPassword = ref('')

const showPassword = ref(false)
const showConfirm = ref(false)

const loading = ref(false)

const error = ref('')
const confirmError = ref('')

/*
|--------------------------------------------------------------------------
| Check OTP verification
|--------------------------------------------------------------------------
*/

onMounted(() => {
  const verified =
    sessionStorage.getItem(
      'staynest_otp_verified'
    )

  email.value =
    sessionStorage.getItem(
      'staynest_otp_email'
    ) || ''

  if (
    verified !== 'true' ||
    !email.value
  ) {
    router.replace(
      '/forgot-password'
    )
  }
})

/*
|--------------------------------------------------------------------------
| Password Strength
|--------------------------------------------------------------------------
*/

const strength = computed(() => {
  let score = 0

  if (password.value.length >= 8) {
    score++
  }

  if (/[A-Z]/.test(password.value)) {
    score++
  }

  if (/[0-9]/.test(password.value)) {
    score++
  }

  if (/[^A-Za-z0-9]/.test(password.value)) {
    score++
  }

  return score
})

const strengthText = computed(() => {
  if (strength.value === 1) {
    return 'Weak'
  }

  if (strength.value === 2) {
    return 'Medium'
  }

  if (strength.value === 3) {
    return 'Good'
  }

  if (strength.value === 4) {
    return 'Strong'
  }

  return ''
})

/*
|--------------------------------------------------------------------------
| Reset Password
|--------------------------------------------------------------------------
*/

const resetPassword = async () => {
  error.value = ''
  confirmError.value = ''

  if (password.value.length < 8) {
    error.value =
      'Password must be at least 8 characters.'
    return
  }

  if (
    password.value !==
    confirmPassword.value
  ) {
    confirmError.value =
      'Passwords do not match.'
    return
  }

  loading.value = true

  await delay(1000)

  /*
   * Fake password update
   */
  localStorage.setItem(
    `staynest_password_${email.value}`,
    password.value
  )

  /*
   * Clear reset session
   */
  sessionStorage.removeItem(
    'staynest_otp_verified'
  )

  sessionStorage.removeItem(
    'staynest_reset_otp'
  )

  sessionStorage.removeItem(
    'staynest_otp_flow'
  )

  sessionStorage.removeItem(
    'staynest_otp_email'
  )

  loading.value = false

  /*
   * Go to login
   */
  router.push({
    path: '/login',
    query: {
      reset: 'success'
    }
  })
}

const delay = ms =>
  new Promise(resolve =>
    setTimeout(resolve, ms)
  )
</script>

<style scoped>
:global(:root) {
  --navy:#063B32;
  --blue:#087F68;
  --blue-light:#E8F6F2;
  --ink:#17231F;
  --muted:#6B7772;
  --line:#E1E9E5;
  --bg-soft:#F4F8F6;
}

.reset-page {
  width:100%;
  height:100vh;

  display:grid;
  grid-template-columns:43% 57%;

  overflow:hidden;

  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

.showcase {
  position:relative;

  height:100vh;

  background:
    linear-gradient(
      135deg,
      rgba(6,59,50,.95),
      rgba(8,127,104,.72)
    ),
    url("https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=85")
      center/cover;
}

.overlay {
  position:absolute;
  inset:0;

  background:
    linear-gradient(
      180deg,
      rgba(6,59,50,.3),
      rgba(6,59,50,.9)
    );
}

.showcase-content {
  position:relative;
  z-index:2;

  height:100%;

  display:flex;
  flex-direction:column;

  padding:48px 52px;
}

.brand {
  display:flex;
  align-items:center;
  gap:12px;

  color:white;

  font-size:24px;
  font-weight:800;

  text-decoration:none;
}

.brand-icon {
  width:42px;
  height:42px;

  display:flex;
  align-items:center;
  justify-content:center;

  border-radius:11px;

  background:rgba(255,255,255,.16);

  color:white;
}

.showcase-center {
  margin:auto 0;

  max-width:500px;
}

.showcase-center > span {
  color:rgba(255,255,255,.7);

  font-size:11px;
  font-weight:800;

  letter-spacing:1.8px;
}

.showcase-center h1 {
  margin:15px 0;

  color:white;

  font-size:58px;
  line-height:1.05;

  letter-spacing:-2.5px;
}

.showcase-center strong {
  color:#9BE2CF;
}

.showcase-center p {
  max-width:440px;

  color:rgba(255,255,255,.78);

  font-size:15px;
  line-height:1.7;
}

.panel {
  height:100vh;

  display:flex;
  align-items:center;
  justify-content:center;

  padding:30px 55px;

  overflow:auto;

  scrollbar-width:none;
}

.panel::-webkit-scrollbar {
  display:none;
}

.container {
  width:100%;
  max-width:450px;
}

.mobile-logo {
  display:none;
}

.icon {
  width:65px;
  height:65px;

  display:flex;
  align-items:center;
  justify-content:center;

  margin-bottom:20px;

  border-radius:18px;

  background:var(--blue-light);

  color:var(--blue);

  font-size:26px;
}

.header > span {
  color:var(--blue);

  font-size:11px;
  font-weight:800;

  letter-spacing:1.7px;
}

.header h2 {
  margin:8px 0;

  color:var(--ink);

  font-size:30px;
  font-weight:800;

  letter-spacing:-.8px;
}

.header p {
  margin-bottom:28px;

  color:var(--muted);

  font-size:14px;
  line-height:1.6;
}

.header strong {
  color:var(--ink);
}

.form-group {
  margin-bottom:19px;
}

.form-group label {
  display:block;

  margin-bottom:7px;

  color:var(--ink);

  font-size:12px;
  font-weight:700;
}

.input-wrapper {
  height:49px;

  display:flex;
  align-items:center;

  border:1px solid var(--line);
  border-radius:10px;
}

.input-wrapper:focus-within {
  border-color:var(--blue);

  box-shadow:
    0 0 0 3px rgba(8,127,104,.09);
}

.input-wrapper.error {
  border-color:#D85D5D;
}

.input-icon {
  width:45px;

  text-align:center;

  color:#8A9691;
}

.input-wrapper input {
  flex:1;

  height:100%;

  border:0;
  outline:0;

  color:var(--ink);

  font-size:13px;
}

.toggle {
  width:42px;
  height:100%;

  border:0;
  background:transparent;

  color:#899590;

  cursor:pointer;
}

.strength {
  display:flex;
  align-items:center;
  gap:4px;

  margin-top:7px;
}

.strength span {
  height:3px;

  flex:1;

  border-radius:4px;

  background:#E5EBE8;
}

.strength span.active {
  background:var(--blue);
}

.strength small {
  width:45px;

  color:var(--muted);

  font-size:9px;

  text-align:right;
}

.field-error {
  display:block;

  margin-top:5px;

  color:#D85D5D;

  font-size:11px;
}

.error-alert {
  display:flex;
  gap:8px;
  align-items:center;

  margin-bottom:15px;
  padding:11px;

  border-radius:8px;

  background:#FFF6F6;

  color:#B74B4B;

  font-size:11px;
}

.submit-button {
  width:100%;
  height:49px;

  margin-top:5px;

  border:0;
  border-radius:10px;

  background:var(--blue);

  color:white;

  font-size:13px;
  font-weight:750;

  cursor:pointer;
}

.submit-button:hover:not(:disabled) {
  background:var(--navy);
}

.submit-button:disabled {
  opacity:.6;
}

.loading {
  display:flex;
  justify-content:center;
  align-items:center;
  gap:8px;
}

.spinner {
  width:15px;
  height:15px;

  border:2px solid rgba(255,255,255,.4);
  border-top-color:white;

  border-radius:50%;

  animation:spin .7s linear infinite;
}

@keyframes spin {
  to {
    transform:rotate(360deg);
  }
}

.bottom-link {
  margin-top:18px;

  color:var(--muted);

  font-size:12px;

  text-align:center;
}

.bottom-link a {
  color:var(--blue);

  font-weight:750;

  text-decoration:none;
}

@media(max-width:850px) {
  .reset-page {
    grid-template-columns:1fr;

    height:auto;
    min-height:100vh;
  }

  .showcase {
    display:none;
  }

  .panel {
    min-height:100vh;
    height:auto;

    align-items:flex-start;

    padding:30px 20px 40px;
  }

  .mobile-logo {
    display:flex;
    justify-content:center;
    align-items:center;
    gap:9px;

    margin-bottom:35px;

    color:var(--navy);

    font-size:21px;
    font-weight:800;
  }

  .mobile-logo .brand-icon {
    width:36px;
    height:36px;

    background:var(--blue-light);

    color:var(--blue);
  }
}
</style>