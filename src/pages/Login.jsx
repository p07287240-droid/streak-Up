import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });
      setUser(res.data);
      navigate("/habits", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Unable to reach the server. Make sure the backend is running.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-title">
        <Link className="auth-brand" to="/login"><span className="auth-flame">🔥</span><span>StreakUp</span></Link>
        <p className="auth-eyebrow">YOUR DAILY MOMENTUM</p>
        <h1 id="login-title">Welcome back</h1>
        <p className="auth-description">Sign in and keep your streak going.</p>
        <form className="auth-form" onSubmit={handleLogin}>
          <label htmlFor="login-email">Email</label>
          <input id="login-email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label htmlFor="login-password">Password</label>
          <input id="login-password" type="password" autoComplete="current-password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="auth-submit" type="submit" disabled={submitting}>{submitting ? "Signing in…" : "Sign in"}</button>
        </form>
        <p className="auth-switch">New to StreakUp? <Link to="/register">Create an account</Link></p>
      </section>
    </main>
  );
}

export default Login;
