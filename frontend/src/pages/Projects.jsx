import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderKanban, 
  ArrowRight, 
  MoreVertical, 
  Edit2, 
  Trash2,
  Calendar,
  Layers,
  Search,
  Filter
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import ProjectModal from '../components/ui/ProjectModal';

export default function Projects() {
  const { projects, deleteProject } = useData();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
    setActiveMenu(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteProject(id);
    }
    setActiveMenu(null);
  };

  return (
    <div className="theme-projects space-y-8 pb-20 bg-subtle-mesh min-h-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers size={14} className="text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Workspace</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Projects</h1>
          <p className="text-muted-foreground text-sm">Manage initiatives and track multi-phase progress.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2"
        >
          <FolderKanban size={16} /> Create Project
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 py-2 border-y border-border/40">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input 
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-low border border-border/40 rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-1 focus:ring-primary/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => alert('Filter options coming soon!')}
            className="p-2 rounded-lg bg-surface-low border border-border/40 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Filter size={16} />
          </button>
          <div className="h-6 w-px bg-border/40" />
          <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">{filteredProjects.length} Projects</span>
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group relative flex flex-col p-6 rounded-2xl bg-surface-low border border-border/40 hover:border-primary/40 transition-all cursor-pointer"
            onClick={() => handleEdit(project)}
          >
            {/* Context Menu Button */}
            {user?.role === 'Admin' && (
              <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(activeMenu === project._id ? null : project._id);
                  }}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                >
                  <MoreVertical size={16} />
                </button>
                
                <AnimatePresence>
                  {activeMenu === project._id && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute right-0 mt-2 w-48 bg-surface-high border border-border/40 rounded-xl shadow-2xl z-50 overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button onClick={() => handleEdit(project)} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-medium hover:bg-secondary transition-colors text-left">
                        <Edit2 size={14} /> Edit Project
                      </button>
                      <button onClick={() => handleDelete(project._id)} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors text-left">
                        <Trash2 size={14} /> Archive Project
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary group-hover:scale-110 transition-transform">
                  <Layers size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-none group-hover:text-primary transition-colors">{project.name}</h3>
                  <div className="flex items-center gap-2 mt-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    <Calendar size={10} />
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {project.description}
              </p>

              {/* Progress Bar */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-[11px] font-bold">
                  <span className="text-muted-foreground uppercase tracking-widest">Progress</span>
                  <span className="text-primary">{project.progress || 0}%</span>
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress || 0}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-border/40">
              <div className="flex -space-x-2">
                {project.members && project.members.slice(0, 4).map((member, i) => (
                  <div key={member._id || i} className="w-8 h-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-[10px] font-bold uppercase ring-1 ring-border/20" title={member.username}>
                    {member.username ? member.username.charAt(0) : '?'}
                  </div>
                ))}
                {project.members?.length > 4 && (
                  <div className="w-8 h-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground ring-1 ring-border/20">
                    +{project.members.length - 4}
                  </div>
                )}
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(project);
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-primary hover:gap-2 transition-all"
              >
                Overview <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        project={editingProject} 
      />
    </div>
  );
}
