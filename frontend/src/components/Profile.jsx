import { useEffect, useState } from 'react';
import MessageForm from './MessageForm';
import MessageList from './MessageList';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { auth, login } = useAuth();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

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

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await fetch("http://localhost:5000/upload/avatar", {
        method: "POST",
        headers: { Authorization: `Bearer ${auth.token}` },
        body: formData
      });

      const data = await res.json();
      setUser((prev) => ({ ...prev, avatar: data.avatar }));
      login({ ...auth, avatar: data.avatar }); // met à jour le contexte
    } catch (err) {
      alert("Erreur lors de l’upload de l’image.");
    }
  };

  return (
    <div className="container">
      <h2>Mon profil</h2>
      {error && <p>{error}</p>}
      {user && (
        <>
          <p><strong>Pseudo :</strong> {user.username}</p>
          <p><strong>Rôle :</strong> {user.role}</p>

          <h3>Photo de profil</h3>
          {user.avatar && (
            <img
              src={`http://localhost:5000${user.avatar}`}
              alt="avatar"
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                objectFit: "cover",
                display: 'block',
                marginBottom: '1rem'
              }}
            />
          )}
          {preview && (
            <img
              src={preview}
              alt="Aperçu"
              style={{ width: 100, borderRadius: "50%", marginBottom: '1rem' }}
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ marginBottom: '2rem' }}
          />

          <h3>Mes messages</h3>
          <MessageList messages={messages} onRefresh={fetchProfile} />

          <h3>Nouveau message</h3>
          <MessageForm onPost={fetchProfile} />
        </>
      )}
    </div>
  );
}

export default Profile;
