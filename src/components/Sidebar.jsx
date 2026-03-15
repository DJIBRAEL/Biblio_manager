import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Book, Users, Repeat, ClipboardList, ChevronDown, ChevronRight, LogOut, X, Bookmark } from 'lucide-react';
import logoDit from '../assets/logo-dit.png';
import './Sidebar.css';

const SidebarItem = ({ item, currentPath }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const isActive = currentPath === item.path || (hasSubItems && item.subItems.some(sub => currentPath === sub.path));

  if (!hasSubItems) {
    return (
      <li>
        <Link
          to={item.path}
          className={`sidebar-link ${isActive ? 'active' : ''}`}
        >
          <div className="link-content">
            {item.icon}
            <span>{item.label}</span>
          </div>
        </Link>
      </li>
    );
  }

  return (
    <li className={`sidebar-dropdown ${isOpen ? 'open' : ''}`}>
      <button
        className={`sidebar-link dropdown-toggle ${isActive ? 'active-parent' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="link-content">
          {item.icon}
          <span>{item.label}</span>
        </div>
        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      {isOpen && (
        <ul className="sub-menu">
          {item.subItems.map((sub) => (
            <li key={sub.path}>
              <Link
                to={sub.path}
                className={`sub-link ${currentPath === sub.path ? 'sub-active' : ''}`}
              >
                {sub.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

import { useLibrary } from '../context/LibraryContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { users } = useLibrary();
  const defaultProfileId = users.length > 0 ? users[0].id : '1';

  const menuItems = [
    { path: '/', icon: <LayoutDashboard size={25} />, 
    label: 'Tableau de bord' },
    {
      path: '/books',
      icon: <Book size={25} />,
      label: 'Gestion Livres',
      subItems: [
        { path: '/books/add', label: 'Ajouter livre' },
        { path: '/books/list', label: 'Lister livres' },
        { path: '/books/search', label: 'Rechercher' },
      ]
    },
    {
      path: '/exemplaires',
      icon: <ClipboardList size={25} />,
      label: 'Gestion Exemplaires',
      subItems: [
        { path: '/exemplaires/add', label: 'Ajouter exemplaire' },
        { path: '/exemplaires/list', label: 'Liste d\'exemplaires' },
      ]
    },
    {
      path: '/borrowings',
      icon: <Repeat size={25} />,
      label: 'Gestion Emprunts',
      subItems: [
        { path: '/borrowings/new', label: 'Emprunter livre' },
        { path: '/borrowings/return', label: 'Liste emprunts' },
        { path: '/borrowings/history', label: 'Historique emprunts' },
        { path: '/borrowings/late', label: 'Gestion retards' },
      ]
    },
{
      path: '/reservations',
      icon: <Bookmark size={25} />,
      label: 'Gestion Réservations',
      subItems: [
        { path: '/reservations/add', label: 'Nouvelle réservation' },
        { path: '/reservations/list', label: 'Liste réservations' },
      ]
    },

    {
      path: '/users',
      icon: <Users size={25} />,
      label: 'Gestion Utilisateurs',
      subItems: [
        { path: '/users/add', label: 'Création utilisateur' },
        { path: '/users/list', label: 'Liste utilisateurs' },
        { path: '/users/types', label: 'Type d\'utilisateur' },
        { path: `/users/profile/${defaultProfileId}`, label: 'Profil d\'utilisateur' },
      ]
    },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="sidebar-close" onClick={toggleSidebar}>
        <X size={24} />
      </button>
      <div className="sidebar-logo">
        <div className="logo-wrapper">
          <Book size={28} className="logo-icon" />
          <img src={logoDit} alt="DIT Logo" className="dit-logo" />
        </div>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <SidebarItem key={item.label} item={item} currentPath={location.pathname} />
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-link" onClick={() => window.location.reload()}>
          <div className="link-content">
            <LogOut size={20} />
            <span>Déconnexion</span>
          </div>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
