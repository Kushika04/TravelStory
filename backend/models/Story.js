const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: String,
    description: String,
    image: String,
  },
);

module.exports = mongoose.model("Story", storySchema);
