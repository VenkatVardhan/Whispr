import jwt from "jsonwebtoken"
import userModel from "../models/user.model.js"
export const protectRoute = async (req, res,next) => {
    try {
        const token = req.cookies.jwt
        if(!token){
            return res.status(401).json({
                message:" Unauthorized - No JWT token "
            })
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)
        if(!decoded){
                    return res.status(401).json({message: 'Unauthorized - Invalid  JWT token '})
        }
        const user = await userModel.findById(decoded.userId).select({password:0})
        if(!user){
            return res.status(401).json({message:"User not found"})

        }
        req.user=user
        next()

    } catch (error) {
        res.status(500).json({message:"Internal Server Error"})
        
    }


}
