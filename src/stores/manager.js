import { defineStore } from "pinia";
import api from "@/api/http"; // កែ path តាម project របស់អ្នក

export const useManagerStore = defineStore("manager", {
    state: () => ({
        dashboard: null,
        hotel: null,
        roomTypes: [],
        rooms: [],
        amenities: [],
        bookings: [],
        reviews: [],
        revenueReport: null,
        occupancyReport: null,

        loading: false,
        error: null,
    }),

    actions: {

        /*
        |--------------------------------------------------------------------------
        | 1. Dashboard
        |--------------------------------------------------------------------------
        */

        async getDashboard() {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.get("/manager/dashboard");

                this.dashboard = response.data.data;

                return response.data;
            } catch (error) {
                this.error =
                    error.response?.data?.message ||
                    "Failed to load dashboard.";

                throw error;
            } finally {
                this.loading = false;
            }
        },


        /*
        |--------------------------------------------------------------------------
        | 2. Hotel
        |--------------------------------------------------------------------------
        */

        async getMyHotel() {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.get("/manager/hotel");

                this.hotel = response.data.data;

                return response.data;
            } catch (error) {
                this.error =
                    error.response?.data?.message ||
                    "Failed to load hotel.";

                throw error;
            } finally {
                this.loading = false;
            }
        },


        async createHotel(hotelData) {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.post(
                    "/manager/hotel",
                    hotelData
                );

                this.hotel = response.data.data;

                return response.data;
            } catch (error) {
                this.error =
                    error.response?.data?.message ||
                    "Failed to create hotel.";

                throw error;
            } finally {
                this.loading = false;
            }
        },


        async updateHotel(id, hotelData) {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.put(
                    `/manager/hotel/${id}`,
                    hotelData
                );

                this.hotel = response.data.data;

                return response.data;
            } catch (error) {
                this.error =
                    error.response?.data?.message ||
                    "Failed to update hotel.";

                throw error;
            } finally {
                this.loading = false;
            }
        },


        async uploadHotelImage(imageFile, isPrimary = false) {
            this.loading = true;
            this.error = null;

            try {
                const formData = new FormData();

                formData.append("image", imageFile);
                formData.append(
                    "is_primary",
                    isPrimary ? "1" : "0"
                );

                const response = await api.post(
                    "/manager/hotel/images",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                return response.data;
            } catch (error) {
                this.error =
                    error.response?.data?.message ||
                    "Failed to upload hotel image.";

                throw error;
            } finally {
                this.loading = false;
            }
        },


        /*
        |--------------------------------------------------------------------------
        | 3. Room Types
        |--------------------------------------------------------------------------
        */

        async getRoomTypes() {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.get(
                    "/manager/room-types"
                );

                this.roomTypes = response.data.data;

                return response.data;
            } catch (error) {
                this.error =
                    error.response?.data?.message ||
                    "Failed to load room types.";

                throw error;
            } finally {
                this.loading = false;
            }
        },


        async createRoomType(roomTypeData) {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.post(
                    "/manager/room-types",
                    roomTypeData
                );

                this.roomTypes.unshift(
                    response.data.data
                );

                return response.data;
            } catch (error) {
                this.error =
                    error.response?.data?.message ||
                    "Failed to create room type.";

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
                    roomTypeData
                );

                const index = this.roomTypes.findIndex(
                    roomType => roomType.id === id
                );

                if (index !== -1) {
                    this.roomTypes[index] =
                        response.data.data;
                }

                return response.data;
            } catch (error) {
                this.error =
                    error.response?.data?.message ||
                    "Failed to update room type.";

                throw error;
            } finally {
                this.loading = false;
            }
        },


        async deleteRoomType(id) {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.delete(
                    `/manager/room-types/${id}`
                );

                this.roomTypes =
                    this.roomTypes.filter(
                        roomType => roomType.id !== id
                    );

                return response.data;
            } catch (error) {
                this.error =
                    error.response?.data?.message ||
                    "Failed to delete room type.";

                throw error;
            } finally {
                this.loading = false;
            }
        },


        /*
        |--------------------------------------------------------------------------
        | 4. Rooms
        |--------------------------------------------------------------------------
        */

        async getRooms() {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.get(
                    "/manager/rooms"
                );

                this.rooms = response.data.data;

                return response.data;
            } catch (error) {
                this.error =
                    error.response?.data?.message ||
                    "Failed to load rooms.";

                throw error;
            } finally {
                this.loading = false;
            }
        },


        async createRoom(roomData) {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.post(
                    "/manager/rooms",
                    roomData
                );

                this.rooms.unshift(
                    response.data.data
                );

                return response.data;
            } catch (error) {
                this.error =
                    error.response?.data?.message ||
                    "Failed to create room.";

                throw error;
            } finally {
                this.loading = false;
            }
        },


        async updateRoom(id, roomData) {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.put(
                    `/manager/rooms/${id}`,
                    roomData
                );

                const index = this.rooms.findIndex(
                    room => room.id === id
                );

                if (index !== -1) {
                    this.rooms[index] =
                        response.data.data;
                }

                return response.data;
            } catch (error) {
                this.error =
                    error.response?.data?.message ||
                    "Failed to update room.";

                throw error;
            } finally {
                this.loading = false;
            }
        },


        async deleteRoom(id) {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.delete(
                    `/manager/rooms/${id}`
                );

                this.rooms = this.rooms.filter(
                    room => room.id !== id
                );

                return response.data;
            } catch (error) {
                this.error =
                    error.response?.data?.message ||
                    "Failed to delete room.";

                throw error;
            } finally {
                this.loading = false;
            }
        },


        /*
        |--------------------------------------------------------------------------
        | 5. Amenities
        |--------------------------------------------------------------------------
        */

        async getAmenities() {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.get(
                    "/manager/amenities"
                );

                this.amenities = response.data.data;

                return response.data;
            } catch (error) {
                this.error =
                    error.response?.data?.message ||
                    "Failed to load amenities.";

                throw error;
            } finally {
                this.loading = false;
            }
        },


        async attachAmenity(amenityId) {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.post(
                    `/manager/amenities/${amenityId}`
                );

                return response.data;
            } catch (error) {
                this.error =
                    error.response?.data?.message ||
                    "Failed to attach amenity.";

                throw error;
            } finally {
                this.loading = false;
            }
        },


        async detachAmenity(amenityId) {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.delete(
                    `/manager/amenities/${amenityId}`
                );

                this.amenities =
                    this.amenities.filter(
                        amenity => amenity.id !== amenityId
                    );

                return response.data;
            } catch (error) {
                this.error =
                    error.response?.data?.message ||
                    "Failed to remove amenity.";

                throw error;
            } finally {
                this.loading = false;
            }
        },


        /*
        |--------------------------------------------------------------------------
        | 6. Bookings
        |--------------------------------------------------------------------------
        */

        async getBookings(page = 1) {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.get(
                    `/manager/bookings?page=${page}`
                );

                this.bookings = response.data.data;

                return response.data;
            } catch (error) {
                this.error =
                    error.response?.data?.message ||
                    "Failed to load bookings.";

                throw error;
            } finally {
                this.loading = false;
            }
        },


        async getBooking(id) {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.get(
                    `/manager/bookings/${id}`
                );

                return response.data;
            } catch (error) {
                this.error =
                    error.response?.data?.message ||
                    "Failed to load booking.";

                throw error;
            } finally {
                this.loading = false;
            }
        },


        async updateBookingStatus(id, status) {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.put(
                    `/manager/bookings/${id}/status`,
                    {
                        status: status
                    }
                );

                const updatedBooking =
                    response.data.data;

                const index = this.bookings.findIndex(
                    booking => booking.id === id
                );

                if (index !== -1) {
                    this.bookings[index] =
                        updatedBooking;
                }

                return response.data;
            } catch (error) {
                this.error =
                    error.response?.data?.message ||
                    "Failed to update booking status.";

                throw error;
            } finally {
                this.loading = false;
            }
        },


        /*
        |--------------------------------------------------------------------------
        | 7. Reviews
        |--------------------------------------------------------------------------
        */

        async getReviews(page = 1) {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.get(
                    `/manager/reviews?page=${page}`
                );

                this.reviews = response.data.data;

                return response.data;
            } catch (error) {
                this.error =
                    error.response?.data?.message ||
                    "Failed to load reviews.";

                throw error;
            } finally {
                this.loading = false;
            }
        },


        /*
        |--------------------------------------------------------------------------
        | 8. Reports
        |--------------------------------------------------------------------------
        */

        async getRevenueReport() {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.get(
                    "/manager/reports/revenue"
                );

                this.revenueReport = response.data;

                return response.data;
            } catch (error) {
                this.error =
                    error.response?.data?.message ||
                    "Failed to load revenue report.";

                throw error;
            } finally {
                this.loading = false;
            }
        },


        async getOccupancyReport() {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.get(
                    "/manager/reports/occupancy"
                );

                this.occupancyReport = response.data;

                return response.data;
            } catch (error) {
                this.error =
                    error.response?.data?.message ||
                    "Failed to load occupancy report.";

                throw error;
            } finally {
                this.loading = false;
            }
        },


        /*
        |--------------------------------------------------------------------------
        | Helpers
        |--------------------------------------------------------------------------
        */

        clearError() {
            this.error = null;
        },


        resetStore() {
            this.dashboard = null;
            this.hotel = null;
            this.roomTypes = [];
            this.rooms = [];
            this.amenities = [];
            this.bookings = [];
            this.reviews = [];
            this.revenueReport = null;
            this.occupancyReport = null;

            this.loading = false;
            this.error = null;
        }
    }
});
