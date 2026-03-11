import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, BookOpen, MessageSquare, Briefcase, Star, Calendar } from 'lucide-react';
import { api } from '../lib/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface Message {
  id: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    staff: 0,
    insights: 0,
    messages: 0,
    capabilities: 0,
    testimonials: 0,
    caseStudies: 0,
  });
  const [messageChartData, setMessageChartData] = useState<{ date: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [staff, insights, messages, capabilities, testimonials, caseStudies] = await Promise.all([
          api.getStaff().catch(() => []),
          api.getAdminInsights().catch(() => []),
          api.getMessages().catch(() => []),
          api.getCapabilities().catch(() => []),
          api.getTestimonials().catch(() => []),
          api.getCaseStudies().catch(() => []),
        ]);

        setStats({
          staff: staff.length,
          insights: insights.length,
          messages: messages.length,
          capabilities: capabilities.length,
          testimonials: testimonials.length,
          caseStudies: caseStudies.length,
        });

        // Aggregate messages by date for chart
        const messagesByDate: Record<string, number> = {};
        messages.forEach((msg: Message) => {
          const date = new Date(msg.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });
          messagesByDate[date] = (messagesByDate[date] || 0) + 1;
        });

        const chartData = Object.entries(messagesByDate)
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setMessageChartData(chartData);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Staff', value: stats.staff, icon: Users, color: '#00A36C', path: '/manage-staff' },
    { label: 'Insights', value: stats.insights, icon: BookOpen, color: '#3b82f6', path: '/manage-insights' },
    { label: 'Messages', value: stats.messages, icon: MessageSquare, color: '#f59e0b', path: '/manage-messages' },
    { label: 'Capabilities', value: stats.capabilities, icon: Briefcase, color: '#8b5cf6', path: '/manage-capabilities' },
    { label: 'Testimonials', value: stats.testimonials, icon: Star, color: '#ec4899', path: '/manage-testimonials' },
    { label: 'Case Studies', value: stats.caseStudies, icon: Calendar, color: '#14b8a6', path: '/manage-case-studies' },
  ];

  const fadeInUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  return (
    <div className="dashboard-container">
      {/* Hero Banner */}
      <div className="dashboard-hero" style={{ backgroundImage: 'url("/hero-overview.jpg")' }}>
        <div className="hero-overlay" />
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title">Welcome back, Admin</h1>
            <p className="hero-subtitle">Here's what's happening with your site today.</p>
            <div className="hero-date">
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </motion.div>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading-screen">
          <div className="spinner" />
        </div>
      ) : (
        <>
          {/* Stats Grid – Clickable Cards */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="stats-grid"
          >
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Link key={index} to={stat.path} className="stat-card-link">
                  <motion.div variants={fadeInUp} className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                      <Icon size={24} />
                    </div>
                    <div className="stat-info">
                      <h3 className="stat-value">{stat.value}</h3>
                      <p className="stat-label">{stat.label}</p>
                    </div>
                    <div className="stat-trend">
                      <span>Live</span>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </motion.div>

          {/* Messages Over Time Chart */}
          <div className="glass-card" style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Messages Over Time</h2>
            {messageChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={messageChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#00A36C" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="empty-state" style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>
                No messages yet.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}