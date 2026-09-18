<template>
  <div class="callback-container">
    <div class="spinner-box">
      <div class="spinner"></div>
      <p>Logging in with Google, please wait...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

onMounted(async () => {
  const token = route.query.token;

  if (token) {
    try {
      // 1. រក្សាទុក Token ទុកក្នុង LocalStorage និង Pinia មុនគេ
      localStorage.setItem("token", token);
      auth.token = token;

      // 2. ហៅ function getMe() ដែលមានស្រាប់ក្នុង auth store របស់អ្នក ដើម្បីទាញយកข้อมูล User
      if (typeof auth.getMe === 'function') {
        await auth.getMe();
      }

      // 3. Redirect ទៅកាន់ទំព័រដើម (Home) 
      router.push("/");
    } catch (e) {
      console.error("Failed to get user details after Google login:", e);
      router.push("/login?error=fetch_user_failed");
    }
  } else {
    // បើគ្មាន Token ទេ Redirect ទៅ Login វិញ
    router.push("/login?error=google_auth_failed");
  }
});
</script>

<style scoped>
.callback-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f8f6;
  font-family: Inter, sans-serif;
}

.spinner-box {
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 16px;
  border: 4px solid #e1e9e5;
  border-top-color: #087f68;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

p {
  color: #17231f;
  font-size: 14px;
  font-weight: 600;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>