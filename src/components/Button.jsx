import React from 'react';
import { motion } from 'framer-motion';
import { TIMING } from '../lib/motion';
import { playSfx } from '../lib/audio';

export default function Button({
  children,
  onClick,
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'success' | 'scrapbook'
  className = '',
  disabled = false,
  type = 'button',
  icon: Icon,
}) {
  const handleClick = (e) => {
    if (disabled) return;
    playSfx('sfx-digit');
    if (onClick) onClick(e);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-accent-primary text-text-primary glow-primary hover:bg-[#4752C4] border border-accent-glow/30';
      case 'secondary':
        return 'bg-bg-base/80 border border-text-muted/30 text-text-muted hover:text-text-primary hover:border-text-primary/60';
      case 'success':
        return 'bg-success text-bg-base-deep glow-success font-bold';
      case 'danger':
        return 'bg-danger text-text-primary glow-danger';
      case 'scrapbook':
        return 'bg-scrapbook-brown text-scrapbook-cream hover:bg-[#724A2D] shadow-md';
      default:
        return 'bg-accent-primary text-text-primary glow-primary';
    }
  };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={handleClick}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ duration: TIMING.micro }}
      className={`relative px-6 py-3.5 rounded-full font-display font-semibold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2.5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${getVariantStyles()} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span>{children}</span>
    </motion.button>
  );
}
