import { useState } from "react";

import { Rol } from "../../domain/entities/rol.entity";
import { rolesModule } from "../../di/roles.module";

export interface RolFormValues {
  rol: string;
  descripcion: string;
  idModulos: number[];
}

interface UseRolFormOptions {
  rol?: Rol | null;
}

export function useRolForm({ rol }: UseRolFormOptions) {
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isEditMode = Boolean(rol);

  const save = async (values: RolFormValues) => {
    setIsSaving(true);
    setErrorMessage(null);

    try {
      if (rol) {
        return await rolesModule.updateRol.execute({
          id: rol.id,
          rol: values.rol,
          descripcion: values.descripcion,
          idModulos: values.idModulos,
        });
      }

      return await rolesModule.createRol.execute({
        rol: values.rol,
        descripcion: values.descripcion,
        idModulos: values.idModulos,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No fue posible guardar el rol";
      setErrorMessage(message);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    errorMessage,
    isEditMode,
    save,
  };
}
