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
  })

  console.log("online users: ", onlineUsers)

});