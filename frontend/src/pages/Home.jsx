import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  // ✅ Fixed localStorage keys
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  const [stories, setStories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: null,
  });

  /* ---------------- FETCH STORIES ---------------- */
  const fetchStories = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/stories?userId=${userId}`
      );
      setStories(res.data.reverse());
    } catch (err) {
      console.log("Error fetching stories:", err);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  /* ---------------- HANDLE INPUT ---------------- */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  /* ---------------- ADD STORY ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("userId", userId);

    if (form.image) {
      data.append("image", form.image);
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/stories`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setForm({ title: "", description: "", image: null });
      fetchStories();
    } catch (err) {
      console.log("Error adding story:", err);
      alert(
        err.response?.data?.message || "Failed to add story. Please try again."
      );
    }
  };

  /* ---------------- DELETE STORY ---------------- */
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/stories/${id}`
      );
      fetchStories();
    } catch (err) {
      console.log("Error deleting story:", err);
      alert(
        err.response?.data?.message || "Failed to delete story. Please try again."
      );
    }
  };

  /* ---------------- LOGOUT / BACK ---------------- */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="home-container">
      {/* ✅ Welcome + Logout */}
      <div className="home-header">
        <h2>Welcome{userName ? `, ${userName}` : ""}</h2>
        <button onClick={handleLogout}>Back to Login</button>
      </div>

      {/* -------- ADD STORY FORM -------- */}
      <form onSubmit={handleSubmit} className="story-form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Write your travel story..."
          value={form.description}
          onChange={handleChange}
          required
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />

        <button type="submit">Add Story</button>
      </form>

      {/* -------- STORY LIST -------- */}
      <div className="story-list">
        {stories.length === 0 ? (
          <p>No stories yet. Start posting!</p>
        ) : (
          stories.map((story) => (
            <div key={story._id} className="story-card">
              <h3>{story.title}</h3>
              <p>{story.description}</p>

              {story.image && (
                <img
                  src={`${import.meta.env.VITE_API_URL}/uploads/${story.image}`}
                  alt="story"
                />
              )}

              <button onClick={() => handleDelete(story._id)}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
