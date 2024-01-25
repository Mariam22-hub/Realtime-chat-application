
require("dotenv").config({path: "F:\\miscellenuos projects\\realtime chat\\server\\.env"});
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("../Routers/userRoutes");
const chatRoutes = require("../Routers/chatRoutes");
const messageRoutes = require("../Routers/messageRouter");

const app = express()
app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  console.log("middleware");
  next();
});

app.use("/api/users", userRoutes); 
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const DB = process.env.DATABASE
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  }) 
  .then((con) => {
    // console.log(con.connections);
    console.log("connection successful");
  });

app.listen(5000, ()=>{
  // console.log(URL)
    console.log(`server started on port 5000`);
})