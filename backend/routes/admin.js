const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const router = express.Router();
const JWT_SECRET = "organiz_secret"; // à mettre dans un .env en prod

// Middleware : vérifie si l'utilisateur est un admin
function isAdmin(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json("Token manquant");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "admin") return res.status(403).json("Accès réservé aux administrateurs");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json("Token invalide");
  }
}

// 🔍 Lister les utilisateurs non validés
router.get("/pending", isAdmin, async (req, res) => {
  const users = await User.find({ validated: false }, "username role");
  res.json(users);
});

// ✅ Valider un utilisateur par ID
router.put("/validate/:id", isAdmin, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json("ID invalide");
  }

  const updated = await User.findByIdAndUpdate(id, { validated: true });
  if (!updated) return res.status(404).json("Utilisateur non trouvé");

  res.json("Utilisateur validé !");
});

module.exports = router;
