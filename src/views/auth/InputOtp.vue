<template>
  <div class="otp-page">

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
            {{ flow === 'register'
              ? 'VERIFY YOUR ACCOUNT'
              : 'SECURITY CHECK'
            }}
          </span>

          <h1>
            One more step
            <br />
            <strong>to continue.</strong>
          </h1>

          <p>
            Verify your email address with the
            6-digit code we sent you.
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

        <button
          class="back-button"
          @click="goBack"
        >
          <i class="bi bi-arrow-left"></i>
          Back
        </button>

        <div class="otp-icon">
          <i class="bi bi-envelope-check"></i>
        </div>

        <div class="header">

          <span>
            EMAIL VERIFICATION
          </span>

          <h2>
            Enter verification code
          </h2>

          <p>
            We sent a 6-digit code to
            <strong>{{ email }}</strong>
          </p>

        </div>

        <!-- OTP -->
        <div
          class="otp-inputs"
          @paste="handlePaste"
        >
          <input
            v-for="(digit,index) in otp"
            :key="index"
            :ref="el => setInputRef(el,index)"
            v-model="otp[index]"
            type="text"
            inputmode="numeric"
            maxlength="1"
            autocomplete="one-time-code"
            :class="{ error: error }"
            @input="handleInput(index)"
            @keydown="handleKeydown($event,index)"
          />
        </div>

        <!-- ERROR -->
        <div
          v-if="error"
          class="otp-error"
        >
          <i class="bi bi-exclamation-circle"></i>
          {{ error }}
        </div>

        <!-- TEST -->
        <div class="test-otp">
          <i class="bi bi-info-circle"></i>

          Testing mode:
          <strong>123456</strong>
        </div>

        <!-- VERIFY -->
        <button
          class="submit-button"
          :disabled="
            verifying ||
            otp.join('').length !== 6
          "
          @click="verifyOtp"
        >
          <span v-if="!verifying">
            Verify OTP
            <i class="bi bi-check2"></i>
          </span>

          <span
            v-else
            class="loading"
          >
            <span class="spinner"></span>
            Verifying...
          </span>
        </button>

        <!-- RESEND -->
        <div class="resend">
          <span>
            Didn't receive the code?
          </span>

          <button
            :disabled="countdown > 0 || resending"
            @click="resend"
          >
            {{
              countdown > 0
                ? `Resend in ${countdown}s`
                : resending
                  ? 'Sending...'
                  : 'Resend OTP'
            }}
          </button>
        </div>

      </div>

    </section>
  </div>
</template>

<script setup>
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref
} from 'vue'

import { useRouter } from 'vue-router'

const router = useRouter()

const otp = ref([
  '',
  '',
  '',
  '',
  '',
  ''
])

const inputs = ref([])

const email = ref('')
const flow = ref('forgot-password')

const error = ref('')

const verifying = ref(false)
const resending = ref(false)

const countdown = ref(60)

let timer = null

const setInputRef = (element, index) => {
  if (element) {
    inputs.value[index] = element
  }
}

/*
|--------------------------------------------------------------------------
| Get OTP Flow
|--------------------------------------------------------------------------
*/

onMounted(async () => {
  flow.value =
    sessionStorage.getItem(
      'staynest_otp_flow'
    ) || 'forgot-password'

  email.value =
    sessionStorage.getItem(
      'staynest_otp_email'
    ) || ''

  if (!email.value) {
    router.replace('/login')
    return
  }

  startCountdown()

  await nextTick()

  inputs.value[0]?.focus()
})

/*
|--------------------------------------------------------------------------
| OTP Input
|--------------------------------------------------------------------------
*/

const handleInput = index => {
  error.value = ''

  otp.value[index] =
    otp.value[index]
      .replace(/\D/g, '')
      .slice(-1)

  if (
    otp.value[index] &&
    index < 5
  ) {
    inputs.value[index + 1]?.focus()
  }

  if (
    otp.value.join('').length === 6
  ) {
    verifyOtp()
  }
}

/*
|--------------------------------------------------------------------------
| Keyboard
|--------------------------------------------------------------------------
*/

const handleKeydown = (
  event,
  index
) => {
  if (
    event.key === 'Backspace' &&
    !otp.value[index] &&
    index > 0
  ) {
    inputs.value[index - 1]?.focus()
  }

  if (
    event.key === 'ArrowLeft' &&
    index > 0
  ) {
    inputs.value[index - 1]?.focus()
  }

  if (
    event.key === 'ArrowRight' &&
    index < 5
  ) {
    inputs.value[index + 1]?.focus()
  }
}

/*
|--------------------------------------------------------------------------
| Paste
|--------------------------------------------------------------------------
*/

const handlePaste = event => {
  event.preventDefault()

  const value =
    event.clipboardData
      ?.getData('text')
      ?.replace(/\D/g, '')
      .slice(0, 6)

  if (!value) {
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

  value
    .split('')
    .forEach((digit,index) => {
      otp.value[index] = digit
    })

  if (value.length === 6) {
    verifyOtp()
  }
}

/*
|--------------------------------------------------------------------------
| Verify OTP
|--------------------------------------------------------------------------
*/

const verifyOtp = async () => {
  const enteredOtp =
    otp.value.join('')

  if (enteredOtp.length !== 6) {
    error.value =
      'Please enter the complete 6-digit code.'
    return
  }

  verifying.value = true
  error.value = ''

  await delay(900)

  /*
   * Fake OTP
   */
  const correctOtp =
    sessionStorage.getItem(
      'staynest_reset_otp'
    ) || '123456'

  if (enteredOtp !== correctOtp) {
    verifying.value = false

    error.value =
      'Invalid OTP. Please try again.'

    otp.value = [
      '',
      '',
      '',
      '',
      '',
      ''
    ]

    await nextTick()

    inputs.value[0]?.focus()

    return
  }

  verifying.value = false

  /*
   * FORGOT PASSWORD
   */
  if (
    flow.value ===
    'forgot-password'
  ) {
    sessionStorage.setItem(
      'staynest_otp_verified',
      'true'
    )

    router.push('/reset-password')

    return
  }

  /*
   * REGISTER
   */
  if (
    flow.value === 'register'
  ) {
    sessionStorage.setItem(
      'staynest_registration_verified',
      'true'
    )

    router.push('/login')
  }
}

/*
|--------------------------------------------------------------------------
| Resend
|--------------------------------------------------------------------------
*/

const resend = async () => {
  if (countdown.value > 0) {
    return
  }

  resending.value = true

  await delay(700)

  sessionStorage.setItem(
    'staynest_reset_otp',
    '123456'
  )

  otp.value = [
    '',
    '',
    '',
    '',
    '',
    ''
  ]

  resending.value = false

  startCountdown()

  await nextTick()

  inputs.value[0]?.focus()
}

/*
|--------------------------------------------------------------------------
| Countdown
|--------------------------------------------------------------------------
*/

const startCountdown = () => {
  stopCountdown()

  countdown.value = 60

  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      stopCountdown()
    }
  },1000)
}

const stopCountdown = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

/*
|--------------------------------------------------------------------------
| Back
|--------------------------------------------------------------------------
*/

const goBack = () => {
  if (
    flow.value ===
    'forgot-password'
  ) {
    router.push('/forgot-password')
  } else {
    router.push('/register')
  }
}

const delay = ms =>
  new Promise(resolve =>
    setTimeout(resolve,ms)
  )

onBeforeUnmount(() => {
  stopCountdown()
})
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

.otp-page {
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
    url("https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=85")
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
  max-width:470px;
}

.mobile-logo {
  display:none;
}

.back-button {
  display:flex;
  align-items:center;
  gap:7px;

  margin-bottom:25px;

  border:0;
  background:transparent;

  color:var(--muted);

  font-size:12px;
  font-weight:650;

  cursor:pointer;
}

.back-button:hover {
  color:var(--blue);
}

.otp-icon {
  width:70px;
  height:70px;

  display:flex;
  align-items:center;
  justify-content:center;

  margin-bottom:20px;

  border-radius:20px;

  background:var(--blue-light);

  color:var(--blue);

  font-size:28px;
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
  color:var(--muted);

  font-size:14px;
  line-height:1.6;
}

.header strong {
  color:var(--ink);
}

.otp-inputs {
  display:flex;
  justify-content:center;
  gap:10px;

  margin:30px 0 15px;
}

.otp-inputs input {
  width:55px;
  height:63px;

  border:1px solid var(--line);
  border-radius:12px;

  outline:none;

  color:var(--ink);

  font-size:25px;
  font-weight:750;

  text-align:center;
}

.otp-inputs input:focus {
  border-color:var(--blue);

  background:var(--blue-light);

  box-shadow:
    0 0 0 3px rgba(8,127,104,.09);
}

.otp-inputs input.error {
  border-color:#D85D5D;
}

.otp-error {
  display:flex;
  justify-content:center;
  align-items:center;
  gap:7px;

  color:#C14D4D;

  font-size:11px;
}

.test-otp {
  display:flex;
  justify-content:center;
  align-items:center;
  gap:7px;

  margin:15px 0;

  color:var(--muted);

  font-size:10px;
}

.test-otp i {
  color:var(--blue);
}

.test-otp strong {
  color:var(--blue);
}

.submit-button {
  width:100%;
  height:49px;

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
  opacity:.55;
  cursor:not-allowed;
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

.resend {
  display:flex;
  justify-content:center;
  align-items:center;
  gap:5px;

  margin-top:20px;

  color:var(--muted);

  font-size:11px;
}

.resend button {
  border:0;
  background:transparent;

  color:var(--blue);

  font-size:11px;
  font-weight:750;

  cursor:pointer;
}

.resend button:disabled {
  color:#9AA5A0;

  cursor:not-allowed;
}

@media(max-width:850px) {
  .otp-page {
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

    padding:30px 18px 40px;
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

  .otp-inputs {
    gap:6px;
  }

  .otp-inputs input {
    width:47px;
    height:56px;
  }
}

@media(max-width:380px) {
  .otp-inputs {
    gap:4px;
  }

  .otp-inputs input {
    width:43px;
    height:52px;
  }
}
</style>