import {Server} from "socket.io"
import http from "http"
import express from "express"
const app = express()

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin:['http://localhost:5173'],
     }
});
const socketMapUsers={}//map {userId:socketid}
export function getSocketId(userId){

    return socketMapUsers[userId]
}
io.on("connection",(socket)=>{
    console.log("a new user has connecdted",socket.id)
    const userId = socket.handshake.query.userId
    if(userId) socketMapUsers[userId]=socket.id
    io.emit("getOnlineUsers",Object.keys(socketMapUsers))

    socket.on("disconnect",()=>{
        console.log("user has disconnected",socket.id)
        delete socketMapUsers[userId]
        io.emit('getOnlineUsers', Object.keys(socketMapUsers))

    })
})

export  {io,app,server};

