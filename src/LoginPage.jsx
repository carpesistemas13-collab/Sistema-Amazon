import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import logo from './img/logo.png'; // Import the logo image
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Login.css'; // Import the new CSS file

const LoginPage = () => {
  const [username, setUsername] = useState(''); // Changed from email to username
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Supabase signInWithPassword expects an email. For now, we'll use the username as email.
    // If a true username system is needed, a custom backend mapping would be required.
    const { error } = await supabase.auth.signInWithPassword({ email: username, password });

    if (error) {
      setError(error.message);
    } else {
      // Redirect to home page after successful login
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Company Logo" className="login-logo" /> {/* Added logo */}
      <h2></h2>
      <form onSubmit={handleLogin}>
        <input
          type="text" // Changed type to text
          placeholder="Usuario" // Changed placeholder to Usuario
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="login-input" // Added class for styling
        />
        <input
          type="password"
          placeholder="Contraseña" // Changed placeholder to Contraseña
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="login-input" // Added class for styling
        />
        <button type="submit" disabled={loading}>Login</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default LoginPage;