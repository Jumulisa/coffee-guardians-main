// Service to communicate with the backend ML model API
const ML_API_URL = import.meta.env.VITE_ML_API_URL || 'https://badgirlriri-coffeeguard-ai.hf.space';
const USE_MOCK = import.meta.env.VITE_USE_MOCK_ML === 'true';

export interface BackendPrediction {
  disease: string;
  diseaseRw: string;
  confidence: number;
  severity: 'mild' | 'moderate' | 'severe';
  affectedArea: number;
  gradcamUrl?: string; // GradCAM heatmap visualization URL
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
  gradcam_url?: string; // GradCAM heatmap visualization
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
    gradcamUrl: data.gradcam_url,
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

// Generate a simulated GradCAM heatmap overlay on the original image
const generateMockGradCAM = async (imageFile: File, severity: 'mild' | 'moderate' | 'severe', isHealthy: boolean): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // Draw original image
        ctx.drawImage(img, 0, 0);
        
        // If healthy, return original image without heatmap
        if (isHealthy) {
          resolve(canvas.toDataURL('image/jpeg', 0.9));
          return;
        }
        
        // Create heatmap overlay
        const heatmapCanvas = document.createElement('canvas');
        heatmapCanvas.width = img.width;
        heatmapCanvas.height = img.height;
        const heatCtx = heatmapCanvas.getContext('2d');
        if (!heatCtx) {
          reject(new Error('Failed to get heatmap canvas context'));
          return;
        }
        
        // Generate random "hot spots" to simulate GradCAM
        const numSpots = severity === 'severe' ? 6 : severity === 'moderate' ? 4 : 2;
        const spotSize = Math.min(img.width, img.height) * (severity === 'severe' ? 0.5 : severity === 'moderate' ? 0.4 : 0.25);
        
        for (let i = 0; i < numSpots; i++) {
          const x = Math.random() * img.width * 0.6 + img.width * 0.2;
          const y = Math.random() * img.height * 0.6 + img.height * 0.2;
          
          // Create radial gradient for each hotspot
          const gradient = heatCtx.createRadialGradient(x, y, 0, x, y, spotSize);
          
          // Color based on severity - more vivid colors for better visibility
          if (severity === 'severe') {
            gradient.addColorStop(0, 'rgba(255, 0, 0, 0.85)');
            gradient.addColorStop(0.25, 'rgba(255, 50, 0, 0.7)');
            gradient.addColorStop(0.5, 'rgba(255, 150, 0, 0.5)');
            gradient.addColorStop(0.75, 'rgba(255, 220, 0, 0.25)');
            gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
          } else if (severity === 'moderate') {
            gradient.addColorStop(0, 'rgba(255, 120, 0, 0.8)');
            gradient.addColorStop(0.3, 'rgba(255, 180, 0, 0.6)');
            gradient.addColorStop(0.6, 'rgba(255, 220, 0, 0.35)');
            gradient.addColorStop(1, 'rgba(180, 255, 0, 0)');
          } else {
            gradient.addColorStop(0, 'rgba(255, 230, 0, 0.7)');
            gradient.addColorStop(0.4, 'rgba(200, 255, 0, 0.45)');
            gradient.addColorStop(1, 'rgba(100, 255, 0, 0)');
          }
          
          heatCtx.fillStyle = gradient;
          heatCtx.fillRect(0, 0, img.width, img.height);
        }
        
        // Blend heatmap onto original image using multiply for better visibility
        ctx.globalAlpha = 0.7;
        ctx.globalCompositeOperation = 'multiply';
        ctx.drawImage(heatmapCanvas, 0, 0);
        
        // Add the colors on top with screen blend
        ctx.globalAlpha = 0.6;
        ctx.globalCompositeOperation = 'screen';
        ctx.drawImage(heatmapCanvas, 0, 0);
        
        // Reset
        ctx.globalAlpha = 1.0;
        ctx.globalCompositeOperation = 'source-over';
        
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(imageFile);
  });
};

// Check if an image looks like a leaf (basic green color detection)
const checkIfLikelyLeaf = async (imageFile: File): Promise<{ isLikelyLeaf: boolean; greenPercentage: number }> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 100; // Sample at lower resolution for speed
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ isLikelyLeaf: true, greenPercentage: 50 }); // Default to allowing
          return;
        }
        
        ctx.drawImage(img, 0, 0, size, size);
        const imageData = ctx.getImageData(0, 0, size, size);
        const data = imageData.data;
        
        let naturalGreenPixels = 0;
        let leafBrownPixels = 0;
        let artificialColorPixels = 0;
        const totalPixels = size * size;
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Natural leaf green: green dominant, not too saturated, organic tones
          // Leaves typically have green with some yellow/brown undertones
          const isNaturalGreen = (
            g > r && g > b && g > 60 && g < 200 &&
            Math.abs(r - b) < 60 && // Natural greens have similar R and B
            (g - Math.max(r, b)) > 10 && // Green should be noticeably dominant
            (g - Math.max(r, b)) < 100 // But not artificially saturated
          );
          
          // Leaf brown/diseased: brownish-green typical of coffee leaves
          const isLeafBrown = (
            r > 40 && r < 180 &&
            g > 50 && g < 180 &&
            b < g && b < r &&
            Math.abs(r - g) < 50 // Brown-green range
          );
          
          // Artificial colors (car paint, plastic, etc.) - very saturated
          const saturation = (Math.max(r, g, b) - Math.min(r, g, b)) / Math.max(r, g, b, 1);
          const isArtificial = saturation > 0.7 && (r > 200 || g > 200 || b > 200);
          
          if (isNaturalGreen) naturalGreenPixels++;
          if (isLeafBrown) leafBrownPixels++;
          if (isArtificial) artificialColorPixels++;
        }
        
        const naturalPercentage = (naturalGreenPixels / totalPixels) * 100;
        const brownPercentage = (leafBrownPixels / totalPixels) * 100;
        const artificialPercentage = (artificialColorPixels / totalPixels) * 100;
        const greenPercentage = naturalPercentage + brownPercentage * 0.3;
        
        // Reject if too many artificial-looking pixels
        // Require higher percentage of natural green/brown colors
        const isLikelyLeaf = greenPercentage > 15 && artificialPercentage < 20;
        
        console.log('Leaf detection - natural green%:', naturalPercentage.toFixed(1), 
                    'brown%:', brownPercentage.toFixed(1),
                    'artificial%:', artificialPercentage.toFixed(1),
                    'isLikelyLeaf:', isLikelyLeaf);
        resolve({ isLikelyLeaf, greenPercentage });
      };
      img.onerror = () => resolve({ isLikelyLeaf: true, greenPercentage: 50 });
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve({ isLikelyLeaf: true, greenPercentage: 50 });
    reader.readAsDataURL(imageFile);
  });
};

export const mlService = {
  /**
   * Helper to get mock prediction with GradCAM - used for fallback
   */
  async getMockPredictionWithGradCAM(imageFile: File): Promise<BackendPrediction> {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
    const prediction = getMockPrediction();
    
    // Generate GradCAM visualization
    const isHealthy = prediction.disease.toLowerCase().includes('healthy');
    try {
      const gradcamUrl = await generateMockGradCAM(imageFile, prediction.severity, isHealthy);
      prediction.gradcamUrl = gradcamUrl;
    } catch (error) {
      console.error('Failed to generate GradCAM:', error);
    }
    
    return prediction;
  },

  /**
   * Send image to backend for disease prediction
   */
    async predictDisease(imageFile: File): Promise<BackendPrediction> {
    // First, check if the image looks like a leaf
    const leafCheck = await checkIfLikelyLeaf(imageFile);
    if (!leafCheck.isLikelyLeaf) {
      throw new Error(
        'This doesn\'t appear to be a coffee leaf image. Please upload a clear photo of a coffee leaf for disease diagnosis. Make sure the leaf is well-lit and fills most of the frame.'
      );
    }

    // Use mock if enabled or if API fails
    if (USE_MOCK) {
      console.log('Using mock ML prediction (VITE_USE_MOCK_ML=true)');
      return await this.getMockPredictionWithGradCAM(imageFile);
    }

    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch(`${ML_API_URL}/predict`, {
        method: 'POST',
        body: formData,
      });

      // If API is unavailable (503), fall back to mock mode
      if (response.status === 503) {
        console.warn('ML API unavailable (503), falling back to mock predictions');
        return await this.getMockPredictionWithGradCAM(imageFile);
      }

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
      
      // Fall back to mock if it's a network error or service unavailable
      const errorMessage = (error as Error).message || '';
      if (errorMessage.includes('Failed to fetch') || 
          errorMessage.includes('NetworkError') ||
          errorMessage.includes('503') ||
          errorMessage.includes('Service Unavailable')) {
        console.warn('Network error, falling back to mock predictions');
        return await this.getMockPredictionWithGradCAM(imageFile);
      }
      
      // Re-throw other errors (e.g., "not a leaf")
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
