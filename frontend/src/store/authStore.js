import { create } from "zustand";

import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";


const authStore =(set,get)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers:[],

    checkAuth:async (state)=>{
        try {
            const res = await axiosInstance.get("/auth/check")
            set({authUser:res.data})
            console.log("after checkAuth response is ",res.data,"and authUser id ",get().authUser)
            
            
        } catch (error) {
            console.log("Error in checkAuth-authStore",error)
            set({authUser:null})
        }
        finally{
            set({isCheckingAuth:false})
        }
    },
    signup:async(data)=>{
        set({ isSigningUp: true })
        try {
            
            const res = await axiosInstance.post("/auth/signup",data)
            set({authUser:res.data})
            toast.success("Account Created Successful")

            
        } catch (error) {
            console.log("Error in signup action",error)
            toast.error(error.response.data.message)
            
        }
        finally{
            set({ isSigningUp: false })

        }
    },
    logout:async()=>{
        try {
            await axiosInstance.post("/auth/logout")
            set({authUser:null})
            toast.success("Logout Successful")
        } catch (error) {
            toast.error("Something Went Wrong")
            
        }

    },
    login:async(data)=>{
        set({isLoggingIn:true})
        try {
            const res = await axiosInstance.post("/auth/login",data)
            set({authUser:res.data})
            toast.success("Logging in  Successful")

        } catch (error) {
            console.log('Error in login action', error)
            toast.error(error.response.data.message)
            
        }
        finally{
            set({isLoggingIn:false})
        }
    },
    updateProfile:async(data)=>{
        set({isUpdatingProfile:true})
        try {
            const res = await axiosInstance.put("/auth/update-profile",data)
            set({ authUser: res.data })
            console.log(res)
            toast.success("Profile updated successfully")

            
        } catch (error) {
            console.log("Error In updateProfile action",error)
            toast.error(error.response.data.message)
            
        }
        finally{
            set({isUpdatingProfile:false})
        }
    }

    
})
const useAuthStore=create(authStore)

export default useAuthStore