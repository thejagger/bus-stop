import {useQuery} from '@tanstack/react-query';
import {supabase} from "@/lib/supabase-client.ts";
import type {DataTableQueryResult} from "@/components/data-table/data-table-supabase.tsx";
import {AppError} from "@/lib/app-error.ts";

interface UseSelectOptionsProps<T> {
  table: string;
  labelColumn: keyof T;
  valueColumn: keyof T;
  select?: string;
  orderBy?: { column: keyof T; ascending?: boolean };
  filter?: { column: keyof T; operator: string; value: any };
}

export const useSelectOptions = <T>({
                                        table,
                                        labelColumn,
                                        valueColumn,
                                        select = '*',
                                        orderBy,
                                        filter,
                                      }: UseSelectOptionsProps<T>) => {
  return useQuery({
    queryKey: [`select-options-${table}`, labelColumn, valueColumn, select, orderBy, filter],
    queryFn: async () => {
      let query: DataTableQueryResult = supabase.from(table).select(select);

      if (orderBy) {
        query = query.order(orderBy.column as string, {
          ascending: orderBy.ascending ?? true,
        });
      }

      if (filter) {
        query = query.filter(
            filter.column as string,
            filter.operator as any,
            filter.value,
        );
      }

      const {data, error} = await query;

      if (error) {
        throw new AppError(
            `Failed to retrieve all records for ${table}.`,
            error,
            {tableName: table, operation: 'FETCH'})
      }

      return (
          data?.map((item) => ({
            label: item[labelColumn],
            value: item[valueColumn],
          })) || []
      );
    },
  });
};
