'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../../components/layout/header';
import { authService, type AuthUser } from '../../services/auth.service';
import { workflowService } from '../../services/workflow.service';

export default function WorkflowPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const session = authService.getSession();
    if (!session) { router.replace('/login/mainlogin'); return; }
    setUser(session.user);
    (async () => {
      try { setLoading(true); const data = await workflowService.list(); setWorkflows(data as any || []); }
      catch (err: any) { setError(err.message); } finally { setLoading(false); }
    })();
  }, [router]);

  return (
    <>
      <Header />
      <nav className="bg-[#122C4A] flex flex-wrap items-center px-8 py-2">
        <ul className="flex flex-wrap flex-1 list-none m-0 p-0 text-xs font-semibold">
          <li><Link href="/" className="text-white px-3.5 py-2.5 block hover:bg-[#1D5FA8]">Home</Link></li>
          <li><Link href="/projects" className="text-white px-3.5 py-2.5 block hover:bg-[#1D5FA8]">Projects</Link></li>
          <li><Link href="/workflow" className="text-white px-3.5 py-2.5 block bg-[#1D5FA8]">Workflows</Link></li>
          <li><Link href="/workflow/tasks" className="text-white px-3.5 py-2.5 block hover:bg-[#1D5FA8]">Tasks</Link></li>
          <li><Link href="/workflow/pending" className="text-white px-3.5 py-2.5 block hover:bg-[#1D5FA8]">Pending Transitions</Link></li>
          <li><Link href="/workflow/approvals" className="text-white px-3.5 py-2.5 block hover:bg-[#1D5FA8]">Statutory Sign-Offs</Link></li>
          <li><Link href="/dashboard/field" className="text-amber-300 px-3.5 py-2.5 block hover:bg-[#B96E22] hover:text-white font-bold">⚡ Field Officer Work Management</Link></li>
          <li><Link href="/gis" className="text-blue-300 px-3.5 py-2.5 block hover:bg-[#1D5FA8] hover:text-white font-bold">🗺️ GIS Map</Link></li>
          <li><Link href="/dashboard" className="text-white px-3.5 py-2.5 block hover:bg-[#1D5FA8]">Dashboard</Link></li>
        </ul>
      </nav>
      <div className="min-h-screen bg-[#FBFAF6] p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-[#122C4A] mb-6">Workflow Instances</h1>
          {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-red-700 text-sm">{error}</div>}
          {loading ? <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#DDD8C8] border-t-[#1D5FA8] rounded-full animate-spin" /></div>
          : workflows.length === 0 ? <div className="bg-white border border-[#E8E4D9] rounded-xl p-8 text-center text-[#5B6472]">No workflow instances</div>
          : <div className="space-y-4">{workflows.map((wf: any) => (
              <div key={wf.id} className="bg-white border border-[#E8E4D9] rounded-xl p-5 cursor-pointer hover:border-[#1D5FA8]"
                onClick={() => router.push(`/projects/${wf.projectId}/workflow`)}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[#122C4A]">{wf.project?.name || wf.projectId}</div>
                    <div className="text-xs text-[#5B6472] mt-1">Stage: {wf.currentStage?.replace(/_/g,' ')} • Tasks: {wf.tasks?.length || 0}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${wf.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{wf.status}</span>
                </div>
              </div>))}</div>}
        </div>
      </div>
    </>
  );
}
