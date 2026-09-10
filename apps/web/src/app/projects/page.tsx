'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../../components/layout/header';
import { authService, type AuthUser } from '../../services/auth.service';
import { projectService } from '../../services/project.service';
import { locationService, type LocationItem } from '../../services/location.service';
import { useLanguage } from '../../context/LanguageContext';

interface ProjectRow {
  id: string;
  name: string;
  code: string;
  description?: string;
  status: string;
  proposedArea?: number;
  state?: { id: string; name: string; code: string };
  district?: { id: string; name: string; code: string };
  _count?: { parcels: number; workflowInstances: number; compensationCases: number };
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  PROPOSED: 'bg-blue-100 text-blue-800',
  UNDER_SCRUTINY: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  NOTIFIED: 'bg-indigo-100 text-indigo-800',
  ACQUISITION_IN_PROGRESS: 'bg-orange-100 text-orange-800',
  AWARD_DECLARED: 'bg-purple-100 text-purple-800',
  COMPENSATION_IN_PROGRESS: 'bg-pink-100 text-pink-800',
  POSSESSION_IN_PROGRESS: 'bg-teal-100 text-teal-800',
  R_AND_R_IN_PROGRESS: 'bg-cyan-100 text-cyan-800',
  COMPLETED: 'bg-emerald-100 text-emerald-800',
  CLOSED: 'bg-gray-100 text-gray-800',
  ON_HOLD: 'bg-red-100 text-red-800',
};

export default function ProjectsListPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [states, setStates] = useState<LocationItem[]>([]);
  const [stateFilter, setStateFilter] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const session = authService.getSession();
    if (!session) { router.replace('/login/mainlogin'); return; }
    setUser(session.user);
    locationService.getStates().then(setStates).catch(() => {});
  }, [router]);

  useEffect(() => {
    if (!user) return;
    loadProjects();
  }, [user, search, statusFilter, stateFilter, page]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await projectService.list({
        search: search || undefined,
        status: statusFilter || undefined,
        stateId: stateFilter || undefined,
        page,
        pageSize: 20,
      });
      setProjects((res as any).data || []);
      setTotal((res as any).total || 0);
    } catch (err: any) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const canCreate = user && ['ADMIN', 'CENTRAL_OFFICER', 'STATE_OFFICER'].includes(user.role);

  return (
    <>
      <Header />
      <nav className="bg-[#122C4A] flex flex-wrap items-center px-8 py-2">
        <ul className="flex flex-wrap flex-1 list-none m-0 p-0 text-xs font-semibold">
          {[
            { name: t('nav.home', 'Home'), href: '/' },
            { name: t('nav.projects', 'Projects'), href: '/projects' },
            { name: '🗺️ GIS Map', href: '/gis', highlight: true },
            { name: 'Workflow', href: '/workflow' },
            { name: 'Tasks', href: '/workflow/tasks' },
            { name: '⚡ Field Work Management', href: '/dashboard/field', highlightAmber: true },
            { name: 'Parcels', href: '/parcels' },
            { name: 'Compensation', href: '/compensation' },
            { name: 'Possession', href: '/possession' },
            { name: 'R&R', href: '/r-and-r' },
            { name: 'Documents', href: '/documents' },
            { name: 'Reports', href: '/reports' },
            { name: 'Dashboard', href: '/dashboard' },
          ].map((item: any) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`px-3 py-2 block transition-colors ${
                  item.highlight
                    ? 'text-blue-300 font-bold hover:bg-[#1D5FA8] hover:text-white'
                    : item.highlightAmber
                    ? 'text-amber-300 font-bold hover:bg-[#B96E22] hover:text-white'
                    : 'text-white hover:bg-[#1D5FA8]'
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="min-h-screen bg-[#FBFAF6] p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#122C4A]">{t('projects.title', 'Projects')}</h1>
              <p className="text-sm text-[#5B6472] mt-1">{total} {t('projects.total', 'projects found')}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/gis/projects"
                className="bg-[#0B1F35] hover:bg-[#122C4A] text-white border border-[#1D5FA8] px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                🗺️ GIS Spatial Corridors
              </Link>
              <Link
                href="/dashboard/field"
                className="bg-[#B96E22] hover:bg-[#965516] text-white px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm"
              >
                ⚡ Field Survey
              </Link>
              {canCreate && (
                <Link href="/projects/new"
                  className="bg-[#1D5FA8] hover:bg-[#174C8A] text-white px-5 py-2 rounded-lg text-xs font-semibold transition-colors shadow-sm">
                  + {t('projects.new', 'Create Project')}
                </Link>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white border border-[#E8E4D9] rounded-xl p-4 mb-6 flex flex-wrap gap-3">
            <input
              type="text"
              placeholder={t('projects.search', 'Search by name or code...')}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="flex-1 min-w-[200px] border border-[#DDD8C8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D5FA8]"
            />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="border border-[#DDD8C8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D5FA8]"
            >
              <option value="">All Statuses</option>
              {Object.keys(STATUS_COLORS).map((s) => (
                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
              ))}
            </select>
            <select
              value={stateFilter}
              onChange={(e) => { setStateFilter(e.target.value); setPage(1); }}
              className="border border-[#DDD8C8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D5FA8]"
            >
              <option value="">All States</option>
              {states.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm">{error}</div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#DDD8C8] border-t-[#1D5FA8] rounded-full animate-spin" />
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-white border border-[#E8E4D9] rounded-xl p-12 text-center">
              <p className="text-[#5B6472] text-lg">No projects found</p>
              {canCreate && (
                <Link href="/projects/new" className="text-[#1D5FA8] hover:underline mt-2 inline-block">
                  Create your first project →
                </Link>
              )}
            </div>
          ) : (
            /* Table */
            <div className="bg-white border border-[#E8E4D9] rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F5F3ED] border-b border-[#E8E4D9]">
                    <th className="text-left px-4 py-3 font-semibold text-[#122C4A]">Project</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#122C4A]">Code</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#122C4A]">Location</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#122C4A]">Status</th>
                    <th className="text-right px-4 py-3 font-semibold text-[#122C4A]">Area (Ha)</th>
                    <th className="text-center px-4 py-3 font-semibold text-[#122C4A]">Parcels</th>
                    <th className="text-right px-4 py-3 font-semibold text-[#122C4A]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p) => (
                    <tr key={p.id} className="border-b border-[#F0EDE5] hover:bg-[#FDFCF8] cursor-pointer"
                      onClick={() => router.push(`/projects/${p.id}/overview`)}>
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#122C4A]">{p.name}</div>
                        {p.description && <div className="text-xs text-[#5B6472] mt-0.5 truncate max-w-[300px]">{p.description}</div>}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[#5B6472]">{p.code}</td>
                      <td className="px-4 py-3 text-[#5B6472]">
                        {p.state?.name || '—'}, {p.district?.name || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[p.status] || 'bg-gray-100 text-gray-800'}`}>
                          {p.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-[#5B6472]">{p.proposedArea ?? '—'}</td>
                      <td className="px-4 py-3 text-center text-[#5B6472]">{p._count?.parcels ?? 0}</td>
                      <td className="px-4 py-3 text-right space-x-1.5 whitespace-nowrap">
                        <Link
                          href={`/gis?projectId=${p.id}`}
                          className="bg-[#1D5FA8]/10 hover:bg-[#1D5FA8] text-[#1D5FA8] hover:text-white px-2.5 py-1 rounded text-xs font-bold transition inline-flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          🗺️ GIS
                        </Link>
                        <Link
                          href="/dashboard/field"
                          className="bg-[#B96E22]/10 hover:bg-[#B96E22] text-[#B96E22] hover:text-white px-2.5 py-1 rounded text-xs font-bold transition inline-flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          ⚡ Survey
                        </Link>
                        <Link
                          href={`/projects/${p.id}/overview`}
                          className="text-[#1D5FA8] hover:underline text-xs font-semibold inline-block ml-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {total > 20 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-[#E8E4D9]">
                  <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}
                    className="px-3 py-1 text-sm border border-[#DDD8C8] rounded disabled:opacity-40">← Previous</button>
                  <span className="text-sm text-[#5B6472]">Page {page} of {Math.ceil(total / 20)}</span>
                  <button onClick={() => setPage(page + 1)} disabled={page >= Math.ceil(total / 20)}
                    className="px-3 py-1 text-sm border border-[#DDD8C8] rounded disabled:opacity-40">Next →</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
