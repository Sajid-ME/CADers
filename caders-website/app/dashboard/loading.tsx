export default function Loading() {
  return (
    <div className="container py-16 animate-pulse space-y-8">
      <div className="h-8 w-64 rounded-m-md bg-surface-container-high" />
      <div className="h-4 w-40 rounded-m-md bg-surface-container-high" />
      <div className="grid gap-4 md:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 rounded-m-lg bg-surface-container-high"
          />
        ))}
      </div>
    </div>
  );
}