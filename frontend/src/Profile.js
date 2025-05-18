import { useEffect, useState } from 'react';
import axios from 'axios';
import MessageForm from './MessageForm';

function Profile() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data.user);
      setMessages(res.data.messages);
    } catch (err) {
      setError("Erreur lors du chargement du profil.");
    }
  };

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

  const handleEdit = async (id) => {
    try {
      await axios.put(`http://localhost:5000/messages/${id}`, {
        content: editContent
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingId(null);
      fetchProfile();
    } catch (err) {
      alert("Erreur lors de la modification.");
    }
  };

  const getReplies = (id) => messages.filter(m => m.parentId === id);

  const handlePost = () => {
    setReplyTo(null);
    fetchProfile();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Mon profil</h2>
      {error && <p>{error}</p>}
      {user && (
        <>
          <p><strong>Pseudo :</strong> {user.username}</p>
          <p><strong>Rôle :</strong> {user.role}</p>

          <h3>Mes messages principaux</h3>
          {messages.filter(m => !m.parentId).length === 0 ? (
            <p>Aucun message principal.</p>
          ) : (
            <ul>
              {messages
                .filter(m => !m.parentId)
                .map(m => (
                  <li key={m._id} style={{ marginBottom: '1rem' }}>
                    {editingId === m._id ? (
                      <>
                        <textarea
                          value={editContent}
                          onChange={e => setEditContent(e.target.value)}
                          rows="3"
                          cols="50"
                        /><br />
                        <button onClick={() => handleEdit(m._id)}>Valider</button>
                        <button onClick={() => setEditingId(null)} style={{ marginLeft: '1rem' }}>
                          Annuler
                        </button>
                      </>
                    ) : (
                      <>
                        <span>
                          <strong>{m.author?.username || "?"} :</strong> {m.content}
                        </span><br />
                        <small>{new Date(m.createdAt).toLocaleString()}</small><br />
                        <button onClick={() => setSelectedId(selectedId === m._id ? null : m._id)}>
                          {selectedId === m._id ? 'Cacher les réponses' : 'Voir les réponses'}
                        </button>
                        <button onClick={() => setReplyTo(m._id)} style={{ marginLeft: '1rem' }}>
                          Répondre
                        </button>
                        <button onClick={() => {
                          setEditingId(m._id);
                          setEditContent(m.content);
                        }} style={{ marginLeft: '1rem' }}>
                          Modifier
                        </button>
                        <button onClick={() => handleDelete(m._id)} style={{ marginLeft: '1rem' }}>
                          Supprimer
                        </button>
                      </>
                    )}

                    {/* Réponses */}
                    {selectedId === m._id && (
                      <ul style={{ marginTop: '0.5rem', marginLeft: '1rem' }}>
                        {getReplies(m._id).length === 0
                          ? <li><em>Aucune réponse.</em></li>
                          : getReplies(m._id).map(r => (
                              <li key={r._id} style={{ marginBottom: '0.5rem' }}>
                                {editingId === r._id ? (
                                  <>
                                    <textarea
                                      value={editContent}
                                      onChange={e => setEditContent(e.target.value)}
                                      rows="2"
                                      cols="40"
                                    /><br />
                                    <button onClick={() => handleEdit(r._id)}>Valider</button>
                                    <button onClick={() => setEditingId(null)} style={{ marginLeft: '1rem' }}>
                                      Annuler
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <span>
                                      <strong>{r.author?.username || "?"} :</strong> {r.content}
                                    </span><br />
                                    <small>{new Date(r.createdAt).toLocaleString()}</small><br />
                                    <button onClick={() => {
                                      setEditingId(r._id);
                                      setEditContent(r.content);
                                    }}>Modifier</button>
                                    <button onClick={() => handleDelete(r._id)} style={{ marginLeft: '1rem' }}>
                                      Supprimer
                                    </button>
                                  </>
                                )}
                              </li>
                            ))}
                      </ul>
                    )}

                    {/* Formulaire de réponse */}
                    {replyTo === m._id && (
                      <MessageForm parentId={m._id} onPost={handlePost} />
                    )}
                  </li>
                ))}
            </ul>
          )}

          <h3 style={{ marginTop: '2rem' }}>Nouveau message</h3>
          <MessageForm onPost={handlePost} />
        </>
      )}
    </div>
  );
}

export default Profile;
