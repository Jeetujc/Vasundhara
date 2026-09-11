-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CENTRAL_OFFICER', 'STATE_OFFICER', 'DISTRICT_OFFICER', 'FIELD_OFFICER', 'PUBLIC_USER');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PROPOSED', 'UNDER_SCRUTINY', 'APPROVED', 'NOTIFIED', 'ACQUISITION_IN_PROGRESS', 'AWARD_DECLARED', 'COMPENSATION_IN_PROGRESS', 'POSSESSION_IN_PROGRESS', 'R_AND_R_IN_PROGRESS', 'COMPLETED', 'CLOSED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "ParcelStatus" AS ENUM ('PROPOSED', 'UNDER_SCRUTINY', 'APPROVED', 'NOTIFIED', 'OBJECTION', 'AWARD_DECLARED', 'COMPENSATION_PENDING', 'COMPENSATION_PAID', 'POSSESSION_PENDING', 'POSSESSION_COMPLETED', 'R_AND_R_PENDING', 'ACQUIRED', 'REJECTED');

-- CreateEnum
CREATE TYPE "WorkflowStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "WorkflowTaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE', 'BLOCKED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CompensationStatus" AS ENUM ('ASSESSED', 'APPROVED', 'PARTIALLY_PAID', 'PAID', 'PENDING', 'REJECTED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'APPROVED', 'DISBURSED', 'VERIFIED', 'FAILED');

-- CreateEnum
CREATE TYPE "PossessionStatus" AS ENUM ('ELIGIBLE', 'VERIFICATION_PENDING', 'VERIFIED', 'POSSESSION_RECORDED', 'COMPLETED', 'REJECTED');

-- CreateEnum
CREATE TYPE "RrStatus" AS ENUM ('ASSESSED', 'APPROVED', 'IN_PROGRESS', 'VERIFICATION_PENDING', 'COMPLETED', 'CLOSED');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'READ', 'FAILED');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('UPLOADED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "GrievanceStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED');

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "states" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "districts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "stateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tehsils" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tehsils_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "aadharId" TEXT,
    "mobileNo" TEXT NOT NULL,
    "dob" TIMESTAMP(3),
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "organizationId" TEXT,
    "stateId" TEXT,
    "districtId" TEXT,
    "tehsilId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'PROPOSED',
    "stateId" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "proposedArea" DECIMAL(18,4),
    "proposalDate" TIMESTAMP(3),
    "approvalDate" TIMESTAMP(3),
    "closureDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "land_parcels" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "parcelNumber" TEXT NOT NULL,
    "surveyNumber" TEXT,
    "village" TEXT,
    "tehsil" TEXT,
    "area" DECIMAL(18,4),
    "status" "ParcelStatus" NOT NULL DEFAULT 'PROPOSED',
    "geometry" geometry,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "land_parcels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "affected_families" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "familyReference" TEXT NOT NULL,
    "headOfFamily" TEXT,
    "contactNumber" TEXT,
    "address" TEXT,
    "numberOfMembers" INTEGER,
    "displaced" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "affected_families_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "family_parcels" (
    "id" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "parcelId" TEXT NOT NULL,
    "affectedArea" DECIMAL(18,4),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "family_parcels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_instances" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "currentStage" TEXT NOT NULL,
    "status" "WorkflowStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workflow_instances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_tasks" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "assignedToId" TEXT,
    "deadline" TIMESTAMP(3),
    "status" "WorkflowTaskStatus" NOT NULL DEFAULT 'PENDING',
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workflow_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "milestones" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compensation_cases" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "parcelId" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "assessedAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "approvedAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "paidAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "pendingAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "status" "CompensationStatus" NOT NULL DEFAULT 'ASSESSED',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "awardDate" TIMESTAMP(3),
    "paymentDate" TIMESTAMP(3),
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "compensation_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "possession_records" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "parcelId" TEXT NOT NULL,
    "fieldOfficerId" TEXT,
    "status" "PossessionStatus" NOT NULL DEFAULT 'ELIGIBLE',
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "evidenceUrl" TEXT,
    "remarks" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "recordedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "possession_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rr_cases" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "status" "RrStatus" NOT NULL DEFAULT 'ASSESSED',
    "housingSupport" BOOLEAN NOT NULL DEFAULT false,
    "financialAssistance" BOOLEAN NOT NULL DEFAULT false,
    "employmentSupport" BOOLEAN NOT NULL DEFAULT false,
    "relocationSupport" BOOLEAN NOT NULL DEFAULT false,
    "benefitsDescription" TEXT,
    "assessedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rr_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "projectId" TEXT,
    "parcelId" TEXT,
    "familyId" TEXT,
    "compensationId" TEXT,
    "possessionId" TEXT,
    "rrCaseId" TEXT,
    "uploadedById" TEXT,
    "name" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT,
    "sizeBytes" BIGINT,
    "status" "DocumentStatus" NOT NULL DEFAULT 'UPLOADED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "readAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "projectId" TEXT,
    "parcelId" TEXT,
    "familyId" TEXT,
    "compensationId" TEXT,
    "possessionId" TEXT,
    "rrCaseId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grievances" (
    "id" TEXT NOT NULL,
    "ticketNo" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "khasraNo" TEXT,
    "evidenceUrl" TEXT,
    "status" "GrievanceStatus" NOT NULL DEFAULT 'SUBMITTED',
    "resolution" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grievances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_code_key" ON "organizations"("code");

-- CreateIndex
CREATE INDEX "organizations_name_idx" ON "organizations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "states_code_key" ON "states"("code");

-- CreateIndex
CREATE INDEX "states_organizationId_idx" ON "states"("organizationId");

-- CreateIndex
CREATE INDEX "states_name_idx" ON "states"("name");

-- CreateIndex
CREATE INDEX "districts_stateId_idx" ON "districts"("stateId");

-- CreateIndex
CREATE INDEX "districts_name_idx" ON "districts"("name");

-- CreateIndex
CREATE UNIQUE INDEX "districts_stateId_code_key" ON "districts"("stateId", "code");

-- CreateIndex
CREATE INDEX "tehsils_districtId_idx" ON "tehsils"("districtId");

-- CreateIndex
CREATE INDEX "tehsils_name_idx" ON "tehsils"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tehsils_districtId_code_key" ON "tehsils"("districtId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "users_aadharId_key" ON "users"("aadharId");

-- CreateIndex
CREATE UNIQUE INDEX "users_mobileNo_key" ON "users"("mobileNo");

-- CreateIndex
CREATE INDEX "users_organizationId_idx" ON "users"("organizationId");

-- CreateIndex
CREATE INDEX "users_stateId_idx" ON "users"("stateId");

-- CreateIndex
CREATE INDEX "users_districtId_idx" ON "users"("districtId");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_isActive_idx" ON "users"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "projects_code_key" ON "projects"("code");

-- CreateIndex
CREATE INDEX "projects_stateId_idx" ON "projects"("stateId");

-- CreateIndex
CREATE INDEX "projects_districtId_idx" ON "projects"("districtId");

-- CreateIndex
CREATE INDEX "projects_status_idx" ON "projects"("status");

-- CreateIndex
CREATE INDEX "projects_name_idx" ON "projects"("name");

-- CreateIndex
CREATE INDEX "land_parcels_projectId_idx" ON "land_parcels"("projectId");

-- CreateIndex
CREATE INDEX "land_parcels_status_idx" ON "land_parcels"("status");

-- CreateIndex
CREATE UNIQUE INDEX "land_parcels_projectId_parcelNumber_key" ON "land_parcels"("projectId", "parcelNumber");

-- CreateIndex
CREATE UNIQUE INDEX "affected_families_familyReference_key" ON "affected_families"("familyReference");

-- CreateIndex
CREATE INDEX "affected_families_projectId_idx" ON "affected_families"("projectId");

-- CreateIndex
CREATE INDEX "affected_families_displaced_idx" ON "affected_families"("displaced");

-- CreateIndex
CREATE INDEX "family_parcels_familyId_idx" ON "family_parcels"("familyId");

-- CreateIndex
CREATE INDEX "family_parcels_parcelId_idx" ON "family_parcels"("parcelId");

-- CreateIndex
CREATE UNIQUE INDEX "family_parcels_familyId_parcelId_key" ON "family_parcels"("familyId", "parcelId");

-- CreateIndex
CREATE INDEX "workflow_instances_projectId_idx" ON "workflow_instances"("projectId");

-- CreateIndex
CREATE INDEX "workflow_instances_status_idx" ON "workflow_instances"("status");

-- CreateIndex
CREATE INDEX "workflow_instances_currentStage_idx" ON "workflow_instances"("currentStage");

-- CreateIndex
CREATE INDEX "workflow_tasks_workflowId_idx" ON "workflow_tasks"("workflowId");

-- CreateIndex
CREATE INDEX "workflow_tasks_assignedToId_idx" ON "workflow_tasks"("assignedToId");

-- CreateIndex
CREATE INDEX "workflow_tasks_status_idx" ON "workflow_tasks"("status");

-- CreateIndex
CREATE INDEX "workflow_tasks_deadline_idx" ON "workflow_tasks"("deadline");

-- CreateIndex
CREATE INDEX "milestones_projectId_idx" ON "milestones"("projectId");

-- CreateIndex
CREATE INDEX "milestones_dueDate_idx" ON "milestones"("dueDate");

-- CreateIndex
CREATE INDEX "compensation_cases_projectId_idx" ON "compensation_cases"("projectId");

-- CreateIndex
CREATE INDEX "compensation_cases_parcelId_idx" ON "compensation_cases"("parcelId");

-- CreateIndex
CREATE INDEX "compensation_cases_familyId_idx" ON "compensation_cases"("familyId");

-- CreateIndex
CREATE INDEX "compensation_cases_status_idx" ON "compensation_cases"("status");

-- CreateIndex
CREATE INDEX "compensation_cases_paymentStatus_idx" ON "compensation_cases"("paymentStatus");

-- CreateIndex
CREATE INDEX "possession_records_projectId_idx" ON "possession_records"("projectId");

-- CreateIndex
CREATE INDEX "possession_records_parcelId_idx" ON "possession_records"("parcelId");

-- CreateIndex
CREATE INDEX "possession_records_fieldOfficerId_idx" ON "possession_records"("fieldOfficerId");

-- CreateIndex
CREATE INDEX "possession_records_status_idx" ON "possession_records"("status");

-- CreateIndex
CREATE INDEX "rr_cases_projectId_idx" ON "rr_cases"("projectId");

-- CreateIndex
CREATE INDEX "rr_cases_familyId_idx" ON "rr_cases"("familyId");

-- CreateIndex
CREATE INDEX "rr_cases_status_idx" ON "rr_cases"("status");

-- CreateIndex
CREATE INDEX "documents_projectId_idx" ON "documents"("projectId");

-- CreateIndex
CREATE INDEX "documents_parcelId_idx" ON "documents"("parcelId");

-- CreateIndex
CREATE INDEX "documents_familyId_idx" ON "documents"("familyId");

-- CreateIndex
CREATE INDEX "documents_compensationId_idx" ON "documents"("compensationId");

-- CreateIndex
CREATE INDEX "documents_possessionId_idx" ON "documents"("possessionId");

-- CreateIndex
CREATE INDEX "documents_rrCaseId_idx" ON "documents"("rrCaseId");

-- CreateIndex
CREATE INDEX "documents_uploadedById_idx" ON "documents"("uploadedById");

-- CreateIndex
CREATE INDEX "documents_status_idx" ON "documents"("status");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_status_idx" ON "notifications"("status");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_projectId_idx" ON "audit_logs"("projectId");

-- CreateIndex
CREATE INDEX "audit_logs_parcelId_idx" ON "audit_logs"("parcelId");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "audit_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "grievances_ticketNo_key" ON "grievances"("ticketNo");

-- CreateIndex
CREATE INDEX "grievances_userId_idx" ON "grievances"("userId");

-- CreateIndex
CREATE INDEX "grievances_projectId_idx" ON "grievances"("projectId");

-- CreateIndex
CREATE INDEX "grievances_status_idx" ON "grievances"("status");

-- AddForeignKey
ALTER TABLE "states" ADD CONSTRAINT "states_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "districts" ADD CONSTRAINT "districts_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tehsils" ADD CONSTRAINT "tehsils_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "states"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "districts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_tehsilId_fkey" FOREIGN KEY ("tehsilId") REFERENCES "tehsils"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "land_parcels" ADD CONSTRAINT "land_parcels_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "affected_families" ADD CONSTRAINT "affected_families_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_parcels" ADD CONSTRAINT "family_parcels_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "affected_families"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_parcels" ADD CONSTRAINT "family_parcels_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "land_parcels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_instances" ADD CONSTRAINT "workflow_instances_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_tasks" ADD CONSTRAINT "workflow_tasks_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflow_instances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_tasks" ADD CONSTRAINT "workflow_tasks_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compensation_cases" ADD CONSTRAINT "compensation_cases_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compensation_cases" ADD CONSTRAINT "compensation_cases_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "land_parcels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compensation_cases" ADD CONSTRAINT "compensation_cases_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "affected_families"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "possession_records" ADD CONSTRAINT "possession_records_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "possession_records" ADD CONSTRAINT "possession_records_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "land_parcels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "possession_records" ADD CONSTRAINT "possession_records_fieldOfficerId_fkey" FOREIGN KEY ("fieldOfficerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rr_cases" ADD CONSTRAINT "rr_cases_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rr_cases" ADD CONSTRAINT "rr_cases_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "affected_families"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "land_parcels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "affected_families"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_compensationId_fkey" FOREIGN KEY ("compensationId") REFERENCES "compensation_cases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_possessionId_fkey" FOREIGN KEY ("possessionId") REFERENCES "possession_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_rrCaseId_fkey" FOREIGN KEY ("rrCaseId") REFERENCES "rr_cases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "land_parcels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "affected_families"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_compensationId_fkey" FOREIGN KEY ("compensationId") REFERENCES "compensation_cases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_possessionId_fkey" FOREIGN KEY ("possessionId") REFERENCES "possession_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_rrCaseId_fkey" FOREIGN KEY ("rrCaseId") REFERENCES "rr_cases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grievances" ADD CONSTRAINT "grievances_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grievances" ADD CONSTRAINT "grievances_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

