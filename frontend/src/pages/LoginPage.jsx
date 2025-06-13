import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";
import axios from "axios";

function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", formData);
            login(res.data.user);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please try again.");
        }

        setLoading(false);
    };

    return (
        <div className="login-page">
            <div className="container">
                <div className="login-container">
                    <div className="login-header">
                        <h1 className="login-title">Log In</h1>
                        <p className="login-subtitle">Welcome back! Please log in to access your account.</p>
                    </div>

                    <div className="login-form-container">
                        <form className="login-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="form-input"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="form-input"
                                    placeholder="Enter your password"
                                />
                            </div>

                            {error && <p className="error-message">{error}</p>}

                            <div className="form-options">
                                <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
                            </div>

                            <button type="submit" className="btn primary-btn full-width login-btn1" disabled={loading}>
                                {loading ? "Logging in..." : "Log In"}
                            </button>
                        </form>

                        <div className="login-footer">
                            <p className="register-prompt">
                                Don't have an account? <Link to="/register" className="register-link">Register</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
