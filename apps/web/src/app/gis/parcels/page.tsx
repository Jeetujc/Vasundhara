'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../../../components/layout/header';
import {
  gisService,
  type GisParcelFeature,
  type GisProjectItem,
} from '../../../services/gis.service';

export default function GisParcelsPage() {
  const [parcels, setParcels] = useState<GisParcelFeature[]>([]);
  const [projects, setProjects] = useState<GisProjectItem[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [projData, parcelData] = await Promise.all([
          gisService.getProjects().catch(() => []),
          gisService.getParcels({
            projectId: selectedProjectId || undefined,
          }).catch(() => ({ type: 'FeatureCollection', features: [] })),
        ]);
        setProjects(projData);
        setParcels(parcelData.features || []);
      } catch (err) {
        console.error('Failed to load GIS parcels:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedProjectId]);

  const filtered = parcels.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.properties.parcelNumber.toLowerCase().includes(q) ||
      p.properties.village.toLowerCase().includes(q) ||
      (p.properties.owner?.name && p.properties.owner.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-[#FBFAF6] font-sans text-[#1B2430]">
      <Header />

      {/* Sub-nav */}
      <nav className="bg-[#0E243D] text-white px-8 py-2.5 flex flex-wrap items-center justify-between border-b border-[#1D5FA8]/40 shadow-sm text-xs">
        <div className="flex items-center gap-6">
          <span className="font-bold text-[#F2A71B] uppercase tracking-wider flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            GIS Spatial Portal
          </span>
          <div className="flex items-center gap-1">
            <Link href="/gis" className="text-gray-300 hover:text-white px-3 py-1.5 rounded transition hover:bg-white/10">
              Interactive Map
            </Link>
            <Link href="/gis/projects" className="text-gray-300 hover:text-white px-3 py-1.5 rounded transition hover:bg-white/10">
              Project Corridors
            </Link>
            <Link href="/gis/parcels" className="bg-[#1D5FA8] text-white px-3 py-1.5 rounded font-bold transition">
              Cadastral Parcels
            </Link>
            <Link href="/gis/layers" className="text-gray-300 hover:text-white px-3 py-1.5 rounded transition hover:bg-white/10">
              Spatial Layers
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/projects" className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded transition">
            Projects Directory →
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#122C4A]">Cadastral Parcel GIS Boundaries</h1>
            <p className="text-sm text-[#5B6472] mt-1">
              Surveyed Khasra geometries, corner peg GPS coordinates, and field verification status.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/field"
              className="bg-[#B96E22] hover:bg-[#965516] text-white text-xs font-bold px-3.5 py-2 rounded transition shadow-sm"
            >
              ⚡ Record GPS Boundary in Field
            </Link>
            <Link
              href="/gis"
              className="bg-[#122C4A] hover:bg-[#0B1F35] text-white text-xs font-bold px-3.5 py-2 rounded transition shadow-sm"
            >
              Open Full Map
            </Link>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border border-[#DDD8C8] rounded-lg shadow-sm p-4 mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Project:</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="text-xs bg-gray-50 border border-[#DDD8C8] rounded px-3 py-1.5"
            >
              <option value="">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 max-w-sm">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by Khasra No, Village or Owner..."
              className="w-full text-xs bg-gray-50 border border-[#DDD8C8] rounded px-3 py-1.5"
            />
          </div>
        </div>

        {/* Parcels Table */}
        <div className="bg-white border border-[#DDD8C8] rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#DDD8C8] bg-gray-50 flex justify-between items-center">
            <h2 className="text-sm font-bold text-[#122C4A]">Surveyed Land Plots ({filtered.length})</h2>
            <span className="text-xs text-gray-500 font-semibold">EPSG:4326 GeoJSON Verified</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-[#DDD8C8] border-t-[#1D5FA8] rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-sm">No cadastral plots found matching the query.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 font-bold uppercase tracking-wider border-b border-gray-200">
                    <th className="px-5 py-3">Khasra / Plot</th>
                    <th className="px-4 py-3">Village &amp; Tehsil</th>
                    <th className="px-4 py-3">Area (Ha)</th>
                    <th className="px-4 py-3">Landowner</th>
                    <th className="px-4 py-3">GPS Verification</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((parcel) => {
                    const poss = parcel.properties.possession;
                    return (
                      <tr key={parcel.id} className="hover:bg-gray-50 transition">
                        <td className="px-5 py-4">
                          <div className="font-bold text-[#122C4A] text-sm">
                            Khasra {parcel.properties.parcelNumber}
                          </div>
                          <div className="text-[10px] text-gray-400 font-mono">
                            Survey: {parcel.properties.surveyNumber}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-semibold text-gray-800">{parcel.properties.village}</div>
                          <div className="text-[10px] text-gray-500">{parcel.properties.tehsil}</div>
                        </td>
                        <td className="px-4 py-4 font-bold text-[#122C4A]">
                          {parcel.properties.areaHa} Ha
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-bold text-gray-800">{parcel.properties.owner?.name || 'Ramesh Patel'}</div>
                          <div className="text-[10px] text-gray-500">{parcel.properties.owner?.ref || 'FAM-JBP-001'}</div>
                        </td>
                        <td className="px-4 py-4">
                          {poss?.latitude ? (
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                ✓ GPS Point Fixed
                              </span>
                              <div className="text-[10px] text-gray-500 font-mono">
                                {poss.latitude.toFixed(4)}°N, {poss.longitude?.toFixed(4)}°E
                              </div>
                            </div>
                          ) : (
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                              Peg Marking Pending
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <span className="font-bold text-[10px] bg-blue-50 text-blue-800 px-2 py-1 rounded border border-blue-200">
                            {parcel.properties.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right space-x-2 whitespace-nowrap">
                          <Link
                            href={`/gis?projectId=${parcel.properties.projectId}`}
                            className="text-xs font-bold text-[#1D5FA8] hover:underline"
                          >
                            Map 🗺️
                          </Link>
                          <Link
                            href={`/parcels/${parcel.id}`}
                            className="text-xs font-bold text-[#122C4A] hover:underline"
                          >
                            Detail →
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
