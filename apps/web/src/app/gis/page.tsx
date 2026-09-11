'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Header from '../../components/layout/header';
import {
  gisService,
  type GisParcelFeature,
  type GisProjectItem,
  type GisLayerItem,
  type GisStatsData,
} from '../../services/gis.service';
import { authService, type AuthUser } from '../../services/auth.service';

const InteractiveMap = dynamic(
  () => import('../../components/gis/interactive-map'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-600 gap-3 min-h-[600px]">
        <div className="w-10 h-10 border-4 border-[#DDD8C8] border-t-[#1D5FA8] rounded-full animate-spin" />
        <span className="text-xs font-semibold">Initializing Cartographic Map Canvas (Leaflet / WGS 84)...</span>
      </div>
    ),
  },
);

export default function GisMapPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [projects, setProjects] = useState<GisProjectItem[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [parcels, setParcels] = useState<GisParcelFeature[]>([]);
  const [layers, setLayers] = useState<GisLayerItem[]>([]);
  const [stats, setStats] = useState<GisStatsData | null>(null);
  const [selectedParcel, setSelectedParcel] = useState<GisParcelFeature | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeBasemap, setActiveBasemap] = useState<'osm' | 'satellite'>('osm');
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    'cadastral-parcels': true,
    'project-alignment': true,
    'village-boundaries': true,
    'forest-eco-zone': false,
  });

  const [cursorCoords, setCursorCoords] = useState({ lat: 23.1815, lng: 79.9864 });

  useEffect(() => {
    const session = authService.getSession();
    if (session?.user) {
      setUser(session.user);
    }
  }, []);

  useEffect(() => {
    loadGisData();
  }, [selectedProjectId]);

  const loadGisData = async () => {
    try {
      setLoading(true);
      const [projData, parcelData, layerData, statsData] = await Promise.all([
        gisService.getProjects().catch(() => []),
        gisService.getParcels({
          projectId: selectedProjectId || undefined,
        }).catch(() => ({ type: 'FeatureCollection', features: [] })),
        gisService.getLayers().catch(() => []),
        gisService.getStats().catch(() => null),
      ]);

      setProjects(projData);
      setParcels(parcelData.features || []);
      setLayers(layerData);
      setStats(statsData);

      if (parcelData.features && parcelData.features.length > 0 && !selectedParcel) {
        setSelectedParcel(parcelData.features[0]);
      }
    } catch (err) {
      console.error('Failed to load GIS data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredParcels = useMemo(() => {
    return parcels.filter((p) => {
      const matchesSearch =
        searchQuery === '' ||
        p.properties.parcelNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.properties.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.properties.owner?.name &&
          p.properties.owner.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === '' || p.properties.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [parcels, searchQuery, statusFilter]);

  const toggleLayer = (layerId: string) => {
    setActiveLayers((prev) => ({ ...prev, [layerId]: !prev[layerId] }));
  };

  const handleDownloadGeoJson = (feature: GisParcelFeature) => {
    const jsonStr = JSON.stringify(feature, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Khasra_${feature.properties.parcelNumber.replace(/\//g, '_')}.geojson`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACQUIRED':
        return { fill: '#10B981', stroke: '#047857', bg: 'bg-emerald-100 text-emerald-800' };
      case 'AWARD_DECLARED':
        return { fill: '#F59E0B', stroke: '#B45309', bg: 'bg-amber-100 text-amber-800' };
      case 'NOTIFIED':
        return { fill: '#3B82F6', stroke: '#1D4ED8', bg: 'bg-blue-100 text-blue-800' };
      case 'OBJECTION':
        return { fill: '#EF4444', stroke: '#B91C1C', bg: 'bg-red-100 text-red-800' };
      default:
        return { fill: '#94A3B8', stroke: '#475569', bg: 'bg-slate-100 text-slate-800' };
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFAF6] font-sans text-[#1B2430] flex flex-col">
      <Header />

      {/* Sub-navigation bar for GIS Module */}
      <nav className="bg-[#0E243D] text-white px-8 py-2.5 flex flex-wrap items-center justify-between border-b border-[#1D5FA8]/40 shadow-sm text-xs">
        <div className="flex items-center gap-6">
          <span className="font-bold text-[#F2A71B] uppercase tracking-wider flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            GIS Spatial Portal
          </span>
          <div className="flex items-center gap-1">
            <Link
              href="/gis"
              className="bg-[#1D5FA8] text-white px-3 py-1.5 rounded font-bold transition"
            >
              Interactive Map
            </Link>
            <Link
              href="/gis/projects"
              className="text-gray-300 hover:text-white px-3 py-1.5 rounded transition hover:bg-white/10"
            >
              Project Corridors
            </Link>
            <Link
              href="/gis/parcels"
              className="text-gray-300 hover:text-white px-3 py-1.5 rounded transition hover:bg-white/10"
            >
              Cadastral Parcels
            </Link>
            <Link
              href="/gis/layers"
              className="text-gray-300 hover:text-white px-3 py-1.5 rounded transition hover:bg-white/10"
            >
              Spatial Layers
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user?.role === 'FIELD_OFFICER' && (
            <Link
              href="/dashboard/field"
              className="bg-[#B96E22] hover:bg-[#965516] text-white px-3 py-1.5 rounded font-bold transition flex items-center gap-1"
            >
              ⚡ Field Work Center
            </Link>
          )}
          <Link
            href="/projects"
            className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded transition"
          >
            Projects Directory →
          </Link>
        </div>
      </nav>

      {/* Top Filter & Control Toolbar */}
      <div className="bg-white border-b border-[#DDD8C8] px-6 py-3 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Project Selector */}
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Project:</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="text-xs font-semibold bg-gray-50 border border-[#DDD8C8] rounded px-3 py-1.5 focus:outline-none focus:border-[#1D5FA8]"
            >
              <option value="">All Projects (State-wide)</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.code})
                </option>
              ))}
            </select>
          </div>

          {/* Search by Khasra / Village */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Khasra (e.g. 452/1) or Village..."
              className="text-xs bg-gray-50 border border-[#DDD8C8] rounded pl-8 pr-3 py-1.5 w-60 focus:outline-none focus:border-[#1D5FA8]"
            />
            <svg
              className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-semibold bg-gray-50 border border-[#DDD8C8] rounded px-3 py-1.5 focus:outline-none focus:border-[#1D5FA8]"
            >
              <option value="">All Statuses</option>
              <option value="PROPOSED">Proposed</option>
              <option value="NOTIFIED">Section 11 Notified</option>
              <option value="AWARD_DECLARED">Section 21 Award</option>
              <option value="ACQUIRED">Section 38 Acquired</option>
              <option value="OBJECTION">Objection / Dispute</option>
            </select>
          </div>
        </div>

        {/* Basemap & Mode Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center text-xs font-semibold border border-[#DDD8C8] rounded overflow-hidden bg-gray-100">
            <button
              type="button"
              onClick={() => setActiveBasemap('osm')}
              className={`px-3 py-1.5 transition ${
                activeBasemap === 'osm'
                  ? 'bg-[#122C4A] text-white font-bold'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              🗺️ OpenStreetMap Cadastral
            </button>
            <button
              type="button"
              onClick={() => setActiveBasemap('satellite')}
              className={`px-3 py-1.5 transition ${
                activeBasemap === 'satellite'
                  ? 'bg-[#122C4A] text-white font-bold'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              🛰️ Esri Satellite Imagery
            </button>
          </div>
        </div>
      </div>

      {/* Main Map & Inspection Workspace */}
      <div className="flex-1 flex relative overflow-hidden min-h-[640px]">
        {/* LEFT FLOATING OVERLAY: Layer Toggles & Legend */}
        <div className="absolute left-4 top-4 z-20 w-64 bg-white/95 backdrop-blur-sm border border-[#DDD8C8] rounded-lg shadow-lg p-4 space-y-4">
          <div>
            <h3 className="text-xs font-bold text-[#122C4A] uppercase tracking-wider mb-2 flex items-center justify-between">
              Active Layers
              <span className="text-[10px] text-gray-500 font-normal">WGS 84</span>
            </h3>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeLayers['cadastral-parcels']}
                  onChange={() => toggleLayer('cadastral-parcels')}
                  className="rounded text-[#1D5FA8] focus:ring-0"
                />
                <span className="font-semibold text-gray-800">Cadastral Plots (Khasras)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeLayers['project-alignment']}
                  onChange={() => toggleLayer('project-alignment')}
                  className="rounded text-[#1D5FA8] focus:ring-0"
                />
                <span className="font-semibold text-gray-800">60m RoW Alignment Buffer</span>
              </label>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Map Legend */}
          <div>
            <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
              Acquisition Status
            </h4>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-500"></span>
                <span>Section 38 Acquired</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-amber-500"></span>
                <span>Section 21 Award Declared</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-blue-500"></span>
                <span>Section 11 Preliminary Notified</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-red-500"></span>
                <span>Objection / Claim Lodged</span>
              </div>
            </div>
          </div>

          {stats && (
            <>
              <hr className="border-gray-200" />
              <div className="pt-1">
                <div className="flex justify-between text-[11px] text-gray-500">
                  <span>Digitized Area:</span>
                  <strong className="text-[#122C4A]">{stats.totalMappedAreaHa} Ha</strong>
                </div>
                <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                  <span>GPS Walkovers:</span>
                  <strong className="text-emerald-700">{stats.gpsWalkoverCompletionRate}%</strong>
                </div>
              </div>
            </>
          )}
        </div>

        {/* REAL LEAFLET INTERACTIVE MAP VIEWPORT */}
        <div className="flex-1 relative overflow-hidden bg-slate-100 min-h-[600px]">
          <InteractiveMap
            parcels={filteredParcels}
            projects={projects}
            selectedProjectId={selectedProjectId}
            selectedParcel={selectedParcel}
            onSelectParcel={setSelectedParcel}
            activeBasemap={activeBasemap}
            activeLayers={activeLayers}
            onCursorMove={(lat, lng) => setCursorCoords({ lat, lng })}
          />

          {/* Live Coordinates and Scale Indicator */}
          <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-sm border border-gray-300 rounded px-3 py-1.5 text-[11px] font-mono text-gray-700 shadow-sm flex items-center gap-4">
            <div>
              Lat: <strong className="text-[#122C4A]">{cursorCoords.lat.toFixed(5)}°N</strong> |{' '}
              Lng: <strong className="text-[#122C4A]">{cursorCoords.lng.toFixed(5)}°E</strong>
            </div>
            <div className="text-gray-400">|</div>
            <div className="flex items-center gap-1.5">
              <span className="w-12 h-1 bg-[#122C4A] inline-block"></span>
              <span>WGS 84 Projection</span>
            </div>
          </div>
        </div>

        {/* RIGHT INSPECTION DRAWER: Selected Parcel Details */}
        {selectedParcel && (
          <div className="w-96 bg-white border-l border-[#DDD8C8] shadow-2xl p-6 overflow-y-auto flex flex-col justify-between z-20">
            <div className="space-y-6">
              <div className="flex items-start justify-between border-b border-gray-200 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                        getStatusColor(selectedParcel.properties.status).bg
                      }`}
                    >
                      {selectedParcel.properties.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      ID: {selectedParcel.properties.id.slice(-6)}
                    </span>
                  </div>
                  <h2 className="text-xl font-serif font-bold text-[#122C4A]">
                    Khasra {selectedParcel.properties.parcelNumber}
                  </h2>
                  <p className="text-xs text-gray-500">
                    Survey No: {selectedParcel.properties.surveyNumber}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedParcel(null)}
                  className="text-gray-400 hover:text-gray-600 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Basic Spatial Attributes */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Project</span>
                  <span className="font-semibold text-[#122C4A] text-right">
                    {selectedParcel.properties.projectName || 'NH-44 Highway Widening'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Village / Tehsil</span>
                  <span className="font-semibold text-gray-800">
                    {selectedParcel.properties.village}, {selectedParcel.properties.tehsil}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Acquisition Area</span>
                  <span className="font-bold text-[#122C4A] text-sm">
                    {selectedParcel.properties.areaHa} Hectares
                  </span>
                </div>
              </div>

              {/* Landowner Record */}
              <div className="bg-[#FDF8E3] border border-[#E7DFB8] rounded p-3 text-xs space-y-1.5">
                <h4 className="font-bold text-[#B96E22] uppercase tracking-wider text-[10px]">
                  Landowner & Family
                </h4>
                <div className="font-bold text-[#122C4A] text-sm">
                  {selectedParcel.properties.owner?.name || 'Ramesh Patel'}
                </div>
                <p className="text-gray-600">
                  Contact: {selectedParcel.properties.owner?.contact || '9555555555'}
                </p>
                <p className="text-[11px] text-gray-500 font-mono">
                  Ref: {selectedParcel.properties.owner?.ref || 'FAM-JBP-001'}
                </p>
              </div>

              {/* Compensation & Possession Status */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">
                  Statutory Status
                </h4>
                <div className="bg-gray-50 border border-gray-200 rounded p-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Compensation:</span>
                    <strong className="text-[#122C4A]">
                      {selectedParcel.properties.compensation
                        ? `₹${(selectedParcel.properties.compensation.approvedAmount / 100000).toFixed(1)} Lakh`
                        : '₹80.5 Lakh (Approved)'}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment Stage:</span>
                    <span className="font-semibold text-amber-700">
                      {selectedParcel.properties.compensation?.paymentStatus || 'PENDING'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Possession Record:</span>
                    <span className="font-semibold text-blue-700">
                      {selectedParcel.properties.possession?.status || 'ELIGIBLE'}
                    </span>
                  </div>
                  {selectedParcel.properties.possession?.latitude && (
                    <div className="text-[10px] text-gray-400 font-mono">
                      GPS: {selectedParcel.properties.possession.latitude.toFixed(4)}°N,{' '}
                      {selectedParcel.properties.possession.longitude?.toFixed(4)}°E
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-6 border-t border-gray-200">
              <Link
                href={`/parcels/${selectedParcel.id}`}
                className="w-full bg-[#122C4A] hover:bg-[#0B1F35] text-white text-xs font-bold py-2.5 px-4 rounded text-center block transition shadow-sm"
              >
                View Full Parcel Detail
              </Link>
              {(user?.role === 'FIELD_OFFICER' || user?.role === 'DISTRICT_OFFICER') && (
                <Link
                  href="/dashboard/field"
                  className="w-full bg-[#B96E22] hover:bg-[#965516] text-white text-xs font-bold py-2 px-4 rounded text-center block transition shadow-sm"
                >
                  ⚡ Field Officer Survey Workspace
                </Link>
              )}
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href={`/projects/${selectedParcel.properties.projectId}/overview`}
                  className="border border-[#DDD8C8] text-[#122C4A] hover:bg-gray-50 text-xs font-bold py-2 px-2 rounded text-center transition"
                >
                  Project Overview
                </Link>
                <button
                  onClick={() => handleDownloadGeoJson(selectedParcel)}
                  className="border border-[#1D5FA8] text-[#1D5FA8] hover:bg-blue-50 text-xs font-bold py-2 px-2 rounded transition flex items-center justify-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export GeoJSON
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
