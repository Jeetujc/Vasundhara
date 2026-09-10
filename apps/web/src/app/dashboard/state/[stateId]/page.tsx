'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../../../../components/layout/header';
import { authService, type AuthUser } from '../../../../services/auth.service';
import {
  dashboardService,
  type StateDashboardData,
} from '../../../../services/dashboard.service';
import { useLanguage } from '../../../../context/LanguageContext';

export default function StateDashboard({
  params,
}: {
  params: Promise<{ stateId: string }>;
}) {
  const resolvedParams = use(params);
  const stateId = resolvedParams.stateId;
  const router = useRouter();
  const { t } = useLanguage();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [data, setData] = useState<StateDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStateData = async () => {
      try {
        setLoading(true);
        setError('');

        const session = authService.getSession();
        if (!session) {
          router.replace('/login/mainlogin');
          return;
        }

        const [currentUser, stateData] = await Promise.all([
          authService.getCurrentUser().catch(() => session.user),
          dashboardService.getState(stateId).catch((err) => {
            console.warn('Could not fetch state dashboard data:', err);
            return null;
          }),
        ]);

        setUser(currentUser);
        if (stateData) {
          setData(stateData);
        }
      } catch (err) {
        console.error('State dashboard error:', err);
        setError('Failed to load state dashboard.');
      } finally {
        setLoading(false);
      }
    };

    loadStateData();
  }, [stateId, router]);

  const handleExportReport = () => {
    const reportContent = `VASUNDHARA STATE MACRO-OVERSIGHT ASSEMBLY REPORT
State: ${data?.state?.name || 'Madhya Pradesh'} (${stateId})
Generated At: ${new Date().toLocaleString('en-IN')}
--------------------------------------------------
Active Mega-Projects: ${data?.kpis?.activeProjects ?? 24}
Land Target: ${data?.kpis?.landTargetHectares ?? 18500} Ha (${data?.kpis?.acquiredPercentage ?? 68}% Acquired)
Funds Disbursed: ₹${data?.kpis?.fundsDisbursedCr ?? 4250} Cr
Funds at Risk: ₹${data?.kpis?.fundsAtRiskCr ?? 840} Cr
Clearances Pending: ${data?.clearanceTracker?.length ?? 2} Projects
--------------------------------------------------
CONFIDENTIAL - FOR ASSEMBLY & REVENUE REVIEW ONLY`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Assembly_Report_${stateId}_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const kpis = data?.kpis || {
    activeProjects: 24,
    totalDistrictsCount: 52,
    landTargetHectares: 18500,
    acquiredPercentage: 68,
    fundsDisbursedCr: '4,250',
    fundsAtRiskCr: '840',
  };

  const districtRanking = data?.districtEfficiencyRanking && data.districtEfficiencyRanking.length > 0
    ? data.districtEfficiencyRanking
    : [
        { rank: 1, name: 'Indore', avgDays: 210, badge: 'green' },
        { rank: 2, name: 'Bhopal', avgDays: 245, badge: 'green' },
        { rank: 51, name: 'Ujjain', avgDays: 415, badge: 'red' },
        { rank: 52, name: 'Dhar', avgDays: 430, badge: 'red' },
      ];

  const statutoryRadar = data?.statutoryRadar && data.statutoryRadar.length > 0
    ? data.statutoryRadar
    : [
        { id: '1', name: 'Narmada Valley Phase 3 (Sehore)', district: 'Sehore', status: 'CRITICAL', daysLeft: 14, percent: 95 },
        { id: '2', name: 'Delhi-Mumbai E-Way (Ratlam)', district: 'Ratlam', status: 'WATCH', daysLeft: 42, percent: 85 },
      ];

  const clearances = data?.clearanceTracker && data.clearanceTracker.length > 0
    ? data.clearanceTracker
    : [
        {
          id: '1',
          name: 'Delhi-Mumbai Expressway',
          code: 'NHAI • 1,200 Hectares (MP Stretch)',
          areaHectares: 1200,
          district: 'Jhabua, Ratlam, Mandsaur',
          revenueStatus: 'Cleared (95%)',
          forestStatus: 'Cleared',
          requiringBodyStatus: 'Funds Received',
        },
        {
          id: '2',
          name: 'Narmada Valley Phase 3',
          code: 'Water Res. • 850 Hectares',
          areaHectares: 850,
          district: 'Sehore, Harda, Khandwa',
          revenueStatus: 'Cleared (80%)',
          forestStatus: 'Blocked',
          requiringBodyStatus: 'Partial Escrow',
        },
      ];

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

      <div className="min-h-screen bg-[#F8FAFC] pb-14 font-sans text-[#1B2430]">
        {/* 1. STATE COMMAND HEADER */}
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-5 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#122C4A]">
                {t('state.title', 'State Macro-Oversight Workspace')}
              </h1>
              <p className="text-[#5B6472] mt-1 text-sm">
                <strong className="text-[#1B2430]">
                  Government of {data?.state?.name || 'Madhya Pradesh'}
                </strong>{' '}
                | Department of Revenue
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
              {/* API Health Monitor */}
              <div className="flex flex-wrap items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200 w-full md:w-auto">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Enterprise Sync:
                </span>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Bhulekh
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> PFMS
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                  <span className="w-2 h-2 rounded-full bg-[#F2A71B] animate-pulse"></span> Parivesh (Forest)
                </div>
              </div>

              <Link
                href="/dashboard/field"
                className="flex items-center justify-center gap-1.5 bg-[#B96E22] text-white hover:bg-[#965516] font-bold py-2.5 px-4 rounded-lg transition-all shadow-md text-xs whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Field Officer Work Management
              </Link>

              <Link
                href="/gis"
                className="flex items-center justify-center gap-1.5 bg-[#1D5FA8] text-white hover:bg-[#122C4A] font-bold py-2.5 px-4 rounded-lg transition-all shadow-md text-xs whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                GIS Map
              </Link>

              <Link
                href="/projects"
                className="flex items-center justify-center gap-1.5 bg-white border border-[#DDD8C8] text-[#122C4A] hover:bg-gray-50 font-bold py-2.5 px-4 rounded-lg transition-all shadow-md text-xs whitespace-nowrap"
              >
                Projects
              </Link>

              <button
                onClick={handleExportReport}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#122C4A] text-white hover:bg-[#0B1F35] font-bold py-2.5 px-5 rounded-lg transition-all shadow-md whitespace-nowrap text-xs"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t('btn.export_report', 'Export Assembly Report')}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 mt-8 space-y-8">
          {/* 2. STATE-WIDE KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                {t('state.kpi_projects', 'Mega-Projects Active')}
              </span>
              <span className="text-4xl font-serif font-bold text-[#122C4A]">
                {kpis.activeProjects}
              </span>
              <span className="text-xs text-gray-500 mt-2 block">
                Across {kpis.totalDistrictsCount || 52} Districts
              </span>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                {t('state.kpi_land_target', 'Land Target (Statewide)')}
              </span>
              <span className="text-4xl font-serif font-bold text-[#122C4A]">
                {kpis.landTargetHectares.toLocaleString('en-IN')}{' '}
                <span className="text-lg font-sans text-gray-400">Ha</span>
              </span>
              <span className="text-xs text-green-600 font-semibold mt-2 block">
                {kpis.acquiredPercentage}% Acquired Successfully
              </span>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                {t('state.kpi_funds_disbursed', 'Funds Disbursed')}
              </span>
              <span className="text-4xl font-serif font-bold text-[#122C4A]">
                ₹{kpis.fundsDisbursedCr}{' '}
                <span className="text-lg font-sans text-gray-400">Cr</span>
              </span>
              <span className="text-xs text-gray-500 mt-2 block">Current Fiscal Year</span>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute right-0 top-0 w-2 h-full bg-red-500"></div>
              <span className="block text-xs font-bold text-red-600 uppercase tracking-wider mb-2">
                {t('state.kpi_funds_risk', 'Funds at Risk of Lapse')}
              </span>
              <span className="text-4xl font-serif font-bold text-red-700">
                ₹{kpis.fundsAtRiskCr}{' '}
                <span className="text-lg font-sans text-red-400">Cr</span>
              </span>
              <span className="text-xs text-red-600 font-semibold mt-2 block">
                Due to Statutory Delays
              </span>
            </div>
          </div>

          {/* 3. THREAT, PERFORMANCE & AI ROW (3 Columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* District Efficiency Ranking */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-base font-bold text-[#122C4A]">
                  {t('state.efficiency_ranking', 'District Efficiency Ranking')}
                </h2>
                <p className="text-xs text-gray-500">Avg. days from Sec 11 to Sec 21</p>
              </div>
              <ul className="divide-y divide-gray-100 flex-1 p-2">
                {districtRanking.map((dist, idx) => {
                  const isLagging = dist.badge === 'red';
                  return (
                    <li
                      key={idx}
                      className={`p-3 flex items-center justify-between rounded ${
                        isLagging ? 'hover:bg-red-50' : 'hover:bg-gray-50'
                      } ${idx === 2 ? 'mt-4 border-t border-dashed border-gray-200' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded ${
                            isLagging
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          #{dist.rank}
                        </span>
                        <span
                          className={`text-sm font-bold ${
                            isLagging ? 'text-red-700' : 'text-[#1B2430]'
                          }`}
                        >
                          {dist.name}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-semibold ${
                          isLagging ? 'text-red-700' : 'text-gray-600'
                        }`}
                      >
                        {dist.avgDays} Days {isLagging ? '⚠' : ''}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Statutory Expiry Radar */}
            <div className="bg-[#0B1F35] border border-[#1D5FA8] rounded-xl shadow-sm flex flex-col relative overflow-hidden">
              <svg
                className="absolute top-0 right-0 opacity-10 text-white w-48 h-48"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <div className="px-6 py-4 border-b border-[#1D5FA8] relative z-10">
                <h2 className="text-base font-bold text-[#F2A71B]">
                  {t('state.statutory_radar', 'Statutory Expiry Radar')}
                </h2>
                <p className="text-xs text-[#9FB0C4]">Approaching 12-Month Sec 19 Lapses</p>
              </div>
              <div className="p-6 relative z-10 space-y-5">
                {statutoryRadar.map((radar) => (
                  <div key={radar.id}>
                    <div className="flex justify-between text-white text-sm font-bold mb-1">
                      <span>{radar.name}</span>
                      <span className={radar.daysLeft < 30 ? 'text-red-400' : 'text-[#F2A71B]'}>
                        {radar.daysLeft} Days Left
                      </span>
                    </div>
                    <div className="w-full bg-[#122C4A] rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          radar.daysLeft < 30
                            ? 'bg-red-500 animate-pulse'
                            : 'bg-[#F2A71B]'
                        }`}
                        style={{ width: `${radar.percent}%` }}
                      ></div>
                    </div>
                    {radar.daysLeft < 30 && (
                      <p className="text-[10px] text-[#9FB0C4] mt-1">
                        If lapsed, ₹320 Cr process resets to zero.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Social Friction & DSS */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200 bg-[#FDF8E3]">
                <h2 className="text-base font-bold text-[#B96E22] flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  AI Social Friction Alerts
                </h2>
                <p className="text-xs text-gray-600">Grievance sentiment & protest prediction.</p>
              </div>
              <div className="p-5 space-y-4">
                <div className="bg-red-50 p-3 rounded border border-red-100">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-red-700 uppercase">High Risk Zone</span>
                    <span className="text-[10px] bg-red-200 text-red-800 px-2 py-0.5 rounded">
                      Ujjain
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    <strong>+340% spike</strong> in grievances containing "boycott" and "unfair valuation" over 48 hours. Indicates organized protest against Sec 11 notification.
                  </p>
                  <button
                    onClick={() => alert('Dispatching Senior Revenue Negotiator team to Ujjain CALA')}
                    className="mt-2 text-[10px] font-bold text-[#1D5FA8] hover:underline"
                  >
                    Deploy Policy Negotiators &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 4. MEGA-PROJECTS & CROSS-DEPARTMENTAL CLEARANCES (Full Width) */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-serif font-bold text-[#122C4A]">
                  {t('state.clearance_tracker', 'Inter-Departmental Clearance Tracker')}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Monitoring State/Central bottlenecks for Mega-Projects.
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1100px]">
                <thead>
                  <tr className="bg-white text-gray-500 text-[11px] uppercase tracking-wider border-b border-gray-200">
                    <th className="px-8 py-4 font-bold">Mega-Project</th>
                    <th className="px-6 py-4 font-bold">Districts Affected</th>
                    <th className="px-6 py-4 font-bold text-center">
                      Revenue Dept.<br />
                      <span className="font-normal text-gray-400 capitalize">(Land Acq.)</span>
                    </th>
                    <th className="px-6 py-4 font-bold text-center">
                      MoEFCC<br />
                      <span className="font-normal text-gray-400 capitalize">(Forest Clear.)</span>
                    </th>
                    <th className="px-6 py-4 font-bold text-center">
                      Requiring Body<br />
                      <span className="font-normal text-gray-400 capitalize">(Fund Deposit)</span>
                    </th>
                    <th className="px-8 py-4 font-bold text-right">State Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {clearances.map((proj) => {
                    const isBlocked = proj.forestStatus.toLowerCase().includes('blocked');
                    return (
                      <tr
                        key={proj.id}
                        className={`transition ${isBlocked ? 'hover:bg-red-50' : 'hover:bg-gray-50'}`}
                      >
                        <td className="px-8 py-5">
                          <div className="font-bold text-[#122C4A] text-base">{proj.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{proj.code}</div>
                        </td>
                        <td className="px-6 py-5 text-gray-600 text-xs font-semibold">
                          {proj.district}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-bold">
                            {proj.revenueStatus}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          {isBlocked ? (
                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-bold flex items-center justify-center gap-1 border border-red-200">
                              <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></span> Blocked
                            </span>
                          ) : (
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-bold">
                              {proj.forestStatus}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="bg-[#FDF8E3] text-[#B96E22] px-3 py-1 rounded text-xs font-bold border border-[#E7DFB8]">
                            {proj.requiringBodyStatus}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          {isBlocked ? (
                            <button
                              onClick={() => alert(`Escalation file generated for ${proj.name} to Chief Minister Secretariat.`)}
                              className="bg-[#122C4A] hover:bg-[#0B1F35] text-white px-4 py-1.5 rounded text-xs font-bold whitespace-nowrap transition"
                            >
                              Escalate to CM
                            </button>
                          ) : (
                            <button
                              onClick={() => alert(`Showing full dossier for ${proj.name}`)}
                              className="text-[#1D5FA8] hover:text-[#122C4A] font-semibold text-sm"
                            >
                              View Details
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. MASTER FINANCE & R&R (2 Columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* State Escrow & Budget Health */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h2 className="text-base font-bold text-[#122C4A]">State Escrow & Budget Health</h2>
              </div>
              <div className="p-8 flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Total Required vs Available
                  </span>
                  <span className="text-xl font-bold text-[#1B2430]">₹ 12,000 Cr</span>
                </div>
                <div className="w-full h-4 bg-gray-100 rounded-full flex overflow-hidden">
                  <div
                    className="bg-green-500 h-full"
                    style={{ width: '45%' }}
                    title="Disbursed (45%)"
                  ></div>
                  <div
                    className="bg-[#F2A71B] h-full"
                    style={{ width: '35%' }}
                    title="In Escrow (35%)"
                  ></div>
                  <div
                    className="bg-red-400 h-full"
                    style={{ width: '20%' }}
                    title="Deficit/Awaiting Deposit (20%)"
                  ></div>
                </div>
                <div className="flex gap-6 mt-4 text-xs font-semibold text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded"></span> Disbursed
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-[#F2A71B] rounded"></span> In Escrow
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-400 rounded"></span> Awaiting Deposit
                  </div>
                </div>
              </div>
            </div>

            {/* State-wide R&R Compliance Roll-up */}
            <div className="bg-[#0B1F35] border border-[#1D5FA8] rounded-xl shadow-sm p-6 text-white flex flex-col justify-center relative overflow-hidden">
              <h2 className="text-lg font-serif font-bold text-[#F2A71B] mb-6 relative z-10">
                State-Wide R&R Compliance
              </h2>
              <div className="grid grid-cols-2 gap-6 relative z-10">
                <div>
                  <span className="block text-[11px] text-[#9FB0C4] uppercase tracking-wider mb-1">
                    Housing Plots Allocated
                  </span>
                  <span className="text-3xl font-bold tracking-wide">4,850</span>
                  <span className="text-xs text-green-400 block mt-1">92% of Target</span>
                </div>
                <div>
                  <span className="block text-[11px] text-[#9FB0C4] uppercase tracking-wider mb-1">
                    Employment / Annuities
                  </span>
                  <span className="text-3xl font-bold tracking-wide">2,140</span>
                  <span className="text-xs text-[#F2A71B] block mt-1">65% of Target (Lagging)</span>
                </div>
              </div>
              <button
                onClick={() => alert('Generating State R&R Audit report...')}
                className="mt-6 w-full sm:w-auto bg-[#F2A71B] hover:bg-[#D97706] text-[#0B1F35] font-bold py-2.5 px-6 rounded transition-colors text-sm shadow-sm self-start"
              >
                Generate R&R Audit Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
