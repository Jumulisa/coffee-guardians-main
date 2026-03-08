import React, { useState } from "react";
import { useGlobalError } from "@/hooks/use-global-error";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Coffee, User, Mail, Phone, MapPin, Lock, AlertCircle, Loader2, Eye, EyeOff, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { showError } = useGlobalError();
  const [passwordStrength, setPasswordStrength] = useState(0);

  const checkPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z\d]/.test(pwd)) strength++;
    setPasswordStrength(strength);
    return strength >= 2;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwordStrength < 2) {
      setError("Password is too weak. Please use a stronger password");
      return;
    }

    setIsLoading(true);
    try {
      await signup(formData.name, formData.email, formData.password);
      // Navigate to login with success state
      navigate("/login", { state: { signupSuccess: true, email: formData.email } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed. Please try again.");
      showError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-200";
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 bg-gradient-to-b from-[#1a0f0a] via-[#2d1810] to-[#1a0f0a] animate-fade-in py-8">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8 animate-slide-down">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-600/20 border border-green-500/30 text-green-500 mb-4">
            <Coffee className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-white">Coffee Guardian</h1>
          <p className="text-white/60 mt-2">Join to protect your harvest</p>
        </div>

        {/* Signup Card */}
        <Card className="border-0 shadow-xl animate-slide-up bg-white/5 backdrop-blur-md border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Create account</CardTitle>
            <CardDescription className="text-white/60">Sign up to start diagnosing coffee diseases</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Alert */}
              {error && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 text-destructive animate-shake">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Full name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Location Field */}
              <div className="space-y-2">
                <Label htmlFor="location">District/Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    name="location"
                    placeholder="e.g., Nyamagabe"
                    value={formData.location}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+250 7XX XXX XXX"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
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

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      {passwordStrength <= 2 && "Weak"}
                      {passwordStrength === 3 && "Fair"}
                      {passwordStrength >= 4 && "Strong"}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>

                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <CheckCircle className="absolute right-10 top-3 h-4 w-4 text-green-500" />
                  )}
                </div>
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
                    Creating account...
                  </>
                ) : (
                  <>
                    <span className="group-hover:tracking-wider transition-all duration-300">Create account</span>
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center border-t pt-6">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
