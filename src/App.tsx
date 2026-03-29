import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import './tailwind.css';
import './style.css';

// Page Imports
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ManageStaff from './pages/ManageStaff';
import ManageInsights from './pages/ManageInsights';
import ManageMessages from './pages/ManageMessages';
import ManageCapabilities from './pages/ManageCapabilities';
import ManageTestimonials from './pages/ManageTestimonials';
import ManageCaseStudies from './pages/ManageCaseStudies';
import ManageAdmins from './pages/ManageAdmins';
import AuthSuccess from './pages/AuthSuccess'; 
import AdminNavbar from './components/AdminNavbar';

interface Session {
  token: string;
  email: string;
  avatar?: string;
  id?: string;
}

// Higher Order Component to protect private routes
function ProtectedRoute({
  children,
  session,
  onLogout,
}: {
  children: React.ReactNode;
  session: Session | null;
  onLogout: () => void;
}) {
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="admin-wrapper">
      <AdminNavbar email={session.email} avatar={session.avatar} onLogout={onLogout} />
      <main className="admin-main-content animate-fade-in">
        {children}
      </main>
    </div>
  );
}

function AppContent() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Persistent Session Check
  useEffect(() => {
    const saved = localStorage.getItem('admin_token');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.token && parsed.email) {
          setSession(parsed);
        } else {
          localStorage.removeItem('admin_token');
        }
      } catch {
        localStorage.removeItem('admin_token');
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setSession(null);
  };

  const handleLoginSuccess = (token: string, email: string, avatar?: string) => {
    const data = { token, email, avatar };
    // Stringify for localStorage persistence
    localStorage.setItem('admin_token', JSON.stringify(data));
    setSession(data);
  };

  if (loading) {
    return (
      <div className="admin-loading-screen flex flex-col items-center justify-center h-screen bg-[#0f172a] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00A36C] border-t-transparent mb-4" />
        <p className="font-medium">Initializing Adansonia Admin...</p>
      </div>
    );
  }

  return (
    <Routes location={location} key={location.pathname}>
      {/* 1. Login Route */}
      <Route
        path="/login"
        element={
          session ? <Navigate to="/dashboard" replace /> : <AdminLogin onSuccess={handleLoginSuccess} />
        }
      />
      
      {/* 2. Google OAuth Handshake Route */}
      <Route 
        path="/auth-success" 
        element={<AuthSuccess onSuccess={handleLoginSuccess} />} 
      />

      {/* 3. Protected Dashboard & Management Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute session={session} onLogout={handleLogout}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-staff"
        element={
          <ProtectedRoute session={session} onLogout={handleLogout}>
            <ManageStaff />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-insights"
        element={
          <ProtectedRoute session={session} onLogout={handleLogout}>
            <ManageInsights />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-messages"
        element={
          <ProtectedRoute session={session} onLogout={handleLogout}>
            <ManageMessages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-capabilities"
        element={
          <ProtectedRoute session={session} onLogout={handleLogout}>
            <ManageCapabilities />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-testimonials"
        element={
          <ProtectedRoute session={session} onLogout={handleLogout}>
            <ManageTestimonials />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-case-studies"
        element={
          <ProtectedRoute session={session} onLogout={handleLogout}>
            <ManageCaseStudies />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-admins"
        element={
          <ProtectedRoute session={session} onLogout={handleLogout}>
            <ManageAdmins />
          </ProtectedRoute>
        }
      />

      {/* 4. Global Redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster position="top-right" />
      <AppContent />
    </Router>
  );
}