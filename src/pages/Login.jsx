import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from 'bcryptjs';
import './Login.css'
import { AuthContext } from "../context/AuthContext";


const Login = () => {
    const navigate = useNavigate();
    
    const {login}=useContext(AuthContext);

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});

    function inputData(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function validateEmail(email) {
        if (!email) return "Email is required";
        else if (!/\S+@\S+\.\S+/.test(email)) return "Invalid email format";
    }

    function validatePassword(password) {
        if (!password) return "Password is required";
        else if (password.length < 8)
            return "Password must be at least 8 characters long";
    }

    function handleSubmit(e) {
        e.preventDefault();

        const newErrors = {};
        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password);

        if (emailError) newErrors.email = emailError;
        if (passwordError) newErrors.password = passwordError;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const users = JSON.parse(localStorage.getItem("users")) || [];
        
        //  Find user by email first
        const existingUser = users.find((u) => u.email === formData.email);

        //  Check if user exists and password matches the hashed version
        // bcrypt.compareSync() compares plain password with hashed password
        if (existingUser && bcrypt.compareSync(formData.password, existingUser.password)) {
            localStorage.setItem("currentUser", JSON.stringify(existingUser));
            navigate("/");
            login(existingUser);
        } else {
            alert("Invalid email or password!");
        }
    }

    return (
        <div className="login-container">
            <form className="login-card" onSubmit={handleSubmit}>
                <h1 className="logo">
                    <span className="logo-icon">📍</span> LocalLens
                </h1>
                <h2>Welcome Back!</h2>
                <p className="subtitle">Sign in to discover amazing places near you</p>

                <label>Email Address</label>
                <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={inputData}
                />
                {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}

                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={inputData}
                />
                {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}

                <button type="submit" className="signin-btn">
                    Sign In
                </button>

                <p className="account-text">Don't have an account?</p>
                <button
                    type="button"
                    className="create-btn"
                    onClick={() => navigate("/Register")}
                >
                    Create Account
                </button>
            </form>
        </div>
    );
};

export default Login;