import { useEffect, useState } from 'react';
import MessageForm from './MessageForm';
import MessageList from './MessageList';
import { useAuth } from '../context/AuthContext';

function AdminForum() {
  const { auth } = useAuth();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  const fetchPrivateMessages = async () => {
  try {
    console.log("Chargement des messages privés...");
    const res = await fetch("http://localhost:5000/messages?private=true", {
      headers: { Authorization: `Bearer ${auth.token}` }
    });

    const data = await res.json();
    console.log("Messages reçus :", data); // 👈 important

    setMessages(data);
  } catch (err) {
    console.error("Erreur : ", err);
    setError("Erreur lors du chargement des messages privés.");
  }
};


  useEffect(() => {
    fetchPrivateMessages();
  }, []);

  return (
    <div className="container">
      <h2>Forum privé (admin)</h2>
      {error && <p>{error}</p>}

      <MessageList messages={messages} onRefresh={fetchPrivateMessages} />

      <h3>Poster un message privé</h3>
      <MessageForm onPost={fetchPrivateMessages} isPrivate={true} />

    </div>
  );
}

export default AdminForum;
