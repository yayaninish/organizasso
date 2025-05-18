const express = require("express");
const jwt = require("jsonwebtoken");
const Message = require("../models/Message");

const router = express.Router();
const JWT_SECRET = "organiz_secret";

// Middleware pour récupérer l'utilisateur à partir du token
function isAuthenticated(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json("Token manquant");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // contient id et role
    next();
  } catch (err) {
    return res.status(401).json("Token invalide");
  }
}

// 📬 Poster un message
router.post("/", isAuthenticated, async (req, res) => {
  const { content, parentId, isPrivate } = req.body;

  if (!content) return res.status(400).json("Message vide");

  const message = new Message({
    content,
    author: req.user.id,
    parentId: parentId || null,
    isPrivate: isPrivate || false
  });

  await message.save();
  res.status(201).json("Message publié !");
});

// 🔽 Afficher les messages publics
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find({ isPrivate: false })
      .sort({ createdAt: -1 })
      .populate("author", "username"); // pour afficher le pseudo
    res.json(messages);
  } catch (err) {
    res.status(500).json("Erreur serveur");
  }
});

// 🔥 Supprimer un message (auteur uniquement)
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json("Message non trouvé");

    // Vérifie que l'utilisateur est l'auteur
    if (message.author.toString() !== req.user.id) {
      return res.status(403).json("Action interdite");
    }

    await Message.findByIdAndDelete(req.params.id);
    res.json("Message supprimé !");
  } catch (err) {
    res.status(500).json("Erreur serveur");
  }
});

//  Modifier un message (auteur uniquement)
router.put("/:id", isAuthenticated, async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json("Contenu requis");

  const message = await Message.findById(req.params.id);
  if (!message) return res.status(404).json("Message introuvable");

  if (message.author.toString() !== req.user.id) {
    return res.status(403).json("Non autorisé à modifier ce message");
  }

  message.content = content;
  await message.save();

  res.json("Message mis à jour");
});



module.exports = router;
