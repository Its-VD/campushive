import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";
import styles from "../styles/Auth.module.css";

const DEGREES = ["BTech", "MTech", "MCA", "BCA", "MBA", "PhD"];
const BRANCHES = [
  "CSE",
  "ECE",
  "EE",
  "ME",
  "CE",
  "IT",
  "PIE",
  "COE",
  "CSBS",
  "General",
];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    degree: "",
    semester: "",
    branch: "",
    rollNumber: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

    if (form.password.length < 6) {
      setError("Password kam se kam 6 characters ka hona chahiye");
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        ...form,
        semester: Number(form.semester),
      });
      // OTP page pe bhejo email ke saath
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      setError(err.response?.data?.message || "Kuch gadbad ho gayi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card} style={{ maxWidth: "500px" }}>
        <div className={styles.logo}>
          <h1>
            Campus<span>Hive</span>
          </h1>
          <p>Naya account banao 🚀</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Apna naam daalo"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

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
            <label>Roll Number</label>
            <input
              type="text"
              name="rollNumber"
              placeholder="124102007"
              value={form.rollNumber}
              onChange={handleChange}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Degree</label>
              <select
                name="degree"
                value={form.degree}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                {DEGREES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Semester</label>
              <select
                name="semester"
                value={form.semester}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                {SEMESTERS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Branch</label>
            <select
              name="branch"
              value={form.branch}
              onChange={handleChange}
              required
            >
              <option value="">Select Branch</option>
              {BRANCHES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="6+ characters"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? "Register ho raha hai..." : "Register Karo"}
          </button>
        </form>

        <p className={styles.link}>
          Already account hai? <Link to="/login">Login karo</Link>
        </p>
      </div>
    </div>
  );
}
