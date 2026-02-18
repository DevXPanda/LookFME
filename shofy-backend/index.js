


// require("dotenv").config();

// const express = require("express");
// const app = express();
// const path = require("path");
// const cors = require("cors");
// const morgan = require("morgan");

// // DB
// const connectDB = require("./config/db");

// // Global error handler
// const globalErrorHandler = require("./middleware/global-error-handler");

// // Routes
// const userRoutes = require("./routes/user.routes");
// const categoryRoutes = require("./routes/category.routes");
// const brandRoutes = require("./routes/brand.routes");
// const userOrderRoutes = require("./routes/user.order.routes");
// const productRoutes = require("./routes/product.routes");
// const orderRoutes = require("./routes/order.routes");
// const couponRoutes = require("./routes/coupon.routes");
// const reviewRoutes = require("./routes/review.routes");
// const adminRoutes = require("./routes/admin.routes");
// const cloudinaryRoutes = require("./routes/cloudinary.routes");

// // PORT
// const PORT = process.env.PORT || 7000;

// // CORS (FIXED)
// app.use(cors({
//   origin: function (origin, callback) {
//     const allowedOrigins = [
//       "http://localhost:3000",
//       "http://localhost:3001",
//       "https://look-fme.vercel.app",
//       "https://lookfame.in",
//       "https://look-fme-a675.vercel.app"
//     ];

//     if (!origin) return callback(null, true);

//     if (allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));

// app.options("*", cors());

// // Middlewares
// app.use(express.json());

// if (process.env.NODE_ENV !== "production") {
//   app.use(morgan("dev"));
// }

// app.use(express.static(path.join(__dirname, "public")));

// // DB connect
// connectDB();

// // Routes
// app.use("/api/user", userRoutes);
// app.use("/api/category", categoryRoutes);
// app.use("/api/brand", brandRoutes);
// app.use("/api/product", productRoutes);
// app.use("/api/order", orderRoutes);
// app.use("/api/coupon", couponRoutes);
// app.use("/api/user-order", userOrderRoutes);
// app.use("/api/review", reviewRoutes);
// app.use("/api/cloudinary", cloudinaryRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/inventory", require("./routes/inventory.routes"));

// // Root
// app.get("/", (req, res) => {
//   res.send("App working successfully 🚀");
// });

// // Error handlers
// app.use(globalErrorHandler);

// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Not Found",
//     errorMessages: [
//       {
//         path: req.originalUrl,
//         message: "API Not Found"
//       }
//     ]
//   });
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// module.exports = app;

require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");

// DB
const connectDB = require("./config/db");

// Global error handler
const globalErrorHandler = require("./middleware/global-error-handler");

// Routes
const userRoutes = require("./routes/user.routes");
const categoryRoutes = require("./routes/category.routes");
const brandRoutes = require("./routes/brand.routes");
const userOrderRoutes = require("./routes/user.order.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const couponRoutes = require("./routes/coupon.routes");
const reviewRoutes = require("./routes/review.routes");
const adminRoutes = require("./routes/admin.routes");
const cloudinaryRoutes = require("./routes/cloudinary.routes");

// PORT
const PORT = process.env.PORT || 7000;



const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://look-fme.vercel.app",
  "https://look-fme-a675.vercel.app",
  "https://lookfame.com",
  "https://www.lookfame.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors());



app.use(express.json());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(express.static(path.join(__dirname, "public")));



connectDB();



app.use("/api/user", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/user-order", userOrderRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/cloudinary", cloudinaryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/inventory", require("./routes/inventory.routes"));
app.use("/api/report", require("./routes/report.routes"));
app.use("/api/user-management", require("./routes/user-management.routes"));
app.use("/api/banners", require("./routes/banner.routes"));
app.use("/api/support", require("./routes/support.routes"));



app.get("/", (req, res) => {
  res.send("API running successfully 🚀");
});


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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

