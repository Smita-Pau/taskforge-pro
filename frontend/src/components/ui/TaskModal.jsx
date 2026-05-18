import { useState, useEffect } from 'react';
import Modal from './Modal';
import { useData } from '../../context/DataContext';
import { Calendar, Tag, User, Layers, Info } from 'lucide-react';

export default function TaskModal({ isOpen, onClose, task = null, defaultProjectId = '', defaultStatus = 'todo' }) {
  const { createTask, updateTask, projects, team } = useData();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'Medium',
    project: '',
    assignee: '',
    dueDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'Medium',
        project: task.project?._id || task.project || '',
        assignee: task.assignee?._id || task.assignee || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: defaultStatus,
        priority: 'Medium',
        project: defaultProjectId || (projects.length > 0 ? projects[0]._id : ''),
        assignee: '',
        dueDate: ''
      });
    }
    setError('');
  }, [task, isOpen, defaultProjectId, defaultStatus, projects]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.project) {
      setError('Title and Project are required');
      return;
    }
    setLoading(true);
    try {
      if (task && task._id) {
        await updateTask(task._id, formData);
      } else {
        await createTask(formData);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task?._id ? 'Update Task Details' : 'Initialize New Task'}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="flex items-center gap-3 text-destructive text-xs font-bold bg-destructive/10 p-4 rounded-xl border border-destructive/20">
            <Info size={16} />
            {error}
          </div>
        )}
        
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Tag size={12} /> Task Title
          </label>
          <input
            type="text"
            className="w-full bg-background border border-border/40 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/40"
            placeholder="e.g. Design System Architecture"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Info size={12} /> Context & Description
          </label>
          <textarea
            className="w-full bg-background border border-border/40 rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary/50 transition-all min-h-[100px] resize-none"
            placeholder="Describe the scope and requirements..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Layers size={12} /> Project
            </label>
            <select
              className="w-full bg-background border border-border/40 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-1 focus:ring-primary/50 transition-all appearance-none"
              value={formData.project}
              onChange={(e) => setFormData({ ...formData, project: e.target.value })}
            >
              <option value="" disabled>Select Initiative</option>
              {projects.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <User size={12} /> Assignee
            </label>
            <select
              className="w-full bg-background border border-border/40 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-1 focus:ring-primary/50 transition-all appearance-none"
              value={formData.assignee}
              onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
            >
              <option value="">Unassigned</option>
              {team.map(m => (
                <option key={m._id} value={m._id}>{m.username}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              Status
            </label>
            <select
              className="w-full bg-background border border-border/40 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-1 focus:ring-primary/50 transition-all appearance-none"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="blocked">Blocked</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              Priority
            </label>
            <select
              className="w-full bg-background border border-border/40 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-1 focus:ring-primary/50 transition-all appearance-none"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Calendar size={12} /> Due Date
            </label>
            <input
              type="date"
              className="w-full bg-background border border-border/40 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-8 border-t border-border/20">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-secondary rounded-lg transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 bg-foreground text-background rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-all shadow-xl shadow-black/20"
          >
            {loading ? 'Processing...' : task?._id ? 'Update Task' : 'Confirm Creation'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
