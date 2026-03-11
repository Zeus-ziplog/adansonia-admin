import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import PageLayout from '../components/PageLayout';
import { Edit2, Trash2, UserPlus, X, Calendar, Image, Loader2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

interface Insight {
  id: string;
  title: string;
  content: string;
  published_date: string;
  published: boolean;
  category?: string;
  tags?: string[];
  image_url?: string;
  created_at: string;
}

export default function ManageInsights() {
  const [items, setItems] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    published_date: new Date().toISOString().split('T')[0],
    published: true,
    category: '',
    tags: '',
    image_base64: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await api.getAdminInsights();
      setItems(data || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load insights');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item?: Insight) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        title: item.title,
        content: item.content,
        published_date: item.published_date,
        published: item.published,
        category: item.category || '',
        tags: item.tags ? item.tags.join(', ') : '',
        image_base64: '',
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        content: '',
        published_date: new Date().toISOString().split('T')[0],
        published: true,
        category: '',
        tags: '',
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
      tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean),
    };

    try {
      if (editingId) {
        await api.updateInsight(editingId, payload);
        toast.success('Insight updated');
      } else {
        await api.createInsight(payload);
        toast.success('Insight created');
      }
      setShowModal(false);
      fetchItems();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
      toast.error(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await api.deleteInsight(id);
      toast.success('Insight deleted');
      fetchItems();
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

  const filtered = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <PageLayout
      title="Manage Insights"
      subtitle="Articles, news, and publications"
      heroImage="/hero-insights.jpg"   // Ensure this file exists in public/
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Insights</h1>
            <p className="text-gray-500">Manage articles and publications</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-jade hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition w-full sm:w-auto"
          >
            <UserPlus size={18} />
            Add Insight
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by title or category..."
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
            <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No insights found</h3>
            <p className="text-gray-500 mb-6">
              {items.length === 0 ? 'Add your first insight.' : 'No results match your search.'}
            </p>
            {items.length === 0 && (
              <button
                onClick={() => handleOpenModal()}
                className="bg-jade hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-xl inline-flex items-center gap-2"
              >
                <UserPlus size={18} />
                Add Insight
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition">
                {item.image_url && (
                  <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      item.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.published ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(item.published_date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{item.title}</h3>
                  {item.category && (
                    <p className="text-sm text-jade font-medium mb-2">{item.category}</p>
                  )}
                  <p className="text-gray-600 line-clamp-3 mb-4">{item.content}</p>
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.tags.map(tag => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">#{tag}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-end gap-2">
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
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-0">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingId ? 'Edit Insight' : 'Add Insight'}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Published Date
                      </label>
                      <input
                        type="date"
                        value={formData.published_date}
                        onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-jade/20 focus:border-jade"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="e.g., News"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-jade/20 focus:border-jade"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="law, business, corporate"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-jade/20 focus:border-jade"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      required
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-jade/20 focus:border-jade"
                    />
                  </div>
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
                        className="w-12 h-12 rounded object-cover border-2 border-jade"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="published"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="rounded border-gray-300 text-jade focus:ring-jade"
                    />
                    <label htmlFor="published" className="text-sm text-gray-700">Published (visible on site)</label>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button
                      type="submit"
                      className="flex-1 bg-jade hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition"
                    >
                      {editingId ? 'Update Insight' : 'Create Insight'}
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