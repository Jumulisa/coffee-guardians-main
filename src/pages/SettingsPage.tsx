import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, Bell, Shield, Languages, Loader2, Settings, CheckCircle, Download, LogOut, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { updateUserSettings } from "@/lib/db-service";

const SettingsPage = () => {
  const { user, logout, updateProfile } = useAuth();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateProfile({
        full_name: formData.full_name,
      });
      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLanguageChange = async (newLanguage: "en" | "rw") => {
    try {
      setLanguage(newLanguage);
      if (user) {
        await updateUserSettings(user.id, { language: newLanguage });
      }
    } catch (error) {
      console.error("Error updating language preference:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <main className="min-h-screen px-4 py-12 pt-20 bg-gradient-to-b from-[#1a0f0a] via-[#2d1810] to-[#1a0f0a]">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-white/60">Manage your account and preferences</p>
        </div>

        {/* Profile Section */}
        <Card className="mb-6 border-0 shadow-xl animate-slide-up bg-white/5 backdrop-blur-md border border-white/10">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="h-5 w-5 text-green-500" />
              Profile Information
            </CardTitle>
            <CardDescription className="text-white/60">Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Success Message */}
              {successMessage && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-sm text-green-400">
                  {successMessage}
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-white/80">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="bg-white/5 border-white/20 text-white"
                  />
                ) : (
                  <div className="px-4 py-2 bg-white/5 rounded-lg text-white font-medium">
                    {formData.full_name || "Not set"}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-white/80">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <div className="px-4 py-2 bg-white/5 rounded-lg text-white/60">
                  {formData.email}
                </div>
                <p className="text-xs text-white/40">Email cannot be changed</p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 shadow-[0_0_10px_rgba(34,197,94,0.3)] hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] transition-all duration-300 group"
                  >
                    <Settings className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button 
                      onClick={handleSave} 
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 shadow-[0_0_10px_rgba(34,197,94,0.3)] hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] transition-all duration-300 group"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          full_name: user?.full_name || "",
                          email: user?.email || "",
                        });
                      }}
                      className="flex-1 border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card className="mb-6 border-0 shadow-xl animate-slide-up bg-white/5 backdrop-blur-md border border-white/10" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="border-b border-white/10">
            <CardTitle className="flex items-center gap-2 text-white">
              <Lock className="h-5 w-5 text-green-500" />
              Security
            </CardTitle>
            <CardDescription className="text-white/60">Manage your security settings</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div>
                <p className="font-semibold text-green-400">Password</p>
                <p className="text-sm text-green-300/80">Last changed 30 days ago</p>
              </div>
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                Change Password
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div>
                <p className="font-semibold text-blue-400">Two-Factor Authentication</p>
                <p className="text-sm text-blue-300/80">Not enabled</p>
              </div>
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                Enable 2FA
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card className="mb-6 border-0 shadow-xl animate-slide-up bg-white/5 backdrop-blur-md border border-white/10" style={{ animationDelay: "0.2s" }}>
          <CardHeader className="border-b border-white/10">
            <CardTitle className="flex items-center gap-2 text-white">
              <Bell className="h-5 w-5 text-green-500" />
              Notifications
            </CardTitle>
            <CardDescription className="text-white/60">Manage notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            <label className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-sm font-medium text-white">Disease alerts</span>
            </label>
            <label className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-sm font-medium text-white">Weekly reports</span>
            </label>
            <label className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm font-medium text-white">Product recommendations</span>
            </label>
          </CardContent>
        </Card>

        {/* Language Section */}
        <Card className="mb-6 border-0 shadow-xl animate-slide-up bg-white/5 backdrop-blur-md border border-white/10" style={{ animationDelay: "0.25s" }}>
          <CardHeader className="border-b border-white/10">
            <CardTitle className="flex items-center gap-2 text-white">
              <Languages className="h-5 w-5 text-green-500" />
              Language
            </CardTitle>
            <CardDescription className="text-white/60">Choose your preferred language</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            <label className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
              <input 
                type="radio" 
                name="language"
                value="en"
                checked={language === "en"}
                onChange={(e) => handleLanguageChange(e.target.value as "en" | "rw")}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-white">English</span>
            </label>
            <label className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
              <input 
                type="radio" 
                name="language"
                value="rw"
                checked={language === "rw"}
                onChange={(e) => handleLanguageChange(e.target.value as "en" | "rw")}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-white">Kinyarwanda (Icyarwanda)</span>
            </label>
          </CardContent>
        </Card>

        {/* Privacy Section */}
        <Card className="mb-6 border-0 shadow-xl animate-slide-up bg-white/5 backdrop-blur-md border border-white/10" style={{ animationDelay: "0.3s" }}>
          <CardHeader className="border-b border-white/10">
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="h-5 w-5 text-green-500" />
              Privacy
            </CardTitle>
            <CardDescription className="text-white/60">Manage your privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            <label className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-sm font-medium text-white">Make diagnosis history private</span>
            </label>
            <label className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm font-medium text-white">Allow data sharing for research</span>
            </label>
            <Button
              variant="outline"
              className="w-full text-white border-2 border-white/20 hover:bg-white/10 hover:border-white/40 transition-all duration-300"
              onClick={() => navigate("/legal")}
            >
              View Privacy Policy & EULA
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-0 shadow-xl bg-red-500/10 backdrop-blur-md border border-red-500/30 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <CardHeader className="border-b border-red-500/30">
            <CardTitle className="text-red-400">Danger Zone</CardTitle>
            <CardDescription className="text-red-300/80">Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            <Button variant="outline" className="w-full text-white border-2 border-white/20 hover:bg-white/10 hover:border-white/40 transition-all duration-300 group">
              <Download className="mr-2 h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
              Download My Data
            </Button>
            <Button
              variant="destructive"
              className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-[0_0_10px_rgba(239,68,68,0.3)] hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all duration-300 group"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              Logout
            </Button>
            <Button variant="outline" className="w-full text-red-400 border-2 border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50 transition-all duration-300 group">
              <Trash2 className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default SettingsPage;
