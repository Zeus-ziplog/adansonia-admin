import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import PageLayout from '../components/PageLayout';
import { Edit2, Trash2, UserPlus, X, Briefcase, Loader2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

interface Capability {
  id: string;
  title: string;
  description: string;
  icon?: string;
  priority?: number;
}

export default function ManageCapabilities() {
  const [items, setItems] = useState<Capability[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    priority: 0,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await api.getCapabilities();
      setItems(data.sort((a: Capability, b: Capability) => (a.priority || 0) - (b.priority || 0)));
    } catch (err: any) {
      toast.error(err.message || 'Failed to load capabilities');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item?: Capability) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        title: item.title,
        description: item.description,
        icon: item.icon || '',
        priority: item.priority || 0,
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', description: '', icon: '', priority: 0 });
    }
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.updateCapability(editingId, formData);
        toast.success('Capability updated');
      } else {
        await api.createCapability(formData);
        toast.success('Capability created');
      }
      setShowModal(false);
      fetchItems();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
      toast.error(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete capability "${title}"?`)) return;
    try {
      await api.deleteCapability(id);
      toast.success('Capability deleted');
      fetchItems();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const filtered = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <PageLayout
      title="Manage Capabilities"
      subtitle="Practice areas and services offered by the firm"
      heroImage="/hero-capabilities.jpg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Capabilities</h1>
            <p className="text-gray-500">Manage practice areas and services</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-jade hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition w-full sm:w-auto"
          >
            <UserPlus size={18} />
            Add Capability
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by title or description..."
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
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-100">
            <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No capabilities found</h3>
            <p className="text-gray-500 mb-6">
              {items.length === 0 ? 'Add your first capability.' : 'No results match your search.'}
            </p>
            {items.length === 0 && (
              <button
                onClick={() => handleOpenModal()}
                className="bg-jade hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-xl inline-flex items-center gap-2"
              >
                <UserPlus size={18} />
                Add Capability
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Mobile view: cards */}
            <div className="grid grid-cols-1 md:hidden gap-4">
              {filtered.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-jade/10 flex items-center justify-center text-jade text-xl flex-shrink-0">
                      {item.icon ? item.icon.charAt(0).toUpperCase() : '⚖️'}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 truncate">{item.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>Priority: {item.priority ?? 0}</span>
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="p-2 text-jade hover:text-emerald-700"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icon</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filtered.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-10 h-10 rounded-lg bg-jade/10 flex items-center justify-center text-jade text-xl">
                            {item.icon ? item.icon.charAt(0).toUpperCase() : '⚖️'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{item.title}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 max-w-xs truncate">{item.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.priority ?? 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleOpenModal(item)}
                            className="text-jade hover:text-emerald-700 mr-3"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.title)}
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

        {/* Modal (unchanged, already responsive) */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto mx-4 sm:mx-0">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingId ? 'Edit Capability' : 'Add Capability'}
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
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-jade/20 focus:border-jade"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-jade/20 focus:border-jade"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Icon (name)
                      </label>
                      <input
                        type="text"
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        placeholder="e.g., Scale"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-jade/20 focus:border-jade"
                      />
                    </div>
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
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button
                      type="submit"
                      className="flex-1 bg-jade hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition"
                    >
                      {editingId ? 'Update' : 'Create'}
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