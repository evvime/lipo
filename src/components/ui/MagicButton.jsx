import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const MagicButton = ({ children, to, onClick, className = '' }) => {
  const baseClasses = "relative inline-flex h-14 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background";
  
  const content = (
    <>
      <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#0e7490_50%,#E2CBFF_100%)]" />
      <span className={`inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-background px-8 text-sm font-medium text-foreground backdrop-blur-3xl transition-colors hover:bg-secondary/50 ${className}`}>
        {children}
      </span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={baseClasses}>
      {content}
    </button>
  );
};

export default MagicButton;
