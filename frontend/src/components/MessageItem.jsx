import MessageForm from '../MessageForm';
import { useState } from 'react';

function MessageItem({ message, replies, onRefresh, isReply = false }) {
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  const handleDelete = async () => {
    if (!window.confirm("Supprimer ce message ?")) return;
    await fetch(`http://localhost:5000/messages/${message._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    onRefresh();
  };

  const handleEdit = async () => {
    await fetch(`http://localhost:5000/messages/${message._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ content: editContent })
    });
    setEditing(false);
    onRefresh();
  };

  return (
    <li style={{ marginBottom: '1rem', marginLeft: isReply ? '2rem' : 0 }}>
      {editing ? (
        <>
          <textarea
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
            rows="2"
            cols="50"
          /><br />
          <button onClick={handleEdit}>Valider</button>
          <button onClick={() => setEditing(false)} style={{ marginLeft: '1rem' }}>Annuler</button>
        </>
      ) : (
        <>
          <strong>{message.author?.username || "?"} :</strong> {message.content}<br />
          <small>{new Date(message.createdAt).toLocaleString()}</small><br />
          {message.author?._id === userId && (
            <>
              <button onClick={() => setReplying(!replying)}>Répondre</button>
              <button onClick={() => setEditing(true)} style={{ marginLeft: '1rem' }}>Modifier</button>
              <button onClick={handleDelete} style={{ marginLeft: '1rem' }}>Supprimer</button>
            </>
          )}
        </>
      )}

      {replying && (
        <MessageForm parentId={message._id} onPost={() => {
          setReplying(false);
          onRefresh();
        }} />
      )}

      {/* Réponses */}
      {replies && replies.length > 0 && (
        <ul>
          {replies.map(reply => (
            <MessageItem
              key={reply._id}
              message={reply}
              replies={[]}
              onRefresh={onRefresh}
              isReply={true}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default MessageItem;
