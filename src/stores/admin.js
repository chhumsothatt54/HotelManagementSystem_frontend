import api from "@/api/http";
import { defineStore } from "pinia";
import {ref, toHandlerKey} from 'vue'
export const useAdminStore = defineStore('admin',()=>{
    const dashboard = ref([]);
    const users = ref([]);
    const userByid = ref([]);
    const managers = ref([]);
    const hotelsManager = ref([]);

    const getDashboard = async()=>{
        try {
            let res = await api.get('/admin/dashboard');
            dashboard.value = res.data;
        } catch (error) {
            throw error;
        }
    }

    async function getUser() {
        try {
            let res = await api.get('/admin/users');
            users.value = res.data?.data;
        } catch (error) {
            throw error;
        }
    }

    // note
    //====manager user
    async function userDetail(id) {
        try {
            let res = await api.get(`/admin/users/${id}`);
            userByid.value = res.data?.data;
        } catch (error) {
         throw error;
        }
    }

    async function updateStatus(id,status) {
        try {
            let res = await api.patch(`/admin/users/${id}/status`,{
                status
            })

            return "update successfully";
        } catch (error) {
            throw error
        }
    }
    // manager hotel
    async function getManagers(){
        try {
            let res = await api.get('/admin/manager');
            managers.value = res.data?.data;

        } catch (error) {
            throw error;
        }
    }

    async function mangerStatus(id,status){
        try {
            let res = await api.patch(`/admin//managers/${id}/status`,{
                status
            });

            return res;
        } catch (error) {
            throw error;
        }
    }

    async function hotels() {
        try {
            let res = await api.get('/admin/hotels');
            hotelsManager.value = res.data?.data;

        } catch (error) {
            throw error;
        }
    }

    return {
        getDashboard,
        dashboard,

        users,
        getUser,

        userDetail,
        userByid,

        updateStatus,
        getManagers,
        mangerStatus,
        hotels,
        hotelsManager,
        managers
    }
})