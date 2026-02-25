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
          <div className="logo-container">
            <Calculator size={32} className="logo-icon" />
            <span className="logo-text">CUBICAPP</span>
          </div>
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
          --sidebar-bg: #0f172a;
          --sidebar-hover: #1e293b;
          --primary: #2563eb;
          --primary-hover: #1d4ed8;
          --bg-light: #f8fafc;
          --border: #e2e8f0;
          --text-dark: #1e293b;
          --text-muted: #64748b;
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
          color: var(--white);
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          border-right: 1px solid var(--sidebar-hover);
        }

        .sidebar-header {
          padding: 2rem 1.5rem;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-icon {
          color: var(--primary);
        }

        .logo-text {
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.025em;
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
          padding: 0.75rem 1rem;
          color: #cbd5e1;
          text-decoration: none;
          border-radius: 0.5rem;
          margin-bottom: 0.25rem;
          transition: all 0.2s ease;
          font-size: 0.9375rem;
        }

        .nav-item:hover {
          background-color: var(--sidebar-hover);
          color: var(--white);
        }

        .nav-item.active {
          background-color: var(--primary);
          color: var(--white);
        }

        .sidebar-footer {
          padding: 1.25rem;
          border-top: 1px solid var(--sidebar-hover);
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
