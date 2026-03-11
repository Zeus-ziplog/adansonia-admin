import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  heroImage: string;
}

export default function PageLayout({ children, title, subtitle, heroImage }: PageLayoutProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Sticky Header */}
      <motion.header
        className={`sticky-header ${scrolled ? 'visible' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: scrolled ? 0 : -100 }}
        transition={{ duration: 0.3 }}
      >
        <div className="sticky-logo">
          <img src="/icon.png" alt="Adansonia" />
          <span>ADANSONIA</span>
        </div>
      </motion.header>

      <div className="page-content">
        {/* Hero Section */}
        <section
          className="page-hero"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="hero-overlay" />
          <div className="hero-content">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="hero-title">{title}</h1>
              {subtitle && <p className="hero-subtitle">{subtitle}</p>}
            </motion.div>
          </div>
        </section>

        {/* Page Content */}
        <div className="page-inner">{children}</div>
      </div>
    </>
  );
}