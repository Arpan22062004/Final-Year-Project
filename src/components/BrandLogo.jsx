import { Link } from 'react-router-dom';

export default function BrandLogo({ to = '/', className = '', compact = false }) {
  return (
    <Link
      to={to}
      aria-label="Optiora"
      className={`inline-flex items-center rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/40 ${className}`}
    >
      <img
        src="/optiora-logo.png"
        alt="Optiora"
        className={compact ? 'h-9 w-auto object-contain' : 'h-10 w-auto object-contain'}
      />
    </Link>
  );
}
