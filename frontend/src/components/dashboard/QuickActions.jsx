import { motion } from 'framer-motion';
import { Plus, FolderPlus, UserPlus, Zap } from 'lucide-react';

export default function QuickActions({ onNewTask, onNewProject, onInviteMember }) {
  const actions = [
    { label: 'Create Task', icon: Plus, color: 'bg-primary/10 text-primary', onClick: onNewTask },
    { label: 'New Project', icon: FolderPlus, color: 'bg-blue-500/10 text-blue-500', onClick: onNewProject },
    { label: 'Invite User', icon: UserPlus, color: 'bg-indigo-500/10 text-indigo-500', onClick: onInviteMember },
  ];

  return (
    <div className="p-6 rounded-2xl border border-border/30 bg-surface-low shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Zap size={14} className="text-amber-500 fill-amber-500" />
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Quick Execution</h3>
      </div>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <motion.button
            key={index}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.onClick}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-secondary/20 hover:bg-secondary/40 border border-border/10 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                <action.icon size={16} />
              </div>
              <span className="text-sm font-bold tracking-tight">{action.label}</span>
            </div>
            <Plus size={14} className="opacity-0 group-hover:opacity-40 transition-opacity" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
