export default function Loading() {
  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Minimal spinner */}
        <div className="relative w-8 h-8">
          <div className="absolute top-0 left-0 w-full h-full border-2 border-black/10 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-2 border-transparent border-t-black/30 rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}