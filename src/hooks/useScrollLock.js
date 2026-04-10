import { useEffect } from 'react';

/**
 * Custom hook to lock background scrolling when a modal or sidebar is active.
 * @param {boolean} lock - Whether to lock the background scroll.
 */
export const useScrollLock = (lock) => {
  useEffect(() => {
    if (lock) {
      // Get the current body overflow to restore it later
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [lock]);
};

export default useScrollLock;
