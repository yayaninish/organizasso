const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// À mettre dans un .env plus tard
const JWT_SECRET = "organiz_secret";

// ✅ Inscription
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Vérifie si le pseudo est déjà pris
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json("Pseudo déjà utilisé.");

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création du nouvel utilisateur
    const newUser = new User({
      username,
      password: hashedPassword,
      validated: false
    });

    await newUser.save();
    res.status(201).json("Compte créé. En attente de validation.");
  } catch (err) {
    res.status(500).json("Erreur serveur lors de l'inscription.");
  }
});

// 🔑 Connexion
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json("Pseudo invalide.");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json("Mot de passe incorrect.");

    if (!user.validated) return res.status(403).json("Compte non validé par un admin.");

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, username: user.username, role: user.role });
  } catch (err) {
    res.status(500).json("Erreur serveur lors de la connexion.");
  }
});

module.exports = router;
