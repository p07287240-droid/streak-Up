import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Register({ setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      setUser(res.data);
      navigate("/habits");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };
  return (
    <div>
      <h1>StreakUp</h1>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}/>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        <button type="submit">Register</button>
      </form>
      <p>Already have an account?{" "}<button onClick={() => navigate("/login")}>Login</button></p>
    </div>
  );
}

export default Register;