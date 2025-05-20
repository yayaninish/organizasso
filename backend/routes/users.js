const express = require("express");
const User = require("../models/User");
const Message = require("../models/Message");

const router = express.Router();

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

module.exports = router;
