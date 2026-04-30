import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import styles from "../styles/AdminPanel.module.css";

export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("stats");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [postForm, setPostForm] = useState({
    title: "",
    content: "",
    category: "notice",
    isPinned: false,
  });
  const [postMsg, setPostMsg] = useState("");

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/dashboard");
      return;
    }
    fetchStats();
  }, []);

  useEffect(() => {
    if (tab === "users") fetchUsers();
    if (tab === "messages") fetchMessages();
  }, [tab, showDeleted]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/stats");
      setStats(res.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/users", { params: { search } });
      setUsers(res.data.users);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/messages", { params: { showDeleted } });
      setMessages(res.data.messages);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (id) => {
    try {
      await API.put(`/admin/users/${id}/block`);
      fetchUsers();
    } catch {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm("User delete karna hai?")) return;
    try {
      await API.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch {}
  };

  const handleMakeAdmin = async (id) => {
    if (!window.confirm("Is user ko admin banana hai?")) return;
    try {
      await API.put(`/admin/users/${id}/make-admin`);
      fetchUsers();
    } catch {}
  };

  const handleDeleteMessage = async (id) => {
    try {
      await API.delete(`/chat/message/${id}`);
      fetchMessages();
    } catch {}
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await API.post("/admin/info", postForm);
      setPostMsg("Post create ho gaya! ✅");
      setPostForm({
        title: "",
        content: "",
        category: "notice",
        isPinned: false,
      });
    } catch (err) {
      setPostMsg(err.response?.data?.message || "Error aa gaya");
    }
  };

  const TABS = [
    { id: "stats", label: "📊 Stats" },
    { id: "users", label: "👥 Users" },
    { id: "messages", label: "💬 Messages" },
    { id: "post", label: "📢 Post Banao" },
  ];

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <button onClick={() => navigate("/dashboard")} className={styles.back}>
          ← Back
        </button>
        <h1 className={styles.logo}>
          Campus<span>Hive</span> • Admin Panel
        </h1>
        <span className={styles.adminBadge}>🛡️ Admin</span>
      </nav>

      <div className={styles.tabs}>
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`${styles.tab} ${tab === t.id ? styles.activeTab : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {/* STATS */}
        {tab === "stats" && (
          <div>
            {loading ? (
              <p className={styles.loading}>Loading...</p>
            ) : (
              stats && (
                <>
                  <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                      <p className={styles.statVal}>{stats.totalUsers}</p>
                      <p>Total Users</p>
                    </div>
                    <div className={styles.statCard}>
                      <p className={styles.statVal}>{stats.totalNotes}</p>
                      <p>Total Notes</p>
                    </div>
                    <div className={styles.statCard}>
                      <p className={styles.statVal}>{stats.totalMessages}</p>
                      <p>Total Messages</p>
                    </div>
                    <div className={styles.statCard}>
                      <p className={styles.statVal}>{stats.totalPosts}</p>
                      <p>Info Posts</p>
                    </div>
                  </div>
                  <h3 className={styles.sectionTitle}>Branch wise Users</h3>
                  <div className={styles.branchGrid}>
                    {stats.branchStats?.map((b) => (
                      <div key={b._id} className={styles.branchCard}>
                        <p className={styles.branchName}>{b._id}</p>
                        <p className={styles.branchCount}>{b.count} students</p>
                      </div>
                    ))}
                  </div>
                  <h3 className={styles.sectionTitle}>Recent Registrations</h3>
                  <div className={styles.recentList}>
                    {stats.recentUsers?.map((u) => (
                      <div key={u._id} className={styles.recentCard}>
                        <div className={styles.avatar}>{u.name?.charAt(0)}</div>
                        <div>
                          <p className={styles.rName}>{u.name}</p>
                          <p className={styles.rMeta}>
                            {u.email} • {u.degree} • {u.branch}
                          </p>
                        </div>
                        <p className={styles.rDate}>
                          {new Date(u.createdAt).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )
            )}
          </div>
        )}

        {/* USERS */}
        {tab === "users" && (
          <div>
            <div className={styles.searchBar}>
              <input
                placeholder="Name, email ya roll number search karo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
                className={styles.searchInput}
              />
              <button onClick={fetchUsers} className={styles.searchBtn}>
                Search
              </button>
            </div>
            {loading ? (
              <p className={styles.loading}>Loading...</p>
            ) : (
              <div className={styles.userTable}>
                <div className={styles.tableHeader}>
                  <span>User</span>
                  <span>Degree/Branch</span>
                  <span>Roll No</span>
                  <span>Status</span>
                  <span>Actions</span>
                </div>
                {users.map((u) => (
                  <div
                    key={u._id}
                    className={`${styles.tableRow} ${u.isBlocked ? styles.blocked : ""}`}
                  >
                    <div className={styles.userCell}>
                      <div className={styles.avatar}>{u.name?.charAt(0)}</div>
                      <div>
                        <p className={styles.uName}>{u.name}</p>
                        <p className={styles.uEmail}>{u.email}</p>
                      </div>
                    </div>
                    <span>
                      {u.degree} • Sem {u.semester} • {u.branch}
                    </span>
                    <span>{u.rollNumber || "—"}</span>
                    <span
                      className={
                        u.isBlocked ? styles.blockedBadge : styles.activeBadge
                      }
                    >
                      {u.isBlocked ? "🔴 Blocked" : "🟢 Active"}
                    </span>
                    <div className={styles.actionBtns}>
                      <button
                        onClick={() => handleBlock(u._id)}
                        className={
                          u.isBlocked ? styles.unblockBtn : styles.blockBtn
                        }
                      >
                        {u.isBlocked ? "Unblock" : "Block"}
                      </button>
                      {u.role !== "admin" && (
                        <button
                          onClick={() => handleMakeAdmin(u._id)}
                          className={styles.adminBtn}
                        >
                          Admin
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(u._id)}
                        className={styles.deleteBtn}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MESSAGES */}
        {tab === "messages" && (
          <div>
            <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
              <button
                onClick={() => setShowDeleted(false)}
                className={!showDeleted ? styles.activeTab : styles.tab}
              >
                💬 Active
              </button>
              <button
                onClick={() => setShowDeleted(true)}
                className={showDeleted ? styles.activeTab : styles.tab}
              >
                🗑️ Deleted (Evidence)
              </button>
            </div>
            {loading ? (
              <p className={styles.loading}>Loading...</p>
            ) : (
              <div className={styles.msgList}>
                {messages.length === 0 ? (
                  <p className={styles.loading}>Koi message nahi</p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={styles.msgCard}
                      style={showDeleted ? { borderColor: "#3d0000" } : {}}
                    >
                      {showDeleted && (
                        <span
                          style={{
                            color: "var(--error)",
                            fontSize: "11px",
                            fontWeight: "600",
                          }}
                        >
                          🚨 DELETED
                        </span>
                      )}
                      <div className={styles.msgTop}>
                        <span className={styles.msgSender}>
                          {msg.sender?.name}
                        </span>
                        <span className={styles.msgEmail}>
                          {msg.sender?.email}
                        </span>
                        <span className={styles.msgRoom}>#{msg.room}</span>
                        <span className={styles.msgTime}>
                          {new Date(msg.createdAt).toLocaleString("en-IN")}
                        </span>
                        {!showDeleted && (
                          <button
                            onClick={() => handleDeleteMessage(msg._id)}
                            className={styles.msgDel}
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </div>
                      <p className={styles.msgContent}>{msg.content}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* CREATE POST */}
        {tab === "post" && (
          <div className={styles.postForm}>
            <h3>Naya Info Post Banao</h3>
            <form onSubmit={handleCreatePost}>
              <input
                placeholder="Title"
                value={postForm.title}
                onChange={(e) =>
                  setPostForm({ ...postForm, title: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Content"
                value={postForm.content}
                onChange={(e) =>
                  setPostForm({ ...postForm, content: e.target.value })
                }
                rows={5}
                required
              />
              <select
                value={postForm.category}
                onChange={(e) =>
                  setPostForm({ ...postForm, category: e.target.value })
                }
              >
                <option value="notice">Notice</option>
                <option value="event">Event</option>
                <option value="placement">Placement</option>
                <option value="general">General</option>
                <option value="emergency">Emergency</option>
              </select>
              <label className={styles.checkLabel}>
                <input
                  type="checkbox"
                  checked={postForm.isPinned}
                  onChange={(e) =>
                    setPostForm({ ...postForm, isPinned: e.target.checked })
                  }
                />
                📌 Pin this post
              </label>
              {postMsg && (
                <p
                  className={
                    postMsg.includes("✅") ? styles.success : styles.error
                  }
                >
                  {postMsg}
                </p>
              )}
              <button type="submit">Post Karo</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
