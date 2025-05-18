import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function NavBar() {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();

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
          {auth.role === "admin" && <Link to="/admin">Admin</Link>}

          <span style={{ marginLeft: '2rem', marginRight: '1rem' }}>
            Bienvenue {auth.username}
          </span>
          <button onClick={handleLogout}>Se déconnecter</button>
        </>
      )}
    </nav>
  );
}

export default NavBar;
