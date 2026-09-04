<template>
  <div class="auth-page">

    <!-- LEFT SHOWCASE -->
    <section class="auth-showcase">
      <div class="showcase-overlay"></div>

      <div class="showcase-content">

        <router-link to="/login" class="brand">
          <div class="brand-icon">
            <i class="bi bi-building"></i>
          </div>
          <span>StayNest</span>
        </router-link>

        <div class="showcase-center">
          <span class="eyebrow">
            WELCOME BACK
          </span>

          <h1>
            Your next stay
            <br />
            <span>starts here.</span>
          </h1>

          <p>
            Sign in to discover beautiful hotels,
            manage your bookings, and enjoy a better stay.
          </p>
        </div>

        <div class="showcase-footer">
          <div>
            <i class="bi bi-shield-check"></i>
            Secure
          </div>

          <div>
            <i class="bi bi-heart"></i>
            Trusted
          </div>

          <div>
            <i class="bi bi-headset"></i>
            24/7 Support
          </div>
        </div>

      </div>
    </section>

    <!-- RIGHT FORM -->
    <section class="auth-panel">

      <div class="auth-container">

        <!-- Mobile Logo -->
        <div class="mobile-logo">
          <div class="brand-icon">
            <i class="bi bi-building"></i>
          </div>

          <span>StayNest</span>
        </div>

        <div class="header">
          <span class="form-eyebrow">
            SIGN IN
          </span>

          <h2>Welcome back</h2>

          <p>
            Enter your details to access your account.
          </p>
        </div>

        <!-- ERROR -->
        <div
          v-if="loginError"
          class="alert-error"
        >
          <i class="bi bi-exclamation-circle"></i>
          {{ loginError }}
        </div>

        <!-- EMAIL -->
        <div class="form-group">
          <label>Email address</label>

          <div
            class="input-wrapper"
            :class="{ error: errors.email }"
          >
            <i class="bi bi-envelope input-icon"></i>

            <input
              v-model="form.email"
              type="email"
              placeholder="you@example.com"
              @keyup.enter="login"
            />
          </div>

          <small v-if="errors.email">
            {{ errors.email }}
          </small>
        </div>

        <!-- PASSWORD -->
        <div class="form-group">
          <div class="password-label">
            <label>Password</label>

            <router-link to="/forgot-password">
              Forgot password?
            </router-link>
          </div>

          <div
            class="input-wrapper"
            :class="{ error: errors.password }"
          >
            <i class="bi bi-lock input-icon"></i>

            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              @keyup.enter="login"
            />

            <button
              type="button"
              class="password-toggle"
              @click="showPassword = !showPassword"
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

          <small v-if="errors.password">
            {{ errors.password }}
          </small>
        </div>

        <!-- REMEMBER -->
        <label class="remember">
          <input
            v-model="rememberMe"
            type="checkbox"
          />

          <span class="checkbox">
            <i
              v-if="rememberMe"
              class="bi bi-check"
            ></i>
          </span>

          Remember me
        </label>

        <!-- LOGIN -->
        <button
          class="submit-button"
          :disabled="loading"
          @click="login"
        >
          <span v-if="!loading">
            Sign In
            <i class="bi bi-arrow-right"></i>
          </span>

          <span
            v-else
            class="loading"
          >
            <span class="spinner"></span>
            Signing in...
          </span>
        </button>

        <!-- REGISTER -->
        <div class="bottom-link">
          Don't have an account?

          <router-link to="/register">
            Create account
          </router-link>
        </div>

        <!-- TEST ACCOUNT -->
        <div class="test-account">
          <div class="test-title">
            <i class="bi bi-info-circle"></i>
            Test account
          </div>

          <div>
            Email:
            <strong>chandara@gmail.com</strong>
          </div>

          <div>
            Password:
            <strong>12345678</strong>
          </div>
        </div>

      </div>

    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  email: '',
  password: ''
})

const rememberMe = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const loginError = ref('')

const errors = ref({
  email: '',
  password: ''
})

/*
|--------------------------------------------------------------------------
| Fake Users
|--------------------------------------------------------------------------
*/

const fakeUsers = [
  {
    id: 1,
    name: 'Chan Dara',
    email: 'chandara@gmail.com',
    password: '12345678',
    role: 'customer',
    status: 'active'
  },

  {
    id: 2,
    name: 'Sokha Manager',
    email: 'sokha@example.com',
    password: '12345678',
    role: 'manager',
    status: 'active'
  }
]

const validate = () => {
  errors.value = {
    email: '',
    password: ''
  }

  loginError.value = ''

  let valid = true

  if (!form.value.email.trim()) {
    errors.value.email =
      'Please enter your email.'
    valid = false
  }

  if (!form.value.password) {
    errors.value.password =
      'Please enter your password.'
    valid = false
  }

  return valid
}

const login = async () => {
  if (!validate()) {
    return
  }

  loading.value = true

  await delay(900)

  const user = fakeUsers.find(
    item =>
      item.email.toLowerCase() ===
        form.value.email
          .trim()
          .toLowerCase() &&
      item.password === form.value.password
  )

  if (!user) {
    loading.value = false

    loginError.value =
      'Invalid email or password.'

    return
  }

  if (user.status !== 'active') {
    loading.value = false

    loginError.value =
      'Your account has not been verified yet.'

    return
  }

  /*
   * Fake login session
   */
  localStorage.setItem(
    'staynest_user',
    JSON.stringify(user)
  )

  loading.value = false

  /*
   * Change this later to your real dashboard/home route.
   */
  if (user.role === 'manager') {
    router.push('/admin')
  } else {
    router.push('/')
  }
}

const delay = ms =>
  new Promise(resolve =>
    setTimeout(resolve, ms)
  )
</script>

<style scoped>
:global(:root) {
  --navy: #063B32;
  --blue: #087F68;
  --blue-light: #E8F6F2;
  --sky: #39A98A;
  --ink: #17231F;
  --muted: #6B7772;
  --footer-bg: #F5F7F6;
  --line: #E1E9E5;
  --bg-soft: #F4F8F6;
}

.auth-page {
  width: 100%;
  height: 100vh;

  display: grid;
  grid-template-columns: 43% 57%;

  overflow: hidden;

  background: white;

  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

.auth-showcase {
  position: relative;

  height: 100vh;

  background:
    linear-gradient(
      135deg,
      rgba(6, 59, 50, .95),
      rgba(8, 127, 104, .72)
    ),
    url("https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85")
      center / cover no-repeat;
}

.showcase-overlay {
  position: absolute;
  inset: 0;

  background:
    linear-gradient(
      180deg,
      rgba(6, 59, 50, .3),
      rgba(6, 59, 50, .9)
    );
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

  background: rgba(255,255,255,.16);

  color: white;
}

.showcase-center {
  max-width: 500px;

  margin: auto 0;
}

.eyebrow {
  color: rgba(255,255,255,.75);

  font-size: 11px;
  font-weight: 800;

  letter-spacing: 1.8px;
}

.showcase-center h1 {
  margin: 15px 0 0;

  color: white;

  font-size: clamp(42px,4vw,64px);
  line-height: 1.05;

  letter-spacing: -2.5px;
}

.showcase-center h1 span {
  color: #9BE2CF;
}

.showcase-center p {
  max-width: 440px;

  margin-top: 24px;

  color: rgba(255,255,255,.78);

  font-size: 15px;
  line-height: 1.7;
}

.showcase-footer {
  display: flex;
  gap: 24px;

  color: rgba(255,255,255,.8);

  font-size: 12px;
}

.showcase-footer div {
  display: flex;
  align-items: center;
  gap: 7px;
}

.showcase-footer i {
  color: #9BE2CF;
}

.auth-panel {
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 30px 55px;

  overflow-y: auto;

  scrollbar-width: none;
}

.auth-panel::-webkit-scrollbar {
  display: none;
}

.auth-container {
  width: 100%;
  max-width: 450px;
}

.mobile-logo {
  display: none;
}

.header {
  margin-bottom: 28px;
}

.form-eyebrow {
  color: var(--blue);

  font-size: 11px;
  font-weight: 800;

  letter-spacing: 1.7px;
}

.header h2 {
  margin: 8px 0 0;

  color: var(--ink);

  font-size: 30px;
  font-weight: 800;

  letter-spacing: -.8px;
}

.header p {
  margin-top: 9px;

  color: var(--muted);

  font-size: 14px;
}

.form-group {
  margin-bottom: 19px;
}

.form-group label {
  display: block;

  margin-bottom: 7px;

  color: var(--ink);

  font-size: 12px;
  font-weight: 700;
}

.password-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.password-label a {
  color: var(--blue);

  font-size: 11px;
  font-weight: 700;

  text-decoration: none;
}

.input-wrapper {
  height: 49px;

  display: flex;
  align-items: center;

  border: 1px solid var(--line);
  border-radius: 10px;

  transition: .2s;
}

.input-wrapper:focus-within {
  border-color: var(--blue);

  box-shadow:
    0 0 0 3px rgba(8,127,104,.09);
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

  font-size: 13px;

  color: var(--ink);
}

.password-toggle {
  width: 42px;
  height: 100%;

  border: 0;
  background: transparent;

  color: #899590;

  cursor: pointer;
}

.form-group small {
  display: block;

  margin-top: 5px;

  color: #D85D5D;

  font-size: 11px;
}

.remember {
  display: flex;
  align-items: center;
  gap: 8px;

  color: var(--muted);

  font-size: 11px;

  cursor: pointer;
}

.remember input {
  display: none;
}

.checkbox {
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #C8D4CF;
  border-radius: 4px;

  color: white;

  font-size: 10px;
}

.remember input:checked + .checkbox {
  background: var(--blue);
  border-color: var(--blue);
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
  cursor: not-allowed;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.spinner {
  width: 15px;
  height: 15px;

  border: 2px solid rgba(255,255,255,.4);
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

.alert-error {
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

.test-account {
  margin-top: 25px;
  padding: 12px 14px;

  border: 1px solid var(--line);
  border-radius: 9px;

  background: var(--bg-soft);

  color: var(--muted);

  font-size: 10px;
  line-height: 1.8;
}

.test-title {
  color: var(--blue);

  font-weight: 750;
}

.test-account strong {
  color: var(--ink);
}

@media (max-width: 850px) {
  .auth-page {
    grid-template-columns: 1fr;

    height: auto;
    min-height: 100vh;

    overflow: visible;
  }

  .auth-showcase {
    display: none;
  }

  .auth-panel {
    min-height: 100vh;
    height: auto;

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