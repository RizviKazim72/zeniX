'use client';

import { useEffect, useRef, useState } from 'react';

interface ScrollAnimationWrapperProps {
  children: React.ReactNode;
  className?: string;
  animationClass?: string;
  threshold?: number;
  delay?: number;
  fallback?: React.ReactNode;
}

export default function ScrollAnimationWrapper({
  children,
  className = '',
  animationClass = 'smooth-reveal',
  threshold = 0.1,
  delay = 0,
  fallback
}: ScrollAnimationWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggered) {
            setTimeout(() => {
              setIsVisible(true);
              entry.target.classList.add('visible');
              setHasTriggered(true);
              observer.unobserve(entry.target); // Remove observer after first trigger
            }, delay);
          }
        });
      },
      { 
        threshold,
        rootMargin: '50px 0px'
      }
    );

    if (ref.current && !hasTriggered) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, delay, hasTriggered]);

  return (
    <div
      ref={ref}
      className={`${animationClass} ${hasTriggered ? 'visible' : ''} ${className}`}
      style={{ 
        minHeight: isVisible ? 'auto' : '100px',
        transition: 'min-height 0.3s ease'
      }}
    >
      {isVisible ? children : (fallback || <div className="content-placeholder" />)}
    </div>
  );
}
