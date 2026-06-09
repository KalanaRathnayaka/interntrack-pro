import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.dataset.field]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/register", formData);

      setIsError(false);
      setMessage(response.data.message || "Registration successful");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch {
      setIsError(true);
      setMessage("Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo" />
          <span>InternTrack Pro</span>
        </div>

        <h1 className="auth-title">Create your account</h1>

        <p className="auth-subtitle">
          Sign up to track applications, manage resumes, and stay organized.
        </p>

        <form
          onSubmit={handleSubmit}
          className="auth-form"
          autoComplete="off"
        >
          <input
            type="text"
            name="register_full_name"
            data-field="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            autoComplete="off"
            required
          />

          <input
            type="email"
            name="register_email_address"
            data-field="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            autoComplete="new-email"
            required
          />

          <input
            type="password"
            name="register_new_password"
            data-field="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />

          <button type="submit" className="auth-btn">
            Register
          </button>
        </form>

        {message && (
          <p className={isError ? "auth-error" : "auth-success"}>
            {message}
          </p>
        )}

        <p className="auth-footer">
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;