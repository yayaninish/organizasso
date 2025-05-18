import { useEffect, useState } from 'react';
import axios from 'axios';
import MessageForm from './MessageForm';

function MessageList({ refreshKey }) {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    axios.get('http://localhost:5000/messages')
      .then(res => setMessages(res.data))
      .catch(() => setError("Erreur lors du chargement des messages"));
  }, [refreshKey]);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce message ?")) return;
    try {
      await axios.delete(`http://localhost:5000/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(messages.filter(m => m._id !== id));
    } catch (err) {
      alert("Erreur lors de la suppression.");
    }
  };

  const topMessages = messages.filter(msg => !msg.parentId);
  const getReplies = (id) => messages.filter(msg => msg.parentId === id);

  const renderMessage = (msg) => (
    <li key={msg._id} style={{ marginBottom: '1rem', marginLeft: msg.parentId ? '2rem' : 0 }}>
      <strong>{msg.author?.username || "Anonyme"}</strong><br />
      <span>{msg.content}</span><br />
      <small>{new Date(msg.createdAt).toLocaleString()}</small><br />

      <button onClick={() => setReplyingTo(msg._id)}>Répondre</button>

      {/* Supprimer si c'est mon message */}
      {msg.author?._id === userId && (
        <button onClick={() => handleDelete(msg._id)} style={{ marginLeft: '1rem' }}>
          Supprimer
        </button>
      )}

      {/* Formulaire de réponse */}
      {replyingTo === msg._id && (
        <MessageForm parentId={msg._id} onPost={() => {
          setReplyingTo(null);
          setTimeout(() => window.location.reload(), 300); // recharge
        }} />
      )}

      {/* Réponses imbriquées */}
      <ul>
        {getReplies(msg._id).map(renderMessage)}
      </ul>
    </li>
  );

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Messages récents</h3>
      {error && <p>{error}</p>}
      <ul>{topMessages.map(renderMessage)}</ul>
    </div>
  );
}

export default MessageList;
