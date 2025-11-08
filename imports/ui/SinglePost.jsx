import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Calendar, User, ArrowLeft, BookOpen } from "lucide-react";

export const SinglePost = ({HYGRAPH_API}) => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const query = `
          query GetPost($id: ID!) {
            post(where: { id: $id }) {
              id
              title
              excerpt
              content {
                html
              }
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
          body: JSON.stringify({
            query,
            variables: { id },
          }),
        });

        const json = await response.json();

        if (!response.ok || json.errors) {
          setErrorMsg(JSON.stringify(json.errors || json, null, 2));
          return;
        }

        setPost(json.data?.post || null);
      } catch (error) {
        setErrorMsg(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <div className="text-center py-5 text-muted">Loading post...</div>;
  }
  if (errorMsg) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-start">
          <strong>Error:</strong>
          <pre className="small mt-2">{errorMsg}</pre>
        </div>
        <div className="text-center mt-4">
          <Link to="/" className="btn btn-outline-primary">
            <ArrowLeft size={16} className="me-1" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-5 text-muted">
        Post not found.
        <div className="mt-3">
          <Link to="/" className="btn btn-outline-primary">
            <ArrowLeft size={16} className="me-1" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-light min-vh-100">
      <section className="bg-primary text-white text-center py-5 mb-5 shadow-sm">
        <div className="container">
          <h2 className="fw-bold">{post.title}</h2>
          <p className="mb-0 small">
            <User size={14} className="me-1" /> {post.author?.name || "Anonymous"} ·{" "}
            <Calendar size={14} className="me-1 ms-1" />{" "}
            {new Date(post.publishedAt).toLocaleDateString()}
          </p>
        </div>
      </section>

      <div className="container mb-5">
        <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
          {post.coverImage?.url ? (
            <img
              src={post.coverImage.url}
              alt={post.title}
              className="card-img-top"
              style={{ height: "320px", objectFit: "cover" }}
            />
          ) : (
            <div
              className="bg-secondary bg-opacity-10 d-flex align-items-center justify-content-center text-muted"
              style={{ height: "320px" }}
            >
              No Image
            </div>
          )}

          <div className="card-body p-4">
            <p className="text-muted small mb-3">
              <span className="badge bg-primary me-2">Article</span>
              {post.readTime || "5 min read"}
            </p>

            {post.content?.html ? (
              <div
                className="text-muted lh-lg"
                dangerouslySetInnerHTML={{ __html: post.content.html }}
              />
            ) : (
              <p className="text-muted lh-lg">
                No content available for this post.
              </p>
            )}
          </div>
        </div>

        <div className="text-center mt-4">
          <Link to="/" className="btn btn-outline-primary">
            <ArrowLeft size={16} className="me-1" /> Back to All Posts
          </Link>
        </div>
      </div>
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
