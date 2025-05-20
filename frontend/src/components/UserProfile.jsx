import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProfileLayout from './ProfileLayout';

function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  const fetchUser = async () => {
    try {
      const res = await fetch(`http://localhost:5000/users/${id}`);
      const data = await res.json();
      setUser(data.user);
      setMessages(data.messages);
    } catch {
      setError("Utilisateur introuvable.");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  return user ? (
    <ProfileLayout
      user={user}
      messages={messages}
      isOwner={false}
      onRefresh={fetchUser}
    />
  ) : <p>{error}</p>;
}

export default UserProfile;
