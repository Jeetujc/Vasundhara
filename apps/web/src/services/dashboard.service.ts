import { apiClient } from './api-client';

export interface CitizenDashboardData {
  user: {
    id: string;
    name: string;
    aadharId?: string;
    mobileNo: string;
    role: string;
    stateName: string;
    districtName: string;
    tehsilName: string;
  };
  parcel: {
    parcelNumber: string;
    surveyNumber?: string;
    village: string;
    tehsil: string;
    areaHectares: number;
    status: string;
    projectName: string;
    projectCode: string;
  };
  compensation: {
    totalAward: number;
    baseMarketValue: number;
    locationMultiplier: number;
    attachedAssets: number;
    basicCompensation: number;
    solatium: number;
    displacementAllowance: number;
    status: string;
    paymentStatus: string;
    awardDate: string;
  };
  rrBenefits: {
    displacementAllowance: number;
    housingPlot: string;
    housingSupport: boolean;
    financialAssistance: boolean;
    relocationSupport: boolean;
    status: string;
  };
  trackerStages: Array<{
    id: string;
    title: string;
    date: string;
    status: string;
    description: string;
  }>;
  documents: Array<{
    id: string;
    name: string;
    storageKey: string;
    mimeType?: string;
    sizeBytes?: number;
    status: string;
    createdAt: string;
  }>;
  grievances: {
    totalCount: number;
    latest: {
      id: string;
      ticketNo: string;
      category: string;
      status: string;
      description: string;
      resolution?: string;
    } | null;
    items: Array<any>;
  };
  notifications: {
    unreadCount: number;
    items: Array<any>;
  };
}

export interface StateDashboardData {
  state: {
    id: string;
    name: string;
    code: string;
  };
  kpis: {
    activeProjects: number;
    totalDistrictsCount: number;
    landTargetHectares: number;
    acquiredPercentage: number;
    fundsDisbursedCr: string;
    fundsAtRiskCr: string;
  };
  districtEfficiencyRanking: Array<{
    rank: number;
    name: string;
    avgDays: number;
    badge: string;
  }>;
  statutoryRadar: Array<{
    id: string;
    name: string;
    district: string;
    status: string;
    daysLeft: number;
    percent: number;
  }>;
  clearanceTracker: Array<{
    id: string;
    name: string;
    code: string;
    areaHectares: number;
    district: string;
    revenueStatus: string;
    forestStatus: string;
    requiringBodyStatus: string;
  }>;
}

export interface DistrictDashboardData {
  district: {
    id: string;
    name: string;
    code: string;
    stateName: string;
    tehsilsCount: number;
  };
  kpis: {
    totalActiveProjects: number;
    landAcquiredTarget: number;
    tehsilsCount: number;
  };
  milestoneTracker: Array<{
    id: string;
    name: string;
    code: string;
    requiringBody: string;
    targetArea: number;
    sec11: boolean;
    sec15: boolean;
    sec19: boolean;
    sec21: string;
    possession: string;
  }>;
  rrTracker: Array<{
    id: string;
    projectName: string;
    totalPafs: number;
    housingPlots: string;
    housingPct: number;
    employment: string;
    employmentPct: number;
    allowance: string;
    allowancePct: number;
    status: string;
  }>;
  pendingApprovals: Array<{
    id: string;
    title: string;
    projectName: string;
    stage: string;
    status: string;
  }>;
  financialEscrow: {
    totalDepositedCr: string;
    disbursedCr: string;
    pendingCr: string;
  };
}

export interface NationalDashboardData {
  nationalKpis: {
    centralPipeline: number;
    aggregateLandHectares: number;
    escrowDisbursedCr: string;
    capitalBlockedCr: string;
  };
  statesSummary: Array<{
    id: string;
    name: string;
    code: string;
    projectsCount: number;
    districtsCount: number;
  }>;
  corridorProjects: Array<{
    id: string;
    name: string;
    code: string;
    state: string;
    district: string;
    status: string;
  }>;
}

export interface FieldDashboardData {
  officer: {
    id: string;
    name: string;
    patwariId: string;
    districtName: string;
    tehsilName: string;
  };
  tasks: Array<{
    id: string;
    title: string;
    stage: string;
    projectName: string;
    deadline?: string;
    status: string;
  }>;
  assignedParcels: Array<{
    id: string;
    parcelNumber: string;
    surveyNumber?: string;
    village?: string;
    area: number;
    status: string;
    projectName: string;
  }>;
}

export interface AdminDashboardData {
  stats: {
    totalUsers: number;
    publicUsers: number;
    officers: number;
    projectsCount: number;
    parcelsCount: number;
    auditLogsCount: number;
    statesCount: number;
    districtsCount: number;
  };
  authorityAccounts: Array<{
    id: string;
    name: string;
    aadharId: string;
    mobileNo: string;
    role: string;
    state: string;
    district: string;
    tehsil: string;
    isActive: boolean;
    createdAt: string;
  }>;
  recentAudits: Array<{
    id: string;
    action: string;
    entityType: string;
    description?: string;
    performedBy: string;
    role: string;
    createdAt: string;
  }>;
}

export const dashboardService = {
  getCitizen: () => apiClient.get<CitizenDashboardData>('/dashboard/citizen'),
  getState: (stateId?: string) =>
    apiClient.get<StateDashboardData>(`/dashboard/state${stateId ? `/${stateId}` : ''}`),
  getDistrict: (districtId?: string) =>
    apiClient.get<DistrictDashboardData>(`/dashboard/district${districtId ? `/${districtId}` : ''}`),
  getNational: () => apiClient.get<NationalDashboardData>('/dashboard/national'),
  getField: () => apiClient.get<FieldDashboardData>('/dashboard/field'),
  getAdmin: () => apiClient.get<AdminDashboardData>('/dashboard/admin'),
};
