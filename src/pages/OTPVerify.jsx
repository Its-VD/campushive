import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyOTP, resendOTP } from "../services/api";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/Auth.module.css";

export default function OTPVerify() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // Agar email nahi hai toh register pe bhejo
  useEffect(() => {
    if (!email) navigate("/register");
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await verifyOTP({ email, otp });
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "OTP galat hai");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");
    try {
      await resendOTP({ email });
      setSuccess("Naya OTP bheja gaya!");
      setTimer(60);
    } catch (err) {
      setError(err.response?.data?.message || "Kuch gadbad ho gayi");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <h1>
            Campus<span>Hive</span>
          </h1>
          <p>Email verify karo 📧</p>
        </div>

        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "14px",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          OTP bheja gaya hai:{" "}
          <strong style={{ color: "var(--primary)" }}>{email}</strong>
        </p>

        <form onSubmit={handleVerify} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>6-Digit OTP</label>
            <input
              type="text"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              style={{
                fontSize: "24px",
                letterSpacing: "8px",
                textAlign: "center",
              }}
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.successMsg}>{success}</div>}

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? "Verify ho raha hai..." : "Verify Karo"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "16px",
            color: "var(--text-muted)",
            fontSize: "14px",
          }}
        >
          {timer > 0 ? (
            `Resend OTP: ${timer}s`
          ) : (
            <button
              onClick={handleResend}
              style={{
                background: "none",
                border: "none",
                color: "var(--primary)",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              OTP dobara bhejo
            </button>
          )}
        </p>
      </div>
    </div>
  );
}
