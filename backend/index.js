const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const messageRoutes = require("./routes/message");
const profileRoutes = require("./routes/profile");
const uploadRoutes = require("./routes/upload");
const userRoutes = require("./routes/users");


const app = express();
const PORT = 5000;


app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


// Routes
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/messages", messageRoutes);
app.use("/profile", profileRoutes);
app.use("/upload", uploadRoutes);
app.use("/users", userRoutes);




// Route de test
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API d'Organiz'asso !");
});

// Connexion à MongoDB
mongoose.connect("mongodb://localhost:27017/organizasso", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connexion à MongoDB réussie !");
  app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("Erreur de connexion à MongoDB :", err);
});
