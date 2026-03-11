import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import PageLayout from '../components/PageLayout';
import { Edit2, Trash2, UserPlus, X, Mail, Briefcase, Star, Image, Loader2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

interface Staff {
  id: string;
  name: string;
  email: string;
  role?: string;
  expertise?: string[];
  priority?: number;
  image_url?: string;
  bio?: string;
  created_at: string;
}

export default function ManageStaff() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    expertise: '',
    priority: 0,
    bio: '',
    image_base64: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const data = await api.getStaff();
      setStaff(data || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load staff');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (member?: Staff) => {
    if (member) {
      setEditingId(member.id);
      setFormData({
        name: member.name,
        email: member.email || '',
        role: member.role || '',
        expertise: member.expertise ? member.expertise.join(', ') : '',
        priority: member.priority || 0,
        bio: member.bio || '',
        image_base64: '',
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        email: '',
        role: '',
        expertise: '',
        priority: 0,
        bio: '',
        image_base64: '',
      });
    }
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const payload = {
      ...formData,
      expertise: formData.expertise.split(',').map(s => s.trim()).filter(Boolean),
      priority: Number(formData.priority),
    };

    try {
      if (editingId) {
        await api.updateStaff(editingId, payload);
        toast.success('Staff updated');
      } else {
        await api.createStaff(payload);
        toast.success('Staff created');
      }
      setShowModal(false);
      fetchStaff();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
      toast.error(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await api.deleteStaff(id);
      toast.success('Staff deleted');
      fetchStaff();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image_base64: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const filteredStaff = staff.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (person.role && person.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <PageLayout
      title="Manage Advocates"
      subtitle="Add, edit, and remove legal professionals from the public website."
      heroImage="/hero-staff.jpg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Advocates Directory</h1>
            <p className="text-gray-500">Manage the legal professionals appearing on the public website.</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-jade hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition w-full sm:w-auto"
          >
            <UserPlus size={18} />
            Add Advocate
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search name or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-jade/20 focus:border-jade transition-all"
            />
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-jade" size={40} />
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-100">
            <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No advocates found</h3>
            <p className="text-gray-500 mb-6">
              {staff.length === 0 ? 'Add your first advocate to get started.' : 'No results match your search.'}
            </p>
            {staff.length === 0 && (
              <button
                onClick={() => handleOpenModal()}
                className="bg-jade hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-xl inline-flex items-center gap-2"
              >
                <UserPlus size={18} />
                Add Advocate
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Mobile view: cards */}
            <div className="grid grid-cols-1 md:hidden gap-4">
              {filteredStaff.map((member) => (
                <div key={member.id} className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-jade to-emerald-600 flex items-center justify-center text-white font-bold shadow-md overflow-hidden flex-shrink-0">
                      {member.image_url ? (
                        <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        member.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">{member.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{member.email}</p>
                      <p className="text-xs text-jade font-medium mt-1">{member.role || 'No role'}</p>
                    </div>
                  </div>
                  {member.expertise && member.expertise.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {member.expertise.slice(0, 3).map((exp, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {exp}
                        </span>
                      ))}
                      {member.expertise.length > 3 && (
                        <span className="text-xs text-gray-400">+{member.expertise.length - 3}</span>
                      )}
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>Priority: {member.priority ?? 0}</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full">Active</span>
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleOpenModal(member)}
                      className="p-2 text-jade hover:text-emerald-700"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id, member.name)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop view: table */}
            <div className="hidden md:block bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Advocate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role & Expertise</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStaff.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-jade to-emerald-600 flex items-center justify-center text-white font-bold shadow-md overflow-hidden flex-shrink-0">
                              {member.image_url ? (
                                <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                              ) : (
                                member.name.charAt(0).toUpperCase()
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{member.name}</div>
                              <div className="text-sm text-gray-500">{member.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{member.role || '—'}</div>
                          <div className="text-xs text-gray-500">
                            {member.expertise?.slice(0, 2).join(' · ')}
                            {member.expertise && member.expertise.length > 2 && ' …'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {member.priority ?? 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleOpenModal(member)}
                            className="text-jade hover:text-emerald-700 mr-3"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(member.id, member.name)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Modal for Add/Edit */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-0">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingId ? 'Edit Advocate' : 'Add New Advocate'}
                  </h2>
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

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-jade/20 focus:border-jade"
                      />
                    </div>

                    {/* Email */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-jade/20 focus:border-jade"
                      />
                    </div>

                    {/* Role */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role / Title
                      </label>
                      <input
                        type="text"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        placeholder="e.g., Senior Partner"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-jade/20 focus:border-jade"
                      />
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <input
                        type="number"
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                        min="0"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-jade/20 focus:border-jade"
                      />
                    </div>

                    {/* Expertise (tags) */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expertise (comma separated)
                      </label>
                      <input
                        type="text"
                        value={formData.expertise}
                        onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                        placeholder="Corporate Law, Litigation, IP"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-jade/20 focus:border-jade"
                      />
                    </div>

                    {/* Bio */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bio / Description
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-jade/20 focus:border-jade"
                      />
                    </div>

                    {/* Image upload */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Profile Image
                      </label>
                      <div className="flex items-center gap-4">
                        <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition inline-flex items-center gap-2">
                          <Image size={18} />
                          Choose Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                        {formData.image_base64 && (
                          <img
                            src={formData.image_base64}
                            alt="Preview"
                            className="w-12 h-12 rounded-full object-cover border-2 border-jade"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button
                      type="submit"
                      className="flex-1 bg-jade hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition"
                    >
                      {editingId ? 'Update Advocate' : 'Create Advocate'}
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