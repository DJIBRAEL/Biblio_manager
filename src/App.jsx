import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Exemplaires from './pages/Exemplaires';
import Users from './pages/Users';
import Borrowings from './pages/Borrowings';
import Reservations from './pages/Reservations';
import Login from './pages/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="books/*" element={<Books />} />
        <Route path="exemplaires/*" element={<Exemplaires />} />
        <Route path="users/*" element={<Users />} />
        <Route path="borrowings/*" element={<Borrowings />} />
        <Route path="reservations/*" element={<Reservations />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
