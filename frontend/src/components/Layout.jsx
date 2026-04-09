import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calculator, CalendarDays, Settings, LogOut, User } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Cubicaciones', path: '/cubicaciones', icon: <Calculator size={20} /> },
    { name: 'Planificación', path: '/planificacion', icon: <CalendarDays size={20} /> },
    { name: 'Mantenedores', path: '/mantenedores', icon: <Settings size={20} /> },
  ];

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src="/eimi_cub_logo.png" alt="EIMI-CUB" className="logo-full" />
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group">
            <p className="nav-label">MENÚ PRINCIPAL</p>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-container">
            <div className="user-profile">
              <div className="avatar">
                <User size={18} />
              </div>
              <div className="user-info">
                <p className="user-name">Usuario Demo</p>
                <p className="user-role">Super Usuario</p>
              </div>
            </div>
            <button className="logout-btn">
              <LogOut size={18} />
            </button>
          </div>
          <div className="version-info">
            <span>v1.2 Stable</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="content-header">
          <h1 className="page-title">
            {menuItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
          </h1>
          <div className="header-actions">
            <button className="btn btn-primary">Exportar Reporte</button>
          </div>
        </header>

        <section className="page-content">
          {children}
        </section>
      </main>

      <style>{`
        :root {
          --sidebar-width: 260px;
          --sidebar-bg: #ffffff;
          --sidebar-hover: #fef2f2;
          --primary: #dc2626;
          --primary-hover: #b91c1c;
          --bg-light: #f8fafc;
          --border: #f1f5f9;
          --text-dark: #0f172a;
          --text-muted: #94a3b8;
          --white: #ffffff;
        }

        body {
          margin: 0;
          font-family: 'Inter', -apple-system, sans-serif;
          background-color: var(--bg-light);
          color: var(--text-dark);
        }

        .layout {
          display: flex;
          min-height: 100vh;
        }

        /* Sidebar Styles */
        .sidebar {
          width: var(--sidebar-width);
          background-color: var(--sidebar-bg);
          color: var(--text-dark);
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          border-right: 1px solid var(--border);
          box-shadow: 10px 0 50px rgba(0,0,0,0.03);
        }

        .sidebar-header {
          padding: 2.5rem 1.5rem 1.5rem 1.5rem;
        }

        .logo-full {
          width: 100%;
          height: auto;
          object-fit: contain;
          transition: transform 0.3s ease;
        }

        .logo-full:hover {
          transform: scale(1.05);
        }

        .sidebar-nav {
          flex: 1;
          padding: 0 0.75rem;
        }

        .nav-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          margin-bottom: 0.75rem;
          padding-left: 0.75rem;
          letter-spacing: 0.05em;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          color: #64748b;
          text-decoration: none;
          border-radius: 0.75rem;
          margin-bottom: 0.375rem;
          transition: all 0.2s ease;
          font-size: 0.9375rem;
          font-weight: 600;
        }

        .nav-item:hover {
          background-color: var(--sidebar-hover);
          color: var(--primary);
        }

        .nav-item.active {
          background-color: var(--primary);
          color: var(--white);
          box-shadow: 0 10px 15px -3px rgba(220, 38, 38, 0.25);
        }

        .sidebar-footer {
          padding: 1.25rem;
          border-top: 1px solid var(--sidebar-hover);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .user-profile-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .avatar {
          width: 32px;
          height: 32px;
          background-color: var(--sidebar-hover);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
        }

        .user-name {
          font-size: 0.875rem;
          font-weight: 500;
          margin: 0;
        }

        .user-role {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin: 0;
        }

        .logout-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.375rem;
          transition: background 0.2s;
        }

        .logout-btn:hover {
          background: var(--sidebar-hover);
          color: #ef4444;
        }

        .version-info {
          padding-top: 0.75rem;
          border-top: 1px solid #1e293b;
        }

        .version-info span {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          opacity: 0.5;
        }

        /* Main Content Styles */
        .main-content {
          margin-left: var(--sidebar-width);
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .content-header {
          padding: 1.5rem 2.5rem;
          background: var(--white);
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .page-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          color: var(--text-dark);
        }

        .page-content {
          padding: 2.5rem;
          max-width: 1400px;
        }

        /* Common Components */
        .btn {
          padding: 0.625rem 1.25rem;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }

        .btn-primary {
          background-color: var(--primary);
          color: white;
        }

        .btn-primary:hover {
          background-color: var(--primary-hover);
          box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
        }
      `}</style>
    </div>
  );
};

export default Layout;
