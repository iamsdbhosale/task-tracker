// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/login', { username, password });
      if (res.data.success) {
        onLogin(res.data.user);
      } else {
        setError('Login failed');
      }
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Task Tracker Login</h2>
      <form onSubmit={submitHandler}>
        <div>
          <label>Username</label><br />
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div style={{ marginTop: 10 }}>
          <label>Password</label><br />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button style={{ marginTop: 15 }} type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
