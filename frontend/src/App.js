import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Register from './Register';
import Login from './Login';
import Forum from './Forum';
import Admin from './Admin';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <Router>
      <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
        <h1>Organiz'asso</h1>

        {/* Barre de navigation */}
        <nav style={{ marginBottom: '1rem' }}>
          <Link to="/" style={{ marginRight: '1rem' }}>Accueil</Link>
          <Link to="/register" style={{ marginRight: '1rem' }}>Inscription</Link>
          <Link to="/login" style={{ marginRight: '1rem' }}>Connexion</Link>
          <Link to="/forum" style={{ marginRight: '1rem' }}>Forum</Link>
          <Link to="/admin">Admin</Link>
        </nav>

        {/* Système de routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/forum"
            element={
              <ProtectedRoute>
                <Forum />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
