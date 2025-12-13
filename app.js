require("dotenv").config();
require("express-async-errors");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require('jsonwebtoken')
require('dotenv').config()
const { Socket } = require('socket.io');
// custom error handling
const ApiError = require("./ErrorHandlers/CustomApiError");
const errorHandler = require("./middleware/ErrorHandler");

// route imports
const authRoutes = require("./routes/authRoutes");
const userRoutes = require('./routes/user');
const transferRoutes = require('./routes/Transfer')


//const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

// create server and socket instance
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://frabjous-stroopwafel-34fd3a.netlify.app/",
    methods: ["GET", "POST"],
  }, 
});

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// routes
app.use("/api/auth", authRoutes);
app.use('/api/users' , userRoutes)
app.use('/api/transfer' , transferRoutes)
//app.use("/api/upload", uploadRoutes);

// 404 handler
app.use((req, res, next) => {
  throw new ApiError(404, "Route not found");
});

// error handler
app.use(errorHandler);

const onlineUsers = {}

/*io.use((Socket , next) => {
  try {
  const token = Socket.handshake.auth.token
  if (!token) return next(new Error('no token present'))
  
  const user = jwt.verify(token , process.env.JWT_SECRET )
  Socket.user = user
  next()
  } catch(err) {
    next(new Error('invalid token'))
  }
})*/

io.use((Socket, next) => {
  try {
    const token = Socket.handshake.auth.token;
    if (!token) {
      console.log("No token present");
      return next(new Error('no token present'));
    }
    const user = jwt.verify(token, process.env.JWT_SECRET);
    Socket.user = user;
    console.log("Token verified:", user);
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    next(new Error('invalid token'));
  }
});


io.on("connection" , (Socket) => {
  
})




const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      tls: true,
      tlsAllowInvalidCertificates: false, // required for Atlas TLS handshake
    });

    console.log("✅ Connected to MongoDB");

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
};

startServer();
