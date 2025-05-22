const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const router = express.Router();
const JWT_SECRET = "organiz_secret"; // à mettre dans un .env en prod

// vérifie si l'utilisateur est un admin
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

// Lister les utilisateurs non validés
router.get("/pending", isAdmin, async (req, res) => {
  const users = await User.find({ validated: false }, "username role");
  res.json(users);
});

// Valider un utilisateur par ID
router.put("/validate/:id", isAdmin, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json("ID invalide");
  }

  const updated = await User.findByIdAndUpdate(id, { validated: true });
  if (!updated) return res.status(404).json("Utilisateur non trouvé");

  res.json("Utilisateur validé !");
});

// Modifier le rôle d’un autre utilisateur (admin uniquement, sauf soi-même)
router.put("/role/:id", isAdmin, async (req, res) => {
  const { role } = req.body;
  const { id } = req.params;

  if (!["admin", "membre"].includes(role)) {
    return res.status(400).json("Rôle invalide");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json("ID invalide");
  }

  // Empêche de se modifier soi-même
  if (req.user.id === id) {
    return res.status(400).json("Tu ne peux pas modifier ton propre rôle");
  }

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json("Utilisateur introuvable");

    user.role = role;
    await user.save();

    res.json({ message: "Rôle mis à jour", user });
  } catch (err) {
    res.status(500).json("Erreur serveur");
  }
});

module.exports = router;
