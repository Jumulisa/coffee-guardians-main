import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Coffee, Mail, ArrowLeft, AlertCircle, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password. Please try again.");
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
          <p className="text-white/60 mt-2">Reset your password</p>
        </div>

        {/* Reset Password Card */}
        <Card className="border-0 shadow-xl animate-slide-up bg-white/5 backdrop-blur-md border border-white/10">
          {!success ? (
            <>
              <CardHeader>
                <CardTitle className="text-white">Forgot password?</CardTitle>
                <CardDescription className="text-white/60">
                  No problem. Enter your email and we'll send you a link to reset your password.
                </CardDescription>
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
                        Sending reset link...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                        Send reset link
                      </>
                    )}
                  </Button>

                  {/* Back to Login */}
                  <div className="flex justify-center">
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to login
                    </Link>
                  </div>
                </form>
              </CardContent>
            </>
          ) : (
            <CardContent className="pt-6">
              {/* Success State */}
              <div className="text-center space-y-4 animate-scale-in">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Check your email</h2>
                <p className="text-sm text-muted-foreground">
                  We've sent a password reset link to <span className="font-semibold text-foreground">{email}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  The link will expire in 24 hours.
                </p>

                {/* Action Buttons */}
                <div className="space-y-2 pt-4">
                  <Button
                    onClick={() => navigate("/login")}
                    className="w-full"
                  >
                    Back to login
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSuccess(false);
                      setEmail("");
                    }}
                    className="w-full"
                  >
                    Try another email
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Need help? <a href="#" className="text-primary hover:underline">Contact support</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
