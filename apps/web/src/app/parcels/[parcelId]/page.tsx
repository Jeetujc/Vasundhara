'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Header from '../../../components/layout/header';
import { authService, type AuthUser } from '../../../services/auth.service';
import { parcelService } from '../../../services/parcel.service';

export default function ParcelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const parcelId = params?.parcelId as string;
  const [user, setUser] = useState<AuthUser | null>(null);
  const [parcel, setParcel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ village: '', tehsil: '', area: '', status: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const session = authService.getSession();
    if (!session) { router.replace('/login/mainlogin'); return; }
    setUser(session.user);
    loadParcel();
  }, [parcelId, router]);

  const loadParcel = async () => {
    try { setLoading(true); const p = await parcelService.get(parcelId); setParcel(p as any);
      setForm({ village: (p as any).village || '', tehsil: (p as any).tehsil || '', area: String((p as any).area || ''), status: (p as any).status || '' });
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const handleSave = async () => {
    try { setSaving(true); setError('');
      await parcelService.update(parcelId, { village: form.village || undefined, tehsil: form.tehsil || undefined, area: form.area ? parseFloat(form.area) : undefined, status: form.status || undefined });
      setEditing(false); await loadParcel();
    } catch (err: any) { setError(err.message); } finally { setSaving(false); }
  };

  const canEdit = user && ['ADMIN','CENTRAL_OFFICER','STATE_OFFICER','DISTRICT_OFFICER','FIELD_OFFICER'].includes(user.role);

  return (
    <>
      <Header />
      <nav className="bg-[#122C4A] flex items-center px-8 py-2">
        <ul className="flex flex-1 list-none m-0 p-0">
          <li><a href="/parcels" className="text-white text-[13px] px-4 py-3 block hover:bg-[#1D5FA8]">← Back to Parcels</a></li>
        </ul>
      </nav>
      <div className="min-h-screen bg-[#FBFAF6] p-6">
        <div className="max-w-4xl mx-auto">
          {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-red-700 text-sm">{error}</div>}
          {loading ? <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#DDD8C8] border-t-[#1D5FA8] rounded-full animate-spin" /></div>
          : !parcel ? <div className="bg-white border border-[#E8E4D9] rounded-xl p-8 text-center text-[#5B6472]">Parcel not found</div>
          : <div className="bg-white border border-[#E8E4D9] rounded-xl p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-[#122C4A]">Khasra / Parcel {parcel.parcelNumber}</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{parcel.status?.replace(/_/g,' ')}</span>
                    <span className="text-xs text-gray-500 font-mono">Survey: {parcel.surveyNumber || 'SV-N/A'}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/gis/parcels?parcelId=${parcel.id}`}
                    className="bg-[#1D5FA8] hover:bg-[#122C4A] text-white px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    View on GIS Map
                  </Link>

                  <Link
                    href="/dashboard/field"
                    className="bg-[#B96E22] hover:bg-[#965516] text-white px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm"
                  >
                    ⚡ Field Officer Survey
                  </Link>

                  {canEdit && !editing && (
                    <button onClick={() => setEditing(true)} className="border border-[#122C4A] text-[#122C4A] hover:bg-gray-50 px-3 py-2 rounded-lg text-xs font-bold">
                      Edit Parcel
                    </button>
                  )}
                </div>
              </div>
              {editing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-[#5B6472] mb-1">Village</label><input type="text" value={form.village} onChange={(e) => setForm({...form, village: e.target.value})} className="w-full border border-[#DDD8C8] rounded-lg px-3 py-2 text-sm" /></div>
                  <div><label className="block text-sm font-medium text-[#5B6472] mb-1">Tehsil</label><input type="text" value={form.tehsil} onChange={(e) => setForm({...form, tehsil: e.target.value})} className="w-full border border-[#DDD8C8] rounded-lg px-3 py-2 text-sm" /></div>
                  <div><label className="block text-sm font-medium text-[#5B6472] mb-1">Area (Ha)</label><input type="number" step="0.01" value={form.area} onChange={(e) => setForm({...form, area: e.target.value})} className="w-full border border-[#DDD8C8] rounded-lg px-3 py-2 text-sm" /></div>
                  <div className="flex items-end gap-2">
                    <button onClick={handleSave} disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
                    <button onClick={() => setEditing(false)} className="border border-[#DDD8C8] text-[#5B6472] px-4 py-2 rounded-lg text-sm">Cancel</button>
                  </div>
                </div>
              ) : (
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><dt className="text-[#5B6472]">Parcel Number</dt><dd className="font-medium text-[#122C4A] mt-0.5">{parcel.parcelNumber}</dd></div>
                  <div><dt className="text-[#5B6472]">Survey Number</dt><dd className="font-medium text-[#122C4A] mt-0.5">{parcel.surveyNumber || '—'}</dd></div>
                  <div><dt className="text-[#5B6472]">Village</dt><dd className="font-medium text-[#122C4A] mt-0.5">{parcel.village || '—'}</dd></div>
                  <div><dt className="text-[#5B6472]">Tehsil</dt><dd className="font-medium text-[#122C4A] mt-0.5">{parcel.tehsil || '—'}</dd></div>
                  <div><dt className="text-[#5B6472]">Area</dt><dd className="font-medium text-[#122C4A] mt-0.5">{parcel.area ? `${Number(parcel.area)} Ha` : '—'}</dd></div>
                  <div><dt className="text-[#5B6472]">Project</dt><dd className="font-medium text-[#122C4A] mt-0.5"><a href={`/projects/${parcel.projectId}/overview`} className="text-[#1D5FA8] hover:underline">{parcel.project?.name || parcel.projectId}</a></dd></div>
                </dl>
              )}
            </div>}
        </div>
      </div>
    </>
  );
}
