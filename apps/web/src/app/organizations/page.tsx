'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../../components/layout/header';
import { authService, type AuthUser } from '../../services/auth.service';
import {
  organizationService,
  type OrganizationItem,
} from '../../services/organization.service';

export default function OrganizationsPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [organizations, setOrganizations] = useState<OrganizationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [orgCode, setOrgCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const session = authService.getSession();
    if (!session) {
      router.replace('/login/mainlogin');
      return;
    }
    setUser(session.user);
    loadOrganizations();
  }, [router]);

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await organizationService.list();
      setOrganizations(data || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load requiring organizations.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) return;

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');
      await organizationService.create({
        name: orgName.trim(),
        code: orgCode.trim() || undefined,
      });

      setSuccess('Requiring Body / Organization registered successfully.');
      setOrgName('');
      setOrgCode('');
      setShowCreateModal(false);
      await loadOrganizations();
    } catch (err: any) {
      setError(err?.message || 'Failed to create organization.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredOrgs = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(search.toLowerCase()) ||
      (org.code && org.code.toLowerCase().includes(search.toLowerCase())),
  );

  const canCreate =
    user && ['ADMIN', 'CENTRAL_OFFICER', 'STATE_OFFICER'].includes(user.role);

  return (
    <>
      <Header />

      <div className="min-h-screen bg-[#FBFAF6] p-6 lg:p-10 font-sans text-[#1B2430]">
        <div className="max-w-7xl mx-auto">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🏢</span>
                <h1 className="text-2xl font-serif font-bold text-[#122C4A]">
                  Requiring Bodies & Organizations
                </h1>
              </div>
              <p className="text-xs text-[#5B6472] mt-1">
                Central Ministries, State Departments & Public Sector Undertakings (PSUs) executing land acquisitions
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/projects"
                className="bg-white border border-[#DDD8C8] text-[#122C4A] hover:bg-gray-50 px-3.5 py-2 rounded-lg text-xs font-semibold transition shadow-sm"
              >
                All Projects
              </Link>
              <Link
                href="/gis"
                className="bg-[#1D5FA8] hover:bg-[#122C4A] text-white px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm"
              >
                🗺️ GIS Corridors
              </Link>
              {canCreate && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-[#122C4A] hover:bg-[#0B1F35] text-white px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  + Add Requiring Body
                </button>
              )}
            </div>
          </div>

          {/* Feedback Banners */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-xs mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg text-xs font-semibold mb-6">
              ✓ {success}
            </div>
          )}

          {/* Search bar */}
          <div className="bg-white border border-[#E8E4D9] rounded-xl p-4 mb-6 shadow-sm">
            <input
              type="text"
              placeholder="Search Requiring Body by name or code (e.g. NHAI, DFCCIL, NVDA)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-[#DDD8C8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D5FA8]"
            />
          </div>

          {/* Grid of Organizations */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#DDD8C8] border-t-[#1D5FA8] rounded-full animate-spin" />
            </div>
          ) : filteredOrgs.length === 0 ? (
            <div className="bg-white border border-[#E8E4D9] rounded-xl p-12 text-center text-[#5B6472]">
              No requiring bodies found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrgs.map((org) => (
                <div
                  key={org.id}
                  className="bg-white border border-[#E8E4D9] rounded-xl shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-blue-50 text-[#1D5FA8] border border-blue-200">
                          {org.code || 'GOVT'}
                        </span>
                        <h3 className="font-serif font-bold text-base text-[#122C4A] mt-2">
                          {org.name}
                        </h3>
                      </div>
                      <span className="text-2xl opacity-40">🏛️</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-gray-100 my-4 text-xs">
                      <div>
                        <span className="text-gray-500 block">Projects Active</span>
                        <strong className="text-base text-[#122C4A]">
                          {org.projectsCount}
                        </strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Acquisition Area</span>
                        <strong className="text-base text-[#B96E22]">
                          {org.totalAcquisitionAreaHa > 0
                            ? `${org.totalAcquisitionAreaHa} Ha`
                            : 'Pipeline'}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <Link
                      href={`/projects?search=${encodeURIComponent(org.name)}`}
                      className="text-xs font-bold text-[#1D5FA8] hover:underline flex items-center gap-1"
                    >
                      View Corridors & Projects →
                    </Link>
                    <span className="text-[11px] text-gray-400">
                      ID: {org.id.slice(-6)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal: Create Organization */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border-t-4 border-[#122C4A] p-6 relative">
            <h3 className="text-lg font-serif font-bold text-[#122C4A] mb-1">
              Register Requiring Body / Organization
            </h3>
            <p className="text-xs text-[#5B6472] mb-5">
              Enter details of the project execution authority or government agency.
            </p>

            <form onSubmit={handleCreateOrg} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#5B6472] uppercase mb-1">
                  Organization Name *
                </label>
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. National Highways Authority of India (NHAI)"
                  className="w-full border border-[#DDD8C8] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1D5FA8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5B6472] uppercase mb-1">
                  Unique Code / Acronym (Optional)
                </label>
                <input
                  type="text"
                  value={orgCode}
                  onChange={(e) => setOrgCode(e.target.value)}
                  placeholder="e.g. NHAI, DFCCIL, NVDA"
                  className="w-full border border-[#DDD8C8] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1D5FA8] uppercase font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="border border-[#DDD8C8] text-gray-600 px-4 py-2 rounded text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#122C4A] text-white px-5 py-2 rounded text-xs font-bold hover:bg-[#0B1F35] disabled:opacity-50 shadow-sm"
                >
                  {submitting ? 'Registering...' : 'Register Organization'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
