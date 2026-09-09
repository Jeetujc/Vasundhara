import { ProjectStatus } from '../generated/prisma/client.js';

export const WORKFLOW_STAGES = [
  'PROPOSAL',
  'LAND_REQUIREMENT_SUBMITTED',
  'SCRUTINY',
  'APPROVAL',
  'NOTIFICATION',
  'OBJECTIONS_CLAIMS',
  'AWARD_DECLARATION',
  'COMPENSATION',
  'POSSESSION',
  'R_AND_R',
  'PROJECT_CLOSURE',
] as const;

export type WorkflowStage = (typeof WORKFLOW_STAGES)[number];

export const STAGE_PROJECT_STATUS: Record<WorkflowStage, ProjectStatus> = {
  PROPOSAL: ProjectStatus.PROPOSED,
  LAND_REQUIREMENT_SUBMITTED: ProjectStatus.UNDER_SCRUTINY,
  SCRUTINY: ProjectStatus.UNDER_SCRUTINY,
  APPROVAL: ProjectStatus.APPROVED,
  NOTIFICATION: ProjectStatus.NOTIFIED,
  OBJECTIONS_CLAIMS: ProjectStatus.ACQUISITION_IN_PROGRESS,
  AWARD_DECLARATION: ProjectStatus.AWARD_DECLARED,
  COMPENSATION: ProjectStatus.COMPENSATION_IN_PROGRESS,
  POSSESSION: ProjectStatus.POSSESSION_IN_PROGRESS,
  R_AND_R: ProjectStatus.R_AND_R_IN_PROGRESS,
  PROJECT_CLOSURE: ProjectStatus.COMPLETED,
};

export function getNextWorkflowStage(stage: string): WorkflowStage | null {
  const currentIndex = WORKFLOW_STAGES.indexOf(stage as WorkflowStage);
  if (currentIndex < 0 || currentIndex === WORKFLOW_STAGES.length - 1) {
    return null;
  }

  return WORKFLOW_STAGES[currentIndex + 1];
}
