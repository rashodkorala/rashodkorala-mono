export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Navigation skeleton */}
      <div className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="h-4 w-24 bg-black/10 dark:bg-white/10 rounded animate-pulse" />
        </div>
      </div>

      <div className="px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Header skeleton */}
          <div className="mb-12 sm:mb-16">
            <div className="h-3 w-16 bg-black/10 dark:bg-white/10 rounded animate-pulse mb-4" />
            <div className="h-10 w-64 bg-black/10 dark:bg-white/10 rounded animate-pulse mb-3" />
            <div className="h-4 w-96 bg-black/10 dark:bg-white/10 rounded animate-pulse" />
          </div>

          {/* Blog card skeletons */}
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border-t border-black/10 dark:border-white/10 py-8 md:py-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex gap-3 items-center">
                    <div className="h-3 w-10 bg-black/10 dark:bg-white/10 rounded animate-pulse" />
                    <div className="h-5 w-16 bg-black/10 dark:bg-white/10 rounded-full animate-pulse" />
                    <div className="h-5 w-20 bg-black/10 dark:bg-white/10 rounded-full animate-pulse" />
                  </div>
                  <div className="h-7 w-3/4 bg-black/10 dark:bg-white/10 rounded animate-pulse" />
                  <div className="h-4 w-full bg-black/10 dark:bg-white/10 rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-black/10 dark:bg-white/10 rounded animate-pulse" />
                </div>
                <div className="w-full md:w-48 h-32 bg-black/10 dark:bg-white/10 rounded-lg animate-pulse flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
