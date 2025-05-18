import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './Home';
import Register from './Register';
import Login from './components/Login';
import Forum from './components/Forum';
import Profile from './components/Profile';
import Admin from './Admin';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';


function App() {
  return (
    <Router>
      <div className="container">
        <h1>Organiz'asso</h1>

        <NavBar />

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
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute><Admin /></ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
