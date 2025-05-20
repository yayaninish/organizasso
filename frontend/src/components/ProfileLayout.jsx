import MessageList from './MessageList';
import MessageForm from './MessageForm';

function ProfileLayout({ user, messages, isOwner, onRefresh, onAvatarChange }) {
  return (
    <div className="container">
      <h2>Profil de {user.username}</h2>

      {user.avatar && (
        <img
          src={`http://localhost:5000${user.avatar}?t=${Date.now()}`}
          alt="avatar"
          style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: '1rem',
          }}
        />
      )}

      <p><strong>Rôle :</strong> {user.role}</p>

      {isOwner && (
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="file"
            accept="image/*"
            onChange={onAvatarChange}
          />
        </div>
      )}

      <h3>Messages publics</h3>
      <MessageList messages={messages} onRefresh={onRefresh} />

      {isOwner && (
        <>
          <h3>Poster un nouveau message</h3>
          <MessageForm onPost={onRefresh} />
        </>
      )}
    </div>
  );
}

export default ProfileLayout;
