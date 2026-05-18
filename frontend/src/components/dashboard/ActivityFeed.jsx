import { motion } from 'framer-motion';
import { CheckCircle, MessageSquare, FileEdit, PlusCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

export default function ActivityFeed() {
  const { tasks, projects } = useData();

  // Combine tasks and projects into activities
  const taskActivities = tasks.slice(-3).map(t => ({
    id: t._id,
    type: 'task',
    text: `Task "${t.title}" was ${t.status === 'done' ? 'completed' : 'created'}`,
    time: formatDistanceToNow(new Date(t.createdAt), { addSuffix: true }),
    icon: t.status === 'done' ? CheckCircle : PlusCircle,
    color: t.status === 'done' ? 'text-green-500' : 'text-blue-500',
    link: '/tasks'
  }));

  const projectActivities = projects.slice(-2).map(p => ({
    id: p._id,
    type: 'project',
    text: `Project "${p.name}" created`,
    time: formatDistanceToNow(new Date(p.createdAt), { addSuffix: true }),
    icon: FileEdit,
    color: 'text-purple-500',
    link: '/projects'
  }));

  const allActivities = [...taskActivities, ...projectActivities].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

  return (
    <div className="glass rounded-2xl p-6 border border-border/40">
      <h3 className="font-semibold text-lg mb-6">Recent Activity</h3>
      <div className="space-y-6">
        {allActivities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No recent activity.</p>
        ) : (
          allActivities.map((activity, i) => (
            <Link key={`${activity.type}-${activity.id}`} to={activity.link}>
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-2 rounded-xl hover:bg-secondary/30 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-card/50 shadow-sm shrink-0 group-hover:scale-110 transition-transform">
                  <activity.icon className={`w-4 h-4 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground/90 truncate group-hover:text-primary transition-colors">{activity.text}</p>
                  <time className="text-xs text-muted-foreground mt-0.5">{activity.time}</time>
                </div>
              </motion.div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
