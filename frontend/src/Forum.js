function Forum() {
  const username = localStorage.getItem('username');

  return (
    <div>
      <h2>Forum</h2>
      <p>Bienvenue sur le forum, {username} !</p>
      {/* Tu pourras ici afficher les messages, créer un post, etc. */}
    </div>
  );
}

export default Forum;
