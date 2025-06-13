import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/register.css";
import axios from "axios";

function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "",
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
            const res = await axios.post("http://localhost:5000/api/auth/register", formData);
            register(res.data.user);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }

        setLoading(false);
    };

    return (
        <div className="register-page">
            <div className="container">
                <div className="register-container">
                    <div className="register-header">
                        <h1 className="register-title">Create an Account</h1>
                        <p className="register-subtitle">Join our community to access personalized services and information.</p>
                    </div>

                    <div className="register-form-container">
                        <form className="register-form" onSubmit={handleSubmit}>
                            <div className="form-grid">
                                {["firstName", "lastName", "email", "phone", "password", "confirmPassword"].map((field) => (
                                    <div className="form-group" key={field}>
                                        <label className="form-label" htmlFor={field}>
                                            {field.charAt(0).toUpperCase() + field.slice(1).replace("Name", " Name")}
                                        </label>
                                        <input
                                            type={field.includes("password") ? "password" : "text"}
                                            id={field}
                                            name={field}
                                            value={formData[field]}
                                            onChange={handleChange}
                                            required
                                            className="form-input"
                                        />
                                    </div>
                                ))}

                                <div className="form-group full-width">
                                    <label className="form-label" htmlFor="role">I am a:</label>
                                    <select id="role" name="role" value={formData.role} onChange={handleChange} className="form-select">
                                        <option value="family">Family Member</option>
                                        <option value="resident">Resident</option>
                                        <option value="caregiver">Caregiver</option>
                                        <option value="healthcare">Healthcare Professional</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            {error && <p className="error-message">{error}</p>}
                            <button type="submit" className="btn primary-btn full-width" disabled={loading}>
                                {loading ? "Creating Account..." : "Create Account"}
                            </button>
                        </form>

                        <div className="register-footer">
                            <p className="login-prompt">
                                Already have an account?{" "}
                                <Link to="/login" className="login-link">Log In</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
