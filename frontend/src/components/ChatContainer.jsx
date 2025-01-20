import React, { useEffect } from 'react'
import useChatStore from '../store/chatStore'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import MessageSkeleton from '../skeletons/MessageSkeleton'
import avatar from '../images/avatar.jpg'
import useAuthStore from '../store/authStore'
import { formatMessageTime } from '../lib/utils'

const ChatContainer = () => {
    const {messages,getMessages, isMessageLoading, selectedUser,subscribeToMessages,unsubscribeFromMessages} =useChatStore()
    const {authUser}=useAuthStore()
    const messageRef = React.useRef(null)

    useEffect(()=>{
        getMessages(selectedUser._id)
        subscribeToMessages()

        return ()=>unsubscribeFromMessages()
    },[selectedUser._id,getMessages,authUser,subscribeToMessages,unsubscribeFromMessages]) 

    useEffect(()=>{
      if(messageRef.current && messages)
      messageRef.current.scrollIntoView({behavior:"smooth"})
    },[messages])
    if (isMessageLoading) {
      return (
        <div className='flex flex-col overflow-auto flex-1'>
          <ChatHeader />
          <MessageSkeleton />
          <MessageInput />
        </div>
      )
    }
  return (
    <div className='flex flex-col overflow-auto flex-1'>
      <ChatHeader />
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.map((message) => {
              console.log('Sender ID:', message.senderId)
              console.log('Auth :', authUser)
              return (
                <div
                  key={message._id}
                  ref={messageRef}
                  className={`chat ${
                    message.senderId === authUser._id
                      ? 'chat-end'
                      : 'chat-start'
                  }`}
                >
                  <div className=' chat-image avatar'>
                    <div className='size-10 rounded-full border'>
                      <img
                        src={
                          message.senderId === authUser._id
                            ? authUser.profilePic || avatar
                            : selectedUser.profilePic || avatar
                        }
                        alt='profile pic'
                      />
                    </div>
                  </div>
                  <div className='chat-header mb-1'>
                    <time className='text-xs opacity-50 ml-1'>
                      {formatMessageTime(message.createdAt)}
                    </time>
                  </div>
                  <div
                    className={`chat-bubble flex flex-col  ${message.senderId === authUser._id ?'bg-primary text-primary-content  text-primary-content/90'
                               :'bg-base-200 text-base-content/90'
                                }`}
                  >
                    {message.image && (
                      <img
                        src={message.image}
                        alt='Attachment'
                        className='sm:max-w-[200px] rounded-md mb-2'
                      />
                    )}
                    {message.text && <p>{message.text}</p>}
                  </div>
                </div>
              )})}
      </div>
      <MessageInput />
    </div>
  )

}

export default ChatContainer