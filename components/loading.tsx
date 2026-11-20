// components/LoadingScreen.tsx
export function LoadingScreen({ text = "Loading.." }: { text?: string }) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-3 bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      <p className="text-sm font-medium text-gray-500 animate-pulse">{text}</p>
    </div>
  );
}
