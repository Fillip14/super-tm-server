import { useState } from 'react';
import type { FocusEvent, InputHTMLAttributes, KeyboardEvent, ReactNode } from 'react';

/* Peças compartilhadas por login, signup e payment.
   Antes cada página repetia o mesmo CSS com nomes de classe diferentes. */

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
    className={`relative z-1 w-full max-w-100 animate-card-in rounded-2xl border border-line bg-surface shadow-[0_32px_80px_rgba(0,0,0,0.5)] ${
      centered ? 'flex flex-col items-center gap-4 px-10 py-14 text-center' : 'p-10'
    }`}
  >
    {children}
  </div>
);

export const BrandLogo = () => (
  <div className="mb-4 text-[32px] leading-none font-extrabold tracking-[-0.03em]">
    <span className="text-content">Super</span>
    <span className="text-accent [text-shadow:0_0_20px_rgba(0,229,255,0.5)]">TM</span>
  </div>
);

export const BackLink = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="mb-6 block cursor-pointer border-none bg-none p-0 font-mono text-xs text-muted transition-colors duration-150 hover:text-content"
  >
    {label}
  </button>
);

export const CardTitle = ({ children }: { children: ReactNode }) => (
  <h2 className="m-0 mb-1.5 text-xl font-bold text-content">{children}</h2>
);

export const CardDesc = ({ children }: { children: ReactNode }) => (
  <p className="m-0 text-sm leading-normal text-muted">{children}</p>
);

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
};

export const Field = ({ label, error, hint, ...inputProps }: FieldProps) => {
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [focused, setFocused] = useState(false);

  // Aviso de Caps Lock só faz sentido onde o texto fica mascarado.
  const watchCapsLock = inputProps.type === 'password';

  const readCapsLock = (e: KeyboardEvent<HTMLInputElement>) => {
    if (watchCapsLock) setCapsLockOn(e.getModifierState('CapsLock'));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    readCapsLock(e);
    inputProps.onKeyDown?.(e);
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    // A própria tecla Caps Lock só reporta o estado novo no keyup.
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
      <label className="flex items-center gap-1.5 text-xs font-semibold tracking-[0.08em] text-muted uppercase">
        {label}
        {error && (
          <span className="text-[11px] font-normal tracking-normal text-error normal-case">
            * {error}
          </span>
        )}
      </label>

      <div className="relative">
        <input
          {...inputProps}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`w-full rounded-lg border bg-white/3 py-3 pl-3.5 font-mono text-sm text-content outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted ${
            showCapsWarning ? 'pr-11' : 'pr-3.5'
          } ${
            error
              ? 'border-error/50 focus:border-error/70 focus:shadow-[0_0_0_3px_rgba(255,77,109,0.08)]'
              : 'border-line focus:border-accent/40 focus:shadow-[0_0_0_3px_rgba(0,229,255,0.08)]'
          }`}
        />

        {showCapsWarning && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-warning"
          >
            ⇪
          </span>
        )}
      </div>

      {showCapsWarning && (
        <p
          role="alert"
          className="m-0 flex animate-fade-in items-center gap-1.5 text-[11px] leading-normal text-warning"
        >
          <span aria-hidden="true">⚠</span> Caps Lock está ativado
        </p>
      )}

      {hint && (
        <p className={`m-0 text-[11px] leading-normal ${error ? 'text-error' : 'text-muted'}`}>
          {hint}
        </p>
      )}
    </div>
  );
};

export const ErrorBox = ({ children }: { children: ReactNode }) => (
  <div className="flex animate-shake items-center gap-2 rounded-lg border border-error/20 bg-error/8 px-3.5 py-2.5 font-mono text-[13px] text-error">
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
    className={`group flex min-h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-none bg-accent p-3.5 font-display text-[15px] font-bold text-bg transition-all duration-200 not-disabled:hover:-translate-y-px not-disabled:hover:shadow-[0_8px_24px_rgba(0,229,255,0.3)] not-disabled:active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
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
    className="flex min-h-12 cursor-pointer items-center justify-center rounded-lg border border-line bg-transparent px-5 py-3.5 font-display text-[15px] font-semibold text-muted transition-all duration-200 hover:border-white/15 hover:text-content"
  >
    {children}
  </button>
);

export const SuccessIcon = () => (
  <div className="flex size-16 animate-success-pop items-center justify-center rounded-full border border-success/30 bg-success/12 text-[28px] text-success">
    ✓
  </div>
);
