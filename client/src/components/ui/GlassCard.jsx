import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`glass rounded-2xl border border-white/10 shadow-premium ${className}`}
    >
      {children}
    </motion.div>
  );
}
