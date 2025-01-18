import { create } from "zustand";

import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";


const authStore =(set)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,

    checkAuth:async ()=>{
        try {
            const res = await axiosInstance.get("/auth/check")
            set({
                authUser:res.data
            })
            
            
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
    }

    
})
const useAuthStore=create(authStore)

export default useAuthStore