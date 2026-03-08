export type Language = "en" | "rw";

export const translations = {
  en: {
    // Nav
    appName: "CoffeeGuard Rwanda",
    home: "Home",
    upload: "Upload",
    history: "History",
    language: "Language",

    // Landing
    heroTitle: "Protect Your Coffee Crops",
    heroSubtitle: "AI-powered disease detection and treatment recommendations for Rwandan coffee farmers",
    ctaButton: "Upload Leaf Image",
    howItWorks: "How It Works",
    step1Title: "Take a Photo",
    step1Desc: "Capture a clear image of a coffee leaf showing symptoms",
    step2Title: "Get Diagnosis",
    step2Desc: "Our AI analyzes the leaf and identifies the disease",
    step3Title: "Take Action",
    step3Desc: "Receive treatment recommendations aligned with Rwanda guidelines",
    trustBadge: "Aligned with Rwanda agricultural guidelines",

    // Upload
    uploadTitle: "Upload Coffee Leaf Image",
    uploadDesc: "Take a clear photo of a single coffee leaf",
    uploadTip: "Tip: Hold the leaf flat and photograph in good lighting",
    dragDrop: "Drag and drop your image here",
    orText: "or",
    browseFiles: "Browse Files",
    takePhoto: "Take Photo",
    analyzing: "Analyzing your leaf...",
    analyzingDesc: "This may take a few seconds",

    // Results
    diagnosisResult: "Diagnosis Result",
    disease: "Disease Detected",
    confidence: "Confidence",
    confidenceHigh: "The system is highly confident in this diagnosis",
    confidenceMedium: "The system is moderately confident in this diagnosis",
    confidenceLow: "The system has low confidence — consider retaking the photo",
    severity: "Severity Level",
    mild: "Mild",
    moderate: "Moderate",
    severe: "Severe",
    affectedArea: "Affected Leaf Area",
    treatmentRec: "Treatment Recommendation",
    recommendedAction: "Recommended Action",
    applicationInstructions: "Application Instructions",
    estimatedCost: "Estimated Cost",
    alternativeTreatment: "View Alternative Treatment",
    saveResult: "Save Result",
    newScan: "New Scan",

    // History
    historyTitle: "Diagnostic History",
    historyEmpty: "No diagnoses yet. Upload a leaf image to get started.",
    viewDetails: "View Details",
    clearHistory: "Clear History",
    date: "Date",
  },
  rw: {
    // Nav
    appName: "CoffeeGuard Rwanda",
    home: "Ahabanza",
    upload: "Ohereza",
    history: "Amateka",
    language: "Ururimi",

    // Landing
    heroTitle: "Rinda Imyaka Yawe Y'Ikawa",
    heroSubtitle: "Gukoresha ubuhanga bwa AI mu gukurikiranira indwara z'ikawa no gutanga inama z'ubuvuzi ku bahinzi b'u Rwanda",
    ctaButton: "Ohereza Ifoto y'Ikibabi",
    howItWorks: "Uko Bikora",
    step1Title: "Fata Ifoto",
    step1Desc: "Fata ifoto yizewe y'ikibabi cy'ikawa kigaragaza ibimenyetso",
    step2Title: "Kubona Isuzuma",
    step2Desc: "Ubuhanga bwa AI busesengura ikibabi bukamenya indwara",
    step3Title: "Fata Ingamba",
    step3Desc: "Akira inama z'ubuvuzi zihuje n'amabwiriza y'ubuhinzi mu Rwanda",
    trustBadge: "Bihuje n'amabwiriza y'ubuhinzi mu Rwanda",

    // Upload
    uploadTitle: "Ohereza Ifoto y'Ikibabi cy'Ikawa",
    uploadDesc: "Fata ifoto yizewe y'ikibabi kimwe cy'ikawa",
    uploadTip: "Inama: Shyira ikibabi ku buryo butambutse ufate ifoto mu mucyo mwiza",
    dragDrop: "Kurura ifoto uyishyire hano",
    orText: "cyangwa",
    browseFiles: "Shakisha Dosiye",
    takePhoto: "Fata Ifoto",
    analyzing: "Dusesengura ikibabi cyawe...",
    analyzingDesc: "Ibi bishobora gufata amasegonda make",

    // Results
    diagnosisResult: "Ibisubizo by'Isuzuma",
    disease: "Indwara Yavumbuwe",
    confidence: "Ikizere",
    confidenceHigh: "Sisitemu ifite ikizere gikomeye kuri iri suzuma",
    confidenceMedium: "Sisitemu ifite ikizere gihagije kuri iri suzuma",
    confidenceLow: "Sisitemu ifite ikizere gike — gerageza gufata ifoto nshya",
    severity: "Urwego rw'Indwara",
    mild: "Yoroheje",
    moderate: "Yisanzuye",
    severe: "Ikabije",
    affectedArea: "Igice cy'Ikibabi Cyandujwe",
    treatmentRec: "Inama z'Ubuvuzi",
    recommendedAction: "Igikorwa Gisabwa",
    applicationInstructions: "Amabwiriza y'Ikoreshwa",
    estimatedCost: "Igiciro Giteganijwe",
    alternativeTreatment: "Reba Ubuvuzi Busimbura",
    saveResult: "Bika Ibisubizo",
    newScan: "Isuzuma Rishya",

    // History
    historyTitle: "Amateka y'Isuzuma",
    historyEmpty: "Nta suzuma rihari. Ohereza ifoto y'ikibabi kugira ngo utangire.",
    viewDetails: "Reba Ibisobanuro",
    clearHistory: "Siba Amateka",
    date: "Itariki",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
