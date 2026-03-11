import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import PageLayout from '../components/PageLayout';
import { Mail, Trash2, Download, Loader2, Search, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export default function ManageMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await api.getMessages();
      setMessages(data || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    try {
      await api.deleteContactMessage(id);
      toast.success('Message deleted');
      fetchMessages();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const exportToCSV = () => {
    if (messages.length === 0) return;
    const headers = ['Name', 'Email', 'Message', 'Date'];
    const rows = messages.map(m => [
      `"${m.name.replace(/"/g, '""')}"`,
      `"${m.email.replace(/"/g, '""')}"`,
      `"${m.message.replace(/"/g, '""')}"`,
      `"${new Date(m.created_at).toLocaleString()}"`
    ]);
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `messages-${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filtered = messages.filter(msg =>
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageLayout
      title="Client Inquiries"
      subtitle="Messages from the contact form"
      heroImage="/hero-inquiries.jpg"   // Make sure this file exists in public/
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
            <p className="text-gray-500">{messages.length} total inquiries</p>
          </div>
          <button
            onClick={exportToCSV}
            disabled={messages.length === 0}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50 w-full sm:w-auto"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-jade/20 focus:border-jade transition-all"
            />
          </div>
        </div>

        {/* Messages */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-jade" size={40} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-100">
            <Mail size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No messages found</h3>
            <p className="text-gray-500">
              {messages.length === 0 ? 'No inquiries yet.' : 'No results match your search.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List column */}
            <div className="lg:col-span-1 space-y-3 max-h-[70vh] overflow-y-auto pr-2">
              {filtered.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    selectedMessage?.id === msg.id
                      ? 'bg-jade/5 border-jade'
                      : 'bg-white border-gray-200 hover:border-jade/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-gray-800 truncate">{msg.name}</h4>
                    <span className="text-xs text-gray-400">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{msg.email}</p>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1">{msg.message}</p>
                </div>
              ))}
            </div>

            {/* Detail column */}
            <div className="lg:col-span-2">
              {selectedMessage ? (
                <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{selectedMessage.name}</h2>
                      <a href={`mailto:${selectedMessage.email}`} className="text-jade hover:underline">
                        {selectedMessage.email}
                      </a>
                    </div>
                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="p-2 text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Calendar size={14} />
                    <span>Received on {new Date(selectedMessage.created_at).toLocaleString()}</span>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                  <div className="mt-6">
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="inline-flex items-center gap-2 bg-jade hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-xl transition"
                    >
                      <Mail size={18} />
                      Reply via Email
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-200 h-full flex items-center justify-center">
                  <div>
                    <Mail size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Select a message to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}