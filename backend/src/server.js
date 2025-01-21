import express from "express"
import authRouter from './routes/auth.route.js'
import messageRouter from './routes/message.route.js'
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
dotenv.config()
import { connectDB } from "./db/db.connect.js"
import {io,app,server} from "./utils/socket.io.js"
import path from "path"


const __dirname= path.resolve()
const PORT=process.env.PORT ||5002
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use("/api/auth",authRouter);
app.use("/api/messages",messageRouter)

if ((process.env.NODE_ENV === "production")){
    app.use(express.static(path.join(__dirname,'../frontend/dist')))

    app.get('*',(req,res)=>{
        res.sendFile(path.join(__dirname, '../frontend','/dist','/index.html'))
    })
}
  server.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)

    connectDB()
  })