import { statusClasses } from '../../utils/formatters';

export default function Badge({ children, status, className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${status ? statusClasses(status) : 'border-white/10 bg-white/10 text-slate-200'} ${className}`}>
      {children}
    </span>
  );
}
