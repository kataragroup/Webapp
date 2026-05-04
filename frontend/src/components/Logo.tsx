import { motion } from 'motion/react';

export function Logo({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg', className?: string }) {

  const sizes = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48'
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`${sizes[size]} ${className} flex items-center justify-center`}
    >
      <img
        src="/logo.png"   // 👈 public folder से direct access
        alt="Logo"
        className="w-full h-full object-contain"
      />
    </motion.div>
  );
}