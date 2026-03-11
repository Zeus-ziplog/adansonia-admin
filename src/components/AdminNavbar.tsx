import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  MessageSquare,
  Briefcase,
  Star,
  Calendar,
  LogOut,
  Menu,
  X,
  Settings,
  ChevronDown,
} from 'lucide-react';

interface AdminNavbarProps {
  email: string;
  avatar?: string;
  onLogout: () => void;
}

export default function AdminNavbar({ email, avatar, onLogout }: AdminNavbarProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
    setIsOpen(false);
    setProfileOpen(false);
  };

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const navItems = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/manage-staff', label: 'Advocates', icon: Users },
    { to: '/manage-insights', label: 'Insights & Articles', icon: BookOpen },
    { to: '/manage-messages', label: 'Client Inquiries', icon: MessageSquare },
    { to: '/manage-capabilities', label: 'Capabilities', icon: Briefcase },
    { to: '/manage-testimonials', label: 'Testimonials', icon: Star },
    { to: '/manage-case-studies', label: 'Case Studies', icon: Calendar },
    { to: '/manage-admins', label: 'Admins', icon: Users },
  ];

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleSidebar}
        className="hamburger md:hidden"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && <div className="sidebar-backdrop open" onClick={closeSidebar} />}

      {/* Sidebar */}
      <aside
        className={`admin-sidebar-container ${isOpen ? 'open' : ''}`}
      >
        <nav className="admin-sidebar">
          {/* Brand */}
          <div className="sidebar-brand">
            <div className="brand-icon-box">
              <img src="/icon.png" alt="Adansonia Logo" />
            </div>
            <div className="brand-text">
              <span className="admin-logo-main">ADANSONIA</span>
              <span className="admin-logo-sub text-xs opacity-80 uppercase">Kiamba Mbithi & Co</span>
              <span className="admin-logo-sub text-[10px] opacity-60 uppercase">Advocates</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="admin-nav-links">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  <Icon size={22} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Profile Section */}
          <div className="admin-nav-footer relative">
            <div
              className="user-profile"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <div className="user-avatar flex items-center justify-center overflow-hidden">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={email}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-jade to-emerald-600 flex items-center justify-center text-white font-bold">
                    {email.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="user-info">
                <div className="user-email">{email}</div>
                <div className="user-role">Administrator</div>
              </div>
              <ChevronDown
                size={18}
                className={`text-gray-400 transition-transform duration-200 ${
                  profileOpen ? 'rotate-180' : ''
                }`}
              />
            </div>

            {/* Dropdown Menu */}
            {profileOpen && (
              <div className="dropdown-menu animate-fade-in">
                <NavLink
                  to="/manage-admins"
                  className="dropdown-item"
                  onClick={() => setProfileOpen(false)}
                >
                  <Settings size={16} />
                  Manage Admins
                </NavLink>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    handleLogout();
                  }}
                  className="dropdown-item text-red-600"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
}