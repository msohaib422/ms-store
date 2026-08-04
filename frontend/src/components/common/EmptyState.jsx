import { PackageSearch } from 'lucide-react';

export default function EmptyState({ title = 'Nothing here yet', description = 'Check back soon for updates.' }) {
  return (
    <div className="text-center py-16 px-4">
      <PackageSearch size={48} className="mx-auto text-neutral-300 mb-4" />
      <h3 className="font-heading font-semibold text-neutral-600 text-lg">{title}</h3>
      <p className="text-neutral-400 text-sm mt-1">{description}</p>
    </div>
  );
}
