import type { ReactNode } from 'react';

type TextProps = {
  children: ReactNode;
  className?: string;
};

const join = (...parts: (string | undefined)[]) => parts.filter(Boolean).join(' ');

export const Eyebrow = ({ children, className }: TextProps) => (
  <p
    className={join(
      'mb-1 font-mono text-micro tracking-[0.12em] text-accent uppercase',
      className,
    )}
  >
    {children}
  </p>
);

export const PageTitle = ({ children, className }: TextProps) => (
  <h1
    className={join(
      'm-0 text-title font-extrabold tracking-[-0.02em] text-content',
      className,
    )}
  >
    {children}
  </h1>
);

export const Heading = ({ children, className }: TextProps) => (
  <h2 className={join('m-0 text-heading font-bold text-content', className)}>{children}</h2>
);

export const Subheading = ({ children, className }: TextProps) => (
  <h2 className={join('m-0 mb-1.5 text-subheading font-bold text-content', className)}>
    {children}
  </h2>
);

export const Body = ({ children, className }: TextProps) => (
  <p className={join('m-0 text-body leading-normal text-muted', className)}>{children}</p>
);

export const FieldLabel = ({ children, className }: TextProps) => (
  <span
    className={join(
      'flex items-center gap-1.5 text-caption font-semibold tracking-[0.08em] text-muted uppercase',
      className,
    )}
  >
    {children}
  </span>
);

export const Mono = ({ children, className }: TextProps) => (
  <span className={join('font-mono text-caption text-muted', className)}>{children}</span>
);

export const Micro = ({ children, className }: TextProps) => (
  <span className={join('text-micro text-muted', className)}>{children}</span>
);

export const Brand = ({ className }: { className?: string }) => (
  <>
    <span className="text-content">Super</span>
    <span className={join('text-accent', className ?? 'text-shadow-accent-sm')}>TM</span>
  </>
);
