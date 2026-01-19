import {useEffect, useRef, useState, useMemo, useCallback} from "react";
import {MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Polyline} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import type {DeviceStopLine} from "@/app/setup/model/device-stop-line.model";

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export interface StopMarker {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  external_id?: string;
}

interface CustomMapProps {
  stops: StopMarker[];
  center?: [number, number];
  zoom?: number;
  onStopClick?: (stop: StopMarker) => void;
  selectedStopId?: string | null;
  configurations?: DeviceStopLine[];
}

/**
 * Component to update map bounds when stops change
 */
function MapBoundsUpdater({stops}: {stops: StopMarker[]}) {
  const map = useMap();

  useEffect(() => {
    if (stops.length === 0) return;

    if (stops.length === 1) {
      map.setView([stops[0].latitude, stops[0].longitude], 15);
      return;
    }

    const bounds = L.latLngBounds(
      stops.map((stop) => [stop.latitude, stop.longitude])
    );
    map.fitBounds(bounds, {padding: [50, 50]});
  }, [stops, map]);

  return null;
}

/**
 * Component to track map bounds and filter visible stops
 */
function ViewportFilter({
  stops,
  onVisibleStopsChange,
}: {
  stops: StopMarker[];
  onVisibleStopsChange: (visibleStops: StopMarker[]) => void;
}) {
  const map = useMap();
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);

  useMapEvents({
    moveend: () => {
      setBounds(map.getBounds());
    },
    zoomend: () => {
      setBounds(map.getBounds());
    },
  });

  useEffect(() => {
    // Initialize bounds
    setBounds(map.getBounds());
  }, [map]);

  useEffect(() => {
    if (!bounds) {
      // On initial load, show all stops until bounds are calculated
      onVisibleStopsChange(stops);
      return;
    }

    // Filter stops that are within the visible bounds
    const visibleStops = stops.filter((stop) => {
      const latlng = L.latLng(stop.latitude, stop.longitude);
      return bounds.contains(latlng);
    });

    onVisibleStopsChange(visibleStops);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bounds, stops]);

  return null;
}

/**
 * Custom map component using Leaflet and OpenStreetMap
 */
export function CustomMap({
  stops,
  center = [45.8150, 15.9819], // Default to Zagreb center
  zoom = 13,
  onStopClick,
  selectedStopId,
  configurations = [],
}: CustomMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const [visibleStops, setVisibleStops] = useState<StopMarker[]>(stops);

  // Memoize the callback to prevent unnecessary re-renders
  const handleVisibleStopsChange = useCallback((visibleStops: StopMarker[]) => {
    setVisibleStops(visibleStops);
  }, []);

  // Update visible stops when stops prop changes
  useEffect(() => {
    setVisibleStops(stops);
  }, [stops]);

  // Group configurations by line external_id and direction, then sort by display_order
  const lineRoutes = useMemo(() => {
    if (!configurations || configurations.length === 0) return [];

    // Group by line external_id and direction
    const grouped = new Map<string, DeviceStopLine[]>();
    
    configurations.forEach((config) => {
      if (!config.line || !config.stop) return;
      
      const key = `${config.line.external_id}_${config.line.direction}`;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(config);
    });

    // Sort each group by display_order and create route paths
    const routes: Array<{
      key: string;
      lineName: string;
      direction: string;
      externalId: string;
      positions: [number, number][];
      color: string;
    }> = [];

    // Generate colors for different lines/directions
    const colors = [
      "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF",
      "#FFA500", "#800080", "#FFC0CB", "#A52A2A", "#808080", "#000080"
    ];
    let colorIndex = 0;

    grouped.forEach((configs, key) => {
      // Sort by display_order
      const sorted = [...configs].sort((a, b) => 
        (a.display_order || 0) - (b.display_order || 0)
      );

      // Extract positions
      const positions: [number, number][] = sorted
        .map((config) => {
          if (!config.stop) return null;
          return [config.stop.latitude, config.stop.longitude] as [number, number];
        })
        .filter((pos): pos is [number, number] => pos !== null);

      if (positions.length > 0 && sorted[0].line) {
        const line = sorted[0].line;
        routes.push({
          key,
          lineName: line.name,
          direction: line.direction,
          externalId: line.external_id,
          positions,
          color: colors[colorIndex % colors.length],
        });
        colorIndex++;
      }
    });

    return routes;
  }, [configurations]);

  // Create custom marker icon
  const createCustomIcon = (isSelected: boolean) => {
    return L.divIcon({
      className: "custom-marker",
      html: `<div style="
        width: 24px;
        height: 24px;
        background-color: ${isSelected ? "#FFD700" : "#3B82F6"};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  // Cluster configuration - clusters when zoomed out
  const clusterOptions = useMemo(() => ({
    maxClusterRadius: 80, // Maximum radius that a cluster will cover
    spiderfyOnMaxZoom: true, // When you click a cluster at max zoom, it will spiderfy
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    disableClusteringAtZoom: 15, // Disable clustering when zoomed in (zoom level 15+)
    iconCreateFunction: (cluster: any) => {
      const count = cluster.getChildCount();
      return L.divIcon({
        html: `<div style="
          background-color: #3B82F6;
          color: white;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">${count}</div>`,
        className: "marker-cluster-custom",
        iconSize: L.point(40, 40),
      });
    },
  }), []);

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{height: "100%", width: "100%", zIndex: 0}}
        scrollWheelZoom={true}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBoundsUpdater stops={stops} />
        <ViewportFilter stops={stops} onVisibleStopsChange={handleVisibleStopsChange} />
        {/* Draw line routes */}
        {lineRoutes.map((route) => (
          <Polyline
            key={route.key}
            positions={route.positions}
            pathOptions={{
              color: route.color,
              weight: 4,
              opacity: 0.7,
            }}
          />
        ))}
        <MarkerClusterGroup {...clusterOptions}>
          {visibleStops.map((stop) => {
            const isSelected = selectedStopId === stop.id;
            return (
              <Marker
                key={stop.id}
                position={[stop.latitude, stop.longitude]}
                icon={createCustomIcon(isSelected)}
                eventHandlers={{
                  click: () => {
                    onStopClick?.(stop);
                  },
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold text-sm">{stop.name}</h3>
                    {stop.external_id && (
                      <p className="text-xs text-muted-foreground">
                        ID: {stop.external_id}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
