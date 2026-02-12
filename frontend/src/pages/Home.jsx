import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("username");

  const [stories, setStories] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", images: [] });
  const sliderRefs = useRef({});

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchStories();
  }, []);

  // -----------------------------
  // FETCH STORIES
  // -----------------------------
  const fetchStories = async () => {
    try {
      const res = await API.get("/stories", { params: { userId } });
      setStories(res.data);
    } catch (err) {
      console.error("🔥 FETCH ERROR:", err.response?.data || err.message);
    }
  };

  // -----------------------------
  // HANDLE INPUT CHANGE
  // -----------------------------
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") setForm({ ...form, images: files });
    else setForm({ ...form, [name]: value });
  };

  // -----------------------------
  // HANDLE SUBMIT
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      alert("Please fill all fields");
      return;
    }

    const data = new FormData();
    data.append("userId", userId);
    data.append("title", form.title);
    data.append("description", form.description);

    for (let i = 0; i < form.images.length; i++) {
      data.append("images", form.images[i]);
    }

    try {
      const res = await API.post("/stories", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("✅ Story uploaded:", res.data);

      setForm({ title: "", description: "", images: [] });
      e.target.reset();
      fetchStories();
    } catch (err) {
      console.error("🔥 FRONTEND UPLOAD ERROR:", err);
      console.error("🔥 FRONTEND UPLOAD ERROR RESPONSE:", err.response);
      alert(err.response?.data?.message || "Failed to upload story");
    }
  };

  // -----------------------------
  // DELETE STORY
  // -----------------------------
  const handleDelete = async (id) => {
    try {
      await API.delete(`/stories/${id}`);
      fetchStories();
    } catch (err) {
      console.error("🔥 DELETE ERROR:", err.response?.data || err.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const scrollLeft = (id) => {
    sliderRefs.current[id]?.scrollBy({ left: -300, behavior: "smooth" });
  };
  const scrollRight = (id) => {
    sliderRefs.current[id]?.scrollBy({ left: 300, behavior: "smooth" });
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

        <input type="file" name="images" accept="image/*" multiple onChange={handleChange} />

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

              {story.images?.length > 0 && (
                <div className="slider-wrapper">
                  <button className="slide-btn left" onClick={() => scrollLeft(story._id)}>‹</button>
                  <div className="image-gallery" ref={(el) => (sliderRefs.current[story._id] = el)}>
                    {story.images.map((img, index) => (
                      <img key={index} src={img} alt="story" />
                    ))}
                  </div>
                  <button className="slide-btn right" onClick={() => scrollRight(story._id)}>›</button>
                </div>
              )}

              <button onClick={() => handleDelete(story._id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
