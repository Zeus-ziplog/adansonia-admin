import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import PageLayout from '../components/PageLayout';
import { Trash2, UserPlus, Shield, X, Mail, Key, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

interface Admin {
  id: string;
  email: string;
  created_at: string;
  avatar?: string;
}

export default function ManageAdmins() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [currentAdminId, setCurrentAdminId] = useState<string | null>(null);

  useEffect(() => {
    const tokenStr = localStorage.getItem('admin_token');
    if (tokenStr) {
      try {
        const session = JSON.parse(tokenStr);
        setCurrentAdminId(session.id);
      } catch (e) {
        console.error('Failed to parse token', e);
      }
    }
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const data = await api.getAdmins();
      setAdmins(data);
    } catch (err) {
      toast.error('Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.createAdmin({ email: newEmail, password: newPassword });
      toast.success('Admin created');
      setNewEmail('');
      setNewPassword('');
      setConfirmPassword('');
      setShowModal(false);
      fetchAdmins();
    } catch (err: any) {
      setError(err.message || 'Failed to create admin');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, email: string) => {
    if (id === currentAdminId) {
      toast.error('You cannot delete yourself');
      return;
    }
    if (!confirm(`Are you sure you want to delete admin "${email}"?`)) return;
    try {
      await api.deleteAdmin(id);
      toast.success('Admin deleted');
      fetchAdmins();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const getInitials = (email: string) => email.charAt(0).toUpperCase();

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return score;
    if (pass.length >= 8) score++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) score++;
    if (/[^a-zA-Z0-9]/.test(pass)) score++;
    if (pass.length >= 12) score++;
    return score;
  };

  return (
    <PageLayout
      title="Administrator Management"
      subtitle="Add, view, and remove admin users"
      heroImage="/hero-admin.jpg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Stats Card – responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-jade/10 flex items-center justify-center text-jade">
                <Shield size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider">Total Administrators</p>
                <p className="text-3xl font-bold text-gray-800">{admins.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Header with action button – stacks on mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Users</h1>
            <p className="text-gray-500">Manage who has access to this panel</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-jade hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition w-full sm:w-auto"
          >
            <UserPlus size={18} />
            New Admin
          </button>
        </div>

        {/* Admin List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jade"></div>
          </div>
        ) : admins.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-100">
            <Shield size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No administrators found</h3>
            <p className="text-gray-500 mb-6">Add your first administrator to get started.</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-jade hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-xl inline-flex items-center gap-2"
            >
              <UserPlus size={18} />
              Add Admin
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Admin Users</h2>
              <p className="text-sm text-gray-500">Manage who has access to this panel</p>
            </div>
            <ul className="divide-y divide-gray-200">
              {admins.map((admin) => (
                <li key={admin.id} className="px-6 py-4 hover:bg-gray-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex-shrink-0 overflow-hidden bg-gradient-to-br from-jade to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {admin.avatar ? (
                        <img
                          src={admin.avatar}
                          alt={admin.email}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span>{getInitials(admin.email)}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-800 break-all">{admin.email}</span>
                        {admin.id === currentAdminId && (
                          <span className="inline-flex items-center gap-1 text-xs bg-jade/10 text-jade px-2 py-0.5 rounded-full font-medium">
                            <Shield size={12} /> You
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <Calendar size={14} />
                        <span>Created {new Date(admin.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(admin.id, admin.email)}
                    disabled={admin.id === currentAdminId}
                    className={`self-end sm:self-center p-2 rounded-lg transition ${
                      admin.id === currentAdminId
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-400 hover:bg-red-50 hover:text-red-600'
                    }`}
                    title={admin.id === currentAdminId ? "You cannot delete yourself" : "Delete admin"}
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Modal for creating admin – responsive width */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto mx-4 sm:mx-0">
              <div className="p-6">
                {/* ... modal content (unchanged) ... */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Create Administrator</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <X size={24} />
                  </button>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm border border-red-100">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          required
                          placeholder="admin@example.com"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-jade/20 focus:border-jade transition-all"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          placeholder="••••••••"
                          minLength={8}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-jade/20 focus:border-jade transition-all"
                        />
                      </div>
                      {newPassword && (
                        <div className="mt-2">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4].map((level) => (
                              <div
                                key={level}
                                className={`h-1 flex-1 rounded-full transition-colors ${
                                  level <= getPasswordStrength(newPassword)
                                    ? level <= 1
                                      ? 'bg-red-500'
                                      : level <= 2
                                      ? 'bg-yellow-500'
                                      : level <= 3
                                      ? 'bg-green-400'
                                      : 'bg-green-600'
                                    : 'bg-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Use at least 8 characters with mix of letters, numbers & symbols
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-jade/20 focus:border-jade transition-all"
                        />
                      </div>
                      {confirmPassword && newPassword !== confirmPassword && (
                        <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button
                      type="submit"
                      disabled={loading || (newPassword !== confirmPassword)}
                      className="flex-1 bg-jade hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Creating...' : 'Create Admin'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-xl transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}