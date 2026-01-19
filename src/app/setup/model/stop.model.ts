import {z} from "zod";
import {BaseModel} from "@/lib/base.model.ts";
import {supabase} from "@/lib/supabase-client.ts";

export const StopSchema = z.object({
  id: z.string().uuid().nullish(),
  area: z.string().min(1),
  external_id: z.string().min(1),
  name: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  is_active: z.boolean().default(true),
  is_deleted: z.boolean().default(false),
  created_at: z.iso.datetime({offset: true}).nullish(),
  modified_at: z.iso.datetime({offset: true}).nullish(),
});

export type Stop = z.infer<typeof StopSchema>;

export class StopModel extends BaseModel<typeof StopSchema> {
  constructor(id?: string | number) {
    super(supabase, "stops", "/setup", StopSchema, id);
  }

  /**
   * Get all stops for an area
   */
  getByAreaQuery(area: string) {
    return this.getAllQuery("*").eq("area", area);
  }

  /**
   * Get all stops for an area
   */
  async getByArea(area: string) {
    const {data, error, count} = await this.getByAreaQuery(area);

    if (error) {
      throw error;
    }

    const parsedData = z.array(this.schema).parse(data);
    return {data: parsedData, count: count ?? 0};
  }

  /**
   * Find stop by external ID and area
   */
  async getByExternalId(externalId: string, area: string): Promise<Stop | null> {
    const {data, error} = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("external_id", externalId)
      .eq("area", area)
      .eq("is_deleted", false)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }

    return this.schema.parse(data);
  }
}
