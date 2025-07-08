'use client';

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
}: ScrollAnimationWrapperProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
