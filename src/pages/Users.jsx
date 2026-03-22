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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
        <div className="header-content">
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px' }}>Communauté</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Gérez les membres et leurs privilèges d'accès.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-primary" style={{ padding: '12px 24px', borderRadius: '14px' }} onClick={() => navigate('/users/add')}>
            <UserPlus size={20} />
            <span>Ajouter un membre</span>
          </button>
        </div>
      </div>
      <div className="card" style={{ padding: '0', overflow: 'hidden', border: 'none', background: 'transparent', boxShadow: 'none' }}>
        <div className="toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '24px', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', border: '1px solid var(--border-light)', marginBottom: '0' }}>
          <div className="header-content">
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>Répertoire des membres</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Liste exhaustive des utilisateurs enregistrés.</p>
          </div>
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher par nom, email..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="table-container" style={{ borderRadius: '0 0 var(--radius-lg) var(--radius-lg)', borderTop: 'none' }}>
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
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? filteredUsers.map((user, index) => {
              const [firstName, ...lastNameParts] = user.name.split(' ');
              const lastName = lastNameParts.join(' ');
              
              const getBadgeClass = (type) => {
                if (type === 'Etudiant') return 'badge-primary';
                if (type === 'Professeur') return 'badge-success';
                return 'badge-warning';
              };

              return (
                <tr key={user.id} style={{ animationDelay: `${index * 0.05}s`, cursor: 'pointer' }} className="fade-in-row user-row-clickable" onClick={() => navigate(`/users/profile/${user.id}`)}>
                  <td className="text-muted text-sm" style={{ fontWeight: '500' }}>{user.matricule || 'N/A'}</td>
                  <td className="font-medium" style={{ color: 'var(--primary)', fontWeight: '600' }}>{firstName}</td>
                  <td className="font-medium text-uppercase" style={{ fontWeight: '700' }}>{lastName}</td>
                  <td className="text-muted">{user.email}</td>
                  <td className="text-muted">{user.phone}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge ${getBadgeClass(user.type)}`}>{user.type}</span>
                  </td>
                  <td className="text-muted">{user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}</td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan="8" className="text-center py-8 text-muted">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <Search size={40} opacity={0.2} />
                    <p>Aucun utilisateur ne correspond à votre recherche.</p>
                  </div>
                </td>
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
    <div className="form-card-premium" style={{ background: 'transparent', boxShadow: 'none', border: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
        <button className="icon-btn" onClick={onCancel} title="Retour" style={{ width: '48px', height: '48px', borderRadius: '14px' }}>
          <ChevronRight size={24} style={{ transform: 'rotate(180deg)' }} />
        </button>
        <div className="header-content">
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', margin: 0 }}>Nouveau Membre</h2>
          <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '1.1rem' }}>Veuillez renseigner les informations d'identification du nouvel utilisateur.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-body-premium" style={{ gap: '40px', display: 'flex', flexDirection: 'column' }}>
        <div className="form-group-wrapper">
          <span className="group-tag-premium">Identification Membre</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '12px' }}>
            <div className="input-group">
              <label className="form-label">Identité & Civilité</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select className="input-field-premium" style={{ width: '130px' }} value={formData.civility} onChange={e => setFormData({ ...formData, civility: e.target.value })}>
                  <option value="M.">Mr</option>
                  <option value="Mme">Mme</option>
                  <option value="Mlle">Mlle</option>
                </select>
                <input type="text" className="input-field-premium" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} placeholder="Prénom" required />
              </div>
            </div>
            <div className="input-group">
              <label className="form-label">Nom de famille</label>
              <input type="text" className="input-field-premium" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} placeholder="Ex: TRAORÉ" required />
            </div>

            <div className="input-group">
              <label className="form-label">Date de naissance</label>
              <div className="input-icon-wrapper-premium">
                <input type="date" className="input-field-premium input-with-icon-premium" value={formData.birthday} onChange={e => setFormData({ ...formData, birthday: e.target.value })} />
                <Calendar size={18} className="input-icon-premium" />
              </div>
            </div>
            <div className="input-group">
              <label className="form-label">Nationalité</label>
              <div className="input-icon-wrapper-premium">
                <select className="input-field-premium input-with-icon-premium" value={formData.nationality} onChange={e => setFormData({ ...formData, nationality: e.target.value })}>
                  <option value="Mali">Mali</option>
                  <option value="Burkina Faso">Burkina Faso</option>
                  <option value="Niger">Niger</option>
                  <option value="Sénégal">Sénégal</option>
                  <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                  <option value="Bénin">Bénin</option>
                  <option value="Togo">Togo</option>
                </select>
                <Globe size={18} className="input-icon-premium" />
              </div>
            </div>
          </div>
        </div>

        <div className="form-group-wrapper">
          <span className="group-tag-premium">Coordonnées & Système</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '12px' }}>
            <div className="input-group">
              <label className="form-label">E-mail professionnel</label>
              <div className="input-icon-wrapper-premium">
                <input type="email" className="input-field-premium input-with-icon-premium" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="email@univ.edu.ml" required />
                <Mail size={18} className="input-icon-premium" />
              </div>
            </div>
            <div className="input-group">
              <label className="form-label">Numéro de Téléphone</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <select className="input-field-premium" value={formData.countryCode} onChange={e => setFormData({ ...formData, countryCode: e.target.value })} style={{ width: '110px' }}>
                  <option value="+223">+223</option>
                  <option value="+229">+229</option>
                  <option value="+227">+227</option>
                  <option value="+221">+221</option>
                  <option value="+225">+225</option>
                  <option value="+226">+226</option>
                  <option value="+228">+228</option>
                </select>
                <div className="input-icon-wrapper-premium" style={{ flex: 1 }}>
                  <input type="text" className="input-field-premium input-with-icon-premium" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="00 00 00 00" />
                  <Phone size={18} className="input-icon-premium" />
                </div>
              </div>
            </div>

            <div className="input-group">
              <label className="form-label">Adresse physique</label>
              <div className="input-icon-wrapper-premium">
                <input type="text" className="input-field-premium input-with-icon-premium" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="Quartier, Rue, Porte..." />
                <MapPin size={18} className="input-icon-premium" />
              </div>
            </div>
            <div className="input-group">
              <label className="form-label">Catégorie de membre</label>
              <div className="input-icon-wrapper-premium">
                <select className="input-field-premium input-with-icon-premium" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                  <option value="Etudiant">Étudiant (LMD)</option>
                  <option value="Professeur">Professeur / Enseignant</option>
                  <option value="Personnel administratif">Staff Administratif</option>
                </select>
                <ShieldCheck size={18} className="input-icon-premium" />
              </div>
            </div>
          </div>
        </div>

        <div className="form-footer-premium" style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', padding: '0 8px', marginTop: '-52px' }}>
          <button type="button" className="btn-cancel-simple" onClick={onCancel}>Ignorer</button>
          <button type="submit" className="btn-submit-simple" style={{ borderRadius: '14px' }}>
            <UserPlus size={20} />
            <span>Valider l'inscription</span>
          </button>
        </div>
      </form>
    </div>
  );
};

const UserProfile = ({ id, users }) => {
  const user = users.find(u => u.id === id);
  const navigate = useNavigate();
  if (!user) return <Navigate to="/users/list" />;

  const [firstName, ...lastNameParts] = user.name.split(' ');
  const lastName = lastNameParts.join(' ');

  return (
    <div className="mon-profil-container">
      <div className="header-with-icon">
        <button className="icon-btn mr-4" onClick={() => navigate('/users/list')} title="Retour">
          <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
        </button>
        <div className="icon-box">
          <UserCircle size={24} />
        </div>
        <div className="header-content">
          <h1>Profil Utilisateur</h1>
          <p>Consulter et gérer les informations du membre.</p>
        </div>
      </div>

      <div className="profil-layout-grid">
        {/* Left Column: Summary Card */}
        <div className="profil-sidebar-card">
          <div className="profil-avatar-container">
            <div className="avatar-preview">
              <div className="avatar-placeholder">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', textAlign: 'center', margin: 0 }}>{user.name}</h2>
            <div className="profil-role-badge">{user.type}</div>
          </div>
          
          <div style={{ marginTop: '12px' }}>
            <div className="detail-item" style={{ border: 'none', alignItems: 'center', textAlign: 'center' }}>
              <label>Matricule</label>
              <p style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>{user.matricule || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="profil-details-card">
          <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldCheck size={20} className="text-primary" />
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>Informations Détaillées</h3>
          </div>

          <div className="details-grid-form">
            <div className="detail-item">
              <label>Civilité</label>
              <p>{user.civility || 'Monsieur'}</p>
            </div>
            <div className="detail-item">
              <label>Prénom</label>
              <p>{firstName}</p>
            </div>
            <div className="detail-item">
              <label>Nom</label>
              <p style={{ textTransform: 'uppercase' }}>{lastName}</p>
            </div>
            <div className="detail-item">
              <label>Email</label>
              <p style={{ wordBreak: 'break-all' }}>{user.email}</p>
            </div>
            <div className="detail-item">
              <label>Téléphone</label>
              <p>{user.phone}</p>
            </div>
            <div className="detail-item">
              <label>Date de naissance</label>
              <p>{user.birthday ? new Date(user.birthday).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div className="detail-item">
              <label>Nationalité</label>
              <p>{user.nationality || 'Mali'}</p>
            </div>
            <div className="detail-item">
              <label>Adresse</label>
              <p>{user.address || 'Bamako, Mali'}</p>
            </div>
          </div>

          <div className="system-info-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', opacity: 0.7 }}>
              <History size={16} />
              <span style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Activité Système</span>
            </div>
            <div className="details-grid-form" style={{ gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div className="detail-item" style={{ border: 'none' }}>
                <label>Date d'inscription</label>
                <p>{user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'Inconnue'}</p>
              </div>
              <div className="detail-item" style={{ border: 'none' }}>
                <label>Statut du compte</label>
                <p style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }}></span>
                  Actif
                </p>
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
    { icon: <Globe size={28} />, label: 'Étudiant', badge: 'L M D', limit: '3 livres', duration: '14 jours', desc: 'Accès aux ouvrages généraux et manuels universitaires.', color: 'blue' },
    { icon: <ShieldCheck size={28} />, label: 'Professeur', badge: 'Enseignant', limit: '10 livres', duration: '30 jours', desc: 'Accès prioritaire et réservation de salle de lecture.', color: 'teal' },
    { icon: <UsersIcon size={28} />, label: 'Personnel administratif', badge: 'Staff', limit: '3 livres', duration: '14 jours', desc: 'Accès aux documents institutionnels et guides de gestion.', color: 'orange' },
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
                <div className={`type-icon-wrapper bg-${t.color}-soft`}>
                  {t.icon}
                </div>
                <span className={`type-badge type-badge-${t.color}`}>{t.badge}</span>
              </div>
              <h3 className="type-card-title">{t.label}</h3>
              <p className="type-card-desc">{t.desc}</p>
              <div className="type-limits">
                <div className="limit-item">
                  <div className="limit-icon"><Globe size={16} /></div>
                  <div className="limit-info">
                    <span className="limit-label">Livres</span>
                    <span className="limit-value">{t.limit}</span>
                  </div>
                </div>
                <div className="limit-item">
                  <div className="limit-icon"><Clock size={16} /></div>
                  <div className="limit-info">
                    <span className="limit-label">Durée</span>
                    <span className="limit-value">{t.duration}</span>
                  </div>
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
