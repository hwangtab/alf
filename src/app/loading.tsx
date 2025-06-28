export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 border-2 border-primary-red border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-neutral-400 font-test-sans">로딩 중...</p>
      </div>
    </div>
  );
}
