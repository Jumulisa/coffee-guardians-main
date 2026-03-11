import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Camera, Upload as UploadIcon, ImagePlus, Loader2, Lightbulb, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mlService, BackendPrediction } from "@/lib/ml-service";
import { saveDiagnosis } from "@/lib/db-service";
import { compressImage, needsCompression, isValidImageType, isValidFileSize, formatFileSize, MAX_FILE_SIZE } from "@/lib/image-utils";

// Minimum confidence threshold for accepting diagnosis (70% as per research proposal)
const CONFIDENCE_THRESHOLD = 0.70;

const UploadPage = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<BackendPrediction | null>(null);
  const [lowConfidenceWarning, setLowConfidenceWarning] = useState(false);

  const processFile = useCallback(async (file: File) => {
    // Validate file type
    if (!isValidImageType(file)) {
      setApiError('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size
    if (!isValidFileSize(file)) {
      setApiError(`File too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}`);
      return;
    }

    setApiError(null);
    setLowConfidenceWarning(false);

    let processedFile = file;

    // Compress if needed (> 1MB)
    if (needsCompression(file)) {
      setIsCompressing(true);
      try {
        const compressed = await compressImage(file);
        processedFile = compressed.file;
        console.log(`Image compressed: ${formatFileSize(compressed.originalSize)} → ${formatFileSize(compressed.compressedSize)}`);
      } catch (error) {
        console.error('Compression failed, using original:', error);
      } finally {
        setIsCompressing(false);
      }
    }

    setSelectedFile(processedFile);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(processedFile);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile || !preview || !user) return;
    
    setIsAnalyzing(true);
    setUploadProgress(0);
    setApiError(null);
    setPrediction(null);
    setLowConfidenceWarning(false);

    try {
      // Simulate progress while uploading
      progressIntervalRef.current = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
            return 90;
          }
          return prev + Math.random() * 20;
        });
      }, 200);

      // Call backend API
      const pred = await mlService.predictDisease(selectedFile);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setUploadProgress(100);
      setPrediction(pred);

      // Check confidence threshold (70% as per research proposal)
      if (pred.confidence < CONFIDENCE_THRESHOLD) {
        setLowConfidenceWarning(true);
        setIsAnalyzing(false);
        setApiError(`Low confidence (${Math.round(pred.confidence * 100)}%). Please retake the photo with better lighting and a clearer view of the affected leaf.`);
        return;
      }

      // Try to save diagnosis to database (but don't fail if auth is invalid)
      let diagnosisId = 'temp-' + Date.now();
      let diagnosisDate = new Date().toISOString();
      
      try {
        const diagnosisRecord = await saveDiagnosis(user.id, {
          image_url: preview,
          disease_name: pred.disease,
          disease_name_rw: pred.diseaseRw,
          confidence: pred.confidence,
          severity: pred.severity,
          affected_area: pred.affectedArea,
          treatment_action: pred.treatment.action,
          treatment_data: pred.treatment,
          estimated_cost: pred.treatment.cost || undefined,
        });
        diagnosisId = diagnosisRecord.id;
        diagnosisDate = diagnosisRecord.created_at;
      } catch (saveError) {
        console.warn('Could not save diagnosis to history (user may need to re-login):', saveError);
        // Continue anyway - we'll still show the results
      }

      // Show prediction for 2 seconds, then navigate
      setTimeout(() => {
        setIsAnalyzing(false);
        navigate("/result", { 
          state: { 
            result: {
              id: diagnosisId,
              imageUrl: preview,
              gradcamUrl: pred.gradcamUrl,
              date: diagnosisDate,
              disease: pred.disease,
              diseaseRw: pred.diseaseRw,
              confidence: pred.confidence,
              severity: pred.severity,
              affectedArea: pred.affectedArea,
              treatment: pred.treatment,
            }
          } 
        });
      }, 2000);
    } catch (error) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setIsAnalyzing(false);
      setPrediction(null);
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      setApiError(errorMessage);
      console.error('Analysis error:', error);
    }
  }, [selectedFile, preview, navigate, user]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const clearPreview = useCallback(() => {
    setPreview(null);
  }, []);

  if (isAnalyzing) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 pt-16 bg-gradient-to-b from-[#1a0f0a] via-[#2d1810] to-[#1a0f0a]">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-amber-500 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute inset-2 flex items-center justify-center">
              <Loader2 className="h-12 w-12 text-green-500 animate-spin" />
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-bold text-white">{t("analyzing")}</h2>
            <p className="text-white/60">{t("analyzingDesc")}</p>
          </div>

          {/* Progress Bar */}
          <div className="w-64 space-y-2">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-amber-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-white/60">{Math.round(uploadProgress)}% complete</p>
          </div>

          {/* Timeline */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-white/60">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Image uploaded</span>
            </div>
            <div className={`flex items-center gap-2 ${uploadProgress > 30 ? "text-white" : "text-white/40"}`}>
              {uploadProgress > 30 ? <CheckCircle className="h-4 w-4 text-green-500" /> : <div className="h-4 w-4 rounded-full border-2 border-white/40"></div>}
              <span>Processing image</span>
            </div>
            <div className={`flex items-center gap-2 ${uploadProgress > 70 ? "text-white" : "text-white/40"}`}>
              {uploadProgress > 70 ? <CheckCircle className="h-4 w-4 text-green-500" /> : <div className="h-4 w-4 rounded-full border-2 border-white/40"></div>}
              <span>Analyzing disease</span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-12 pt-20 bg-gradient-to-b from-[#1a0f0a] via-[#2d1810] to-[#1a0f0a] animate-page-enter">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-10 text-center animate-fade-in" style={{ animationDelay: '0.05s' }}>
          <h1 className="mb-3 text-4xl font-bold text-white">{t("uploadTitle")}</h1>
          <p className="text-lg text-white/60">{t("uploadDesc")}</p>
        </div>

        {/* Upload Card */}
        <Card
          className={`mb-6 border-2 border-dashed transition-all duration-300 cursor-pointer animate-slide-up bg-white/5 backdrop-blur-md ${
            isDragging
              ? "border-green-500 bg-green-500/10 shadow-lg"
              : preview
              ? "border-green-500/50 bg-green-500/10"
              : "border-white/20 hover:border-white/40"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !preview && fileInputRef.current?.click()}
        >
          <CardContent className="flex flex-col items-center py-16 px-6">
            {preview ? (
              <div className="w-full space-y-4 animate-scale-in">
                <div className="relative inline-block w-full max-w-xs mx-auto">
                  <img
                    src={preview}
                    alt="Leaf preview"
                    className="w-full rounded-lg object-contain shadow-md border border-white/20"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearPreview();
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-center">
                  <p className="text-sm text-green-400 font-medium mb-1">Image ready for analysis</p>
                  <p className="text-xs text-white/60">Click analyze button to start diagnosis</p>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4 animate-fade-in">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-500/20 text-green-500">
                  <ImagePlus className="h-10 w-10" />
                </div>
                <div>
                  <p className="mb-1 text-lg font-semibold text-white">{t("dragDrop")}</p>
                  <p className="text-white/60">{t("orText")}</p>
                </div>
                <p className="text-xs text-white/40 pt-2">
                  Supported formats: JPG, PNG, WebP (Max 10MB)
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className={`grid gap-4 mb-8 animate-slide-up ${isMobile ? 'grid-cols-2' : 'grid-cols-1'}`}>
          <Button
            variant="outline"
            size="xl"
            className="py-6 border-2 border-white/20 text-white hover:border-green-500 hover:text-green-400 hover:bg-green-500/10 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300 group"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            {t("browseFiles")}
          </Button>
          {isMobile && (
            <Button
              variant="outline"
              size="xl"
              className="py-6 border-2 border-white/20 text-white hover:border-green-500 hover:text-green-400 hover:bg-green-500/10 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300 group"
              onClick={() => cameraInputRef.current?.click()}
            >
              <Camera className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              {t("takePhoto")}
            </Button>
          )}
        </div>


        {/* Analyze Button */}
        {preview && !isAnalyzing && (
          <Button
            size="xl"
            className="w-full py-6 text-lg font-semibold shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] transition-all duration-300 animate-slide-up mb-8 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 group"
            onClick={handleAnalyze}
          >
            <CheckCircle className="mr-2 h-6 w-6 group-hover:scale-110 transition-transform" />
            {t("step2Title")}
          </Button>
        )}

        {/* Error Message */}
        {apiError && !isAnalyzing && (
          <div className="mb-8 p-6 rounded-lg border border-red-500/50 bg-red-500/10 backdrop-blur-md animate-fade-in">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-red-500/20">
                <AlertCircle className="h-6 w-6 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-400 mb-2">
                  {apiError.includes("leaf") ? (language === "rw" ? "Ntabwo ari Ikibabi" : "Not a Coffee Leaf") : (language === "rw" ? "Ikosa" : "Error")}
                </h3>
                <p className="text-white/80 mb-4">{apiError}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setApiError(null);
                    setPreview(null);
                    setSelectedFile(null);
                  }}
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  {language === "rw" ? "Gerageza Ibindi" : "Try Another Image"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Prediction Summary */}
        {prediction && !isAnalyzing && (
          <div className="mb-8 p-6 rounded-lg border border-green-500/30 bg-green-500/10 backdrop-blur-md animate-fade-in">
            <h2 className="text-xl font-bold mb-2 text-green-400">Prediction Summary</h2>
            <div className="mb-2 text-white">
              <span className="font-semibold">Disease:</span> {language === "rw" ? prediction.diseaseRw : prediction.disease}
            </div>
            <div className="mb-2 text-white">
              <span className="font-semibold">Confidence:</span> {(prediction.confidence * 100).toFixed(1)}%
            </div>
            <div className="mb-2 text-white">
              <span className="font-semibold">Severity:</span> {prediction.severity}
            </div>
            <div className="mb-2 text-white">
              <span className="font-semibold">Recommendation:</span> {language === "rw" ? prediction.treatment.actionRw : prediction.treatment.action}
            </div>
            <div className="mb-2 text-white">
              <span className="font-semibold">Estimated Cost:</span> {prediction.treatment.cost}
            </div>
            <div className="mb-2 text-white">
              <span className="font-semibold">Other Possible Diseases:</span>
              <ul className="list-disc ml-6 text-white/80">
                {prediction.allPredictions && Object.entries(prediction.allPredictions).map(([disease, conf]) => (
                  <li key={disease}>{disease}: {(conf * 100).toFixed(1)}%</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="space-y-3 animate-slide-up">
          <div className="flex items-start gap-3 rounded-lg bg-blue-500/10 border border-blue-500/30 p-4">
            <Lightbulb className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-blue-300 text-sm">Pro Tips for Best Results:</p>
              <p className="text-sm text-blue-200/80 mt-1">{t("uploadTip")}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm text-white/60">
            <p className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 bg-green-500 rounded-full"></span>
              Take clear photos in good lighting
            </p>
            <p className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 bg-green-500 rounded-full"></span>
              Include affected leaf areas in the frame
            </p>
            <p className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 bg-green-500 rounded-full"></span>
              Avoid shadows and reflections on the leaf
            </p>
          </div>
        </div>

        {/* Hidden File Inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </main>
  );
};

export default UploadPage;
