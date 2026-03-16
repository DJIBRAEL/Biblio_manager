import { useState } from 'react';
import { Routes, Route, useNavigate, useParams, Navigate } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import { Users as UsersIcon, UserPlus, Search, Trash2, UserCircle, ShieldCheck, Mail, Phone, Calendar, Globe, MapPin, Clock, History, ChevronRight } from 'lucide-react';
import './Users.css';

const UserList = ({ users, searchTerm, setSearchTerm, onDelete }) => {
  const navigate = useNavigate();
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats calculation
  const stats = {
    etudiant: users.filter(u => u.type === 'Etudiant').length,
    professeur: users.filter(u => u.type === 'Professeur').length,
    personnel: users.filter(u => u.type === 'Personnel administratif').length
  };

  return (
    <div className="user-management-overview">
      <div className="stats-header-grid mb-6">
        <div className="card stat-mini-card">
          <div className="stat-icon-mini bg-blue-light"><UsersIcon size={20} /></div>
          <div className="stat-content-mini">
            <span className="stat-label">Étudiants</span>
            <span className="stat-value">{stats.etudiant}</span>
          </div>
        </div>
        <div className="card stat-mini-card">
          <div className="stat-icon-mini bg-green-light"><UsersIcon size={20} /></div>
          <div className="stat-content-mini">
            <span className="stat-label">Professeurs</span>
            <span className="stat-value">{stats.professeur}</span>
          </div>
        </div>
        <div className="card stat-mini-card">
          <div className="stat-icon-mini bg-red-light"><UsersIcon size={20} /></div>
          <div className="stat-content-mini">
            <span className="stat-label">Personnel</span>
            <span className="stat-value">{stats.personnel}</span>
          </div>
        </div>
      </div>

      <div className="header-with-icon">
        <div className="icon-box">
          <UsersIcon size={24} />
        </div>
        <div className="header-content">
          <h1>Liste des utilisateurs</h1>
          <p>Gérez les membres de la bibliothèque et leurs accès.</p>
        </div>
      </div>
      <div className="card">
        <div className="toolbar">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
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
                <th>Matricule</th>
                <th>Prénom</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th style={{ textAlign: 'center' }}>Type</th>
                <th>Inscription</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? filteredUsers.map(user => {
                const [firstName, ...lastNameParts] = user.name.split(' ');
                const lastName = lastNameParts.join(' ');
                
                const getBadgeClass = (type) => {
                  if (type === 'Etudiant') return 'badge-primary';
                  if (type === 'Professeur') return 'badge-success';
                  return 'badge-warning';
                };

                return (
                  <tr key={user.id}>
                    <td className="text-muted text-sm">{user.matricule || 'N/A'}</td>
                    <td className="font-medium">{firstName}</td>
                    <td className="font-medium text-uppercase">{lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge ${getBadgeClass(user.type)}`}>{user.type}</span>
                    </td>
                    <td className="text-muted">{user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="action-buttons" style={{ justifyContent: 'center' }}>
                        <button className="icon-btn" onClick={() => navigate(`/users/profile/${user.id}`)} title="Profil">
                          <UserCircle size={16} />
                        </button>
                        <button className="icon-btn delete-btn" onClick={() => onDelete(user.id)} title="Supprimer">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">Aucun utilisateur trouvé.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
const UserForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    civility: 'M.',
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+223',
    phone: '',
    birthday: '',
    nationality: 'Mali',
    address: '',
    type: 'Etudiant'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const combinedData = {
      ...formData,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      phone: `${formData.countryCode} ${formData.phone}`.trim(),
      joinDate: new Date().toISOString().split('T')[0],
      matricule: `${formData.type.substring(0, 2).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    };
    onSave(combinedData);
  };

  return (
    <div className="form-card-premium">
      <div className="form-header-premium">
        <div className="icon-box">
          <UserPlus size={28} />
        </div>
        <div className="header-content">
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>Créer un utilisateur</h2>
          <p style={{ margin: '4px 0 0', color: 'var(--text-muted)' }}>Remplissez les informations pour ajouter un nouveau membre.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-body-premium">
        <div className="form-group-wrapper">
          <span className="group-tag-premium">Identité</span>
          <div className="input-row" style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
            <div className="input-group" style={{ width: '120px' }}>
              <label className="form-label">Civilité</label>
              <select className="input-field-premium" value={formData.civility} onChange={e => setFormData({ ...formData, civility: e.target.value })}>
                <option value="M.">M.</option>
                <option value="Mme">Mme</option>
                <option value="Mlle">Mlle</option>
              </select>
            </div>
            <div className="input-group flex-grow" style={{ flex: 1 }}>
              <label className="form-label">Prénom</label>
              <input type="text" className="input-field-premium" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} placeholder="Ex: Djibrael" required />
            </div>
            <div className="input-group flex-grow" style={{ flex: 1 }}>
              <label className="form-label">Nom</label>
              <input type="text" className="input-field-premium" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} placeholder="Ex: TRAORÉ" required />
            </div>
          </div>

          <div className="input-row" style={{ display: 'flex', gap: '24px' }}>
            <div className="input-group flex-grow" style={{ flex: 1 }}>
              <label className="form-label">Date de naissance</label>
              <input type="date" className="input-field-premium" value={formData.birthday} onChange={e => setFormData({ ...formData, birthday: e.target.value })} />
            </div>
            <div className="input-group flex-grow" style={{ flex: 1 }}>
              <label className="form-label">Nationalité</label>
              <select className="input-field-premium" value={formData.nationality} onChange={e => setFormData({ ...formData, nationality: e.target.value })}>
                <option value="Mali">Mali</option>
                <option value="Sénégal">Sénégal</option>
                <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                <option value="Bénin">Bénin</option>
                <option value="Burkina Faso">Burkina Faso</option>
                <option value="Cameroon">Cameroun</option>
                <option value="Congo">Congo</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-group-wrapper" style={{ marginTop: '40px' }}>
          <span className="group-tag-premium">Contact & Système</span>
          <div className="input-row" style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
            <div className="input-group flex-2" style={{ flex: 2 }}>
              <label className="form-label">Email professionnel</label>
              <input type="email" className="input-field-premium" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="exemple@univ.edu" required />
            </div>
            <div className="input-group flex-1" style={{ flex: 1 }}>
              <label className="form-label">Téléphone</label>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <select
                  className="input-field-premium"
                  value={formData.countryCode}
                  onChange={e => setFormData({ ...formData, countryCode: e.target.value })}
                  style={{ width: "120px" }}
                >
                  <option value="+221">🇸🇳 +221</option>
                  <option value="+223">🇲🇱 +223</option>
                  <option value="+225">🇨🇮 +225</option>
                  <option value="+229">🇧🇯 +229</option>
                  <option value="+226">🇧🇫 +226</option>
                  <option value="+237">🇨🇲 +237</option>
                  <option value="+242">🇨🇬 +242</option>
                </select>
                <input
                  type="text"
                  className="input-field-premium"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Numéro"
                  style={{ flex: 1 }}
                />
              </div>
            </div>
          </div>

          <div className="input-row" style={{ display: 'flex', gap: '24px' }}>
            <div className="input-group flex-2" style={{ flex: 2 }}>
              <label className="form-label">Adresse</label>
              <input type="text" className="input-field-premium" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="Adresse complète..." />
            </div>
            <div className="input-group flex-1" style={{ flex: 1 }}>
              <label className="form-label">Type d'utilisateur</label>
              <select className="input-field-premium" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                <option value="Etudiant">🎓 Étudiant</option>
                <option value="Professeur">📚 Professeur</option>
                <option value="Personnel administratif">🏢 Personnel administratif</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-footer-premium" style={{ marginTop: '40px', padding: '0', background: 'transparent', borderTop: 'none' }}>
          <button type="button" className="btn-cancel-simple" onClick={onCancel} style={{ fontSize: '15px' }}>Annuler</button>
          <button type="submit" className="btn-submit-simple" style={{ padding: '12px 32px', fontSize: '15px' }}>
            <span>Enregistrer l'utilisateur</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

const UserProfile = ({ id, users }) => {
  const user = users.find(u => u.id === id);
  if (!user) return <Navigate to="/users/list" />;

  const [firstName, ...lastNameParts] = user.name.split(' ');
  const lastName = lastNameParts.join(' ');

  return (
    <div className="mon-profil-container">
      <div className="header-with-icon">
        <div className="icon-box">
          <UserCircle size={24} />
        </div>
        <div className="header-content">
          <h1>Profil d'utilisateur</h1>
          <p>Informations détaillées et historique du membre.</p>
        </div>
      </div>

      <div className="profil-layout-grid">
        {/* Left Column */}
        <div className="profil-sidebar-card card">
          <div className="profil-header-section">
            <div className="section-title-with-icon">
              <UserCircle size={20} className="text-primary" />
              <h3>Informations du profil</h3>
            </div>
            <div className="profil-avatar-container">
              <div className="avatar-preview">
                {/* Mock image path or initial-based avatar */}
                <div className="avatar-placeholder">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              <p className="profil-role-label">{user.type}</p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="profil-details-column">
          <div className="card profil-details-card">
            <div className="section-title-with-icon mb-6">
              <UsersIcon size={20} className="text-primary" />
              <h3>Détails du profil</h3>
            </div>

            <div className="details-grid-form">
              <div className="detail-item">
                <label>Civilité</label>
                <p>{user.civility || 'M.'}</p>
              </div>
              <div className="detail-item">
                <label>Nom</label>
                <p className="text-uppercase">{user.lastName || lastName || 'TRAORÉ'}</p>
              </div>
              <div className="detail-item">
                <label>Prénom</label>
                <p>{user.firstName || firstName || 'Djibrael'}</p>
              </div>

              <div className="detail-item">
                <label>Email</label>
                <p className="break-all">{user.email}</p>
              </div>
              <div className="detail-item">
                <label>Téléphone</label>
                <p>{user.phone || '+221 94096351'}</p>
              </div>
              <div className="detail-item">
                <label>Date de naissance</label>
                <p>{user.birthday ? new Date(user.birthday).toLocaleDateString() : '09/06/2003'}</p>
              </div>

              <div className="detail-item">
                <label>Nationalité</label>
                <p>{user.nationality || 'Mali'}</p>
              </div>
              <div className="detail-item">
                <label>Adresse</label>
                <p>{user.address || 'Bamako, Mali'}</p>
              </div>
              <div className="detail-item">
                <label>Type d'utilisateur</label>
                <p>{user.type || 'Étudiant'}</p>
              </div>
            </div>
            <div className="system-info-section mt-10">
              <div className="details-grid-form mt-4">
                <div className="detail-item">
                  <label>Matricule</label>
                  <p className="font-medium text-primary">{user.matricule || 'Non attribué'}</p>
                </div>
                <div className="detail-item">
                  <label>Date d'inscription</label>
                  <p>{user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'Non définie'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserTypes = () => {
  const types = [
    { emoji: '🎓', label: 'Étudiant', badge: 'L M D', limit: '3 livres', duration: '14 jours', desc: 'Accès aux ouvrages généraux et manuels universitaires.', color: 'blue' },
    { emoji: '📚', label: 'Professeur', badge: 'Enseignant', limit: '10 livres', duration: '30 jours', desc: 'Accès prioritaire et réservation de salle de lecture.', color: 'teal' },
    { emoji: '🏢', label: 'Personnel administratif', badge: 'Staff', limit: '3 livres', duration: '14 jours', desc: 'Accès aux documents institutionnels et guides de gestion.', color: 'orange' },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <div className="section-title-with-icon">
          <ShieldCheck size={20} className="text-primary" />
          <h2>Gestion des Types d'Utilisateurs</h2>
        </div>
      </div>
      <div className="p-4">
        <div className="types-grid-rich">
          {types.map((t) => (
            <div key={t.label} className={`type-card-rich type-card-${t.color}`}>
              <div className="type-card-top">
                <span className="type-emoji">{t.emoji}</span>
                <span className={`type-badge type-badge-${t.color}`}>{t.badge}</span>
              </div>
              <h3 className="type-card-title">{t.label}</h3>
              <p className="type-card-desc">{t.desc}</p>
              <div className="type-limits">
                <div className="limit-item">
                  <span className="limit-label">📦 Livres</span>
                  <span className="limit-value">{t.limit}</span>
                </div>
                <div className="limit-item">
                  <span className="limit-label">⏱ Durée</span>
                  <span className="limit-value">{t.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Users = () => {
  const { users, addUser, deleteUser } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  return (
    <div className="users-page">
      <Routes>
        <Route path="list" element={
          <UserList
            users={users}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onDelete={(id) => { deleteUser(id); navigate('/users/list'); }}
          />
        } />
        <Route path="add" element={
          <UserForm
            onSave={(data) => { addUser(data); navigate('/users/list'); }}
            onCancel={() => navigate('/users/list')}
          />
        } />
        <Route path="profile/:id" element={<ProfileLoader users={users} />} />
        <Route path="types" element={<UserTypes />} />
        <Route path="*" element={<Navigate to="list" replace />} />
      </Routes>
    </div>
  );
};

const ProfileLoader = ({ users }) => {
  const { id } = useParams();
  return <UserProfile id={id} users={users} />;
};

export default Users;
