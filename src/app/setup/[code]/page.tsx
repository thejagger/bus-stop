import {useState, useMemo} from "react";
import {useParams} from "react-router-dom";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {CustomMap, type StopMarker} from "@/components/map/custom-map";
import {PreviewDisplay} from "../ui/preview-display";
import {StopSelectorDialog} from "../ui/stop-selector-dialog";
import {DeviceModel} from "../model/device.model";
import {StopModel} from "../model/stop.model";
import {DeviceStopLineModel} from "../model/device-stop-line.model";
import {zetApi} from "@/services/zet-api";
import {toast} from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AlertCircle, Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";
import type {Stop} from "../model/stop.model";

/**
 * Setup page for configuring bus stop display device
 * Route: /setup/:code
 */
export default function SetupPage() {
  const {code} = useParams<{ code: string }>();
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const deviceModel = useMemo(() => new DeviceModel(), []);
  const stopModel = useMemo(() => new StopModel(), []);
  const deviceStopLineModel = useMemo(() => new DeviceStopLineModel(), []);

  // Validate device code
  const {
    data: device,
    isLoading: isLoadingDevice,
    isError: isDeviceError,
  } = useQuery({
    queryKey: ["device-by-code", code],
    queryFn: async () => {
      if (!code) throw new Error("No code provided");
      const device = await deviceModel.getByCode(code);
      if (!device) throw new Error("Invalid device code");
      return device;
    },
    enabled: !!code,
    retry: false,
  });

  // Load stops for the area
  const {
    data: stopsData,
    isLoading: isLoadingStops,
    refetch: refetchStops,
  } = useQuery({
    queryKey: ["stops-by-area", device?.area],
    queryFn: async () => {
      if (!device?.area) return {data: [], count: 0};
      return await stopModel.getByArea(device.area);
    },
    enabled: !!device?.area,
  });

  // Load device configurations
  const {
    data: configurationsData,
    isLoading: isLoadingConfigurations,
    refetch: refetchConfigurations,
  } = useQuery({
    queryKey: ["device-stop-lines", device?.id],
    queryFn: async () => {
      if (!device?.id) return {data: [], count: 0};
      return await deviceStopLineModel.getByDevice(device.id);
    },
    enabled: !!device?.id,
  });

  // Sync stops from ZET API (doesn't require authentication)
  const syncStopsMutation = useMutation({
    mutationFn: async () => {
      if (!device?.area) throw new Error("No area specified");

      toast.info("Syncing stops from ZET API...");

      // Fetch all stops from ZET API (single request)
      const zetStops = await zetApi.getStops();

      // Fetch all existing stops for this area (single query)
      const existingStops = await stopModel.getByArea(device.area);
      const existingExternalIds = new Set(
          existingStops.data.map((stop) => stop.external_id)
      );

      // Filter out stops that already exist and don't have coordinates
      const newStops = zetStops
          .filter((zetStop) => {
            const externalId = zetStop.id.toString();
            return (
                !existingExternalIds.has(externalId) &&
                zetStop.stopLat !== undefined &&
                zetStop.stopLong !== undefined
            );
          })
          .map((zetStop) => ({
            area: device.area,
            external_id: zetStop.id.toString(),
            name: zetStop.name,
            latitude: zetStop.stopLat!,
            longitude: zetStop.stopLong!,
          }));

      // Batch insert all new stops
      let syncedCount = 0;
      if (newStops.length > 0) {
        // Insert in batches to avoid overwhelming the database
        const batchSize = 100;
        for (let i = 0; i < newStops.length; i += batchSize) {
          const batch = newStops.slice(i, i + batchSize);
          try {
            // Use Supabase's insert with multiple rows
            const {error} = await stopModel.supabase
                .from(stopModel.tableName)
                .insert(batch);

            if (error) {
              console.error(`Error inserting batch ${i}-${i + batch.length}:`, error);
            } else {
              syncedCount += batch.length;
            }
          } catch (error) {
            console.error(`Error inserting batch ${i}-${i + batch.length}:`, error);
          }
        }
      }

      toast.success(`Synced ${syncedCount} stops`);
      await refetchStops();
    },
  });

  // Remove configuration
  const removeConfigMutation = useMutation({
    mutationFn: async (configId: string) => {
      await deviceStopLineModel.delete(configId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["device-stop-lines", device?.id]});
      toast.success("Stop removed");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to remove stop");
    },
  });

  // Convert stops to markers
  const stopMarkers: StopMarker[] = useMemo(() => {
    if (!stopsData?.data) return [];
    return stopsData.data.map((stop) => ({
      id: stop.id || "",
      name: stop.name,
      latitude: stop.latitude,
      longitude: stop.longitude,
      external_id: stop.external_id,
    }));
  }, [stopsData]);

  // Handle stop click on map
  const handleStopClick = (stopMarker: StopMarker) => {
    const stop = stopsData?.data.find((s) => s.id === stopMarker.id);
    if (stop) {
      setSelectedStop(stop);
      setDialogOpen(true);
    }
  };

  // Handle successful stop addition
  const handleStopAdded = () => {
    refetchConfigurations();
  };

  // Loading state
  if (isLoadingDevice) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4"/>
            <p className="text-muted-foreground">Validating device code...</p>
          </div>
        </div>
    );
  }

  // Error state
  if (isDeviceError || !device) {
    return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive"/>
                Invalid Device Code
              </CardTitle>
              <CardDescription>
                The device code you entered is not valid.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Please check the code and try again. The code should be displayed on
                  your device.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Header */}
          <Card>
            <CardHeader>
              <CardTitle>Device Setup: {device.display_name || device.code}</CardTitle>
              <CardDescription>
                Area: {device.area.charAt(0).toUpperCase() + device.area.slice(1)}
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Map Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Select Bus Stops</CardTitle>
                    <CardDescription>
                      Click on a stop on the map to add it to your display
                    </CardDescription>
                  </div>
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={() => syncStopsMutation.mutate()}
                      disabled={syncStopsMutation.isPending}
                  >
                    {syncStopsMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2"/>
                          Syncing...
                        </>
                    ) : (
                        "Sync Stops"
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="h-[600px] w-full rounded-lg overflow-hidden border">
                    {isLoadingStops ? (
                        <div className="flex items-center justify-center h-full">
                          <Loader2 className="h-8 w-8 animate-spin"/>
                        </div>
                    ) : (
                        <CustomMap
                            stops={stopMarkers}
                            center={[45.8150, 15.9819]} // Zagreb center
                            zoom={13}
                            onStopClick={handleStopClick}
                            selectedStopId={selectedStop?.id || null}
                            configurations={configurationsData?.data || []}
                        />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview Section */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Preview Display</CardTitle>
                  <CardDescription>
                    This is how your device will look
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingConfigurations ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin"/>
                      </div>
                  ) : (
                      <PreviewDisplay
                          configurations={configurationsData?.data || []}
                          onRemove={(id) => removeConfigMutation.mutate(id)}
                      />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Stop Selector Dialog */}
          {selectedStop && device.id && (
              <StopSelectorDialog
                  open={dialogOpen}
                  onOpenChange={setDialogOpen}
                  stop={selectedStop}
                  deviceId={device.id}
                  onSuccess={handleStopAdded}
              />
          )}
        </div>
      </div>
  );
}
