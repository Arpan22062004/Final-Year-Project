import { Loader2 } from 'lucide-react';

export default function Loading({ message = 'Loading...' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-60 flex-col items-center justify-center gap-3 px-4 py-12"
    >
      <Loader2
        className="h-8 w-8 animate-spin text-primary-500"
        aria-hidden="true"
      />

      <p className="text-center text-sm text-slate-400">
        {message}
      </p>

      <span className="sr-only">Please wait</span>
    </div>
  );
}