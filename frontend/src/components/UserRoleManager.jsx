import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

function UserRoleManager() {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/users", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      const data = await res.json();
      setUsers(data.filter(u => u._id !== auth.userId)); // exclut soi-même
    } catch {
      setError("Erreur lors du chargement des utilisateurs.");
    }
  };

  const updateRole = async (id, role) => {
    try {
      const res = await fetch(`http://localhost:5000/admin/role/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error();
      fetchUsers(); // recharger la liste
    } catch {
      alert("Erreur lors de la mise à jour du rôle.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h3>Gérer les rôles</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        placeholder="Rechercher un utilisateur..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '1rem', width: '100%' }}
      />

      <ul>
        {filtered.map((u) => (
          <li key={u._id} style={{ marginBottom: '1rem' }}>
            <strong>{u.username}</strong> — rôle : {u.role}
            <select
              value={u.role}
              onChange={(e) => updateRole(u._id, e.target.value)}
              style={{ marginLeft: '1rem' }}
            >
              <option value="membre">membre</option>
              <option value="admin">admin</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserRoleManager;
