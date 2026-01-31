const express = require('express');
const multer = require('multer');
const router = express.Router();
const Story = require('../models/Story');

// -----------------------------
// Multer storage for images
// -----------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// -----------------------------
// POST: Add new story
// -----------------------------
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { userId, title, description } = req.body;

    if (!userId || !title || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const story = new Story({
      userId,
      title,
      description,
      image: req.file ? req.file.filename : null,
    });

    await story.save();
    res.status(201).json(story);
  } catch (err) {
    console.error('POST /stories error:', err);
    res.status(500).json({ message: 'Failed to add story' });
  }
});

// -----------------------------
// GET: Fetch stories by userId
// -----------------------------
router.get('/', async (req, res) => {
  try {
    // Query param approach (works for frontend & Postman)
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'userId query is required' });

    const stories = await Story.find({ userId }).sort({ createdAt: -1 });
    res.json(stories);
  } catch (err) {
    console.error('GET /stories error:', err);
    res.status(500).json({ message: 'Failed to fetch stories' });
  }
});

// -----------------------------
// DELETE: Delete a story
// -----------------------------
router.delete('/:id', async (req, res) => {
  try {
    await Story.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('DELETE /stories error:', err);
    res.status(500).json({ message: 'Failed to delete story' });
  }
});

module.exports = router;
