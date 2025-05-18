const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  author:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content:   { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  parentId:  { type: mongoose.Schema.Types.ObjectId, ref: "Message", default: null },
  isPrivate: { type: Boolean, default: false }
  
});

module.exports = mongoose.model("Message", messageSchema);
