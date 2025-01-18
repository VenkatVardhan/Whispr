import userModel from "../models/user.model.js"
import messageModel from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js"

export const getUsersForSidebar=async(req,res)=>{
    try{

        const loggedUserId = req.user._id
        const users = await userModel.find({_id:{$ne:loggedUserId}}).select("-password")
        
        res.status(200).json(users)
    }

    catch(error){
            console.log('error in getUsersForSidebar controller'+error.message)
            return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const getMessages=async(req,res)=>{
    const {id:userToChat} = req.params
    const myId = req.user._id
    try{
        const messages = await messageModel.find({
          $or: [
            { senderId: myId, receiverId: userToChat },
            { senderId: userToChat, receiverId: myId },
          ]
        })
        res.status(200).json(messages)

    }
    catch(error){
        console.log('error in getMessages controller' + error.message)
        return res.status(500).json({ message: 'Internal Server Error' })

    }

}

export const sendMessage = async (req, res) => {
  const { id: receiverId } = req.params

  const {text,image}=req.body
  const senderId = req.user._id
  try {

    let imageUrl;
    if(image){
        const uploadResponse = await cloudinary.uploader.upload(image)
        imageUrl= uploadResponse.secure_url

    }

    const newMessage = new  messageModel({
        senderId,
        receiverId,
        text,
        image:imageUrl

    })
        await newMessage.save()
        res.status(201).json(newMessage)
    }

  catch (error) {
    console.log('error in sendMessage controller' + error.message)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}