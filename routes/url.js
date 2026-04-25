// const express = require("express");
// const router = express.Router();
// const shortid = require("shortid");
// const QRCode = require("qrcode");
// const Url = require("../models/Url");

// // Home Page
// router.get("/", async (req, res) => {
//   const urls = await Url.find();
//   res.render("index", { urls, shortUrl: null, qrCode: null });
// });

// // Create Short URL
// router.post("/shorten", async (req, res) => {
//   const { originalUrl, customCode } = req.body;

//   if (!originalUrl) {
//     return res.redirect("/");
//   }

//   let shortCode;

//   if (customCode) {
//     const exists = await Url.findOne({ shortCode: customCode });
//     if (exists) {
//       return res.send("Custom URL already taken ❌");
//     }
//     shortCode = customCode;
//   } else {
//     shortCode = shortid.generate();
//   }

//   await Url.create({ originalUrl, shortCode });

//   const shortUrl = `http://localhost:3000/${shortCode}`;
//   const qrCode = await QRCode.toDataURL(shortUrl);

//   const urls = await Url.find();

//   res.render("index", { urls, shortUrl, qrCode });
// });
// // 👉 Show all URLs page
// router.get("/urls", async (req, res) => {
//   const urls = await Url.find();
//   res.render("urls", { urls });
// });

// // 👉 Delete URL
// router.delete("/urls/:id", async (req, res) => {
//   await Url.findByIdAndDelete(req.params.id);
//   res.redirect("/urls");
// });

// // Redirect
// router.get("/:code", async (req, res) => {
//   const url = await Url.findOne({ shortCode: req.params.code });

//   if (!url) {
//     return res.send("URL not found");
//   }

//   url.clicks++;
//   await url.save();

//   res.redirect(url.originalUrl);
// });
// //landingroute
// router.get("/landing", (req, res) => {
//   res.render("landing");
// });



// module.exports = router;


const express = require("express");
const router = express.Router();
const shortid = require("shortid");
const QRCode = require("qrcode");
const Url = require("../models/Url");

// ================= HOME PAGE =================
router.get("/", async (req, res) => {
  const urls = await Url.find();
  res.render("index", { urls, shortUrl: null, qrCode: null });
});

// ================= CREATE SHORT URL =================
router.post("/shorten", async (req, res) => {
  const { originalUrl, customCode } = req.body;

  if (!originalUrl) {
    return res.redirect("/app");
  }

  let shortCode;

  // Custom URL logic
  if (customCode) {
    const exists = await Url.findOne({ shortCode: customCode });
    if (exists) {
      return res.send("❌ Custom URL already taken");
    }
    shortCode = customCode;
  } else {
    shortCode = shortid.generate();
  }

  await Url.create({ originalUrl, shortCode });

  // ✅ FIXED: dynamic short URL (IMPORTANT)
  const shortUrl = `${req.protocol}://${req.get("host")}/app/${shortCode}`;

  // QR Code
  const qrCode = await QRCode.toDataURL(shortUrl);

  const urls = await Url.find();

  res.render("index", { urls, shortUrl, qrCode });
});

// ================= SHOW ALL URLS =================
router.get("/urls", async (req, res) => {
  const urls = await Url.find();
  res.render("urls", { urls });
});

// ================= DELETE URL =================
router.delete("/urls/:id", async (req, res) => {
  await Url.findByIdAndDelete(req.params.id);
  res.redirect("/app/urls"); // ✅ FIXED
});

// ================= REDIRECT =================
// ⚠️ ALWAYS KEEP THIS LAST
router.get("/:code", async (req, res) => {
  const url = await Url.findOne({ shortCode: req.params.code });

  if (!url) {
    return res.send("❌ URL not found");
  }

  url.clicks++;
  await url.save();

  res.redirect(url.originalUrl);
});

module.exports = router;