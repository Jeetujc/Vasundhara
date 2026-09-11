'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../../../components/layout/header';
import { gisService, type GisProjectItem } from '../../../services/gis.service';

export default function GisProjectsPage() {
  const [projects, setProjects] = useState<GisProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await gisService.getProjects();
        setProjects(data || []);
      } catch (err) {
        console.error('Failed to load GIS projects:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
            <Link href="/gis/projects" className="bg-[#1D5FA8] text-white px-3 py-1.5 rounded font-bold transition">
              Project Corridors
            </Link>
            <Link href="/gis/parcels" className="text-gray-300 hover:text-white px-3 py-1.5 rounded transition hover:bg-white/10">
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#122C4A]">Project Spatial Corridors &amp; Right-of-Way (RoW)</h1>
            <p className="text-sm text-[#5B6472] mt-1">
              Georeferenced alignment buffers, statutory chainage boundaries, and cadastral parcel overlays.
            </p>
          </div>
          <Link
            href="/gis"
            className="bg-[#122C4A] hover:bg-[#0B1F35] text-white text-xs font-bold px-4 py-2.5 rounded transition flex items-center gap-1.5 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Open Live Spatial Map
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#DDD8C8] border-t-[#1D5FA8] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-white border border-[#DDD8C8] rounded-xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Mini corridor preview map */}
                  <div className="h-44 bg-[#0B1F35] relative p-4 flex items-center justify-center overflow-hidden border-b border-gray-100">
                    <svg className="w-full h-full" viewBox="0 0 300 150">
                      {/* Alignment Buffer */}
                      <path
                        d="M 20 120 Q 150 40 280 80"
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="24"
                        strokeOpacity="0.3"
                      />
                      {/* Centerline */}
                      <path
                        d="M 20 120 Q 150 40 280 80"
                        fill="none"
                        stroke="#F2A71B"
                        strokeWidth="2"
                        strokeDasharray="6 3"
                      />
                      {/* Waypoint Pegs */}
                      <circle cx="20" cy="120" r="4" fill="#EF4444" />
                      <circle cx="150" cy="55" r="4" fill="#3B82F6" />
                      <circle cx="280" cy="80" r="4" fill="#10B981" />
                    </svg>

                    <span className="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                      RoW Buffer: {proj.bufferWidthMeters}m
                    </span>
                    <span className="absolute top-3 right-3 bg-[#FDF8E3] text-[#B96E22] text-[10px] font-bold px-2 py-0.5 rounded">
                      {proj.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase">
                        {proj.code}
                      </span>
                      <span className="text-xs text-gray-500">
                        {proj.districtName}, {proj.stateName}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#122C4A] mb-2 leading-snug">
                      {proj.name}
                    </h3>

                    <p className="text-xs text-gray-600 line-clamp-2 mb-4">
                      {proj.description || 'Linear corridor project with notified land acquisition alignment.'}
                    </p>

                    <div className="grid grid-cols-3 gap-2 bg-[#FBFAF6] border border-[#DDD8C8] rounded-lg p-2.5 text-center text-xs mb-4">
                      <div>
                        <span className="block text-[10px] text-gray-400 font-bold uppercase">Area</span>
                        <strong className="text-[#122C4A]">{proj.proposedAreaHa} Ha</strong>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-400 font-bold uppercase">Parcels</span>
                        <strong className="text-[#122C4A]">{proj.parcelsCount}</strong>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-400 font-bold uppercase">Families</span>
                        <strong className="text-[#122C4A]">{proj.familiesCount}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-5 pt-0 space-y-2">
                  <Link
                    href={`/gis?projectId=${proj.id}`}
                    className="w-full bg-[#1D5FA8] hover:bg-[#122C4A] text-white text-xs font-bold py-2 rounded text-center block transition shadow-sm"
                  >
                    View on GIS Map
                  </Link>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/projects/${proj.id}/parcels`}
                      className="border border-[#DDD8C8] text-[#122C4A] hover:bg-gray-50 text-xs font-bold py-1.5 px-2 rounded text-center transition"
                    >
                      Parcels List
                    </Link>
                    <Link
                      href={`/projects/${proj.id}/workflow`}
                      className="border border-[#DDD8C8] text-[#122C4A] hover:bg-gray-50 text-xs font-bold py-1.5 px-2 rounded text-center transition"
                    >
                      Workflow
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
