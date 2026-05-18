import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, FolderKanban, CheckSquare, Users, Command } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const { projects, tasks, team } = useData();
  const navigate = useNavigate();

  const results = {
    projects: projects.filter(p => p.name.toLowerCase().includes(query.toLowerCase())),
    tasks: tasks.filter(t => t.title.toLowerCase().includes(query.toLowerCase())),
    users: team.filter(u => u.username.toLowerCase().includes(query.toLowerCase()))
  };

  const hasResults = results.projects.length > 0 || results.tasks.length > 0 || results.users.length > 0;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-2xl bg-surface-high border border-border/40 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center gap-4 p-4 border-b border-border/20">
            <Search className="text-muted-foreground" size={20} />
            <input 
              autoFocus
              placeholder="Search anything... (projects, tasks, people)"
              className="flex-1 bg-transparent border-none outline-none text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-secondary text-[10px] font-bold text-muted-foreground">
              <span className="text-xs">ESC</span>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X size={20} />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
            {query.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4 opacity-40">
                  <Command size={24} />
                </div>
                <p className="text-sm text-muted-foreground">Type to search projects, tasks, and team members.</p>
              </div>
            ) : !hasResults ? (
              <div className="py-20 text-center">
                <p className="text-sm text-muted-foreground">No results found for "{query}"</p>
              </div>
            ) : (
              <div className="space-y-4 p-2">
                {results.projects.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 px-2">Projects</h4>
                    <div className="space-y-1">
                      {results.projects.map(p => (
                        <button 
                          key={p._id}
                          onClick={() => { navigate('/projects'); onClose(); }}
                          className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors text-left group"
                        >
                          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                            <FolderKanban size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-bold group-hover:text-primary transition-colors">{p.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate max-w-[400px]">{p.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {results.tasks.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 px-2">Tasks</h4>
                    <div className="space-y-1">
                      {results.tasks.map(t => (
                        <button 
                          key={t._id}
                          onClick={() => { navigate('/tasks'); onClose(); }}
                          className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors text-left group"
                        >
                          <div className="w-8 h-8 rounded bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                            <CheckSquare size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-bold group-hover:text-primary transition-colors">{t.title}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t.status}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {results.users.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 px-2">People</h4>
                    <div className="space-y-1">
                      {results.users.map(u => (
                        <button 
                          key={u._id}
                          onClick={() => { navigate('/team'); onClose(); }}
                          className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors text-left group"
                        >
                          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground font-bold text-xs border border-border/40">
                            {u.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold group-hover:text-primary transition-colors">{u.username}</p>
                            <p className="text-[10px] text-muted-foreground">{u.email}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-3 bg-secondary/30 border-t border-border/20 flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-6">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><Command size={10} /> Enter to select</span>
              <span className="flex items-center gap-1">↑↓ to navigate</span>
            </div>
            <span>TaskForge Search v1.0</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
