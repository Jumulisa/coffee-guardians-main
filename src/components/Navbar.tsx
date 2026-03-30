import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Coffee, Menu, X, LogOut, Home, History, Settings, Globe, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 z-50 w-full bg-transparent">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-xl font-bold text-white transition-opacity hover:opacity-80"
          >
            <Coffee className="h-6 w-6 text-green-400" />
            <span className="tracking-wide text-lg">COFFEEGUARD</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`transition-colors text-sm tracking-wide ${
                isActive("/") ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {t("home").toUpperCase()}
            </Link>
            <Link
              to="/upload"
              className={`transition-colors text-sm tracking-wide ${
                isActive("/upload") ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {t("upload").toUpperCase()}
            </Link>
            <Link
              to="/history"
              className={`transition-colors text-sm tracking-wide ${
                isActive("/history") ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {t("history").toUpperCase()}
            </Link>
            <Link
              to="/diseases"
              className={`transition-colors text-sm tracking-wide ${
                isActive("/diseases") ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {(language === "rw" ? "INDWARA" : "DISEASES")}
            </Link>
            <Link
              to="/settings"
              className={`transition-colors text-sm tracking-wide ${
                isActive("/settings") ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {(language === "rw" ? "IGENAMIGANI" : "SETTINGS")}
            </Link>
            <Link
              to="/legal"
              className={`transition-colors text-sm tracking-wide ${
                isActive("/legal") ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {(language === "rw" ? "AMABWIRIZA" : "LEGAL")}
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "rw" : "en")}
              className="border border-white/20 text-white/70 hover:text-white hover:bg-white/10"
            >
              <Globe className="h-4 w-4" />
              <span className="ml-1 text-xs font-semibold uppercase">{language === "en" ? "RW" : "EN"}</span>
            </Button>

            {!isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/login")} 
                  className="hidden sm:inline-flex text-white/70 hover:text-white hover:bg-white/10"
                >
                  {t("signIn") || "Sign in"}
                </Button>
                <Button 
                  onClick={() => navigate("/signup")} 
                  className="hidden sm:inline-flex bg-white/10 border border-white/30 text-white hover:bg-white/20"
                >
                  {t("signUp") || "Sign up"}
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-10 w-10 rounded-full font-semibold bg-white/10 border border-white/30 text-white hover:bg-white/20"
                  >
                    {user?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#1a0f0a] border-white/10 text-white">
                  <div className="flex items-center gap-3 px-4 py-2">
                    <div className="h-10 w-10 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold">
                      {user?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-white">{user?.full_name || 'User'}</p>
                      <p className="text-xs text-white/60">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem asChild className="text-white/80 hover:text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">
                    <Link to="/" className="cursor-pointer">
                      <Home className="mr-2 h-4 w-4" />
                      <span>{t("home")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-white/80 hover:text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">
                    <Link to="/upload" className="cursor-pointer">
                      <span>{t("upload")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-white/80 hover:text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">
                    <Link to="/history" className="cursor-pointer">
                      <History className="mr-2 h-4 w-4" />
                      <span>{t("history")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem asChild className="text-white/80 hover:text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">
                    <Link to="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-white/80 hover:text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">
                    <Link to="/legal" className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Legal</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:text-red-300 hover:bg-white/10 focus:bg-white/10 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("logout") || "Logout"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 bg-[#1a0f0a]/95 backdrop-blur-md -mx-4 px-4 pt-2 animate-slide-down">
            <Link
              to="/"
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/") ? "text-white bg-white/10" : "text-white/80 hover:bg-white/10"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("home")}
            </Link>
            <Link
              to="/upload"
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/upload") ? "text-white bg-white/10" : "text-white/80 hover:bg-white/10"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("upload")}
            </Link>
            <Link
              to="/history"
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/history") ? "text-white bg-white/10" : "text-white/80 hover:bg-white/10"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("history")}
            </Link>
            <Link
              to="/diseases"
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/diseases") ? "text-white bg-white/10" : "text-white/80 hover:bg-white/10"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("diseases")}
            </Link>
            <Link
              to="/settings"
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/settings") ? "text-white bg-white/10" : "text-white/80 hover:bg-white/10"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Settings
            </Link>
            <Link
              to="/legal"
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/legal") ? "text-white bg-white/10" : "text-white/80 hover:bg-white/10"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Legal
            </Link>
            {!isAuthenticated && (
              <div className="pt-2 space-y-2 border-t border-white/10">
                <Button 
                  variant="ghost" 
                  onClick={() => { navigate("/login"); setMobileMenuOpen(false); }}
                  className="w-full justify-start text-white/80 hover:bg-white/10"
                >
                  {t("signIn") || "Sign in"}
                </Button>
                <Button 
                  onClick={() => { navigate("/signup"); setMobileMenuOpen(false); }}
                  className="w-full bg-white/10 border border-white/30 text-white hover:bg-white/20"
                >
                  {t("signUp") || "Sign up"}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
