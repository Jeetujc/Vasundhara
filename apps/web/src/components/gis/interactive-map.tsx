'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { GisParcelFeature, GisProjectItem } from '../../services/gis.service';

interface InteractiveMapProps {
  parcels: GisParcelFeature[];
  projects: GisProjectItem[];
  selectedProjectId: string;
  selectedParcel: GisParcelFeature | null;
  onSelectParcel: (parcel: GisParcelFeature) => void;
  activeBasemap: 'osm' | 'satellite';
  activeLayers: Record<string, boolean>;
  onCursorMove?: (lat: number, lng: number) => void;
}

export default function InteractiveMap({
  parcels,
  projects,
  selectedProjectId,
  selectedParcel,
  onSelectParcel,
  activeBasemap,
  activeLayers,
  onCursorMove,
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const geojsonLayerRef = useRef<any>(null);
  const corridorLayerRef = useRef<any>(null);

  const [mapReady, setMapReady] = useState(false);

  // Initialize Leaflet Map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isMounted = true;

    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Fix Leaflet default icon paths in Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      if (!mapInstanceRef.current) {
        // Center on Madhya Pradesh / Jabalpur
        const map = L.map(mapContainerRef.current, {
          center: [23.1815, 79.9864],
          zoom: 13,
          zoomControl: true,
        });

        map.on('mousemove', (e: any) => {
          if (onCursorMove) {
            onCursorMove(Number(e.latlng.lat.toFixed(5)), Number(e.latlng.lng.toFixed(5)));
          }
        });

        mapInstanceRef.current = map;
        setMapReady(true);
      }
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer (OSM vs Satellite)
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    import('leaflet').then((L) => {
      const map = mapInstanceRef.current;
      if (tileLayerRef.current) {
        map.removeLayer(tileLayerRef.current);
      }

      if (activeBasemap === 'satellite') {
        tileLayerRef.current = L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            maxZoom: 19,
          },
        ).addTo(map);
      } else {
        tileLayerRef.current = L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
          },
        ).addTo(map);
      }
    });
  }, [activeBasemap, mapReady]);

  // Update Vector Parcel Polygons
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    import('leaflet').then((L) => {
      const map = mapInstanceRef.current;

      // Remove existing geojson layer
      if (geojsonLayerRef.current) {
        map.removeLayer(geojsonLayerRef.current);
        geojsonLayerRef.current = null;
      }

      if (!activeLayers['cadastral-parcels'] || parcels.length === 0) {
        return;
      }

      const getStyle = (feature: any) => {
        const status = feature?.properties?.status;
        const isSelected = selectedParcel?.id === feature?.properties?.id;

        let color = '#3B82F6';
        let fillColor = '#3B82F6';

        if (status === 'ACQUIRED') {
          color = '#047857';
          fillColor = '#10B981';
        } else if (status === 'AWARD_DECLARED') {
          color = '#B45309';
          fillColor = '#F59E0B';
        } else if (status === 'OBJECTION') {
          color = '#B91C1C';
          fillColor = '#EF4444';
        }

        return {
          color: isSelected ? '#122C4A' : color,
          weight: isSelected ? 3.5 : 2,
          fillColor,
          fillOpacity: isSelected ? 0.6 : 0.35,
        };
      };

      const geojsonFeatureCollection = {
        type: 'FeatureCollection' as const,
        features: parcels,
      };

      const geoLayer = L.geoJSON(geojsonFeatureCollection as any, {
        style: getStyle,
        onEachFeature: (feature: any, layer: any) => {
          const p = feature.properties;
          const popupContent = `
            <div style="font-family: sans-serif; font-size: 12px; min-width: 180px;">
              <strong style="color: #122C4A; font-size: 13px;">Khasra ${p.parcelNumber}</strong><br/>
              <span style="color: #64748B;">Village: ${p.village || 'Rau / Panagar'}</span><br/>
              <span style="color: #64748B;">Area: ${p.areaHa || 1.0} Ha</span><br/>
              <span style="display: inline-block; margin-top: 4px; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 10px; background: #E2E8F0; color: #1E293B;">
                ${p.status ? p.status.replace(/_/g, ' ') : 'PROPOSED'}
              </span>
            </div>
          `;
          layer.bindPopup(popupContent);

          layer.on({
            click: () => {
              onSelectParcel(feature);
            },
            mouseover: (e: any) => {
              e.target.setStyle({ weight: 4, fillOpacity: 0.7 });
            },
            mouseout: (e: any) => {
              geoLayer.resetStyle(e.target);
            },
          });
        },
      }).addTo(map);

      geojsonLayerRef.current = geoLayer;

      // Automatically Fit Bounds to show all parcels
      if (geoLayer.getBounds().isValid()) {
        map.fitBounds(geoLayer.getBounds(), {
          padding: [50, 50],
          maxZoom: 16,
        });
      }
    });
  }, [parcels, selectedParcel, activeLayers, mapReady]);

  // Update Project Corridors
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    import('leaflet').then((L) => {
      const map = mapInstanceRef.current;

      if (corridorLayerRef.current) {
        map.removeLayer(corridorLayerRef.current);
        corridorLayerRef.current = null;
      }

      if (!activeLayers['project-alignment']) return;

      const activeProjectList = selectedProjectId
        ? projects.filter((p) => p.id === selectedProjectId)
        : projects;

      const layerGroup = L.layerGroup();

      activeProjectList.forEach((proj) => {
        if (proj.corridorGeometry?.coordinates) {
          const latLngs = proj.corridorGeometry.coordinates.map((c: any) => [c[1], c[0]]);

          // Draw RoW Corridor buffer line
          const line = L.polyline(latLngs, {
            color: '#1D5FA8',
            weight: 6,
            opacity: 0.6,
            dashArray: '10 8',
          });

          line.bindPopup(`
            <div style="font-family: sans-serif; font-size: 12px;">
              <strong style="color: #122C4A;">${proj.name}</strong><br/>
              <span>60m Standard RoW Alignment</span><br/>
              <span style="color: #B96E22; font-weight: bold;">${proj.proposedAreaHa} Ha Corridor</span>
            </div>
          `);

          layerGroup.addLayer(line);
        }
      });

      layerGroup.addTo(map);
      corridorLayerRef.current = layerGroup;
    });
  }, [projects, selectedProjectId, activeLayers, mapReady]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainerRef} className="w-full h-full min-h-[500px]" />
    </div>
  );
}
