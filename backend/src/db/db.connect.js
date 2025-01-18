import mongoose from "mongoose"

export  const connectDB=async()=>{
    try {
        const connect = await mongoose.connect(
         process.env.MONGO_URI
        )
        console.log(`Connection established ${connect.connection.host}`)
        
    } catch (error) {
        console.log("Error connection to database "+error)
        
    }

}