import {z} from "zod";
import {BaseModel, type Relation} from "@/lib/base.model.ts";
import {supabase} from "@/lib/supabase-client.ts";
import {StopModel, StopSchema} from "./stop.model.ts";
import {LineModel, LineSchema} from "./line.model.ts";
import {DeviceModel, DeviceSchema} from "./device.model.ts";

export const DeviceStopLineSchema = z.object({
  id: z.string().uuid().nullish(),
  device_id: z.string().uuid(),
  stop_id: z.string().uuid(),
  line_id: z.string().uuid(),
  display_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
  is_deleted: z.boolean().default(false),
  created_at: z.iso.datetime({offset: true}).nullish(),
  modified_at: z.iso.datetime({offset: true}).nullish(),
  // Relations
  stop: StopSchema.nullish(),
  line: LineSchema.nullish(),
  device: DeviceSchema.nullish(),
});

export type DeviceStopLine = z.infer<typeof DeviceStopLineSchema>;

export class DeviceStopLineModel extends BaseModel<typeof DeviceStopLineSchema> {
  constructor(id?: string | number) {
    const relations: Relation<any>[] = [
      {
        key: "stop",
        nestedModel: new StopModel(),
        isArray: false,
        foreignKey: "stop_id",
      },
      {
        key: "line",
        nestedModel: new LineModel(),
        isArray: false,
        foreignKey: "line_id",
      },
      {
        key: "device",
        nestedModel: new DeviceModel(),
        isArray: false,
        foreignKey: "device_id",
      },
    ];

    super(supabase, "device_stop_lines", "/setup", DeviceStopLineSchema, id, relations);
  }

  /**
   * Get all configurations for a device
   */
  getByDeviceQuery(deviceId: string) {
    return this.getAllQuery("*").eq("device_id", deviceId).order("display_order", {ascending: true});
  }

  /**
   * Get all configurations for a device
   */
  async getByDevice(deviceId: string) {
    const {data, error, count} = await this.getByDeviceQuery(deviceId);

    if (error) {
      throw error;
    }

    const parsedData = z.array(this.schema).parse(data);
    return {data: parsedData, count: count ?? 0};
  }

  /**
   * Check if a device-stop-line combination already exists
   */
  async exists(deviceId: string, stopId: string, lineId: string): Promise<boolean> {
    const {data, error} = await this.supabase
      .from(this.tableName)
      .select("id")
      .eq("device_id", deviceId)
      .eq("stop_id", stopId)
      .eq("line_id", lineId)
      .eq("is_deleted", false)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data !== null;
  }
}
