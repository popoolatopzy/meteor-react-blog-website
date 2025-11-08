import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, BookOpen } from "lucide-react";

export const NewPost = ({ HYGRAPH_API, HYGRAPH_TOKEN }) => {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("React");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const makeSlug = (text) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const slug = makeSlug(title);
      const date = new Date().toISOString();

      const createMutation = `
        mutation CreatePost($title: String!, $excerpt: String!, $content: String!, $slug: String!, $date: Date!) {
          createPost(
            data: {
              title: $title
              excerpt: $excerpt
              content: { html: $content }
              slug: $slug
              date: $date
            }
          ) {
            id
            title
          }
        }
      `;

      const createResponse = await fetch(HYGRAPH_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${HYGRAPH_TOKEN}`,
        },
        body: JSON.stringify({
          query: createMutation,
          variables: { title, excerpt, content, slug, date },
        }),
      });

      const createJson = await createResponse.json();

      if (createJson.errors) {
        throw new Error(createJson.errors[0].message);
      }

      const postId = createJson.data.createPost.id;

      const publishMutation = `
        mutation PublishPost($postId: ID!) {
          publishPost(where: { id: $postId }, to: PUBLISHED) {
            id
            title
          }
        }
      `;

      await fetch(HYGRAPH_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${HYGRAPH_TOKEN}`,
        },
        body: JSON.stringify({
          query: publishMutation,
          variables: { postId },
        }),
      });

      setMessage(`✅ Post "${createJson.data.createPost.title}" published successfully!`);
      setTitle("");
      setExcerpt("");
      setContent("");
      setCategory("React");
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <section className="bg-primary text-white text-center py-4 mb-4 shadow-sm">
        <div className="container">
          <h2 className="fw-bold mb-0">Create New Post</h2>
        </div>
      </section>

      <div className="container flex-grow-1">
        <div className="card shadow-sm border-0 mb-5">
          <div className="card-body p-4">
            {message && (
              <div
                className={`alert ${message.startsWith("✅") ? "alert-success" : "alert-danger"
                  }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Post Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your post title"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Excerpt</label>
                <input
                  type="text"
                  className="form-control"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Short summary of your post"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="React">React</option>
                  <option value="CSS">CSS</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="Accessibility">Accessibility</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Post Content</label>
                <textarea
                  className="form-control"
                  rows="6"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your full post here..."
                  required
                ></textarea>
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <Link to="/" className="btn btn-outline-secondary">
                  <ArrowLeft size={16} className="me-1" /> Back
                </Link>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <Upload size={16} className="me-1" /> Publishing...
                    </>
                  ) : (
                    <>
                      <Upload size={16} className="me-1" /> Publish Post
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
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
