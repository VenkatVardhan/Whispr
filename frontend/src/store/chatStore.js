import {create} from "zustand"
import toast from "react-hot-toast"
import { axiosInstance } from "../lib/axios"
import useAuthStore from "./authStore"


const chatStore = (set,get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: false })
    try {
      const res = await axiosInstance.get('/messages/users')
      set({ users: res.data })
    } catch (error) {
      console.log('error in getUsers action ', error)
      toast.error(error.response.data.message)
    } finally {
      set({ isUsersLoading: false })
    }
  },
  getMessages: async (userId) => {
    set({ isMessagesLoading: true })
    try {
      const res = await axiosInstance.get(`/messages/${userId}`)
      set({ messages: res.data })
    } catch (error) {
      console.log('error in getMessages action ', error)
      toast.error(error.response.data.message)
    } finally {
      set({ isMessagesLoading: false })
    }
  },
  sendMessage:async (messageData)=>{
    try {
        const {selectedUser,messages} =get()
        const res=await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData)
        set({messages:[...messages,res.data]})

    } catch (error) {
        toast.error(error.response.data.message)
    }

  },
  setSelectedUser:(selectedUser)=>{
    set({selectedUser})
  },
  subscribeToMessages:()=>{
    const {selectedUser,messages}=get()

    if(!selectedUser) return 
    const socket =useAuthStore.getState().socket
    if (!socket) {
        console.error('Socket is not initialized.')
        return
      }
    socket.on("newMessage",(newMessage)=>{
      if(newMessage.senderId!==selectedUser._id) return //check isMessage sent from selected user
      console.log("socket responded to newMessage")
      set({messages:[...get().messages,newMessage]})
    })

    socket.on("newMessage")
  },
  unsubscribeFromMessages:()=>{
    const socket = useAuthStore.getState().socket
    socket.off("newMessage")
  }
})


const useChatStore = create(chatStore)
export default useChatStore