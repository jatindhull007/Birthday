import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressBar({
  progress = 0, // 0 - 100
  variant = 'primary', // 'primary' | 'danger' | 'success'
  className = '',
  showPulseAtComplete = false,
}) {
  const getFillColor = () => {
    switch (variant) {
      case 'danger':
        return 'bg-danger shadow-[0_0_15px_rgba(237,66,69,0.5)]';
      case 'success':
        return 'bg-success shadow-[0_0_15px_rgba(87,242,135,0.5)]';
      case 'primary':
      default:
        return 'bg-accent-primary glow-primary';
    }
  };

  const isComplete = progress >= 100;

  return (
    <motion.div
      animate={showPulseAtComplete && isComplete ? { scale: [1, 1.04, 1] } : {}}
      transition={{ duration: 0.2 }}
      className={`w-full h-3 bg-bg-base rounded-full overflow-hidden p-0.5 border border-text-muted/20 ${className}`}
    >
      <motion.div
        className={`h-full rounded-full transition-all duration-300 ${getFillColor()}`}
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </motion.div>
  );
}
