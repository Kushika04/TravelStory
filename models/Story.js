const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }], // array of URLs
  },
  { timestamps: true }
);

module.exports = mongoose.model("Story", storySchema);
