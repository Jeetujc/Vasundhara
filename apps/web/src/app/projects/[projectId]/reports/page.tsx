'use client';
import React from 'react';
import { useParams } from 'next/navigation';

export default function ProjectReportsPage() {
  const params = useParams();
  const projectId = params?.projectId as string;

  const handleExportJSON = async () => {
    const { apiClient } = await import('../../../../services/api-client');
    try {
      const data = await apiClient.get(`/projects/${projectId}`);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `project_${projectId}_report.json`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    } catch (err: any) { alert(err.message); }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-[#122C4A] mb-6">Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-[#E8E4D9] rounded-xl p-5">
          <h3 className="font-semibold text-[#122C4A] mb-2">📊 Project Summary Report</h3>
          <p className="text-sm text-[#5B6472] mb-4">Export complete project data including parcels, compensation, workflow status</p>
          <button onClick={handleExportJSON} className="bg-[#1D5FA8] text-white px-4 py-2 rounded-lg text-sm font-semibold">Download JSON</button>
        </div>
        <div className="bg-white border border-[#E8E4D9] rounded-xl p-5">
          <h3 className="font-semibold text-[#122C4A] mb-2">📋 Audit Trail</h3>
          <p className="text-sm text-[#5B6472] mb-4">View full audit trail in the Timeline or Audit tabs</p>
          <a href={`/projects/${projectId}/audit`} className="text-[#1D5FA8] text-sm font-semibold hover:underline">View Audit Log →</a>
        </div>
      </div>
    </div>
  );
}
