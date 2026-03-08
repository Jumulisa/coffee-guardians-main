import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDiagnosisHistory, deleteDiagnosis, TreatmentData } from "@/lib/db-service";
import { Camera, Trash2, Leaf, ArrowRight, Calendar, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface DiagnosisRecord {
  id: string;
  image_url: string;
  disease_name: string;
  disease_name_rw?: string;
  confidence: number;
  severity: string;
  affected_area: number;
  treatment_action: string;
  treatment_data?: string; // JSON string
  estimated_cost?: string;
  created_at: string;
}

// Helper to parse treatment data from stored JSON
function parseTreatmentData(record: DiagnosisRecord): TreatmentData {
  if (record.treatment_data) {
    try {
      return JSON.parse(record.treatment_data);
    } catch {
      // Fallback if JSON parsing fails
    }
  }
  // Create minimal treatment object from available data
  return {
    action: record.treatment_action,
    actionRw: record.treatment_action,
    instructions: 'Please consult the original diagnosis for detailed instructions.',
    instructionsRw: 'Banza urebe isuzuma ryambere kugira ngo ubone amabwiriza arambuye.',
    cost: record.estimated_cost || 'Contact local agricultural shop',
    alternative: 'Consult with RAB extension officer for alternative treatments.',
    alternativeRw: 'Baza umujyanama w\'ubuhinzi wa RAB ku buvuzi busimbura.',
  };
}

const severityColors = {
  mild: "bg-green-500 text-white",
  moderate: "bg-yellow-500 text-white",
  severe: "bg-red-500 text-white",
};

const severityIcons = {
  mild: CheckCircle,
  moderate: AlertCircle,
  severe: AlertCircle,
};

const HistoryPage = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [history, setHistory] = useState<DiagnosisRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Load diagnosis history from Supabase
  useEffect(() => {
    const loadHistory = async () => {
      if (!user) return;
      try {
        const data = await getDiagnosisHistory(user.id);
        setHistory(data || []);
      } catch (error) {
        console.error('Error loading diagnosis history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [user]);

  const handleDelete = async (diagnosisId: string) => {
    try {
      await deleteDiagnosis(diagnosisId);
      setHistory(history.filter(h => h.id !== diagnosisId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting diagnosis:', error);
    }
  };

  const stats = {
    total: history.length,
    severe: history.filter((h) => h.severity === "severe").length,
    moderate: history.filter((h) => h.severity === "moderate").length,
    mild: history.filter((h) => h.severity === "mild").length,
  };

  return (
    <main className="min-h-screen px-4 py-12 pt-20 bg-gradient-to-b from-[#1a0f0a] via-[#2d1810] to-[#1a0f0a]">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold text-white">{t("historyTitle")}</h1>
            <p className="text-white/60 mt-2">Track and manage your diagnosis history</p>
          </div>
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteConfirm(!deleteConfirm)}
              className="text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="mr-1 h-4 w-4" />
              {t("clearHistory")}
            </Button>
          )}
        </div>

      {/* Delete Confirmation */}
        {deleteConfirm && (
          <Card className="mb-6 border-red-500/50 bg-red-500/10 backdrop-blur-md animate-shake">
            <CardContent className="pt-6 space-y-4">
              <p className="font-semibold text-white">Delete this diagnosis record? This action cannot be undone.</p>
              <div className="flex gap-3">
                <Button 
                  onClick={() => handleDelete(deleteConfirm)} 
                  variant="destructive" 
                  className="flex-1 bg-red-600 hover:bg-red-700 shadow-[0_0_10px_rgba(239,68,68,0.3)] hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all duration-300"
                >
                  Delete
                </Button>
                <Button
                  onClick={() => setDeleteConfirm(null)}
                  variant="outline"
                  className="flex-1 border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-24">
            <div className="space-y-4 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-green-500 mx-auto" />
              <p className="text-white/60">Loading diagnosis history...</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {history.length > 0 && (
          <div className="grid grid-cols-4 gap-3 mb-8 animate-slide-up">
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-400">{stats.total}</p>
              <p className="text-xs text-blue-300">Total Scans</p>
            </div>
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-red-400">{stats.severe}</p>
              <p className="text-xs text-red-300">Severe</p>
            </div>
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-yellow-400">{stats.moderate}</p>
              <p className="text-xs text-yellow-300">Moderate</p>
            </div>
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-400">{stats.mild}</p>
              <p className="text-xs text-green-300">Mild</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {history.length === 0 ? (
          <div className="py-24 text-center animate-fade-in">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-500/20 text-green-500 mb-6">
              <Leaf className="h-10 w-10" />
            </div>
            <p className="mb-8 text-lg text-white/60">{t("historyEmpty")}</p>
            <Link to="/upload">
              <Button size="xl" className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:shadow-[0_0_25px_rgba(34,197,94,0.6)] transition-all duration-300 group">
                <Camera className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                {t("ctaButton")}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        ) : (
          <div>
            {/* History List */}
            <div className="space-y-3 animate-slide-up">
              {history.map((item, index) => (
                <div
                  key={item.id}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  className="block animate-slide-up"
                >
                  <Link
                    to="/result"
                    state={{ 
                      result: {
                        id: item.id,
                        imageUrl: item.image_url,
                        date: item.created_at,
                        disease: item.disease_name,
                        diseaseRw: item.disease_name_rw || item.disease_name,
                        confidence: item.confidence,
                        severity: item.severity,
                        affectedArea: item.affected_area,
                        treatment: parseTreatmentData(item),
                      }
                    }}
                    className="block"
                  >
                    <Card className="hover:shadow-lg hover:border-green-500/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden group bg-white/5 backdrop-blur-md border-white/10">
                      <CardContent className="p-0 flex items-center">
                        {/* Image */}
                        {item.image_url && (
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-white/10">
                            <img
                              src={item.image_url}
                              alt="Diagnosis"
                              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 p-4">
                          <div className="flex items-center justify-between gap-4">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-white truncate group-hover:text-green-400 transition-colors">
                                {item.disease_name}
                              </h3>
                              <div className="flex items-center gap-2 mt-1 text-xs text-white/60">
                                <Calendar className="h-3 w-3" />
                                {new Date(item.created_at).toLocaleDateString(language === "rw" ? "rw-RW" : "en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}{" "}
                                •{" "}
                                {new Date(item.created_at).toLocaleTimeString(language === "rw" ? "rw-RW" : "en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </div>

                            {/* Severity Badge */}
                            <div className="flex flex-col items-end gap-2 shrink-0">
                              <Badge className={`${severityColors[item.severity as keyof typeof severityColors]} flex items-center gap-1`}>
                                {(() => { const Icon = severityIcons[item.severity as keyof typeof severityIcons]; return <Icon className="h-3 w-3" />; })()} {t(item.severity as any)}
                              </Badge>
                              <span className="text-xs font-medium text-muted-foreground">
                                {Math.round(item.confidence)}% confidence
                              </span>
                            </div>

                            {/* Arrow */}
                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors ml-2" />
                          </div>

                          {/* Affected Area Progress */}
                          <div className="mt-3 space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Affected area</span>
                              <span className="font-semibold text-foreground">{item.affected_area}%</span>
                            </div>
                            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  item.severity === "mild"
                                    ? "bg-green-500"
                                    : item.severity === "moderate"
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                                style={{ width: `${item.affected_area}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setDeleteConfirm(item.id);
                    }}
                    className="mt-1 text-xs text-destructive hover:text-destructive/80 transition-colors"
                  >
                    <Trash2 className="h-3 w-3 inline mr-1" />
                    Delete
                  </button>
                </div>
              ))}
            </div>

            {/* Bottom Action */}
            <div className="mt-8 flex justify-center animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <Link to="/upload">
                <Button size="xl" className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:shadow-[0_0_25px_rgba(34,197,94,0.6)] transition-all duration-300 group">
                  <Camera className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  New Scan
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default HistoryPage;
