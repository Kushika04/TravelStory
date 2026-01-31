import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("username"); // ✅ must match key stored on login

  const [stories, setStories] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", image: null });

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const res = await API.get(`/stories?userId=${userId}`);
      setStories(res.data.reverse());
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") setForm({ ...form, image: files[0] });
    else setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("userId", userId);
    if (form.image) data.append("image", form.image);

    try {
      await API.post("/stories", data);
      setForm({ title: "", description: "", image: null });
      fetchStories();
    } catch (err) {
      alert("Failed to upload story");
    }
  };

  const handleDelete = async (storyId) => {
    try {
      await API.delete(`/stories/${storyId}`);
      fetchStories(); // refresh stories after deletion
    } catch (err) {
      alert("Failed to delete story");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h2>Welcome, {userName}</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

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
        <input type="file" name="image" accept="image/*" onChange={handleChange} />
        <button type="submit">Add Story</button>
      </form>

      <div className="story-list">
        {stories.length === 0 ? (
          <p>No stories yet</p>
        ) : (
          stories.map((story) => (
            <div key={story._id} className="story-card">
              <h3>{story.title}</h3>
              <p>{story.description}</p>
              {story.image && (
                <img
                  src={`${API.defaults.baseURL.replace(/\/api$/, "")}/uploads/${story.image}`}
                  alt="story"
                />
              )}
              <button
                className="delete-button"
                onClick={() => handleDelete(story._id)}
              >
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
