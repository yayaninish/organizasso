const express = require("express");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = "organiz_secret";

// fonction d'authentification
function isAuthenticated(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json("Token manquant");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json("Token invalide");
  }
}

// Stockage avec multer
const storage = multer.diskStorage({
  destination: "uploads/avatars/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${req.user.id}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// Route POST avatar
router.post("/avatar", isAuthenticated, upload.single("avatar"), async (req, res) => {
  try {
    const path = `/uploads/avatars/${req.file.filename}`;
    await User.findByIdAndUpdate(req.user.id, { avatar: path });
    res.json({ avatar: path });
  } catch (err) {
    res.status(500).json("Erreur lors de l'enregistrement de l'avatar");
  }
});

module.exports = router;
