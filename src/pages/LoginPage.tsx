import React, { useState, useEffect } from "react";
import { useGlobalError } from "@/hooks/use-global-error";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Coffee, Mail, Lock, AlertCircle, Loader2, Eye, EyeOff, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { showError } = useGlobalError();
  const [signupSuccess, setSignupSuccess] = useState(false);

  useEffect(() => {
    // Check if coming from signup
    const state = location.state as any;
    if (state?.signupSuccess) {
      setSignupSuccess(true);
      setEmail(state?.email || "");
      // Clear the success message after 5 seconds
      const timer = setTimeout(() => setSignupSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
      showError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 bg-gradient-to-b from-[#1a0f0a] via-[#2d1810] to-[#1a0f0a] animate-fade-in">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8 animate-slide-down">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-600/20 border border-green-500/30 text-green-500 mb-4">
            <Coffee className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-white">Coffee Guardian</h1>
          <p className="text-white/60 mt-2">Protect your coffee harvest with AI</p>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-xl animate-slide-up bg-white/5 backdrop-blur-md border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Welcome back</CardTitle>
            <CardDescription className="text-white/60">Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Success Alert */}
              {signupSuccess && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 text-green-700 border border-green-200 animate-slide-down">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <p className="text-sm font-medium">Account created! Please sign in to continue.</p>
                </div>
              )}

              {/* Error Alert */}
              {error && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 text-destructive animate-shake">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                size="lg"
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] transition-all duration-300 group"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <span className="group-hover:tracking-wider transition-all duration-300">Sign in</span>
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </Button>
            </form>

            {/* Signup Link */}
            <div className="mt-6 text-center border-t pt-6">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary font-semibold hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
