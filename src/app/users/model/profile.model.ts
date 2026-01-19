import {z} from "zod";
import {BaseModel} from "@/lib/base.model.ts";
import {supabase} from "@/lib/supabase-client.ts";
import {AppError} from "@/lib/app-error.ts";

export const ProfileSchema = z.object({
  id: z.string().nullish(),
  email: z.email({error: 'Bitte gib eine E-Mail ein!'}).default(''),
  password: z.string().min(1).max(32).default(''),
  first_name: z.string().min(1).max(32).default(''),
  last_name: z.string().min(1).max(32).default(''),
  role_id: z.coerce.number().int().min(1).default(0),
  is_active: z.boolean().default(true),
  created_at: z.iso.datetime({offset: true}).nullish(),
  modified_at: z.iso.datetime({offset: true}).nullish(),
});

export type Profile = z.infer<typeof ProfileSchema>;

export class ProfileModel extends BaseModel<typeof ProfileSchema> {
  constructor(id?: string | number) {
    super(supabase, "profile", "/admin/users", ProfileSchema, id);
  }

  async upsert(entity: Partial<Profile>) {
    if (!entity.id) {
      const response = await handleCreateUser(entity.email ?? '', entity.password ?? '')

      this.id = response.user.id
      entity.id = response.user.id
    }

    // @ts-ignore
    this.schema = this.schema.omit({password: true, role: true});

    await super.upsert(entity);
  }
}

const handleCreateUser = async (email: string, password: string) => {
  const {data, error} = await supabase.functions.invoke('create-user', {
    body: {email: email, password: password},
  })

  if (error) {
    throw new AppError(
        'Failed to create user',
        error,
        {tableName: 'profile', operation: 'FETCH'}
    );
  }

  return data;
};