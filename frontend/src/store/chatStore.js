import {create} from "zustand"
import toast from "react-hot-toast"
import { axiosInstance } from "../lib/axios"


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
  }
})


const useChatStore = create(chatStore)
export default useChatStore