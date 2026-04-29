import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getNotes, uploadNote, deleteNote, likeNote } from "../services/api";
import styles from "../styles/Notes.module.css";

export default function Notes() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    degree: user?.degree,
    semester: user?.semester,
    branch: user?.branch,
    subject: "",
  });
  const [form, setForm] = useState({ title: "", description: "", subject: "" });
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, [filters]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await getNotes(filters);
      setNotes(res.data.notes);
    } catch {
      setError("Notes load nahi hue");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setError("File select karo");
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("subject", form.subject);
      fd.append("file", file);
      await uploadNote(fd);
      setShowForm(false);
      setForm({ title: "", description: "", subject: "" });
      setFile(null);
      fetchNotes();
    } catch (err) {
      setError(err.response?.data?.message || "Upload fail ho gaya");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete karna hai?")) return;
    try {
      await deleteNote(id);
      fetchNotes();
    } catch {
      setError("Delete nahi hua");
    }
  };

  const handleLike = async (id) => {
    try {
      await likeNote(id);
      fetchNotes();
    } catch {}
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <button onClick={() => navigate("/dashboard")} className={styles.back}>
          ← Back
        </button>
        <h1 className={styles.logo}>
          Campus<span>Hive</span> • Notes
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className={styles.uploadBtn}
        >
          + Upload Note
        </button>
      </nav>

      {showForm && (
        <div className={styles.formCard}>
          <h3>Note Upload Karo</h3>
          <form onSubmit={handleUpload} className={styles.form}>
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <input
              placeholder="Subject (e.g. Data Structures)"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              required
            />
            <textarea
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
            />
            <input
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.formBtns}>
              <button type="submit" disabled={uploading}>
                {uploading ? "Uploading..." : "Upload Karo"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.filters}>
        {["CSE", "ECE", "EE", "ME", "CE", "IT", "COE", "CSBS"].map((b) => (
          <button
            key={b}
            className={`${styles.filterBtn} ${filters.branch === b ? styles.active : ""}`}
            onClick={() => setFilters({ ...filters, branch: b })}
          >
            {b}
          </button>
        ))}
        <input
          placeholder="Subject search..."
          value={filters.subject}
          onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
          className={styles.searchInput}
        />
      </div>

      {loading ? (
        <p className={styles.loading}>Loading...</p>
      ) : (
        <div className={styles.grid}>
          {notes.length === 0 ? (
            <div className={styles.empty}>
              <p>📭 Koi notes nahi hain abhi</p>
              <button onClick={() => setShowForm(true)}>
                Pehla note upload karo!
              </button>
            </div>
          ) : (
            notes.map((note) => (
              <div key={note._id} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.fileType}>
                    {note.fileType?.toUpperCase()}
                  </span>
                  <span className={styles.subject}>{note.subject}</span>
                </div>
                <h3>{note.title}</h3>
                {note.description && (
                  <p className={styles.desc}>{note.description}</p>
                )}
                <div className={styles.meta}>
                  <span>👤 {note.uploadedBy?.name}</span>
                  <span>📥 {note.downloads}</span>
                  <span>❤️ {note.likes?.length}</span>
                </div>
                <div className={styles.actions}>
                  <a
                    href={note.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.downloadBtn}
                  >
                    📥 Download
                  </a>
                  <button
                    onClick={() => handleLike(note._id)}
                    className={styles.likeBtn}
                  >
                    ❤️ Like
                  </button>
                  {note.uploadedBy?._id === user?.id && (
                    <button
                      onClick={() => handleDelete(note._id)}
                      className={styles.deleteBtn}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
