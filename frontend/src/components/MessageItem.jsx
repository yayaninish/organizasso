import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import MessageForm from './MessageForm';
import { Link } from 'react-router-dom';


function MessageItem({ message, replies, onRefresh }) {
  const { auth } = useAuth();
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);

  const handleDelete = async () => {
    if (!window.confirm("Supprimer ce message ?")) return;

    try {
      const res = await fetch(`http://localhost:5000/messages/${message._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });

      if (!res.ok) throw new Error();
      onRefresh();
    } catch {
      alert("Erreur lors de la suppression.");
    }
  };

  const handleEdit = async () => {
    try {
      const res = await fetch(`http://localhost:5000/messages/${message._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ content: editedContent }),
      });

      if (!res.ok) throw new Error();
      setEditing(false);
      onRefresh();
    } catch {
      alert("Erreur lors de la modification.");
    }
  };

  return (
    <li style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.3rem' }}>
        {message.author?.avatar && (
          <img
            src={`http://localhost:5000${message.author.avatar}`}
            alt="avatar"
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              objectFit: 'cover',
              marginRight: '0.5rem'
            }}
          />
        )}
        <strong>
          <Link
  to={message.author?._id === auth.userId ? "/profile" : `/user/${message.author?._id}`}
  style={{ textDecoration: 'none', fontWeight: 'bold' }}
>
  {message.author?.username || "?"}
</Link>

        </strong>
      </div>

      {editing ? (
        <>
          <textarea
            rows="3"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            style={{ width: '100%' }}
          />
          <button onClick={handleEdit}>Valider</button>
          <button onClick={() => setEditing(false)} style={{ marginLeft: '1rem' }}>Annuler</button>
        </>
      ) : (
        <p>{message.content}</p>
      )}

      <div style={{ marginTop: '0.5rem' }}>
        <button onClick={() => setReplying(!replying)}>Répondre</button>

        {message.author?._id === auth.userId && (
          <>
            <button onClick={() => setEditing(true)} style={{ marginLeft: '1rem' }}>Modifier</button>
            <button onClick={handleDelete} style={{ marginLeft: '1rem' }}>Supprimer</button>
          </>
        )}
      </div>

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

      {replies?.length > 0 && (
        <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', borderLeft: '2px solid #ddd' }}>
          {replies.map((reply) => (
            <MessageItem key={reply._id} message={reply} replies={[]} onRefresh={onRefresh} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default MessageItem;
