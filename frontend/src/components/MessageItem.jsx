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
    <li className="message-card">
      {message.author?.avatar && (
        <img
          className="message-avatar"
          src={`http://localhost:5000${message.author.avatar}`}
          alt="avatar"
        />
      )}

      <div className="message-body">
        <strong>
          <Link
            to={
              message.author?._id === auth.userId
                ? "/profile"
                : `/user/${message.author?._id}`
            }
            style={{ textDecoration: 'none' }}
          >
            {message.author?.username || "?"}
          </Link>
        </strong>

        {editing ? (
          <>
            <textarea
              rows="3"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              style={{ width: '100%' }}
            />
            <div className="message-actions">
              <button onClick={handleEdit}>Valider</button>
              <button onClick={() => setEditing(false)}>Annuler</button>
            </div>
          </>
        ) : (
          <p>{message.content}</p>
        )}

        <div className="message-actions">
          <button onClick={() => setReplying(!replying)}>Répondre</button>

          {message.author?._id === auth.userId && (
            <>
              <button onClick={() => setEditing(true)}>Modifier</button>
              <button onClick={handleDelete}>Supprimer</button>
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
      </div>
    </li>
  );
}

export default MessageItem;
