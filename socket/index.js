import { Server } from "socket.io";

const io = new Server(3000, {
  cors: "http://localhost:5173"
});

const onlineUsers = []

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  // listen to a new connection
  socket.on("addNewUser", (userId) => {
    !onlineUsers.some((user) => user.id === userId) && onlineUsers.push({
        id: userId,
        socketId: socket.id
    })
    
      console.log("online users: ", onlineUsers)
      io.emit("getOnlineUsers", onlineUsers)
  })

  //add new message
  socket.on("sendMessage", (message)=>{
    const user = onlineUsers.find((user) => user.userId === message.recipientId)
    if (user) io.to(user.socketId).emit("getMessage", message)
  })

  socket.on("disconnect", ()=>{
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id)
    io.emit("getOnlineUsers", onlineUsers)
  })

});