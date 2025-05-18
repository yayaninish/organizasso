import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function NavBar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{ marginBottom: '1rem' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>Accueil</Link>

      {!auth.token && (
        <>
          <Link to="/register" style={{ marginRight: '1rem' }}>Inscription</Link>
          <Link to="/login" style={{ marginRight: '1rem' }}>Connexion</Link>
        </>
      )}

      {auth.token && (
        <>
          <Link to="/forum" style={{ marginRight: '1rem' }}>Forum</Link>
          <Link to="/profile" style={{ marginRight: '1rem' }}>Profil</Link>
          {auth.role === "admin" && (
            <Link to="/admin" style={{ marginRight: '1rem' }}>Admin</Link>
          )}

          {auth.avatar && (
            <img
              src={`http://localhost:5000${auth.avatar}`}
              alt="avatar"
              style={{ width: 30, height: 30, borderRadius: '50%', verticalAlign: 'middle', marginRight: '0.5rem' }}
            />
          )}
          <span style={{ marginRight: '1rem' }}>
            Bienvenue {auth.username}
          </span>
          <button onClick={handleLogout}>Se déconnecter</button>
        </>
      )}
    </nav>
  );
}

export default NavBar;
