import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-background/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.98, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.98, opacity: 0, y: 10 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-surface-low rounded-2xl border border-border/60 shadow-2xl overflow-hidden w-full max-w-lg relative"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-8 py-6 border-b border-border/20">
            <h2 className="text-xl font-extrabold tracking-tight">{title}</h2>
            <button 
              onClick={onClose} 
              className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
