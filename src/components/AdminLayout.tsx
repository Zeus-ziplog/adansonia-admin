import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Shield, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Overview' },
    { path: '/admin/staff', icon: <Users size={20} />, label: 'Advocates' },
  ];

  return (
    <div className="admin-wrapper">
      {/* Sidebar - Fixed to the left */}
      <aside className="admin-sidebar-container">
        <div className="admin-sidebar">
          <div className="sidebar-brand">
            <div className="brand-icon-box"><Shield size={24} /></div>
            <div>
              <div className="brand-title">ADANSONIA</div>
              <div style={{ fontSize: '10px', color: 'var(--pistachio)', fontWeight: 800 }}>MANAGEMENT</div>
            </div>
          </div>

          <nav className="sidebar-menu-list">
            {menuItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`menu-item ${location.pathname === item.path ? 'menu-item-active' : 'menu-item-inactive'}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="sidebar-user-footer">
            <button className="logout-button" style={{ border: 'none', background: 'rgba(239, 68, 68, 0.1)', cursor: 'pointer' }}>
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area - Pushed to the right */}
      <main className="admin-main-content">
        {children}
      </main>
    </div>
  );
}