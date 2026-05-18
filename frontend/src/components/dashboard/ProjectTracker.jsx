import { motion } from 'framer-motion';
import { Layers, Users, MoreHorizontal, ArrowRight } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function ProjectTracker() {
  const { projects, tasks } = useData();

  const getProjectStats = (projectId) => {
    const projectTasks = tasks.filter(t => t.project?._id === projectId || t.project === projectId);
    const completed = projectTasks.filter(t => t.status === 'done').length;
    const progress = projectTasks.length > 0 ? Math.round((completed / projectTasks.length) * 100) : 0;
    return { total: projectTasks.length, completed, progress };
  };

  return (
    <div className="p-6 rounded-2xl border border-border/40 bg-surface-low shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold">Active Engineering Projects</h3>
          <p className="text-xs text-muted-foreground mt-1">Operational tracking for high-priority initiatives.</p>
        </div>
        <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground">
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/20">
              <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Project Name</th>
              <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Phase</th>
              <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Team</th>
              <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Progress</th>
              <th className="pb-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/10">
            {projects.slice(0, 5).map((project, idx) => {
              const stats = getProjectStats(project._id);
              return (
                <motion.tr 
                  key={project._id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group hover:bg-secondary/20 transition-colors"
                >
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform">
                        <Layers size={16} />
                      </div>
                      <span className="text-sm font-bold tracking-tight">{project.name}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-border/40 bg-secondary/50 text-muted-foreground uppercase tracking-wider">
                      {project.status || 'Active'}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex -space-x-2">
                      {project.members?.slice(0, 3).map((m, i) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-surface-mid border border-background flex items-center justify-center text-[8px] font-bold uppercase" title={m.username}>
                          {m.username?.charAt(0) || '?'}
                        </div>
                      ))}
                      {project.members?.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-secondary border border-background flex items-center justify-center text-[8px] font-bold text-muted-foreground">
                          +{project.members.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-3 w-32">
                      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${stats.progress}%` }}
                          className="h-full bg-primary"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-primary">{stats.progress}%</span>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <button className="p-1.5 opacity-0 group-hover:opacity-100 transition-all text-primary hover:bg-primary/10 rounded-md">
                      <ArrowRight size={14} />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
