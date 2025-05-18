import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/auth/login', {
        username,
        password
      });

      const { token, username: name, role, userId } = res.data;
      login({ token, username, role, userId });

      // Stocke les infos
      localStorage.setItem('token', token);
      localStorage.setItem('username', name);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', userId); // nécessaire pour la suppression

      setMessage(`Bienvenue ${name} !`);
      setUsername('');
      setPassword('');
    } catch (err) {
      setMessage(err.response?.data || "Erreur lors de la connexion");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 400 }}>
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Pseudo :</label><br />
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Mot de passe :</label><br />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: '1rem' }}>Se connecter</button>
      </form>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}

export default Login;
