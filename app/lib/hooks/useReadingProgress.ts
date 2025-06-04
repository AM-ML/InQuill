import { useState, useEffect } from 'react';

interface ReadingProgressResult {
  progress: number;
  estimatedTimeLeft: string;
}

export function useReadingProgress(
  elementRef: React.RefObject<HTMLElement>,
  averageWordsPerMinute: number = 200
): ReadingProgressResult {
  const [progress, setProgress] = useState(0);
  const [estimatedTimeLeft, setEstimatedTimeLeft] = useState('0 min left');

  useEffect(() => {
    if (!elementRef.current) return;

    const calculateReadingProgress = () => {
      const element = elementRef.current;
      if (!element) return;

      // Calculate total height of the article content
      const totalHeight = element.scrollHeight - element.clientHeight;
      
      // Calculate how much has been scrolled
      const windowScroll = window.scrollY - element.offsetTop;
      const scrolled = Math.max(0, Math.min(windowScroll, totalHeight));
      
      // Calculate progress percentage
      const calculatedProgress = totalHeight > 0 ? Math.round((scrolled / totalHeight) * 100) : 0;
      setProgress(calculatedProgress);

      // Estimate time left based on average reading speed
      // This is a rough estimation assuming the total reading time and calculating remaining time
      if (calculatedProgress < 100) {
        // Estimate total content length (words)
        // This is a very rough estimation based on the element's textContent
        const contentLength = element.textContent?.split(/\s+/).length || 1000;
        const totalReadingTimeMinutes = contentLength / averageWordsPerMinute;
        
        // Calculate remaining time based on progress percentage
        const remainingPercentage = 100 - calculatedProgress;
        const minutesLeft = Math.ceil((remainingPercentage / 100) * totalReadingTimeMinutes);
        
        if (minutesLeft <= 1) {
          setEstimatedTimeLeft('1 min left');
        } else {
          setEstimatedTimeLeft(`${minutesLeft} mins left`);
        }
      } else {
        setEstimatedTimeLeft('Completed');
      }
    };
    
    // Initial calculation
    calculateReadingProgress();
    
    // Add scroll event listener
    window.addEventListener('scroll', calculateReadingProgress, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', calculateReadingProgress);
    };
  }, [elementRef, averageWordsPerMinute]);

  return { progress, estimatedTimeLeft };
} 