import { diagnosisApi, userApi, authApi, Diagnosis } from './api-service';

// Diagnosis history
export async function getDiagnosisHistory(_userId: string): Promise<Diagnosis[]> {
  return diagnosisApi.getHistory();
}

export interface TreatmentData {
  action: string;
  actionRw: string;
  instructions: string;
  instructionsRw: string;
  cost: string;
  alternative: string;
  alternativeRw: string;
}

export async function saveDiagnosis(
  _userId: string,
  diagnosis: {
    image_url: string;
    disease_name: string;
    disease_name_rw?: string;
    confidence: number;
    severity: string;
    affected_area?: number;
    treatment_action?: string;
    treatment_data?: TreatmentData;
    treatment_duration?: string;
    estimated_cost?: string;
  }
): Promise<Diagnosis> {
  return diagnosisApi.save({
    image_url: diagnosis.image_url,
    disease_name: diagnosis.disease_name,
    confidence: diagnosis.confidence,
    severity: diagnosis.severity,
    treatment_data: diagnosis.treatment_data ? JSON.stringify(diagnosis.treatment_data) : undefined,
    notes: diagnosis.disease_name_rw,
  });
}

export async function deleteDiagnosis(diagnosisId: string): Promise<void> {
  return diagnosisApi.delete(Number(diagnosisId));
}

// User settings
export async function getUserSettings(_userId: string) {
  return userApi.getSettings();
}

export async function updateUserSettings(
  _userId: string,
  settings: {
    language?: string;
    notifications_enabled?: boolean;
    theme_preference?: string;
    auto_save_history?: boolean;
  }
) {
  return userApi.updateSettings({
    language: settings.language,
    notifications_enabled: settings.notifications_enabled,
    dark_mode: settings.theme_preference === 'dark',
  });
}

// User profile functions (now handled by AuthContext)
export async function getUserProfile(_userId: string) {
  const { user } = await authApi.getCurrentUser();
  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    avatar_url: user.avatar_url,
    language: user.language,
  };
}

export async function updateUserProfile(
  _userId: string,
  updates: { full_name?: string; avatar_url?: string }
) {
  return userApi.updateProfile(updates);
}
