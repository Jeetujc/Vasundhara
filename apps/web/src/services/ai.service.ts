import { apiClient } from './api-client';

export interface AiRiskScoreInput {
  parcelAreaHectare: number;
  affectedFamilies: number;
  objectionCount: number;
  compensationBudgetCr: number;
  districtBacklogCases: number;
}

export interface AiRiskScoreOutput {
  riskScore: number;
  averageDelayDays: number;
  remark: string;
  model: string;
  dataset: string;
  confidence: number;
}

export interface AiProjectAnalysis extends AiRiskScoreOutput {
  projectId: string;
  projectName: string;
  metrics: {
    totalAreaHa: number;
    familiesCount: number;
    grievanceCount: number;
    pendingTasks: number;
    budgetCr: number;
  };
}

export interface AiGrievanceSuggestion {
  suggestedAction: string;
  guideline: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedResolutionDays: number;
}

export const aiService = {
  getRiskScore: async (input: AiRiskScoreInput): Promise<AiRiskScoreOutput> =>
    apiClient.post('/ai/risk-score', input),

  analyzeProject: async (projectId: string): Promise<AiProjectAnalysis> =>
    apiClient.get(`/ai/project/${encodeURIComponent(projectId)}`),

  suggestGrievance: async (
    category: string,
    description: string,
  ): Promise<AiGrievanceSuggestion> =>
    apiClient.post('/ai/grievance-suggest', { category, description }),
};
