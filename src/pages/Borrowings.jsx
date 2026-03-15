import { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import { Repeat, Plus, Search, CheckCircle, Clock, AlertTriangle, History, Trash2, PlusCircle, LayoutList } from 'lucide-react';
import './Borrowings.css';

const BorrowList = ({ borrowings, copies, books, users, type, onAction, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const getBorrowingData = (b) => {
    const copy = copies.find(c => c.id === b.copyId);
    const book = copy ? books.find(bk => bk.id === copy.bookId) : null;
    const user = users.find(u => u.id === b.userId);
    const isLate = !b.returnDate && new Date() > new Date(b.expectedReturnDate);
    return { ...b, copy, book, user, isLate };
  };

  const enriched = borrowings.map(getBorrowingData);
  let data = type === 'history' ? enriched.filter(b => b.returnDate) : 
             type === 'late' ? enriched.filter(b => b.isLate) : enriched.filter(b => !b.returnDate);

  if (searchTerm) {
    const lowerSearch = searchTerm.toLowerCase();
    data = data.filter(b => 
      b.book?.title.toLowerCase().includes(lowerSearch) ||
      b.user?.name.toLowerCase().includes(lowerSearch) ||
      b.copy?.code.toLowerCase().includes(lowerSearch)
    );
  }

  return (
    <div className="card">
      <div className="header-with-icon" style={{ padding: '12px 20px', borderBottom: '1px solid #f1f5f9' }}>
        <div className="icon-box" style={{ 
          background: type === 'late' ? 'var(--danger)' : 'var(--primary)'
        }}>
          {type === 'active' ? <LayoutList size={22} /> : 
           type === 'history' ? <History size={22} /> : 
           <AlertTriangle size={22} />}
        </div>
        <div className="header-content">
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
            {type === 'active' ? 'Lister des emprunts en cours' : 
             type === 'history' ? 'Historique des emprunts' : 
             'Gestion des retards'}
          </h2>
        </div>
      </div>
      <div className="toolbar">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Rechercher un emprunt..." 
            className="input-field search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Livre / Code</th>
              <th>Lecteur</th>
              <th>Date Emprunt</th>
              <th>Date Retour</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map(b => (
              <tr key={b.id} className={b.isLate ? 'row-late' : ''}>
                <td>
                  <div><strong>{b.book?.title}</strong></div>
                  <div className="text-muted text-xs">{b.copy?.code}</div>
                </td>
                <td>{b.user?.name}</td>
                <td>{new Date(b.borrowDate).toLocaleDateString()}</td>
                <td>{new Date(b.returnDate || b.expectedReturnDate).toLocaleDateString()}</td>
                <td>
                  {b.returnDate ? <span className="badge badge-success">Retourné</span> : 
                   b.isLate ? <span className="badge badge-danger">Retard</span> : 
                   <span className="badge badge-warning">En cours</span>}
                </td>
                <td>
                  {type !== 'history' ? (
                    <button className="btn btn-secondary btn-sm" onClick={() => onAction(b.id)}>
                      <CheckCircle size={14} /> Retourner
                    </button>
                  ) : (
                    <button className="icon-btn delete-btn" onClick={() => onDelete(b.id)} title="Supprimer de l'historique">
                      <Trash2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr><td colSpan="6" className="text-center py-4 text-muted">Aucune donnée trouvée</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const NewBorrowForm = ({ users, copies, books, onBorrow, onCancel }) => {
  const [formData, setFormData] = useState({
    userId: users[0]?.id || '',
    copyId: copies.filter(c => c.status === 'Disponible')[0]?.id || '',
    borrowDate: new Date().toISOString().split('T')[0],
    expectedReturnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onBorrow(formData);
  };

  return (
    <div className="card form-card">
      <div className="header-with-icon" style={{ padding: '12px 20px', borderBottom: '1px solid #f1f5f9' }}>
        <div className="icon-box" style={{ background: 'var(--success)' }}>
          <PlusCircle size={22} />
        </div>
        <div className="header-content">
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
            Enregistrer un nouvel emprunt
          </h2>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="form-grid">
          <div className="input-group full-width">
            <label>Lecteur</label>
            <select className="input-field" value={formData.userId} onChange={e => setFormData({...formData, userId: e.target.value})} required>
              <option value="">Sélectionner un lecteur...</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.type})</option>
              ))}
            </select>
          </div>
          <div className="input-group full-width">
            <label>Exemplaire disponible</label>
            <select className="input-field" value={formData.copyId} onChange={e => setFormData({...formData, copyId: e.target.value})} required>
              <option value="">Sélectionner un exemplaire...</option>
              {copies.filter(c => c.status === 'Disponible').map(c => {
                const book = books.find(bk => bk.id === c.bookId);
                return <option key={c.id} value={c.id}>{c.code} - {book?.title}</option>;
              })}
            </select>
          </div>
          <div className="form-row full-width">
            <div className="input-group">
              <label>Date d'emprunt</label>
              <input type="date" className="input-field" value={formData.borrowDate} onChange={e => setFormData({...formData, borrowDate: e.target.value})} required />
            </div>
            <div className="input-group">
              <label>Date de retour prévue</label>
              <input type="date" className="input-field" value={formData.expectedReturnDate} onChange={e => setFormData({...formData, expectedReturnDate: e.target.value})} required />
            </div>
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>Annuler</button>
          <button type="submit" className="btn btn-primary"><Repeat size={18} /> Valider l'emprunt</button>
        </div>
      </form>
    </div>
  );
};

const Borrowings = () => {
  const { borrowings, copies, books, users, borrowBook, returnBook, deleteBorrowing } = useLibrary();
  const navigate = useNavigate();

  return (
    <div className="borrowings-page">
      <Routes>
        <Route path="new" element={
          <NewBorrowForm 
            users={users} copies={copies} books={books}
            onBorrow={(data) => { borrowBook(data); navigate('/borrowings/return'); }}
            onCancel={() => navigate('/borrowings/return')}
          />
        } />
        <Route path="return" element={
          <BorrowList borrowings={borrowings} copies={copies} books={books} users={users} type="active" onAction={returnBook} />
        } />
        <Route path="history" element={
          <BorrowList borrowings={borrowings} copies={copies} books={books} users={users} type="history" onDelete={deleteBorrowing} />
        } />
        <Route path="late" element={
          <BorrowList borrowings={borrowings} copies={copies} books={books} users={users} type="late" onAction={returnBook} />
        } />
        <Route path="*" element={<Navigate to="return" replace />} />
      </Routes>
    </div>
  );
};

export default Borrowings;
