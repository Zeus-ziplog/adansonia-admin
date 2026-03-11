import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import PageLayout from '../components/PageLayout';
import { Edit2, Trash2, UserPlus, X, Star, Loader2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar?: string;
  created_at: string;
}

export default function ManageTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    quote: '',
    avatar: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await api.getTestimonials();
      setItems(data || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item?: Testimonial) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        name: item.name,
        role: item.role || '',
        quote: item.quote,
        avatar: item.avatar || '',
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', role: '', quote: '', avatar: '' });
    }
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.updateTestimonial(editingId, formData);
        toast.success('Testimonial updated');
      } else {
        await api.createTestimonial(formData);
        toast.success('Testimonial created');
      }
      setShowModal(false);
      fetchItems();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
      toast.error(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete testimonial from ${name}?`)) return;
    try {
      await api.deleteTestimonial(id);
      toast.success('Testimonial deleted');
      fetchItems();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.quote.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageLayout
      title="Manage Testimonials"
      subtitle="Client feedback and reviews"
      heroImage="/hero-testimonials.jpg"   // Ensure this file exists in public/
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Testimonials</h1>
            <p className="text-gray-500">Manage client testimonials</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-jade hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition w-full sm:w-auto"
          >
            <UserPlus size={18} />
            Add Testimonial
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or quote..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-jade/20 focus:border-jade transition-all"
            />
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-jade" size={40} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-100">
            <Star size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No testimonials found</h3>
            <p className="text-gray-500 mb-6">
              {items.length === 0 ? 'Add your first testimonial.' : 'No results match your search.'}
            </p>
            {items.length === 0 && (
              <button
                onClick={() => handleOpenModal()}
                className="bg-jade hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-xl inline-flex items-center gap-2"
              >
                <UserPlus size={18} />
                Add Testimonial
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-jade to-emerald-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {item.avatar ? (
                      <img src={item.avatar} alt={item.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      item.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.role || 'Client'}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic mb-4">"{item.quote}"</p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="p-2 text-jade hover:text-emerald-700"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.name)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto mx-4 sm:mx-0">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingId ? 'Edit Testimonial' : 'Add Testimonial'}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-jade/20 focus:border-jade"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role / Title
                    </label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="e.g., CEO, Client"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-jade/20 focus:border-jade"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Testimonial <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.quote}
                      onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                      required
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-jade/20 focus:border-jade"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Avatar URL (optional)
                    </label>
                    <input
                      type="url"
                      value={formData.avatar}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-jade/20 focus:border-jade"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button
                      type="submit"
                      className="flex-1 bg-jade hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition"
                    >
                      {editingId ? 'Update Testimonial' : 'Create Testimonial'}
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