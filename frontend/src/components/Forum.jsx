import { useEffect, useState } from 'react';
import axios from 'axios';
import MessageForm from '../MessageForm';
import MessageList from './MessageList';

function Forum() {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  const fetchMessages = async () => {
    try {
      const res = await axios.get('http://localhost:5000/messages');
      setMessages(res.data);
    } catch (err) {
      setError("Erreur lors du chargement des messages.");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="container">
      <h2>Forum public</h2>
      {error && <p>{error}</p>}

      <MessageList messages={messages} onRefresh={fetchMessages} />

      <h3>Écrire un message</h3>
      <MessageForm onPost={fetchMessages} />
    </div>
  );
}

export default Forum;
