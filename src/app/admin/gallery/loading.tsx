export default function AdminGalleryLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-border/40 h-16 w-1/3 rounded-2xl" />
      <div className="bg-border/30 h-16 rounded-2xl" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="bg-border/40 h-24 rounded-2xl" />
        <div className="bg-border/40 h-24 rounded-2xl" />
        <div className="bg-border/40 h-24 rounded-2xl" />
      </div>
      <div className="bg-border/40 h-16 rounded-2xl" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-border/30 h-72 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
