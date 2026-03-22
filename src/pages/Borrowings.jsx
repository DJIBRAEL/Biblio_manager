import { useState } from 'react';
import { Routes, Route, useNavigate, useParams, Navigate } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import { Repeat, Plus, Search, CheckCircle, Clock, AlertTriangle, History, Trash2, PlusCircle, LayoutList } from 'lucide-react';
import './Borrowings.css';

const BorrowList = ({ borrowings, copies, books, users, type, onAction, onDelete }) => {
  const navigate = useNavigate();
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
            </tr>
          </thead>
          <tbody>
            {data.map(b => (
              <tr 
                key={b.id} 
                className={`${b.isLate ? 'row-late' : ''} row-clickable`}
                onClick={() => navigate(`/borrowings/detail/${b.id}`)}
                style={{ cursor: 'pointer' }}
              >
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
              </tr>
            ))}
            {data.length === 0 && (
              <tr><td colSpan="5" className="text-center py-4 text-muted">Aucune donnée trouvée</td></tr>
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
    <div className="form-card-premium">
      <div className="form-header-premium">
        <div className="icon-box">
          <PlusCircle size={28} />
        </div>
        <div className="header-content">
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
            Nouvel Emprunt
          </h2>
          <p style={{ margin: '4px 0 0', color: 'var(--text-muted)' }}>Enregistrez un emprunt pour un lecteur.</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="form-body-premium">
        <div className="form-group-wrapper">
          <span className="group-tag-premium">Détails de l'emprunt</span>
          
          <div className="input-row mt-4" style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
            <div className="input-group flex-grow" style={{ flex: 1 }}>
              <label className="form-label">Lecteur</label>
              <select className="input-field-premium" value={formData.userId} onChange={e => setFormData({...formData, userId: e.target.value})} required>
                <option value="">Sélectionner un lecteur...</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.type})</option>
                ))}
              </select>
            </div>
            
            <div className="input-group flex-grow" style={{ flex: 1 }}>
              <label className="form-label">Exemplaire disponible</label>
              <select className="input-field-premium" value={formData.copyId} onChange={e => setFormData({...formData, copyId: e.target.value})} required>
                <option value="">Sélectionner un exemplaire...</option>
                {copies.filter(c => c.status === 'Disponible').map(c => {
                  const book = books.find(bk => bk.id === c.bookId);
                  return <option key={c.id} value={c.id}>{c.code} - {book?.title}</option>;
                })}
              </select>
            </div>
          </div>

          <div className="input-row" style={{ display: 'flex', gap: '24px' }}>
            <div className="input-group flex-grow" style={{ flex: 1 }}>
              <label className="form-label">Date d'emprunt</label>
              <input type="date" className="input-field-premium" value={formData.borrowDate} onChange={e => setFormData({...formData, borrowDate: e.target.value})} required />
            </div>
            <div className="input-group flex-grow" style={{ flex: 1 }}>
              <label className="form-label">Date de retour prévue</label>
              <input type="date" className="input-field-premium" value={formData.expectedReturnDate} onChange={e => setFormData({...formData, expectedReturnDate: e.target.value})} required />
            </div>
          </div>
        </div>
        
        <div className="form-footer-premium" style={{ marginTop: '40px', padding: '0', background: 'transparent', borderTop: 'none' }}>
          <button type="button" className="btn btn-ghost" onClick={onCancel} style={{ fontSize: '15px' }}>Annuler</button>
          <button type="submit" className="btn btn-primary" style={{ padding: '12px 32px', fontSize: '15px' }}>
            <Repeat size={18} /> Valider l'emprunt
          </button>
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
        <Route path="detail/:id" element={<BorrowDetailLoader borrowings={borrowings} books={books} users={users} copies={copies} onReturn={returnBook} onDelete={deleteBorrowing} />} />
        <Route path="*" element={<Navigate to="return" replace />} />
      </Routes>
    </div>
  );
};

const BorrowDetail = ({ borrowing, book, user, copy, onReturn, onDelete, onBack }) => {
  if (!borrowing) return null;
  const isLate = !borrowing.returnDate && new Date() > new Date(borrowing.expectedReturnDate);

  return (
    <div className="borrow-detail-container">
      <div className="header-with-icon" style={{ marginBottom: '24px' }}>
        <button className="icon-btn" onClick={onBack} title="Retour" style={{ marginRight: '15px' }}>
             <LayoutList size={20} style={{ transform: 'rotate(180deg)' }} />
        </button>
        <div className="icon-box">
          <Clock size={24} />
        </div>
        <div className="header-content">
          <h1>Détails de l'emprunt</h1>
          <p>Informations complètes sur la transaction.</p>
        </div>
      </div>

      <div className="grid grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Ouvrage & Exemplaire</h3>
          <div className="detail-row" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px' }}>Titre</label>
              <strong style={{ fontSize: '1.1rem' }}>{book?.title || 'Chargement...'}</strong>
          </div>
          <div className="detail-row" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px' }}>ISBN</label>
              <code>{book?.isbn}</code>
          </div>
          <div className="detail-row" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px' }}>Code Exemplaire</label>
              <span className="badge badge-primary">{copy?.code}</span>
          </div>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Lecteur</h3>
          <div className="detail-row" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px' }}>Nom complet</label>
              <strong style={{ fontSize: '1.1rem' }}>{user?.name || 'Chargement...'}</strong>
          </div>
          <div className="detail-row" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px' }}>Email</label>
              <span>{user?.email}</span>
          </div>
          <div className="detail-row" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px' }}>Téléphone</label>
              <span>{user?.phone}</span>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '24px', marginTop: '24px' }}>
        <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Statut de la transaction</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px' }}>Date d'emprunt</label>
            <strong>{new Date(borrowing.borrowDate).toLocaleDateString()}</strong>
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px' }}>Retour prévu</label>
            <strong style={{ color: isLate ? 'var(--danger)' : 'inherit' }}>
              {new Date(borrowing.expectedReturnDate).toLocaleDateString()}
            </strong>
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px' }}>Statut actuel</label>
            {borrowing.returnDate ? (
              <span className="badge badge-success">Retourné le {new Date(borrowing.returnDate).toLocaleDateString()}</span>
            ) : (
              isLate ? <span className="badge badge-danger">En retard</span> : <span className="badge badge-warning">En cours</span>
            )}
          </div>
        </div>

        <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'flex-end', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          {!borrowing.returnDate ? (
            <button className="btn btn-primary" onClick={() => onReturn(borrowing.id)}>
              <CheckCircle size={18} /> Marquer comme retourné
            </button>
          ) : (
            <button className="btn btn-danger" onClick={() => onDelete(borrowing.id)}>
              <Trash2 size={18} /> Supprimer de l'historique
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const BorrowDetailLoader = ({ borrowings, books, users, copies, onReturn, onDelete }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const borrowing = borrowings.find(b => b.id === id);
    
    if (!borrowing) return <Navigate to="/borrowings/return" />;
    
    const copy = copies.find(c => c.id === borrowing.copyId);
    const book = copy ? books.find(bk => bk.id === copy.bookId) : null;
    const user = users.find(u => u.id === borrowing.userId);

    return (
        <BorrowDetail 
            borrowing={borrowing} 
            book={book} 
            user={user} 
            copy={copy}
            onReturn={(id) => { onReturn(id); navigate('/borrowings/history'); }}
            onDelete={(id) => { onDelete(id); navigate('/borrowings/history'); }}
            onBack={() => navigate(-1)}
        />
    );
};

export default Borrowings;
