import {useState, useEffect, useMemo} from "react";
import {useQuery, useMutation} from "@tanstack/react-query";
import {Button} from "@/components/ui/button";
import {Trash2} from "lucide-react";
import {zetApi} from "@/services/zet-api";
import type {DeviceStopLine} from "../model/device-stop-line.model";

interface PreviewDisplayProps {
  configurations: DeviceStopLine[];
  onRemove: (id: string) => void;
}

interface ArrivalInfo {
  minutes: number | null;
  time: string;
  isToday: boolean;
}

/**
 * Calculate minutes until arrival and format time
 */
function calculateArrival(arrivalDateTime: string, currentTime: Date): ArrivalInfo {
  const arrival = new Date(arrivalDateTime);
  const now = currentTime;
  const diffMs = arrival.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  // Check if it's today (same date)
  const isToday = 
    arrival.getDate() === now.getDate() &&
    arrival.getMonth() === now.getMonth() &&
    arrival.getFullYear() === now.getFullYear();

  // Format time as HH:MM
  const timeStr = arrival.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return {
    minutes: diffMinutes >= 0 ? diffMinutes : null,
    time: timeStr,
    isToday,
  };
}

/**
 * Preview display component with black/yellow bus stop styling
 * Shows realtime arrivals fetched every minute
 */
export function PreviewDisplay({configurations, onRemove}: PreviewDisplayProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Try to login when component mounts (for realtime data)
  const loginMutation = useMutation({
    mutationFn: async () => {
      try {
        await zetApi.login();
      } catch (error: any) {
        // Silently fail - will show "No data available" if auth fails
        console.warn("ZET API login failed:", error.message);
      }
    },
  });

  useEffect(() => {
    loginMutation.mutate();
  }, []);

  // Update current time every second for countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (configurations.length === 0) {
    return (
      <div className="bg-black text-yellow-400 p-6 rounded-lg border-2 border-yellow-400">
        <p className="text-center text-lg">No stops configured</p>
        <p className="text-center text-sm text-yellow-500 mt-2">
          Click on a stop on the map to add it
        </p>
      </div>
    );
  }

  return (
    <div className="bg-black text-yellow-400 p-6 rounded-lg border-2 border-yellow-400 space-y-4">
      <h2 className="text-2xl font-bold text-center mb-4 border-b-2 border-yellow-400 pb-2">
        BUS STOP DISPLAY
      </h2>
      <div className="space-y-3">
        {configurations.map((config, index) => {
          const stop = config.stop;
          const line = config.line;

          if (!stop || !line) return null;

          return (
            <StopArrivalDisplay
              key={config.id || index}
              config={config}
              stop={stop}
              line={line}
              onRemove={onRemove}
              currentTime={currentTime}
            />
          );
        })}
      </div>
    </div>
  );
}

/**
 * Component to display arrival information for a single stop-line combination
 */
function StopArrivalDisplay({
  config,
  stop,
  line,
  onRemove,
  currentTime,
}: {
  config: DeviceStopLine;
  stop: NonNullable<DeviceStopLine["stop"]>;
  line: NonNullable<DeviceStopLine["line"]>;
  onRemove: (id: string) => void;
  currentTime: Date;
}) {
  // Fetch incoming trips every minute (refetchInterval: 60000ms)
  const {data: incomingTrips, isLoading} = useQuery({
    queryKey: ["stop-incoming-trips", stop.external_id, line.external_id, line.direction],
    queryFn: async () => {
      if (!stop.external_id) return [];
      try {
        return await zetApi.getStopIncomingTrips(stop.external_id);
      } catch (error) {
        console.error("Error fetching incoming trips:", error);
        return [];
      }
    },
    enabled: !!stop.external_id,
    refetchInterval: 60000, // Refetch every minute
    retry: false,
  });

  // Filter trips for this specific line and direction
  const relevantTrips = useMemo(() => {
    if (!incomingTrips) return [];
    
    return incomingTrips
      .filter((trip: any) => {
        const routeCode = trip.routeShortName || trip.routeCode || trip.route_code || "";
        const headsign = trip.headsign || trip.headSign || trip.direction || "";
        return (
          routeCode.toString() === line.external_id &&
          headsign === line.direction
        );
      })
      .sort((a: any, b: any) => {
        const timeA = new Date(a.expectedArrivalDateTime).getTime();
        const timeB = new Date(b.expectedArrivalDateTime).getTime();
        return timeA - timeB;
      });
  }, [incomingTrips, line.external_id, line.direction]);

  // Get next arrival
  const nextArrival = useMemo(() => {
    if (!relevantTrips || relevantTrips.length === 0) return null;
    
    // Find first arrival that is today and in the future
    for (const trip of relevantTrips) {
      const arrivalInfo = calculateArrival(trip.expectedArrivalDateTime, currentTime);
      
      if (arrivalInfo.isToday && arrivalInfo.minutes !== null && arrivalInfo.minutes >= 0) {
        return {
          trip,
          ...arrivalInfo,
        };
      }
    }
    
    // If no today arrivals, return the first one (might be tomorrow)
    const firstTrip = relevantTrips[0];
    return {
      trip: firstTrip,
      ...calculateArrival(firstTrip.expectedArrivalDateTime, currentTime),
    };
  }, [relevantTrips, currentTime]);

  return (
    <div className="bg-gray-900 p-4 rounded border border-yellow-400/30 flex items-start justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-yellow-400 text-black px-3 py-1 rounded font-bold text-lg min-w-[60px] text-center">
            {line.name}
          </div>
          <div className="text-yellow-400 font-semibold">
            {line.direction}
          </div>
        </div>
        <div className="text-yellow-300 text-sm mb-2">{stop.name}</div>
        
        {isLoading ? (
          <div className="text-yellow-500 text-xs">
            Loading arrivals...
          </div>
        ) : nextArrival ? (
          <div className="space-y-1">
            {nextArrival.isToday && nextArrival.minutes !== null ? (
              <>
                <div className="text-yellow-400 text-lg font-bold">
                  {nextArrival.minutes} min
                </div>
                <div className="text-yellow-500 text-xs">
                  Arrival: <span className="font-mono">{nextArrival.time}</span>
                </div>
              </>
            ) : (
              <div className="text-yellow-500 text-xs">
                No more arrivals today
              </div>
            )}
          </div>
        ) : (
          <div className="text-yellow-500 text-xs">
            No data available
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="text-yellow-400 hover:text-red-400 hover:bg-red-400/10"
        onClick={() => {
          if (config.id) {
            onRemove(config.id);
          }
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
