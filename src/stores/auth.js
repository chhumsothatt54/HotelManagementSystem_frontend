import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "@/api/http"; // កែ path តាម project របស់អ្នក

export const useAuthStore = defineStore("auth", () => {

    const user = ref(
        JSON.parse(localStorage.getItem("user")) || null
    );

    const token = ref(
        localStorage.getItem("token") || null
    );

    const isLogin = computed(() => !!token.value);

    const isAdmin = computed(() =>
        user.value?.role === "admin"
    );

    const isManager = computed(() =>
        user.value?.role === "manager"
    );

    const isCustomer = computed(() =>
        user.value?.role === "customer"
    );

    async function login(email, password) {

        try {

            const res = await api.post("/auth/login", {
                email,
                password,
            });
            console.log("API Response:", res.data);
            if (!res.data?.token) {

                throw new Error(
                    res.data?.message || "Login failed"
                );
            }
            user.value = res.data.user;
            token.value = res.data.token;
            console.log("token", token.value);
            localStorage.setItem(
                "token",
                token.value
            );
            localStorage.setItem(
                "user",
                JSON.stringify(user.value)
            );
            return res.data;
        } catch (error) {

            console.log(
                "Login API Error:",
                error.response?.data
            );
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
    };

});