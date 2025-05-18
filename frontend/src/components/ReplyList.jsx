function ReplyList({ replies }) {
  return replies.map(reply => (
    <MessageItem key={reply._id} message={reply} />
  ));
}
