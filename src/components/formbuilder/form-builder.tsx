import {zodResolver} from "@hookform/resolvers/zod"
import {FormProvider, useForm, useFormContext} from "react-hook-form"
import React, {useMemo} from "react"
import {z} from "zod"
import type {NoInfer} from "@tanstack/query-core"
import {FormBuilderSkeleton} from "@/components/skeletons/form-builder-skeleton.tsx";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import type {BaseModel} from "@/lib/base.model.ts";

type Schema = z.ZodObject | z.ZodDiscriminatedUnion<any, any>

export function FormBuilder<
    TQueryFnData = unknown,
    TData = TQueryFnData
>({
    baseModel,
    queryResult,
    children,
  }: {
  baseModel: BaseModel<z.ZodObject | z.ZodDiscriminatedUnion<any, any>>
  queryResult: {
    data: TData;
    isLoading: boolean;
    isError: boolean;
  }
  children: React.ReactNode
}) {
  const {t} = useTranslation("common")
  const navigate = useNavigate()

  const isLoading = queryResult.isLoading
  const isError = queryResult.isError
  const values = queryResult.data

  if (isError) {
    navigate(baseModel.basePath)
  }

  if (isLoading)
    return <FormBuilderSkeleton />

  return <CustomFormProvider schema={baseModel.schema}
                             values={values}>{children}</CustomFormProvider>
}

function CustomFormProvider<
    TQueryFnData = unknown,
    TData = TQueryFnData
>({
    schema,
    values,
    children,
  }: {
  schema: Schema
  values: NoInfer<TData> | undefined
  children: React.ReactNode
}) {
  const defaults = useMemo(() => getDefaultValuesWithFallback(schema), [])
  const form = useForm<z.infer<z.ZodObject>>({
    resolver: zodResolver(schema),
    defaultValues: values || defaults,
  })

  return <FormProvider {...form}>{children}</FormProvider>
}

export function FBForm({onSubmit, children}: {
  onSubmit: (data: z.infer<z.ZodObject>) => void
  children: React.ReactNode
}) {
  const form = useFormContext();

  return <form
      onSubmit={form.handleSubmit(onSubmit, (e) => {
        console.log("error", e)
      })} className="space-y-4">{children}</form>
}

/**
 * Recursively extracts Zod defaults, falling back to a specified value
 * for primitive types that don't have an explicit default.
 * @param schema The Zod schema to inspect.
 * @returns An object containing the derived default values.
 */
const getDefaultValuesWithFallback = (schema: Schema): Record<string, any> => {
  // 1. Handle Discriminated Union (Uses Zod's internal defaults)
  if (schema instanceof z.ZodDiscriminatedUnion) {
    schema = schema._def.options[0]
  }

  // Ensure it's an object before proceeding to shape iteration
  if (!(schema instanceof z.ZodObject)) {
    // Handle non-object types if needed (e.g., return null for z.string)
    return {}
  }

  const defaults: Record<string, any> = {}

  // 2. Iterate over object shape
  for (const [key, fieldSchema] of Object.entries(schema.shape)) {
    let currentSchema = fieldSchema as z.ZodTypeAny

    // Check for explicit Zod Default
    if (currentSchema instanceof z.ZodDefault) {
      defaults[key] = currentSchema.def.defaultValue
    }
    // Handle Nested Objects (Recursion)
    else if (
        currentSchema instanceof z.ZodObject ||
        currentSchema instanceof z.ZodDiscriminatedUnion
    ) {
      defaults[key] = getDefaultValuesWithFallback(currentSchema as Schema)
    }
    // Fallback logic
    else if (currentSchema instanceof z.ZodString) {
      defaults[key] = "" // Your desired fallback for strings
    } else if (currentSchema instanceof z.ZodNumber) {
      defaults[key] = 0 // Common fallback for numbers
    } else if (currentSchema instanceof z.ZodBoolean) {
      defaults[key] = false // Common fallback for booleans
    } else {
      // For any other type (like z.literal, z.date, etc.), leave it undefined
      // RHF usually handles missing default values fine, but they won't
      // appear in the initial defaultValues object.
    }
  }

  return defaults
}
