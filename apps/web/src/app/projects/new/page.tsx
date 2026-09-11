'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../components/layout/header';
import { authService, type AuthUser } from '../../../services/auth.service';
import { projectService } from '../../../services/project.service';
import { locationService, type LocationItem } from '../../../services/location.service';
import {
  organizationService,
  type OrganizationItem,
} from '../../../services/organization.service';
import { useLanguage } from '../../../context/LanguageContext';

export default function CreateProjectPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [states, setStates] = useState<LocationItem[]>([]);
  const [districts, setDistricts] = useState<LocationItem[]>([]);
  const [organizations, setOrganizations] = useState<OrganizationItem[]>([]);

  const [form, setForm] = useState({
    name: '',
    code: '',
    description: '',
    organizationId: '',
    stateId: '',
    districtId: '',
    proposedArea: '',
  });

  useEffect(() => {
    const session = authService.getSession();
    if (!session) {
      router.replace('/login/mainlogin');
      return;
    }
    const u = session.user;
    if (
      !['ADMIN', 'CENTRAL_OFFICER', 'STATE_OFFICER', 'DISTRICT_OFFICER'].includes(
        u.role,
      )
    ) {
      router.replace('/unauthorized');
      return;
    }
    setUser(u);

    // Fetch States & Organizations
    Promise.all([
      locationService.getStates().catch(() => []),
      organizationService.list().catch(() => []),
    ]).then(([s, orgs]) => {
      setStates(s);
      setOrganizations(orgs);

      // Auto-populate based on user jurisdiction
      const defaultState = u.stateId || (s.length > 0 ? s[0].id : '');
      if (defaultState) {
        setForm((prev) => ({ ...prev, stateId: defaultState }));
        locationService
          .getDistricts(defaultState)
          .then((dList) => {
            setDistricts(dList);
            if (u.districtId) {
              setForm((prev) => ({ ...prev, districtId: u.districtId! }));
            }
          })
          .catch(() => {});
      }
    });
  }, [router]);

  const handleStateChange = (stateId: string) => {
    setForm((prev) => ({ ...prev, stateId, districtId: '' }));
    setDistricts([]);
    if (stateId) {
      locationService.getDistricts(stateId).then(setDistricts).catch(() => {});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.code || !form.stateId || !form.districtId) {
      setError('Name, Code, State, and District are required fields');
      return;
    }
    try {
      setLoading(true);
      setError('');

      const created = await projectService.create({
        name: form.name.trim(),
        code: form.code.trim().toUpperCase(),
        description: form.description?.trim() || undefined,
        stateId: form.stateId,
        districtId: form.districtId,
        proposedArea: form.proposedArea ? String(form.proposedArea) : undefined,
      });

      setSuccess('Project created and Section 11 Workflow initialized successfully!');
      setTimeout(() => router.push(`/projects/${(created as any).id}/overview`), 800);
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <nav className="bg-[#122C4A] flex items-center px-8 py-2">
        <ul className="flex flex-1 list-none m-0 p-0">
          <li>
            <a
              href="/projects"
              className="text-white text-[13px] px-4 py-3 block hover:bg-[#1D5FA8]"
            >
              ← Back to Projects
            </a>
          </li>
        </ul>
      </nav>

      <div className="min-h-screen bg-[#FBFAF6] p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#122C4A]">
                {t('projects.createTitle', 'Create New Land Acquisition Project')}
              </h1>
              <p className="text-xs text-[#5B6472] mt-1">
                Initiate statutory acquisition proceedings under RFCTLARR Act 2013
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded bg-[#FDF8E3] text-[#B96E22] border border-[#E7DFB8]">
              Role: {user?.role.replace('_', ' ')}
            </span>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-red-700 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 text-green-700 text-sm font-semibold">
              ✓ {success}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-white border border-[#E8E4D9] rounded-xl p-6 space-y-5 shadow-sm"
          >
            {/* Requiring Body / Organization Selector */}
            <div>
              <label className="block text-sm font-semibold text-[#122C4A] mb-1">
                Requiring Body / Executing Agency
              </label>
              <select
                value={form.organizationId}
                onChange={(e) => setForm({ ...form, organizationId: e.target.value })}
                className="w-full border border-[#DDD8C8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D5FA8] bg-gray-50"
              >
                <option value="">Select Requiring Body (e.g. NHAI, Railways, NVDA)...</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name} {org.code ? `(${org.code})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-[#122C4A] mb-1">
                  {t('projects.name', 'Project Name')} *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-[#DDD8C8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D5FA8]"
                  placeholder="e.g. NH-44 Highway Widening (Phase II)"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#122C4A] mb-1">
                  {t('projects.code', 'Project Code')} *
                </label>
                <input
                  type="text"
                  required
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  className="w-full border border-[#DDD8C8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D5FA8] uppercase font-mono"
                  placeholder="e.g. NH44-JBP-02"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#122C4A] mb-1">
                {t('projects.description', 'Project Description & Purpose')}
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full border border-[#DDD8C8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D5FA8]"
                placeholder="Details of the public infrastructure alignment, purpose, and affected tehsils..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-[#122C4A] mb-1">
                  {t('projects.state', 'State')} *
                </label>
                <select
                  value={form.stateId}
                  onChange={(e) => handleStateChange(e.target.value)}
                  disabled={user?.role === 'STATE_OFFICER' || user?.role === 'DISTRICT_OFFICER'}
                  className="w-full border border-[#DDD8C8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D5FA8] disabled:bg-gray-100"
                >
                  <option value="">Select State</option>
                  {states.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#122C4A] mb-1">
                  {t('projects.district', 'District')} *
                </label>
                <select
                  value={form.districtId}
                  onChange={(e) => setForm({ ...form, districtId: e.target.value })}
                  disabled={user?.role === 'DISTRICT_OFFICER' && !!user?.districtId}
                  className="w-full border border-[#DDD8C8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D5FA8] disabled:bg-gray-100"
                >
                  <option value="">Select District</option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-[#122C4A] mb-1">
                  {t('projects.area', 'Proposed Acquisition Area (Hectares)')}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.proposedArea}
                  onChange={(e) => setForm({ ...form, proposedArea: e.target.value })}
                  className="w-full border border-[#DDD8C8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D5FA8]"
                  placeholder="e.g. 420.50"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-[#E8E4D9]">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#1D5FA8] hover:bg-[#174C8A] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 shadow-sm"
              >
                {loading ? 'Submitting...' : t('projects.createBtn', 'Create Project & Initialize Workflow')}
              </button>
              <button
                type="button"
                onClick={() => router.push('/projects')}
                className="border border-[#DDD8C8] text-[#5B6472] px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#F5F3ED] transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
