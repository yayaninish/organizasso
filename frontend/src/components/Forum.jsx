import { useEffect, useState } from 'react';
import MessageList from './MessageList';
import MessageForm from './MessageForm';
import { useAuth } from '../context/AuthContext';

function Forum() {
  const { auth } = useAuth();
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const fetchMessages = async () => {
    try {
      const res = await fetch("http://localhost:5000/messages", {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      setError("Erreur lors du chargement des messages.");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = messages.filter(m => {
  const search = searchTerm.toLowerCase();
  const contentMatch = m.content.toLowerCase().includes(search);
  const authorMatch = m.author?.username?.toLowerCase().includes(search);
  const repliesMatch = messages
    .filter(r => r.parentId === m._id)
    .some(r =>
      r.content.toLowerCase().includes(search) ||
      r.author?.username?.toLowerCase().includes(search)
    );

  return contentMatch || authorMatch || repliesMatch;
});


  return (
    <div className="container">
      
      <MessageForm onPost={fetchMessages} />

      {error && <p>{error}</p>}
      <input
        type="text"
        placeholder="Rechercher un mot-clé, auteur, ..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '1rem', width: '100%', padding: '0.5rem' }}
      />

      <MessageList messages={filteredMessages} onRefresh={fetchMessages} />


    </div>
  );
}

export default Forum;
