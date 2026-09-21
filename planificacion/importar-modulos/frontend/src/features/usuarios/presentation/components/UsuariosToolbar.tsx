import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { Table } from "@tanstack/react-table";
import { RefObject } from "react";

import { EntityListToolbar } from "@/components/shared/table";
import { Button } from "@/components/ui";

import { Usuario } from "../../domain/entities/usuario.entity";
import { UsuariosTableConfig } from "./UsuariosTableConfig";

interface UsuariosToolbarProps {
  table: Table<Usuario>;
  onCreate: () => void;
  onShowShortcuts?: () => void;
  searchInputRef?: RefObject<HTMLInputElement | null>;
  viewButtonRef?: RefObject<HTMLButtonElement | null>;
}

export function UsuariosToolbar({
  table,
  onCreate,
  onShowShortcuts,
  searchInputRef,
  viewButtonRef,
}: UsuariosToolbarProps) {
  return (
    <EntityListToolbar
      title="Usuarios"
      createLabel="Nuevo usuario"
      createTitle="Nuevo usuario (Ctrl+N)"
      searchPlaceholder="Buscar ID, usuario, correo, rol..."
      searchInputRef={searchInputRef}
      table={table}
      tableConfig={
        <UsuariosTableConfig table={table} viewButtonRef={viewButtonRef} />
      }
      extraActions={
        onShowShortcuts ? (
          <Button
            variant="outlined"
            isIcon
            className="size-8 shrink-0 rounded-md"
            title="Atajos disponibles (?)"
            aria-label="Atajos disponibles"
            onClick={onShowShortcuts}
          >
            <QuestionMarkCircleIcon className="size-5" />
          </Button>
        ) : null
      }
      onCreate={onCreate}
      actionsPreset="primary"
      showPrint={false}
      showExport={false}
      showShare={false}
      showSaveView={false}
    />
  );
}
