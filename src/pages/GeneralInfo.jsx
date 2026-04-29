import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getInfoPosts } from "../services/api";
import styles from "../styles/GeneralInfo.module.css";

const CATEGORIES = [
  "all",
  "notice",
  "event",
  "placement",
  "general",
  "emergency",
];
const CATEGORY_COLORS = {
  notice: "#3b82f6",
  event: "#22c55e",
  placement: "#f5a623",
  general: "#a855f7",
  emergency: "#ef4444",
};

export default function GeneralInfo() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    getInfoPosts(category !== "all" ? { category } : {})
      .then((res) => setPosts(res.data.posts))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <button onClick={() => navigate("/dashboard")} className={styles.back}>
          ← Back
        </button>
        <h2 className={styles.title}>📢 General Info</h2>
        <div />
      </nav>

      <div className={styles.filters}>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`${styles.filterBtn} ${category === c ? styles.active : ""}`}
            onClick={() => setCategory(c)}
          >
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className={styles.loading}>Loading...</p>
      ) : (
        <div className={styles.list}>
          {posts.length === 0 ? (
            <div className={styles.empty}>📭 Koi post nahi hai abhi</div>
          ) : (
            posts.map((post) => (
              <div
                key={post._id}
                className={styles.card}
                style={{
                  "--cat-color": CATEGORY_COLORS[post.category] || "#888",
                }}
              >
                <div className={styles.cardTop}>
                  {post.isPinned && (
                    <span className={styles.pin}>📌 Pinned</span>
                  )}
                  <span
                    className={styles.cat}
                    style={{ color: CATEGORY_COLORS[post.category] }}
                  >
                    {post.category?.toUpperCase()}
                  </span>
                  <span className={styles.date}>
                    {new Date(post.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h3 className={styles.cardTitle}>{post.title}</h3>
                <p className={styles.cardContent}>{post.content}</p>
                {post.attachmentUrl && (
                  <a
                    href={post.attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.attachment}
                  >
                    📎 Attachment dekho
                  </a>
                )}
                <p className={styles.postedBy}>— {post.postedBy?.name}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
