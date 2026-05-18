import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, ArrowUpRight, Target } from 'lucide-react';

export default function HeroSection({ stats }) {
  const { user } = useAuth();
  const progress = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-10 rounded-[2rem] bg-surface-low border border-border/30 relative overflow-hidden shadow-2xl"
    >
      {/* Premium Background Effects */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none animate-pulse"></div>
      <div className="absolute inset-0 bg-subtle-mesh opacity-30 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-6 w-fit">
            <Target size={12} /> Execution Mode Active
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 leading-[1.1]">
            Welcome back, <span className="text-primary">{user?.username?.split(' ')[0] || 'User'}</span>.
          </h1>
          <p className="text-muted-foreground text-lg font-medium leading-relaxed">
            You have <span className="text-foreground font-bold">{stats.inProgress + stats.blocked} active work items</span> today. Platform stability is <span className="text-green-500 font-bold">99.9%</span>.
          </p>
        </div>
        
        <div className="flex items-center gap-6 p-6 rounded-[1.5rem] bg-secondary/30 backdrop-blur-xl border border-border/40 shadow-xl group hover:border-primary/40 transition-all">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full transform -rotate-90 group-hover:scale-105 transition-transform duration-500">
              <circle cx="48" cy="48" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/20" />
              <circle 
                cx="48" cy="48" r="42" fill="none" stroke="currentColor" strokeWidth="8" 
                className="text-primary transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * progress) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black tracking-tighter leading-none">{progress}%</span>
              <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Goal</span>
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-lg text-foreground flex items-center gap-2">
              Sprint Velocity <ArrowUpRight size={16} className="text-primary" />
            </h4>
            <p className="text-xs text-muted-foreground font-medium">{stats.completed || 0} tasks resolved in current cycle.</p>
            <div className="pt-2">
              <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-500 text-[9px] font-black uppercase tracking-widest">
                On Track
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
