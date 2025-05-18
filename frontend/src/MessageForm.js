import { useState } from 'react';
import axios from 'axios';

function MessageForm({ onPost, parentId = null }) {
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/messages', {
        content,
        parentId,
        isPrivate: false
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("Message publié !");
      setContent('');
      if (onPost) onPost();
    } catch (err) {
      setMessage(err.response?.data || "Erreur lors de l'envoi.");
    }
  };

  return (
    <div style={{ marginTop: '1rem', marginLeft: parentId ? '2rem' : 0 }}>
      {parentId && <p><em>En réponse à un message</em></p>}
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          rows="3"
          cols="50"
          placeholder="Votre message..."
          required
        />
        <br />
        <button type="submit">Envoyer</button>
      </form>
      {message && <p style={{ marginTop: '0.5rem' }}>{message}</p>}
    </div>
  );
}

export default MessageForm;
