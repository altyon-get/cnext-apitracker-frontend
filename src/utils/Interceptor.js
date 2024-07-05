import axios from 'axios'


export const baseAPI=axios.create({
    baseURL:"http://127.0.0.1:8000/api"
})


baseAPI.interceptors.request.use((req)=>{
    if(localStorage.getItem('token')){
        req.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    }
})