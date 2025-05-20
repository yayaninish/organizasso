const express = require("express");
const User = require("../models/User");
const Message = require("../models/Message");

const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_SECRET = "organiz_secret"; // à placer dans un .env

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
// 🔍 Route publique pour consulter un profil utilisateur
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("username role avatar");
    if (!user) return res.status(404).json("Utilisateur introuvable");

    const messages = await Message.find({ author: user._id, isPrivate: false })
      .sort({ createdAt: -1 })
      .populate("author", "username avatar");

    res.json({ user, messages });
  } catch (err) {
    res.status(500).json("Erreur serveur");
  }
});

router.get("/", isAuthenticated, async (req, res) => {
  const users = await User.find({}, "username role");
  res.json(users);
});

module.exports = router;
