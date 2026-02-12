const express = require("express");
const multer = require("multer");
const router = express.Router();
const Story = require("../models/Story");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// Multer (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST: Add Story
router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    const { userId, title, description } = req.body;

    if (!userId || !title || !description) {
      return res.status(400).json({ message: "Missing fields" });
    }

    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadFromBuffer = (buffer) =>
          new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: "travel_stories" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            streamifier.createReadStream(buffer).pipe(uploadStream);
          });

        const result = await uploadFromBuffer(file.buffer);
        imageUrls.push(result.secure_url);
      }
    }

    const story = new Story({
      userId,
      title,
      description,
      images: imageUrls,
    });

    await story.save();
    res.status(201).json(story);
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ message: "Failed to add story" });
  }
});

// GET: Fetch Stories
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    const stories = await Story.find({ userId }).sort({ createdAt: -1 });
    res.json(stories);
  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ message: "Fetch failed" });
  }
});

// DELETE Story
router.delete("/:id", async (req, res) => {
  try {
    await Story.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
