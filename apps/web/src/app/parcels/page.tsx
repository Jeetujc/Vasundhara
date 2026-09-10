'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../../components/layout/header';
import { authService, type AuthUser } from '../../services/auth.service';
import { parcelService } from '../../services/parcel.service';

export default function ParcelsListPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [parcels, setParcels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const session = authService.getSession();
    if (!session) { router.replace('/login/mainlogin'); return; }
    setUser(session.user);
  }, [router]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try { setLoading(true); const data = await parcelService.list({ search: search || undefined }); setParcels(data as any || []); }
      catch (err: any) { setError(err.message); } finally { setLoading(false); }
    })();
  }, [user, search]);

  return (
    <>
      <Header />
      <nav className="bg-[#122C4A] flex flex-wrap items-center px-8 py-2">
        <ul className="flex flex-wrap flex-1 list-none m-0 p-0 text-xs font-semibold">
          <li><Link href="/" className="text-white px-3.5 py-2.5 block hover:bg-[#1D5FA8]">Home</Link></li>
          <li><Link href="/projects" className="text-white px-3.5 py-2.5 block hover:bg-[#1D5FA8]">Projects</Link></li>
          <li><Link href="/parcels" className="text-white px-3.5 py-2.5 block bg-[#1D5FA8]">Parcels</Link></li>
          <li><Link href="/gis" className="text-blue-300 px-3.5 py-2.5 block hover:bg-[#1D5FA8] hover:text-white font-bold">🗺️ GIS Map Portal</Link></li>
          <li><Link href="/workflow" className="text-white px-3.5 py-2.5 block hover:bg-[#1D5FA8]">Workflow</Link></li>
          <li><Link href="/dashboard/field" className="text-amber-300 px-3.5 py-2.5 block hover:bg-[#B96E22] hover:text-white font-bold">⚡ Field Officer Work Management</Link></li>
          <li><Link href="/dashboard" className="text-white px-3.5 py-2.5 block hover:bg-[#1D5FA8]">Dashboard</Link></li>
        </ul>
      </nav>
      <div className="min-h-screen bg-[#FBFAF6] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-[#122C4A]">Land Parcels</h1>
              <p className="text-xs text-[#5B6472] mt-0.5">Cadastral survey registry and boundary pegs</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/gis/parcels"
                className="bg-[#1D5FA8] hover:bg-[#122C4A] text-white px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                🗺️ GIS Cadastral Map
              </Link>
              <Link
                href="/dashboard/field"
                className="bg-[#B96E22] hover:bg-[#965516] text-white px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm"
              >
                ⚡ Field Officer Work Management
              </Link>
              <Link
                href="/compensation"
                className="bg-white border border-[#DDD8C8] text-[#122C4A] hover:bg-gray-50 px-3.5 py-2 rounded-lg text-xs font-semibold transition shadow-sm"
              >
                Compensation
              </Link>
              <Link
                href="/possession"
                className="bg-white border border-[#DDD8C8] text-[#122C4A] hover:bg-gray-50 px-3.5 py-2 rounded-lg text-xs font-semibold transition shadow-sm"
              >
                Possession
              </Link>
            </div>
          </div>
          <div className="bg-white border border-[#E8E4D9] rounded-xl p-4 mb-6">
            <input type="text" placeholder="Search by parcel number, survey number, village..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-[#DDD8C8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D5FA8]" />
          </div>
          {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-red-700 text-sm">{error}</div>}
          {loading ? <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#DDD8C8] border-t-[#1D5FA8] rounded-full animate-spin" /></div>
          : parcels.length === 0 ? <div className="bg-white border border-[#E8E4D9] rounded-xl p-8 text-center text-[#5B6472]">No parcels found</div>
          : <div className="bg-white border border-[#E8E4D9] rounded-xl overflow-hidden">
              <table className="w-full text-sm"><thead><tr className="bg-[#F5F3ED] border-b border-[#E8E4D9]">
                <th className="text-left px-4 py-3 font-semibold text-[#122C4A]">Parcel #</th>
                <th className="text-left px-4 py-3 font-semibold text-[#122C4A]">Survey #</th>
                <th className="text-left px-4 py-3 font-semibold text-[#122C4A]">Village</th>
                <th className="text-left px-4 py-3 font-semibold text-[#122C4A]">Tehsil</th>
                <th className="text-right px-4 py-3 font-semibold text-[#122C4A]">Area (Ha)</th>
                <th className="text-left px-4 py-3 font-semibold text-[#122C4A]">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-[#122C4A]">Actions</th>
              </tr></thead><tbody>{parcels.map((p: any) => (
                <tr key={p.id} className="border-b border-[#F0EDE5] hover:bg-[#FDFCF8]">
                  <td className="px-4 py-3 font-medium text-[#122C4A]">
                    <Link href={`/parcels/${p.id}`} className="hover:underline text-[#1D5FA8] font-bold">
                      {p.parcelNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[#5B6472]">{p.surveyNumber || '—'}</td>
                  <td className="px-4 py-3 text-[#5B6472]">{p.village || '—'}</td>
                  <td className="px-4 py-3 text-[#5B6472]">{p.tehsil || '—'}</td>
                  <td className="px-4 py-3 text-right text-[#5B6472]">{p.area ? Number(p.area) : '—'}</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{p.status?.replace(/_/g,' ')}</span></td>
                  <td className="px-4 py-3 text-right space-x-1.5 whitespace-nowrap">
                    <Link
                      href={`/gis/parcels?parcelId=${p.id}`}
                      className="bg-[#1D5FA8]/10 hover:bg-[#1D5FA8] text-[#1D5FA8] hover:text-white px-2 py-1 rounded text-xs font-bold transition inline-flex items-center gap-1"
                    >
                      🗺️ Map
                    </Link>
                    <Link
                      href="/dashboard/field"
                      className="bg-[#B96E22]/10 hover:bg-[#B96E22] text-[#B96E22] hover:text-white px-2 py-1 rounded text-xs font-bold transition inline-flex items-center gap-1"
                    >
                      ⚡ Survey
                    </Link>
                    <Link href={`/parcels/${p.id}`} className="text-xs font-bold text-[#122C4A] hover:underline inline-block ml-1">
                      Detail →
                    </Link>
                  </td>
                </tr>))}</tbody></table>
            </div>}
        </div>
      </div>
    </>
  );
}
