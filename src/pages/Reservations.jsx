import { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import { Bookmark, Search, Trash2, CheckCircle, XCircle, ChevronRight, User as UserIcon, BookOpen, Calendar, LayoutList } from 'lucide-react';
import './Reservations.css';

const ReservationList = ({ reservations, users, books, searchTerm, setSearchTerm, onUpdateStatus, onDelete }) => {
  const filteredReservations = reservations.map(r => {
    const user = users.find(u => u.id === r.userId) || { name: 'Utilisateur inconnu' };
    const book = books.find(b => b.id === r.bookId) || { title: 'Livre inconnu' };
    return { ...r, userName: user.name, bookTitle: book.title };
  }).filter(r => 
    r.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    attente: reservations.filter(r => r.status === 'En attente').length,
    confirmees: reservations.filter(r => r.status === 'Confirmée').length,
    annulees: reservations.filter(r => r.status === 'Annulée').length
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'En attente': return 'badge-warning';
      case 'Confirmée': return 'badge-success';
      case 'Annulée': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  return (
    <div className="reservation-overview">
      <div className="header-with-icon">
        <div className="icon-box">
          <LayoutList size={24} />
        </div>
        <div className="header-content">
          <h1>Liste des Réservations</h1>
          <p>Suivez et modifiez les demandes de réservation des membres.</p>
        </div>
      </div>
      
      <div className="stats-header-grid mb-6">
        <div className="card stat-mini-card">
          <div className="stat-icon-mini bg-orange-light"><LayoutList size={20} /></div>
          <div className="stat-content-mini">
            <span className="stat-label">En attente</span>
            <span className="stat-value">{stats.attente}</span>
          </div>
        </div>
        <div className="card stat-mini-card">
          <div className="stat-icon-mini bg-green-light"><CheckCircle size={20} /></div>
          <div className="stat-content-mini">
            <span className="stat-label">Confirmées</span>
            <span className="stat-value">{stats.confirmees}</span>
          </div>
        </div>
        <div className="card stat-mini-card">
          <div className="stat-icon-mini bg-red-light"><XCircle size={20} /></div>
          <div className="stat-content-mini">
            <span className="stat-label">Annulées</span>
            <span className="stat-value">{stats.annulees}</span>
          </div>
        </div>
      </div>

      <div className="card reservation-list-card">
        <div className="toolbar" style={{ marginTop: '20px' }}>
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher par nom, livre ou statut..."
              className="input-field search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="table-container">
          <table style={{ minWidth: "900px" }}>
            <thead>
              <tr>
                <th>Livre</th>
                <th>Utilisateur</th>
                <th>Date Prévue</th>
                <th style={{ textAlign: 'center' }}>Statut</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.length > 0 ? filteredReservations.map(res => (
                <tr key={res.id}>
                  <td className="font-medium text-primary">{res.bookTitle}</td>
                  <td>{res.userName}</td>
                  <td>{new Date(res.reservationDate).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge ${getStatusBadge(res.status)}`}>{res.status}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="action-buttons" style={{ justifyContent: 'center' }}>
                      {res.status === 'En attente' && (
                        <>
                          <button className="icon-btn" style={{ color: "var(--success)" }} onClick={() => onUpdateStatus(res.id, 'Confirmée')} title="Confirmer">
                            <CheckCircle size={16} />
                          </button>
                          <button className="icon-btn" style={{ color: "var(--danger)" }} onClick={() => onUpdateStatus(res.id, 'Annulée')} title="Annuler">
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                      <button className="icon-btn delete-btn" onClick={() => onDelete(res.id)} title="Supprimer">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">Aucune réservation trouvée.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ReservationForm = ({ users, books, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    userId: '',
    bookId: '',
    reservationDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="form-card-premium">
      <div className="form-header-premium">
        <div className="icon-box">
          <Bookmark size={28} />
        </div>
        <div className="header-content">
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>Créer une réservation</h2>
          <p style={{ margin: '4px 0 0', color: 'var(--text-muted)' }}>Associez un utilisateur à un ouvrage.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-body-premium">
        <div className="form-group-wrapper">
          <span className="group-tag-premium">Détails de la réservation</span>
          
          <div className="input-row mt-4" style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
            <div className="input-group flex-grow" style={{ flex: 1 }}>
              <label className="form-label">Utilisateur <UserIcon size={14} style={{ display: 'inline', marginLeft: 4, verticalAlign: 'middle' }} /></label>
              <select 
                className="input-field-premium" 
                value={formData.userId} 
                onChange={e => setFormData({ ...formData, userId: e.target.value })} 
                required
              >
                <option value="">-- Sélectionner un utilisateur --</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.matricule || u.type})</option>
                ))}
              </select>
            </div>
            
            <div className="input-group flex-grow" style={{ flex: 1 }}>
              <label className="form-label">Livre <BookOpen size={14} style={{ display: 'inline', marginLeft: 4, verticalAlign: 'middle' }} /></label>
              <select 
                className="input-field-premium" 
                value={formData.bookId} 
                onChange={e => setFormData({ ...formData, bookId: e.target.value })} 
                required
              >
                <option value="">-- Sélectionner un livre --</option>
                {books.map(b => (
                  <option key={b.id} value={b.id}>{b.title} - {b.author}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-row mt-4" style={{ display: 'flex', gap: '24px' }}>
            <div className="input-group flex-1">
              <label className="form-label">Date de récupération prévue <Calendar size={14} style={{ display: 'inline', marginLeft: 4, verticalAlign: 'middle' }} /></label>
              <input 
                type="date" 
                className="input-field-premium" 
                value={formData.reservationDate} 
                onChange={e => setFormData({ ...formData, reservationDate: e.target.value })} 
                required 
              />
            </div>
            <div className="input-group flex-1" style={{ flex: 1 }}></div>
          </div>
        </div>

        <div className="form-footer-premium" style={{ marginTop: '40px', padding: '0', background: 'transparent', borderTop: 'none' }}>
          <button type="button" className="btn-cancel-simple" onClick={onCancel} style={{ fontSize: '15px' }}>Annuler</button>
          <button type="submit" className="btn-submit-simple" style={{ padding: '12px 32px', fontSize: '15px' }}>
            <span>Enregistrer la réservation</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

const Reservations = () => {
  const { reservations, addReservation, updateReservation, deleteReservation, users, books } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  return (
    <div className="reservations-page">
      <Routes>
        <Route path="list" element={
          <ReservationList
            reservations={reservations}
            users={users}
            books={books}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onUpdateStatus={updateReservation}
            onDelete={deleteReservation}
          />
        } />
        <Route path="add" element={
          <ReservationForm
            users={users}
            books={books}
            onSave={(data) => { addReservation(data); navigate('/reservations/list'); }}
            onCancel={() => navigate('/reservations/list')}
          />
        } />
        <Route path="*" element={<Navigate to="list" replace />} />
      </Routes>
    </div>
  );
};

export default Reservations;
