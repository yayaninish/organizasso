import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import UserRoleManager from './UserRoleManager';

function AdminPanel() {
  const { auth } = useAuth();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [error, setError] = useState('');

  const fetchPendingUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/pending", {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      const data = await res.json();
      setPendingUsers(data);
    } catch (err) {
      setError("Erreur lors de la récupération.");
    }
  };

  const validateUser = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/admin/validate/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      if (!res.ok) throw new Error();
      fetchPendingUsers(); // refresh après validation
    } catch {
      alert("Erreur lors de la validation.");
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  return (
    <div className="container">
      <h2>Panneau d’administration</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <section style={{ marginBottom: '2rem' }}>
        <h3>Comptes en attente</h3>
        {pendingUsers.length === 0 ? (
          <p>Aucun utilisateur en attente.</p>
        ) : (
          <ul>
            {pendingUsers.map(user => (
              <li key={user._id} style={{ marginBottom: '0.5rem' }}>
                {user.username} — {user.role}
                <button
                  onClick={() => validateUser(user._id)}
                  style={{ marginLeft: '1rem' }}
                >
                  Valider
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <UserRoleManager />
    </div>
  );
}

export default AdminPanel;
