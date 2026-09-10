'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../../components/layout/header';
import { authService, type AuthUser } from '../../services/auth.service';
import { adminService, type AdminUserItem } from '../../services/admin.service';
import {
  dashboardService,
  type AdminDashboardData,
} from '../../services/dashboard.service';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [adminData, setAdminData] = useState<AdminDashboardData | null>(null);
  const [usersList, setUsersList] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // New User Form State
  const [name, setName] = useState('');
  const [aadharId, setAadharId] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [role, setRole] = useState('FIELD_OFFICER');
  const [password, setPassword] = useState('');
  const [stateId, setStateId] = useState('MP');
  const [districtId, setDistrictId] = useState('JBP');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadAdminDashboard = async () => {
      try {
        setLoading(true);
        setError('');

        const session = authService.getSession();
        if (!session) {
          router.replace('/login/departmentlogin');
          return;
        }

        const currentUser = await authService.getCurrentUser().catch(() => session.user);
        setUser(currentUser);

        // Fetch dashboard data and user list
        const [dashRes, usersRes] = await Promise.all([
          dashboardService.getAdmin().catch((err) => {
            console.warn('Could not load admin dashboard:', err);
            return null;
          }),
          adminService.getUsers().catch((err) => {
            console.warn('Could not load admin users:', err);
            return [];
          }),
        ]);

        if (dashRes) setAdminData(dashRes);
        if (usersRes && usersRes.length > 0) {
          setUsersList(usersRes);
        } else if (dashRes?.authorityAccounts) {
          setUsersList(dashRes.authorityAccounts as any);
        }
      } catch (err) {
        console.error('Admin loading error:', err);
        setError('Failed to load administration workspace.');
      } finally {
        setLoading(false);
      }
    };

    loadAdminDashboard();
  }, [router]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');
      setSuccessMsg('');

      if (aadharId.length !== 12) {
        setError('Aadhaar number must be exactly 12 digits.');
        setSubmitting(false);
        return;
      }

      const created = await adminService.createUser({
        name,
        aadharId,
        mobileNo,
        password,
        role,
        stateId: role !== 'CENTRAL_OFFICER' && role !== 'ADMIN' ? stateId : undefined,
        districtId: role === 'DISTRICT_OFFICER' || role === 'FIELD_OFFICER' ? districtId : undefined,
      });

      setSuccessMsg(`Authority account created successfully for ${created.name} (${created.role}).`);
      setName('');
      setAadharId('');
      setMobileNo('');
      setPassword('');

      // Refresh users list
      const freshUsers = await adminService.getUsers().catch(() => []);
      if (freshUsers.length > 0) setUsersList(freshUsers);
    } catch (err: any) {
      console.error('Create user error:', err);
      setError(err?.message || 'Failed to create authority account.');
    } finally {
      setSubmitting(false);
    }
  };

  const stats = adminData?.stats || {
    totalUsers: 6,
    publicUsers: 1,
    officers: 5,
    projectsCount: 3,
    parcelsCount: 3,
    auditLogsCount: 4,
    statesCount: 1,
    districtsCount: 1,
  };

  const recentAudits = adminData?.recentAudits && adminData.recentAudits.length > 0
    ? adminData.recentAudits
    : [
        {
          id: 'aud-1',
          action: 'AWARD_DECLARED',
          entityType: 'COMPENSATION',
          description: 'Award of ₹80,50,000 approved for FAM-JBP-001',
          performedBy: 'District CALA Officer',
          role: 'DISTRICT_OFFICER',
          createdAt: 'Just now',
        },
        {
          id: 'aud-2',
          action: 'SECTION_19_DECLARED',
          entityType: 'PROJECT',
          description: 'Final declaration for NH-44 widening',
          performedBy: 'State Revenue Secretary',
          role: 'STATE_OFFICER',
          createdAt: '2 hours ago',
        },
        {
          id: 'aud-3',
          action: 'GRIEVANCE_RESOLVED',
          entityType: 'GRIEVANCE',
          description: 'Resolved ticket G-10492 for Ramesh Patel',
          performedBy: 'Field Officer Patan',
          role: 'FIELD_OFFICER',
          createdAt: '1 day ago',
        },
      ];

  return (
    <>
      <Header />

      {/* Navigation */}
      <nav className="bg-[#122C4A] flex flex-wrap items-center px-8 py-2 md:py-0 shadow-sm relative z-10">
        <ul className="flex flex-wrap flex-1 list-none m-0 p-0">
          {[
            { name: t('nav.home', 'Home'), href: '/' },
            { name: t('nav.about', 'About Us'), href: '/#about-us' },
            { name: t('nav.notifications', 'Notification'), href: '/notifications' },
            {
              name: t('nav.act', 'Act'),
              href: 'https://mwcc.org.in/knowledge%20center/LandAcqisition/landAcquisitionAct-2013-.pdf',
              newTab: true,
            },
            { name: t('nav.projects', 'Projects'), href: '/#projects' },
            { name: t('nav.links', 'Important Links'), href: '/#important-links' },
          ].map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="block px-[18px] py-[14px] text-[#EAF0F7] text-[13px] font-semibold tracking-[0.02em] hover:bg-[#0B1F35] transition-colors"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <button
          onClick={() => {
            authService.logout();
            router.replace('/login/departmentlogin');
          }}
          className="text-white bg-[#D97706] hover:bg-[#B45309] px-4 py-2 rounded text-sm font-semibold transition"
        >
          {t('nav.logout', 'Logout')}
        </button>
      </nav>

      {/* Main Admin Workspace */}
      <div className="min-h-screen bg-[#F8FAFC] pb-14 font-sans text-[#1B2430]">
        {/* Header Bar */}
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#122C4A]">
                {t('admin.title', 'National System Administration')}
              </h1>
              <p className="text-[#5B6472] mt-1 text-sm">
                {t('admin.subtitle', 'Manage Authority Accounts, Geographic RBAC & System Audit Trail')}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/gis"
                className="bg-[#1D5FA8] hover:bg-[#122C4A] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm"
              >
                🗺️ GIS Portal
              </Link>
              <Link
                href="/dashboard/field"
                className="bg-[#B96E22] hover:bg-[#965516] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm"
              >
                ⚡ Field Officer Work Management
              </Link>
              <Link
                href="/projects"
                className="bg-white border border-[#DDD8C8] text-[#122C4A] hover:bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm"
              >
                Projects
              </Link>
              <Link
                href="/parcels"
                className="bg-white border border-[#DDD8C8] text-[#122C4A] hover:bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm"
              >
                Parcels
              </Link>
              <Link
                href="/audit"
                className="bg-white border border-[#DDD8C8] text-[#122C4A] hover:bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm"
              >
                Audit
              </Link>
              <span className="text-xs font-bold uppercase tracking-wider bg-[#FDF8E3] text-[#B96E22] border border-[#E7DFB8] px-3 py-1.5 rounded">
                Super Admin Active
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 mt-8 space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded text-sm font-semibold">
              ✓ {successMsg}
            </div>
          )}

          {/* 1. Macro KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Total Authority Users
              </span>
              <span className="text-4xl font-serif font-bold text-[#122C4A]">
                {stats.officers}
              </span>
              <span className="text-xs text-gray-500 mt-2 block">
                Across Central, State & District CALA
              </span>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Registered Citizens
              </span>
              <span className="text-4xl font-serif font-bold text-[#122C4A]">
                {stats.publicUsers}
              </span>
              <span className="text-xs text-green-600 font-semibold mt-2 block">
                100% Aadhaar Seeded
              </span>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Active Projects
              </span>
              <span className="text-4xl font-serif font-bold text-[#122C4A]">
                {stats.projectsCount}
              </span>
              <span className="text-xs text-gray-500 mt-2 block">
                {stats.parcelsCount} Parcels Under Acquisition
              </span>
            </div>

            <div className="bg-[#0B1F35] border border-[#1D5FA8] rounded-xl p-6 shadow-sm relative overflow-hidden">
              <span className="block text-xs font-bold text-[#F2A71B] uppercase tracking-wider mb-2">
                System Audit Events
              </span>
              <span className="text-4xl font-serif font-bold text-white">
                {stats.auditLogsCount}
              </span>
              <span className="text-xs text-[#9FB0C4] mt-2 block">
                Immutable Hash Chained
              </span>
            </div>
          </div>

          {/* 2. Main Grid: Provision Form (Left) & Provisioned Users Table (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form: Provision Authority Account */}
            <div className="lg:col-span-1 bg-white border border-[#DDD8C8] rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-serif font-bold text-[#122C4A] mb-2">
                {t('admin.create_title', 'Provision Authority Account')}
              </h2>
              <p className="text-xs text-[#5B6472] mb-6">
                Create new verified department credentials with geographic RBAC restrictions.
              </p>

              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#5B6472] uppercase mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Rajesh Sharma"
                    required
                    className="w-full border border-[#DDD8C8] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#1D5FA8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5B6472] uppercase mb-1">
                    Aadhaar Number (12 Digits)
                  </label>
                  <input
                    type="text"
                    maxLength={12}
                    value={aadharId}
                    onChange={(e) => setAadharId(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456789012"
                    required
                    className="w-full border border-[#DDD8C8] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#1D5FA8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5B6472] uppercase mb-1">
                    Official Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={mobileNo}
                    onChange={(e) => setMobileNo(e.target.value)}
                    placeholder="9876543210"
                    required
                    className="w-full border border-[#DDD8C8] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#1D5FA8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5B6472] uppercase mb-1">
                    {t('auth.authority_level', 'Authority Level / Role')}
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full border border-[#DDD8C8] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#1D5FA8] font-medium"
                  >
                    <option value="CENTRAL_OFFICER">Central / National Officer (DoLR)</option>
                    <option value="STATE_OFFICER">State Macro-Oversight Officer</option>
                    <option value="DISTRICT_OFFICER">District CALA Officer</option>
                    <option value="FIELD_OFFICER">Field Revenue Officer / Patwari</option>
                    <option value="ADMIN">System Administrator</option>
                  </select>
                </div>

                {role !== 'CENTRAL_OFFICER' && role !== 'ADMIN' && (
                  <div>
                    <label className="block text-xs font-bold text-[#5B6472] uppercase mb-1">
                      Assigned State
                    </label>
                    <select
                      value={stateId}
                      onChange={(e) => setStateId(e.target.value)}
                      className="w-full border border-[#DDD8C8] rounded px-3 py-2 text-sm"
                    >
                      <option value="MP">Madhya Pradesh (MP)</option>
                    </select>
                  </div>
                )}

                {(role === 'DISTRICT_OFFICER' || role === 'FIELD_OFFICER') && (
                  <div>
                    <label className="block text-xs font-bold text-[#5B6472] uppercase mb-1">
                      Assigned District
                    </label>
                    <select
                      value={districtId}
                      onChange={(e) => setDistrictId(e.target.value)}
                      className="w-full border border-[#DDD8C8] rounded px-3 py-2 text-sm"
                    >
                      <option value="JBP">Jabalpur (JBP)</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#5B6472] uppercase mb-1">
                    Initial Secure Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full border border-[#DDD8C8] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#1D5FA8]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#122C4A] hover:bg-[#0B1F35] text-white font-bold py-3 px-4 rounded text-sm transition shadow-sm disabled:opacity-50 mt-2"
                >
                  {submitting ? 'Creating Account...' : t('btn.create_account', 'Create Authority Account')}
                </button>
              </form>
            </div>

            {/* Table: Provisioned Users */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                  <h2 className="text-base font-bold text-[#122C4A]">
                    {t('admin.table_title', 'Provisioned Authority Users')}
                  </h2>
                  <span className="text-xs text-gray-500 font-semibold">
                    {usersList.length} Accounts
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[650px]">
                    <thead>
                      <tr className="bg-white text-gray-500 text-[11px] uppercase tracking-wider border-b border-gray-200">
                        <th className="px-6 py-3 font-bold">Officer</th>
                        <th className="px-4 py-3 font-bold">Role</th>
                        <th className="px-4 py-3 font-bold">Aadhaar</th>
                        <th className="px-4 py-3 font-bold">Jurisdiction</th>
                        <th className="px-4 py-3 font-bold text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {usersList.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4">
                            <div className="font-bold text-[#122C4A]">{u.name}</div>
                            <div className="text-xs text-gray-500">{u.mobileNo}</div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded border border-blue-100">
                              {u.role.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-xs font-mono text-gray-600">
                            {u.aadharId ? `XXXX-XXXX-${u.aadharId.slice(-4)}` : 'N/A'}
                          </td>
                          <td className="px-4 py-4 text-xs font-semibold text-gray-700">
                            {u.districtId || u.stateId || 'National'}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Audit Logs Trail */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-[#FDF8E3] flex justify-between items-center">
                  <h2 className="text-base font-bold text-[#122C4A]">
                    {t('admin.recent_audits', 'System Audit Logs')}
                  </h2>
                  <span className="text-xs text-[#B96E22] font-semibold">
                    Real-time Audit Trail
                  </span>
                </div>

                <div className="p-4 divide-y divide-gray-100">
                  {recentAudits.map((log) => (
                    <div key={log.id} className="py-3 flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-[#122C4A]">
                            {log.action}
                          </span>
                          <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">
                            {log.entityType}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{log.description}</p>
                        <span className="text-[11px] text-gray-400 mt-1 block">
                          By: {log.performedBy} ({log.role})
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-400 whitespace-nowrap">
                        {log.createdAt}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
