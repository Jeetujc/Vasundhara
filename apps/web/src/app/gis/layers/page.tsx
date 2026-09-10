'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../../../components/layout/header';
import { gisService, type GisLayerItem } from '../../../services/gis.service';

export default function GisLayersPage() {
  const [layers, setLayers] = useState<GisLayerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await gisService.getLayers();
        setLayers(data || []);
      } catch (err) {
        console.error('Failed to load GIS layers:', err);
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
            <Link href="/gis/projects" className="text-gray-300 hover:text-white px-3 py-1.5 rounded transition hover:bg-white/10">
              Project Corridors
            </Link>
            <Link href="/gis/parcels" className="text-gray-300 hover:text-white px-3 py-1.5 rounded transition hover:bg-white/10">
              Cadastral Parcels
            </Link>
            <Link href="/gis/layers" className="bg-[#1D5FA8] text-white px-3 py-1.5 rounded font-bold transition">
              Spatial Layers
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/field" className="bg-[#B96E22] hover:bg-[#965516] text-white px-3 py-1.5 rounded font-bold transition flex items-center gap-1">
            ⚡ Field Officer Work Management
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#122C4A]">Spatial Layer Catalog &amp; Cartographic Overlays</h1>
            <p className="text-sm text-[#5B6472] mt-1">
              National land acquisition geodatabase layers, WMS services, and raster basemaps.
            </p>
          </div>
          <Link
            href="/gis"
            className="bg-[#122C4A] hover:bg-[#0B1F35] text-white text-xs font-bold px-4 py-2.5 rounded transition shadow-sm flex items-center gap-1.5"
          >
            🗺️ Open Map with Layers
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#DDD8C8] border-t-[#1D5FA8] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {layers.map((layer) => (
              <div
                key={layer.id}
                className="bg-white border border-[#DDD8C8] rounded-xl shadow-sm p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-[#B96E22] bg-[#FDF8E3] border border-[#E7DFB8] px-2.5 py-0.5 rounded uppercase">
                      {layer.category}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      Type: {layer.type.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#122C4A] mb-2">{layer.name}</h3>

                  <p className="text-xs text-gray-600 mb-4">
                    {layer.attribution || 'Government of India - Department of Land Resources (DoLR)'}
                  </p>

                  <div className="bg-gray-50 border border-gray-200 rounded p-3 space-y-1.5 text-xs mb-4">
                    <div className="flex justify-between text-gray-600">
                      <span>CRS Projection:</span>
                      <strong className="font-mono text-gray-800">EPSG:4326 (WGS 84)</strong>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Default Opacity:</span>
                      <strong className="font-mono text-gray-800">{(layer.opacity * 100).toFixed(0)}%</strong>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Cache Status:</span>
                      <span className="text-emerald-700 font-semibold">Tiled / Instant</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs font-semibold text-gray-500">
                    Active on startup: {layer.active ? 'Yes' : 'No'}
                  </span>
                  <Link
                    href="/gis"
                    className="bg-[#1D5FA8] hover:bg-[#122C4A] text-white text-xs font-bold px-3 py-1.5 rounded transition shadow-sm"
                  >
                    Toggle in Map →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
