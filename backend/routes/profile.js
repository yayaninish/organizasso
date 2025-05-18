const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Message = require("../models/Message");

const router = express.Router();
const JWT_SECRET = "organiz_secret";

// Authentification
function isAuthenticated(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json("Token manquant");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json("Token invalide");
  }
}

// 🔍 Profil utilisateur connecté
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("username role");
    const messages = await Message.find({ author: req.user.id })
        .sort({ createdAt: -1 })
        .populate("author", "username");


    res.json({ user, messages });
  } catch (err) {
    res.status(500).json("Erreur serveur.");
  }
});

module.exports = router;
