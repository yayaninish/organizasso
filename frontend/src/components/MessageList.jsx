import MessageItem from './MessageItem';

function MessageList({ messages, onRefresh }) {
  const topLevel = messages.filter(m => !m.parentId);
  const getReplies = (id) => messages.filter(m => m.parentId === id);

  return (
    <ul>
      {topLevel.map(msg => (
        <MessageItem
          key={msg._id}
          message={msg}
          replies={getReplies(msg._id)}
          onRefresh={onRefresh}
        />
      ))}
    </ul>
  );
}

export default MessageList;
