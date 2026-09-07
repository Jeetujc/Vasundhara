// Shared types for the monorepo

export type Role = 'ADMIN' | 'CENTRAL_OFFICER' | 'STATE_OFFICER' | 'DISTRICT_OFFICER' | 'FIELD_OFFICER'

export interface User {
  id: string
  name: string
  email: string
  role: Role
}

export interface Organization { id: string; name: string }
export interface State { id: string; name: string }
export interface District { id: string; name: string }
export interface Project { id: string; name: string }
export interface LandParcel { id: string; geometry?: any }
export interface WorkflowInstance { id: string; project_id: string; current_stage?: string }
export interface WorkflowTask { id: string; workflow_id: string; stage?: string }
export interface CompensationCase { id: string; assessedAmount?: number }
