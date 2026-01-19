import {z} from "zod";
import {BaseModel} from "@/lib/base.model.ts";
import {supabase} from "@/lib/supabase-client.ts";

export const DeviceSchema = z.object({
  id: z.string().uuid().nullish(),
  code: z.string().min(1),
  area: z.string().min(1),
  display_name: z.string().nullish(),
  is_active: z.boolean().default(true),
  is_deleted: z.boolean().default(false),
  created_at: z.iso.datetime({offset: true}).nullish(),
  modified_at: z.iso.datetime({offset: true}).nullish(),
});

export type Device = z.infer<typeof DeviceSchema>;

export class DeviceModel extends BaseModel<typeof DeviceSchema> {
  constructor(id?: string | number) {
    super(supabase, "devices", "/setup", DeviceSchema, id);
  }

  /**
   * Find device by setup code
   */
  async getByCode(code: string): Promise<Device | null> {
    const {data, error} = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("code", code)
      .eq("is_deleted", false)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        return null;
      }
      throw error;
    }

    return this.schema.parse(data);
  }
}
