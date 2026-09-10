'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService, type AuthUser } from '../../../../services/auth.service';
import { projectService } from '../../../../services/project.service';
import { workflowService } from '../../../../services/workflow.service';
import { aiService, type AiProjectAnalysis } from '../../../../services/ai.service';

interface ProjectDetail {
  id: string; name: string; code: string; description?: string; status: string;
  proposedArea?: number; proposalDate?: string; approvalDate?: string; closureDate?: string;
  state?: { id: string; name: string; code: string }; district?: { id: string; name: string; code: string };
  _count?: { parcels: number; workflowInstances: number; compensationCases: number; possessionRecords: number; rrCases: number; documents: number; auditLogs: number };
  createdAt: string; updatedAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  PROPOSED: 'bg-blue-100 text-blue-800', UNDER_SCRUTINY: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800', NOTIFIED: 'bg-indigo-100 text-indigo-800',
  ACQUISITION_IN_PROGRESS: 'bg-orange-100 text-orange-800', AWARD_DECLARED: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-emerald-100 text-emerald-800', CLOSED: 'bg-gray-100 text-gray-800',
};

export default function ProjectOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.projectId as string;
  const [user, setUser] = useState<AuthUser | null>(null);
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startingWorkflow, setStartingWorkflow] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AiProjectAnalysis | null>(null);
  const [analyzingAi, setAnalyzingAi] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  useEffect(() => {
    const session = authService.getSession();
    if (!session) { router.replace('/login/mainlogin'); return; }
    setUser(session.user);

    (async () => {
      try {
        setLoading(true);
        const p = await projectService.get(projectId);
        setProject(p as any);
      } catch (err: any) {
        setError(err.message || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    })();
  }, [projectId, router]);

  const handleStartWorkflow = async () => {
    if (!project) return;
    try {
      setStartingWorkflow(true);
      await workflowService.start({ projectId: project.id });
      const p = await projectService.get(projectId);
      setProject(p as any);
    } catch (err: any) {
      alert(err.message || 'Failed to start workflow');
    } finally {
      setStartingWorkflow(false);
    }
  };

  const handleRunAiAnalysis = async () => {
    if (!project) return;
    try {
      setAnalyzingAi(true);
      const res = await aiService.analyzeProject(project.id);
      setAiAnalysis(res);
      setShowAiModal(true);
    } catch (err: any) {
      alert(err?.message || 'AI analysis failed.');
    } finally {
      setAnalyzingAi(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-10 h-10 border-4 border-[#DDD8C8] border-t-[#1D5FA8] rounded-full animate-spin" /></div>;
  if (error) return <div className="p-6"><div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">{error}</div></div>;
  if (!project) return null;

  const canEdit = user && ['ADMIN', 'CENTRAL_OFFICER', 'STATE_OFFICER', 'DISTRICT_OFFICER'].includes(user.role);
  const canStartWorkflow = user && ['ADMIN', 'CENTRAL_OFFICER', 'STATE_OFFICER', 'DISTRICT_OFFICER'].includes(user.role);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#122C4A]">{project.name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="font-mono text-sm text-[#5B6472]">{project.code}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[project.status] || 'bg-gray-100 text-gray-800'}`}>
              {project.status.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* AI Predictor Button */}
          <button
            onClick={handleRunAiAnalysis}
            disabled={analyzingAi}
            className="bg-[#0B1F35] hover:bg-[#122C4A] text-white border border-[#1D5FA8] px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            <span className="text-[#F2A71B]">⚡ AI</span>
            {analyzingAi ? 'Predicting...' : 'Risk & Delay Analysis'}
          </button>

          {/* GIS Map Link */}
          <Link
            href={`/gis?projectId=${project.id}`}
            className="bg-[#1D5FA8] hover:bg-[#122C4A] text-white px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            GIS Corridor Map
          </Link>

          {/* Field Officer Workspace */}
          <Link
            href="/dashboard/field"
            className="bg-[#B96E22] hover:bg-[#965516] text-white px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm"
          >
            Field Survey
          </Link>

          {canStartWorkflow && project._count?.workflowInstances === 0 && (
            <button onClick={handleStartWorkflow} disabled={startingWorkflow}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-semibold disabled:opacity-50">
              {startingWorkflow ? 'Starting...' : '▶ Start Workflow'}
            </button>
          )}
        </div>
      </div>

      {/* AI Analysis Modal */}
      {showAiModal && aiAnalysis && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#10B981] animate-ping" />
                <h3 className="font-serif font-bold text-base text-[#122C4A]">
                  ForestGreen AI Acquisition Risk Prediction
                </h3>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Litigation &amp; Hold Risk</span>
                <div className={`text-3xl font-serif font-bold mt-1 ${
                  aiAnalysis.riskScore > 60 ? 'text-red-600' : aiAnalysis.riskScore > 35 ? 'text-amber-600' : 'text-green-600'
                }`}>
                  {aiAnalysis.riskScore}%
                </div>
                <span className="text-[10px] text-gray-500">Confidence: {(aiAnalysis.confidence * 100).toFixed(0)}%</span>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Predicted Delay Duration</span>
                <div className="text-3xl font-serif font-bold text-[#122C4A] mt-1">
                  {aiAnalysis.averageDelayDays} Days
                </div>
                <span className="text-[10px] text-gray-500">Over Statutory Timeline</span>
              </div>
            </div>

            <div className="bg-[#FDF8E3] border border-[#E7DFB8] rounded-lg p-3.5 text-xs space-y-1">
              <h4 className="font-bold text-[#B96E22] uppercase tracking-wider text-[10px]">
                Strategic Recommendation
              </h4>
              <p className="text-gray-800 leading-relaxed">{aiAnalysis.remark}</p>
            </div>

            <div className="text-[11px] text-gray-500 space-y-1 pt-1">
              <div>Model: <strong>{aiAnalysis.model}</strong></div>
              <div>Training Corpus: <span className="font-mono text-[10px]">{aiAnalysis.dataset}</span></div>
            </div>

            <div className="pt-3 border-t flex justify-end">
              <button
                onClick={() => setShowAiModal(false)}
                className="bg-[#122C4A] text-white text-xs font-bold px-4 py-2 rounded"
              >
                Close Analysis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Parcels', value: project._count?.parcels ?? 0, href: `/projects/${project.id}/parcels` },
          { label: 'Compensation Cases', value: project._count?.compensationCases ?? 0, href: `/projects/${project.id}/compensation` },
          { label: 'Possession Records', value: project._count?.possessionRecords ?? 0, href: `/projects/${project.id}/possession` },
          { label: 'R&R Cases', value: project._count?.rrCases ?? 0, href: `/projects/${project.id}/r-and-r` },
        ].map((card) => (
          <Link key={card.label} href={card.href}
            className="bg-white border border-[#E8E4D9] rounded-xl p-4 hover:border-[#1D5FA8] transition-colors">
            <div className="text-3xl font-bold text-[#122C4A]">{card.value}</div>
            <div className="text-sm text-[#5B6472] mt-1">{card.label}</div>
          </Link>
        ))}
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#E8E4D9] rounded-xl p-5">
          <h3 className="text-lg font-semibold text-[#122C4A] mb-4">Project Information</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-[#5B6472]">Name</dt><dd className="font-medium text-[#122C4A]">{project.name}</dd></div>
            <div className="flex justify-between"><dt className="text-[#5B6472]">Code</dt><dd className="font-mono">{project.code}</dd></div>
            <div className="flex justify-between"><dt className="text-[#5B6472]">Status</dt><dd>{project.status.replace(/_/g, ' ')}</dd></div>
            <div className="flex justify-between"><dt className="text-[#5B6472]">Proposed Area</dt><dd>{project.proposedArea ?? '—'} Ha</dd></div>
            <div className="flex justify-between"><dt className="text-[#5B6472]">Created</dt><dd>{new Date(project.createdAt).toLocaleDateString('en-IN')}</dd></div>
            {project.proposalDate && <div className="flex justify-between"><dt className="text-[#5B6472]">Proposed</dt><dd>{new Date(project.proposalDate).toLocaleDateString('en-IN')}</dd></div>}
            {project.approvalDate && <div className="flex justify-between"><dt className="text-[#5B6472]">Approved</dt><dd>{new Date(project.approvalDate).toLocaleDateString('en-IN')}</dd></div>}
          </dl>
        </div>

        <div className="bg-white border border-[#E8E4D9] rounded-xl p-5">
          <h3 className="text-lg font-semibold text-[#122C4A] mb-4">Location</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-[#5B6472]">State</dt><dd className="font-medium">{project.state?.name || '—'}</dd></div>
            <div className="flex justify-between"><dt className="text-[#5B6472]">District</dt><dd className="font-medium">{project.district?.name || '—'}</dd></div>
          </dl>

          {project.description && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-[#122C4A] mb-2">Description</h4>
              <p className="text-sm text-[#5B6472] leading-relaxed">{project.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
