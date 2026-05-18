import { useState } from 'react';
import Modal from './Modal';
import api from '../../services/api';
import { useData } from '../../context/DataContext';
import { Mail, User, Shield, CheckCircle, Info } from 'lucide-react';

export default function InviteMemberModal({ isOpen, onClose }) {
  const { fetchAll } = useData();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'Member'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email) {
      setError('Member identity (username & email) is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/users', formData);
      setSuccess(true);
      fetchAll();
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({ username: '', email: '', role: 'Member' });
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Identity creation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Access Authorization">
      {success ? (
        <div className="py-12 text-center space-y-6">
          <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner border border-green-500/20">
            <CheckCircle size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold tracking-tight">Authorization Successful</h3>
            <p className="text-muted-foreground text-sm max-w-[280px] mx-auto">Member <b>{formData.username}</b> has been provisioned and added to the workspace.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-3 text-destructive text-xs font-bold bg-destructive/10 p-4 rounded-xl border border-destructive/20">
              <Info size={16} />
              {error}
            </div>
          )}
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <User size={12} /> System Username
            </label>
            <input
              type="text"
              className="w-full bg-background border border-border/40 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/40"
              placeholder="e.g. m_rossi"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Mail size={12} /> Institutional Email
            </label>
            <input
              type="email"
              className="w-full bg-background border border-border/40 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/40"
              placeholder="e.g. employee@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Shield size={12} /> Permission Tier
            </label>
            <div className="grid grid-cols-2 gap-4">
              {['Member', 'Admin'].map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFormData({ ...formData, role })}
                  className={`
                    px-4 py-3 rounded-xl border text-xs font-bold transition-all
                    ${formData.role === role 
                      ? 'bg-foreground text-background border-foreground shadow-lg' 
                      : 'bg-background text-muted-foreground border-border/40 hover:border-foreground/20'}
                  `}
                >
                  {role} Tier
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-secondary/50 border border-border/40">
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              <b>Security Note:</b> Provisioned accounts are initialized with the temporary credential <code className="bg-background px-1.5 py-0.5 rounded border border-border/40 font-bold">Welcome123!</code>. Immediate modification is recommended.
            </p>
          </div>

          <div className="flex justify-end gap-4 pt-8 border-t border-border/20">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-secondary rounded-lg transition-all"
            >
              Abort
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-foreground text-background rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-all shadow-xl shadow-black/20"
            >
              {loading ? 'Provisioning...' : 'Provision Access'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
