import { create } from "zustand";

import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

import {io} from "socket.io-client"
const BASE_URL ="http://localhost:5001"
const authStore =(set,get)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers:[],
    socket:null,

    checkAuth:async ()=>{
        try {
            const res = await axiosInstance.get("/auth/check")
            set({authUser:res.data})
            get().connectSocket()            
            
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
            get.connectSocket()

            
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
            get().disconnectSocket()
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
            get().connectSocket()

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
        },
        connectSocket:()=>{
            const {authUser} = get()
            if(!authUser || get().socket?.connected) return;
            const socket =io(BASE_URL,{
                query:{
                    userId:authUser._id
                }
            })

            socket.connect();

            socket.on("getOnlineUsers",(userIds)=>{
                set({onlineUsers:userIds})
            })
            console.log("user connected",socket?.id)
            set({socket})
        },
        disconnectSocket:()=>{
            const id  =get().socket?.id
            if(get().socket?.connected){
                get().socket.disconnect()
                console.log("user disconnected ",id)
            }
        }

    
})
const useAuthStore=create(authStore)

export default useAuthStore