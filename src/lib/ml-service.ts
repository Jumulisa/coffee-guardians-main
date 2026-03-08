// Service to communicate with the backend ML model API
const ML_API_URL = import.meta.env.VITE_ML_API_URL || 'https://7860-m-s-t2rto0qj8ynz-b.us-east1-2.prod.colab.dev';
const USE_MOCK = import.meta.env.VITE_USE_MOCK_ML === 'true';

export interface BackendPrediction {
  disease: string;
  diseaseRw: string;
  confidence: number;
  severity: 'mild' | 'moderate' | 'severe';
  affectedArea: number;
  treatment: {
    action: string;
    actionRw: string;
    instructions: string;
    instructionsRw: string;
    alternative: string;
    alternativeRw: string;
    cost: string;
  };
  allPredictions: {
    [key: string]: number;
  };
}

// Colab API response types
interface ColabApiResponse {
  success: boolean;
  error?: string;
  suggestion?: string;
  detection?: {
    disease: string;
    confidence: number;
    all_predictions: { [key: string]: number };
  };
  severity?: {
    level: 'mild' | 'moderate' | 'severe' | null;
    percent: number;
    message: string;
  };
  treatment?: {
    recommendation: string;
    chemical: string;
    organic: string;
    instructions: string;
    cost_rwf: number;
  } | null;
  disease_info?: {
    name: string;
    scientific_name: string;
    description: string;
    symptoms: string;
    prevention: string;
  };
}

// Disease name mappings (Colab API -> Display name)
const DISEASE_NAMES: { [key: string]: { en: string; rw: string } } = {
  'healthy': { en: 'Healthy', rw: 'Muzima' },
  'rust': { en: 'Coffee Leaf Rust', rw: "Imvura y'Ibabi ry'Ikawa" },
  'red_spider_mite': { en: 'Red Spider Mite', rw: "Uducurama dutukura" },
};

// Transform Colab API response to app's expected format
function transformColabResponse(data: ColabApiResponse): BackendPrediction {
  if (!data.success || !data.detection) {
    throw new Error(data.error || 'Detection failed');
  }

  const diseaseKey = data.detection.disease;
  const diseaseNames = DISEASE_NAMES[diseaseKey] || { en: diseaseKey, rw: diseaseKey };
  
  // Convert confidence from percentage (0-100) to decimal (0-1)
  const confidence = data.detection.confidence / 100;
  
  // Convert all predictions from percentage to decimal
  const allPredictions: { [key: string]: number } = {};
  for (const [key, value] of Object.entries(data.detection.all_predictions)) {
    const name = DISEASE_NAMES[key]?.en || key;
    allPredictions[name] = value / 100;
  }

  // Map treatment fields
  const treatment = data.treatment ? {
    action: data.treatment.recommendation || '',
    actionRw: data.treatment.recommendation || '', // TODO: Add Kinyarwanda translations
    instructions: `${data.treatment.chemical} ${data.treatment.instructions}`,
    instructionsRw: `${data.treatment.chemical} ${data.treatment.instructions}`,
    alternative: data.treatment.organic || '',
    alternativeRw: data.treatment.organic || '',
    cost: data.treatment.cost_rwf ? `${data.treatment.cost_rwf.toLocaleString()} RWF` : '0 RWF',
  } : {
    action: 'No treatment needed - continue regular care',
    actionRw: 'Nta muti ukenewe - komeza kwita ku bimera',
    instructions: 'Maintain current practices. Monitor regularly for early signs of disease.',
    instructionsRw: 'Komeza ibikorwa bisanzwe. Genzura buri gihe kugira ngo urebe ibimenyetso by\'indwara.',
    alternative: 'Apply preventive fungicide during rainy season',
    alternativeRw: 'Shyira umuti ukumira mu gihe cy\'imvura',
    cost: '0 RWF',
  };

  return {
    disease: diseaseNames.en,
    diseaseRw: diseaseNames.rw,
    confidence,
    severity: data.severity?.level || 'mild',
    affectedArea: data.severity?.percent || 0,
    treatment,
    allPredictions,
  };
}

// Mock predictions for demo/testing when ML API is unavailable
const mockPredictions: BackendPrediction[] = [
  {
    disease: "Coffee Leaf Rust",
    diseaseRw: "Imvura y'Ibabi ry'Ikawa",
    confidence: 0.92,
    severity: "moderate",
    affectedArea: 35,
    treatment: {
      action: "Apply copper-based fungicide",
      actionRw: "Shyira umuti wa copper",
      instructions: "Spray affected leaves every 2 weeks. Remove severely infected leaves and destroy them.",
      instructionsRw: "Shyira umuti ku mababi yakubiwe buri byumweru 2. Kuraho amababi yakubiwe cyane uyatwike.",
      alternative: "Use resistant coffee varieties like Castillo or Colombia",
      alternativeRw: "Koresha ubwoko bw'ikawa budakura nka Castillo cyangwa Colombia",
      cost: "5,000 - 10,000 RWF"
    },
    allPredictions: {
      "Coffee Leaf Rust": 0.92,
      "Healthy": 0.05,
      "Coffee Berry Disease": 0.02,
      "Cercospora Leaf Spot": 0.01
    }
  },
  {
    disease: "Coffee Berry Disease",
    diseaseRw: "Indwara y'Imbuto z'Ikawa",
    confidence: 0.87,
    severity: "severe",
    affectedArea: 45,
    treatment: {
      action: "Apply systemic fungicide immediately",
      actionRw: "Shyira umuti w'indwara vuba",
      instructions: "Remove all infected berries. Apply fungicide before flowering and repeat every 3 weeks during rainy season.",
      instructionsRw: "Kuraho imbuto zose zakubiwe. Shyira umuti mbere yo gushariza kandi ubisubiremo buri byumweru 3 mu gihe cy'imvura.",
      alternative: "Improve drainage and reduce shade to lower humidity",
      alternativeRw: "Kongera uburyo bwo kuvana amazi no kugabanya igicucu kugira ngo ugabanye ubuhehere",
      cost: "15,000 - 25,000 RWF"
    },
    allPredictions: {
      "Coffee Berry Disease": 0.87,
      "Coffee Leaf Rust": 0.08,
      "Healthy": 0.03,
      "Cercospora Leaf Spot": 0.02
    }
  },
  {
    disease: "Cercospora Leaf Spot",
    diseaseRw: "Udukara tw'Ibabi (Cercospora)",
    confidence: 0.85,
    severity: "mild",
    affectedArea: 20,
    treatment: {
      action: "Apply copper hydroxide spray",
      actionRw: "Shyira umuti wa copper hydroxide",
      instructions: "Ensure proper spacing between plants for air circulation. Remove fallen leaves.",
      instructionsRw: "Menya neza ko ibimera biri kure hagati yabyo kugira ngo umwuka ugendere neza. Kuraho amababi yaguye.",
      alternative: "Maintain balanced fertilization, especially nitrogen levels",
      alternativeRw: "Komeza ifumbire iringaniye, cyane cyane urugero rwa azote",
      cost: "3,000 - 7,000 RWF"
    },
    allPredictions: {
      "Cercospora Leaf Spot": 0.85,
      "Coffee Leaf Rust": 0.08,
      "Healthy": 0.05,
      "Coffee Berry Disease": 0.02
    }
  },
  {
    disease: "Healthy",
    diseaseRw: "Muzima",
    confidence: 0.95,
    severity: "mild",
    affectedArea: 0,
    treatment: {
      action: "No treatment needed - continue regular care",
      actionRw: "Nta muti ukenewe - komeza kwita ku bimera",
      instructions: "Maintain current practices. Monitor regularly for early signs of disease.",
      instructionsRw: "Komeza ibikorwa bisanzwe. Genzura buri gihe kugira ngo urebe ibimenyetso by'indwara.",
      alternative: "Apply preventive fungicide during rainy season",
      alternativeRw: "Shyira umuti ukumira mu gihe cy'imvura",
      cost: "0 RWF"
    },
    allPredictions: {
      "Healthy": 0.95,
      "Coffee Leaf Rust": 0.03,
      "Cercospora Leaf Spot": 0.01,
      "Coffee Berry Disease": 0.01
    }
  }
];

// Get a random mock prediction
const getMockPrediction = (): BackendPrediction => {
  const index = Math.floor(Math.random() * mockPredictions.length);
  // Add some variation to confidence
  const pred = { ...mockPredictions[index] };
  pred.confidence = Math.min(0.98, pred.confidence + (Math.random() * 0.05 - 0.025));
  return pred;
};

export const mlService = {
  /**
   * Send image to backend for disease prediction
   */
    async predictDisease(imageFile: File): Promise<BackendPrediction> {
    // Use mock if enabled or if API fails
    if (USE_MOCK) {
      console.log('Using mock ML prediction (VITE_USE_MOCK_ML=true)');
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      return getMockPrediction();
    }

    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch(`${ML_API_URL}/detect/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data: ColabApiResponse = await response.json();
      
      // Handle API errors (including "not a leaf" detection)
      if (!data.success) {
        const errorMsg = data.suggestion 
          ? `${data.error} ${data.suggestion}`
          : data.error || 'Detection failed';
        throw new Error(errorMsg);
      }

      return transformColabResponse(data);
    } catch (error) {
      console.error('Error calling ML API:', error);
      // Re-throw the error instead of falling back to mock
      // This allows the UI to show proper error messages (e.g., "not a leaf")
      throw error;
    }
  },

    // Removed getModelInfo (not supported by Colab proxy)

    // Removed checkHealth (not supported by Colab proxy)
    async getDiseases() {
      try {
        const response = await fetch(`${ML_API_URL}/diseases/`);
        if (!response.ok) throw new Error('Failed to get diseases');
        return await response.json();
      } catch (error) {
        console.error('Error getting diseases:', error);
        throw error;
      }
    },

  /**
   * Predict from base64 image string
   */
  async predictFromBase64(imageBase64: string): Promise<BackendPrediction> {
    try {
      const response = await fetch(`${ML_API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageBase64,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error calling ML API:', error);
      throw error;
    }
  },
};
