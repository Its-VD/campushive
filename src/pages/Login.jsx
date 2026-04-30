import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/Auth.module.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // if (!form.email.endsWith("@nitkkr.ac.in")) {
    //   setError("Sirf @nitkkr.ac.in email allowed hai");
    //   return;
    // }

    setLoading(true);
    try {
      const res = await loginUser(form);
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Kuch gadbad ho gayi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <h1>
            Campus<span>Hive</span>
          </h1>
          <p>NIT Kurukshetra ka apna platform 🎓</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>College Email</label>
            <input
              type="email"
              name="email"
              placeholder="123456789@nitkkr.ac.in"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password daalo"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? "Login ho raha hai..." : "Login Karo"}
          </button>
        </form>

        <p className={styles.link}>
          Account nahi hai? <Link to="/register">Register karo</Link>
        </p>
      </div>
    </div>
  );
}
