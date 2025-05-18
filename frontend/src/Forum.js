import { useState } from 'react';
import MessageForm from './MessageForm';
import MessageList from './MessageList';

function Forum() {
  const username = localStorage.getItem('username');
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshMessages = () => setRefreshKey(prev => prev + 1);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Forum public</h2>
      <p>Bienvenue {username} !</p>
      <MessageForm onPost={refreshMessages} />
      <MessageList refreshKey={refreshKey} />
    </div>
  );
}

export default Forum;
