/** Skeleton loading state for the student dashboard */
export default function Loading() {
  return (
    <div className="container py-16 space-y-10">
      {/* Welcome card skeleton */}
      <div className="animate-pulse rounded-m-xl bg-surface-container border border-outline-variant p-6 md:p-8 flex items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-surface-container-high shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-3 w-24 rounded-full bg-surface-container-high" />
          <div className="h-7 w-56 rounded-full bg-surface-container-high" />
          <div className="h-4 w-40 rounded-full bg-surface-container-high" />
        </div>
        <div className="hidden sm:flex gap-6 shrink-0">
          <div className="space-y-2 text-center">
            <div className="h-8 w-12 rounded-m-md bg-surface-container-high mx-auto" />
            <div className="h-3 w-14 rounded-full bg-surface-container-high" />
          </div>
          <div className="w-px bg-outline-variant" />
          <div className="space-y-2 text-center">
            <div className="h-8 w-12 rounded-m-md bg-surface-container-high mx-auto" />
            <div className="h-3 w-14 rounded-full bg-surface-container-high" />
          </div>
        </div>
      </div>

      {/* Section heading skeleton */}
      <div className="animate-pulse flex items-center gap-3">
        <div className="w-10 h-10 rounded-m-md bg-surface-container-high shrink-0" />
        <div className="space-y-2">
          <div className="h-5 w-36 rounded-full bg-surface-container-high" />
          <div className="h-4 w-56 rounded-full bg-surface-container-high" />
        </div>
      </div>

      {/* Course + material card skeletons */}
      {[0, 1].map((course) => (
        <div key={course} className="animate-pulse space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-m-md bg-surface-container-high" />
            <div className="space-y-2">
              <div className="h-5 w-48 rounded-full bg-surface-container-high" />
              <div className="h-4 w-64 rounded-full bg-surface-container-high" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-24 rounded-m-lg bg-surface-container-high"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}