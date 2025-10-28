import React, { useRef, useEffect } from 'react';
import type { Theme } from '../App';

interface ThemeToggleProps {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeToggle = ({ theme, toggleTheme }: ThemeToggleProps) => {
  const lottieRef = useRef<any>(null);
  // Use a ref to track if it's the very first animation, to distinguish between initial setup and user-triggered changes.
  const isFirstAnimation = useRef(true); 

  useEffect(() => {
    const player = lottieRef.current;
    if (!player) return;

    const onReady = () => {
      const lottieInstance = player.getLottie();
      if (!lottieInstance) return;

      // When the player is ready, immediately set it to the correct frame without animation.
      const frame = theme === 'dark' ? 57 : 0;
      lottieInstance.goToAndStop(frame, true);
      isFirstAnimation.current = false; // Mark initial setup as complete.
    };
    
    player.addEventListener('ready', onReady);
    
    return () => {
      if (player) {
        player.removeEventListener('ready', onReady);
      }
    };
  }, []); // Run this setup only once.

  useEffect(() => {
    // Don't animate on the first render cycle; the 'ready' handler sets the initial state.
    if (isFirstAnimation.current) return; 

    const player = lottieRef.current;
    const lottieInstance = player?.getLottie();
    if (lottieInstance) {
      if (theme === 'dark') {
        // Play from light mode frame (0) to dark mode frame (57)
        lottieInstance.playSegments([0, 57], true);
      } else {
        // Play from dark mode frame (57) to light mode end frame (114)
        lottieInstance.playSegments([57, 114], true);
      }
    }
  }, [theme]); // This effect now only runs when the theme changes.

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 flex items-center justify-center cursor-pointer appearance-none bg-transparent border-none p-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <lottie-player
      ref={lottieRef}
      src="/components/animations/Enable-Disable Button.json"
      style={{ width: '48px', height: '48px' }}
      speed="2"
      />
    </button>
  );
};
