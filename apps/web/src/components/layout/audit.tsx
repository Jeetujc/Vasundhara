'use client';
import Link from 'next/link';
import React, { useState } from 'react';

export default function Audit() {
  // Input States
  const [landArea, setLandArea] = useState<number | ''>('');
  const [marketRate, setMarketRate] = useState<number | ''>('');
  const [locationType, setLocationType] = useState<'urban' | 'rural'>('rural');
  const [ruralMultiplier, setRuralMultiplier] = useState<number>(1.5);
  const [assetValue, setAssetValue] = useState<number | ''>('');

  // Calculations
  const safeArea = Number(landArea) || 0;
  const safeRate = Number(marketRate) || 0;
  const safeAssets = Number(assetValue) || 0;
  
  const multiplier = locationType === 'urban' ? 1 : ruralMultiplier;
  const baseMarketValue = safeArea * safeRate;
  const multipliedValue = baseMarketValue * multiplier;
  const basicCompensation = multipliedValue + safeAssets;
  const solatium = basicCompensation; // Solatium is 100% of basic compensation
  const finalAward = basicCompensation + solatium;

  // Currency Formatter (Indian Rupees)
  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#FBFAF6] p-6 md:p-12 font-sans text-[#1B2430]">
      
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard/citizen" className="inline-flex items-center text-sm font-bold text-[#1D5FA8] hover:text-[#122C4A] mb-4 transition-colors">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-serif font-bold text-[#122C4A]">Compensation Audit &amp; Calculator</h1>
          <p className="text-[#5B6472] mt-2">
            Transparent calculation based on the RFCTLARR Act, 2013 formula.
          </p>
          <div className="w-[56px] h-[3px] bg-[#F2A71B] mt-4"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT SIDE: INPUT FORM */}
          <div className="bg-white p-8 rounded-md shadow-sm border border-[#DDD8C8]">
            <h2 className="text-xl font-semibold text-[#122C4A] mb-6">Land Details</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#5B6472] mb-1">Land Area (in Hectares)</label>
                <input 
                  type="number" 
                  value={landArea}
                  onChange={(e) => setLandArea(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#1D5FA8] focus:ring-1 focus:ring-[#1D5FA8]"
                  placeholder="e.g., 2.5"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#5B6472] mb-1">Market Rate (per Hectare)</label>
                <input 
                  type="number" 
                  value={marketRate}
                  onChange={(e) => setMarketRate(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#1D5FA8] focus:ring-1 focus:ring-[#1D5FA8]"
                  placeholder="₹ Amount"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#5B6472] mb-2">Location Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="location" 
                      checked={locationType === 'urban'}
                      onChange={() => setLocationType('urban')}
                      className="text-[#1D5FA8] focus:ring-[#1D5FA8]"
                    />
                    <span>Urban (1.0x Multiplier)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="location" 
                      checked={locationType === 'rural'}
                      onChange={() => setLocationType('rural')}
                      className="text-[#1D5FA8] focus:ring-[#1D5FA8]"
                    />
                    <span>Rural (Variable Multiplier)</span>
                  </label>
                </div>
              </div>

              {locationType === 'rural' && (
                <div>
                  <label className="block text-sm font-semibold text-[#5B6472] mb-1">Rural Distance Multiplier</label>
                  <select 
                    value={ruralMultiplier} 
                    onChange={(e) => setRuralMultiplier(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#1D5FA8]"
                  >
                    <option value={1.0}>1.0x (Close to urban limits)</option>
                    <option value={1.5}>1.5x (Moderate distance)</option>
                    <option value={2.0}>2.0x (Far rural area)</option>
                  </select>
                  <p className="text-xs text-gray-400 mt-1">Multiplier is determined by distance from urban limits.</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-[#5B6472] mb-1">Value of Attached Assets (Trees, Buildings)</label>
                <input 
                  type="number" 
                  value={assetValue}
                  onChange={(e) => setAssetValue(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#1D5FA8] focus:ring-1 focus:ring-[#1D5FA8]"
                  placeholder="₹ Amount"
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: AUDIT TRAIL / RESULT */}
          <div className="bg-[#122C4A] text-white p-8 rounded-md shadow-md flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-serif font-semibold text-[#F2A71B] mb-6">Estimated Award Breakdown</h2>
              
              <div className="space-y-4 text-sm border-b border-[#1D5FA8] pb-6 mb-6">
                <div className="flex justify-between">
                  <span className="text-[#9FB0C4]">Base Market Value (Area × Rate)</span>
                  <span className="font-medium">{formatINR(baseMarketValue)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-[#9FB0C4]">Multiplier Applied</span>
                  <span className="font-medium">x {multiplier.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#9FB0C4]">Multiplied Value</span>
                  <span className="font-medium">{formatINR(multipliedValue)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#9FB0C4]">Value of Assets</span>
                  <span className="font-medium">+ {formatINR(safeAssets)}</span>
                </div>
              </div>

              <div className="space-y-4 text-sm border-b border-[#1D5FA8] pb-6 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white">Basic Compensation</span>
                  <span className="font-semibold">{formatINR(basicCompensation)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#9FB0C4]">Solatium (100% of Basic Comp.)</span>
                  <span className="font-semibold text-[#F2A71B]">+ {formatINR(solatium)}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0B1F35] p-5 rounded border border-[#1D5FA8]">
              <div className="text-[#9FB0C4] text-xs font-bold uppercase tracking-wider mb-1">Total Estimated Award</div>
              <div className="text-3xl font-serif font-bold text-white">
                {formatINR(finalAward)}
              </div>
              <p className="text-[10px] text-gray-400 mt-2">
                *This is an estimate. Final awards are subject to District Collector's valuation and actual asset assessment under the Act.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

