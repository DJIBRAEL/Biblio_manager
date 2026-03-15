import { useLocation } from 'react-router-dom';
import { UserCircle, Menu } from 'lucide-react';
import './Header.css';

const Header = ({ toggleSidebar }) => {
  const location = useLocation();
  
  const getHeaderTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/books')) return 'Gestion Livres';
    if (path.startsWith('/exemplaires')) return 'Gestion Exemplaires';
    if (path.startsWith('/users')) return 'Gestion Utilisateurs';
    if (path.startsWith('/borrowings')) return 'Gestion Emprunts';
    if (path.startsWith('/reservations')) return 'Gestion Réservations';
    return 'Tableau de bord';
  };

  return (
    <header className="header">
      <div className="top-header-content">
        <div className="header-left">
          <button className="menu-toggle" onClick={toggleSidebar}>
            <Menu size={24} color="white" />
          </button>
          <h1>{getHeaderTitle()}</h1>
        </div>
        <div className="header-right">
          <div className="user-profile">
            <span className="user-name" style={{color: 'var(--text-inverse-muted)'}}>Administrateur</span>
            <UserCircle size={28} className="user-avatar" style={{color: 'var(--text-inverse-muted)'}} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
