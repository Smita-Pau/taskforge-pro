import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { 
  User, 
  Lock, 
  Bell, 
  Palette, 
  Settings as SettingsIcon,
  CreditCard,
  Cloud,
  ChevronRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Profile Form
  const [username, setUsername] = useState(user?.username || '');

  // Security Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'api', label: 'API Keys', icon: Cloud },
  ];

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const { data } = await api.put('/users/profile', { username });
      updateUser(data);
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await api.put('/users/password', { currentPassword, newPassword });
      setMessage({ type: 'success', text: 'Password updated successfully' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="theme-settings space-y-8 pb-20 bg-subtle-mesh min-h-full max-w-6xl mx-auto px-6">
      <div className="border-b border-border/40 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground text-sm mt-1 font-medium">Configure your personal and workspace preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 pt-4">
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-64 space-y-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 px-4">Account</p>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setMessage({ type: '', text: '' }); }}
              className={`
                w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group
                ${activeTab === tab.id 
                  ? 'bg-secondary text-foreground' 
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'}
              `}
            >
              <div className="flex items-center gap-3">
                <tab.icon size={16} className={`${activeTab === tab.id ? 'text-primary' : 'opacity-60'}`} />
                <span className="text-sm font-semibold">{tab.label}</span>
              </div>
              {activeTab === tab.id && <ChevronRight size={14} className="opacity-40" />}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-surface-low border border-border/40 rounded-[2rem] p-10 shadow-sm relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
              transition={{ duration: 0.2 }}
            >
              {message.text && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-8 p-4 rounded-xl flex items-center gap-3 border ${
                    message.type === 'success' 
                      ? 'bg-green-500/10 border-green-500/20 text-green-500' 
                      : 'bg-destructive/10 border-destructive/20 text-destructive'
                  }`}
                >
                  {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <span className="text-xs font-bold uppercase tracking-wider">{message.text}</span>
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <div className="space-y-10">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight">Public Profile</h3>
                    <p className="text-sm text-muted-foreground mt-2 font-medium">Manage how others see you in the workspace.</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-10 py-10 border-y border-border/20">
                    <div className="w-24 h-24 rounded-3xl bg-secondary flex items-center justify-center text-foreground text-4xl font-bold border border-border/40 shadow-inner">
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <button className="px-5 py-2.5 bg-foreground text-background text-xs font-bold rounded-xl hover:opacity-90 transition-opacity">
                          Upload Photo
                        </button>
                        <button className="px-5 py-2.5 border border-border/60 text-xs font-bold rounded-xl hover:bg-secondary transition-colors">
                          Remove
                        </button>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.1em]">Recommended: 400x400px JPG or PNG.</p>
                    </div>
                  </div>
                  
                  <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Display Name</label>
                      <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-background border border-border/40 rounded-xl px-5 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Email (Read Only)</label>
                      <input 
                        type="email" 
                        defaultValue={user?.email}
                        className="w-full bg-background border border-border/40 rounded-xl px-5 py-3 text-sm opacity-60 cursor-not-allowed font-semibold"
                        disabled
                      />
                    </div>
                    <div className="md:col-span-2 flex justify-end pt-4">
                      <button 
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-primary text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : 'Save Profile'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-10">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight">Security Protocol</h3>
                    <p className="text-sm text-muted-foreground mt-2 font-medium">Maintain workspace integrity with strong authentication.</p>
                  </div>
                  <form onSubmit={handleUpdatePassword} className="space-y-8 max-w-md">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Current Password</label>
                      <input 
                        type="password" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="w-full bg-background border border-border/40 rounded-xl px-5 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">New Secure Password</label>
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="w-full bg-background border border-border/40 rounded-xl px-5 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                      />
                    </div>
                    <div className="pt-4">
                      <button 
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-foreground text-background text-xs font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
                      >
                        {loading ? 'Updating...' : 'Update Security'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab !== 'profile' && activeTab !== 'security' && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-secondary flex items-center justify-center mb-8 opacity-40">
                    <SettingsIcon size={32} />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight">Advanced Module</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mt-3 font-medium">The {activeTab} orchestration panel is currently being provisioned for the Enterprise release.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
