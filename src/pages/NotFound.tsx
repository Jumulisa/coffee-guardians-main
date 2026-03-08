import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#1a0f0a] via-[#2d1810] to-[#1a0f0a]">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-white">404</h1>
        <p className="mb-4 text-xl text-white/60">Oops! Page not found</p>
        <a href="/" className="text-green-400 underline hover:text-green-300">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
