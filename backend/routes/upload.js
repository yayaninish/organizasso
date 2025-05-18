const express = require("express");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = "organiz_secret";

// Middleware d'authentification
function isAuthenticated(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json("Token manquant");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json("Token invalide");
  }
}

// 📁 Dossier de destination des images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/avatars");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, `${req.user.id}.${ext}`);
  },
});

const upload = multer({ storage });

// 📤 Route d’upload
router.post("/avatar", isAuthenticated, upload.single("avatar"), async (req, res) => {
  try {
    const path = `/uploads/avatars/${req.file.filename}`;
    await User.findByIdAndUpdate(req.user.id, { avatar: path });
    res.json({ message: "Avatar mis à jour", avatar: path });
  } catch (err) {
    res.status(500).json("Erreur lors de l’upload");
  }
});

module.exports = router;
