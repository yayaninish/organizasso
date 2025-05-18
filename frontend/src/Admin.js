import { useEffect, useState } from 'react';
import axios from 'axios';

function Admin() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  // Charger la liste des utilisateurs à valider
  const fetchPending = async () => {
    try {
      const res = await axios.get('http://localhost:5000/admin/pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingUsers(res.data);
    } catch (err) {
      console.error("Erreur récupération :", err.response?.data || err.message);
      setMessage("Erreur lors de la récupération.");
    }
  };

  // Valider un utilisateur
  const validateUser = async (id) => {
    try {
      await axios.put(`http://localhost:5000/admin/validate/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("Utilisateur validé !");
      fetchPending(); // recharge la liste
    } catch (err) {
      console.error("Erreur validation :", err.response?.data || err.message);
      setMessage("Erreur lors de la validation.");
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Validation des comptes</h2>
      {message && <p>{message}</p>}
      {pendingUsers.length === 0 ? (
        <p>Aucun compte en attente.</p>
      ) : (
        <ul>
          {pendingUsers.map(user => (
            <li key={user._id}>
              {user.username} ({user.role})
              <button onClick={() => validateUser(user._id)} style={{ marginLeft: '1rem' }}>
                Valider
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Admin;
