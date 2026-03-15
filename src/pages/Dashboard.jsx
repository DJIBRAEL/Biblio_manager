import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import { Book, Users, Repeat, CheckCircle, LayoutDashboard, Plus, UserPlus, BarChart3, PieChart, Zap, ClipboardList, LayoutList } from 'lucide-react';
import './Dashboard.css';

const StatCard = ({ title, value, icon, color, onClick }) => (
  <div className="stat-card card clickable" onClick={onClick} role="button" tabIndex="0">
    <div className="stat-icon" style={{ backgroundColor: `${color}20`, color }}>
      {icon}
    </div>
    <div className="stat-info">
      <h3>{title}</h3>
      <p className="stat-value">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { stats, borrowings, books, users, copies, reservations } = useLibrary();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(null);

  const recentBorrowings = borrowings
    .slice(-5)
    .reverse()
    .map(b => {
      const copy = copies.find(c => String(c.id) === String(b.copyId));
      const book = copy ? books.find(bk => String(bk.id) === String(copy.bookId)) : null;
      const user = users.find(u => String(u.id) === String(b.userId));
      return { ...b, book, user };
    });

  const pendingReservations = (reservations || [])
    .filter(r => r.status === 'En attente')
    .slice(-2)
    .reverse()
    .map(r => {
      const book = books.find(bk => String(bk.id) === String(r.bookId));
      const user = users.find(u => String(u.id) === String(r.userId));
      return { ...r, book, user };
    });

  // Graphique Fréquentation : Emprunts par jour (7 derniers jours)
  const getWeeklyData = () => {
    const safeBorrowings = borrowings || [];
    const days = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
    const colors = ['#1c3d4a', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
    
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dayIndex = d.getDay();
      return {
        dateStr: d.toISOString().split('T')[0],
        dayLabel: days[dayIndex],
        color: colors[i % colors.length],
        count: 0
      };
    });

    safeBorrowings.forEach(b => {
      const index = last7Days.findIndex(d => d.dateStr === b.borrowDate);
      if (index !== -1) last7Days[index].count++;
    });

    const maxCount = Math.max(...last7Days.map(d => d.count), 1);
    return last7Days.map(d => ({
      ...d,
      height: `${Math.max((d.count / maxCount) * 90, 10)}%` // Min 10% pour visibilité
    }));
  };

  // Graphique Genre : Répartition par catégorie
  const getCategoryData = () => {
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];
    const counts = {};
    books.forEach(b => {
      counts[b.category] = (counts[b.category] || 0) + 1;
    });

    let cumulativePercent = 0;
    const categories = Object.keys(counts).map((cat, i) => {
      const count = counts[cat];
      const percent = Math.round((count / books.length) * 100);
      const start = cumulativePercent;
      cumulativePercent += percent;
      return {
        name: cat,
        count,
        percent,
        color: colors[i % colors.length],
        start,
        end: cumulativePercent
      };
    }).sort((a, b) => b.count - a.count);

    return categories;
  };

  const weeklyData = getWeeklyData();
  const categoryData = getCategoryData();
  const mainCategory = categoryData[0] || { name: 'Autre', percent: 0, color: '#10b981' };
  
  // Pour le donut simplifié : Vert pour le principal, Bleu pour le reste
  const simplifiedGradient = `var(--success) 0% ${mainCategory.percent}%, var(--primary) ${mainCategory.percent}% 100%`;

  const donutGradient = categoryData.length > 0 
    ? categoryData.map(c => `${c.color} ${c.start}% ${c.end}%`).join(', ')
    : 'var(--primary-light) 0 100%';

  const handleDonutHover = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Calcul de l'angle (0-360 deg)
    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    
    // Conversion angle en pourcentage (0-100)
    const percent = (angle / 360) * 100;
    
    const category = categoryData.find(c => percent >= c.start && percent < c.end);
    setActiveCategory(category || null);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        <StatCard title="Total Livres" value={stats.totalBooks} icon={<Book size={24} />} color="#1c3d4a" onClick={() => navigate('/books')} />
        <StatCard title="Disponibles" value={stats.totalAvailable} icon={<CheckCircle size={24} />} color="#10b981" onClick={() => navigate('/exemplaires')} />
        <StatCard title="Emprunts" value={stats.totalBorrowed} icon={<Repeat size={24} />} color="#f59e0b" onClick={() => navigate('/borrowings')} />
        <StatCard title="Lecteurs" value={users.length} icon={<Users size={24} />} color="#285160" onClick={() => navigate('/users')} />

        {/* Row: Recent Activity & Reservations */}
        <div className="card table-card col-span-3">
          <div className="card-header" style={{ padding: '0px 20px', borderBottom: '1px solid #f1f5f9' }}>
            <div className="header-with-icon" style={{ gap: '8px' }}>
              <div className="icon-box" style={{ width: '28px', height: '28px', minWidth: '28px' }}>
                <Repeat size={14} />
              </div>
              <div className="header-content">
                <h2 style={{ fontSize: '1rem', lineHeight: '1' }}>Emprunts Récents</h2>
              </div>
            </div>
            <button className="text-link" onClick={() => navigate('/borrowings/history')}>Voir tout</button>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Lecteur</th>
                  <th>Livre</th>
                  <th>Date</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentBorrowings.map(b => (
                  <tr key={b.id}>
                    <td>{b.user?.name || 'Inconnu'}</td>
                    <td>{b.book?.title || 'Inconnu'}</td>
                    <td>{new Date(b.borrowDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${b.returnDate ? 'badge-success' : 'badge-warning'}`}>
                        {b.returnDate ? 'Retourné' : 'En cours'}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentBorrowings.length === 0 && (
                  <tr><td colSpan="4" className="text-center py-4 text-muted">Aucun emprunt récent</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card info-card col-span-1">
          <div className="card-header" style={{ padding: '0px 20px', borderBottom: '1px solid #f1f5f9' }}>
            <div className="header-with-icon" style={{ gap: '8px' }}>
              <div className="icon-box" style={{ width: '28px', height: '28px', minWidth: '28px', background: 'var(--warning-light)', color: 'var(--warning)' }}>
                <LayoutList size={14} />
              </div>
              <div className="header-content">
                <h2 style={{ fontSize: '1rem', lineHeight: '1' }}>Réservations</h2>
              </div>
            </div>
          </div>
          <div className="activity-list" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {pendingReservations.map(r => (
              <div className="activity-item clickable" key={r.id} onClick={() => navigate('/reservations')} role="button" tabIndex="0">
                <div className="activity-dot dot-warning"></div>
                <div className="activity-content">
                  <p><strong>{r.user?.name || 'Lecteur'}</strong> a réservé <span className="book-title-emphasized">"{r.book?.title || 'Livre'}"</span></p>
                  <span className="activity-date">{new Date(r.reservationDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
            {pendingReservations.length === 0 && (
              <div className="text-center py-8 text-muted">
                <p>Aucune réservation en attente</p>
              </div>
            )}
            {(reservations || []).filter(r => r.status === 'En attente').length > 2 && (
              <div style={{ textAlign: 'center', marginTop: 'auto', paddingTop: '10px' }}>
                <button className="text-link" style={{ margin: 0, fontSize: '0.85rem' }} onClick={() => navigate('/reservations')}>
                  Voir tout le planning
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 2 - Charts & Actions (Bottom) */}
      <div className="dashboard-grid">
        <div className="col-span-3 charts-container">
          <div className="card chart-card clickable" onClick={() => navigate('/borrowings/history')} title="Voir l'historique complet">
            <div className="card-header">
              <h3><BarChart3 size={18} style={{ verticalAlign: 'middle', color: 'var(--primary)', opacity: 0.8 }} /> Fréquentation hebdomadaire</h3>
            </div>
            <div className="simulated-bar-chart">
              {weeklyData.map((d, i) => (
                <div key={i} className="bar" style={{ height: d.height, backgroundColor: d.color, animationDelay: `${i * 0.1}s` }} title={`${d.count} emprunts`}>
                  <span>{d.dayLabel}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card chart-card clickable" 
            onClick={() => navigate(activeCategory ? `/books?category=${activeCategory.name}` : `/books?category=${mainCategory.name}`)}
            title={activeCategory ? `Voir les livres en ${activeCategory.name}` : `Voir les livres en ${mainCategory.name}`}>
            <div className="card-header">
              <h3><PieChart size={18} style={{ verticalAlign: 'middle', color: 'var(--primary)', opacity: 0.8 }} /> Répartition par genre</h3>
            </div>
            <div className="simulated-donut-chart" 
              onMouseMove={handleDonutHover}
              onMouseLeave={() => setActiveCategory(null)}
              style={{ background: `conic-gradient(${donutGradient})` }}>
              <div className="donut-center">
                <div className="active-cat-info">
                  <span className="cat-percent">{activeCategory ? activeCategory.percent : mainCategory.percent}%</span>
                  <span className="cat-name">{activeCategory ? activeCategory.name : mainCategory.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card quick-actions col-span-1">
          <div className="card-header">
            <h2><Zap size={20} style={{ verticalAlign: 'middle', color: 'var(--secondary)', opacity: 0.8 }} /> Actions Rapides</h2>
          </div>
          <div className="btn-stack">
            <button className="quick-action-btn qa-books" onClick={() => navigate('/books/add')}>
              <div className="qa-icon"><Plus size={18} /></div>
              <div className="qa-text">
                <strong>Nouveau Livre</strong>
                <span>Ajouter au catalogue</span>
              </div>
            </button>
            <button className="quick-action-btn qa-users" onClick={() => navigate('/users/add')}>
              <div className="qa-icon"><UserPlus size={18} /></div>
              <div className="qa-text">
                <strong>Inscrire un Lecteur</strong>
                <span>Nouveau membre</span>
              </div>
            </button>
            <button className="quick-action-btn qa-borrow" onClick={() => navigate('/borrowings/new')}>
              <div className="qa-icon"><Repeat size={18} /></div>
              <div className="qa-text">
                <strong>Faire un Emprunt</strong>
                <span>Nouvelle transaction</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
