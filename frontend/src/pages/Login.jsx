import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.dataset.field]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", formData);

      localStorage.setItem("token", response.data.token);

      navigate("/dashboard");
    } catch {
      setMessage("Invalid email or password");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo" />
          <span>InternTrack Pro</span>
        </div>

        <h1 className="auth-title">Welcome back</h1>

        <p className="auth-subtitle">
          Sign in to manage your internship applications with confidence.
        </p>

        <form
          onSubmit={handleSubmit}
          className="auth-form"
          autoComplete="off"
        >
          <input
            type="email"
            name="login_email_address"
            data-field="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="new-email"
            required
          />

          <input
            type="password"
            name="login_password_field"
            data-field="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />

          <button type="submit" className="auth-btn">
            Login
          </button>
        </form>

        {message && <p className="auth-error">{message}</p>}

        <p className="auth-footer">
          Don&apos;t have an account?
          <Link to="/register"> Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;