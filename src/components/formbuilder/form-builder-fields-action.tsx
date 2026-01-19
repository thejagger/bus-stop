import {useFormContext} from "react-hook-form";
import {z} from "zod";
import {Link, type Path} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button.tsx";

export function FBSubmit({label, handleSubmit}: {
  label?: string,
  handleSubmit: (data: z.infer<z.ZodObject>) => void
}) {
  const {t} = useTranslation('formbuilder');
  const form = useFormContext();

  return <Button onClick={() => {
    console.log(form.getValues());
    form.handleSubmit(handleSubmit)
  }}>{label ?? t('submit')}</Button>
}

export function FBCancel({label, to}: {
  label?: string,
  to: string | Partial<Path>
}) {
  const {t} = useTranslation('formbuilder');

  return <Button variant="outline" asChild><Link
      to={to}>{label ?? t('cancel')}</Link></Button>
}