require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
const server = http.createServer(app);

// DB
const connectDB = require("./config/db");

// Global error handler
const globalErrorHandler = require("./middleware/global-error-handler");

// =========================
// ✅ ALLOWED ORIGINS
// =========================
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://lookfameadmin.vercel.app",
  "https://look-fme-five.vercel.app",
  "https://lookfame.com",
  "https://www.lookfame.com"
];

// =========================
// ✅ CORS CONFIG (FIXED)
// =========================
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// =========================
// ✅ SOCKET.IO
// =========================
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// =========================
// MIDDLEWARES
// =========================
app.use(express.json());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(express.static(path.join(__dirname, "public")));

// =========================
// DB CONNECT
// =========================
connectDB();

// =========================
// ROUTES
// =========================
app.use("/api/user", require("./routes/user.routes"));
app.use("/api/category", require("./routes/category.routes"));
app.use("/api/brand", require("./routes/brand.routes"));
app.use("/api/product", require("./routes/product.routes"));
app.use("/api/order", require("./routes/order.routes"));
app.use("/api/coupon", require("./routes/coupon.routes"));
app.use("/api/user-order", require("./routes/user.order.routes"));
app.use("/api/review", require("./routes/review.routes"));
app.use("/api/cloudinary", require("./routes/cloudinary.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/inventory", require("./routes/inventory.routes"));
app.use("/api/report", require("./routes/report.routes"));
app.use("/api/user-management", require("./routes/user-management.routes"));
app.use("/api/banners", require("./routes/banner.routes"));
app.use("/api/support", require("./routes/support.routes"));
app.use("/api/welcome-offer", require("./routes/welcomeOffer.routes"));
app.use("/api/refunds", require("./routes/refundRequest.routes"));
app.use("/api/notifications", require("./routes/notification.routes"));
app.use("/api/career", require("./routes/career.routes"));
app.use("/api/combo-products", require("./routes/comboProduct.routes"));

// =========================
// ROOT
// =========================
app.get("/", (req, res) => {
  res.send("API running successfully 🚀");
});

// =========================
// ERROR HANDLING
// =========================
app.use(globalErrorHandler);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Not Found"
      }
    ]
  });
});

// =========================
// SERVER
// =========================
const PORT = process.env.PORT || 7000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, io };
