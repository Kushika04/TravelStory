const express = require('express');
const multer = require('multer');
const router = express.Router();
const Story = require('../models/Story');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.post('/', upload.single('image'), async (req, res) => {
  console.log(req.file);   // 🔥 CHECK THIS
  console.log(req.body);

  const { userId, title, description } = req.body;

  const story = new Story({
    userId,
    title,
    description,
    image: req.file ? req.file.filename : null,
  });

  await story.save();
  res.status(201).json(story);
});


router.get("/:userId", async (req, res) => {
  try {
    const stories = await Story.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stories" });
  }
});


router.delete('/:id', async (req, res) => {
  await Story.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
