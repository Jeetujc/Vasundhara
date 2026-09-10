'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { authService, type AuthUser } from '../../../../services/auth.service';
import { workflowService } from '../../../../services/workflow.service';
import { adminService } from '../../../../services/admin.service';

const WORKFLOW_STAGES = ['PROPOSAL','LAND_REQUIREMENT_SUBMITTED','SCRUTINY','APPROVAL','NOTIFICATION','OBJECTIONS_CLAIMS','AWARD_DECLARATION','COMPENSATION','POSSESSION','R_AND_R','PROJECT_CLOSURE'];

export default function ProjectWorkflowPage() {
  const params = useParams();
  const projectId = params?.projectId as string;
  const [user, setUser] = useState<AuthUser | null>(null);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completing, setCompleting] = useState('');
  const [officers, setOfficers] = useState<any[]>([]);
  const [nextAssignee, setNextAssignee] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    const session = authService.getSession();
    if (session) setUser(session.user);
    loadWorkflows();
    if (session && ['ADMIN','CENTRAL_OFFICER','STATE_OFFICER','DISTRICT_OFFICER'].includes(session.user.role)) {
      adminService.getUsers().then(setOfficers).catch(() => {});
    }
  }, [projectId]);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      const data = await workflowService.list(projectId);
      setWorkflows(data as any || []);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleStart = async () => {
    try {
      setError('');
      await workflowService.start({ projectId });
      await loadWorkflows();
    } catch (err: any) { setError(err.message); }
  };

  const handleComplete = async (taskId: string) => {
    try {
      setCompleting(taskId); setError('');
      await workflowService.completeTask(taskId, { remarks: remarks || undefined, nextAssignedToId: nextAssignee || undefined });
      setRemarks(''); setNextAssignee('');
      await loadWorkflows();
    } catch (err: any) { setError(err.message); }
    finally { setCompleting(''); }
  };

  const canManage = user && ['ADMIN','CENTRAL_OFFICER','STATE_OFFICER','DISTRICT_OFFICER','FIELD_OFFICER'].includes(user.role);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#122C4A]">Workflow</h2>
        {canManage && workflows.length === 0 && (
          <button onClick={handleStart} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">
            ▶ Start Workflow
          </button>
        )}
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-red-700 text-sm">{error}</div>}

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#DDD8C8] border-t-[#1D5FA8] rounded-full animate-spin" /></div>
      ) : workflows.length === 0 ? (
        <div className="bg-white border border-[#E8E4D9] rounded-xl p-8 text-center text-[#5B6472]">No workflow started for this project</div>
      ) : workflows.map((wf: any) => (
        <div key={wf.id} className="bg-white border border-[#E8E4D9] rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-sm font-medium text-[#5B6472]">Current Stage:</span>
              <span className="ml-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
                {wf.currentStage?.replace(/_/g, ' ')}
              </span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${wf.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
              {wf.status}
            </span>
          </div>

          {/* Stage Progress */}
          <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2">
            {WORKFLOW_STAGES.map((stage, i) => {
              const task = wf.tasks?.find((t: any) => t.stage === stage);
              const isCompleted = task?.status === 'COMPLETED';
              const isCurrent = wf.currentStage === stage;
              return (
                <div key={stage} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                    isCompleted ? 'bg-green-500 border-green-500 text-white' :
                    isCurrent ? 'bg-[#1D5FA8] border-[#1D5FA8] text-white' :
                    'bg-white border-[#DDD8C8] text-[#5B6472]'
                  }`}>
                    {isCompleted ? '✓' : i + 1}
                  </div>
                  {i < WORKFLOW_STAGES.length - 1 && (
                    <div className={`w-6 h-0.5 ${isCompleted ? 'bg-green-500' : 'bg-[#DDD8C8]'}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Tasks */}
          <h4 className="text-sm font-semibold text-[#122C4A] mb-3">Tasks</h4>
          <div className="space-y-3">
            {(wf.tasks || []).map((task: any) => (
              <div key={task.id} className="border border-[#E8E4D9] rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-[#122C4A] text-sm">{task.title}</div>
                    <div className="text-xs text-[#5B6472] mt-1">Stage: {task.stage?.replace(/_/g, ' ')} • Status: {task.status}</div>
                    {task.deadline && <div className="text-xs text-[#5B6472] mt-0.5">Deadline: {new Date(task.deadline).toLocaleDateString('en-IN')}</div>}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                    task.status === 'OVERDUE' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>{task.status}</span>
                </div>

                {canManage && (task.status === 'PENDING' || task.status === 'IN_PROGRESS') && task.stage === wf.currentStage && (
                  <div className="mt-3 pt-3 border-t border-[#E8E4D9]">
                    <div className="flex flex-wrap gap-2 items-end">
                      <div className="flex-1 min-w-[150px]">
                        <label className="block text-xs text-[#5B6472] mb-1">Remarks</label>
                        <input type="text" value={remarks} onChange={(e) => setRemarks(e.target.value)}
                          className="w-full border border-[#DDD8C8] rounded px-2 py-1.5 text-xs" placeholder="Completion notes..." />
                      </div>
                      <div className="min-w-[150px]">
                        <label className="block text-xs text-[#5B6472] mb-1">Assign Next To</label>
                        <select value={nextAssignee} onChange={(e) => setNextAssignee(e.target.value)}
                          className="w-full border border-[#DDD8C8] rounded px-2 py-1.5 text-xs">
                          <option value="">Auto</option>
                          {officers.map((o: any) => <option key={o.id} value={o.id}>{o.name} ({o.role})</option>)}
                        </select>
                      </div>
                      <button onClick={() => handleComplete(task.id)} disabled={completing === task.id}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-semibold disabled:opacity-50">
                        {completing === task.id ? 'Completing...' : '✓ Complete Task'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
