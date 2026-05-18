import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  BarChart3,
  Users,
  ShieldAlert,
  Calendar
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { format, subDays, isSameDay } from 'date-fns';

import HeroSection from '../components/dashboard/HeroSection';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import QuickActions from '../components/dashboard/QuickActions';
import MiniTaskBoard from '../components/dashboard/MiniTaskBoard';
import ProjectTracker from '../components/dashboard/ProjectTracker';
import TeamCapacity from '../components/dashboard/TeamCapacity';
import { VelocityChart, DistributionChart } from '../components/dashboard/AdvancedCharts';
import TaskModal from '../components/ui/TaskModal';
import ProjectModal from '../components/ui/ProjectModal';
import InviteMemberModal from '../components/ui/InviteMemberModal';

export default function Dashboard() {
  const { tasks, projects, team } = useData();
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0, overdue: 0, blocked: 0 });
  const [pieData, setPieData] = useState([]);
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Compute stats and pie data dynamically
  useEffect(() => {
    const done = tasks.filter(t => t.status === 'done').length;
    const inProg = tasks.filter(t => t.status === 'in-progress').length;
    const todo = tasks.filter(t => t.status === 'todo').length;
    const review = tasks.filter(t => t.status === 'review').length;
    const blocked = tasks.filter(t => t.status === 'blocked').length;
    
    const now = new Date();
    const overdueCount = tasks.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'done').length;

    setStats({
      total: tasks.length,
      completed: done,
      inProgress: inProg,
      overdue: overdueCount,
      blocked: blocked
    });

    setPieData([
      { name: 'Done', value: done },
      { name: 'Progress', value: inProg },
      { name: 'Review', value: review },
      { name: 'Todo', value: todo },
      { name: 'Blocked', value: blocked },
    ].filter(item => item.value > 0));
  }, [tasks]);

  // Compute Velocity Chart Data dynamically
  const velocityData = useMemo(() => {
    const days = [...Array(7)].map((_, i) => subDays(new Date(), 6 - i));
    return days.map(day => {
      const completedOnDay = tasks.filter(t => t.status === 'done' && t.completedAt && isSameDay(new Date(t.completedAt), day)).length;
      const addedOnDay = tasks.filter(t => isSameDay(new Date(t.createdAt), day)).length;
      return {
        name: format(day, 'EEE'),
        completed: completedOnDay,
        added: addedOnDay
      };
    });
  }, [tasks]);

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleNewTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="theme-dashboard space-y-10 pb-20 max-w-[1600px] mx-auto px-6 lg:px-10">
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -ml-64 -mb-64" />
      </div>

      <HeroSection stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Total Tasks", value: stats.total, icon: Activity, sub: "Global backlog", trend: `+${tasks.filter(t => isSameDay(new Date(t.createdAt), new Date())).length} today`, up: true },
              { title: "Active Projects", value: projects.length, icon: BarChart3, sub: "Operational streams", trend: "Stable", up: null },
              { title: "Team Load", value: `${team.length}/12`, icon: Users, sub: "Resource usage", trend: "Balanced", up: true },
              { title: "Overdue Items", value: stats.overdue, icon: Clock, sub: "Immediate attention", trend: stats.overdue > 0 ? "Critical" : "Clear", up: stats.overdue > 0 ? false : null }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-5 rounded-2xl border border-border/30 bg-surface-low hover:bg-surface-mid transition-all group shadow-sm hover:shadow-md"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 rounded-xl bg-secondary/50 group-hover:bg-primary/10 transition-colors border border-border/20">
                    <stat.icon size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  {stat.trend && (
                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      stat.up === true ? 'bg-green-500/10 text-green-500' : 
                      stat.up === false ? 'bg-destructive/10 text-destructive' : 
                      'bg-secondary text-muted-foreground'
                    }`}>
                      {stat.trend}
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-extrabold tracking-tight">{stat.value}</h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em]">{stat.title}</p>
                  <p className="text-[10px] text-muted-foreground/50 font-medium">{stat.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <ProjectTracker />

          <div className="p-8 rounded-3xl border border-border/30 bg-surface-low shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-lg font-bold">Engineering Velocity</h3>
                <p className="text-xs text-muted-foreground mt-1">Dynamic tracking of output vs backlog growth (Last 7 Days).</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-primary">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-sm shadow-primary/40" /> Completed
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <div className="w-2.5 h-2.5 rounded-full bg-muted shadow-sm" /> Added
                </div>
              </div>
            </div>
            <div className="h-[350px]">
              <VelocityChart data={velocityData} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <TeamCapacity onInvite={() => setIsInviteModalOpen(true)} />

          <div className="p-6 rounded-2xl border border-border/30 bg-surface-low shadow-sm">
            <h3 className="font-bold mb-8 flex items-center gap-2 text-sm uppercase tracking-widest text-muted-foreground">
              Work Distribution
            </h3>
            <div className="h-[220px] relative flex items-center justify-center mb-10">
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-extrabold tracking-tighter">{stats.total}</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">Items</span>
              </div>
              <DistributionChart data={pieData} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {pieData.map((item, i) => (
                <div key={i} className="flex flex-col p-3 rounded-xl bg-secondary/20 border border-border/10">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{item.name}</span>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold leading-none">{item.value}</span>
                    <span className="text-[10px] font-bold text-primary">{stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ActivityFeed />
          <QuickActions 
            onNewTask={handleNewTask}
            onNewProject={() => setIsProjectModalOpen(true)}
            onInviteMember={() => setIsInviteModalOpen(true)}
          />
        </div>
      </div>

      <TaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
        task={editingTask}
      />
      <ProjectModal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} />
      <InviteMemberModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} />
    </div>
  );
}
