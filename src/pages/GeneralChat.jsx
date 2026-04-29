import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getMessages, saveMessage, deleteMessage } from "../services/api";
import { io } from "socket.io-client";
import styles from "../styles/Chat.module.css";

const socket = io("http://localhost:5001");

export default function GeneralChat() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);
  const room = "general";

  useEffect(() => {
    socket.emit("join_room", { room, userId: user?.id, name: user?.name });
    getMessages(room)
      .then((res) => {
        setMessages(res.data.messages);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    socket.on("message_deleted", ({ messageId }) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    });
    return () => {
      socket.off("receive_message");
      socket.off("message_deleted");
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await saveMessage({ room, content: text });
      setText("");
    } catch {}
  };

  const handleDelete = async (id) => {
    try {
      await deleteMessage(id);
    } catch {}
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <button onClick={() => navigate("/dashboard")} className={styles.back}>
          ← Back
        </button>
        <div className={styles.roomInfo}>
          <h2>🗣️ General Chat</h2>
          <span>Campus wide • Sabke liye</span>
        </div>
        <div className={styles.onlineBadge}>🟢 Live</div>
      </nav>

      <div className={styles.messages}>
        {loading ? (
          <p className={styles.loading}>Loading...</p>
        ) : messages.length === 0 ? (
          <p className={styles.empty}>
            Koi message nahi — pehla message bhejo! 👋
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`${styles.msg} ${msg.sender?._id === user?.id || msg.sender === user?.id ? styles.own : ""}`}
            >
              <div className={styles.msgBubble}>
                {msg.sender?._id !== user?.id && msg.sender !== user?.id && (
                  <p className={styles.senderName}>{msg.senderName}</p>
                )}
                <p>{msg.content}</p>
                <span className={styles.time}>
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {(msg.sender?._id === user?.id ||
                msg.sender === user?.id ||
                user?.role === "admin") && (
                <button
                  onClick={() => handleDelete(msg._id)}
                  className={styles.delBtn}
                >
                  🗑️
                </button>
              )}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className={styles.inputArea}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message likho..."
          className={styles.input}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend(e)}
        />
        <button
          type="submit"
          className={styles.sendBtn}
          disabled={!text.trim()}
        >
          Send ➤
        </button>
      </form>
    </div>
  );
}
