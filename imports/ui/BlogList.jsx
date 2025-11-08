import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export const BlogList = ({ posts }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const navigate = useNavigate();

  const categories = ["all", ...new Set(posts.map((p) => p.category))];
  const filtered = posts.filter((p) => {
    const matchCat = category === "all" || p.category === category;
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold mb-4">DevBlog</h2>

      {/* Search */}
      <div className="d-flex justify-content-between mb-4">
        <div className="position-relative w-50">
          <Search className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" size={18} />
          <input
            type="text"
            className="form-control ps-5"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/new")}>
          + New Post
        </button>
      </div>

      {/* Categories */}
      <div className="mb-4">
        {categories.map((c) => (
          <button
            key={c}
            className={`btn btn-sm me-2 mb-2 ${
              c === category ? "btn-primary" : "btn-outline-secondary"
            }`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Blog Cards */}
      <div className="row g-4">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="col-md-4" 
            onClick={() => navigate(`/post/${p.id}`)}
            style={{ cursor: "pointer" }}
          >
            <div className="card h-100 border-0 shadow-sm">
              <img src={p.image} className="card-img-top" alt={p.title} />
              <div className="card-body">
                <h5 className="card-title">{p.title}</h5>
                <p className="card-text text-muted">{p.excerpt}</p>
              </div>
              <div className="card-footer bg-white text-muted small">
                {p.author} • {p.date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
