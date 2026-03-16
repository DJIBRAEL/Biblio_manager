import { useState, useMemo } from 'react';
import { Routes, Route, useNavigate, useParams, Navigate } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import { Book as BookIcon, Edit, Trash2, Search, Save, PlusCircle, LayoutList, Filter, Clock, Star, ArrowLeft, Hash, User, Building2, Calendar, Tag, Package, CheckCircle, XCircle } from 'lucide-react';
import './Books.css';

const BookList = ({ books, copies, searchTerm, setSearchTerm, onEdit, onDelete, onView }) => {
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.includes(searchTerm)
  );

  const getStock = (bookId) => {
    const bookCopies = copies.filter(c => c.bookId === bookId);
    const available = bookCopies.filter(c => c.status === 'Disponible').length;
    return { total: bookCopies.length, available };
  };

  return (
    <div className="book-list-container">
      <div className="header-with-icon">
        <div className="icon-box">
          <LayoutList size={24} />
        </div>
        <div className="header-content">
          <h1>Catalogue des Livres</h1>
          <p>Consultez et gérez la collection d'ouvrages.</p>
        </div>
      </div>
      <div className="card">
        <div className="toolbar">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher dans la liste..."
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
                <th>ISBN</th>
                <th>Titre</th>
                <th>Auteur</th>
                <th>Éditeur</th>
                <th>Année</th>
                <th>Catégorie</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map(book => {
                const stock = getStock(book.id);
                return (
                  <tr 
                    key={book.id} 
                    className="book-row-clickable"
                    onClick={() => onView(book.id)}
                  >
                    <td><code className="isbn-tag">{book.isbn}</code></td>
                    <td><strong>{book.title}</strong></td>
                    <td>{book.author}</td>
                    <td>{book.publisher || '-'}</td>
                    <td>{book.year || '-'}</td>
                    <td><span className="badge badge-primary">{book.category}</span></td>
                    <td>
                      <div className="stock-cell">
                        <span className={`stock-indicator ${stock.available > 0 ? 'bg-success' : 'bg-danger'}`}></span>
                        <strong>{stock.available}</strong> / {stock.total} disp.
                      </div>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="action-buttons">
                        <button className="icon-btn edit-btn" onClick={(e) => { e.stopPropagation(); onEdit(book.id); }} title="Modifier">
                          <Edit size={16} />
                        </button>
                        <button className="icon-btn delete-btn" onClick={(e) => { e.stopPropagation(); onDelete(book.id); }} title="Supprimer">
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

const BookGallery = ({ books, copies, searchTerm, setSearchTerm, onEdit }) => {
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  
  const categories = useMemo(() => ['Tous', ...new Set(books.map(b => b.category))], [books]);

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="gallery-container">
      <div className="gallery-header-section glass">
        <div className="search-header-main">
          <div className="icon-badge">
            <Search size={24} color="white" />
          </div>
          <div className="header-info">
            <h1>Recherche Catalogue</h1>
            <p>Explorez notre collection de {books.length} ouvrages</p>
          </div>
        </div>
        
        <div className="search-controls">
          <div className="premium-search-bar">
            <Search size={20} className="search-pulse" />
            <input
              type="text"
              placeholder="Rechercher un titre, un auteur..."
              className="search-input-fancy"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-chips">
            {categories.map(cat => (
              <button 
                key={cat} 
                className={`chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'Tous' && <Filter size={14} />}
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="book-grid">
        {filteredBooks.map(book => {
          const bookCopies = copies.filter(c => c.bookId === book.id);
          const available = bookCopies.filter(c => c.status === 'Disponible').length;
          const hue = (parseInt(book.id) * 137.5) % 360; // Better deterministic color distribution

          return (
            <div key={book.id} className="modern-book-card">
              <div className="card-top">
                <div className="book-cover-art" style={{ background: `linear-gradient(135deg, hsl(${hue}, 60%, 45%), hsl(${hue}, 60%, 25%))` }}>
                  <div className="pattern-overlay"></div>
                  <BookIcon size={48} color="white" strokeWidth={1.5} />
                  <div className="luxury-overlay">
                    <button className="action-pill" onClick={() => onEdit(book.id)}>
                      <Edit size={14} /> <span>Modifier</span>
                    </button>
                    <div className="book-badge">{book.year}</div>
                  </div>
                </div>
                <div className="stock-ribbon" data-available={available > 0}>
                   {available > 0 ? <Star size={12} fill="white" /> : <Clock size={12} />}
                   {available > 0 ? 'Disponible' : 'Indisponible'}
                </div>
              </div>
              
              <div className="card-bottom">
                <div className="card-metadata">
                  <span className="modern-category">{book.category}</span>
                </div>
                <h3>{book.title}</h3>
                <p className="modern-author">{book.author}</p>
                
                <div className="card-footer-stats">
                  <div className="stock-count">
                    <strong>{available}</strong> <span>/ {bookCopies.length} en stock</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filteredBooks.length === 0 && (
          <div className="no-results glass col-span-full">
            <Search size={48} opacity={0.2} />
            <p>Aucun livre ne correspond à votre recherche</p>
            <button className="text-link" onClick={() => {setSearchTerm(''); setSelectedCategory('Tous');}}>Réinitialiser les filtres</button>
          </div>
        )}
      </div>
    </div>
  );
};

const BookForm = ({ mode, initialData = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState(initialData || {
    isbn: '', title: '', author: '', publisher: '', year: '', category: '', words: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="form-card-premium">
      <div className="form-header-premium">
        <div className="icon-box" style={{ background: mode === 'add' ? 'var(--primary)' : 'var(--primary-light)' }}>
          {mode === 'add' ? <PlusCircle size={28} /> : <Edit size={28} />}
        </div>
        <div className="header-content">
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
            {mode === 'add' ? 'Nouveau Livre' : 'Modifier Livre'}
          </h2>
          <p style={{ margin: '4px 0 0', color: 'var(--text-muted)' }}>
            {mode === 'add' ? 'Ajouter un nouvel ouvrage au catalogue.' : 'Mettre à jour les informations du livre.'}
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="form-body-premium">
        <div className="form-group-wrapper">
          <span className="group-tag-premium">Identité de l'ouvrage</span>
          
          <div className="input-row mt-4" style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
            <div className="input-group flex-grow" style={{ flex: 1 }}>
              <label className="form-label">ISBN (Identifiant unique)</label>
              <input type="text" className="input-field-premium" value={formData.isbn} onChange={e => setFormData({ ...formData, isbn: e.target.value })} placeholder="Ex: 978-..." required />
            </div>
            <div className="input-group flex-grow" style={{ flex: 1 }}>
              <label className="form-label">Titre de l'ouvrage</label>
              <input type="text" className="input-field-premium" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Titre complet" required />
            </div>
          </div>

          <div className="input-row" style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
            <div className="input-group flex-grow" style={{ flex: 1 }}>
              <label className="form-label">Auteur</label>
              <input type="text" className="input-field-premium" value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} placeholder="Nom de l'auteur" required />
            </div>
            <div className="input-group flex-grow" style={{ flex: 1 }}>
              <label className="form-label">Éditeur</label>
              <input type="text" className="input-field-premium" value={formData.publisher} onChange={e => setFormData({ ...formData, publisher: e.target.value })} placeholder="Maison d'édition" />
            </div>
          </div>

          <div className="input-row" style={{ display: 'flex', gap: '24px' }}>
            <div className="input-group flex-grow" style={{ flex: 1 }}>
              <label className="form-label">Année de publication</label>
              <input type="number" className="input-field-premium" value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} />
            </div>
            <div className="input-group flex-grow" style={{ flex: 1 }}>
              <label className="form-label">Catégorie</label>
              <select className="input-field-premium" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required>
                <option value="">Sélectionner une catégorie...</option>
                <option value="Roman">Roman</option>
                <option value="Science Fiction">Science Fiction</option>
                <option value="Informatique">Informatique</option>
                <option value="Histoire">Histoire</option>
                <option value="Drame">Drame</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-footer-premium" style={{ marginTop: '40px', padding: '0', background: 'transparent', borderTop: 'none' }}>
          <button type="button" className="btn btn-ghost" onClick={onCancel} style={{ fontSize: '15px' }}>Annuler</button>
          <button type="submit" className="btn btn-primary" style={{ padding: '12px 32px', fontSize: '15px' }}>
            <Save size={18} /> {mode === 'add' ? 'Ajouter le livre' : 'Mettre à jour'}
          </button>
        </div>
      </form>
    </div>
  );
};

const DeleteConfirm = ({ id, books, onDelete, onCancel }) => {
  const book = books.find(b => b.id === id);
  if (!book) return <Navigate to="/books/list" />;

  return (
    <div className="card delete-card">
      <div className="card-header danger-header">
        <Trash2 size={20} className="text-danger" />
        <h2>Suppression critique</h2>
      </div>
      <div className="p-4">
        <p className="my-4 text-center">Vous allez supprimer <strong>{book.title}</strong>.<br />Tous ses exemplaires rattachés seront également supprimés.</p>
        <div className="form-actions justify-center">
          <button className="btn btn-secondary" onClick={onCancel}>Annuler</button>
          <button className="btn btn-danger" onClick={() => onDelete(id)}>Supprimer définitivement</button>
        </div>
      </div>
    </div>
  );
};

const BookDetail = ({ book, copies, borrowings, users, onBack, onEdit, onDelete, onAddCopy }) => {
  const bookCopies = copies.filter(c => c.bookId === book.id);
  const hue = (parseInt(book.id) * 137.5) % 360;

  const getBorrowerName = (copyId) => {
    const activeBorrow = borrowings.find(b => b.copyId === copyId && !b.returnDate);
    if (!activeBorrow) return '—';
    const user = users.find(u => u.id === activeBorrow.userId);
    return user ? user.name : '—';
  };

  return (
    <div className="bd-container">
      {/* Page Header */}
      <div className="bd-page-header">
        <button className="bd-back-btn" onClick={onBack}>
          <ArrowLeft size={16} />
        </button>
        <h1 className="bd-page-title">Afficher les détails d'un livre</h1>
      </div>

      {/* Main Info Card */}
      <div className="bd-main-card">
        {/* Book Cover */}
        <div
          className="bd-cover"
          style={{ background: `linear-gradient(145deg, hsl(${hue}, 50%, 40%), hsl(${hue}, 50%, 22%))` }}
        >
          <div className="pattern-overlay" />
          <BookIcon size={64} color="rgba(255,255,255,0.85)" strokeWidth={1.2} />
        </div>

        {/* Info Table + Buttons */}
        <div className="bd-info-section">
          <table className="bd-info-table">
            <tbody>
              <tr>
                <td className="bd-field-label">ISBN</td>
                <td className="bd-field-value">{book.isbn}</td>
              </tr>
              <tr>
                <td className="bd-field-label">Titre</td>
                <td className="bd-field-value"><strong>{book.title}</strong></td>
              </tr>
              <tr>
                <td className="bd-field-label">Auteur</td>
                <td className="bd-field-value">{book.author}</td>
              </tr>
              <tr>
                <td className="bd-field-label">Catégorie</td>
                <td className="bd-field-value">{book.category}</td>
              </tr>
              <tr>
                <td className="bd-field-label">Année publication</td>
                <td className="bd-field-value">{book.year || '—'}</td>
              </tr>
              <tr>
                <td className="bd-field-label">Éditeur</td>
                <td className="bd-field-value">{book.publisher || '—'}</td>
              </tr>
              {book.words && (
                <tr>
                  <td className="bd-field-label">Résumé</td>
                  <td className="bd-field-value bd-summary">{book.words}</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="bd-actions">
            <button className="bd-btn bd-btn-primary" onClick={() => onEdit(book.id)}>
              <Edit size={15} /> Modifier
            </button>
            <button className="bd-btn bd-btn-danger" onClick={() => onDelete(book.id)}>
              <Trash2 size={15} /> Supprimer
            </button>
          </div>
        </div>
      </div>

      {/* Copies Table */}
      <div className="bd-copies-section">
        <h2 className="bd-copies-title">Exemplaires du livres</h2>
        <div className="bd-copies-card">
          {bookCopies.length === 0 ? (
            <p className="bd-empty">Aucun exemplaire enregistré pour ce livre.</p>
          ) : (
            <table className="bd-copies-table">
              <thead>
                <tr>
                  <th>Code barre</th>
                  <th>État</th>
                  <th>Statut</th>
                  <th>Emprunteur</th>
                </tr>
              </thead>
              <tbody>
                {bookCopies.map((copy) => (
                  <tr key={copy.id}>
                    <td><code style={{ fontFamily: 'monospace', fontSize: 13, background: 'var(--table-header-bg)', padding: '2px 6px', borderRadius: 4 }}>{copy.code || copy.id}</code></td>
                    <td>{copy.etat || '—'}</td>
                    <td>
                      <span className={`bd-status-badge ${copy.status === 'Disponible' ? 'bd-badge-disponible' : 'bd-badge-prete'}`}>
                        {copy.status}
                      </span>
                    </td>
                    <td>{getBorrowerName(copy.id)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailLoader = ({ books, copies, borrowings, users, onEdit, onDelete, onAddCopy, onBack }) => {
  const { id } = useParams();
  const book = books.find(b => b.id === id);
  if (!book) return <Navigate to="/books/list" />;
  return (
    <BookDetail
      book={book}
      copies={copies}
      borrowings={borrowings}
      users={users}
      onBack={onBack}
      onEdit={onEdit}
      onDelete={onDelete}
      onAddCopy={onAddCopy}
    />
  );
};

const Books = () => {
  const { books, copies, addBook, updateBook, deleteBook, borrowings, users } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  return (
    <div className="books-page">
      <Routes>
        <Route path="list" element={
          <BookList
            books={books}
            copies={copies}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onView={(id) => navigate(`/books/detail/${id}`)}
            onEdit={(id) => navigate(`/books/edit/${id}`)}
            onDelete={(id) => navigate(`/books/delete/${id}`)}
          />
        } />
        <Route path="detail/:id" element={
          <DetailLoader
            books={books}
            copies={copies}
            borrowings={borrowings}
            users={users}
            onEdit={(id) => navigate(`/books/edit/${id}`)}
            onDelete={(id) => { deleteBook(id); navigate('/books/list'); }}
            onAddCopy={() => navigate('/exemplaires/add')}
            onBack={() => navigate('/books/list')}
          />
        } />
        <Route path="search" element={
          <BookGallery
            books={books}
            copies={copies}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onEdit={(id) => navigate(`/books/edit/${id}`)}
          />
        } />
        <Route path="add" element={
          <BookForm
            mode="add"
            onSave={(data) => { addBook(data); navigate('/books/list'); }}
            onCancel={() => navigate('/books/list')}
          />
        } />
        <Route path="edit/:id" element={<EditLoader books={books} onUpdate={updateBook} onCancel={() => navigate('/books/list')} />} />
        <Route path="delete/:id" element={<DeleteLoader books={books} onDelete={deleteBook} onCancel={() => navigate('/books/list')} />} />
        <Route path="edit" element={<Navigate to="/books/list" replace />} />
        <Route path="delete" element={<Navigate to="/books/list" replace />} />
        <Route path="*" element={<Navigate to="list" replace />} />
      </Routes>
    </div>
  );
};

const EditLoader = ({ books, onUpdate, onCancel }) => {
  const { id } = useParams();
  const book = books.find(b => b.id === id);
  if (!book) return <Navigate to="/books/list" />;
  return (
    <BookForm
      mode="edit"
      initialData={book}
      onSave={(data) => { onUpdate(id, data); onCancel(); }}
      onCancel={onCancel}
    />
  );
};

const DeleteLoader = ({ books, onDelete, onCancel }) => {
  const { id } = useParams();
  return (
    <DeleteConfirm
      id={id}
      books={books}
      onDelete={(id) => { onDelete(id); onCancel(); }}
      onCancel={onCancel}
    />
  );
};

export default Books;
