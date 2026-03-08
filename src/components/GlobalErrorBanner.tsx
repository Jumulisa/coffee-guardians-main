import { useGlobalError } from "@/hooks/use-global-error";
import { AlertCircle } from "lucide-react";

export function GlobalErrorBanner() {
  const { error, clearError } = useGlobalError();
  if (!error) return null;
  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-destructive/90 text-white flex items-center justify-between px-6 py-3 shadow-lg animate-shake">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5" />
        <span className="font-medium">{error}</span>
      </div>
      <button onClick={clearError} className="ml-4 px-3 py-1 rounded bg-white/20 hover:bg-white/30">Dismiss</button>
    </div>
  );
}
