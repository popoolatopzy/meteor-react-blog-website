import React, { useState, useEffect } from "react";
import { BookOpen, Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";

export const Home = ({HYGRAPH_API}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const query = `
          {
            posts(orderBy: publishedAt_DESC, first: 10) {
              id
              title
              excerpt
              publishedAt
              author {
                name
              }
              coverImage {
                url
              }
            }
          }
        `;

        const response = await fetch(HYGRAPH_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });

        const json = await response.json();

        if (!response.ok || json.errors) {
          setErrorMsg(JSON.stringify(json.errors || json, null, 2));
          return;
        }

        setPosts(json.data?.posts || []);
      } catch (error) {
        setErrorMsg(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="bg-light min-vh-100">
      <section className="bg-primary text-white text-center py-5 mb-5 shadow-sm">
        <div className="container">
          <h2 className="display-6 fw-bold mb-3">Welcome to DevBlog</h2>
          <p className="lead">
            Explore tutorials, tips, and insights on modern web development
          </p>
          <Link
            to="/new-post"
            className="btn btn-outline-primary rounded-pill px-4 py-2 fw-semibold text-decoration-none"
            style={{
              borderColor: "purple",
              color: "purple",
              marginBottom:"10px"
            }}
          >
            add new post
          </Link>
        </div>
      </section>

      <section className="container pb-5">
        {loading && <div className="text-center py-5 text-muted">Loading posts...</div>}

        {errorMsg && (
          <div className="alert alert-danger text-start">
            <strong>Error:</strong>
            <pre className="small mt-2">{errorMsg}</pre>
          </div>
        )}

        {!loading && !errorMsg && (
          <div className="row g-3">
            {posts.map((post) => (
              <div key={post.id} className="col-12 col-sm-6 col-lg-4">
                <div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden">
              
                  {post.coverImage?.url ? (
                    <img
                      src={post.coverImage.url}
                      alt={post.title}
                      className="card-img-top"
                      style={{ height: "180px", objectFit: "cover", marginTop: "30px", marginBottom: "30px" }}
                    />
                  ) : (
                    <div
                      className="bg-secondary bg-opacity-10 d-flex align-items-center justify-content-center text-muted"
                      style={{ height: "180px" }}
                    >
                      No Image
                    </div>
                  )}

                  <div className="card-body p-3">
                    <Link
                      to={`/post/${post.id}`}
                      className="text-decoration-none text-dark"
                    >
                      <h6 className="card-title fw-bold text-dark mb-2">
                        {post.title}
                      </h6>
                    </Link>
                    <p className="card-text text-muted small mb-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="card-footer bg-white border-0 d-flex justify-content-between align-items-center px-3 pb-3 small text-muted">
                    <span>
                      <User size={13} className="me-1" />
                      {post.author?.name || "Anonymous"}
                    </span>
                    <span>
                      <Calendar size={13} className="me-1" />
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {posts.length === 0 && (
              <div className="text-center py-5 text-muted">
                No posts found.
              </div>
            )}
          </div>
        )}
      </section>

      <footer className="bg-dark text-white py-4 mt-auto">
        <div className="container text-center">
          <div className="d-flex justify-content-center align-items-center mb-2">
            <BookOpen className="me-2" />
            <span className="fw-bold fs-5">DevBlog</span>
          </div>
          <small className="text-secondary">
            © 2025 DevBlog. Sharing knowledge, one post at a time.
          </small>
        </div>
      </footer>
    </div>
  );
};
