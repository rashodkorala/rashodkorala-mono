export default function Loading() {
  return (
    <div className="h-screen overflow-hidden bg-cream text-ink">
      <div className="h-full overflow-y-auto lg:ml-48 px-6 md:px-12 lg:px-14 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-8 h-8">
            <div className="absolute top-0 left-0 w-full h-full border-2 border-ink/10 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-2 border-transparent border-t-ink/30 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
