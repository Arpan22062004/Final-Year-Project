import { Loader2 } from 'lucide-react';

import { classNames } from '@/lib/utils';

const variants = {
  primary:
    'bg-indigo-500 text-white shadow-sm shadow-indigo-500/25 hover:bg-indigo-400 active:bg-indigo-600',

  secondary:
    'bg-white/10 text-white shadow-sm hover:bg-white/15 active:bg-white/20',

  ghost:
    'text-slate-300 hover:bg-white/5 active:bg-white/10',

  danger:
    'bg-red-600 text-white shadow-sm shadow-red-600/20 hover:bg-red-700 active:bg-red-800',

  outline:
    'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 active:bg-white/15',
};

const sizes = {
  sm: 'min-h-8 px-3 py-1.5 text-xs',
  md: 'min-h-10 px-4 py-2.5 text-sm',
  lg: 'min-h-12 px-6 py-3 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className,
  children,
  type = 'button',
  ...props
}) {
  const buttonVariant = variants[variant] || variants.primary;
  const buttonSize = sizes[size] || sizes.md;

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      className={classNames(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary-500/30',
        'disabled:cursor-not-allowed disabled:opacity-50',
        buttonVariant,
        buttonSize,
        className
      )}
      {...props}
    >
      {loading && (
        <Loader2
          className="h-4 w-4 shrink-0 animate-spin"
          aria-hidden="true"
        />
      )}

      <span className={classNames(loading && 'opacity-90')}>
        {children}
      </span>
    </button>
  );
}
