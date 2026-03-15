import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className={`app-container ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main className="main-content">
        <Header toggleSidebar={toggleSidebar} />
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
