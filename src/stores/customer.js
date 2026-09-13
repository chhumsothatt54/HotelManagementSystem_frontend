import api from "@/api/http";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCustomerStore = defineStore("customer", () => {
  // State
  const hotels = ref([]);
  const currentHotel = ref(null);
  const hotelRooms = ref([]);
  const searchResults = ref([]);
  const bookings = ref([]);
  const currentBooking = ref(null);
  const notifications = ref([]);
  const profile = ref(null);
  
  const loading = ref(false);
  const error = ref(null);

  // Helper
  const getErrorMessage = (err, defaultMsg) => err.response?.data?.message || defaultMsg;

  // actions

  // Hotels & Rooms
  const getHotels = async (params = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get("/v1/hotels", { params });
      hotels.value = response.data.data || response.data;
      console.log(hotels.value);
      
      return response.data;
    } catch (err) {
      error.value = getErrorMessage(err, "Failed to load hotels");
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getHotelDetail = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get(`/v1/hotels/${id}`);
      currentHotel.value = response.data.data || response.data;
      return response.data;
    } catch (err) {
      error.value = getErrorMessage(err, "Failed to load hotel detail");
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getHotelRooms = async (hotelId) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get(`/v1/hotels/${hotelId}/rooms`);
      hotelRooms.value = response.data.data || response.data;
      return response.data;
    } catch (err) {
      error.value = getErrorMessage(err, "Failed to load hotel rooms");
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const searchRooms = async (params = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get("/v1/rooms/search", { params });
      searchResults.value = response.data.data || response.data;
      return response.data;
    } catch (err) {
      error.value = getErrorMessage(err, "Failed to search rooms");
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  const searchByLocation = async (params = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get("/v1/rooms/search-by-location", { params });
      searchResults.value = response.data.data || response.data;
      return response.data;
    } catch (err) {
      error.value = getErrorMessage(err, "Failed to search by location");
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const searchByRoom = async (params = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get("/v1/rooms/search-by-room", { params });
      searchResults.value = response.data.data || response.data;
      return response.data;
    } catch (err) {
      error.value = getErrorMessage(err, "Failed to search by room");
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const checkAvailability = async (params = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get("/v1/rooms/availability", { params });
      return response.data;
    } catch (err) {
      error.value = getErrorMessage(err, "Failed to check availability");
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Bookings
  const createBooking = async (bookingData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post("/v1/bookings", bookingData);
      return response.data;
    } catch (err) {
      error.value = getErrorMessage(err, "Failed to create booking");
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getBookingHistory = async (params = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get("/v1/customer/bookings", { params });
      bookings.value = response.data.data || response.data;
      return response.data;
    } catch (err) {
      error.value = getErrorMessage(err, "Failed to load bookings");
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getBookingDetail = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get(`/v1/customer/bookings/${id}`);
      currentBooking.value = response.data.data || response.data;
      return response.data;
    } catch (err) {
      error.value = getErrorMessage(err, "Failed to load booking details");
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const cancelBooking = async (id, reason) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.patch(`/v1/customer/bookings/${id}/cancel`, { reason });
      return response.data;
    } catch (err) {
      error.value = getErrorMessage(err, "Failed to cancel booking");
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const bookingConfirmation = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get(`/v1/customer/bookings/${id}/confirmation`);
      return response.data;
    } catch (err) {
      error.value = getErrorMessage(err, "Failed to get booking confirmation");
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const requestRefund = async (id, data = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post(`/v1/customer/bookings/${id}/refund`, data);
      return response.data;
    } catch (err) {
      error.value = getErrorMessage(err, "Failed to request refund");
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createPayment = async (data) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post("/v1/payments", data);
      return response.data;
    } catch (err) {
      error.value = getErrorMessage(err, "Failed to create payment");
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createReview = async (hotelId, data) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post(`/v1/customer/hotels/${hotelId}/reviews`, data);
      return response.data;
    } catch (err) {
      error.value = getErrorMessage(err, "Failed to submit review");
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Profile
  const getProfile = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get("/v1/profile");
      profile.value = response.data.data || response.data;
      return response.data;
    } catch (err) {
      error.value = getErrorMessage(err, "Failed to load profile");
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateProfile = async (data) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.put("/v1/profile", data);
      profile.value = response.data.data || response.data;
      return response.data;
    } catch (err) {
      error.value = getErrorMessage(err, "Failed to update profile");
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Notifications
  const getNotifications = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get("/v1/notifications");
      notifications.value = response.data.data || response.data;
      return response.data;
    } catch (err) {
      error.value = getErrorMessage(err, "Failed to load notifications");
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const readNotification = async (id) => {
    try {
      const response = await api.patch(`/v1/notifications/${id}/read`);
      return response.data;
    } catch (err) {
      error.value = getErrorMessage(err, "Failed to read notification");
      throw err;
    }
  };

  const readAllNotifications = async () => {
    try {
      const response = await api.patch("/v1/notifications/read-all");
      return response.data;
    } catch (err) {
      error.value = getErrorMessage(err, "Failed to mark notifications as read");
      throw err;
    }
  };

  return {
    hotels,
    currentHotel,
    hotelRooms,
    searchResults,
    bookings,
    currentBooking,
    notifications,
    profile,
    loading,
    error,
    getHotels,
    getHotelDetail,
    getHotelRooms,
    searchRooms,
    searchByLocation,
    searchByRoom,
    checkAvailability,
    createBooking,
    getBookingHistory,
    getBookingDetail,
    cancelBooking,
    bookingConfirmation,
    requestRefund,
    createPayment,
    createReview,
    getProfile,
    updateProfile,
    getNotifications,
    readNotification,
    readAllNotifications,
  };
});