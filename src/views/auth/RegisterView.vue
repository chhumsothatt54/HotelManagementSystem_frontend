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
      <div
        v-if="step === 'register'"
        class="register-container"
      >
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

        <!-- Role -->
        <div class="form-group">
          <label>Account type</label>

          <div class="role-options">

            <button
              type="button"
              class="role-card"
              :class="{ selected: form.role === 'customer' }"
              @click="form.role = 'customer'"
            >
              <div class="role-icon">
                <i class="bi bi-person"></i>
              </div>

              <div class="role-info">
                <strong>Customer</strong>
                <span>Book hotels and manage your stays</span>
              </div>

              <div class="role-check">
                <i
                  v-if="form.role === 'customer'"
                  class="bi bi-check"
                ></i>
              </div>
            </button>

            <button
              type="button"
              class="role-card"
              :class="{ selected: form.role === 'manager' }"
              @click="form.role = 'manager'"
            >
              <div class="role-icon">
                <i class="bi bi-buildings"></i>
              </div>

              <div class="role-info">
                <strong>Hotel Manager</strong>
                <span>Manage your hotel and reservations</span>
              </div>

              <div class="role-check">
                <i
                  v-if="form.role === 'manager'"
                  class="bi bi-check"
                ></i>
              </div>
            </button>

          </div>
        </div>

        <!-- Name + Phone -->
        <div class="two-columns">

          <div class="form-group">
            <label for="name">Full name</label>

            <div
              class="input-wrapper"
              :class="{ error: errors.name }"
            >
              <i class="bi bi-person input-icon"></i>

              <input
                id="name"
                v-model="form.name"
                type="text"
                placeholder="Enter your name"
                autocomplete="name"
              />
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

            <div
              class="input-wrapper"
              :class="{ error: errors.phone }"
            >
              <i class="bi bi-telephone input-icon"></i>

              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                placeholder="012 345 678"
                autocomplete="tel"
              />
            </div>

            <small v-if="errors.phone" class="error-text">
              {{ errors.phone }}
            </small>
          </div>

        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="email">Email address</label>

          <div
            class="input-wrapper"
            :class="{ error: errors.email }"
          >
            <i class="bi bi-envelope input-icon"></i>

            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="you@example.com"
              autocomplete="email"
            />
          </div>

          <small v-if="errors.email" class="error-text">
            {{ errors.email }}
          </small>
        </div>

        <!-- Password -->
        <div class="form-group">
          <label for="password">Password</label>

          <div
            class="input-wrapper"
            :class="{ error: errors.password }"
          >
            <i class="bi bi-lock input-icon"></i>

            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Create a password"
              autocomplete="new-password"
            />

            <button
              type="button"
              class="password-toggle"
              @click="showPassword = !showPassword"
            >
              <i
                :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"
              ></i>
            </button>
          </div>

          <!-- Password strength -->
          <div
            v-if="form.password"
            class="password-strength"
          >
            <div class="strength-bars">
              <span
                v-for="index in 4"
                :key="index"
                :class="{
                  active: passwordStrength >= index,
                  weak: passwordStrength === 1,
                  medium: passwordStrength === 2,
                  good: passwordStrength === 3,
                  strong: passwordStrength === 4
                }"
              ></span>
            </div>

            <span
              class="strength-label"
              :class="{
                weak: passwordStrength === 1,
                medium: passwordStrength === 2,
                good: passwordStrength === 3,
                strong: passwordStrength === 4
              }"
            >
              {{ passwordStrengthText }}
            </span>
          </div>

          <small v-if="errors.password" class="error-text">
            {{ errors.password }}
          </small>
        </div>

        <!-- Confirm Password -->
        <div class="form-group">
          <label for="confirmPassword">Confirm password</label>

          <div
            class="input-wrapper"
            :class="{ error: errors.confirmPassword }"
          >
            <i class="bi bi-shield-lock input-icon"></i>

            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Repeat your password"
              autocomplete="new-password"
            />

            <button
              type="button"
              class="password-toggle"
              @click="
                showConfirmPassword = !showConfirmPassword
              "
            >
              <i
                :class="
                  showConfirmPassword
                    ? 'bi bi-eye-slash'
                    : 'bi bi-eye'
                "
              ></i>
            </button>
          </div>

          <small
            v-if="errors.confirmPassword"
            class="error-text"
          >
            {{ errors.confirmPassword }}
          </small>
        </div>

        <!-- Terms -->
        <label class="terms">
          <input
            v-model="form.acceptTerms"
            type="checkbox"
          />

          <span class="custom-checkbox">
            <i
              v-if="form.acceptTerms"
              class="bi bi-check"
            ></i>
          </span>

          <span>
            I agree to the
            <a href="#" @click.prevent>Terms of Service</a>
            and
            <a href="#" @click.prevent>Privacy Policy</a>.
          </span>
        </label>

        <small v-if="errors.terms" class="error-text terms-error">
          {{ errors.terms }}
        </small>

        <!-- General Error -->
        <div
          v-if="registerError"
          class="alert-error"
        >
          <i class="bi bi-exclamation-circle"></i>
          <span>{{ registerError }}</span>
        </div>

        <!-- Register Button -->
        <button
          type="button"
          class="submit-button"
          :disabled="isLoading"
          @click="handleRegister"
        >
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

      <!-- ==================== OTP SCREEN ==================== -->
      <div
        v-else-if="step === 'otp'"
        class="otp-container"
      >
        <button
          type="button"
          class="back-button"
          @click="backToRegister"
        >
          <i class="bi bi-arrow-left"></i>
          Back
        </button>

        <div class="otp-icon">
          <i class="bi bi-envelope-check"></i>
        </div>

        <div class="form-header otp-header">
          <span class="form-eyebrow">EMAIL VERIFICATION</span>

          <h2>Check your email</h2>

          <p>
            We've sent a 6-digit verification code to
            <strong>{{ form.email }}</strong>
          </p>
        </div>

        <!-- OTP Inputs -->
        <div
          class="otp-inputs"
          @paste="handlePaste"
        >
          <input
            v-for="(digit, index) in otp"
            :key="index"
            :ref="el => setOtpInputRef(el, index)"
            v-model="otp[index]"
            type="text"
            inputmode="numeric"
            maxlength="1"
            autocomplete="one-time-code"
            :class="{ error: otpError }"
            @input="handleOtpInput(index)"
            @keydown="handleOtpKeydown($event, index)"
          />
        </div>

        <div
          v-if="otpError"
          class="otp-error"
        >
          <i class="bi bi-exclamation-circle"></i>
          {{ otpError }}
        </div>

        <!-- Fake OTP -->
        <div class="test-otp">
          <i class="bi bi-info-circle"></i>

          <span>
            Testing mode: use OTP
            <strong>123456</strong>
          </span>
        </div>

        <!-- Verify -->
        <button
          type="button"
          class="submit-button verify-button"
          :disabled="isVerifying || otp.join('').length !== 6"
          @click="verifyOtp"
        >
          <span v-if="!isVerifying">
            Verify Email
            <i class="bi bi-check2"></i>
          </span>

          <span v-else class="loading-content">
            <span class="spinner"></span>
            Verifying...
          </span>
        </button>

        <!-- Resend -->
        <div class="resend-section">
          <span>Didn't receive the code?</span>

          <button
            type="button"
            class="resend-button"
            :disabled="countdown > 0 || isResending"
            @click="resendOtp"
          >
            <span v-if="countdown > 0">
              Resend in {{ countdown }}s
            </span>

            <span v-else>
              {{ isResending ? 'Sending...' : 'Resend OTP' }}
            </span>
          </button>
        </div>

        <div class="otp-note">
          <i class="bi bi-shield-check"></i>
          The verification code is valid for a limited time.
        </div>
      </div>

      <!-- ==================== SUCCESS SCREEN ==================== -->
      <div
        v-else-if="step === 'success'"
        class="success-container"
      >
        <div class="success-icon">
          <i class="bi bi-check-lg"></i>
        </div>

        <span class="form-eyebrow">WELCOME TO STAYNEST</span>

        <h2>Account verified!</h2>

        <p>
          Your email has been successfully verified.
          Your StayNest account is now active.
        </p>

        <div class="success-user">
          <div class="success-avatar">
            {{ getInitials(form.name) }}
          </div>

          <div>
            <strong>{{ form.name }}</strong>
            <span>{{ form.email }}</span>
          </div>
        </div>

        <button
          type="button"
          class="submit-button"
          @click="goToLogin"
        >
          Continue to Login
          <i class="bi bi-arrow-right"></i>
        </button>
      </div>

    </section>
  </div>
</template>

<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref
} from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// =====================================================
// FAKE DATABASE
// =====================================================

const fakeUsers = [
  {
    id: 1,
    name: 'Chan Dara',
    email: 'chandara@gmail.com',
    phone: '012345678',
    password: '12345678',
    role: 'customer',
    avatar: null,
    email_verified_at: null,
    status: 'active'
  },
  {
    id: 2,
    name: 'Sokha Manager',
    email: 'sokha@example.com',
    phone: '012888999',
    password: '12345678',
    role: 'manager',
    avatar: null,
    email_verified_at: null,
    status: 'active'
  }
]

// Fake OTP
const FAKE_OTP = '123456'

// =====================================================
// STATE
// =====================================================

const step = ref('register')

const isLoading = ref(false)
const isVerifying = ref(false)
const isResending = ref(false)

const registerError = ref('')
const otpError = ref('')

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const otpInputs = ref([])

const otp = ref([
  '',
  '',
  '',
  '',
  '',
  ''
])

const countdown = ref(60)

let countdownTimer = null

const form = ref({
  name: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'customer',
  acceptTerms: false
})

const errors = ref({
  name: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: ''
})

let createdUser = null

// =====================================================
// PASSWORD STRENGTH
// =====================================================

const passwordStrength = computed(() => {
  const password = form.value.password

  if (!password) {
    return 0
  }

  let strength = 0

  if (password.length >= 8) {
    strength++
  }

  if (/[A-Z]/.test(password)) {
    strength++
  }

  if (/[0-9]/.test(password)) {
    strength++
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    strength++
  }

  return strength
})

const passwordStrengthText = computed(() => {
  switch (passwordStrength.value) {
    case 1:
      return 'Weak'

    case 2:
      return 'Medium'

    case 3:
      return 'Good'

    case 4:
      return 'Strong'

    default:
      return ''
  }
})

// =====================================================
// VALIDATION
// =====================================================

const clearErrors = () => {
  errors.value = {
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: ''
  }

  registerError.value = ''
}

const validateForm = () => {
  clearErrors()

  let valid = true

  // Name
  if (!form.value.name.trim()) {
    errors.value.name = 'Please enter your full name.'
    valid = false
  } else if (form.value.name.trim().length < 2) {
    errors.value.name = 'Name must be at least 2 characters.'
    valid = false
  }

  // Phone
  if (
    form.value.phone &&
    !/^[0-9+\-\s()]{8,15}$/.test(form.value.phone)
  ) {
    errors.value.phone = 'Please enter a valid phone number.'
    valid = false
  }

  // Email
  if (!form.value.email.trim()) {
    errors.value.email = 'Please enter your email address.'
    valid = false
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      form.value.email
    )
  ) {
    errors.value.email = 'Please enter a valid email address.'
    valid = false
  } else {
    const exists = fakeUsers.some(
      user =>
        user.email.toLowerCase() ===
        form.value.email.trim().toLowerCase()
    )

    if (exists) {
      errors.value.email =
        'An account with this email already exists.'
      valid = false
    }
  }

  // Password
  if (!form.value.password) {
    errors.value.password = 'Please create a password.'
    valid = false
  } else if (form.value.password.length < 8) {
    errors.value.password =
      'Password must be at least 8 characters.'
    valid = false
  }

  // Confirm password
  if (!form.value.confirmPassword) {
    errors.value.confirmPassword =
      'Please confirm your password.'
    valid = false
  } else if (
    form.value.password !==
    form.value.confirmPassword
  ) {
    errors.value.confirmPassword =
      'Passwords do not match.'
    valid = false
  }

  // Terms
  if (!form.value.acceptTerms) {
    errors.value.terms =
      'Please accept the Terms of Service and Privacy Policy.'
    valid = false
  }

  return valid
}

// =====================================================
// REGISTER
// =====================================================

const handleRegister = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true

  // Fake API delay
  await delay(1200)

  const newId =
    fakeUsers.length > 0
      ? Math.max(
          ...fakeUsers.map(user => user.id)
        ) + 1
      : 1

  const newUser = {
    id: newId,
    name: form.value.name.trim(),
    email: form.value.email.trim(),
    phone: form.value.phone || null,
    password: form.value.password,
    role: form.value.role,
    avatar: null,
    email_verified_at: null,
    status: 'pending'
  }

  fakeUsers.push(newUser)

  createdUser = newUser

  isLoading.value = false

  // Go to OTP screen
  step.value = 'otp'

  startCountdown()

  await nextTick()

  // Focus first OTP input
  otpInputs.value[0]?.focus()
}

// =====================================================
// OTP INPUT REFS
// =====================================================

const setOtpInputRef = (element, index) => {
  if (element) {
    otpInputs.value[index] = element
  }
}

// =====================================================
// OTP INPUT
// =====================================================

const handleOtpInput = (index) => {
  otpError.value = ''

  let value = otp.value[index]

  // Only allow numbers
  value = value.replace(/\D/g, '')

  // Keep only one digit
  otp.value[index] = value.slice(-1)

  // Move to next input
  if (
    otp.value[index] &&
    index < otp.value.length - 1
  ) {
    otpInputs.value[index + 1]?.focus()
  }

  // Auto verify when 6 digits entered
  if (otp.value.join('').length === 6) {
    verifyOtp()
  }
}

// =====================================================
// OTP KEYBOARD
// =====================================================

const handleOtpKeydown = (event, index) => {
  // Backspace
  if (
    event.key === 'Backspace' &&
    !otp.value[index] &&
    index > 0
  ) {
    otpInputs.value[index - 1]?.focus()
  }

  // Arrow left
  if (
    event.key === 'ArrowLeft' &&
    index > 0
  ) {
    otpInputs.value[index - 1]?.focus()
  }

  // Arrow right
  if (
    event.key === 'ArrowRight' &&
    index < otp.value.length - 1
  ) {
    otpInputs.value[index + 1]?.focus()
  }
}

// =====================================================
// OTP PASTE
// =====================================================

const handlePaste = (event) => {
  event.preventDefault()

  const pastedText =
    event.clipboardData
      ?.getData('text')
      ?.replace(/\D/g, '')
      .slice(0, 6)

  if (!pastedText) {
    return
  }

  otp.value = [
    '',
    '',
    '',
    '',
    '',
    ''
  ]

  pastedText
    .split('')
    .forEach((digit, index) => {
      if (index < 6) {
        otp.value[index] = digit
      }
    })

  const focusIndex = Math.min(
    pastedText.length,
    5
  )

  nextTick(() => {
    otpInputs.value[focusIndex]?.focus()
  })

  otpError.value = ''

  if (pastedText.length === 6) {
    verifyOtp()
  }
}

// =====================================================
// VERIFY OTP
// =====================================================

const verifyOtp = async () => {
  const enteredOtp = otp.value.join('')

  if (enteredOtp.length !== 6) {
    otpError.value =
      'Please enter the complete 6-digit code.'
    return
  }

  isVerifying.value = true
  otpError.value = ''

  // Fake API delay
  await delay(1000)

  if (enteredOtp !== FAKE_OTP) {
    isVerifying.value = false

    otpError.value =
      'Invalid verification code. Please try again.'

    // Clear OTP
    otp.value = [
      '',
      '',
      '',
      '',
      '',
      ''
    ]

    await nextTick()

    otpInputs.value[0]?.focus()

    return
  }

  // Update fake user
  if (createdUser) {
    createdUser.email_verified_at =
      new Date().toISOString()

    createdUser.status = 'active'
  }

  isVerifying.value = false

  stopCountdown()

  step.value = 'success'
}

// =====================================================
// RESEND OTP
// =====================================================

const resendOtp = async () => {
  if (countdown.value > 0) {
    return
  }

  isResending.value = true
  otpError.value = ''

  await delay(800)

  // Fake OTP remains 123456
  otp.value = [
    '',
    '',
    '',
    '',
    '',
    ''
  ]

  isResending.value = false

  startCountdown()

  await nextTick()

  otpInputs.value[0]?.focus()
}

// =====================================================
// COUNTDOWN
// =====================================================

const startCountdown = () => {
  stopCountdown()

  countdown.value = 60

  countdownTimer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      stopCountdown()
    }
  }, 1000)
}

const stopCountdown = () => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
}

// =====================================================
// BACK TO REGISTER
// =====================================================

const backToRegister = () => {
  stopCountdown()

  otp.value = [
    '',
    '',
    '',
    '',
    '',
    ''
  ]

  otpError.value = ''

  step.value = 'register'
}

// =====================================================
// SUCCESS
// =====================================================

const goToLogin = () => {
  router.push('/login')
}

const getInitials = (name) => {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word.charAt(0).toUpperCase())
    .join('')
}

// =====================================================
// HELPERS
// =====================================================

const delay = (milliseconds) => {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds)
  })
}

onBeforeUnmount(() => {
  stopCountdown()
})
</script>

<style scoped>
/* =====================================================
   DESIGN SYSTEM
===================================================== */

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
  --gold: #F4B942;
  --radius: 12px;
}

/* =====================================================
   PAGE
===================================================== */

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
    linear-gradient(
      135deg,
      rgba(6, 59, 50, 0.95),
      rgba(8, 127, 104, 0.72)
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
      rgba(6, 59, 50, 0.35) 0%,
      rgba(6, 59, 50, 0.15) 40%,
      rgba(6, 59, 50, 0.88) 100%
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

.register-container,
.otp-container,
.success-container {
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

.form-group > label {
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
   PASSWORD STRENGTH
===================================================== */

.password-strength {
  display: flex;
  align-items: center;
  gap: 8px;

  margin-top: 7px;
}

.strength-bars {
  flex: 1;

  display: flex;
  gap: 4px;
}

.strength-bars span {
  height: 3px;
  flex: 1;

  border-radius: 4px;

  background: #E5EBE8;

  transition: all 0.2s ease;
}

.strength-bars span.active {
  background: var(--sky);
}

.strength-label {
  width: 45px;

  font-size: 10px;
  font-weight: 700;

  text-align: right;

  color: var(--muted);
}

.strength-label.weak {
  color: #D85D5D;
}

.strength-label.medium {
  color: #C18A25;
}

.strength-label.good {
  color: var(--blue);
}

.strength-label.strong {
  color: #16855F;
}

/* =====================================================
   TERMS
===================================================== */

.terms {
  position: relative;

  display: flex;
  align-items: flex-start;
  gap: 9px;

  margin: 4px 0 7px;

  cursor: pointer;

  color: var(--muted);

  font-size: 11px;
  line-height: 1.5;
}

.terms input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.custom-checkbox {
  width: 16px;
  height: 16px;

  flex-shrink: 0;

  margin-top: 1px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #C8D4CF;
  border-radius: 4px;

  background: white;

  color: white;

  font-size: 10px;
}

.terms input:checked + .custom-checkbox {
  border-color: var(--blue);
  background: var(--blue);
}

.terms a {
  color: var(--blue);
  font-weight: 700;
  text-decoration: none;
}

.terms a:hover {
  text-decoration: underline;
}

.terms-error {
  margin-bottom: 10px;
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
   OTP
===================================================== */

.otp-container {
  position: relative;

  text-align: center;
}

.back-button {
  position: absolute;
  top: -5px;
  left: 0;

  display: flex;
  align-items: center;
  gap: 7px;

  border: 0;
  background: transparent;

  color: var(--muted);

  font-size: 12px;
  font-weight: 650;

  cursor: pointer;
}

.back-button:hover {
  color: var(--blue);
}

.otp-icon {
  width: 70px;
  height: 70px;

  margin: 0 auto 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 20px;

  background: var(--blue-light);

  color: var(--blue);

  font-size: 28px;
}

.otp-header {
  max-width: 450px;

  margin: 0 auto 28px;
}

.otp-header h2 {
  font-size: 30px;
}

.otp-header p strong {
  color: var(--ink);
  font-weight: 700;
}

/* =====================================================
   OTP INPUTS
===================================================== */

.otp-inputs {
  display: flex;
  justify-content: center;
  gap: 11px;

  margin: 24px 0 14px;
}

.otp-inputs input {
  width: 54px;
  height: 62px;

  border: 1px solid var(--line);
  border-radius: 12px;

  outline: none;

  background: white;

  color: var(--ink);

  font-size: 25px;
  font-weight: 750;

  text-align: center;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.otp-inputs input:focus {
  border-color: var(--blue);

  background: var(--blue-light);

  box-shadow:
    0 0 0 3px rgba(8, 127, 104, 0.09);
}

.otp-inputs input.error {
  border-color: #D85D5D;

  background: #FFF7F7;
}

/* =====================================================
   OTP ERROR
===================================================== */

.otp-error {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  margin-bottom: 12px;

  color: #C14D4D;

  font-size: 11px;
  font-weight: 600;
}

/* =====================================================
   TEST OTP
===================================================== */

.test-otp {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  margin-bottom: 18px;
  padding: 8px 12px;

  border: 1px solid #D9EAE4;
  border-radius: 7px;

  background: var(--bg-soft);

  color: var(--muted);

  font-size: 10px;
}

.test-otp i {
  color: var(--blue);
}

.test-otp strong {
  color: var(--blue);

  font-size: 11px;
  letter-spacing: 1px;
}

/* =====================================================
   RESEND
===================================================== */

.resend-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  margin-top: 18px;

  color: var(--muted);

  font-size: 11px;
}

.resend-button {
  padding: 0;

  border: 0;
  background: transparent;

  color: var(--blue);

  font-size: 11px;
  font-weight: 750;

  cursor: pointer;
}

.resend-button:hover:not(:disabled) {
  text-decoration: underline;
}

.resend-button:disabled {
  color: #9AA5A0;
  cursor: not-allowed;
}

.otp-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  margin-top: 22px;

  color: #99A49F;

  font-size: 10px;
}

.otp-note i {
  color: var(--blue);
}

/* =====================================================
   SUCCESS
===================================================== */

.success-container {
  text-align: center;
}

.success-icon {
  width: 78px;
  height: 78px;

  margin: 0 auto 23px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: var(--blue-light);

  color: var(--blue);

  font-size: 36px;
}

.success-container .form-eyebrow {
  margin-bottom: 8px;
}

.success-container h2 {
  margin: 0;

  color: var(--ink);

  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.8px;
}

.success-container > p {
  max-width: 400px;

  margin: 12px auto 22px;

  color: var(--muted);

  font-size: 14px;
  line-height: 1.65;
}

.success-user {
  display: flex;
  align-items: center;
  gap: 12px;

  max-width: 330px;

  margin: 0 auto 25px;
  padding: 12px;

  border: 1px solid var(--line);
  border-radius: 12px;

  background: var(--bg-soft);

  text-align: left;
}

.success-avatar {
  width: 42px;
  height: 42px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: var(--blue);

  color: white;

  font-size: 12px;
  font-weight: 750;
}

.success-user div:last-child {
  min-width: 0;

  display: flex;
  flex-direction: column;
}

.success-user strong {
  color: var(--ink);

  font-size: 12px;
}

.success-user span {
  margin-top: 3px;

  overflow: hidden;

  color: var(--muted);

  font-size: 10px;

  text-overflow: ellipsis;
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

  .form-header h2,
  .otp-header h2,
  .success-container h2 {
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

  .otp-inputs {
    gap: 7px;
  }

  .otp-inputs input {
    width: 47px;
    height: 56px;

    border-radius: 10px;

    font-size: 22px;
  }

  .back-button {
    position: static;

    margin-bottom: 25px;
  }

  .otp-icon {
    width: 62px;
    height: 62px;

    font-size: 24px;
  }
}

@media (max-width: 380px) {
  .otp-inputs {
    gap: 5px;
  }

  .otp-inputs input {
    width: 43px;
    height: 52px;

    font-size: 20px;
  }

  .register-panel {
    padding-left: 14px;
    padding-right: 14px;
  }
}
</style>