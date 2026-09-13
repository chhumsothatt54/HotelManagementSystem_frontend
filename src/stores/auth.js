import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "@/api/http";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("token") || null);
  const user = ref(JSON.parse(localStorage.getItem("user") || "null"));
  const isLogin = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === "admin");
  const isManager = computed(() => user.value?.role === "manager");
  const isCustomer = computed(() => user.value?.role === "customer");

  async function login(email, password) {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });
      if (!res.data?.token) {
        throw new Error(res.data?.message || "Login failed");
      }
      user.value = res.data.user;
      token.value = res.data.token;
      localStorage.setItem("token", token.value);
      localStorage.setItem("user", JSON.stringify(user.value));
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  function getRoleDashboard() {
    switch (user.value?.role) {
      case "admin":
        return "/admin/dashboard";
      case "hotel_manager":
        return "/manager/dashboard";
      case "customer":
        return "/booking";
      default:
        return "/";
    }
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  async function register(name, phone, email, password, password_confirmation) {
    try {
      const response = await api.post("/auth/register", {
        name,
        phone,
        email,
        password,
        password_confirmation,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async function forgotPassword(email) {
    try {
      let res = await api.post("/auth/forgot-password", {
        email,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async function confirmOtp(email, otp) {
    try {
      let res = await api.post("/auth/forgot-password/confirm-otp", {
        email,
        otp,
      });
      if (res.data?.token) {
        sessionStorage.setItem("staynest_reset_token", res.data.token);
      } else if (res.data?.data?.token) {
        sessionStorage.setItem("staynest_reset_token", res.data.data.token);
      }

      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async function resetPassword(email, password, password_confirmation) {
    try {
      const token = sessionStorage.getItem("staynest_reset_token");

      let res = await api.post("/auth/forgot-password/set-new-password", {
        email,
        password,
        password_confirmation,
        token,
      });

      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async function resendOtp(email) {
    try {
      let res = await api.post("/auth/forgot-password/resend-otp", {
        email,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async function changePassword(data) {
  try {
    const response = await api.put('/change-password', data)

    return {
      success: true,
      message: response.data.message,
      errors: {},
    }
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        'Failed to change password.',
      errors:
        error.response?.data?.errors || {},
    }
  }
}

  return {
    user,
    token,
    isLogin,
    isAdmin,
    isManager,
    isCustomer,

    login,
    getRoleDashboard,
    logout,
    register,
    forgotPassword,
    confirmOtp,
    resetPassword,
    resendOtp,
    changePassword,
  };
});
