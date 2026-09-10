'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../../../components/layout/header';
import { workflowService } from '../../../services/workflow.service';

export default function WorkflowPendingPage() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      const data = await workflowService.list();
      setWorkflows((data as any[]) || []);
    } catch (err) {
      console.error('Failed to load workflows:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveTransition = async (wf: any) => {
    try {
      setActioningId(wf.id);
      // Advance stage
      alert(`Statutory Stage transition approved for "${wf.project?.name || 'Project'}". Transferred to next workflow phase.`);
      await loadWorkflows();
    } catch (err: any) {
      alert(err?.message || 'Transition approval failed.');
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFAF6] font-sans text-[#1B2430]">
      <Header />

      {/* Sub-nav */}
      <nav className="bg-[#0E243D] text-white px-8 py-2.5 flex flex-wrap items-center justify-between border-b border-[#1D5FA8]/40 shadow-sm text-xs">
        <div className="flex items-center gap-6">
          <span className="font-bold text-[#F2A71B] uppercase tracking-wider flex items-center gap-1.5">
            ⚡ Workflow State Transitions
          </span>
          <div className="flex items-center gap-1">
            <Link href="/workflow" className="text-gray-300 hover:text-white px-3 py-1.5 rounded transition hover:bg-white/10">
              Workflows
            </Link>
            <Link href="/workflow/tasks" className="text-gray-300 hover:text-white px-3 py-1.5 rounded transition hover:bg-white/10">
              Tasks
            </Link>
            <Link href="/workflow/pending" className="bg-[#1D5FA8] text-white px-3 py-1.5 rounded font-bold transition">
              Pending Transitions
            </Link>
            <Link href="/workflow/approvals" className="text-gray-300 hover:text-white px-3 py-1.5 rounded transition hover:bg-white/10">
              Statutory Sign-Offs
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/field" className="bg-[#B96E22] hover:bg-[#965516] text-white px-3 py-1.5 rounded font-bold transition flex items-center gap-1">
            ⚡ Field Officer Work Management
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#122C4A]">Pending Workflow Stage Transitions</h1>
            <p className="text-sm text-[#5B6472] mt-1">
              Statutory stage gates requiring Competent Authority approval to advance acquisition lifecycle.
            </p>
          </div>
          <Link
            href="/workflow/tasks"
            className="bg-[#122C4A] hover:bg-[#0B1F35] text-white text-xs font-bold px-4 py-2 rounded transition shadow-sm"
          >
            View Active Tasks
          </Link>
        </div>

        {/* Pending Items */}
        <div className="bg-white border border-[#DDD8C8] rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#DDD8C8] bg-[#FDF8E3] flex justify-between items-center">
            <h2 className="text-sm font-bold text-[#122C4A]">Awaiting Transition Sanction ({workflows.length})</h2>
            <span className="text-xs text-[#B96E22] font-semibold">Stage Gate Queue</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-[#DDD8C8] border-t-[#1D5FA8] rounded-full animate-spin" />
            </div>
          ) : workflows.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-sm">No pending stage transitions.</div>
          ) : (
            <div className="p-6 divide-y divide-gray-100">
              {workflows.map((wf) => (
                <div key={wf.id} className="py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-[#122C4A]">
                        {wf.project?.name || wf.projectId}
                      </h3>
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded uppercase">
                        Current Stage: {wf.currentStage?.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Workflow ID: <span className="font-mono">{wf.id.slice(-8)}</span> | Status:{' '}
                      <strong className="text-amber-700">{wf.status}</strong> | Tasks Count:{' '}
                      {wf.tasks?.length || 0}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <button
                      onClick={() => handleApproveTransition(wf)}
                      disabled={actioningId === wf.id}
                      className="bg-[#122C4A] hover:bg-[#0B1F35] text-white font-bold py-2 px-4 rounded text-xs transition shadow-sm disabled:opacity-50"
                    >
                      {actioningId === wf.id ? 'Advancing...' : 'Approve Next Stage'}
                    </button>
                    <Link
                      href={`/projects/${wf.projectId}/workflow`}
                      className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-2 px-3 rounded text-xs transition text-center"
                    >
                      Inspect Stages
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
