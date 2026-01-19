import {z} from 'zod';
import {useMemo} from 'react';
import {
  useMutation,
} from "@tanstack/react-query";
import {toast} from "sonner";
import {ProfileModel} from "@/app/users/model/profile.model.ts";
import {useAuth} from "@/AuthProvider.tsx";
import {FBForm, FormBuilder} from "@/components/formbuilder/form-builder.tsx";
import {
  FBInput
} from "@/components/formbuilder/form-builder-fields-default.tsx";
import {FBSubmit} from "@/components/formbuilder/form-builder-fields-action.tsx";

export default function ProfileDetail() {
  const {profile} = useAuth();
  const profileModel = useMemo(() => new ProfileModel(), []);
  const upsertProfileMutation = useMutation({
    mutationFn: (payload: Partial<z.infer<ProfileModel>>) => {
      return profileModel.upsert(payload)
    },
    onSuccess: () => {
      toast.success(`Profil wurde aktualisiert.`);
    },
  })

  const handleSubmit = async (data: any) => {
    upsertProfileMutation.mutate(data);
  };

  const queryResult = {
    data: profile,
    isLoading: false,
    isError: false,
  }

  return (
      <div className="flex flex-col gap-4">
        <div className="px-4 lg:px-6">
          <FormBuilder baseModel={profileModel} queryResult={queryResult}>
            <FBForm onSubmit={handleSubmit}>
              <div className={"flex gap-4"}>
                <FBInput name="first_name" label="Vorname"/>
                <FBInput name="last_name" label="Nachname"/>
              </div>
              <FBInput name="email" label="E-Mail" placeholder="v.n@hpc.at"/>
              <FBSubmit handleSubmit={handleSubmit}/>
            </FBForm>
          </FormBuilder>
          <div className="flex gap-4">
          </div>
        </div>
      </div>
  );
}