import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getNotes } from "../services/api";
import styles from "../styles/Dashboard.module.css";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [streak, setStreak] = useState(0);
  const [notesCount, setNotesCount] = useState(0);

  useEffect(() => {
    // Streak logic
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem("lastVisit");
    const currentStreak = parseInt(localStorage.getItem("streak") || "0");

    if (lastVisit === today) {
      setStreak(currentStreak);
    } else if (lastVisit === new Date(Date.now() - 86400000).toDateString()) {
      const newStreak = currentStreak + 1;
      localStorage.setItem("streak", newStreak);
      localStorage.setItem("lastVisit", today);
      setStreak(newStreak);
    } else {
      localStorage.setItem("streak", "1");
      localStorage.setItem("lastVisit", today);
      setStreak(1);
    }

    // Notes count
    getNotes({
      degree: user?.degree,
      semester: user?.semester,
      branch: user?.branch,
    })
      .then((res) => setNotesCount(res.data.pagination.total))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const modules = [
    {
      title: "Notes",
      icon: "📚",
      desc: "Upload aur download karo notes",
      path: "/notes",
      color: "#f5a623",
    },
    {
      title: "Subject Chat",
      icon: "💬",
      desc: "Apne subject ke saath chat karo",
      path: "/chat/subject",
      color: "#3b82f6",
    },
    {
      title: "General Chat",
      icon: "🗣️",
      desc: "Campus wide discussion",
      path: "/chat/general",
      color: "#22c55e",
    },
    {
      title: "General Info",
      icon: "📢",
      desc: "Notices aur events dekho",
      path: "/info",
      color: "#a855f7",
    },
    {
      title: "AI Assistant",
      icon: "🤖",
      desc: "AI se kuch bhi poochho",
      path: "/ai",
      color: "#ef4444",
    },
  ];

  const stats = [
    { label: "Study Streak", value: `${streak} 🔥`, desc: "Din se lagaatar" },
    {
      label: "Branch Notes",
      value: notesCount,
      desc: `${user?.branch} ke notes`,
    },
    { label: "Semester", value: user?.semester, desc: "Current semester" },
    { label: "Batch", value: user?.degree, desc: user?.branch },
  ];

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <h1 className={styles.logo}>
          Campus<span>Hive</span>
        </h1>
        <div className={styles.navRight}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className={styles.userName}>{user?.name}</p>
              <p className={styles.userMeta}>
                {user?.degree} • Sem {user?.semester} • {user?.branch}
              </p>
            </div>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </nav>

      <div className={styles.banner}>
        <div>
          <h2>Welcome back, {user?.name?.split(" ")[0]}! 👋</h2>
          <p>
            NIT Kurukshetra • {user?.degree} • {user?.branch} • Semester{" "}
            {user?.semester}
          </p>
        </div>
        <div className={styles.bannerBadge}>🎓 Student</div>
      </div>

      {/* Stats Row */}
      <div className={styles.statsRow}>
        {stats.map((s) => (
          <div key={s.label} className={styles.statCard}>
            <p className={styles.statValue}>{s.value}</p>
            <p className={styles.statLabel}>{s.label}</p>
            <p className={styles.statDesc}>{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Modules */}
      <h3 className={styles.sectionTitle}>Modules</h3>
      <div className={styles.grid}>
        {modules.map((mod) => (
          <div
            key={mod.title}
            className={styles.card}
            onClick={() => navigate(mod.path)}
            style={{ "--card-color": mod.color }}
          >
            <div className={styles.cardIcon}>{mod.icon}</div>
            <h3 className={styles.cardTitle}>{mod.title}</h3>
            <p className={styles.cardDesc}>{mod.desc}</p>
            <div className={styles.cardArrow}>→</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h3 className={styles.sectionTitle}>Quick Actions</h3>
      <div className={styles.quickActions}>
        <button onClick={() => navigate("/notes")} className={styles.qaBtn}>
          📤 Note Upload karo
        </button>
        <button onClick={() => navigate("/ai")} className={styles.qaBtn}>
          🤖 AI se poochho
        </button>
        <button
          onClick={() => navigate("/chat/general")}
          className={styles.qaBtn}
        >
          💬 General Chat
        </button>
        <button onClick={() => navigate("/info")} className={styles.qaBtn}>
          📢 Latest Notices
        </button>
      </div>
    </div>
  );
}
