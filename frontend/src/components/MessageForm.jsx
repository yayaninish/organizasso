import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function MessageForm({ parentId = null, onPost, isPrivate = false }) {
  const { auth } = useAuth();
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      console.log("Submit avec isPrivate =", isPrivate); // DEBUG

      const res = await fetch('http://localhost:5000/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`
        },
        body: JSON.stringify({
          content,
          parentId,
          isPrivate: isPrivate || false // ✅ c’est ici que ça compte
        })
      });

      if (!res.ok) throw new Error('Erreur serveur');

      setContent('');
      setError('');
      onPost(); // ✅ recharge les messages
    } catch (err) {
      setError("Impossible d’envoyer le message.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
      <textarea
        rows="3"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Écrire un message..."
        style={{ width: '100%', padding: '0.5rem' }}
      />
      <button type="submit" style={{ marginTop: '0.5rem' }}>Envoyer</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default MessageForm;
