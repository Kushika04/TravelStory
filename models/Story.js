const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: String,
    description: String,

    // ✅ NEW (multiple images)
    images: {
      type: [String],
      default: [],
    },

    // ✅ KEEP OLD (single image support)
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Story", storySchema);
