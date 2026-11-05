export default function AdminTeamLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
      <div className="h-16 w-1/3 bg-border/40 rounded-2xl" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="h-24 bg-border/40 rounded-2xl" />
        <div className="h-24 bg-border/40 rounded-2xl" />
        <div className="h-24 bg-border/40 rounded-2xl" />
      </div>
      <div className="h-16 bg-border/40 rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-64 bg-border/30 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

