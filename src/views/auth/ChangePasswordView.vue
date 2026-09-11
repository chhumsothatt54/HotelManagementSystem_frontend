
<template>
  <div class="auth-page">

    <!-- LEFT SHOWCASE -->
    <section class="auth-showcase">

      <div class="showcase-overlay"></div>

      <div class="showcase-content">

        <!-- BRAND -->
        <router-link to="/login" class="brand">
          <div class="brand-icon">
            <i class="bi bi-building"></i>
          </div>
          <span>StayNest</span>
        </router-link>

        <!-- CENTER -->
        <div class="showcase-center">

          <span class="eyebrow">
            ACCOUNT SECURITY
          </span>

          <h1>
            Keep your account
            <br />
            <span>safe & secure.</span>
          </h1>

          <p>
            Update your password regularly to keep
            your StayNest account protected.
          </p>

        </div>

        <!-- FOOTER -->
        <div class="showcase-footer">

          <div>
            <i class="bi bi-shield-check"></i>
            Secure
          </div>

          <div>
            <i class="bi bi-lock"></i>
            Protected
          </div>

          <div>
            <i class="bi bi-headset"></i>
            24/7 Support
          </div>

        </div>

      </div>

    </section>

    <!-- RIGHT PANEL -->
    <section class="auth-panel">

      <div class="auth-container">

        <!-- MOBILE LOGO -->
        <div class="mobile-logo">

          <div class="brand-icon">
            <i class="bi bi-building"></i>
          </div>

          <span>StayNest</span>

        </div>

        <!-- HEADER -->
        <div class="header">

          <span class="form-eyebrow">
            ACCOUNT SECURITY
          </span>

          <h2>Change password</h2>

          <p>
            Update your password to keep your account secure.
          </p>

        </div>

        <!-- SUCCESS -->
        <div
          v-if="successMessage"
          class="alert-success"
        >
          <i class="bi bi-check-circle"></i>
          {{ successMessage }}
        </div>

        <!-- ERROR -->
        <div
          v-if="errorMessage"
          class="alert-error"
        >
          <i class="bi bi-exclamation-circle"></i>
          {{ errorMessage }}
        </div>

        <form @submit.prevent="submitForm">

          <!-- CURRENT PASSWORD -->
          <div class="form-group">

            <label>Current password</label>

            <div
              class="input-wrapper"
              :class="{ error: errors.current_password }"
            >

              <i class="bi bi-lock input-icon"></i>

              <input
                v-model="form.current_password"
                :type="showCurrent ? 'text' : 'password'"
                placeholder="Enter your current password"
              />

              <button
                type="button"
                class="password-toggle"
                @click="showCurrent = !showCurrent"
              >
                <i
                  :class="
                    showCurrent
                      ? 'bi bi-eye-slash'
                      : 'bi bi-eye'
                  "
                ></i>
              </button>

            </div>

            <small v-if="errors.current_password">
              {{ errors.current_password[0] }}
            </small>

          </div>

          <!-- NEW PASSWORD -->
          <div class="form-group">

            <label>New password</label>

            <div
              class="input-wrapper"
              :class="{ error: errors.new_password }"
            >

              <i class="bi bi-lock input-icon"></i>

              <input
                v-model="form.new_password"
                :type="showNew ? 'text' : 'password'"
                placeholder="Enter your new password"
              />

              <button
                type="button"
                class="password-toggle"
                @click="showNew = !showNew"
              >
                <i
                  :class="
                    showNew
                      ? 'bi bi-eye-slash'
                      : 'bi bi-eye'
                  "
                ></i>
              </button>

            </div>

            <small v-if="errors.new_password">
              {{ errors.new_password[0] }}
            </small>

            <small
              v-else
              class="password-hint"
            >
              Password must be at least 8 characters.
            </small>

          </div>

          <!-- CONFIRM PASSWORD -->
          <div class="form-group">

            <label>Confirm new password</label>

            <div
              class="input-wrapper"
              :class="{ error: errors.new_password }"
            >

              <i class="bi bi-shield-lock input-icon"></i>

              <input
                v-model="form.new_password_confirmation"
                :type="showConfirm ? 'text' : 'password'"
                placeholder="Confirm your new password"
              />

              <button
                type="button"
                class="password-toggle"
                @click="showConfirm = !showConfirm"
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

          </div>

          <!-- SUBMIT -->
          <button
            type="submit"
            class="submit-button"
            :disabled="loading"
          >

            <span
              v-if="loading"
              class="loading"
            >
              <span class="spinner"></span>
              Changing password...
            </span>

            <span v-else>
              Change password
              <i class="bi bi-arrow-right"></i>
            </span>

          </button>

        </form>

        <!-- BACK TO PROFILE -->
        <div class="bottom-link">

          <router-link to="/manager/profile">
            <i class="bi bi-arrow-left"></i>
            Back to profile
          </router-link>

        </div>

      </div>

    </section>

  </div>
</template>


<script setup>

import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const auth = useAuthStore();


const form = ref({
  current_password: "",
  new_password: "",
  new_password_confirmation: ""
});


const errors = ref({
  current_password: "",
  new_password: ""
});


const errorMessage = ref("");
const successMessage = ref("");
const loading = ref(false);


const showCurrent = ref(false);
const showNew = ref(false);
const showConfirm = ref(false);


async function submitForm() {

  errors.value = {
    current_password: "",
    new_password: ""
  };

  errorMessage.value = "";
  successMessage.value = "";


  // Current password
  if (!form.value.current_password) {

    errors.value.current_password =
      "Current password is required";

    return;
  }


  // New password
  if (!form.value.new_password) {

    errors.value.new_password =
      "New password is required";

    return;
  }


  if (form.value.new_password.length < 8) {

    errors.value.new_password =
      "Password must be at least 8 characters long";

    return;
  }


  // Confirm password
  if (
    form.value.new_password !==
    form.value.new_password_confirmation
  ) {

    errors.value.new_password =
      "Passwords do not match";

    return;
  }


  loading.value = true;


  try {

    const result = await auth.changePassword({
  current_password: form.value.current_password,
  password: form.value.new_password,
  password_confirmation: form.value.new_password_confirmation
})


    if (!result.success) {

      errors.value =
        result.errors || {};

      errorMessage.value =
        result.message ||
        "Unable to change password.";

      return;
    }


    successMessage.value =
      result.message ||
      "Password changed successfully.";


    // Clear form
    form.value = {
      current_password: "",
      new_password: "",
      new_password_confirmation: ""
    };


  } catch (error) {

    errorMessage.value =
      error.response?.data?.message ||
      "Something went wrong. Please try again.";

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


/* =========================
   PAGE
========================= */

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


/* =========================
   LEFT SHOWCASE
========================= */

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

  background: rgba(255, 255, 255, .16);

  color: white;

}


.showcase-center {

  max-width: 500px;

  margin: auto 0;

}


.eyebrow {

  color: rgba(255, 255, 255, .75);

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

  color: #9BE2CF;

}


.showcase-center p {

  max-width: 440px;

  margin-top: 24px;

  color: rgba(255, 255, 255, .78);

  font-size: 15px;

  line-height: 1.7;

}


.showcase-footer {

  display: flex;

  gap: 24px;

  color: rgba(255, 255, 255, .8);

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


/* =========================
   RIGHT PANEL
========================= */

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


/* =========================
   HEADER
========================= */

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


/* =========================
   FORM
========================= */

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

  min-width: 0;

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


.password-hint {

  color: var(--muted) !important;

}


/* =========================
   BUTTON
========================= */

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


.submit-button i {

  margin-left: 7px;

}


/* =========================
   LOADING
========================= */

.loading {

  display: flex;

  justify-content: center;

  align-items: center;

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


/* =========================
   ALERT
========================= */

.alert-success {

  display: flex;

  gap: 8px;

  align-items: center;

  margin-bottom: 15px;

  padding: 11px;

  border-radius: 8px;

  background: var(--blue-light);

  color: var(--blue);

  font-size: 11px;

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


/* =========================
   BOTTOM LINK
========================= */

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


.bottom-link a:hover {

  color: var(--navy);

}


/* =========================
   MOBILE
========================= */

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