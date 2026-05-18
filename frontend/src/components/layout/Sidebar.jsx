import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  FolderKanban, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Users,
  Command
} from 'lucide-react';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/projects', icon: FolderKanban, label: 'Projects' },
    { path: '/tasks', icon: CheckSquare, label: 'Task Board' },
    { path: '/team', icon: Users, label: 'Team' },
  ];

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      className="h-screen bg-background border-r border-border/40 relative flex flex-col z-20 transition-all duration-300 ease-in-out"
    >
      {/* Brand */}
      <div className="h-16 flex items-center px-6 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Command size={18} className="text-white" />
          </div>
          {!collapsed && (
            <span className="font-bold text-lg tracking-tight">TaskForge</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <div className={`
                flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative
                ${isActive 
                  ? 'bg-secondary text-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}
              `}>
                <item.icon size={18} className={`${isActive ? 'text-primary' : 'group-hover:text-foreground'}`} />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-4 bg-primary rounded-r-full"
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Settings */}
      <div className="p-4 border-t border-border/40 space-y-4">
        <Link to="/settings">
          <div className={`
            flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
            ${location.pathname === '/settings' 
              ? 'bg-secondary text-foreground' 
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}
            ${collapsed ? 'justify-center' : ''}
          `}>
            <Settings size={18} />
            {!collapsed && <span className="text-sm font-medium">Settings</span>}
          </div>
        </Link>
        
        {!collapsed && (
          <div className="px-3 py-4 rounded-xl bg-surface-low border border-border/40">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Pro Plan</p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">Upgrade for advanced analytics and unlimited projects.</p>
            <button 
              onClick={() => alert('Rocket Launch Impending: Enterprise features are currently being provisioned for your workspace. Expected arrival: Q3 2026.')}
              className="w-full py-2 bg-foreground text-background text-xs font-bold rounded-lg hover:opacity-90 transition-opacity"
            >
              Upgrade Now
            </button>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-background border border-border rounded-full p-1 hover:bg-secondary transition-colors shadow-sm z-50"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </motion.aside>
  );
}
