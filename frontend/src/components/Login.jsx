import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/auth/login', { username, password });
      login(res.data);
      navigate("/forum");
    } catch (err) {
      setMessage(err.response?.data || "Erreur de connexion");
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 400 }}>
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
        <label>Pseudo :</label>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />

        <label>Mot de passe :</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />

        <button type="submit" style={{ marginTop: '1rem' }}>Se connecter</button>
      </form>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}

export default Login;
