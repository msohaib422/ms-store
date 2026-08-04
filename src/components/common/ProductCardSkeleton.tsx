export default function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton h-52 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-3 w-20" />
        <div className="skeleton h-5 w-full" />
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-4 w-24" />
        <div className="skeleton h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}
