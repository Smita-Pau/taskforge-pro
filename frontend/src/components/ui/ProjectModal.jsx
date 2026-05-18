import { useState, useEffect } from 'react';
import Modal from './Modal';
import { useData } from '../../context/DataContext';
import { FolderKanban, Users, Info, Settings2 } from 'lucide-react';

export default function ProjectModal({ isOpen, onClose, project = null }) {
  const { createProject, updateProject, team } = useData();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    members: [],
    status: 'Active'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        members: project.members?.map(m => m._id) || [],
        status: project.status || 'Active'
      });
    } else {
      setFormData({
        name: '',
        description: '',
        members: [],
        status: 'Active'
      });
    }
    setError('');
  }, [project, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description) {
      setError('Project identity (name & description) is required');
      return;
    }
    setLoading(true);
    try {
      if (project && project._id) {
        await updateProject(project._id, formData);
      } else {
        await createProject(formData);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleMember = (memberId) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.includes(memberId)
        ? prev.members.filter(id => id !== memberId)
        : [...prev.members, memberId]
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={project?._id ? 'Modify Project Parameters' : 'Launch New Initiative'}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="flex items-center gap-3 text-destructive text-xs font-bold bg-destructive/10 p-4 rounded-xl border border-destructive/20">
            <Info size={16} />
            {error}
          </div>
        )}
        
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <FolderKanban size={12} /> Project Name
          </label>
          <input
            type="text"
            className="w-full bg-background border border-border/40 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/40"
            placeholder="e.g. Q3 Strategic Expansion"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Info size={12} /> Executive Summary
          </label>
          <textarea
            className="w-full bg-background border border-border/40 rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary/50 transition-all min-h-[100px] resize-none"
            placeholder="Outline the mission and objectives..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Settings2 size={12} /> Operational Status
          </label>
          <div className="grid grid-cols-2 gap-3">
            {['Active', 'In Progress', 'Near Completion', 'Completed'].map(status => (
              <button
                key={status}
                type="button"
                onClick={() => setFormData({ ...formData, status })}
                className={`
                  px-4 py-2 text-[11px] font-bold rounded-lg border transition-all
                  ${formData.status === status 
                    ? 'bg-foreground text-background border-foreground shadow-md' 
                    : 'bg-background text-muted-foreground border-border/40 hover:border-foreground/20'}
                `}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Users size={12} /> Project Stakeholders
          </label>
          <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto p-2 border border-border/20 rounded-xl bg-background/50">
            {team.map(member => (
              <button
                key={member._id}
                type="button"
                onClick={() => toggleMember(member._id)}
                className={`
                  px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all
                  ${formData.members.includes(member._id)
                    ? 'bg-primary/20 text-primary border-primary/40'
                    : 'bg-secondary text-muted-foreground border-border/40 hover:border-primary/20'}
                `}
              >
                {member.username}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-8 border-t border-border/20">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-secondary rounded-lg transition-all"
          >
            Discard
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 bg-foreground text-background rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-all shadow-xl shadow-black/20"
          >
            {loading ? 'Executing...' : project?._id ? 'Commit Changes' : 'Initialize Project'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
