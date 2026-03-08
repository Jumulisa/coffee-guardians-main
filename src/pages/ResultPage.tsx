import { useLocation, useNavigate, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DiagnosisResult } from "@/lib/mock-data";
import { Camera, ChevronDown, ChevronUp, BookOpen, Leaf, AlertCircle, CheckCircle, Clock, Droplet, Shield, FlaskConical, Calendar, Package, Info, AlertTriangle, Zap } from "lucide-react";
import { useState } from "react";

// Disease educational descriptions
const diseaseDescriptions: Record<string, {
  description: string;
  descriptionRw: string;
  spread: string;
  spreadRw: string;
  symptoms: string[];
  symptomsRw: string[];
}> = {
  "Coffee Leaf Rust": {
    description: "Coffee Leaf Rust is caused by the fungus Hemileia vastatrix. It is one of the most devastating diseases affecting coffee worldwide, causing significant crop losses if untreated.",
    descriptionRw: "Imvura y'Ibabi ry'Ikawa iterwa na fungus Hemileia vastatrix. Ni imwe mu ndwara zangiza cyane ikawa ku isi yose, iteza igihombo kinini niba itavuwe.",
    spread: "Spreads through wind-blown spores, especially during wet and humid conditions. Rain splashes can spread spores between plants.",
    spreadRw: "Ikwirakwira binyuze mu myuka itwara umuyaga, cyane cyane mu bihe by'imvura n'ubuhehere. Amazi y'imvura ashobora gukwirakwiza indwara hagati y'ibimera.",
    symptoms: [
      "Yellow-orange powdery spots on leaf undersides",
      "Leaves turn yellow and fall prematurely",
      "Reduced photosynthesis and plant vigor",
      "Severe defoliation in heavy infections"
    ],
    symptomsRw: [
      "Udukara tw'umuhondo-oranje ku ruhande rwo munsi rw'amababi",
      "Amababi ahinduka umuhondo agwa mbere y'igihe",
      "Kugabanuka kw'ifotosintezi n'imbaraga z'igihingwa",
      "Kugwa cyane kw'amababi ku kwanduza gukabije"
    ]
  },
  "Coffee Berry Disease": {
    description: "Coffee Berry Disease (CBD) is caused by the fungus Colletotrichum kahawae. It primarily attacks developing coffee berries, causing them to rot and fall off.",
    descriptionRw: "Indwara y'Imbuto z'Ikawa (CBD) iterwa na fungus Colletotrichum kahawae. Itera cyane imbuto z'ikawa zikiri nto, igatuma zibora no kugwa.",
    spread: "Spreads through rain splash and wind during wet weather. The fungus survives on infected berries and plant debris.",
    spreadRw: "Ikwirakwira binyuze mu mazi y'imvura n'umuyaga mu gihe cy'imvura. Fungus ibamo ku mbuto zandujwe no ku bisigazwa by'ibimera.",
    symptoms: [
      "Dark, sunken lesions on green berries",
      "Berries turn black and mummify",
      "Premature berry drop",
      "Can cause 50-80% crop loss if untreated"
    ],
    symptomsRw: [
      "Ibikomere by'umukara, byinjiye ku mbuto z'icyatsi",
      "Imbuto zihinduka umukara zikabarika",
      "Imbuto zigwa mbere y'igihe",
      "Ishobora gutera igihombo cya 50-80% niba itavuwe"
    ]
  },
  "Cercospora Leaf Spot": {
    description: "Cercospora Leaf Spot is caused by the fungus Cercospora coffeicola. It causes circular brown spots on leaves and can affect both leaves and berries.",
    descriptionRw: "Udukara tw'Ibabi (Cercospora) iterwa na fungus Cercospora coffeicola. Itera udukara turungurumbye tw'ikigina ku mababi kandi ishobora gukura ku mababi no ku mbuto.",
    spread: "Spreads through wind and rain. Favored by high humidity, poor nutrition, and stressed plants.",
    spreadRw: "Ikwirakwira binyuze mu muyaga n'imvura. Ikunda ubuhehere bwinshi, ifumbire nke, n'ibimera bifite ibibazo.",
    symptoms: [
      "Circular brown spots with gray centers",
      "Yellow halo around spots",
      "Leaf yellowing and drop",
      "Can affect berry quality"
    ],
    symptomsRw: [
      "Udukara turungurumbye tw'ikigina dufite hagati y'icyeru",
      "Uruziga rw'umuhondo ku mpande z'udukara",
      "Amababi ahinduka umuhondo agagwa",
      "Bishobora kugira ingaruka ku bwiza bw'imbuto"
    ]
  },
  "Coffee Leaf Miner": {
    description: "Coffee Leaf Miner is caused by the small moth Leucoptera coffeella. The larvae tunnel through leaves, creating visible mines that damage the leaf tissue.",
    descriptionRw: "Umudubu w'Ibabi ry'Ikawa uterwa n'inyenzi nto Leucoptera coffeella. Amage yayo acukura mu mababi, agatera imyobo igaragara yangiza amababi.",
    spread: "Adult moths lay eggs on leaves. Larvae hatch and burrow into leaf tissue. Multiple generations can occur per year.",
    spreadRw: "Inyenzi z'abakuru zitera amagi ku mababi. Amage akura akinjira mu mababi. Impuzandengo nyinshi zishobora kuba buri mwaka.",
    symptoms: [
      "Serpentine mines visible on leaf surface",
      "Brown, papery patches where larvae fed",
      "Premature leaf drop in severe cases",
      "Reduced photosynthetic capacity"
    ],
    symptomsRw: [
      "Imyobo igaragara ku gice cyo hejuru cy'ibabi",
      "Udukara tw'ikigina, amababi ameze nk'impapuro aho amage yariye",
      "Amababi agwa mbere y'igihe ku bihe bikomeye",
      "Kugabanuka kw'ubushobozi bwo gukora ifotosintezi"
    ]
  },
  "Healthy": {
    description: "Your coffee plant shows no signs of disease. The leaves appear healthy with normal color and structure. Continue with regular monitoring and good agricultural practices.",
    descriptionRw: "Igihingwa cyawe cy'ikawa ntigaragaza ibimenyetso by'indwara. Amababi agaragara ameze neza afite ibara n'imiterere bisanzwe. Komeza kureba buri gihe no gukora ubuhinzi bwiza.",
    spread: "Not applicable - plant is healthy",
    spreadRw: "Ntabwo bikoreshwa - igihingwa kimeze neza",
    symptoms: [
      "Dark green, glossy leaves",
      "No spots, lesions, or discoloration",
      "Normal leaf size and shape",
      "Vigorous growth"
    ],
    symptomsRw: [
      "Amababi y'icyatsi cyijimye, abengerana",
      "Nta dukara, ibikomere, cyangwa guhinduka ibara",
      "Ingano n'ishusho bisanzwe by'amababi",
      "Gukura neza"
    ]
  }
};

// Detailed treatment data for each disease
const diseaseDetails: Record<string, {
  products: string[];
  productsRw: string[];
  timing: string;
  timingRw: string;
  prevention: string[];
  preventionRw: string[];
}> = {
  "Coffee Leaf Rust": {
    products: [
      "Copper hydroxide (2-3g/L water)",
      "Bordeaux mixture (100g copper sulfate + 100g lime in 10L water)",
      "Systemic fungicides like Azoxystrobin for severe cases",
    ],
    productsRw: [
      "Copper hydroxide (2-3g/L amazi)",
      "Bordeaux mixture (100g copper sulfate + 100g calcium mu mazi 10L)",
      "Umuti wa fungicide nka Azoxystrobin ku bihe bikomeye",
    ],
    timing: "Apply every 14 days during rainy season",
    timingRw: "Shyira buri minsi 14 mu gihe cy'imvura",
    prevention: [
      "Plant resistant coffee varieties when possible",
      "Maintain proper plant spacing for air circulation",
      "Remove and destroy infected leaves",
      "Ensure good drainage to reduce humidity",
    ],
    preventionRw: [
      "Tera ubwoko bw'ikawa buhanganira indwara iyo bishoboka",
      "Shyira ahantu hakwiriye hagati y'ibimera kugira ngo umuyaga winjire",
      "Kuraho no gutwika amababi yandujwe",
      "Menya neza ko amazi arasohoka kugira ngo ubuhehere bukendera",
    ],
  },
  "Coffee Leaf Miner": {
    products: [
      "Neem oil spray (organic option)",
      "Spinosad-based insecticides",
      "Imidacloprid for severe infestations",
    ],
    productsRw: [
      "Amavuta ya Neem (uburyo busanzwe)",
      "Umuti wishe udukoko ushingiye kuri Spinosad",
      "Imidacloprid ku kwanduza gukabije",
    ],
    timing: "Apply at first sign of mines, repeat every 7-10 days",
    timingRw: "Shyira igihe cyambere imyobo igaragaye, subiramo buri minsi 7-10",
    prevention: [
      "Regular monitoring for early detection",
      "Remove heavily infested leaves and destroy them",
      "Encourage natural predators (parasitic wasps)",
      "Maintain healthy, vigorous plants",
    ],
    preventionRw: [
      "Gukurikirana buri gihe kugira ngo umenye kare",
      "Kuraho amababi yandujwe cyane no kuyatwika",
      "Shishikariza abanzi basanzwe (inzige z'inyenzi)",
      "Gumana ibimera bifite ubuzima bwiza, bikomeye",
    ],
  },
  "Cercospora Leaf Spot": {
    products: [
      "Copper oxychloride (3g/L water)",
      "Mancozeb fungicide",
      "Propiconazole for systemic protection",
    ],
    productsRw: [
      "Copper oxychloride (3g/L amazi)",
      "Umuti wa fungicide Mancozeb",
      "Propiconazole ku kurinda sisitemu",
    ],
    timing: "Apply preventively before wet season, repeat every 21 days",
    timingRw: "Shyira mbere y'igihe cy'imvura, subiramo buri minsi 21",
    prevention: [
      "Improve air circulation through proper pruning",
      "Avoid overhead irrigation that wets leaves",
      "Provide adequate shade in hot climates",
      "Remove and destroy infected plant debris",
    ],
    preventionRw: [
      "Kunoza umuyaga ubinyujije mu gukata neza",
      "Irinde kuvomera hejuru bituma amababi aba anyonje",
      "Tanga igitutu gihagije mu turere dushyushye",
      "Kuraho no gutwika ibisigazwa by'ibimera byandujwe",
    ],
  },
  "Coffee Berry Disease": {
    products: [
      "Copper-based fungicides (apply before flowering)",
      "Chlorothalonil spray",
      "Carbendazim for severe infections",
    ],
    productsRw: [
      "Fungicide ishingiye kuri copper (shyira mbere yo gukura indabo)",
      "Spray ya Chlorothalonil",
      "Carbendazim ku kwanduza gukabije",
    ],
    timing: "Apply before flowering, repeat every 14-21 days during fruit development",
    timingRw: "Shyira mbere yo gukura indabo, subiramo buri minsi 14-21 mu gihe imbuto zikura",
    prevention: [
      "Plant resistant varieties (SL28, Ruiru 11)",
      "Remove and destroy infected berries",
      "Proper shade management",
      "Good sanitation practices",
    ],
    preventionRw: [
      "Tera ubwoko buhanganira (SL28, Ruiru 11)",
      "Kuraho no gutwika imbuto zandujwe",
      "Gucunga igitutu neza",
      "Isuku nziza",
    ],
  },
  "Healthy": {
    products: [],
    productsRw: [],
    timing: "No treatment needed - continue regular care",
    timingRw: "Nta muti ukenewe - komeza kwita ku bimera",
    prevention: [
      "Regular inspection of plants",
      "Proper nutrition management",
      "Adequate spacing between plants",
      "Good drainage systems",
    ],
    preventionRw: [
      "Gusuzuma ibimera buri gihe",
      "Gucunga neza ifumbire",
      "Gutandukanya neza ibimera",
      "Uburyo bwiza bwo gukuramo amazi",
    ],
  },
};

const severityConfig = {
  mild: { 
    label: "mild", 
    color: "bg-green-500 text-white", 
    icon: CheckCircle,
    urgency: "monitor",
    urgencyLabel: "Monitor & Prevent",
    urgencyLabelRw: "Kureba & Kwirinda",
    urgencyColor: "bg-green-500/20 border-green-500",
    urgencyDesc: "Low risk - Can be managed with regular monitoring. Apply preventive treatment within the next 1-2 weeks.",
    urgencyDescRw: "Ingaruka nke - Bishobora gucungwa mu kureba buri gihe. Shyira umuti ukumira mu byumweru 1-2 biri imbere.",
    areaDesc: "Less than 25% of the leaf is affected",
    areaDescRw: "Munsi ya 25% y'ibabi byakubiwe"
  },
  moderate: { 
    label: "moderate", 
    color: "bg-yellow-500 text-white", 
    icon: AlertCircle,
    urgency: "act-soon",
    urgencyLabel: "Act Within 3-5 Days",
    urgencyLabelRw: "Kora mu minsi 3-5",
    urgencyColor: "bg-yellow-500/20 border-yellow-500",
    urgencyDesc: "Medium risk - Disease is spreading. Apply treatment within 3-5 days to prevent further damage.",
    urgencyDescRw: "Ingaruka yo hagati - Indwara irakwira. Shyira umuti mu minsi 3-5 kugira ngo wirinde ibindi byangiritse.",
    areaDesc: "25-50% of the leaf is affected",
    areaDescRw: "25-50% y'ibabi byakubiwe"
  },
  severe: { 
    label: "severe", 
    color: "bg-red-500 text-white", 
    icon: AlertTriangle,
    urgency: "act-now",
    urgencyLabel: "Act Immediately!",
    urgencyLabelRw: "Kora Ubu Nyine!",
    urgencyColor: "bg-red-500/20 border-red-500",
    urgencyDesc: "High risk - Requires immediate action. Apply treatment TODAY. Remove and destroy severely affected leaves to prevent spread.",
    urgencyDescRw: "Ingaruka nyinshi - Bisaba gukora vuba. Shyira umuti UYU MUNSI. Kuraho no gutwika amababi yakubiwe cyane kugira ngo wirinde ikwirakwira.",
    areaDesc: "More than 50% of the leaf is affected",
    areaDescRw: "Hejuru ya 50% y'ibabi byakubiwe"
  },
};

const ResultPage = () => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [showAlt, setShowAlt] = useState(false);


  const result = (location.state as { result?: DiagnosisResult })?.result;

  // Fallback: show error if result is missing or missing key fields
  const missingFields = !result || !result.disease || !result.confidence || !result.severity || !result.treatment;
  if (missingFields) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 pt-16 bg-gradient-to-b from-[#1a0f0a] via-[#2d1810] to-[#1a0f0a]">
        <div className="text-center animate-fade-in">
          <p className="mb-4 text-red-400 font-semibold">No valid diagnosis data received from the model API.</p>
          <p className="mb-4 text-white/60">Please try again, check your network, or contact support if the problem persists.</p>
          <Link to="/upload">
            <Button className="bg-green-600 hover:bg-green-700">Try Again</Button>
          </Link>
        </div>
      </main>
    );
  }

  const sev = severityConfig[result.severity];
  const confidencePercent = Math.round(result.confidence * 100);
  const confidenceLabel =
    result.confidence >= 0.8
      ? t("confidenceHigh")
      : result.confidence >= 0.5
      ? t("confidenceMedium")
      : t("confidenceLow");

  const diseaseName = language === "rw" ? result.diseaseRw : result.disease;
  const action = language === "rw" ? result.treatment.actionRw : result.treatment.action;
  const instructions = language === "rw" ? result.treatment.instructionsRw : result.treatment.instructions;
  const alternative = language === "rw" ? result.treatment.alternativeRw : result.treatment.alternative;

  // Get detailed treatment info for this disease
  const details = diseaseDetails[result.disease] || diseaseDetails["Healthy"];
  const products = language === "rw" ? details.productsRw : details.products;
  const timing = language === "rw" ? details.timingRw : details.timing;
  const prevention = language === "rw" ? details.preventionRw : details.prevention;
  const isHealthy = result.disease === "Healthy" || result.disease.toLowerCase().includes("healthy");

  // Get disease educational description
  const diseaseInfo = diseaseDescriptions[result.disease] || diseaseDescriptions["Healthy"];
  const description = language === "rw" ? diseaseInfo.descriptionRw : diseaseInfo.description;
  const spread = language === "rw" ? diseaseInfo.spreadRw : diseaseInfo.spread;
  const symptoms = language === "rw" ? diseaseInfo.symptomsRw : diseaseInfo.symptoms;

  // Get urgency info
  const urgencyLabel = language === "rw" ? sev.urgencyLabelRw : sev.urgencyLabel;
  const urgencyDesc = language === "rw" ? sev.urgencyDescRw : sev.urgencyDesc;
  const areaDesc = language === "rw" ? sev.areaDescRw : sev.areaDesc;

  return (
    <main className="min-h-screen px-4 py-8 pt-20 bg-gradient-to-b from-[#1a0f0a] via-[#2d1810] to-[#1a0f0a]">
      <div className="container mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl font-bold text-white mb-2">{t("diagnosisResult")}</h1>
          <p className="text-white/60">Analysis complete - See recommendations below</p>
        </div>

        {/* Urgency Alert - MOST IMPORTANT CARD */}
        {!isHealthy && (
          <Card className={`border-2 ${sev.urgencyColor} shadow-xl overflow-hidden animate-slide-up`} style={{ animationDelay: "0.05s" }}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${result.severity === 'severe' ? 'bg-red-500' : result.severity === 'moderate' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl font-bold mb-2 ${result.severity === 'severe' ? 'text-red-400' : result.severity === 'moderate' ? 'text-yellow-400' : 'text-green-400'}`}>
                    {urgencyLabel}
                  </h3>
                  <p className="text-white/80 mb-3">{urgencyDesc}</p>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <AlertCircle className="h-4 w-4" />
                    <span>{areaDesc}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Disease Diagnosis Card */}
        <Card className="border-0 shadow-xl overflow-hidden animate-slide-up bg-white/5 backdrop-blur-md border border-white/10">
          <CardContent className="p-0">
            {result.imageUrl && (
              <div className="relative">
                <img
                  src={result.imageUrl}
                  alt="Diagnosed leaf"
                  className="w-full object-cover max-h-64"
                />
                {/* Visual Overlay - Simulated affected area highlight */}
                {!isHealthy && result.affectedArea > 0 && (
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Semi-transparent overlay with gradient showing affected areas */}
                    <div 
                      className={`absolute inset-0 ${
                        result.severity === 'severe' ? 'bg-gradient-to-br from-red-500/30 via-transparent to-red-500/20' :
                        result.severity === 'moderate' ? 'bg-gradient-to-br from-yellow-500/25 via-transparent to-yellow-500/15' :
                        'bg-gradient-to-br from-green-500/15 via-transparent to-green-500/10'
                      }`}
                    />
                    {/* Animated scan lines to indicate analysis */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className={`absolute left-0 right-0 h-0.5 ${
                        result.severity === 'severe' ? 'bg-red-400/50' :
                        result.severity === 'moderate' ? 'bg-yellow-400/50' : 'bg-green-400/50'
                      } animate-scan-slow`} style={{ top: '30%' }} />
                      <div className={`absolute left-0 right-0 h-0.5 ${
                        result.severity === 'severe' ? 'bg-red-400/30' :
                        result.severity === 'moderate' ? 'bg-yellow-400/30' : 'bg-green-400/30'
                      } animate-scan-slow`} style={{ top: '60%', animationDelay: '0.5s' }} />
                    </div>
                    {/* Corner markers indicating analysis area */}
                    <div className={`absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 ${
                      result.severity === 'severe' ? 'border-red-400' :
                      result.severity === 'moderate' ? 'border-yellow-400' : 'border-green-400'
                    }`} />
                    <div className={`absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 ${
                      result.severity === 'severe' ? 'border-red-400' :
                      result.severity === 'moderate' ? 'border-yellow-400' : 'border-green-400'
                    }`} />
                    <div className={`absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 ${
                      result.severity === 'severe' ? 'border-red-400' :
                      result.severity === 'moderate' ? 'border-yellow-400' : 'border-green-400'
                    }`} />
                    <div className={`absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 ${
                      result.severity === 'severe' ? 'border-red-400' :
                      result.severity === 'moderate' ? 'border-yellow-400' : 'border-green-400'
                    }`} />
                    {/* Affected area percentage indicator */}
                    <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
                      <p className={`text-sm font-bold ${
                        result.severity === 'severe' ? 'text-red-400' :
                        result.severity === 'moderate' ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {result.affectedArea}% {language === "rw" ? "byakubiwe" : "affected"}
                      </p>
                    </div>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <Badge className={`${sev.color} text-lg px-4 py-2 shadow-lg flex items-center gap-1`}>
                    <sev.icon className="h-4 w-4" /> {t(sev.label as any)}
                  </Badge>
                </div>
              </div>
            )}
            <div className="p-6 border-t border-white/10 bg-white/5">
              <p className="text-sm uppercase tracking-widest text-white/60 font-semibold mb-2">{t("disease")}</p>
              <h2 className="text-3xl font-bold text-white mb-4">{diseaseName}</h2>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/60 mb-1">Confidence</p>
                  <p className="text-2xl font-bold text-green-400">{confidencePercent}%</p>
                  <p className="text-xs text-white/60 mt-1">{confidenceLabel}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/60 mb-1">Affected Area</p>
                  <p className="text-2xl font-bold text-orange-400">{result.affectedArea}%</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/60 mb-1">Severity</p>
                  <Badge className={`${sev.color} text-sm px-2 py-1 block text-center`}>
                    {t(sev.label as any)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disease Education Card - Understanding the Disease */}
        <Card className="border-0 shadow-xl animate-slide-up bg-white/5 backdrop-blur-md border border-white/10" style={{ animationDelay: "0.08s" }}>
          <CardHeader className="pb-3 bg-cyan-500/10">
            <CardTitle className="flex items-center gap-2 text-xl text-white">
              <Info className="h-5 w-5 text-cyan-500" />
              {language === "rw" ? "Menya Indwara" : "Understanding This Disease"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {/* Description */}
            <div>
              <p className="text-white/90 leading-relaxed">{description}</p>
            </div>
            
            {/* How it spreads */}
            {!isHealthy && (
              <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <p className="text-xs uppercase tracking-wide text-orange-400 font-semibold mb-2">
                  {language === "rw" ? "Uko ikwirakwira" : "How It Spreads"}
                </p>
                <p className="text-sm text-white/80">{spread}</p>
              </div>
            )}
            
            {/* Symptoms to look for */}
            <div>
              <p className="text-xs uppercase tracking-wide text-cyan-400 font-semibold mb-3">
                {language === "rw" ? "Ibimenyetso byo kureba" : "Symptoms to Look For"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {symptoms.map((symptom, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 bg-white/5 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      isHealthy ? 'bg-green-400' : 'bg-cyan-400'
                    }`} />
                    <p className="text-sm text-white/80">{symptom}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Severity Explanation Card */}
        <Card className="border-0 shadow-xl animate-slide-up bg-white/5 backdrop-blur-md border border-white/10" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="pb-3 bg-purple-500/10">
            <CardTitle className="flex items-center gap-2 text-xl text-white">
              <AlertCircle className="h-5 w-5 text-purple-500" />
              {language === "rw" ? "Ibipimo by'ukaba" : "Severity Guide"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {/* Mild */}
              <div className={`flex items-center gap-3 p-3 rounded-lg border ${
                result.severity === 'mild' ? 'bg-green-500/20 border-green-500' : 'bg-white/5 border-white/10'
              }`}>
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="flex-1">
                  <p className={`font-semibold ${result.severity === 'mild' ? 'text-green-400' : 'text-white/60'}`}>
                    {language === "rw" ? "Ntoya" : "Mild"} (&lt;25%)
                  </p>
                  <p className="text-xs text-white/50">
                    {language === "rw" ? "Gukurikirana no kwirinda" : "Monitor and prevent"}
                  </p>
                </div>
                {result.severity === 'mild' && <CheckCircle className="h-5 w-5 text-green-400" />}
              </div>
              
              {/* Moderate */}
              <div className={`flex items-center gap-3 p-3 rounded-lg border ${
                result.severity === 'moderate' ? 'bg-yellow-500/20 border-yellow-500' : 'bg-white/5 border-white/10'
              }`}>
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="flex-1">
                  <p className={`font-semibold ${result.severity === 'moderate' ? 'text-yellow-400' : 'text-white/60'}`}>
                    {language === "rw" ? "Yo hagati" : "Moderate"} (25-50%)
                  </p>
                  <p className="text-xs text-white/50">
                    {language === "rw" ? "Kora mu minsi mike" : "Act within a few days"}
                  </p>
                </div>
                {result.severity === 'moderate' && <CheckCircle className="h-5 w-5 text-yellow-400" />}
              </div>
              
              {/* Severe */}
              <div className={`flex items-center gap-3 p-3 rounded-lg border ${
                result.severity === 'severe' ? 'bg-red-500/20 border-red-500' : 'bg-white/5 border-white/10'
              }`}>
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="flex-1">
                  <p className={`font-semibold ${result.severity === 'severe' ? 'text-red-400' : 'text-white/60'}`}>
                    {language === "rw" ? "Ikabije" : "Severe"} (&gt;50%)
                  </p>
                  <p className="text-xs text-white/50">
                    {language === "rw" ? "Kora ubu nyine!" : "Act immediately!"}
                  </p>
                </div>
                {result.severity === 'severe' && <CheckCircle className="h-5 w-5 text-red-400" />}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Confidence Progress */}
        <Card className="border-0 shadow-xl animate-slide-up bg-white/5 backdrop-blur-md border border-white/10" style={{ animationDelay: "0.1s" }}>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-white">Diagnosis Confidence</p>
                  <span className="text-sm font-bold text-green-400">{confidencePercent}%</span>
                </div>
                <Progress value={confidencePercent} className="h-3" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <p className="text-xs text-blue-400 font-semibold mb-1">Detection Accuracy</p>
                  <p className="text-sm text-blue-300">High confidence diagnosis</p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
                  <p className="text-xs text-purple-400 font-semibold mb-1">Analyzed Area</p>
                  <p className="text-sm text-purple-300">{result.affectedArea}% affected</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Treatment Recommendations */}
        <Card className="border-0 shadow-xl border-l-4 border-l-green-500 animate-slide-up bg-white/5 backdrop-blur-md border border-white/10" style={{ animationDelay: "0.2s" }}>
          <CardHeader className="pb-3 bg-green-500/10">
            <CardTitle className="flex items-center gap-2 text-xl text-white">
              <BookOpen className="h-5 w-5 text-green-500" />
              {t("treatmentRec")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {/* Recommended Action */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-500" />
                <p className="text-xs uppercase tracking-wide font-semibold text-white/60">{t("recommendedAction")}</p>
              </div>
              <div className={`p-4 rounded-lg border-l-4 ${
                result.severity === "mild" ? "bg-green-500/10 border-l-green-500" :
                result.severity === "moderate" ? "bg-yellow-500/10 border-l-yellow-500" :
                "bg-red-500/10 border-l-red-500"
              }`}>
                <p className="font-semibold text-white">{action}</p>
              </div>
            </div>

            {/* Application Instructions */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Droplet className="h-4 w-4 text-green-500" />
                <p className="text-xs uppercase tracking-wide font-semibold text-white/60">{t("applicationInstructions")}</p>
              </div>
              <div className="space-y-2 pl-6 border-l-2 border-green-500/30">
                {instructions.split("\n").map((line, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-green-500/20 text-green-400 text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-sm text-white/80 pt-0.5">{line}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Estimated Cost */}
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-xs uppercase tracking-wide text-green-400 font-semibold mb-1">{t("estimatedCost")}</p>
              <p className="text-2xl font-bold text-green-400">{result.treatment.cost}</p>
            </div>

            {/* Alternative Treatment Toggle */}
            <Button
              variant="outline"
              className="w-full justify-between border-white/20 text-white hover:bg-white/10"
              onClick={() => setShowAlt(!showAlt)}
            >
              {t("alternativeTreatment")}
              {showAlt ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>

            {/* Alternative Treatment Details */}
            {showAlt && (
              <div className="rounded-lg bg-blue-500/10 border border-blue-500/30 p-4 space-y-2 animate-slide-down">
                <p className="text-xs uppercase tracking-wide text-blue-400 font-semibold">Alternative Option</p>
                <p className="text-sm text-blue-300">{alternative}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detailed Treatment Info - Products */}
        {!isHealthy && products.length > 0 && (
          <Card className="border-0 shadow-xl animate-slide-up bg-white/5 backdrop-blur-md border border-white/10" style={{ animationDelay: "0.25s" }}>
            <CardHeader className="pb-3 bg-orange-500/10">
              <CardTitle className="flex items-center gap-2 text-xl text-white">
                <FlaskConical className="h-5 w-5 text-orange-500" />
                {language === "rw" ? "Imiti yo gukoresha" : "Recommended Products"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {products.map((product, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                    <Package className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-white/90">{product}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Application Timing */}
        <Card className="border-0 shadow-xl animate-slide-up bg-white/5 backdrop-blur-md border border-white/10" style={{ animationDelay: "0.3s" }}>
          <CardHeader className="pb-3 bg-blue-500/10">
            <CardTitle className="flex items-center gap-2 text-xl text-white">
              <Calendar className="h-5 w-5 text-blue-500" />
              {language === "rw" ? "Igihe cyo gushyira" : "Application Schedule"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
              <p className="text-white/90">{timing}</p>
            </div>
          </CardContent>
        </Card>

        {/* Prevention Tips */}
        <Card className="border-0 shadow-xl animate-slide-up bg-white/5 backdrop-blur-md border border-white/10" style={{ animationDelay: "0.35s" }}>
          <CardHeader className="pb-3 bg-purple-500/10">
            <CardTitle className="flex items-center gap-2 text-xl text-white">
              <Shield className="h-5 w-5 text-purple-500" />
              {language === "rw" ? "Uburyo bwo kwirinda" : "Prevention Tips"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {prevention.map((tip, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-sm text-white/80 pt-0.5">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 pt-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <Link to="/history" className="flex-1">
            <Button variant="outline" size="xl" className="w-full py-6 border-2 border-white/20 text-white hover:bg-white/10 hover:border-green-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300 group">
              <Leaf className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              {t("historyTitle")}
            </Button>
          </Link>
          <Link to="/upload" className="flex-1">
            <Button size="xl" className="w-full py-6 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:shadow-[0_0_25px_rgba(34,197,94,0.6)] transition-all duration-300 group">
              <Camera className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Upload New Image
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ResultPage;
