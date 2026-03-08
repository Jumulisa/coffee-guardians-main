import { useState } from "react";

export function useGlobalError() {
  const [error, setError] = useState<string | null>(null);
  const showError = (err: unknown) => {
    if (err instanceof Error) setError(err.message);
    else if (typeof err === "string") setError(err);
    else setError("An unexpected error occurred.");
  };
  const clearError = () => setError(null);
  return { error, showError, clearError };
}
