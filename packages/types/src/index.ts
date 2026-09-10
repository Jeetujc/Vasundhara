// Shared types for the monorepo

export type Role =
  | 'ADMIN'
  | 'CENTRAL_OFFICER'
  | 'STATE_OFFICER'
  | 'DISTRICT_OFFICER'
  | 'FIELD_OFFICER'
  | 'PUBLIC_USER';

export interface User {
  id: string;
  name: string;
  aadharId?: string;
  mobileNo: string;
  role: Role;
  organizationId?: string;
  stateId?: string;
  districtId?: string;
  tehsilId?: string;
  isActive?: boolean;
}

export interface Organization { id: string; name: string; code?: string; }
export interface State { id: string; name: string; code: string; organizationId: string; }
export interface District { id: string; name: string; code: string; stateId: string; }
export interface Tehsil { id: string; name: string; code: string; districtId: string; }
export interface Project { id: string; name: string; code: string; description?: string; status: string; stateId: string; districtId: string; proposedArea?: number; }
export interface LandParcel { id: string; projectId: string; parcelNumber: string; surveyNumber?: string; village?: string; tehsil?: string; area?: number; status: string; }
export interface WorkflowInstance { id: string; projectId: string; currentStage: string; status: string; }
export interface WorkflowTask { id: string; workflowId: string; stage: string; title: string; assignedToId?: string; status: string; deadline?: string; }
export interface CompensationCase { id: string; projectId: string; parcelId: string; familyId: string; assessedAmount: number; approvedAmount: number; paidAmount: number; pendingAmount: number; status: string; paymentStatus: string; }
export interface Grievance { id: string; ticketNo: string; userId: string; projectId?: string; category: string; description: string; status: string; resolution?: string; createdAt: string; }
