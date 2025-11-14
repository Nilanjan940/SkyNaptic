
'use client';

import { motion } from 'framer-motion';
import { Plane, AlertTriangle } from 'lucide-react';
import React from 'react';

function DroneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 18a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-1 0v4a.5.5 0 0 0 .5.5z" />
      <path d="M12 8a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 .5.5z" />
      <path d="M12 8a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 0-1h-3a.5.5 0 0 0-.5.5z" />
      <path d="m7 14-2-2 2-2" />
      <path d="m17 14 2-2-2-2" />
      <path d="M12 12a4.5 4.5 0 0 0-4.5 4.5h9a4.5 4.5 0 0 0-4.5-4.5z" />
    </svg>
  );
}

const aircraft = [
  {
    type: 'plane',
    size: 28,
    color: 'bg-primary/80',
    path: {
      initial: { x: '-10%', y: '20%' },
      animate: { x: '110%', y: '50%' },
      transition: { duration: 15, repeat: Infinity, ease: 'linear' },
    },
  },
  {
    type: 'plane',
    size: 28,
    color: 'bg-primary/80',
    path: {
      initial: { x: '40%', y: '110%' },
      animate: { x: '70%', y: '-10%' },
      transition: { duration: 18, repeat: Infinity, ease: 'linear', delay: 5 },
    },
  },
  {
    type: 'drone',
    size: 20,
    color: 'bg-accent/90',
    path: {
      initial: { x: '90%', y: '95%' },
      animate: { x: '50%', y: '60%' },
      transition: { duration: 8, repeat: Infinity, yoyo: Infinity, ease: 'easeInOut' },
    },
  },
   {
    type: 'drone',
    size: 20,
    color: 'bg-accent/90',
    path: {
      initial: { x: '10%', y: '80%' },
      animate: { x: '40%', y: '10%' },
      transition: { duration: 12, repeat: Infinity, yoyo: Infinity, ease: 'easeInOut', delay: 3 },
    },
  },
   {
    type: 'alert',
    size: 24,
    color: 'bg-destructive',
    path: {
      initial: { x: '65%', y: '40%', scale: 1, opacity: 1 },
      animate: { scale: [1, 1.5, 1], opacity: [1, 0.7, 1] },
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
    },
  },
];

export function MockMap() {
  return (
    <div className="relative w-full h-full min-h-[400px] bg-muted/20 overflow-hidden border-t">
       {/* Background Grid */}
       <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px)',
          backgroundSize: '3rem 3rem',
          opacity: 0.2,
        }}
      />
      
      {aircraft.map((ac, index) => (
        <motion.div
          key={index}
          className={`absolute flex items-center justify-center rounded-full text-primary-foreground shadow-lg ${ac.color}`}
          initial={ac.path.initial}
          animate={ac.path.animate}
          transition={ac.path.transition}
          style={{ width: ac.size, height: ac.size }}
        >
          {ac.type === 'plane' && <Plane size={ac.size * 0.6} />}
          {ac.type === 'drone' && <DroneIcon />}
          {ac.type === 'alert' && <AlertTriangle size={ac.size * 0.6} />}
        </motion.div>
      ))}
    </div>
  );
}
