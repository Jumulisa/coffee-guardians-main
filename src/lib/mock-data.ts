export interface DiagnosisResult {
  id: string;
  disease: string;
  diseaseRw: string;
  confidence: number;
  severity: "mild" | "moderate" | "severe";
  affectedArea: number; // percentage
  treatment: {
    action: string;
    actionRw: string;
    instructions: string;
    instructionsRw: string;
    cost: string;
    alternative: string;
    alternativeRw: string;
  };
  imageUrl: string;
  date: string;
}

export const mockDiagnosis: DiagnosisResult = {
  id: "diag-001",
  disease: "Coffee Leaf Rust (Hemileia vastatrix)",
  diseaseRw: "Imvura y'Ikibabi cy'Ikawa (Hemileia vastatrix)",
  confidence: 0.87,
  severity: "moderate",
  affectedArea: 35,
  treatment: {
    action: "Apply copper-based fungicide (Bordeaux mixture) to affected plants",
    actionRw: "Shyira umuti wa fungicide ushingiye ku muringa (Bordeaux mixture) ku bimera byandujwe",
    instructions: "1. Mix 100g copper sulfate + 100g lime in 10L water\n2. Spray on both sides of leaves\n3. Repeat every 14 days\n4. Apply early morning or late afternoon",
    instructionsRw: "1. Vanga 100g ya copper sulfate + 100g ya calcium mu mazi 10L\n2.Tera ku mpande zombi z'amababi\n3. Subiramo buri minsi 14\n4. Kora mu gitondo cya kare cyangwa nimugoroba",
    cost: "2,500 - 4,000 RWF per treatment",
    alternative: "Remove and burn severely affected leaves. Improve air circulation by pruning. Consider resistant varieties for replanting.",
    alternativeRw: "Kuraho no gutwika amababi yandujwe cyane. Kunoza umuyaga mu gusarura. Tekereza ubwoko buhanganira indwara mu gutera bushya.",
  },
  imageUrl: "",
  date: new Date().toISOString(),
};

export function getStoredHistory(): DiagnosisResult[] {
  try {
    const data = localStorage.getItem("coffeeguard-history");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveToHistory(result: DiagnosisResult) {
  const history = getStoredHistory();
  history.unshift(result);
  localStorage.setItem("coffeeguard-history", JSON.stringify(history.slice(0, 50)));
}

export function clearHistory() {
  localStorage.removeItem("coffeeguard-history");
}
