// const express = require("express");
// const mongoose = require("mongoose");
// const path = require("path");
// const methodOverride = require("method-override");
// const ejsMate = require("ejs-mate");

// const app = express();

// // Middleware
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));
// app.use(express.static(path.join(__dirname, "public")));

// // EJS Setup
// app.engine("ejs", ejsMate);
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// // MongoDB
// mongoose.connect("mongodb://127.0.0.1:27017/urlShortenerDB")
// .then(() => console.log("MongoDB Connected"))
// .catch(err => console.log(err));
// // //landroute
// // app.get("/", (req, res) => {
// //   res.render("landing");
// // });
// // // Routes
// // const urlRoutes = require("./routes/url");
// // app.use("/", urlRoutes);
// // Landing page
// app.get("/", (req, res) => {
//   res.render("landing");
// });

// // App routes
// const urlRoutes = require("./routes/url");
// app.use("/app", urlRoutes);

// // Server
// app.listen(3000, () => {
//   console.log("Server running on http://localhost:3000");
// });

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
require("dotenv").config();

const app = express();

// ================= MIDDLEWARE =================
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ================= EJS SETUP =================
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ================= DATABASE =================
// mongoose.connect("mongodb://127.0.0.1:27017/urlShortenerDB")
// .then(() => console.log("✅ MongoDB Connected"))
// .catch(err => console.log("❌ DB Error:", err));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Atlas Connected"))
.catch(err => console.log(err));

// ================= ROUTES =================

// Landing Page
app.get("/", (req, res) => {
  res.render("landing");
});

// App Routes (IMPORTANT PREFIX)
const urlRoutes = require("./routes/url");
app.use("/app", urlRoutes);


// ================= ERROR HANDLING =================

// 404 Route
app.use((req, res) => {
  res.status(404).send("❌ Page Not Found");
});

// ================= SERVER =================
// const PORT = 3000;
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});