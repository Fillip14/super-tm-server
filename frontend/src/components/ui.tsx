import { useState } from 'react';
import type { FocusEvent, InputHTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import { Body, Brand, FieldLabel, Subheading } from './Typography';

export const AuthLayout = ({ children }: { children: ReactNode }) => (
  <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg p-6 font-display">
    <div className="pointer-events-none absolute inset-0 auth-bg" />
    {children}
  </div>
);

export const AuthCard = ({
  children,
  centered = false,
}: {
  children: ReactNode;
  centered?: boolean;
}) => (
  <div
    className={`relative z-1 w-full max-w-100 animate-card-in rounded-2xl border border-line bg-surface shadow-card ${
      centered ? 'flex flex-col items-center gap-4 px-10 py-14 text-center' : 'p-10'
    }`}
  >
    {children}
  </div>
);

export const BrandLogo = () => (
  <div className="mb-4 text-[2rem] leading-none font-extrabold tracking-[-0.03em]">
    <Brand className="text-shadow-accent-md" />
  </div>
);

export const BackLink = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="mb-6 block cursor-pointer border-none bg-none p-0 font-mono text-caption text-muted transition-colors duration-150 hover:text-content"
  >
    {label}
  </button>
);

export const CardTitle = ({ children }: { children: ReactNode }) => (
  <Subheading>{children}</Subheading>
);

export const CardDesc = ({ children }: { children: ReactNode }) => <Body>{children}</Body>;

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
};

export const Field = ({ label, error, hint, ...inputProps }: FieldProps) => {
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [focused, setFocused] = useState(false);

  const watchCapsLock = inputProps.type === 'password';

  const readCapsLock = (e: KeyboardEvent<HTMLInputElement>) => {
    if (watchCapsLock) setCapsLockOn(e.getModifierState('CapsLock'));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    readCapsLock(e);
    inputProps.onKeyDown?.(e);
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    readCapsLock(e);
    inputProps.onKeyUp?.(e);
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    inputProps.onFocus?.(e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    setCapsLockOn(false);
    inputProps.onBlur?.(e);
  };

  const showCapsWarning = watchCapsLock && focused && capsLockOn;

  return (
    <div className="flex flex-col gap-1.5">
      <label>
        <FieldLabel>
          {label}
          {error && (
            <span className="text-micro font-normal tracking-normal text-error normal-case">
              * {error}
            </span>
          )}
        </FieldLabel>
      </label>

      <div className="relative">
        <input
          {...inputProps}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`w-full rounded-lg border bg-white/3 py-3 pl-3.5 font-mono text-body text-content outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted ${
            showCapsWarning ? 'pr-11' : 'pr-3.5'
          } ${
            error
              ? 'border-error/50 focus:border-error/70 focus:shadow-focus-error'
              : 'border-line focus:border-accent/40 focus:shadow-focus-accent'
          }`}
        />

        {showCapsWarning && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-body text-warning"
          >
            ⇪
          </span>
        )}
      </div>

      {showCapsWarning && (
        <p
          role="alert"
          className="m-0 flex animate-fade-in items-center gap-1.5 text-micro leading-normal text-warning"
        >
          <span aria-hidden="true">⚠</span> Caps Lock está ativado
        </p>
      )}

      {hint && (
        <p className={`m-0 text-micro leading-normal ${error ? 'text-error' : 'text-muted'}`}>
          {hint}
        </p>
      )}
    </div>
  );
};

export const ErrorBox = ({ children }: { children: ReactNode }) => (
  <div className="flex animate-shake items-center gap-2 rounded-lg border border-error/20 bg-error/8 px-3.5 py-2.5 font-mono text-caption text-error">
    <span>⚠</span> {children}
  </div>
);

export const Spinner = () => (
  <span className="inline-block size-4.5 animate-spin rounded-full border-2 border-bg/30 border-t-bg [animation-duration:0.7s]" />
);

export const PrimaryButton = ({
  children,
  onClick,
  loading = false,
  showArrow = true,
  className = '',
}: {
  children?: ReactNode;
  onClick: () => void;
  loading?: boolean;
  showArrow?: boolean;
  className?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    className={`group flex min-h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-none bg-accent p-3.5 font-display text-[0.9375rem] font-bold text-bg transition-all duration-200 not-disabled:hover:-translate-y-px not-disabled:hover:shadow-glow-accent not-disabled:active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
  >
    {loading ? (
      <Spinner />
    ) : (
      <>
        <span>{children}</span>
        {showArrow && (
          <span className="text-base transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        )}
      </>
    )}
  </button>
);

export const SecondaryButton = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="flex min-h-12 cursor-pointer items-center justify-center rounded-lg border border-line bg-transparent px-5 py-3.5 font-display text-[0.9375rem] font-semibold text-muted transition-all duration-200 hover:border-white/15 hover:text-content"
  >
    {children}
  </button>
);

export const TopbarButton = ({
  children,
  onClick,
  danger = false,
}: {
  children: ReactNode;
  onClick: () => void;
  danger?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`shrink-0 cursor-pointer rounded-lg border border-line bg-transparent px-3 py-1.5 font-display text-caption font-semibold whitespace-nowrap text-muted transition-all duration-200 sm:px-4 sm:py-2 sm:text-body ${
      danger ? 'hover:border-error/40 hover:text-error' : 'hover:border-white/15 hover:text-content'
    }`}
  >
    {children}
  </button>
);

export const AppShell = ({
  onLogoClick,
  actions,
  children,
  gridAlpha = '0.025',
}: {
  onLogoClick: () => void;
  actions: ReactNode;
  children: ReactNode;
  gridAlpha?: string;
}) => (
  <div className="relative min-h-screen overflow-x-clip bg-bg font-display">
    <div
      className="pointer-events-none fixed inset-0 z-0 grid-bg"
      style={{ ['--grid-alpha' as string]: gridAlpha }}
    />

    <header className="relative z-10 flex items-center justify-between gap-4 border-b border-line bg-bg/85 px-4 py-3.5 backdrop-blur-md sm:gap-6 sm:px-8 sm:py-4.5">
      <span
        onClick={onLogoClick}
        className="min-w-0 shrink cursor-pointer truncate text-xl leading-none font-extrabold tracking-[-0.03em] transition-opacity duration-200 hover:opacity-80 sm:text-2xl"
      >
        <Brand />
      </span>

      <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">{actions}</div>
    </header>

    {children}
  </div>
);

export const SuccessIcon = () => (
  <div className="flex size-16 animate-success-pop items-center justify-center rounded-full border border-success/30 bg-success/12 text-title text-success">
    ✓
  </div>
);
