import { useAuthStore } from "@/stores/auth";
import axios from "axios";

const api = axios.create({
  baseURL : 'http://127.0.0.1:8000/api',
  headers : {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(config =>{
  let auth = useAuthStore()
  if(auth.token){
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

export default api