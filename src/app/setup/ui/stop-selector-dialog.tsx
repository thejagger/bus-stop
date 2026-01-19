import {useState, useMemo, useEffect} from "react";
import {useQuery, useMutation} from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {zetApi} from "@/services/zet-api";
import type {Stop} from "../model/stop.model";
import {LineModel} from "../model/line.model";
import {DeviceStopLineModel} from "../model/device-stop-line.model";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AlertCircle, Loader2} from "lucide-react";

interface StopSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stop: Stop | null;
  deviceId: string;
  onSuccess: () => void;
}


/**
 * Stop selector dialog component
 * Allows selecting a line and direction for a stop
 */
export function StopSelectorDialog({
  open,
  onOpenChange,
  stop,
  deviceId,
  onSuccess,
}: StopSelectorDialogProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const lineModel = useMemo(() => new LineModel(), []);
  const deviceStopLineModel = useMemo(() => new DeviceStopLineModel(), []);

  // Try to login when dialog opens
  const loginMutation = useMutation({
    mutationFn: async () => {
      await zetApi.login();
      setIsAuthenticated(true);
    },
    onError: (error: any) => {
      setIsAuthenticated(false);
      if (!error.message?.includes("credentials not found")) {
        console.error("Login error:", error);
      }
    },
  });

  // Check authentication status when dialog opens
  useEffect(() => {
    if (open) {
      loginMutation.mutate();
    } else {
      // Reset authentication state when dialog closes
      setIsAuthenticated(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Update current time every second for countdown
  useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [open]);

  // Fetch incoming trips for the stop to get available lines (requires authentication)
  const {data: incomingTrips, isLoading: isLoadingTrips} = useQuery({
    queryKey: ["stop-incoming-trips", stop?.external_id],
    queryFn: async () => {
      if (!stop?.external_id) return [];
      if (!isAuthenticated) {
        throw new Error("Authentication required for realtime data");
      }
      return await zetApi.getStopIncomingTrips(stop.external_id);
    },
    enabled: open && !!stop?.external_id && isAuthenticated,
    retry: false,
  });

  // Load lines from database for the stop's area (fallback)
  const {data: linesData, isLoading: isLoadingLines} = useQuery({
    queryKey: ["lines-by-area", stop?.area],
    queryFn: async () => {
      if (!stop?.area) return {data: [], count: 0};
      return await lineModel.getByArea(stop.area);
    },
    enabled: open && !!stop?.area,
  });

  /**
   * Calculate minutes until arrival
   */
  const calculateMinutesUntilArrival = (arrivalDateTime: string): number | null => {
    const arrival = new Date(arrivalDateTime);
    const now = currentTime;
    const diffMs = arrival.getTime() - now.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return diffMinutes >= 0 ? diffMinutes : null;
  };

  // Extract unique lines with their next arrival times from incoming trips
  const lineListWithArrivals = useMemo(() => {
    if (!incomingTrips || incomingTrips.length === 0) {
      // Fallback to database lines if no realtime data
      if (!linesData?.data) return [];
      return linesData.data.map((line) => ({
        name: line.name,
        direction: line.direction,
        routeCode: line.external_id,
        lineId: line.id!,
        nextArrivalMinutes: null,
        isArrivingNow: false,
        isFromDatabase: true,
      }));
    }

    const lineMap = new Map<string, {
      name: string;
      direction: string;
      routeCode: string;
      trips: any[];
    }>();

    // Group trips by line and direction
    incomingTrips.forEach((trip: any) => {
      const routeCode = trip.routeShortName?.toString() || trip.routeCode?.toString() || trip.route_code?.toString() || trip.route?.code?.toString() || trip.lineId?.toString() || "";
      const headsign = trip.headsign || trip.headSign || trip.direction || "Unknown";
      
      if (routeCode && routeCode.trim() !== "") {
        const key = `${routeCode}_${headsign}`;
        if (!lineMap.has(key)) {
          lineMap.set(key, {
            name: routeCode,
            direction: headsign,
            routeCode: routeCode,
            trips: [],
          });
        }
        lineMap.get(key)!.trips.push(trip);
      }
    });

    // Calculate next arrival for each line
    return Array.from(lineMap.values()).map((line) => {
      // Sort trips by arrival time
      const sortedTrips = [...line.trips].sort((a, b) => {
        const timeA = new Date(a.expectedArrivalDateTime).getTime();
        const timeB = new Date(b.expectedArrivalDateTime).getTime();
        return timeA - timeB;
      });

      // Find first arrival that is today and in the future
      let nextArrivalMinutes: number | null = null;
      let isArrivingNow = false;

      for (const trip of sortedTrips) {
        const arrival = new Date(trip.expectedArrivalDateTime);
        const arrivalInfo = calculateMinutesUntilArrival(trip.expectedArrivalDateTime);
        
        // Check if it's today
        const isToday = 
          arrival.getDate() === currentTime.getDate() &&
          arrival.getMonth() === currentTime.getMonth() &&
          arrival.getFullYear() === currentTime.getFullYear();

        if (isToday && arrivalInfo !== null && arrivalInfo >= 0) {
          nextArrivalMinutes = arrivalInfo;
          // Show "*" if arriving within 1 minute
          isArrivingNow = arrivalInfo <= 1;
          break;
        }
      }

      return {
        name: line.name,
        direction: line.direction,
        routeCode: line.routeCode,
        lineId: null, // Will be created/looked up when selected
        nextArrivalMinutes,
        isArrivingNow,
        isFromDatabase: false,
      };
    }).sort((a, b) => {
      // Sort by arrival time (arriving now first, then by minutes)
      if (a.isArrivingNow && !b.isArrivingNow) return -1;
      if (!a.isArrivingNow && b.isArrivingNow) return 1;
      if (a.nextArrivalMinutes === null && b.nextArrivalMinutes !== null) return 1;
      if (a.nextArrivalMinutes !== null && b.nextArrivalMinutes === null) return -1;
      if (a.nextArrivalMinutes !== null && b.nextArrivalMinutes !== null) {
        return a.nextArrivalMinutes - b.nextArrivalMinutes;
      }
      return 0;
    });
  }, [incomingTrips, linesData, currentTime]);

  const handleLineSelect = async (lineItem: typeof lineListWithArrivals[0]) => {
    if (!stop) return;

    try {
      let lineId = lineItem.lineId;

      // If this is a realtime line (not yet in database), create it first
      if (!lineItem.isFromDatabase && !lineId) {
        // Check if line exists in database
        let line = await lineModel.getByExternalIdAndDirection(
          lineItem.routeCode,
          stop.area,
          lineItem.direction
        );

        // If not exists, create it
        if (!line) {
          const newLine = await lineModel.upsert({
            area: stop.area,
            external_id: lineItem.routeCode,
            name: lineItem.name,
            direction: lineItem.direction,
          });
          line = newLine as any;
        }

        if (!line?.id) {
          toast.error("Failed to create line in database");
          return;
        }

        lineId = line.id;
      }

      if (!lineId) {
        toast.error("Invalid line selected");
        return;
      }

      // Check if combination already exists
      const exists = await deviceStopLineModel.exists(deviceId, stop.id!, lineId);
      if (exists) {
        toast.error("This stop and line combination is already configured");
        return;
      }

      // Get current configurations to determine display order
      const {data: existingConfigs} = await deviceStopLineModel.getByDevice(deviceId);
      const displayOrder = existingConfigs.length;

      // Create new configuration
      await deviceStopLineModel.upsert({
        device_id: deviceId,
        stop_id: stop.id!,
        line_id: lineId,
        display_order: displayOrder,
      });

      toast.success("Stop added successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error adding stop:", error);
      toast.error(error.message || "Failed to add stop");
    }
  };

  if (!stop) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Select Line for {stop.name}</DialogTitle>
          <DialogDescription>
            Choose a line and direction to display on this device
          </DialogDescription>
        </DialogHeader>

        {!isAuthenticated && !loginMutation.isPending && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              <p>
                Failed to fetch realtime line data. Please try again later.
              </p>
            </AlertDescription>
          </Alert>
        )}

        {loginMutation.isPending ? (
          <div className="py-8 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p className="text-muted-foreground">Authenticating...</p>
          </div>
        ) : isLoadingTrips ? (
          <div className="py-8 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p className="text-muted-foreground">Loading realtime line data...</p>
          </div>
        ) : isLoadingLines ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Loading available lines...</p>
          </div>
        ) : lineListWithArrivals.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <p className="text-muted-foreground">
              {isAuthenticated 
                ? "No lines available for this stop at the moment."
                : "No lines available. Realtime data requires authentication, or you can add lines manually to the database."}
            </p>
            {!isAuthenticated && (
              <p className="text-sm text-muted-foreground">
                Falling back to database lines...
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {lineListWithArrivals.map((lineItem, index) => (
              <button
                key={`${lineItem.routeCode}_${lineItem.direction}_${index}`}
                type="button"
                onClick={() => handleLineSelect(lineItem)}
                className="w-full text-left p-3 rounded-lg border border-border hover:bg-accent hover:border-accent-foreground/20 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="bg-primary text-primary-foreground px-3 py-1 rounded font-bold text-lg min-w-[50px] text-center shrink-0">
                      {lineItem.name}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{lineItem.direction}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {lineItem.isArrivingNow ? (
                      <span className="text-lg font-bold text-primary">*</span>
                    ) : lineItem.nextArrivalMinutes !== null ? (
                      <span className="text-sm font-mono">
                        {lineItem.nextArrivalMinutes} min
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
            <div className="flex gap-2 justify-end mt-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
