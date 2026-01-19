import {Controller, useFormContext} from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError, FieldGroup,
  FieldLabel, FieldLegend, FieldSet
} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";
import {Switch} from "@/components/ui/switch.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover.tsx";
import {
  Command,
  CommandEmpty, CommandGroup,
  CommandInput, CommandItem,
  CommandList
} from "@/components/ui/command.tsx";
import {CalendarIcon, Check, ChevronsUpDown, XIcon} from "lucide-react";
import {useId, useState} from "react";
import {cn} from "@/lib/utils.ts";
import {format, parse} from "date-fns"
import {Calendar} from "@/components/ui/calendar.tsx";
import {useTranslation} from "react-i18next";
import {Badge} from "@/components/ui/badge.tsx";

interface FieldProps {
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  legend?: string;
  type?: string;
  disabled?: boolean;
}

export function FBHiddenInput({name, value}: { name: string, value: string | number }) {
  const {control} = useFormContext();

  return <Controller
      name={name}
      defaultValue={value}
      control={control}
      render={({field, fieldState}) => (
          <Input
              type={"hidden"}
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              autoComplete="off"
          />
      )}
  />
}

export function FBInput({name, label, type = 'text', placeholder}: FieldProps) {
  const {control} = useFormContext();

  return <Controller
      name={name}
      control={control}
      render={({field, fieldState}) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              {label}
            </FieldLabel>
            <Input
                type={type}
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder={placeholder || label}
                autoComplete="one-time-code"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
          </Field>
      )}
  />
}

export function FBTextArea({name, label, placeholder, description}: FieldProps) {
  const {control} = useFormContext();

  return <Controller
      name={name}
      control={control}
      render={({field, fieldState}) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            <Textarea
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder={placeholder || label}
                className="min-h-[120px]"
            />
            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
          </Field>
      )}
  />
}

export function FBSelect({
                           name,
                           label,
                           placeholder,
                           description,
                           options,
                           disabled
                         }: FieldProps & {
  options: { label: string, value: any }[]
}) {
  const {control} = useFormContext();

  return <Controller
      name={name}
      control={control}
      render={({field, fieldState}) => {
        const fieldValue = field.value ? field.value.toString() : null;

        return <Field orientation="responsive" data-invalid={fieldState.invalid}>
          <FieldContent>
            <FieldLabel htmlFor={field.name}>
              {label}
            </FieldLabel>
            {description && <FieldDescription>{description}</FieldDescription>}
          </FieldContent>
          <Select
              disabled={disabled}
              name={field.name}
              value={fieldValue}
              onValueChange={field.onChange}
          >
            <SelectTrigger
                id={field.name}
                aria-invalid={fieldState.invalid}
                className="min-w-[120px]"
            >
              <SelectValue placeholder={placeholder || label}/>
            </SelectTrigger>
            <SelectContent position="item-aligned">
              {options.map(({label, value}) => (
                  <SelectItem value={value.toString()}
                              key={value.toString()}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
        </Field>
      }}
  />
}

export function FBCombobox({
                             name,
                             label,
                             placeholder,
                             description,
                             options,
                             disabled,
                             modal
                           }: FieldProps & {
  options: { label: string, value: string }[]
  modal?: boolean
}) {
  const {t} = useTranslation('formbuilder');
  const {control} = useFormContext();
  const [open, setOpen] = useState(false)

  return <Controller
      name={name}
      control={control}
      render={({field, fieldState}) => {
        const fieldValue = field.value ? field.value.toString() : null;

        return <Field orientation="responsive" data-invalid={fieldState.invalid}>
          <FieldContent>
            <FieldLabel htmlFor={name}>
              {label}
            </FieldLabel>
            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
          </FieldContent>
          <Popover open={open} onOpenChange={setOpen} modal={modal}>
            <PopoverTrigger asChild>
              <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between"
                  disabled={disabled}
              >
                {fieldValue
                    ? options.find((option) => option.value.toString() === fieldValue)?.label
                    : placeholder}
                <ChevronsUpDown className="opacity-50"/>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" side="bottom" align="center">
              <Command>
                <CommandInput placeholder={t('search')} className="h-9"/>
                <CommandList>
                  <CommandEmpty>No Results found.</CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => {
                      return <CommandItem
                          key={option.value.toString()}
                          value={option.value.toString()}
                          keywords={[option.label]}
                          onSelect={(currentValue) => {
                            field.onChange(currentValue === fieldValue ? null : currentValue)
                            setOpen(false)
                          }}
                      >
                        {option.label}
                        <Check
                            className={cn(
                                "ml-auto",
                                (fieldValue === option.value.toString()) ? "opacity-100" : "opacity-0"
                            )}
                        />
                      </CommandItem>
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </Field>
      }}
  />
}

export function FBCheckbox({name, label, legend, description}: FieldProps) {
  const {control} = useFormContext();

  return <Controller
      name={name}
      control={control}
      render={({field, fieldState}) => (
          <FieldSet>
            {legend && <FieldLegend variant="label">{legend}</FieldLegend>}
            {description && <FieldDescription>{description}</FieldDescription>}
            <FieldGroup data-slot="checkbox-group">
              <Field orientation="horizontal">
                <Checkbox
                    id={name}
                    name={name}
                    aria-invalid={fieldState.invalid}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                />
                <FieldLabel
                    htmlFor={name}
                    className="font-normal"
                >
                  {label}
                </FieldLabel>
              </Field>
            </FieldGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
          </FieldSet>
      )}
  />
}

export function FBRadio({name, label, description, options}: FieldProps & {
  options: { label: string, value: string, description?: string }[]
}) {
  const {control} = useFormContext();

  return <Controller
      name={name}
      control={control}
      render={({field, fieldState}) => (
          <FieldSet>
            <FieldLegend>{label}</FieldLegend>
            <FieldDescription>{description}</FieldDescription>
            <RadioGroup
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
                className="flex flex-row space-x-4"
            >
              {options.map((option) => (
                  <div key={`div-${option.value}`}
                       className="flex items-center space-x-2">
                    <RadioGroupItem
                        id={`radiogroup-${field.name}-${option.value}`}
                        value={option.value}
                        aria-invalid={fieldState.invalid}/>
                    <FieldLabel key={option.value}
                                htmlFor={`radiogroup-${field.name}-${option.value}`}>{option.label}</FieldLabel>
                  </div>
              ))}
            </RadioGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
          </FieldSet>
      )}
  />
}

export function FBSwitch({name, label, description}: FieldProps) {
  const {control} = useFormContext();

  return <Controller
      name={name}
      control={control}
      render={({field, fieldState}) => (
          <Field orientation="horizontal" data-invalid={fieldState.invalid}>
            <FieldContent>
              <FieldLabel htmlFor={field.name}>
                {label}
              </FieldLabel>
              <FieldDescription>
                {description}
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
            </FieldContent>
            <Switch
                id={field.name}
                name={field.name}
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-invalid={fieldState.invalid}
            />
          </Field>
      )}
  />
}

export function FBDatePicker({name, label, placeholder}: FieldProps) {
  const {t} = useTranslation('formbuilder');
  const {control} = useFormContext();

  return <Controller
      name={name}
      control={control}
      render={({field, fieldState}) => {
        const dateValue = field.value ? parse(field.value, 'yyyy-MM-dd', new Date()) : undefined;

        const [open, setOpen] = useState(false)
        const [month, setMonth] = useState<Date | undefined>(dateValue)

        return <Field data-invalid={fieldState.invalid} className="w-fit">
          <FieldLabel htmlFor={field.name}>
            {label}
          </FieldLabel>
          <div className="relative flex gap-2">
            <Input
                {...field}
                id={field.name}
                type="date"
                aria-invalid={fieldState.invalid}
                placeholder={placeholder || label}
                autoComplete="off"
                onChange={(e) => {
                  field.onChange(e.target.value)
                  const date = parse(e.target.value, 'yyyy-MM-dd', new Date())

                  if (!isNaN(date.getTime())) {
                    setMonth(date)
                  }
                }}
            />
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                    id={`date-picker-${field.name}`}
                    variant="default"
                    className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                >
                  <CalendarIcon className="size-3.5"/>
                  <span className="sr-only">{t('select_date')}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="end"
                  alignOffset={-8}
                  sideOffset={10}
              >
                <Calendar
                    mode="single"
                    selected={month}
                    captionLayout="dropdown"
                    month={month}
                    onMonthChange={setMonth}
                    onSelect={(date) => {
                      field.onChange(date ? format(date, 'yyyy-MM-dd') : undefined)
                      setOpen(false)
                    }}
                />
              </PopoverContent>
            </Popover>
          </div>
          {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
        </Field>
      }}
  />
}

export function FBMultiCombobox({
                                  name,
                                  label,
                                  placeholder,
                                  description,
                                  valueKey,
                                  options,
                                  disabled,
                                  modal,
                                  maxShownItems = 2
                                }: FieldProps & {
  options: { label: string, value: string }[]
  valueKey: string
  modal?: boolean
  maxShownItems?: number
}) {
  const {t} = useTranslation('formbuilder');
  const {control} = useFormContext();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return <Controller
      name={name}
      control={control}
      defaultValue={[]}
      render={({field, fieldState}) => {
        // Extract values from array of objects or handle string array
        const selectedValues = Array.isArray(field.value)
            ? field.value
                .filter(item => item != null)
                .map((item: any) => {
                  if (typeof item === 'string') return item;
                  if (typeof item === 'object' && item[valueKey]) return String(item[valueKey]);
                  return null;
                })
                .filter((v): v is string => v !== null)
            : [];

        const toggleSelection = (value: string) => {
          const currentValues = selectedValues.includes(value)
              ? selectedValues.filter(v => v !== value)
              : [...selectedValues, value];

          // Transform to match schema format (array of objects with the specified key)
          const transformedValues = currentValues.map(val => ({[valueKey]: val}));
          field.onChange(transformedValues.length > 0 ? transformedValues : []);
        };

        const removeSelection = (value: string) => {
          const currentValues = selectedValues.filter(v => v !== value);
          const transformedValues = currentValues.map(val => ({[valueKey]: val}));
          field.onChange(transformedValues.length > 0 ? transformedValues : []);
        };

        const visibleItems = expanded ? selectedValues : selectedValues.slice(0, maxShownItems);
        const hiddenCount = selectedValues.length - visibleItems.length;

        return <Field orientation="responsive" data-invalid={fieldState.invalid}>
          <FieldContent>
            <FieldLabel htmlFor={id}>
              {label}
            </FieldLabel>
            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
          </FieldContent>
          <Popover open={open} onOpenChange={setOpen} modal={modal}>
            <PopoverTrigger asChild>
              <Button
                  id={id}
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="h-auto min-h-8 w-full justify-between hover:bg-transparent"
                  disabled={disabled}
              >
                <div className="flex flex-wrap items-center gap-1 pr-2.5">
                  {selectedValues.length > 0 ? (
                      <>
                        {visibleItems.map(val => {
                          const option = options.find(opt => opt.value === val);
                          return option ? (
                              <Badge key={val} variant="outline" className="rounded-sm">
                                {option.label}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-4"
                                    onClick={e => {
                                      e.stopPropagation();
                                      removeSelection(val);
                                    }}
                                    asChild
                                >
                              <span>
                                <XIcon className="size-3"/>
                              </span>
                                </Button>
                              </Badge>
                          ) : null;
                        })}
                        {hiddenCount > 0 || expanded ? (
                            <Badge
                                variant="outline"
                                onClick={e => {
                                  e.stopPropagation();
                                  setExpanded(prev => !prev);
                                }}
                                className="rounded-sm cursor-pointer"
                            >
                              {expanded ? t('show_less', 'Show Less') : `+${hiddenCount} ${t('more', 'more')}`}
                            </Badge>
                        ) : null}
                      </>
                  ) : (
                      <span
                          className="text-muted-foreground">{placeholder || label}</span>
                  )}
                </div>
                <ChevronsUpDown className="text-muted-foreground/80 shrink-0"
                                aria-hidden="true"/>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popper-anchor-width] p-0">
              <Command>
                <CommandInput placeholder={t('search', 'Search...')}/>
                <CommandList>
                  <CommandEmpty>{t('no_results', 'No results found.')}</CommandEmpty>
                  <CommandGroup>
                    {options.map(option => (
                        <CommandItem
                            key={option.value}
                            value={option.value}
                            keywords={[option.label]}
                            onSelect={() => toggleSelection(option.value)}
                        >
                          <span className="truncate">{option.label}</span>
                          {selectedValues.includes(option.value) &&
                              <Check size={16} className="ml-auto"/>}
                        </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </Field>
      }}
  />
}