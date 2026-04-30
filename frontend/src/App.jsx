import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-brand">Task Manager</div>
        {user && (
          <div className="navbar-menu">
            <span>Welcome, {user.name} ({user.role})</span>
          </div>
        )}
      </nav>
      
      <main className="main-content">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          
          <Route 
            path="/" 
            element={user ? <Dashboard /> : <Navigate to="/login" />} 
          />
          
          <Route 
            path="/admin" 
            element={user?.role === 'ADMIN' ? <AdminPanel /> : <Navigate to="/" />} 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
