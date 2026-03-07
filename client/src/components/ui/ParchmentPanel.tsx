import React from 'react';
import { cn } from '@/lib/utils';

interface ParchmentPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  ironBorders?: boolean;
}

export function ParchmentPanel({ children, className, title, ironBorders = true, ...props }: ParchmentPanelProps) {
  return (
    <div 
      className={cn(
        "relative bg-card text-card-foreground p-6 shadow-2xl",
        ironBorders && "iron-border rounded-md",
        className
      )}
      {...props}
    >
      {/* Decorative corner accents if iron border is present */}
      {ironBorders && (
        <>
          <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-border shadow-inner" />
          <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-border shadow-inner" />
          <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-border shadow-inner" />
          <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-border shadow-inner" />
        </>
      )}
      
      {title && (
        <h3 className="text-xl text-accent font-display uppercase tracking-widest border-b border-border/50 pb-2 mb-4">
          {title}
        </h3>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
