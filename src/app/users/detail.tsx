import {FBForm, FormBuilder} from "@/components/formbuilder/form-builder.tsx";
import {
  FBInput,
  FBSelect
} from "@/components/formbuilder/form-builder-fields-default.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useMemo} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {z} from 'zod';
import {toast} from "sonner";
import {ProfileModel} from "@/app/users/model/profile.model.ts";
import {useSelectOptions} from "@/utils/use-select-options.ts";
import {RoleModel, RoleSchema} from "@/app/roles/model/role.model.ts";
import {FBSubmit} from "@/components/formbuilder/form-builder-fields-action.tsx";

export default function UserPageDetail() {
  const navigate = useNavigate();
  const params = useParams();
  const profileModel = useMemo(() => new ProfileModel(params["id"]), [params["id"]]);
  const roleModel = useMemo(() => new RoleModel(), []);

  const queryClient = useQueryClient();
  const upsertProfileMutation = useMutation({
    mutationFn: (payload: Partial<z.infer<ProfileModel>>) => {
      return profileModel.upsert(payload)
    },
    onSuccess: () => {
      navigate(profileModel.basePath);
      queryClient.invalidateQueries({queryKey: [profileModel.tableName]});
      toast.success(`Successfully updated entity`);
    },
  })

  // Load existing profile; BaseModel handles 'new'/null/undefined gracefully
  const queryResult = useQuery({
    queryKey: [profileModel.tableName + '_detail', profileModel.id],
    queryFn: async () => profileModel.loadData(),
    refetchOnWindowFocus: false,
    retry: false,
  })

  const handleSubmit = async (data: any) => {
    upsertProfileMutation.mutate(data);
  };

  const {
    data: options,
    isLoading: roleIsLoading,
    isError: roleIsError
  } = useSelectOptions<z.infer<typeof RoleSchema>>({
    table: roleModel.tableName,
    labelColumn: 'name',
    valueColumn: 'id',
    orderBy: {column: 'name', ascending: true},
  });

  useEffect(() => {
    if (roleIsError) {
      toast.error('Failed to load roles');
    }
  }, [roleIsError]);

  return (
      <div className="flex flex-col gap-4">
        <div className="px-4 lg:px-6">
          <FormBuilder baseModel={profileModel} queryResult={queryResult}>
            <FBForm onSubmit={handleSubmit}>
              <div className={"flex gap-4"}>
                <FBInput name="first_name" label="Vorname"/>
                <FBInput name="last_name" label="Nachname"/>
              </div>
              <div className={"flex gap-4"}>
                <FBInput name="email" label="E-Mail" placeholder="v.n@hpc.at"/>
                <FBInput name="password" label="Password" type="password"
                         placeholder="********"/>
              </div>
              <FBSelect name="role_id" label="Rolle" options={options ?? []}
                        disabled={roleIsLoading}
                        placeholder={roleIsLoading ? 'Loading...' : 'Select role'}/>
              <FBSubmit handleSubmit={handleSubmit}/>
            </FBForm>
          </FormBuilder>
          <div className="flex gap-4">
          </div>
        </div>
      </div>
  );
}
