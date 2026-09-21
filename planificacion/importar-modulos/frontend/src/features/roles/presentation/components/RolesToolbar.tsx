import { Table } from "@tanstack/react-table";

import { EntityListToolbar } from "@/components/shared/table";

import { Rol } from "../../domain/entities/rol.entity";
import { RolesTableConfig } from "./RolesTableConfig";

interface RolesToolbarProps {
  table: Table<Rol>;
  onCreate: () => void;
}

export function RolesToolbar({ table, onCreate }: RolesToolbarProps) {
  return (
    <EntityListToolbar
      title="Roles"
      createLabel="Nuevo rol"
      searchPlaceholder="Buscar rol, descripción..."
      table={table}
      tableConfig={<RolesTableConfig table={table} />}
      onCreate={onCreate}
      actionsPreset="primary"
      showPrint={false}
      showExport={false}
      showShare={false}
      showSaveView={false}
      showExportPdfInMoreMenu={false}
    />
  );
}
