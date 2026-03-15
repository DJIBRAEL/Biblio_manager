import { useState } from 'react';
import { Routes, Route, useNavigate, useParams, Navigate } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import { ClipboardList, Plus, Edit, Trash2, Search, Save, PlusCircle, LayoutList } from 'lucide-react';
import './Exemplaires.css';

const CopyList = ({ copies, books, searchTerm, setSearchTerm, onEdit, onDelete }) => {
  const filteredCopies = copies.filter(copy => {
    const book = books.find(b => b.id === copy.bookId);
    const searchStr = `${copy.code} ${book?.title} ${copy.localization}`.toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="exemplaires-container">
      <div className="header-with-icon">
        <div className="icon-box">
          <LayoutList size={24} />
        </div>
        <div className="header-content">
          <h1>Gestion des Exemplaires</h1>
          <p>Lister et gérer les copies physiques des livres.</p>
        </div>
      </div>
      <div className="card">
        <div className="toolbar">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher par code, livre ou rayon..."
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
                <th>Code</th>
                <th>Livre</th>
                <th>Année</th>
                <th>État</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCopies.map(copy => {
                const book = books.find(b => b.id === copy.bookId);
                return (
                  <tr key={copy.id}>
                    <td><strong>{copy.code}</strong></td>
                    <td>{book?.title || 'Livre supprimé'}</td>
                    <td>{copy.acquisitionYear || '-'}</td>
                    <td>{copy.etat}</td>
                    <td>
                      <span className={`badge ${copy.status === 'Disponible' ? 'badge-success' :
                          copy.status === 'Emprunté' ? 'badge-warning' : 'badge-danger'
                        }`}>
                        {copy.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="icon-btn edit-btn" onClick={() => onEdit(copy.id)} title="Modifier">
                          <Edit size={16} />
                        </button>
                        <button className="icon-btn delete-btn" onClick={() => onDelete(copy.id)} title="Supprimer">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const CopyForm = ({ mode, books, initialData = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState(initialData || {
    bookId: books[0]?.id || '',
    code: '',
    etat: 'Neuf',
    status: 'Disponible',
    acquisitionYear: new Date().getFullYear(),
    quantity: 1
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="card form-card">
      <div className="header-with-icon" style={{ padding: '12px 20px', borderBottom: '1px solid #f1f5f9' }}>
        <div className="icon-box" style={{ background: mode === 'add' ? 'var(--success)' : 'var(--primary)' }}>
          {mode === 'add' ? <PlusCircle size={24} /> : <Edit size={24} />}
        </div>
        <div className="header-content">
          <h2>{mode === 'add' ? 'Ajouter un exemplaire' : 'Modifier l\'exemplaire'}</h2>
          <p>{mode === 'add' ? 'Enregistrez une nouvelle copie dans le système.' : 'Mettez à jour l\'état ou la localisation.'}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="form-grid">
          <div className="input-group full-width">
            <label>Livre associé</label>
            <select className="input-field" value={formData.bookId} onChange={e => setFormData({ ...formData, bookId: e.target.value })} required>
              <option value="">Sélectionner un livre...</option>
              {books.map(b => (
                <option key={b.id} value={b.id}>{b.title} (ISBN: {b.isbn})</option>
              ))}
            </select>
          </div>
          <div className="form-row full-width">
            <div className="input-group">
              <label>Code Exemplaire</label>
              <input type="text" className="input-field" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} placeholder="Ex: INV-001" required />
            </div>
          </div>
          <div className="form-row full-width">
            <div className="input-group">
              <label>État</label>
              <select className="input-field" value={formData.etat} onChange={e => setFormData({ ...formData, etat: e.target.value })}>
                <option value="Neuf">Neuf</option>
                <option value="Bon">Bon</option>
                <option value="Passable">Passable</option>
                <option value="Abîmé">Abîmé</option>
              </select>
            </div>
            <div className="input-group">
              <label>Statut</label>
              <select className="input-field" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                <option value="Disponible">Disponible</option>
                <option value="Emprunté">Emprunté</option>
                <option value="Maintenance">En maintenance</option>
                <option value="Perdu">Perdu</option>
              </select>
            </div>
          </div>
          <div className="form-row full-width">
            <div className="input-group">
              <label>Année d'acquisition</label>
              <input type="number" className="input-field" value={formData.acquisitionYear} onChange={e => setFormData({ ...formData, acquisitionYear: e.target.value })} />
            </div>
            {mode === 'add' && (
              <div className="input-group">
                <label>Nombre d'exemplaires</label>
                <input 
                  type="number" 
                  className="input-field" 
                  min="1" 
                  max="50" 
                  value={formData.quantity} 
                  onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })} 
                  required 
                />
              </div>
            )}
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>Annuler</button>
          <button type="submit" className="btn btn-primary"><Save size={18} /> Enregistrer l'exemplaire</button>
        </div>
      </form>
    </div>
  );
};

const DeleteConfirm = ({ id, copies, onDelete, onCancel }) => {
  const copy = copies.find(c => c.id === id);
  if (!copy) return <Navigate to="/exemplaires/list" />;

  return (
    <div className="card delete-card">
      <div className="card-header danger-header">
        <Trash2 size={20} className="text-danger" />
        <h2>Suppression critique</h2>
      </div>
      <div className="p-4">
        <p className="my-4 text-center">Supprimer l'exemplaire <strong>{copy.code}</strong> ?</p>
        <div className="form-actions justify-center">
          <button className="btn btn-secondary" onClick={onCancel}>Annuler</button>
          <button className="btn btn-danger" onClick={() => onDelete(id)}>Confirmer la suppression</button>
        </div>
      </div>
    </div>
  );
};

const Exemplaires = () => {
  const { copies, books, addCopy, updateCopy, deleteCopy } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  return (
    <div className="exemplaires-page">
      <Routes>
        <Route path="list" element={
          <CopyList
            copies={copies}
            books={books}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onEdit={(id) => navigate(`/exemplaires/edit/${id}`)}
            onDelete={(id) => navigate(`/exemplaires/delete/${id}`)}
          />
        } />
        <Route path="add" element={
          <CopyForm
            mode="add"
            books={books}
            onSave={(data) => {
              const qty = data.quantity || 1;
              for (let i = 0; i < qty; i++) {
                const copyData = { ...data };
                delete copyData.quantity;
                // Add suffix to code if quantity > 1
                if (qty > 1) {
                  copyData.code = `${data.code}-${i + 1}`;
                }
                addCopy(copyData);
              }
              navigate('/exemplaires/list');
            }}
            onCancel={() => navigate('/exemplaires/list')}
          />
        } />
        <Route path="edit/:id" element={<EditLoader copies={copies} books={books} onUpdate={updateCopy} onCancel={() => navigate('/exemplaires/list')} />} />
        <Route path="delete/:id" element={<DeleteLoader copies={copies} onDelete={deleteCopy} onCancel={() => navigate('/exemplaires/list')} />} />
        <Route path="*" element={<Navigate to="list" replace />} />
      </Routes>
    </div>
  );
};

const EditLoader = ({ copies, books, onUpdate, onCancel }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const copy = copies.find(c => c.id === id);

  if (!copy) return <Navigate to="/exemplaires/list" />;

  return (
    <CopyForm
      mode="edit"
      books={books}
      initialData={copy}
      onSave={(data) => { onUpdate(id, data); navigate('/exemplaires/list'); }}
      onCancel={onCancel}
    />
  );
};

const DeleteLoader = ({ copies, onDelete, onCancel }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <DeleteConfirm
      id={id}
      copies={copies}
      onDelete={(id) => { onDelete(id); navigate('/exemplaires/list'); }}
      onCancel={onCancel}
    />
  );
};

export default Exemplaires;
