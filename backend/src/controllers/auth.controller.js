import userModel from '../models/user.model.js'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import cloudinary from '../lib/cloudinary.js'
import { generateToken } from '../utils/jwt.js'
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body
  
  try {
    if (fullName === '' || email === '' || password === '') {
      return res.status(400).json({ message: 'All fields are required' })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Minimum password length is 6' })
    }
    const user = await userModel.findOne({ email })
    if (user) {
      return res.status(400).json({ message: 'Email  aldready exists ' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new userModel({
      fullName,
      email,
      password: hashedPassword,
    })
    if (newUser) {
      generateToken(newUser._id, res)
      await newUser.save()
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
        createdAt:newUser.createdAt,
      })
    } else {
      return res.status(400).json({ message: 'Invalid User Data' })
    }
  } catch (error) {
    console.log(req.body)
    console.log('error in sign up controller')
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
export const login = async (req, res) => {
  const { email, password } = req.body
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }
    const user = await userModel.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' })
    }
    const userPassword = user.password
    const isValid = bcrypt.compareSync(password, userPassword)
    if (isValid === false) {
      return res.status(400).json({ message: 'Invalid Credentials' })
    }
    generateToken(user._id, res)

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      createdAt:user.createdAt
    })
  } catch (error) {
    console.log('error in log in controller' + error.message)
    return res.status(500).json({ message: 'Internal Server Error ' })
  }
}
export const logout = (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 })
    res.status(200).json({ message: 'Logout successful' })
  } catch (error) {
    console.log('Error in logout', error.message)
    res.status(500).json({ message: 'Internal Server Error ' })
  }
}
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body
    const userId = req.user._id

    if (!profilePic) {
      return res.status(400).json({ message: 'Profile  Pic Required' })
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic)
    const updatedUser = await userModel
      .findByIdAndUpdate(
        userId,
        { profilePic: uploadResponse.secure_url },
        { new: true }
      )
      .select('-password')

    res.status(200).json(updatedUser )
  } catch (error) {
    console.log('error in updateProfile controller')
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user)
  } catch {
    console.log('error in checkAuth controller')
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
