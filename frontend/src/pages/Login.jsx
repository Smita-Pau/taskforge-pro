import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Command, ArrowRight } from 'lucide-react';
import ParticlesBackground from '../components/layout/ParticlesBackground';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed', error);
      alert('Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden font-inter">
      <ParticlesBackground />
      
      {/* Left Section: Form */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-8">
        <div className="w-full max-w-[400px]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <Command size={18} className="text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">TaskForge</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight mb-2">Welcome back</h2>
            <p className="text-muted-foreground text-sm">Enter your workspace credentials to continue.</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Work Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-border/60 rounded-lg bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-sm"
                placeholder="name@company.com"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Password</label>
                <a href="#" className="text-[11px] font-bold text-primary hover:opacity-80 transition-opacity">Forgot?</a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-border/60 rounded-lg bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-sm"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full px-4 py-2.5 text-white font-bold bg-primary rounded-lg hover:opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 text-sm mt-4"
            >
              {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <>Sign In <ArrowRight size={16} /></>}
            </button>
            
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/40"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <button type="button" className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-border/60 rounded-lg text-sm font-medium hover:bg-secondary transition-colors">
              <Command size={18} /> GitHub
            </button>
          </form>

          <p className="mt-10 text-center text-xs text-muted-foreground">
            Don't have an account? <Link to="/register" className="text-foreground font-bold hover:underline">Request access</Link>
          </p>
        </div>
      </div>

      {/* Right Section: Visual / Social Proof */}
      <div className="hidden lg:flex flex-1 relative z-10 flex-col justify-between p-12 bg-surface-low border-l border-border/40">
        <div className="space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-[10px] font-bold text-primary uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            New Release v2.4
          </div>
          <h1 className="text-5xl font-extrabold tracking-tighter leading-[1.1]">
            Engineering productivity,<br />
            <span className="text-muted-foreground">reimagined.</span>
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
            The next generation task manager for teams that prioritize speed and clarity. Built on top of a rock-solid foundation.
          </p>
        </div>

        <div className="space-y-8">
          <div className="p-6 rounded-2xl bg-background border border-border/40 shadow-sm">
            <p className="text-sm font-medium leading-relaxed italic">
              "TaskForge has completely transformed how our engineering team tracks progress. The speed and UX are second to none."
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-8 h-8 rounded-full bg-secondary"></div>
              <div>
                <p className="text-xs font-bold">Alex Rivera</p>
                <p className="text-[10px] text-muted-foreground">CTO at Vertex AI</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <span>© 2026 TaskForge Inc.</span>
            <div className="flex gap-4">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
