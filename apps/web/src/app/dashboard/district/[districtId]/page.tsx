import React from 'react';
import Link from 'next/link';
import Header from '../../../../components/layout/header';


 
export default function DistrictDashboard({ params }: { params: { districtId: string } }) {
  return (
  <><Header/>
   {/* Nav */}
      <nav className="bg-[#122C4A] flex flex-wrap items-center px-8 py-2 md:py-0">
        <ul className="flex flex-wrap flex-1 list-none m-0 p-0">
          {[
            { name: 'Home', href: '/' },
            { name: 'About Us', href: '/#about-us' },
            { name: 'Notification', href: '/#notification' },
            { name: 'Act', href: 'https://mwcc.org.in/knowledge%20center/LandAcqisition/landAcquisitionAct-2013-.pdf',newTab: true }, // This now points to your Act page folder!
            { name: 'Projects', href: '/#projects' },
            { name: 'Important Links', href: '/#important-links' }
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
      </nav>
    <div className="min-h-screen bg-[#F8FAFC] pb-12 font-sans text-[#1B2430]">
      
      {/* 1. TOP NAVBAR / HEADER (Clean & Spacious) */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-[1536px] mx-auto px-6 lg:px-10 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#122C4A]">District CALA Command Center</h1>
            <p className="text-[#5B6472] mt-1 text-sm">
              Collectorate: <strong className="text-[#1B2430]">Indore, Madhya Pradesh</strong> | Officer ID: MP-IND-CALA-01
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            {/* System Sync Badges - Cleaner Design */}
            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live Sync:</span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Bhulekh
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> PFMS
              </div>
            </div>
            {/* Master MIS Button */}
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#122C4A] text-white hover:bg-[#0B1F35] font-bold py-2.5 px-6 rounded-lg transition-all shadow-md">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Generate MIS Report
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1536px] mx-auto px-6 lg:px-10 mt-8 space-y-8">
        
        {/* 2. AI ALERTS & KPI ROW (Merged for better space utilization) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Critical AI Alert - Takes up 2 columns */}
          <div className="lg:col-span-2 bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col justify-center relative overflow-hidden shadow-sm">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
            <div className="flex items-start gap-4">
              <div className="bg-red-100 text-red-600 p-3 rounded-full shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-red-800 uppercase tracking-wider">DSS Alert: Land Fraud Risk</h3>
                </div>
                <p className="text-sm text-red-700 leading-relaxed">
                  <strong>Suspicious Subdivision:</strong> Khasra 452/1 (NH-44 Project) was subdivided into 6 parcels 48 hours prior to Sec 11 notification. Likely attempt to claim multiple R&R benefits.
                </p>
                <button className="mt-3 text-xs font-bold bg-white text-red-600 border border-red-200 px-4 py-1.5 rounded hover:bg-red-600 hover:text-white transition">
                  Investigate & Halt Award
                </button>
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-center">
            <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Active Projects</span>
            <span className="text-4xl font-serif font-bold text-[#122C4A]">12</span>
            <span className="text-xs text-green-600 font-semibold mt-2">↑ 2 New this month</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-center">
            <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Land Acquired Target</span>
            <span className="text-4xl font-serif font-bold text-[#122C4A]">1,240 <span className="text-lg font-sans text-gray-400">Ha</span></span>
            <span className="text-xs text-gray-500 mt-2">Across 4 Tehsils</span>
          </div>
        </div>

        {/* 3. PROJECT MILESTONE TRACKER (Full Width) */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-serif font-bold text-[#122C4A]">Acquisition Milestone Tracker</h2>
              <p className="text-xs text-gray-500 mt-1">Real-time status of RFCTLARR Act 2013 legal milestones.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-white text-gray-500 text-[11px] uppercase tracking-wider border-b border-gray-200">
                  <th className="px-8 py-4 font-bold">Project & Requiring Body</th>
                  <th className="px-6 py-4 font-bold text-center">Sec 11 <br/><span className="font-normal text-gray-400 capitalize">Notification</span></th>
                  <th className="px-6 py-4 font-bold text-center">Sec 15 <br/><span className="font-normal text-gray-400 capitalize">Hearing</span></th>
                  <th className="px-6 py-4 font-bold text-center">Sec 19 <br/><span className="font-normal text-gray-400 capitalize">Declaration</span></th>
                  <th className="px-6 py-4 font-bold text-center">Sec 21 <br/><span className="font-normal text-gray-400 capitalize">Award</span></th>
                  <th className="px-6 py-4 font-bold text-center">Possession <br/><span className="font-normal text-gray-400 capitalize">Sec 38</span></th>
                  <th className="px-8 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                <tr className="hover:bg-gray-50 transition">
                  <td className="px-8 py-5">
                    <div className="font-bold text-[#122C4A] text-base">NH-44 Highway Widening</div>
                    <div className="text-xs text-gray-500 mt-1">NHAI • 420 Hectares Target</div>
                  </td>
                  <td className="px-6 py-5 text-center"><span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-700 font-bold text-xs">✓</span></td>
                  <td className="px-6 py-5 text-center"><span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-700 font-bold text-xs">✓</span></td>
                  <td className="px-6 py-5 text-center"><span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-700 font-bold text-xs">✓</span></td>
                  <td className="px-6 py-5 text-center"><span className="inline-flex items-center justify-center w-7 h-7 rounded-full border-2 border-[#F2A71B] text-[#F2A71B] font-bold text-sm animate-pulse">!</span></td>
                  <td className="px-6 py-5 text-center"><span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-400 font-bold text-xs">-</span></td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-[#1D5FA8] hover:text-[#122C4A] font-semibold text-sm">View Details</button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition">
                  <td className="px-8 py-5">
                    <div className="font-bold text-[#122C4A] text-base">Dedicated Freight Corridor</div>
                    <div className="text-xs text-gray-500 mt-1">Railways • 650 Hectares Target</div>
                  </td>
                  <td className="px-6 py-5 text-center"><span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-700 font-bold text-xs">✓</span></td>
                  <td className="px-6 py-5 text-center"><span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-700 font-bold text-xs">✓</span></td>
                  <td className="px-6 py-5 text-center"><span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-100 text-red-600 font-bold text-xs">X</span></td>
                  <td className="px-6 py-5 text-center"><span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-400 font-bold text-xs">-</span></td>
                  <td className="px-6 py-5 text-center"><span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-400 font-bold text-xs">-</span></td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-[#1D5FA8] hover:text-[#122C4A] font-semibold text-sm">View Details</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. NEW: DEDICATED R&R TRACKER (Full Width) */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-gray-200 bg-[#FDF8E3] flex justify-between items-center">
            <div>
              <h2 className="text-lg font-serif font-bold text-[#122C4A]">Project-Wise R&R (Rehabilitation) Tracker</h2>
              <p className="text-xs text-[#B96E22] mt-1 font-semibold">Monitoring compliance for displaced Project Affected Families (PAFs).</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-white text-gray-500 text-[11px] uppercase tracking-wider border-b border-gray-200">
                  <th className="px-8 py-4 font-bold">Project Name</th>
                  <th className="px-6 py-4 font-bold">Total PAFs <br/><span className="font-normal text-gray-400 capitalize">(Families)</span></th>
                  <th className="px-6 py-4 font-bold">Housing Plots <br/><span className="font-normal text-gray-400 capitalize">Allocated vs Target</span></th>
                  <th className="px-6 py-4 font-bold">Employment / Annuity <br/><span className="font-normal text-gray-400 capitalize">Provided</span></th>
                  <th className="px-6 py-4 font-bold">Displacement Allowance <br/><span className="font-normal text-gray-400 capitalize">Disbursed</span></th>
                  <th className="px-8 py-4 font-bold text-right">R&R Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                <tr className="hover:bg-gray-50 transition">
                  <td className="px-8 py-5 font-bold text-[#122C4A]">NH-44 Highway Widening</td>
                  <td className="px-6 py-5 font-semibold text-gray-700">312 Families</td>
                  <td className="px-6 py-5">
                    <div className="flex justify-between text-xs mb-1"><span>280 / 312</span><span className="font-bold text-green-600">89%</span></div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full" style={{ width: '89%' }}></div></div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-between text-xs mb-1"><span>150 / 312</span><span className="font-bold text-[#F2A71B]">48%</span></div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-[#F2A71B] h-1.5 rounded-full" style={{ width: '48%' }}></div></div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-between text-xs mb-1"><span>312 / 312</span><span className="font-bold text-green-600">100%</span></div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full" style={{ width: '100%' }}></div></div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className="bg-[#FDF8E3] text-[#B96E22] border border-[#E7DFB8] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">In Progress</span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition">
                  <td className="px-8 py-5 font-bold text-[#122C4A]">Dedicated Freight Corridor</td>
                  <td className="px-6 py-5 font-semibold text-gray-700">84 Families</td>
                  <td className="px-6 py-5">
                    <div className="flex justify-between text-xs mb-1"><span>0 / 84</span><span className="font-bold text-gray-400">0%</span></div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-gray-400 h-1.5 rounded-full" style={{ width: '0%' }}></div></div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-between text-xs mb-1"><span>0 / 84</span><span className="font-bold text-gray-400">0%</span></div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-gray-400 h-1.5 rounded-full" style={{ width: '0%' }}></div></div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-between text-xs mb-1"><span>0 / 84</span><span className="font-bold text-gray-400">0%</span></div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-gray-400 h-1.5 rounded-full" style={{ width: '0%' }}></div></div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className="bg-gray-100 text-gray-500 border border-gray-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Pending Sec 19</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. BOTTOM WIDGETS ROW (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Action Required */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-base font-bold text-[#122C4A]">Pending Approvals</h2>
              <span className="bg-[#122C4A] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">2 Items</span>
            </div>
            <div className="p-6 flex-1 flex flex-col gap-4">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="font-bold text-sm text-[#122C4A]">Approve Final Award (Sec 21)</h3>
                <p className="text-xs text-gray-500 mt-1 mb-3">NH-44 Widening • 45 Parcels pending digital signature.</p>
                <button className="w-full bg-[#122C4A] text-white hover:bg-[#0B1F35] text-xs font-bold py-2 px-4 rounded transition">Review & e-Sign</button>
              </div>
            </div>
          </div>

          {/* Financial Escrow */}
          <div className="bg-[#0B1F35] border border-[#1D5FA8] rounded-xl shadow-sm p-6 text-white flex flex-col justify-center relative overflow-hidden">
             {/* Decorative Background Icon */}
             <svg className="absolute -right-4 -bottom-4 w-32 h-32 text-white opacity-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
             <h2 className="text-lg font-serif font-bold text-[#F2A71B] mb-5 relative z-10">District Financial Health</h2>
             <div className="space-y-4 relative z-10">
                <div>
                  <span className="block text-[10px] text-[#9FB0C4] uppercase tracking-wider mb-1">Total Project Funds Deposited</span>
                  <span className="text-2xl font-bold tracking-wide">₹ 1,200.00 Cr</span>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between text-[11px] font-bold mb-1 text-[#9FB0C4]">
                    <span>Successfully Disbursed</span>
                    <span className="text-green-400">₹ 842.50 Cr (70%)</span>
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
                    <h4 className="text-sm font-bold text-[#1B2430]">High Court Stay - WP(C) 1024</h4>
                    <p className="text-xs text-gray-500 mt-1">Village Rau farmers disputing rural multiplier. Hearing: 15 Oct.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-[#F2A71B] shrink-0"></div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1B2430]">Title Dispute - Khasra 890</h4>
                    <p className="text-xs text-gray-500 mt-1">Funds moved to escrow account under Sec 77 pending resolution.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  </>);
}

