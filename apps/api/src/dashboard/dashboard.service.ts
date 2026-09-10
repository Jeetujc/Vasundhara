import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Role, ProjectStatus, ParcelStatus, WorkflowTaskStatus, CompensationStatus, PaymentStatus } from '../generated/prisma/client.js';

interface UserContext {
  id: string;
  role: Role;
  stateId?: string;
  districtId?: string;
  tehsilId?: string;
  mobileNo?: string;
  name?: string;
}

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  // ==========================================
  // CITIZEN DASHBOARD
  // ==========================================
  async getCitizenDashboard(userContext: UserContext) {
    const user = await this.prisma.user.findUnique({
      where: { id: userContext.id },
      include: {
        state: true,
        district: true,
        tehsil: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Find affected family associated with user's mobileNo or name
    let family = await this.prisma.affectedFamily.findFirst({
      where: {
        OR: [
          { contactNumber: user.mobileNo },
          { headOfFamily: { contains: user.name, mode: 'insensitive' } },
        ],
      },
      include: {
        project: {
          include: { state: true, district: true },
        },
        parcels: {
          include: { parcel: true },
        },
        compensationCases: {
          include: { parcel: true },
        },
        rrCases: true,
      },
    });

    // If no family linked to this user yet, fallback to first prototype family if prototype demo
    if (!family) {
      family = await this.prisma.affectedFamily.findFirst({
        include: {
          project: {
            include: { state: true, district: true },
          },
          parcels: {
            include: { parcel: true },
          },
          compensationCases: {
            include: { parcel: true },
          },
          rrCases: true,
        },
      });
    }

    // Compensation calculation
    const compCase = family?.compensationCases?.[0];
    const totalAward = compCase ? Number(compCase.approvedAmount || compCase.assessedAmount) : 8050000;
    const baseMarketValue = Math.round(totalAward * 0.3105);
    const locationMultiplier = Math.round(totalAward * 0.4658);
    const attachedAssets = Math.round(totalAward * 0.0311);
    const basicCompensation = baseMarketValue + locationMultiplier + attachedAssets;
    const solatium = Math.round(totalAward * 0.4968);
    const displacementAllowance = 50000;

    // R&R benefits
    const rrCase = family?.rrCases?.[0];
    const rrBenefits = {
      displacementAllowance: 50000,
      housingPlot: 'Sector 4, Plot No. 12',
      housingSupport: rrCase ? rrCase.housingSupport : true,
      financialAssistance: rrCase ? rrCase.financialAssistance : true,
      relocationSupport: rrCase ? rrCase.relocationSupport : true,
      status: rrCase?.status || 'IN_PROGRESS',
    };

    // Acquisition Tracker stages
    const trackerStages = [
      {
        id: 'sec11',
        title: 'Section 11 Preliminary Notification',
        date: '12 JAN 2026',
        status: 'COMPLETED',
        description: 'Gazette notification published in official state portal.',
      },
      {
        id: 'sec15',
        title: 'Section 15 Hearing & Objections',
        date: '05 MAR 2026',
        status: 'COMPLETED',
        description: 'Public hearing conducted and objections resolved.',
      },
      {
        id: 'sec21',
        title: 'Award Declared & Bank Verification',
        date: compCase?.awardDate ? new Date(compCase.awardDate).toLocaleDateString('en-GB') : '15 AUG 2026',
        status: compCase?.status === CompensationStatus.APPROVED ? 'IN_PROGRESS' : 'PENDING',
        description: 'Pending citizen Aadhaar-linked bank account validation.',
      },
      {
        id: 'sec38',
        title: 'Disbursement & Possession',
        date: 'Tentative OCT 2026',
        status: 'PENDING',
        description: 'Direct beneficiary transfer via PFMS followed by pegging.',
      },
    ];

    // Documents
    const documents = await this.prisma.document.findMany({
      where: {
        OR: [
          { uploadedById: user.id },
          ...(family ? [{ familyId: family.id }, { projectId: family.projectId }] : []),
        ],
      },
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    const mappedDocs = documents.map((d) => ({
      id: d.id,
      name: d.name,
      storageKey: d.storageKey,
      mimeType: d.mimeType,
      sizeBytes: d.sizeBytes ? Number(d.sizeBytes) : null,
      status: d.status,
      createdAt: d.createdAt,
    }));

    // Grievances
    const grievances = await this.prisma.grievance.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    // Notifications
    const notifications = await this.prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const unreadCount = await this.prisma.notification.count({
      where: { userId: user.id, status: { not: 'READ' } },
    });

    // Associated Land Parcel details
    const parcelRecord = family?.parcels?.[0]?.parcel;

    return {
      user: {
        id: user.id,
        name: user.name,
        aadharId: user.aadharId,
        mobileNo: user.mobileNo,
        role: user.role,
        stateName: user.state?.name || 'Madhya Pradesh',
        districtName: user.district?.name || 'Jabalpur',
        tehsilName: user.tehsil?.name || 'Panagar',
      },
      parcel: {
        parcelNumber: parcelRecord?.parcelNumber || '452/1',
        surveyNumber: parcelRecord?.surveyNumber || 'SV-452-A',
        village: parcelRecord?.village || 'Rau / Panagar',
        tehsil: parcelRecord?.tehsil || 'Panagar',
        areaHectares: parcelRecord ? Number(parcelRecord.area) : 2.45,
        status: parcelRecord?.status || 'AWARD_DECLARED',
        projectName: family?.project?.name || 'NH-44 Highway Widening (Jabalpur Stretch)',
        projectCode: family?.project?.code || 'NH44-JBP',
      },
      compensation: {
        totalAward,
        baseMarketValue,
        locationMultiplier,
        attachedAssets,
        basicCompensation,
        solatium,
        displacementAllowance,
        status: compCase?.status || 'APPROVED',
        paymentStatus: compCase?.paymentStatus || 'PENDING',
        awardDate: compCase?.awardDate || new Date('2026-03-01'),
      },
      rrBenefits,
      trackerStages,
      documents: mappedDocs,
      grievances: {
        totalCount: grievances.length,
        latest: grievances[0] || null,
        items: grievances,
      },
      notifications: {
        unreadCount,
        items: notifications,
      },
    };
  }

  // ==========================================
  // STATE DASHBOARD
  // ==========================================
  async getStateDashboard(userContext: UserContext, requestedStateId?: string) {
    let stateId = requestedStateId || userContext.stateId;

    if (userContext.role === Role.STATE_OFFICER) {
      if (!userContext.stateId) {
        throw new ForbiddenException('State officer has no assigned state');
      }
      stateId = userContext.stateId;
    }

    const state = stateId
      ? await this.prisma.state.findUnique({ where: { id: stateId } })
      : await this.prisma.state.findFirst({ where: { code: 'MP' } });

    if (!state) {
      throw new NotFoundException('State not found');
    }

    const projects = await this.prisma.project.findMany({
      where: { stateId: state.id },
      include: {
        district: true,
        _count: {
          select: { parcels: true, compensationCases: true, rrCases: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalProjects = projects.length;
    const totalProposedArea = projects.reduce(
      (sum, p) => sum + (p.proposedArea ? Number(p.proposedArea) : 0),
      0,
    );

    const compCases = await this.prisma.compensationCase.findMany({
      where: { project: { stateId: state.id } },
    });

    const totalDisbursed = compCases.reduce((sum, c) => sum + Number(c.paidAmount), 0);
    const totalPending = compCases.reduce((sum, c) => sum + Number(c.pendingAmount), 0);

    const districts = await this.prisma.district.findMany({
      where: { stateId: state.id },
      include: {
        _count: { select: { projects: true, tehsils: true } },
      },
    });

    // Format clear and realistic metrics for State UI
    return {
      state: {
        id: state.id,
        name: state.name,
        code: state.code,
      },
      kpis: {
        activeProjects: totalProjects || 24,
        totalDistrictsCount: districts.length || 52,
        landTargetHectares: totalProposedArea > 0 ? Math.round(totalProposedArea) : 18500,
        acquiredPercentage: 68,
        fundsDisbursedCr: totalDisbursed > 0 ? (totalDisbursed / 10000000).toFixed(2) : '4,250',
        fundsAtRiskCr: totalPending > 0 ? (totalPending / 10000000).toFixed(2) : '840',
      },
      districtEfficiencyRanking: [
        { rank: 1, name: 'Indore', avgDays: 210, badge: 'normal' },
        { rank: 2, name: 'Jabalpur', avgDays: 228, badge: 'normal' },
        { rank: 3, name: 'Bhopal', avgDays: 245, badge: 'normal' },
        { rank: 51, name: 'Ujjain', avgDays: 415, badge: 'warning' },
        { rank: 52, name: 'Dhar', avgDays: 430, badge: 'warning' },
      ],
      statutoryRadar: projects.map((p) => ({
        id: p.id,
        name: p.name,
        district: p.district.name,
        status: p.status,
        daysLeft: p.status === ProjectStatus.AWARD_DECLARED ? 42 : 14,
        percent: p.status === ProjectStatus.AWARD_DECLARED ? 85 : 95,
      })),
      clearanceTracker: projects.map((p) => ({
        id: p.id,
        name: p.name,
        code: p.code,
        areaHectares: p.proposedArea ? Number(p.proposedArea) : 420,
        district: p.district.name,
        revenueStatus: p.status === ProjectStatus.COMPLETED ? 'Cleared (100%)' : 'Cleared (85%)',
        forestStatus: 'Cleared',
        requiringBodyStatus: 'Funds Received',
      })),
    };
  }

  // ==========================================
  // DISTRICT DASHBOARD
  // ==========================================
  async getDistrictDashboard(userContext: UserContext, requestedDistrictId?: string) {
    let districtId = requestedDistrictId || userContext.districtId;

    if (userContext.role === Role.DISTRICT_OFFICER) {
      if (!userContext.districtId) {
        throw new ForbiddenException('District officer has no assigned district');
      }
      districtId = userContext.districtId;
    }

    const district = districtId
      ? await this.prisma.district.findUnique({
          where: { id: districtId },
          include: { state: true, tehsils: true },
        })
      : await this.prisma.district.findFirst({
          where: { code: 'JBP' },
          include: { state: true, tehsils: true },
        });

    if (!district) {
      throw new NotFoundException('District not found');
    }

    const projects = await this.prisma.project.findMany({
      where: { districtId: district.id },
      include: {
        workflowInstances: {
          include: { tasks: true },
        },
        affectedFamilies: {
          include: { rrCases: true },
        },
        compensationCases: true,
        parcels: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalProjects = projects.length;
    const totalLandTarget = projects.reduce(
      (sum, p) => sum + (p.proposedArea ? Number(p.proposedArea) : 0),
      0,
    );

    // Pending tasks / approvals for this district
    const pendingTasks = await this.prisma.workflowTask.findMany({
      where: {
        workflow: { project: { districtId: district.id } },
        status: { in: [WorkflowTaskStatus.PENDING, WorkflowTaskStatus.IN_PROGRESS] },
      },
      include: {
        workflow: { include: { project: true } },
      },
      take: 5,
    });

    // Milestone tracker table rows
    const milestoneRows = projects.map((p) => {
      const isAwarded = ([
        ProjectStatus.AWARD_DECLARED,
        ProjectStatus.COMPENSATION_IN_PROGRESS,
        ProjectStatus.POSSESSION_IN_PROGRESS,
        ProjectStatus.R_AND_R_IN_PROGRESS,
        ProjectStatus.COMPLETED,
      ] as ProjectStatus[]).includes(p.status);

      const isNotified = ([
        ProjectStatus.NOTIFIED,
        ProjectStatus.ACQUISITION_IN_PROGRESS,
        ProjectStatus.AWARD_DECLARED,
        ProjectStatus.COMPLETED,
      ] as ProjectStatus[]).includes(p.status);

      return {
        id: p.id,
        name: p.name,
        code: p.code,
        requiringBody: 'NHAI / Railways / Water Resources',
        targetArea: p.proposedArea ? Number(p.proposedArea) : 420,
        sec11: true,
        sec15: isNotified,
        sec19: isAwarded,
        sec21: isAwarded ? 'COMPLETED' : 'IN_PROGRESS',
        possession: p.status === ProjectStatus.COMPLETED ? 'COMPLETED' : 'PENDING',
      };
    });

    // R&R compliance rows
    const rrRows = projects.map((p) => {
      const pafs = p.affectedFamilies.length || 312;
      const rrCases = p.affectedFamilies.flatMap((f) => f.rrCases);
      const housingAllocated = Math.round(pafs * 0.89);
      const employmentProvided = Math.round(pafs * 0.48);

      return {
        id: p.id,
        projectName: p.name,
        totalPafs: pafs,
        housingPlots: `${housingAllocated} / ${pafs}`,
        housingPct: 89,
        employment: `${employmentProvided} / ${pafs}`,
        employmentPct: 48,
        allowance: `${pafs} / ${pafs}`,
        allowancePct: 100,
        status: 'In Progress',
      };
    });

    return {
      district: {
        id: district.id,
        name: district.name,
        code: district.code,
        stateName: district.state.name,
        tehsilsCount: district.tehsils.length,
      },
      kpis: {
        totalActiveProjects: totalProjects || 12,
        landAcquiredTarget: totalLandTarget > 0 ? Math.round(totalLandTarget) : 1240,
        tehsilsCount: district.tehsils.length || 6,
      },
      milestoneTracker: milestoneRows,
      rrTracker: rrRows,
      pendingApprovals: pendingTasks.map((t) => ({
        id: t.id,
        title: t.title,
        projectName: t.workflow.project.name,
        stage: t.stage,
        status: t.status,
      })),
      financialEscrow: {
        totalDepositedCr: '1,200.00',
        disbursedCr: '820.50',
        pendingCr: '379.50',
      },
    };
  }

  // ==========================================
  // NATIONAL DASHBOARD
  // ==========================================
  async getNationalDashboard() {
    const totalProjects = await this.prisma.project.count();
    const projects = await this.prisma.project.findMany({
      include: { state: true, district: true },
    });

    const totalArea = projects.reduce(
      (sum, p) => sum + (p.proposedArea ? Number(p.proposedArea) : 0),
      0,
    );

    const compCases = await this.prisma.compensationCase.findMany();
    const totalDisbursed = compCases.reduce((sum, c) => sum + Number(c.paidAmount), 0);
    const totalPending = compCases.reduce((sum, c) => sum + Number(c.pendingAmount), 0);

    const states = await this.prisma.state.findMany({
      include: {
        _count: { select: { projects: true, districts: true } },
      },
    });

    return {
      nationalKpis: {
        centralPipeline: totalProjects > 0 ? totalProjects : 284,
        aggregateLandHectares: totalArea > 0 ? Math.round(totalArea) : 1420000,
        escrowDisbursedCr: totalDisbursed > 0 ? (totalDisbursed / 10000000).toFixed(2) : '1,20,000',
        capitalBlockedCr: totalPending > 0 ? (totalPending / 10000000).toFixed(2) : '1,80,000',
      },
      statesSummary: states.map((s) => ({
        id: s.id,
        name: s.name,
        code: s.code,
        projectsCount: s._count.projects,
        districtsCount: s._count.districts,
      })),
      corridorProjects: projects.map((p) => ({
        id: p.id,
        name: p.name,
        code: p.code,
        state: p.state.name,
        district: p.district.name,
        status: p.status,
      })),
    };
  }

  // ==========================================
  // FIELD OFFICER DASHBOARD
  // ==========================================
  async getFieldDashboard(userContext: UserContext) {
    const user = await this.prisma.user.findUnique({
      where: { id: userContext.id },
      include: { state: true, district: true, tehsil: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Tasks assigned to this field officer
    const assignedTasks = await this.prisma.workflowTask.findMany({
      where: { assignedToId: user.id },
      include: {
        workflow: {
          include: { project: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Parcels in field officer's jurisdiction
    const parcels = await this.prisma.landParcel.findMany({
      where: {
        OR: [
          ...(user.districtId ? [{ project: { districtId: user.districtId } }] : []),
          ...(user.tehsil ? [{ tehsil: user.tehsil.name }] : []),
        ],
      },
      include: {
        project: { select: { id: true, name: true, code: true } },
      },
      take: 10,
    });

    return {
      officer: {
        id: user.id,
        name: user.name,
        patwariId: `MP-IND-${user.id.slice(-3)}`,
        districtName: user.district?.name || 'Jabalpur',
        tehsilName: user.tehsil?.name || 'Panagar',
      },
      tasks: assignedTasks.map((t) => ({
        id: t.id,
        title: t.title,
        stage: t.stage,
        projectName: t.workflow.project.name,
        deadline: t.deadline,
        status: t.status,
      })),
      assignedParcels: parcels.map((p) => ({
        id: p.id,
        parcelNumber: p.parcelNumber,
        surveyNumber: p.surveyNumber,
        village: p.village,
        area: p.area ? Number(p.area) : 0,
        status: p.status,
        projectName: p.project.name,
      })),
    };
  }

  // ==========================================
  // ADMIN DASHBOARD
  // ==========================================
  async getAdminDashboard() {
    const [
      totalUsers,
      publicUsers,
      officers,
      projectsCount,
      parcelsCount,
      auditLogsCount,
      statesCount,
      districtsCount,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: Role.PUBLIC_USER } }),
      this.prisma.user.count({ where: { role: { not: Role.PUBLIC_USER } } }),
      this.prisma.project.count(),
      this.prisma.landParcel.count(),
      this.prisma.auditLog.count(),
      this.prisma.state.count(),
      this.prisma.district.count(),
    ]);

    const recentUsers = await this.prisma.user.findMany({
      where: { role: { not: Role.PUBLIC_USER } },
      include: { state: true, district: true, tehsil: true, organization: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const recentAudits = await this.prisma.auditLog.findMany({
      include: {
        user: { select: { id: true, name: true, role: true } },
        project: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return {
      stats: {
        totalUsers,
        publicUsers,
        officers,
        projectsCount,
        parcelsCount,
        auditLogsCount,
        statesCount,
        districtsCount,
      },
      authorityAccounts: recentUsers.map((u) => ({
        id: u.id,
        name: u.name,
        aadharId: u.aadharId ? `XXXX-XXXX-${u.aadharId.slice(-4)}` : 'N/A',
        mobileNo: u.mobileNo,
        role: u.role,
        state: u.state?.name || 'National',
        district: u.district?.name || 'All',
        tehsil: u.tehsil?.name || 'All',
        isActive: u.isActive,
        createdAt: u.createdAt,
      })),
      recentAudits: recentAudits.map((a) => ({
        id: a.id,
        action: a.action,
        entityType: a.entityType,
        description: a.description,
        performedBy: a.user?.name || 'System',
        role: a.user?.role || 'SYSTEM',
        createdAt: a.createdAt,
      })),
    };
  }
}
