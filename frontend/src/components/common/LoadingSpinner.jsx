import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ size = 'md' }) {
  const cls = { sm: 'h-16', md: 'h-32', lg: 'h-64' }[size];
  return (
    <div className={`flex items-center justify-center ${cls}`}>
      <Loader2 size={32} className="animate-spin text-primary-500" />
    </div>
  );
}
