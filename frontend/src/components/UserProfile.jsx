import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MessageList from './MessageList';

function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  const fetchUser = async () => {
    try {
      const res = await fetch(`http://localhost:5000/users/${id}`);
      if (!res.ok) throw new Error('Erreur');
      const data = await res.json();
      setUser(data.user);
      setMessages(data.messages);
    } catch (err) {
      setError("Utilisateur introuvable.");
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="container">
      {error && <p>{error}</p>}

      {user && (
        <>
          <h2>Profil de {user.username}</h2>
          {user.avatar && (
            <img
              src={`http://localhost:5000${user.avatar}`}
              alt="avatar"
              style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: '1rem'
              }}
            />
          )}
          <p><strong>Rôle :</strong> {user.role}</p>

          <h3>Messages publics</h3>
          <MessageList messages={messages} onRefresh={fetchUser} />
        </>
      )}
    </div>
  );
}

export default UserProfile;
