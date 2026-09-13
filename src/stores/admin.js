import api from "@/api/http";
import { defineStore } from "pinia";
import { ref, toHandlerKey } from 'vue'
export const useAdminStore = defineStore('admin', () => {

    // ==========================================
    // STATES
    // ==========================================
    const dashboard = ref([]);
    const users = ref([]);
    const userByid = ref([]);
    const managers = ref([]);
    const hotelByid = ref([]);
    const roomType = ref([]);
    const rooms = ref([]);
    const amenities = ref([]);
    const bookings = ref([]);
    const singleBooking = ref([]);
    const payments = ref([]);
    const reviews = ref([]);
    const revenueReport = ref([]);
    const occupancyReport = ref([]);
    const notification = ref([]);

    // Hotel Manager
    const hotelsManager = ref([]);
    const singleHotel= ref([]);

    // Hotel
    const allHotel = ref([]);


    // ==========================================
    // ACTIONS
    // ==========================================

    // 1. Dashboard
    const getDashboard = async () => {
        try {
            let res = await api.get('/admin/dashboard');
            dashboard.value = res.data;
            console.log(dashboard.value);
            
        } catch (error) {
            throw error;
        }
    }

    // 2. Manage Users
    async function getUser(params = {}) {
        try {
            let res = await api.get('/admin/users', { params });
            users.value = res.data?.data;
        } catch (error) {
            throw error;
        }
    }

    async function userDetail(id){
        try {
            let res = await api.get(`/admin/users/${id}`);
            userByid.value = res.data?.data;
            return userByid.value;
        } catch (error) {
            throw error;
        }
    }

    async function updateStatus(id,status){
        try {
            let res = await api.patch(`/admin/users/${id}/status`,{
                status
            })
            return res.data;
        } catch (error) {
            throw error;
        }
    }

    // 3. Manage Hotel Managers
    async function getManagers(){
        try {
            let res = await api.get('admin/manager');
            managers.value = res.data?.data;
            console.log(managers.value);
            
        } catch (error) {
            throw error;
        }
    }

    async function managerStatus(id,status){
        try {
            let res = await api.patch(`/admin/managers/${id}/status`,{
                status
            })
            return res.data;
        } catch (error) {
            throw error;
        }
    }

    async function  getHotels() {
        try {
            let res = await api.get('/admin/hotels');;
            allHotel.value = res.data?.data;
            console.log(allHotel.value);
            return allHotel.value;
        } catch (error) {
            throw error;
        }
    }

    async function  hotelDetail(id) {
        try {
            let res = await api.get(`admin/hotels/${id}`);
            hotelByid.value = res.data?.data;
            console.log(hotelByid.value);
            
        } catch (error) {
            throw error;
        }
    }
    
    async function updateHotelStatus(id,status){
        try {
            let res = await api.patch(`/admin/hotels/${id}/status`,{
                status
            })
            return res.data;
        } catch (error) {
            throw error;
        }
    }

    async function deleteHotel(id){
        try {
            let res = await api.delete(`/admin/hotels/${id}`);
            return res.data;
        } catch (error) {
            throw error;
        }
    }

     // 5. Manage Room Types & Rooms (RoomTypeView.vue, RoomView.vue)
     async function getRoomTypes(){
        try {
            let res = await api.get('/admin/room-types');
            roomType.value = res.data?.data || res.data;
            console.log(roomType.value);
            
        } catch (error) {
            throw error;
        }
     }

     async function createRoomType(payload){
        try {
            let res = await api.post('/admin/room-types', payload);
            return res.data;
        } catch (error) {
            throw error;
        }
     }

     async function updateRoomType(id, payload){
        try {
            let res = await api.put(`/admin/room-types/${id}`, payload);
            return res.data;
        } catch (error) {
            throw error;
        }
     }

     async function deleteRoomType(id){
        try {
            let res = await api.delete(`/admin/room-types/${id}`);
            return res.data;
        } catch (error) {
            throw error;
        }
     }
     async function getRooms() {
        try {
            let res = await api.get('/admin/rooms');
            rooms.value = res.data?.data || res.data;
            console.log(rooms.value);
            
        } catch (error) {
            throw error;
        }
     }

     async function createRoom(payload){
        try {
            let res = await api.post('/admin/rooms', payload);
            return res.data;
        } catch (error) {
            throw error;
        }
     }

     async function updateRoom(id, payload){
        try {
            let res = await api.put(`/admin/rooms/${id}`, payload);
            return res.data;
        } catch (error) {
            throw error;
        }
     }

     async function deleteRoom(id){
        try {
            let res = await api.delete(`/admin/rooms/${id}`);
            return res.data;
        } catch (error) {
            throw error;
        }
     }
     async function getAmenity(){
        try {
            let res = await api.get('/admin/amenities');
            amenities.value = res.data?.data || res.data;
            console.log(amenities.value);
            
        } catch (error) {
            
        }
     }

     async function createAmenity(payload) {
        try {
            let res = await api.post('/admin/amenities', payload);
            return res.data;
        } catch (error) {
            throw error;
        }
     }

     async function updateAmenity(id, payload) {
        try {
            let res = await api.put(`/admin/amenities/${id}`, payload);
            return res.data;
        } catch (error) {
            throw error;
        }
     }

     async function deleteAmenity(id) {
        try {
            let res = await api.delete(`/admin/amenities/${id}`);
            return res.data;
        } catch (error) {
            throw error;
        }
     }

     async function  getBookings() {
        try {
            let res = await api.get('/admin/bookings');
            bookings.value = res.data?.data || res.data;
            console.log(bookings.value);
            
        } catch (error) {
            throw error;
        }
     }

     async function getBookingDetails(id) {
        try {
            let res = await api.get(`/admin/bookings/${id}`);
            singleBooking.value = res.data;
            console.log(singleBooking.value);
            
        } catch (error) {
            throw error;
        }
     }

     async function getPayments(){
        try {
            let res = await api.get('/admin/payments');
            payments.value = res.data?.data || res.data;
            console.log(payments.value);
            
        } catch (error) {
            throw error;
        }
     }

     async function getReviews() {
        try {
            let res = await api.get('/admin/reviews');
            reviews.value = res.data?.data || res.data;
            console.log(
                reviews.value
            );
            
        } catch (error) {
            throw error;
        }
     }

     async function  updateReviewstatus(id,status) {
        try {
            let res = await api.patch(`/admin/reviews/${id}/status`,{
                status
            })
            return res.data;
        } catch (error) {
            throw error;
        }
     }

     async function  getRevenueReport() {
        try {
            let res = await api.get('/admin/reports/revenue');
            revenueReport.value = res.data?.data || res.data;
            console.log(revenueReport.value);
            
        } catch (error) {
            throw error;
        }
     }

     async function getOccupancyReport(){
        try {
            let res = await api.get('/admin/reports/occupancy');
            occupancyReport.value = res.data?.data || res.data;
            console.log(occupancyReport.value);
            
        } catch (error) {
            throw error;
        }
     }

     async function  getNotification() {
        try {
            let res = await api.get('/admin/notifications');
            notification.value = res.data;
            console.log(notification.value);
            
        } catch (error) {
            throw error;
        }
     }

     async function updateProfile(payload) {
        try {
            let res = await api.post('/admin/profile/update', payload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return res.data;
        } catch (error) {
            throw error;
        }
     }

    return {

        // state
        dashboard,
        users,
        userByid,
        allHotel,
        hotelByid,
        managers,
        hotelsManager,
        singleHotel,
        roomType,
        rooms,
        amenities,
        bookings,
        singleBooking,
        payments,
        reviews,
        notification,
        revenueReport,
        occupancyReport,
        
        //action
        getDashboard,
        getUser,
        userDetail,
        updateStatus,
        getManagers,
        managerStatus,
        getHotels,
        hotelDetail,
        updateHotelStatus,
        deleteHotel,
        getRoomTypes,
        createRoomType,
        updateRoomType,
        deleteRoomType,
        getRooms,
        createRoom,
        updateRoom,
        deleteRoom,
        getAmenity,
        createAmenity,
        updateAmenity,
        deleteAmenity,
        getBookings,
        getBookingDetails,
        getPayments,
        getReviews,
        getRevenueReport,
        updateReviewstatus,
        getOccupancyReport,
        getNotification,
        updateProfile
    }
})