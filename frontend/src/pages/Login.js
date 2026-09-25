import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password,});
      setUser(res.data);
      navigate("/habits");
    } catch (err) {alert(err.response?.data?.error || "Login failed");}
  };
  return (
    <div>
      <h1>StreakUp</h1>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account?{" "}<button onClick={() => navigate("/register")}>Register</button></p>
    </div>
  );
}

export default Login;