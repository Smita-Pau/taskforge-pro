import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Mail, 
  Shield, 
  MoreVertical, 
  Trash2, 
  ShieldCheck, 
  ShieldAlert,
  Search,
  UserPlus,
  ArrowUpRight,
  Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import InviteMemberModal from '../components/ui/InviteMemberModal';

export default function Team() {
  const { team, tasks, updateUserRole, removeUser } = useData();
  const { user: currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTeam = team.filter(m => 
    m.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMemberWorkload = (memberId) => {
    const memberTasks = tasks.filter(t => t.assignee?._id === memberId || t.assignee === memberId);
    const activeTasks = memberTasks.filter(t => t.status !== 'done').length;
    const utilization = Math.min(Math.round((activeTasks / 5) * 100), 100);
    return { activeTasks, utilization };
  };

  const handleRoleUpdate = async (id, role) => {
    await updateUserRole(id, role);
    setActiveMenu(null);
  };

  const handleRemove = async (id) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      await removeUser(id);
    }
    setActiveMenu(null);
  };

  return (
    <div className="theme-team space-y-8 pb-20 bg-subtle-mesh min-h-full px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users size={14} className="text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Collaboration</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Team Management</h1>
          <p className="text-muted-foreground text-sm font-medium">Manage workspace permissions and view active members.</p>
        </div>
        {currentUser?.role === 'Admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2"
          >
            <UserPlus size={16} /> Invite Member
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 py-2 border-y border-border/40">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input 
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-low border border-border/40 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium"
          />
        </div>
        <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">{filteredTeam.length} Members</span>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeam.map((member, index) => {
          const workload = getMemberWorkload(member._id);
          return (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group relative bg-surface-low border border-border/40 p-6 rounded-[2rem] hover:border-primary/40 transition-all shadow-sm"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-foreground font-bold text-xl shadow-inner border border-border/40 group-hover:scale-105 transition-transform">
                    {member.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{member.username}</h3>
                    <div className="flex items-center text-xs text-muted-foreground mt-1.5 font-medium">
                      <Mail size={12} className="mr-1.5 opacity-60" />
                      {member.email}
                    </div>
                  </div>
                </div>
                
                {currentUser?.role === 'Admin' && member._id !== currentUser._id && (
                  <div className="relative">
                    <button 
                      onClick={() => setActiveMenu(activeMenu === member._id ? null : member._id)}
                      className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                    >
                      <MoreVertical size={16} />
                    </button>
                    
                    <AnimatePresence>
                      {activeMenu === member._id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-52 bg-surface-high border border-border/40 rounded-xl shadow-2xl z-50 overflow-hidden"
                        >
                          <button onClick={() => handleRoleUpdate(member._id, member.role === 'Admin' ? 'Member' : 'Admin')} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-medium hover:bg-secondary transition-colors text-left">
                            {member.role === 'Admin' ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
                            {member.role === 'Admin' ? 'Revoke Admin' : 'Make Admin'}
                          </button>
                          <button onClick={() => handleRemove(member._id)} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors text-left">
                            <Trash2 size={14} /> Remove Member
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Workload Section */}
              <div className="space-y-3 mb-6 p-4 rounded-2xl bg-secondary/20 border border-border/10">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-muted-foreground">Workload Status</span>
                  <span className={workload.utilization > 80 ? 'text-destructive' : 'text-primary'}>
                    {workload.utilization}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${workload.utilization}%` }}
                    className={`h-full ${workload.utilization > 80 ? 'bg-destructive' : 'bg-primary'}`}
                  />
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60">
                  <Activity size={10} /> {workload.activeTasks} Active Tasks
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-border/20">
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded-md ${member.role === 'Admin' ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                    <Shield size={12} />
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${member.role === 'Admin' ? 'text-primary' : 'text-muted-foreground'}`}>
                    {member.role}
                  </span>
                </div>
                
                {member._id === currentUser?._id ? (
                  <span className="text-[10px] font-bold bg-secondary px-2.5 py-1 rounded-full uppercase tracking-tighter text-muted-foreground border border-border/40">You</span>
                ) : (
                  <div 
                    onClick={() => alert(`Viewing profile for ${member.username} coming soon!`)}
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-tighter text-primary opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    Profile <ArrowUpRight size={10} />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <InviteMemberModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
