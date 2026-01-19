import {
  DataTableSupabase,
  type SupabaseDataTableColumn
} from "@/components/data-table/data-table-supabase.tsx";
import {status} from "@/config/constant.ts";
import {ProfileModel} from "@/app/users/model/profile.model.ts";
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router-dom";

const profile = new ProfileModel();
const dataTableColumns: SupabaseDataTableColumn[] = [
  {
    key: 'is_active',
    title: 'Status',
    isGlobalFilterable: false,
    callback: (props) => {
      const state = status.find((state) => state.value === props.getValue())

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
    },
    filter: {
      filterFn: 'filterIncludesString',
      options: status
    }
  },
  {
    key: 'fullname',
    title: 'Name',
    accessorFn: (row) => {
      return `${row.first_name} ${row.last_name}`
    },
    callback: (props) => {
      return <Button variant="link" className="text-foreground w-fit px-0 text-left"
                     asChild>
        <Link
            to={`${profile.basePath}/${props.row.original.id}`}>{props.getValue()}
        </Link>
      </Button>
    }
  },
  {
    key: 'email',
    title: 'E-Mail',
  },
  {
    key: 'actions',
    isAction: true,
  }
];

export default function UserPage() {
  return <DataTableSupabase
      columns={dataTableColumns}
      queryFn={() => profile.getAllQuery()}
      baseModel={profile}/>
}
