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
          <span>AngkorStay</span>
        </router-link>

        <div class="showcase-center">
          <span class="eyebrow">WELCOME BACK</span>
          <h1>
            Your next stay
            <br />
            <span>starts here.</span>
          </h1>
          <p>
            Sign in to discover beautiful hotels, manage your bookings, and enjoy a better stay.
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

    <section class="auth-panel">
      <div class="auth-container">
        <!-- Mobile Logo -->
        <div class="mobile-logo">
          <div class="brand-icon">
            <i class="bi bi-building"></i>
          </div>

          <span>AngkorStay</span>
        </div>

        <div class="header">
          <span class="form-eyebrow">SIGN IN</span>

          <h2>Welcome back</h2>

          <p>Enter your details to access your account.</p>
        </div>

        <div v-if="loginError" class="alert-error">
          <i class="bi bi-exclamation-circle"></i>
          {{ loginError }}
        </div>

        <div class="form-group">
          <label>Email address</label>

          <div class="input-wrapper" :class="{ error: errors.email }">
            <i class="bi bi-envelope input-icon"></i>

            <input v-model="form.email" type="email" class="ps-5 rounded-3" placeholder="you@example.com" />
          </div>

          <small v-if="errors.email">
            {{ errors.email }}
          </small>
        </div>

        <div class="form-group">
          <div class="password-label">
            <label>Password</label>

            <router-link to="/forgot-password">Forgot password?</router-link>
          </div>

          <div class="input-wrapper" :class="{ error: errors.password }">
            <i class="bi bi-lock input-icon"></i>

            <input v-model="form.password" type="password" class="ps-5 rounded-3" placeholder="Enter your password" />
          </div>

          <small v-if="errors.password">
            {{ errors.password }}
          </small>
        </div>

        <!-- LOGIN -->
        <button type="submit" class="submit-button" :disabled="loading" @click="login">
          <span v-if="!loading">Login</span>
          <span v-else class="loading">
            <span class="spinner"></span>
            Logging in...
          </span>
        </button>

        <!-- DIVIDER -->
        <div class="divider">
          <span>or continue with</span>
        </div>

        <!-- GOOGLE LOGIN BUTTON -->
        <button type="button" class="google-button" @click="loginWithGoogle">
          <svg class="google-icon" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

        <!-- REGISTER -->
        <div class="bottom-link">
          Don't have an account?

          <router-link to="/register">Create account</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const form = ref({
  email: "",
  password: ""
});

const errors = ref({
  email: "",
  password: ""
});

const loginError = ref("");
const loading = ref(false);

// ចាប់យក Token ពី URL ពេល Google Redirect មកវិញ រួចហៅទាញយក Profile របស់ User
onMounted(async () => {
  const token = route.query.token;
  if (token) {
    loading.value = true;
    try {
      localStorage.setItem("token", token);
      auth.token = token;

      // ហៅ getMe() ដើម្បីទាញយកព័ត៌មាន User មកដាក់ក្នុង Pinia store និង LocalStorage
      await auth.getMe();

      router.push(auth.getRoleDashboard());
    } catch (err) {
      console.error("Google login error:", err);
      loginError.value = "Failed to process Google login data.";
    } finally {
      loading.value = false;
    }
  }
});

function loginWithGoogle() {
  window.location.href = "http://localhost:8000/api/v1/auth/google";
}

function validateForm() {
  let isValid = true;

  errors.value.email = "";
  errors.value.password = "";
  loginError.value = "";

  if (!form.value.email.trim()) {
    errors.value.email = "Email is required";
    isValid = false;
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.value.email.trim())) {
      errors.value.email = "Email is invalid!";
      isValid = false;
    }
  }
  if (!form.value.password) {
    errors.value.password = "Password is required";
    isValid = false;
  } else if (form.value.password.length < 6) {
    errors.value.password = "Password must be at least 6 characters long";
    isValid = false;
  }
  return isValid;
}

async function login() {
  if (!validateForm()) return;
  loading.value = true;
  try {
    await auth.login(form.value.email.trim(), form.value.password);
    router.push(auth.getRoleDashboard());
  } catch (err) {
    loginError.value =
      err.response?.data?.message ||
      err.message ||
      "Email or Password incorrect";
  } finally {
    loading.value = false;
  }
}
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
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.auth-showcase {
  position: relative;
  height: 100vh;
  background: linear-gradient(135deg, rgba(6, 59, 50, 0.95), rgba(8, 127, 104, 0.72)),
    url("https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85")
      center / cover no-repeat;
}

.showcase-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(6, 59, 50, 0.3), rgba(6, 59, 50, 0.9));
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
  background: rgba(255, 255, 255, 0.16);
  color: white;
}

.showcase-center {
  max-width: 500px;
  margin: auto 0;
}

.eyebrow {
  color: rgba(255, 255, 255, 0.75);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.8px;
}

.showcase-center h1 {
  margin: 15px 0 0;
  color: white;
  font-size: clamp(42px, 4vw, 64px);
  line-height: 1.05;
  letter-spacing: -2.5px;
}

.showcase-center h1 span {
  color: #9be2cf;
}

.showcase-center p {
  max-width: 440px;
  margin-top: 24px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 15px;
  line-height: 1.7;
}

.showcase-footer {
  display: flex;
  gap: 24px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
}

.showcase-footer div {
  display: flex;
  align-items: center;
  gap: 7px;
}

.showcase-footer i {
  color: #9be2cf;
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
  margin-bottom: 24px;
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
  letter-spacing: -0.8px;
}

.header p {
  margin-top: 9px;
  color: var(--muted);
  font-size: 14px;
}

/* GOOGLE BUTTON STYLES */
.google-button {
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: white;
  color: var(--ink);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 15px;
}

.google-button:hover {
  background: #f8faf9;
  border-color: #cbd5e1;
}

.google-icon {
  width: 18px;
  height: 18px;
}

/* DIVIDER STYLES */
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid var(--line);
}

.divider span {
  padding: 0 12px;
  color: var(--muted);
  font-size: 11px;
  text-transform: lowercase;
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
  transition: 0.2s;
}

.input-wrapper:focus-within {
  border-color: var(--blue);
  box-shadow: 0 0 0 3px rgba(8, 127, 104, 0.09);
}

.input-wrapper.error {
  border-color: #d85d5d;
}

.input-icon {
  width: 45px;
  text-align: center;
  color: #8a9691;
}

.input-wrapper input {
  flex: 1;
  height: 100%;
  border: 0;
  outline: 0;
  font-size: 13px;
  color: var(--ink);
}

.form-group small {
  display: block;
  margin-top: 5px;
  color: #d85d5d;
  font-size: 11px;
}

.submit-button {
  width: 100%;
  height: 49px;
  margin-top: 10px;
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
  opacity: 0.6;
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
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
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
  background: #fff6f6;
  color: #b74b4b;
  font-size: 11px;
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