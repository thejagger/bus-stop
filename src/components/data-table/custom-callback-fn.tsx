import {type TypeOption} from "@/config/constant.ts";
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router-dom";
import type {CellContext} from "@tanstack/react-table";

export function typeOptionCallback(props: CellContext<any, any>, typeOptions: TypeOption[]) {
  const state = typeOptions.find((type) => type.value === props.getValue())

  if (!state) {
    return '';
  }

  return (
      <div className="flex w-[100px] items-center gap-2">
        {state.icon && (
            <state.icon className="text-muted-foreground size-4"/>
        )}
        <span>{state.label}</span>
      </div>
  )
}

export function typeOptionArrayCallback(props: CellContext<any, any>, typeOptions: TypeOption[], key: string) {
  const frameworkValues = props.getValue()
      .map((f: { [x: string]: any; }) => f[key])
      .filter(Boolean) as string[];

  return frameworkValues
      .map(value => {
        const frameworkOption = typeOptions.find(f => f.value === value);
        return frameworkOption?.label || value;
      })
      .join(', ');
}

export function editLinkCallback(props: any, basePath: string) {
  const row = props.row.original;
  return (
      <Button
          variant="link"
          className="text-foreground w-fit px-0 text-left"
          asChild
      >
        <Link to={`${basePath}/${row.id}`}>{props.getValue()}</Link>
      </Button>
  );
}