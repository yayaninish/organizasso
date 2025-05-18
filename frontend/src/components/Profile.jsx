import { useEffect, useState } from 'react';
import axios from 'axios';
import MessageForm from '../MessageForm';
import MessageList from './MessageList';

function Profile() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data.user);
      setMessages(res.data.messages);
    } catch (err) {
      setError("Erreur lors du chargement du profil.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Mon profil</h2>
      {error && <p>{error}</p>}
      {user && (
        <>
          <p><strong>Pseudo :</strong> {user.username}</p>
          <p><strong>Rôle :</strong> {user.role}</p>

          <h3>Mes messages principaux</h3>
          <MessageList messages={messages} onRefresh={fetchProfile} />

          <h3>Nouveau message</h3>
          <MessageForm onPost={fetchProfile} />
        </>
      )}
    </div>
  );
}

export default Profile;
