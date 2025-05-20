import MessageForm from './MessageForm';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function MessageItem({ message, replies, onRefresh, isReply = false }) {
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const { auth } = useAuth();

  const handleDelete = async () => {
    if (!window.confirm("Supprimer ce message ?")) return;
    await fetch(`http://localhost:5000/messages/${message._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    onRefresh();
  };

  const handleEdit = async () => {
    await fetch(`http://localhost:5000/messages/${message._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`
      },
      body: JSON.stringify({ content: editContent })
    });
    setEditing(false);
    onRefresh();
  };

  return (
    <li style={{ marginBottom: '1rem', marginLeft: isReply ? '2rem' : 0 }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
    {message.author?.avatar && (
      <img
        src={`http://localhost:5000${message.author.avatar}`}
        alt="avatar"
        style={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          objectFit: 'cover'
        }}
      />
    )}
    <strong>
  <a href={`/user/${message.author?._id}`} style={{ textDecoration: 'none' }}>
    {message.author?.username || "?"}
  </a>
</strong>

  </div>

  <p style={{ margin: '0.5rem 0' }}>{message.content}</p>
  <small>{new Date(message.createdAt).toLocaleString()}</small><br />
    <button onClick={() => setReplying(!replying)}>Répondre</button>
  {message.author?._id === auth.userId && (
    <>
      <button onClick={() => setEditing(true)} style={{ marginLeft: '0.5rem' }}>Modifier</button>
      <button onClick={handleDelete} style={{ marginLeft: '0.5rem' }}>Supprimer</button>
    </>
  )}

  {replying && (
    <MessageForm
  parentId={message._id}
  onPost={() => {
    setReplying(false);
    onRefresh();
  }}
  isPrivate={message.isPrivate}
/>

  )}

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
