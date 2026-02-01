export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-10 h-10 border-4 border-cream-dark border-t-accent-orange rounded-full animate-spin" />
    </div>
  );
}
