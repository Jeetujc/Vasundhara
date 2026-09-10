'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { authService, type AuthUser } from '../../../../services/auth.service';
import { documentService } from '../../../../services/document.service';
import { apiClient } from '../../../../services/api-client';

export default function ProjectDocumentsPage() {
  const params = useParams();
  const projectId = params?.projectId as string;
  const [user, setUser] = useState<AuthUser | null>(null);
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', storageKey: '', mimeType: 'application/pdf' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const session = authService.getSession();
    if (session) setUser(session.user);
    loadDocs();
  }, [projectId]);

  const loadDocs = async () => {
    try { setLoading(true); const data = await documentService.list(projectId); setDocs(data as any || []); }
    catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.storageKey) { setError('Name and storage key are required'); return; }
    try {
      setSaving(true); setError('');
      await apiClient.post('/documents', { projectId, name: form.name, storageKey: form.storageKey, mimeType: form.mimeType });
      setForm({ name: '', storageKey: '', mimeType: 'application/pdf' }); setShowForm(false);
      await loadDocs();
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  const canCreate = user && !['PUBLIC_USER'].includes(user.role);
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#122C4A]">Documents</h2>
        {canCreate && <button onClick={() => setShowForm(!showForm)} className="bg-[#1D5FA8] text-white px-4 py-2 rounded-lg text-sm font-semibold">{showForm ? 'Cancel' : '+ Add Document'}</button>}
      </div>
      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-red-700 text-sm">{error}</div>}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-[#E8E4D9] rounded-xl p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-[#5B6472] mb-1">Document Name *</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-[#DDD8C8] rounded-lg px-3 py-2 text-sm" placeholder="e.g. Section 11 Gazette" /></div>
            <div><label className="block text-sm font-medium text-[#5B6472] mb-1">Storage Key *</label><input type="text" value={form.storageKey} onChange={(e) => setForm({ ...form, storageKey: e.target.value })} className="w-full border border-[#DDD8C8] rounded-lg px-3 py-2 text-sm" placeholder="docs/filename.pdf" /></div>
            <div><label className="block text-sm font-medium text-[#5B6472] mb-1">MIME Type</label><input type="text" value={form.mimeType} onChange={(e) => setForm({ ...form, mimeType: e.target.value })} className="w-full border border-[#DDD8C8] rounded-lg px-3 py-2 text-sm" /></div>
          </div>
          <button type="submit" disabled={saving} className="mt-4 bg-[#1D5FA8] text-white px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">{saving ? 'Saving...' : 'Create Document Record'}</button>
        </form>
      )}
      {loading ? <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#DDD8C8] border-t-[#1D5FA8] rounded-full animate-spin" /></div>
      : docs.length === 0 ? <div className="bg-white border border-[#E8E4D9] rounded-xl p-8 text-center text-[#5B6472]">No documents</div>
      : <div className="bg-white border border-[#E8E4D9] rounded-xl overflow-hidden"><table className="w-full text-sm">
          <thead><tr className="bg-[#F5F3ED] border-b border-[#E8E4D9]">
            <th className="text-left px-4 py-3 font-semibold text-[#122C4A]">Name</th>
            <th className="text-left px-4 py-3 font-semibold text-[#122C4A]">Type</th>
            <th className="text-left px-4 py-3 font-semibold text-[#122C4A]">Status</th>
            <th className="text-left px-4 py-3 font-semibold text-[#122C4A]">Uploaded</th>
          </tr></thead>
          <tbody>{docs.map((d: any) => (
            <tr key={d.id} className="border-b border-[#F0EDE5]">
              <td className="px-4 py-3 font-medium text-[#122C4A]">{d.name}</td>
              <td className="px-4 py-3 text-xs text-[#5B6472]">{d.mimeType || '—'}</td>
              <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${d.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{d.status}</span></td>
              <td className="px-4 py-3 text-xs text-[#5B6472]">{new Date(d.createdAt).toLocaleDateString('en-IN')}</td>
            </tr>))}
          </tbody></table></div>}
    </div>
  );
}
