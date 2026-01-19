import {z} from "zod";
import {BaseModel} from "@/lib/base.model.ts";
import {supabase} from "@/lib/supabase-client.ts";

export const LineSchema = z.object({
  id: z.string().uuid().nullish(),
  area: z.string().min(1),
  external_id: z.string().min(1),
  name: z.string().min(1),
  direction: z.string().min(1),
  is_active: z.boolean().default(true),
  is_deleted: z.boolean().default(false),
  created_at: z.iso.datetime({offset: true}).nullish(),
  modified_at: z.iso.datetime({offset: true}).nullish(),
});

export type Line = z.infer<typeof LineSchema>;

export class LineModel extends BaseModel<typeof LineSchema> {
  constructor(id?: string | number) {
    super(supabase, "lines", "/setup", LineSchema, id);
  }

  /**
   * Get lines for an area
   */
  getByAreaQuery(area: string) {
    return this.getAllQuery("*").eq("area", area);
  }

  /**
   * Get lines for an area
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
   * Find line by external ID, area, and direction
   */
  async getByExternalIdAndDirection(
    externalId: string,
    area: string,
    direction: string
  ): Promise<Line | null> {
    const {data, error} = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("external_id", externalId)
      .eq("area", area)
      .eq("direction", direction)
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
