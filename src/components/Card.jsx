import { classNames } from '@/lib/utils';

export default function Card({
  children,
  className,
  hover = false,
}) {
  return (
    <div
      className={classNames(
        'rounded-2xl border border-white/10 bg-[#0b1020] p-6 card-shadow',
        hover && [
          'transition-all duration-200',
          'hover:-translate-y-0.5 hover:border-indigo-400/20 hover:shadow-xl hover:shadow-black/20',
        ],
        className
      )}
    >
      {children}
    </div>
  );
}