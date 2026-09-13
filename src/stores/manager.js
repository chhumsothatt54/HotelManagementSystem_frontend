import { defineStore } from "pinia";
import api from "@/api/http"; // កែ path តាម project របស់អ្នក

function normalizePaginated(paginator) {
  if (!paginator) {
    return { items: [], meta: null };
  }

  if (Array.isArray(paginator)) {
    return { items: paginator, meta: null };
  }

  const { data, ...meta } = paginator;

  return {
    items: data ?? [],
    meta,
  };
}

function getErrorMessage(error, defaultMessage) {
  return error.response?.data?.message || defaultMessage;
}

export const useManagerStore = defineStore("manager", {
  state: () => ({
    dashboard: null,
    hotel: null,

    roomTypes: [],
    roomTypesMeta: null,

    rooms: [],
    roomsMeta: null,

    amenities: [],
    amenitiesMeta: null,

    // Master amenity list
    amenityList: [],

    bookings: [],
    bookingsMeta: null,
    currentBooking: null,

    reviews: [],
    reviewsMeta: null,

    revenueReport: null,
    occupancyReport: null,

    profile: null,
    images: [],
    roomImages: [],
    roomImagesMeta: null,

    roomAmenities: [],
    availableAmenities: [],
    amenitiesPagination: null,

    loading: false,
    error: null,
  }),

  getters: {
    hasHotel: (state) => !!state.hotel,
    primaryHotelImage: (state) =>
      state.hotel?.images?.find((img) => img.is_primary) || null,
    getBookingById: (state) => (id) => state.bookings.find((b) => b.id === id),
  },

  actions: {
    /* Dashboard */
    async getDashboard() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get("/manager/dashboard");
        this.dashboard = response.data.data;
        return response.data;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to load dashboard.");
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getProfile() {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get("/me");

        this.profile = response.data.user;

        return response.data;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to load profile.");

        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateProfile(profileData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.put("/update/profile", profileData);

        this.profile = response.data.user;

        return response.data;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to update profile.");

        throw error;
      } finally {
        this.loading = false;
      }
    },

    /* Hotel */
    async getMyHotel() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get("/manager/hotel");
        this.hotel = response.data.data;
        return response.data;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to load hotel.");
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createHotel(hotelData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post("/manager/hotel", hotelData);
        this.hotel = response.data.data;
        return response.data;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to create hotel.");
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateHotel(id, hotelData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.put(`/manager/hotel/${id}`, hotelData);
        this.hotel = response.data.data;
        return response.data;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to update hotel.");
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async uploadHotelImages(formData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.post("/manager/hotel/images", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Add newly uploaded image immediately
        if (response.data?.data) {
          this.images.unshift(response.data.data);
        }

        return response.data;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to upload hotel image.");

        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteHotelImage(imageId) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.delete(`/manager/hotel/images/${imageId}`);

        // Remove the deleted image immediately from the UI
        this.images = this.images.filter((image) => image.id !== imageId);

        return response.data;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to delete hotel image.");

        throw error;
      } finally {
        this.loading = false;
      }
    },
    async getHotelImages() {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get("/manager/hotel/images");

        const data = response.data.data;

        this.images = Array.isArray(data)
          ? data
          : data?.data || data?.items || [];

        return response.data;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to load hotel images.");

        throw error;
      } finally {
        this.loading = false;
      }
    },

    //room image
    async getRoomImages(roomTypeId) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get(
          `/manager/room-types/${roomTypeId}/images`,
        );

        this.roomImages = response.data.data || [];

        return response.data;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to load room images.");
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async uploadRoomImages(formData) {
      this.loading = true;
      this.error = null;

      try {
        const roomTypeId = formData.get("room_type_id");

        const response = await api.post(
          `/manager/room-types/${roomTypeId}/images`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        await this.getRoomImages(roomTypeId);

        return response.data;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to upload room images.");
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteRoomImage(imageId, roomTypeId) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.delete(`/manager/room-images/${imageId}`);

        this.roomImages = this.roomImages.filter(
          (image) => image.id !== imageId,
        );

        return response.data;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to delete room image.");
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /* Room Types */
    async getRoomTypes(page = 1) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`/manager/room-types?page=${page}`);
        const { items, meta } = normalizePaginated(response.data.data);
        this.roomTypes = items;
        this.roomTypesMeta = meta;
        return response.data;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to load room types.");
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createRoomType(roomTypeData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post("/manager/room-types", roomTypeData);
        this.roomTypes.unshift(response.data.data);
        return response.data;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to create room type.");
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateRoomType(id, roomTypeData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.put(
          `/manager/room-types/${id}`,
          roomTypeData,
        );
        const index = this.roomTypes.findIndex((rt) => rt.id === id);
        if (index !== -1) {
          this.roomTypes[index] = response.data.data;
        }
        return response.data;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to update room type.");
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteRoomType(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.delete(`/manager/room-types/${id}`);
        this.roomTypes = this.roomTypes.filter((rt) => rt.id !== id);
        return response.data;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to delete room type.");
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /* Rooms */
    async getRooms(page = 1) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get("/manager/rooms", {
          params: { page },
        });

        console.log("ROOMS:", response.data);

        const { items, meta } = normalizePaginated(response.data.data);

        this.rooms = items;
        this.roomsMeta = meta;

        return response.data;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to load rooms.");
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createRoom(roomData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post("/manager/rooms", roomData);
        this.rooms.unshift(response.data.data);
        return response.data;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to create room.");
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateRoom(id, roomData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.put(`/manager/rooms/${id}`, roomData);
        const index = this.rooms.findIndex((r) => r.id === id);
        if (index !== -1) {
          this.rooms[index] = response.data.data;
        }
        return response.data;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to update room.");
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteRoom(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.delete(`/manager/rooms/${id}`);
        this.rooms = this.rooms.filter((r) => r.id !== id);
        return response.data;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to delete room.");
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /* Room Images */

    async getRoomImages(roomTypeId) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get(
          `/manager/room-types/${roomTypeId}/images`,
        );

        const data = response.data.data;

        this.roomImages = Array.isArray(data)
          ? data
          : data?.data || data?.items || [];

        return response.data;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to load room images.");

        throw error;
      } finally {
        this.loading = false;
      }
    },

    async uploadRoomImages(formData) {
      this.loading = true;
      this.error = null;

      try {
        const roomTypeId = formData.get("room_type_id");

        const response = await api.post(
          `/manager/room-types/${roomTypeId}/images`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        // Refresh images after upload
        await this.getRoomImages(roomTypeId);

        return response.data;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to upload room images.");

        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteRoomImage(imageId, roomTypeId) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.delete(`/manager/room-images/${imageId}`);

        // Remove immediately from UI
        this.roomImages = this.roomImages.filter(
          (image) => image.id !== imageId,
        );

        return response.data;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to delete room image.");

        throw error;
      } finally {
        this.loading = false;
      }
    },

    //amenity management

    async getRoomAmenities(page = 1) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get("/manager/amenities", {
          params: { page },
        });

        console.log("ROOM AMENITIES RESPONSE:", response.data);

        const data = response.data.data;

        this.roomAmenities = data.rooms?.data || [];
        this.availableAmenities = data.amenities || [];
        this.amenitiesPagination = data.rooms || null;

        console.log("Rooms with amenities:", this.roomAmenities);
        console.log("Available amenities:", this.availableAmenities);

        return response.data;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to load room amenities.");

        throw error;
      } finally {
        this.loading = false;
      }
    },

    /* Amenity Management */

    async getAmenityList() {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get("/manager/amenities");

        this.amenityList = response.data.data.amenities || [];

        return response.data;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to load amenities.");

        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createAmenity(amenityData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.post("/manager/amenities", amenityData);

        if (response.data?.data) {
          this.amenityList.push(response.data.data);
        }

        return response.data;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to create amenity.");

        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateAmenity(id, amenityData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.put(`/manager/amenities/${id}`, amenityData);

        const index = this.amenityList.findIndex(
          (amenity) => amenity.id === id,
        );

        if (index !== -1 && response.data?.data) {
          this.amenityList[index] = response.data.data;
        }

        return response.data;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to update amenity.");

        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteAmenity(id) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.delete(`/manager/amenities/${id}`);

        this.amenityList = this.amenityList.filter(
          (amenity) => amenity.id !== id,
        );

        return response.data;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to delete amenity.");

        throw error;
      } finally {
        this.loading = false;
      }
    },

    /* Amenities */

    async getAmenities() {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get("/manager/amenities");

        console.log("AMENITY API RESPONSE:", response.data);

        // Backend:
        // data.rooms.data = rooms
        // data.amenities = available amenities

        this.amenities = response.data.data.rooms.data;
        this.availableAmenities = response.data.data.amenities;

        this.amenitiesMeta = {
          current_page: response.data.data.rooms.current_page,
          last_page: response.data.data.rooms.last_page,
          total: response.data.data.rooms.total,
        };

        console.log("Rooms with amenities loaded:", this.amenities);
        console.log("Available amenities:", this.availableAmenities);

        return response.data;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to load room amenities.");

        throw error;
      } finally {
        this.loading = false;
      }
    },

    async attachAmenity(roomId, amenityId) {
  this.error = null;

  try {
    const response = await api.post(
      `/manager/rooms/${roomId}/amenities/${amenityId}`
    );

    return response.data;
  } catch (error) {
    this.error = getErrorMessage(
      error,
      "Failed to attach amenity."
    );

    throw error;
  }
},

async detachAmenity(roomId, amenityId) {
  this.error = null;

  try {
    const response = await api.delete(
      `/manager/rooms/${roomId}/amenities/${amenityId}`
    );

    return response.data;
  } catch (error) {
    this.error = getErrorMessage(
      error,
      "Failed to remove amenity."
    );

    throw error;
  }
},



    //update profile
    async updateProfile(profileData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.put("/update/profile", profileData);

        this.profile = response.data.user;

        return response.data;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to update profile.");

        throw error;
      } finally {
        this.loading = false;
      }
    },

    /* Bookings */
    async getBookings(page = 1) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get(`/manager/bookings?page=${page}`);
        const { items, meta } = normalizePaginated(response.data);

        this.bookings = items;
        this.bookingsMeta = meta;

        return response.data;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to load bookings.");

        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getBooking(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`/manager/bookings/${id}`);
        this.currentBooking = response.data.data;
        return response.data;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to load booking.");
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateBookingStatus(id, status) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.put(`/manager/bookings/${id}/status`, {
          status,
        });
        const updatedBooking = response.data.data;

        const index = this.bookings.findIndex((b) => b.id === id);
        if (index !== -1) {
          this.bookings[index] = updatedBooking;
        }

        if (this.currentBooking?.id === id) {
          this.currentBooking = updatedBooking;
        }

        return response.data;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to update booking status.");
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /* Reviews */
    async getReviews(page = 1) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`/manager/reviews?page=${page}`);
        const { items, meta } = normalizePaginated(response.data);
        this.reviews = items;
        this.reviewsMeta = meta;
        return response.data;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to load reviews.");
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /* Reports */
    async getRevenueReport() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get("/manager/reports/revenue");
        this.revenueReport = response.data.data;
        return response.data;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to load revenue report.");
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getOccupancyReport() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get("/manager/reports/occupancy");
        this.occupancyReport = response.data.data;
        return response.data;
      } catch (error) {
        this.error = getErrorMessage(error, "Failed to load occupancy report.");
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /* Helpers */
    clearError() {
      this.error = null;
    },

    resetStore() {
      this.$reset();
    },
  },
});
