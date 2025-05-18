const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

mongoose.connect("mongodb://localhost:27017/organizasso", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = new User({
    username: "admin",
    password: hashedPassword,
    role: "admin",
    validated: true
  });

  await admin.save();
  console.log("✅ Admin créé avec succès !");
  mongoose.disconnect();
}).catch(err => console.error("❌ Erreur MongoDB :", err));
