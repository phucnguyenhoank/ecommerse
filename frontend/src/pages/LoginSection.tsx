// src/components/LoginSection.tsx
import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import '../styles/LoginSection.css';


const LoginSection: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Lưu thông tin user vào localStorage nếu muốn
        localStorage.setItem('userInfo', JSON.stringify(data.user));

        alert('Login successful');
        navigate('/'); // ➜ chuyển về trang chủ sau đăng nhập
      } else {
        alert(data.message || 'Incorrect username or password');
      }
    } catch (error) {
      alert('Failed to connect to the server');
      console.error(error);

    }
  };

  return (
    <div className="login-section">
      <h2>LOGIN</h2>
      <p>
        Login for this site allows you to access your order status and
        history. Just fill in the fields below, and we'll get a new account
        set up for you in no time. We will only ask you for information
        necessary to make the purchase process faster and easier.
      </p>

      <form
        className="login-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your username"
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="login-btn">
          LOGIN
        </button>

        <p style={{ color: 'black' }}>
          If you don't have an account, <Link to="/signup">register here</Link>
        </p>

        <div className="forgot-password">
          <Link to="/forgot-password">Forgot your password?</Link>
        </div>

      </form>
    </div>
  );
};

export default LoginSection;
