import { useState } from 'react';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/auth/register', {
        username,
        password
      });
      setMessage(res.data);
      setUsername('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage(err.response?.data || "Erreur lors de l'inscription");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 400 }}>
      <h2>Inscription</h2>
      <form onSubmit={handleRegister}>
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
        <div>
          <label>Confirmer le mot de passe :</label><br />
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: '1rem' }}>S'inscrire</button>
      </form>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}

export default Register;
