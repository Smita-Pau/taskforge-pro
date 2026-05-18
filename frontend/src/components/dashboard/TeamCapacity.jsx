import { motion } from 'framer-motion';
import { UserPlus, MoreVertical, Shield } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function TeamCapacity({ onInvite }) {
  const { team, tasks } = useData();

  const getMemberStats = (memberId) => {
    const memberTasks = tasks.filter(t => t.assignee?._id === memberId || t.assignee === memberId);
    const activeTasks = memberTasks.filter(t => t.status !== 'done').length;
    // Utilization based on arbitrary cap of 5 active tasks
    const utilization = Math.min(Math.round((activeTasks / 5) * 100), 100);
    return { activeTasks, utilization };
  };

  return (
    <div className="p-6 rounded-2xl border border-border/40 bg-surface-low shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Team Capacity</h3>
          <p className="text-[10px] text-muted-foreground/60 mt-1 uppercase tracking-tighter">Current workload distribution</p>
        </div>
        <button 
          onClick={onInvite}
          className="p-1.5 hover:bg-primary/10 text-primary rounded-lg transition-colors border border-primary/20"
        >
          <UserPlus size={16} />
        </button>
      </div>

      <div className="space-y-4 flex-1">
        {team.slice(0, 5).map((member, idx) => {
          const stats = getMemberStats(member._id);
          return (
            <motion.div 
              key={member._id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group p-3 rounded-xl border border-border/10 hover:border-primary/20 hover:bg-secondary/10 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground font-bold text-sm border border-border/40 shadow-inner group-hover:scale-110 transition-transform">
                    {member.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-none group-hover:text-primary transition-colors">{member.username}</h4>
                    <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest flex items-center gap-1">
                      <Shield size={8} /> {member.role}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold tracking-tight">{stats.activeTasks} Tasks</span>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Active</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-tighter">
                  <span className="text-muted-foreground">Utilization</span>
                  <span className={stats.utilization > 80 ? 'text-destructive' : 'text-primary'}>
                    {stats.utilization}%
                  </span>
                </div>
                <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.utilization}%` }}
                    className={`h-full ${stats.utilization > 80 ? 'bg-destructive' : 'bg-primary'}`}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
