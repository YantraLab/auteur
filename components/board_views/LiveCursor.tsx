import React, { useState, useEffect, useRef } from 'react';
import type { User } from '../../types';

interface LiveCursorProps {
  user: User;
  containerBoundaryRef: React.RefObject<HTMLElement> | null;
}

export const LiveCursor = ({ user }: LiveCursorProps) => {
  const [position, setPosition] = useState({ top: 5, left: 10 });
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate cursor movement randomly within a typical text area
      const newTop = Math.random() * 80 + 5; // 5% to 85% from top
      const newLeft = Math.random() * 90 + 5; // 5% to 95% from left
      setPosition({ top: newTop, left: newLeft });
    }, 3000); // Move every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="absolute transition-all duration-500 ease-in-out pointer-events-none z-10"
      style={{ top: `${position.top}%`, left: `${position.left}%` }}
    >
      <div className="relative">
        <div
          className="absolute bottom-full mb-1 w-max px-2 py-0.5 rounded-md text-xs text-white"
          style={{ backgroundColor: user.color }}
        >
          {user.name}
           <div 
                className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4"
                style={{ borderTopColor: user.color }}
            />
        </div>
        <div
          className="w-0.5 h-5 animate-pulse"
          style={{ backgroundColor: user.color }}
        />
      </div>
    </div>
  );
};
