import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { aiChat } from "../services/api";
import styles from "../styles/AIAssistant.module.css";

export default function AIAssistant() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hey! Main CampusHive AI hoon 🤖 Kuch bhi poochho — notes, doubts, campus life!",
    },
  ]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || loading) return;
    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setText("");
    setLoading(true);
    try {
      const history = messages
        .slice(-10)
        .map((m) => ({ role: m.role, content: m.content }));
      const res = await aiChat({ message: text, history });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.message },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Kuch gadbad ho gayi, dobara try karo!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "DSA mein trees explain karo",
    "DBMS normalization kya hai?",
    "OS scheduling algorithms batao",
    "Placement prep kaise karein?",
  ];

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <button onClick={() => navigate("/dashboard")} className={styles.back}>
          ← Back
        </button>
        <div className={styles.roomInfo}>
          <h2>🤖 AI Assistant</h2>
          <span>Powered by Groq • Llama 3.3</span>
        </div>
        <div className={styles.badge}>⚡ Fast</div>
      </nav>

      <div className={styles.messages}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`${styles.msg} ${msg.role === "user" ? styles.own : ""}`}
          >
            {msg.role === "assistant" && (
              <div className={styles.aiAvatar}>🤖</div>
            )}
            <div className={styles.bubble}>
              <p>{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className={styles.msg}>
            <div className={styles.aiAvatar}>🤖</div>
            <div className={styles.bubble}>
              <p className={styles.typing}>Soch raha hoon...</p>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length === 1 && (
        <div className={styles.suggestions}>
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => {
                setText(s);
              }}
              className={styles.suggestion}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSend} className={styles.inputArea}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Kuch bhi poochho..."
          className={styles.input}
        />
        <button
          type="submit"
          className={styles.sendBtn}
          disabled={!text.trim() || loading}
        >
          Send ➤
        </button>
      </form>
    </div>
  );
}
