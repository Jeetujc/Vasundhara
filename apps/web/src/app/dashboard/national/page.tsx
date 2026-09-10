import React from 'react';
import Link from 'next/link';
import Header from '../../../components/layout/header'
export default function NationalDashboard() {
  return ( <>
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
                className="block px-4.5 py-3.5 text-[#EAF0F7] text-[13px] font-semibold tracking-[0.02em] hover:bg-[#0B1F35] transition-colors"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    <div className="min-h-screen bg-[#F8FAFC] pb-14 font-sans text-[#1B2430]">
      
      {/* UNION COMMAND HEADER */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-5 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 shrink-0">
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full block">
                <circle cx="50" cy="50" r="46" fill="none" stroke="#122C4A" strokeWidth="2.5" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="#122C4A" strokeWidth="1.5" />
                <circle cx="50" cy="50" r="4" fill="#122C4A" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#122C4A]">National Master Monitoring System</h1>
              <p className="text-[#5B6472] mt-1 text-sm">
                <strong className="text-[#1B2430]">Government of India</strong> | Department of Land Resources (DoLR)
              </p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
            {/* Live Central Integrations */}
            <div className="flex flex-wrap items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200 w-full md:w-auto">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">NMP Integrations:</span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#122C4A] bg-[#EAF0F7] px-2 py-0.5 rounded">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span> PM Gati Shakti
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#122C4A] bg-[#EAF0F7] px-2 py-0.5 rounded">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> PFMS (Central)
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#122C4A] bg-[#EAF0F7] px-2 py-0.5 rounded">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> e-Courts Grid
              </div>
            </div>
            
            <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#122C4A] text-white hover:bg-[#0B1F35] font-bold py-3 px-6 rounded-lg transition-all shadow-md whitespace-nowrap">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Generate Cabinet Note
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 mt-8 space-y-8">
        
        {/* NATIONAL MACRO KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Central Project Pipeline</span>
            <span className="text-4xl font-serif font-bold text-[#122C4A]">284</span>
            <span className="text-xs text-gray-500 mt-2 block">Linear & Area Mega-Projects</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Aggregate Land Footprint</span>
            <span className="text-4xl font-serif font-bold text-[#122C4A]">1.42M <span className="text-lg font-sans text-gray-400">Ha</span></span>
            <span className="text-xs text-green-600 font-semibold mt-2 block">Across 24 States / UTs</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Central Escrow Disbursed</span>
            <span className="text-4xl font-serif font-bold text-[#122C4A]">₹1.2L <span className="text-lg font-sans text-gray-400">Cr</span></span>
            <span className="text-xs text-green-600 font-semibold mt-2 block">FY 2026-27 Till Date</span>
          </div>
          <div className="bg-[#0B1F35] border border-[#1D5FA8] rounded-xl p-6 shadow-sm relative overflow-hidden">
            <svg className="absolute right-0 bottom-0 w-24 h-24 text-white opacity-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            <span className="block text-xs font-bold text-[#F2A71B] uppercase tracking-wider mb-2">National Capital Blocked</span>
            <span className="text-4xl font-serif font-bold text-white">₹1.8L <span className="text-lg font-sans text-gray-400">Cr</span></span>
            <span className="text-xs text-[#9FB0C4] mt-2 block">Stalled by litigation / clearances</span>
          </div>
        </div>

        {/* INTERSTATE CORRIDOR COMMAND (Full Width) */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-serif font-bold text-[#122C4A]">Interstate Infrastructure Matrix (PM Gati Shakti)</h2>
              <p className="text-xs text-gray-500 mt-1">Cross-jurisdictional bottlenecks for national linear projects.</p>
            </div>
            <button className="text-sm font-bold text-[#1D5FA8] hover:underline bg-white px-4 py-2 rounded border border-gray-200 shadow-sm">
              Open National GIS Masterplan
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-300">
              <thead>
                <tr className="bg-white text-gray-500 text-[11px] uppercase tracking-wider border-b border-gray-200">
                  <th className="px-8 py-4 font-bold">Corridor / Requiring Body</th>
                  <th className="px-6 py-4 font-bold w-[45%]">State-Wise Acquisition Progress (Sec 19 Declarations)</th>
                  <th className="px-6 py-4 font-bold">Primary Blockage</th>
                  <th className="px-8 py-4 font-bold text-right">Escalate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                
                {/* Corridor 1 */}
                <tr className="hover:bg-gray-50 transition">
                  <td className="px-8 py-5">
                    <div className="font-bold text-[#122C4A] text-base">Delhi-Mumbai Expressway</div>
                    <div className="text-xs text-gray-500 mt-1">NHAI • 1,350 km Linear</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <div className="flex justify-between text-[10px] font-bold mb-1"><span className="text-gray-600">HR</span><span className="text-green-600">100%</span></div>
                        <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full w-full"></div></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-[10px] font-bold mb-1"><span className="text-gray-600">RJ</span><span className="text-green-600">92%</span></div>
                        <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full w-[92%]"></div></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-[10px] font-bold mb-1"><span className="text-red-600">MP</span><span className="text-red-600">64%</span></div>
                        <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-red-500 h-2 rounded-full w-[64%]"></div></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-[10px] font-bold mb-1"><span className="text-gray-600">GJ</span><span className="text-[#F2A71B]">81%</span></div>
                        <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-[#F2A71B] h-2 rounded-full w-[81%]"></div></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-[10px] font-bold mb-1"><span className="text-gray-600">MH</span><span className="text-[#F2A71B]">78%</span></div>
                        <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-[#F2A71B] h-2 rounded-full w-[78%]"></div></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-bold border border-red-200">
                      MP: Jhabua Forest Clearance
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="bg-[#122C4A] text-white px-4 py-1.5 rounded text-xs font-bold whitespace-nowrap shadow-sm hover:bg-[#0B1F35]">Route to PMG</button>
                  </td>
                </tr>

                {/* Corridor 2 */}
                <tr className="hover:bg-gray-50 transition">
                  <td className="px-8 py-5">
                    <div className="font-bold text-[#122C4A] text-base">Eastern Dedicated Freight</div>
                    <div className="text-xs text-gray-500 mt-1">DFCCIL • 1,839 km Linear</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <div className="flex justify-between text-[10px] font-bold mb-1"><span className="text-gray-600">PB</span><span className="text-green-600">98%</span></div>
                        <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full w-[98%]"></div></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-[10px] font-bold mb-1"><span className="text-gray-600">UP</span><span className="text-green-600">95%</span></div>
                        <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full w-[95%]"></div></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-[10px] font-bold mb-1"><span className="text-gray-600">BR</span><span className="text-[#F2A71B]">88%</span></div>
                        <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-[#F2A71B] h-2 rounded-full w-[88%]"></div></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-[10px] font-bold mb-1"><span className="text-red-600">WB</span><span className="text-red-600">42%</span></div>
                        <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-red-500 h-2 rounded-full w-[42%]"></div></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="bg-[#FDF8E3] text-[#B96E22] px-3 py-1 rounded text-xs font-bold border border-[#E7DFB8]">
                      WB: State Budget Depletion
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="bg-white border border-gray-300 text-gray-700 px-4 py-1.5 rounded text-xs font-bold whitespace-nowrap shadow-sm hover:bg-gray-50">View Details</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* LOGJAM & STATE EVALUATION ROW (2 Columns) */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* Inter-Ministerial Logjam Clearing House */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 bg-red-50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                <h2 className="text-base font-bold text-red-800">Inter-Ministerial Logjam Queue</h2>
              </div>
              <span className="text-xs font-bold text-red-600 border border-red-200 bg-white px-2 py-1 rounded">14 Active Blocks</span>
            </div>
            <div className="p-2 flex-1">
              <ul className="divide-y divide-gray-100">
                <li className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-[#1B2430]">Delhi-Mumbai E-Way (MP Stretch)</h4>
                    <span className="text-[10px] font-bold text-[#122C4A] bg-gray-200 px-2 py-0.5 rounded">MoEFCC</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">Awaiting Stage-II Forest Clearance in Jhabua district. Stalled for 142 days.</p>
                  <button className="text-xs font-bold bg-[#1D5FA8] hover:bg-[#122C4A] text-white px-3 py-1.5 rounded transition">
                    Push to Cabinet Secretariat
                  </button>
                </li>
                <li className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-[#1B2430]">Kudankulam Power Transmission</h4>
                    <span className="text-[10px] font-bold text-[#122C4A] bg-gray-200 px-2 py-0.5 rounded">MoTA</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">Forest Rights Act (FRA) Gram Sabha resolution dispute in Tamil Nadu.</p>
                  <button className="text-xs font-bold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded transition">
                    Review MoTA Status
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* State Land Acquisition Index & Escrow Depletion */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 bg-[#FDF8E3] flex justify-between items-center">
              <h2 className="text-base font-bold text-[#122C4A]">State Land Acquisition Index (SLAI)</h2>
              <span className="text-xs text-[#5B6472]">FY 2026 Q2 Ranking</span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-center">
              
              {/* Top Performer */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-[#1B2430] flex items-center gap-2">
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 text-xs rounded">#1</span> Madhya Pradesh
                  </span>
                  <span className="text-xs font-bold text-gray-500">Escrow Disbursal: <span className="text-green-600">92%</span></span>
                </div>
                <p className="text-xs text-gray-500">Lowest statutory turnaround time (avg. 280 days). Full DILRMP integration complete.</p>
              </div>

              {/* Average Performer */}
              <div className="mb-6 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-[#1B2430] flex items-center gap-2">
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 text-xs rounded">#12</span> Maharashtra
                  </span>
                  <span className="text-xs font-bold text-gray-500">Escrow Disbursal: <span className="text-[#F2A71B]">68%</span></span>
                </div>
                <p className="text-xs text-gray-500">Moderate R&R compliance. ₹4,500 Cr central funds currently idle in state treasury.</p>
              </div>

              {/* Critical Performer */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-[#1B2430] flex items-center gap-2">
                    <span className="bg-red-100 text-red-700 px-2 py-0.5 text-xs rounded">#27</span> West Bengal
                  </span>
                  <span className="text-xs font-bold text-gray-500">Escrow Disbursal: <span className="text-red-500">31%</span></span>
                </div>
                <p className="text-xs text-gray-500">Severe delays in Sec 19 declarations. Frequent localized litigations stalling central corridors.</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  </>);
}
