import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProfileLayout from './ProfileLayout';

function Profile() {
  const { auth, login } = useAuth();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/profile", {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      const data = await res.json();
      setUser(data.user);
      setMessages(data.messages);
    } catch (err) {
      setError("Erreur lors du chargement du profil.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await fetch("http://localhost:5000/upload/avatar", {
        method: "POST",
        headers: { Authorization: `Bearer ${auth.token}` },
        body: formData
      });

      const data = await res.json();

      // 🔁 met à jour auth + recharge les données à jour
      login({ ...auth, avatar: data.avatar });
      await fetchProfile(); // recharge le user mis à jour
    } catch {
      alert("Erreur lors de l’upload.");
    }
  };

  return user ? (
    <ProfileLayout
      user={user}
      messages={messages}
      isOwner={true}
      onRefresh={fetchProfile}
      onAvatarChange={handleAvatarChange}
    />
  ) : <p>{error}</p>;
}

export default Profile;
