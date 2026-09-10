import React from 'react';
import Link from 'next/link';
import Header from '../../../../components/layout/header';



export default function StateDashboard({ params }: { params: { stateId: string } }) {
  return (
    <>
    <Header/>
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
    <div className="min-h-screen bg-[#F8FAFC] pb-14 font-sans text-[#1B2430]">
      
      {/* 1. STATE COMMAND HEADER */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-5 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#122C4A]">State Macro-Oversight Workspace</h1>
            <p className="text-[#5B6472] mt-1 text-sm">
              <strong className="text-[#1B2430]">Government of Madhya Pradesh</strong> | Department of Revenue
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
            {/* API Health Monitor (Including External Departments) */}
            <div className="flex flex-wrap items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200 w-full md:w-auto">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Enterprise Sync:</span>
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
            
            <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#122C4A] text-white hover:bg-[#0B1F35] font-bold py-3 px-6 rounded-lg transition-all shadow-md whitespace-nowrap">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Export Assembly Report
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 mt-8 space-y-8">
        
        {/* 2. STATE-WIDE KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mega-Projects Active</span>
            <span className="text-4xl font-serif font-bold text-[#122C4A]">24</span>
            <span className="text-xs text-gray-500 mt-2 block">Across 52 Districts</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Land Target (Statewide)</span>
            <span className="text-4xl font-serif font-bold text-[#122C4A]">18,500 <span className="text-lg font-sans text-gray-400">Ha</span></span>
            <span className="text-xs text-green-600 font-semibold mt-2 block">68% Acquired Successfully</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Funds Disbursed</span>
            <span className="text-4xl font-serif font-bold text-[#122C4A]">₹4,250 <span className="text-lg font-sans text-gray-400">Cr</span></span>
            <span className="text-xs text-gray-500 mt-2 block">Current Fiscal Year</span>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 w-2 h-full bg-red-500"></div>
            <span className="block text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Funds at Risk of Lapse</span>
            <span className="text-4xl font-serif font-bold text-red-700">₹840 <span className="text-lg font-sans text-red-400">Cr</span></span>
            <span className="text-xs text-red-600 font-semibold mt-2 block">Due to Statutory Delays</span>
          </div>
        </div>

        {/* 3. THREAT, PERFORMANCE & AI ROW (3 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* District Efficiency Ranking */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-base font-bold text-[#122C4A]">District Efficiency Ranking</h2>
              <p className="text-xs text-gray-500">Avg. days from Sec 11 to Sec 21</p>
            </div>
            <ul className="divide-y divide-gray-100 flex-1 p-2">
              <li className="p-3 flex items-center justify-between hover:bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">#1</span>
                  <span className="text-sm font-bold text-[#1B2430]">Indore</span>
                </div>
                <span className="text-sm font-semibold text-gray-600">210 Days</span>
              </li>
              <li className="p-3 flex items-center justify-between hover:bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">#2</span>
                  <span className="text-sm font-bold text-[#1B2430]">Bhopal</span>
                </div>
                <span className="text-sm font-semibold text-gray-600">245 Days</span>
              </li>
              <li className="p-3 flex items-center justify-between hover:bg-red-50 rounded mt-4 border-t border-dashed border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded">#51</span>
                  <span className="text-sm font-bold text-red-700">Ujjain</span>
                </div>
                <span className="text-sm font-bold text-red-700">415 Days ⚠</span>
              </li>
              <li className="p-3 flex items-center justify-between hover:bg-red-50 rounded">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded">#52</span>
                  <span className="text-sm font-bold text-red-700">Dhar</span>
                </div>
                <span className="text-sm font-bold text-red-700">430 Days ⚠</span>
              </li>
            </ul>
          </div>

          {/* Statutory Expiry Radar */}
          <div className="bg-[#0B1F35] border border-[#1D5FA8] rounded-xl shadow-sm flex flex-col relative overflow-hidden">
            <svg className="absolute top-0 right-0 opacity-10 text-white w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            <div className="px-6 py-4 border-b border-[#1D5FA8] relative z-10">
              <h2 className="text-base font-bold text-[#F2A71B]">Statutory Expiry Radar</h2>
              <p className="text-xs text-[#9FB0C4]">Approaching 12-Month Sec 19 Lapses</p>
            </div>
            <div className="p-6 relative z-10 space-y-5">
              <div>
                <div className="flex justify-between text-white text-sm font-bold mb-1">
                  <span>Narmada Valley Phase 3 (Sehore)</span>
                  <span className="text-red-400">14 Days Left</span>
                </div>
                <div className="w-full bg-[#122C4A] rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full w-[95%] animate-pulse"></div>
                </div>
                <p className="text-[10px] text-[#9FB0C4] mt-1">If lapsed, ₹320 Cr process resets to zero.</p>
              </div>
              <div>
                <div className="flex justify-between text-white text-sm font-bold mb-1">
                  <span>Delhi-Mumbai E-Way (Ratlam)</span>
                  <span className="text-[#F2A71B]">42 Days Left</span>
                </div>
                <div className="w-full bg-[#122C4A] rounded-full h-2">
                  <div className="bg-[#F2A71B] h-2 rounded-full w-[85%]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Social Friction & DSS */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 bg-[#FDF8E3]">
              <h2 className="text-base font-bold text-[#B96E22] flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                AI Social Friction Alerts
              </h2>
              <p className="text-xs text-gray-600">Grievance sentiment & protest prediction.</p>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-red-50 p-3 rounded border border-red-100">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-red-700 uppercase">High Risk Zone</span>
                  <span className="text-[10px] bg-red-200 text-red-800 px-2 py-0.5 rounded">Ujjain</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  <strong>+340% spike</strong> in grievances containing "boycott" and "unfair valuation" over 48 hours. Indicates organized protest against Sec 11 notification.
                </p>
                <button className="mt-2 text-[10px] font-bold text-[#1D5FA8] hover:underline">Deploy Policy Negotiators &rarr;</button>
              </div>
            </div>
          </div>

        </div>

        {/* 4. MEGA-PROJECTS & CROSS-DEPARTMENTAL CLEARANCES (Full Width) */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-serif font-bold text-[#122C4A]">Inter-Departmental Clearance Tracker</h2>
              <p className="text-xs text-gray-500 mt-1">Monitoring State/Central bottlenecks for Mega-Projects.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead>
                <tr className="bg-white text-gray-500 text-[11px] uppercase tracking-wider border-b border-gray-200">
                  <th className="px-8 py-4 font-bold">Mega-Project</th>
                  <th className="px-6 py-4 font-bold">Districts Affected</th>
                  <th className="px-6 py-4 font-bold text-center">Revenue Dept.<br/><span className="font-normal text-gray-400 capitalize">(Land Acq.)</span></th>
                  <th className="px-6 py-4 font-bold text-center">MoEFCC<br/><span className="font-normal text-gray-400 capitalize">(Forest Clear.)</span></th>
                  <th className="px-6 py-4 font-bold text-center">Requiring Body<br/><span className="font-normal text-gray-400 capitalize">(Fund Deposit)</span></th>
                  <th className="px-8 py-4 font-bold text-right">State Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                <tr className="hover:bg-gray-50 transition">
                  <td className="px-8 py-5">
                    <div className="font-bold text-[#122C4A] text-base">Delhi-Mumbai Expressway</div>
                    <div className="text-xs text-gray-500 mt-1">NHAI • 1,200 Hectares (MP Stretch)</div>
                  </td>
                  <td className="px-6 py-5 text-gray-600 text-xs font-semibold">Jhabua, Ratlam, Mandsaur</td>
                  <td className="px-6 py-5 text-center"><span className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-bold">Cleared (95%)</span></td>
                  <td className="px-6 py-5 text-center"><span className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-bold">Cleared</span></td>
                  <td className="px-6 py-5 text-center"><span className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-bold">Funds Received</span></td>
                  <td className="px-8 py-5 text-right"><button className="text-[#1D5FA8] hover:text-[#122C4A] font-semibold text-sm">View Details</button></td>
                </tr>
                <tr className="hover:bg-red-50 transition">
                  <td className="px-8 py-5">
                    <div className="font-bold text-[#122C4A] text-base">Narmada Valley Phase 3</div>
                    <div className="text-xs text-gray-500 mt-1">Water Res. • 850 Hectares</div>
                  </td>
                  <td className="px-6 py-5 text-gray-600 text-xs font-semibold">Sehore, Harda, Khandwa</td>
                  <td className="px-6 py-5 text-center"><span className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-bold">Cleared (80%)</span></td>
                  <td className="px-6 py-5 text-center">
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-bold flex items-center justify-center gap-1 border border-red-200">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></span> Blocked
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center"><span className="bg-[#FDF8E3] text-[#B96E22] px-3 py-1 rounded text-xs font-bold border border-[#E7DFB8]">Partial Escrow</span></td>
                  <td className="px-8 py-5 text-right"><button className="bg-[#122C4A] text-white px-4 py-1.5 rounded text-xs font-bold whitespace-nowrap">Escalate to CM</button></td>
                </tr>
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
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Required vs Available</span>
                  <span className="text-xl font-bold text-[#1B2430]">₹ 12,000 Cr</span>
                </div>
                <div className="w-full h-4 bg-gray-100 rounded-full flex overflow-hidden">
                  <div className="bg-green-500 h-full" style={{ width: '45%' }} title="Disbursed (45%)"></div>
                  <div className="bg-[#F2A71B] h-full" style={{ width: '35%' }} title="In Escrow (35%)"></div>
                  <div className="bg-red-400 h-full" style={{ width: '20%' }} title="Deficit/Awaiting Deposit (20%)"></div>
                </div>
                <div className="flex gap-6 mt-4 text-xs font-semibold text-gray-600">
                  <div className="flex items-center gap-2"><span className="w-3 h-3 bg-green-500 rounded"></span> Disbursed</div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 bg-[#F2A71B] rounded"></span> In Escrow</div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-400 rounded"></span> Awaiting Deposit</div>
                </div>
             </div>
          </div>

          {/* State-wide R&R Compliance Roll-up */}
          <div className="bg-[#0B1F35] border border-[#1D5FA8] rounded-xl shadow-sm p-6 text-white flex flex-col justify-center relative overflow-hidden">
            <h2 className="text-lg font-serif font-bold text-[#F2A71B] mb-6 relative z-10">State-Wide R&R Compliance</h2>
            <div className="grid grid-cols-2 gap-6 relative z-10">
              <div>
                <span className="block text-[11px] text-[#9FB0C4] uppercase tracking-wider mb-1">Housing Plots Allocated</span>
                <span className="text-3xl font-bold tracking-wide">4,850</span>
                <span className="text-xs text-green-400 block mt-1">92% of Target</span>
              </div>
              <div>
                <span className="block text-[11px] text-[#9FB0C4] uppercase tracking-wider mb-1">Employment / Annuities</span>
                <span className="text-3xl font-bold tracking-wide">2,140</span>
                <span className="text-xs text-[#F2A71B] block mt-1">65% of Target (Lagging)</span>
              </div>
            </div>
            <button className="mt-6 w-full sm:w-auto bg-[#F2A71B] hover:bg-[#D97706] text-[#0B1F35] font-bold py-2.5 px-6 rounded transition-colors text-sm shadow-sm self-start">
              Generate R&R Audit Report
            </button>
          </div>

        </div>
      </div>
    </div>
  </>);
}
