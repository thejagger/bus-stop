import type { BaseModel } from "@/lib/base.model.ts";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Button } from "@/components/ui/button.tsx";
import { IconDotsVertical } from "@tabler/icons-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import type { JSX } from "react";
import { useAlertDialog } from "@/components/global-alert-dialog.tsx";
import { useTranslation } from "react-i18next";

export function DefaultDeleteAction({
  baseModel,
  rowId,
}: {
  baseModel: BaseModel<z.ZodType>;
  rowId: number;
}) {
  const { t } = useTranslation("data_table");
  const queryClient = useQueryClient();
  const { showDialog } = useAlertDialog();

  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => {
      return baseModel.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [baseModel.tableName] });
      toast.success(t("delete_action_success"));
    },
  });

  const handleDeleteFunction = () => {
    showDialog({
      title: t("delete_action_dialog_title"),
      description: t("delete_action_dialog_description"),
      onConfirm: () => {
        deleteMutation.mutate(rowId);
      },
    });
  };

  return (
    <DropdownMenuItem onSelect={handleDeleteFunction} variant="destructive">
      {t("delete_action")}
    </DropdownMenuItem>
  );
}

export function DefaultEditAction({
  baseModel,
  rowId,
}: {
  baseModel: BaseModel<z.ZodType>;
  rowId: number;
}) {
  const { t } = useTranslation("data_table");

  return (
    <DropdownMenuItem asChild>
      <Link to={`${baseModel.basePath}/${rowId}`}>{t("edit_action")}</Link>
    </DropdownMenuItem>
  );
}

export function DefaultCopyAction({
  baseModel,
  rowId,
}: {
  baseModel: BaseModel<z.ZodType>;
  rowId: number;
}) {
  const { t } = useTranslation("data_table");

  return (
    <DropdownMenuItem asChild>
      <Link to={`${baseModel.basePath}/${rowId}`}>{t("copy_action")}</Link>
    </DropdownMenuItem>
  );
}

export function DefaultAddAction({
  baseModel,
}: {
  baseModel: BaseModel<z.ZodType>;
}) {
  const { t } = useTranslation("data_table");

  return (
    <Button size="sm" asChild>
      <Link to={`${baseModel.basePath}/new`}>{t("add_action")}</Link>
    </Button>
  );
}

export function DataTableActions({ actions }: { actions: JSX.Element[] }) {
  const { t } = useTranslation("data_table");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
          size="icon"
        >
          <IconDotsVertical />
          <span className="sr-only">{t("open_menu")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        {actions}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
