import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});

  function inputData(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const { name, email, password, confirmPassword } = formData;

  function validateName(name) {
    if (name.trim().length < 3) {
      return "Name must be at least 3 characters long";
    }
  }

  function validateEmail(email) {
    if (!/\S+@\S+\.\S+/.test(email)) {
      return "Email is invalid";
    }
  }

  function validatePassword(password) {
    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[!@#$%^&*]/.test(password)
    ) {
      return "Password must be at least 8 characters long and include upper, lower, number, and special character";
    }
  }

  function validateConfirmPassword(confirmPassword) {
    if (confirmPassword !== password) {
      return "Passwords do not match";
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(formData.confirmPassword);

    if (nameError) newErrors.name = nameError;
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});

      // Password Security: Hash password before storing
      // bcrypt.hashSync() converts password to unreadable string (one-way encryption)
      // The '10' is salt rounds (higher = more secure but slower)
      const hashedPassword = bcrypt.hashSync(formData.password, 10);

      const newUser = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: hashedPassword, // Store hashed version, not plain text
      };

      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

      const userExists = storedUsers.find(
        (user) => user.email === newUser.email
      );

      if (userExists) {
        alert("User already registered. Please log in.");
        navigate("/Login");
        return;
      }

      storedUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(storedUsers));

      alert("Registration successful 🎉");


     

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      });

      navigate("/Login");
    }
  }

  return (
    <>
      <div style={{ backgroundColor: "#f9fafaff" }}>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            width: "450px",
            margin: "30px auto",
            background: "rgb(27, 137, 226)",
            gap: "3px",
            padding: "30px",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)"
          }}
          onSubmit={handleSubmit}
          noValidate
        >
          <h2 style={{ textAlign: "center", margin: "2px", color: "#fff" }}>
            REGISTER
          </h2>

          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" onChange={inputData} value={name} />
          {errors.name && <p style={{ color: "white" }}>{errors.name}</p>}

          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" onChange={inputData} value={email} />
          {errors.email && <p style={{ color: "white" }}>{errors.email}</p>}

          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" onChange={inputData} value={password} />
          {errors.password && <p style={{ color: "white" }}>{errors.password}</p>}

          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            onChange={inputData}
            value={confirmPassword}
          />
          {errors.confirmPassword && <p style={{ color: "white" }}>{errors.confirmPassword}</p>}

          <button
            type="submit"
            style={{
              maxWidth: "100px",
              alignSelf: "center",
              border: "none",
              padding: "8px 16px",
              borderRadius: "5px",
              fontSize: "18px",
              margin: "5px",
              cursor: "pointer",
            }}
          >
            Register
          </button>
        </form>
      </div>
    </>
  );
};

export default Register;