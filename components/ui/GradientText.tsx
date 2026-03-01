'use client';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function GradientText({ children, className = '', style }: GradientTextProps) {
  return (
    <span
      className={className}
      style={{
        background: 'linear-gradient(160deg, #EFEFF4 0%, #EFEFF4 35%, #3DDB82 60%, #2AB86A 80%, #1D9958 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        ...style,
      }}
    >
      {children}
    </span>
  );
}
