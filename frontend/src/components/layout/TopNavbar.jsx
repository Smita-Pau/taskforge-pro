import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  LogOut, 
  User, 
  Sun, 
  Moon,
  HelpCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function TopNavbar({ onSearchClick }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="h-16 border-b border-border/40 bg-background/50 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-6 flex-1">
        <button 
          onClick={onSearchClick}
          className="relative w-full max-w-md hidden md:block group text-left"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors" size={16} />
          <div className="w-full bg-secondary/30 border border-border/40 rounded-lg pl-10 pr-4 py-2 text-xs font-medium text-muted-foreground/60 group-hover:bg-secondary/50 transition-all flex items-center justify-between">
            <span>Search workspace...</span>
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-border/40 bg-background text-[10px] font-bold">
              <span>⌘</span>
              <span>K</span>
            </div>
          </div>
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 border-r border-border/40 pr-4 mr-2">
          <button 
            onClick={() => alert('No new notifications')}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all relative"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-background"></span>
          </button>
          <button 
            onClick={() => alert('Help center coming soon!')}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all hidden sm:block"
          >
            <HelpCircle size={18} />
          </button>
          <button 
            onClick={toggleTheme}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <div className="relative">
          <button 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-3 p-1 rounded-full hover:bg-secondary transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-primary/20">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="hidden lg:block text-left pr-2">
              <p className="text-xs font-bold leading-none">{user?.username}</p>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tighter font-bold">{user?.role}</p>
            </div>
          </button>

          <AnimatePresence>
            {isUserMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-56 bg-surface-high border border-border/40 rounded-xl shadow-2xl z-50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-border/20 bg-secondary/30">
                  <p className="text-xs font-bold truncate">{user?.email}</p>
                </div>
                <div className="p-1">
                  <Link to="/settings" onClick={() => setIsUserMenuOpen(false)}>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium hover:bg-secondary rounded-lg transition-colors text-left">
                      <User size={14} /> Profile Settings
                    </button>
                  </Link>
                  <button 
                    onClick={() => alert('Documentation coming soon!')}
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium hover:bg-secondary rounded-lg transition-colors text-left"
                  >
                    <HelpCircle size={14} /> Documentation
                  </button>
                  <div className="h-px bg-border/20 my-1" />
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors text-left"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
