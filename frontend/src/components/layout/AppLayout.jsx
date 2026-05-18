import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import ParticlesBackground from './ParticlesBackground';
import SearchModal from '../ui/SearchModal';

export default function AppLayout({ children }) {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const getThemeClass = (path) => {
    if (path === '/dashboard') return 'theme-dashboard';
    if (path === '/projects') return 'theme-projects';
    if (path === '/tasks') return 'theme-tasks';
    if (path === '/team') return 'theme-team';
    if (path === '/settings') return 'theme-settings';
    return '';
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`flex h-screen overflow-hidden bg-background transition-colors duration-500 ${getThemeClass(location.pathname)}`}>
      <ParticlesBackground />
      <Sidebar />
      <div className="flex-1 flex flex-col relative z-10">
        <TopNavbar onSearchClick={() => setIsSearchOpen(true)} />
        <main className="flex-1 overflow-auto p-8 scroll-smooth custom-scrollbar bg-subtle-mesh">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="h-full w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
