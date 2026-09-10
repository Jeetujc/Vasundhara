'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../../../../components/layout/header';
import { authService, type AuthUser } from '../../../../services/auth.service';
import {
  dashboardService,
  type DistrictDashboardData,
} from '../../../../services/dashboard.service';
import { useLanguage } from '../../../../context/LanguageContext';

export default function DistrictDashboard({
  params,
}: {
  params: Promise<{ districtId: string }>;
}) {
  const resolvedParams = use(params);
  const districtId = resolvedParams.districtId;
  const router = useRouter();
  const { t } = useLanguage();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [data, setData] = useState<DistrictDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [approvedAwards, setApprovedAwards] = useState<Record<string, boolean>>({});
  const [fraudHalted, setFraudHalted] = useState(false);

  useEffect(() => {
    const loadDistrictData = async () => {
      try {
        setLoading(true);
        setError('');

        const session = authService.getSession();
        if (!session) {
          router.replace('/login/mainlogin');
          return;
        }

        const [currentUser, districtData] = await Promise.all([
          authService.getCurrentUser().catch(() => session.user),
          dashboardService.getDistrict(districtId).catch((err) => {
            console.warn('Could not fetch district dashboard data:', err);
            return null;
          }),
        ]);

        setUser(currentUser);
        if (districtData) {
          setData(districtData);
        }
      } catch (err) {
        console.error('District dashboard error:', err);
        setError('Failed to load district dashboard.');
      } finally {
        setLoading(false);
      }
    };

    loadDistrictData();
  }, [districtId, router]);

  const handleGenerateMis = () => {
    const misText = `VASUNDHARA DISTRICT CALA MASTER MIS REPORT
District: ${data?.district?.name || 'Jabalpur'} (${districtId})
State: ${data?.district?.stateName || 'Madhya Pradesh'}
Generated At: ${new Date().toLocaleString('en-IN')}
--------------------------------------------------
Total Active Projects: ${data?.kpis?.totalActiveProjects ?? 3}
Land Acquired Target: ${data?.kpis?.landAcquiredTarget ?? 1240} Ha
Tehsils Count: ${data?.district?.tehsilsCount ?? 6}
Total Escrow Deposited: ₹${data?.financialEscrow?.totalDepositedCr ?? '1,200.00'} Cr
Disbursed: ₹${data?.financialEscrow?.disbursedCr ?? '842.50'} Cr
Pending Approvals: ${data?.pendingApprovals?.length ?? 2} Items
--------------------------------------------------
OFFICIAL COPY - COMPETENT AUTHORITY LAND ACQUISITION`;

    const blob = new Blob([misText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CALA_MIS_${districtId}_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSignAward = (id: string, title: string) => {
    setApprovedAwards((prev) => ({ ...prev, [id]: true }));
    alert(`e-Sign Successful: Digital DSC applied for "${title}". Order committed to Bhulekh & PFMS.`);
  };

  const handleHaltAward = () => {
    setFraudHalted(true);
    alert('Immediate Statutory Stay Issued: Award proceedings halted for Khasra 452/1. Revenue Inspector dispatched for physical spot enquiry.');
  };

  const district = data?.district || {
    id: districtId,
    name: 'Jabalpur',
    code: 'JBP',
    stateName: 'Madhya Pradesh',
    tehsilsCount: 6,
  };

  const kpis = data?.kpis || {
    totalActiveProjects: 12,
    landAcquiredTarget: 1240,
    tehsilsCount: 4,
  };

  const milestones = data?.milestoneTracker && data.milestoneTracker.length > 0
    ? data.milestoneTracker
    : [
        {
          id: '1',
          name: 'NH-44 Highway Widening',
          code: 'NHAI',
          requiringBody: 'NHAI',
          targetArea: 420,
          sec11: true,
          sec15: true,
          sec19: true,
          sec21: 'IN_PROGRESS',
          possession: 'PENDING',
        },
        {
          id: '2',
          name: 'Dedicated Freight Corridor',
          code: 'Railways',
          requiringBody: 'Railways',
          targetArea: 650,
          sec11: true,
          sec15: true,
          sec19: false,
          sec21: 'PENDING',
          possession: 'PENDING',
        },
      ];

  const rrTracker = data?.rrTracker && data.rrTracker.length > 0
    ? data.rrTracker
    : [
        {
          id: '1',
          projectName: 'NH-44 Highway Widening',
          totalPafs: 312,
          housingPlots: '280 / 312',
          housingPct: 89,
          employment: '150 / 312',
          employmentPct: 48,
          allowance: '312 / 312',
          allowancePct: 100,
          status: 'In Progress',
        },
        {
          id: '2',
          projectName: 'Dedicated Freight Corridor',
          totalPafs: 84,
          housingPlots: '0 / 84',
          housingPct: 0,
          employment: '0 / 84',
          employmentPct: 0,
          allowance: '0 / 84',
          allowancePct: 0,
          status: 'Pending Sec 19',
        },
      ];

  const pendingApprovals = data?.pendingApprovals && data.pendingApprovals.length > 0
    ? data.pendingApprovals
    : [
        {
          id: 'app-1',
          title: 'Approve Final Award (Sec 21)',
          projectName: 'NH-44 Widening',
          stage: '45 Parcels pending digital signature',
          status: 'PENDING',
        },
      ];

  const escrow = data?.financialEscrow || {
    totalDepositedCr: '1,200.00',
    disbursedCr: '842.50',
    pendingCr: '357.50',
  };

  return (
    <>
      <Header />

      {/* Nav */}
      <nav className="bg-[#122C4A] flex flex-wrap items-center px-8 py-2 md:py-0">
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
            router.replace('/login/mainlogin');
          }}
          className="text-white bg-[#D97706] hover:bg-[#B45309] px-4 py-2 rounded text-sm font-semibold transition"
        >
          {t('nav.logout', 'Logout')}
        </button>
      </nav>

      <div className="min-h-screen bg-[#F8FAFC] pb-12 font-sans text-[#1B2430]">
        {/* 1. TOP NAVBAR / HEADER */}
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
          <div className="max-w-[1536px] mx-auto px-6 lg:px-10 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#122C4A]">
                {t('district.title', 'District CALA Command Center')}
              </h1>
              <p className="text-[#5B6472] mt-1 text-sm">
                Collectorate:{' '}
                <strong className="text-[#1B2430]">
                  {district.name}, {district.stateName}
                </strong>{' '}
                | Officer ID: MP-{district.code || districtId}-CALA-01
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              {/* System Sync Badges */}
              <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Live Sync:
                </span>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Bhulekh
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> PFMS
                </div>
              </div>

              {/* Master MIS Button */}
              <button
                onClick={handleGenerateMis}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#122C4A] text-white hover:bg-[#0B1F35] font-bold py-2.5 px-6 rounded-lg transition-all shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t('btn.generate_mis', 'Generate MIS Report')}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-[1536px] mx-auto px-6 lg:px-10 mt-8 space-y-8">
          {/* 2. AI ALERTS & KPI ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Critical AI Alert */}
            <div className="lg:col-span-2 bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col justify-center relative overflow-hidden shadow-sm">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
              <div className="flex items-start gap-4">
                <div className="bg-red-100 text-red-600 p-3 rounded-full shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-red-800 uppercase tracking-wider">
                      DSS Alert: Land Fraud Risk
                    </h3>
                  </div>
                  <p className="text-sm text-red-700 leading-relaxed">
                    <strong>Suspicious Subdivision:</strong> Khasra 452/1 (NH-44 Project) was subdivided into 6 parcels 48 hours prior to Sec 11 notification. Likely attempt to claim multiple R&R benefits.
                  </p>
                  <button
                    onClick={handleHaltAward}
                    disabled={fraudHalted}
                    className={`mt-3 text-xs font-bold px-4 py-1.5 rounded transition ${
                      fraudHalted
                        ? 'bg-red-800 text-white cursor-default'
                        : 'bg-white text-red-600 border border-red-200 hover:bg-red-600 hover:text-white'
                    }`}
                  >
                    {fraudHalted ? '✓ Proceedings Halted Under Sec 15' : 'Investigate & Halt Award'}
                  </button>
                </div>
              </div>
            </div>

            {/* KPIs */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-center">
              <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                {t('district.kpi_projects', 'Total Active Projects')}
              </span>
              <span className="text-4xl font-serif font-bold text-[#122C4A]">
                {kpis.totalActiveProjects}
              </span>
              <span className="text-xs text-green-600 font-semibold mt-2">
                ↑ Active in District
              </span>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-center">
              <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                {t('district.kpi_land_target', 'Land Acquired Target')}
              </span>
              <span className="text-4xl font-serif font-bold text-[#122C4A]">
                {kpis.landAcquiredTarget.toLocaleString('en-IN')}{' '}
                <span className="text-lg font-sans text-gray-400">Ha</span>
              </span>
              <span className="text-xs text-gray-500 mt-2">
                Across {district.tehsilsCount} Tehsils
              </span>
            </div>
          </div>

          {/* 3. PROJECT MILESTONE TRACKER */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-serif font-bold text-[#122C4A]">
                  {t('district.milestone_tracker', 'Acquisition Milestone Tracker')}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Real-time status of RFCTLARR Act 2013 legal milestones.
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-white text-gray-500 text-[11px] uppercase tracking-wider border-b border-gray-200">
                    <th className="px-8 py-4 font-bold">Project & Requiring Body</th>
                    <th className="px-6 py-4 font-bold text-center">
                      Sec 11 <br />
                      <span className="font-normal text-gray-400 capitalize">Notification</span>
                    </th>
                    <th className="px-6 py-4 font-bold text-center">
                      Sec 15 <br />
                      <span className="font-normal text-gray-400 capitalize">Hearing</span>
                    </th>
                    <th className="px-6 py-4 font-bold text-center">
                      Sec 19 <br />
                      <span className="font-normal text-gray-400 capitalize">Declaration</span>
                    </th>
                    <th className="px-6 py-4 font-bold text-center">
                      Sec 21 <br />
                      <span className="font-normal text-gray-400 capitalize">Award</span>
                    </th>
                    <th className="px-6 py-4 font-bold text-center">
                      Possession <br />
                      <span className="font-normal text-gray-400 capitalize">Sec 38</span>
                    </th>
                    <th className="px-8 py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {milestones.map((proj) => (
                    <tr key={proj.id} className="hover:bg-gray-50 transition">
                      <td className="px-8 py-5">
                        <div className="font-bold text-[#122C4A] text-base">{proj.name}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {proj.requiringBody} • {proj.targetArea} Hectares Target
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        {proj.sec11 ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-700 font-bold text-xs">
                            ✓
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-400 font-bold text-xs">-</span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-center">
                        {proj.sec15 ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-700 font-bold text-xs">
                            ✓
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-400 font-bold text-xs">-</span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-center">
                        {proj.sec19 ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-700 font-bold text-xs">
                            ✓
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-100 text-red-600 font-bold text-xs">
                            X
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-center">
                        {proj.sec21 === 'COMPLETED' ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-700 font-bold text-xs">✓</span>
                        ) : proj.sec21 === 'IN_PROGRESS' ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border-2 border-[#F2A71B] text-[#F2A71B] font-bold text-sm animate-pulse">!</span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-400 font-bold text-xs">-</span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-center">
                        {proj.possession === 'COMPLETED' ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-700 font-bold text-xs">✓</span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-400 font-bold text-xs">-</span>
                        )}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button
                          onClick={() => alert(`Milestone Dossier: ${proj.name}\nTarget Area: ${proj.targetArea} Ha\nRequiring Body: ${proj.requiringBody}`)}
                          className="text-[#1D5FA8] hover:text-[#122C4A] font-semibold text-sm"
                        >
                          {t('btn.view_details', 'View Details')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. DEDICATED R&R TRACKER */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-gray-200 bg-[#FDF8E3] flex justify-between items-center">
              <div>
                <h2 className="text-lg font-serif font-bold text-[#122C4A]">
                  {t('district.rr_tracker', 'Project-Wise R&R (Rehabilitation) Tracker')}
                </h2>
                <p className="text-xs text-[#B96E22] mt-1 font-semibold">
                  Monitoring compliance for displaced Project Affected Families (PAFs).
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-white text-gray-500 text-[11px] uppercase tracking-wider border-b border-gray-200">
                    <th className="px-8 py-4 font-bold">Project Name</th>
                    <th className="px-6 py-4 font-bold">
                      Total PAFs <br />
                      <span className="font-normal text-gray-400 capitalize">(Families)</span>
                    </th>
                    <th className="px-6 py-4 font-bold">
                      Housing Plots <br />
                      <span className="font-normal text-gray-400 capitalize">Allocated vs Target</span>
                    </th>
                    <th className="px-6 py-4 font-bold">
                      Employment / Annuity <br />
                      <span className="font-normal text-gray-400 capitalize">Provided</span>
                    </th>
                    <th className="px-6 py-4 font-bold">
                      Displacement Allowance <br />
                      <span className="font-normal text-gray-400 capitalize">Disbursed</span>
                    </th>
                    <th className="px-8 py-4 font-bold text-right">R&R Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {rrTracker.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-8 py-5 font-bold text-[#122C4A]">
                        {item.projectName}
                      </td>
                      <td className="px-6 py-5 font-semibold text-gray-700">
                        {item.totalPafs} Families
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-between text-xs mb-1">
                          <span>{item.housingPlots}</span>
                          <span className="font-bold text-green-600">{item.housingPct}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-green-500 h-1.5 rounded-full"
                            style={{ width: `${item.housingPct}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-between text-xs mb-1">
                          <span>{item.employment}</span>
                          <span className={`font-bold ${item.employmentPct > 0 ? 'text-[#F2A71B]' : 'text-gray-400'}`}>
                            {item.employmentPct}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${item.employmentPct > 0 ? 'bg-[#F2A71B]' : 'bg-gray-400'}`}
                            style={{ width: `${item.employmentPct}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-between text-xs mb-1">
                          <span>{item.allowance}</span>
                          <span className={`font-bold ${item.allowancePct > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                            {item.allowancePct}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${item.allowancePct > 0 ? 'bg-green-500' : 'bg-gray-400'}`}
                            style={{ width: `${item.allowancePct}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                            item.status.toLowerCase().includes('progress')
                              ? 'bg-[#FDF8E3] text-[#B96E22] border-[#E7DFB8]'
                              : 'bg-gray-100 text-gray-500 border-gray-200'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. BOTTOM WIDGETS ROW (3 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pending Approvals */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-base font-bold text-[#122C4A]">
                  {t('district.pending_approvals', 'Pending Approvals')}
                </h2>
                <span className="bg-[#122C4A] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  {pendingApprovals.length} Items
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col gap-4">
                {pendingApprovals.map((app) => {
                  const isSigned = approvedAwards[app.id];
                  return (
                    <div key={app.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <h3 className="font-bold text-sm text-[#122C4A]">
                        {app.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 mb-3">
                        {app.projectName} • {app.stage}
                      </p>
                      <button
                        onClick={() => handleSignAward(app.id, app.title)}
                        disabled={isSigned}
                        className={`w-full text-xs font-bold py-2 px-4 rounded transition ${
                          isSigned
                            ? 'bg-green-700 text-white'
                            : 'bg-[#122C4A] text-white hover:bg-[#0B1F35]'
                        }`}
                      >
                        {isSigned ? '✓ Digitally Signed (Sec 21 Order Issued)' : t('btn.review_sign', 'Review & e-Sign')}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Financial Escrow */}
            <div className="bg-[#0B1F35] border border-[#1D5FA8] rounded-xl shadow-sm p-6 text-white flex flex-col justify-center relative overflow-hidden">
              <svg
                className="absolute -right-4 -bottom-4 w-32 h-32 text-white opacity-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <h2 className="text-lg font-serif font-bold text-[#F2A71B] mb-5 relative z-10">
                {t('district.financial_health', 'District Financial Health')}
              </h2>
              <div className="space-y-4 relative z-10">
                <div>
                  <span className="block text-[10px] text-[#9FB0C4] uppercase tracking-wider mb-1">
                    Total Project Funds Deposited
                  </span>
                  <span className="text-2xl font-bold tracking-wide">
                    ₹ {escrow.totalDepositedCr} Cr
                  </span>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between text-[11px] font-bold mb-1 text-[#9FB0C4]">
                    <span>Successfully Disbursed</span>
                    <span className="text-green-400">
                      ₹ {escrow.disbursedCr} Cr (70%)
                    </span>
                  </div>
                  <div className="w-full bg-[#122C4A] rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Litigation Watchlist */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-base font-bold text-[#122C4A]">Litigation Watchlist</h2>
              </div>
              <div className="p-6 flex-1">
                <ul className="space-y-5">
                  <li className="flex gap-3 items-start">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-red-500 shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1B2430]">
                        High Court Stay - WP(C) 1024
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Village Rau farmers disputing rural multiplier. Hearing: 15 Oct.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-[#F2A71B] shrink-0"></div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1B2430]">
                        Title Dispute - Khasra 890
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Funds moved to escrow account under Sec 77 pending resolution.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
