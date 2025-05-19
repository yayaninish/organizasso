const express = require("express");
const jwt = require("jsonwebtoken");
const Message = require("../models/Message");

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

// 📥 Créer un message
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const { content, parentId = null, isPrivate = false } = req.body;

    const message = new Message({
      content,
      parentId,
      isPrivate,
      author: req.user.id
    });

    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json("Erreur lors de l’envoi du message.");
  }
});

// 📤 Lire les messages publics ou privés
router.get("/", async (req, res) => {
  try {
    const isPrivate = req.query.private === "true";
    const filter = isPrivate ? { isPrivate: true } : { isPrivate: false };

    const messages = await Message.find(filter)
      .sort({ createdAt: -1 })
      .populate("author", "username avatar");

    res.json(messages);
  } catch (err) {
    console.error(err); // 👈 ajoute ce log côté serveur
    res.status(500).json("Erreur serveur");
  }
});


// ✏️ Modifier un message
router.put("/:id", isAuthenticated, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json("Message introuvable");

    if (message.author.toString() !== req.user.id)
      return res.status(403).json("Non autorisé");

    message.content = req.body.content;
    await message.save();

    res.json(message);
  } catch (err) {
    res.status(500).json("Erreur lors de la modification.");
  }
});

// ❌ Supprimer un message
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json("Message introuvable");

    if (message.author.toString() !== req.user.id)
      return res.status(403).json("Non autorisé");

    await message.deleteOne();
    res.json("Message supprimé");
  } catch (err) {
    res.status(500).json("Erreur lors de la suppression.");
  }
});

module.exports = router;
