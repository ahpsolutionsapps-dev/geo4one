import { useCallback, useState } from "react";

import { usuariosModule } from "../../di/usuarios.module";
import { Usuario } from "../../domain/entities/usuario.entity";

export interface UsuarioFormValues {
  username: string;
  email: string;
  /** En edición puede venir vacío/undefined si no se cambia la contraseña. */
  userpassword?: string;
  idRol: string;
  palabraSecreta: string;
  habilitado: boolean;
  verificado: boolean;
  estatus: number;
  comentario: string;
}

interface UseUsuarioFormOptions {
  usuario?: Usuario | null;
  onSuccess?: () => Promise<void> | void;
}

export function useUsuarioForm({
  usuario,
  onSuccess,
}: UseUsuarioFormOptions) {
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const save = useCallback(
    async (values: UsuarioFormValues, pendingImagen?: File | null) => {
      setIsSaving(true);
      setErrorMessage(null);

      try {
        if (usuario) {
          const password = values.userpassword?.trim() || null;
          await usuariosModule.updateUsuario.execute({
            id: usuario.id,
            username: values.username,
            email: values.email,
            userpassword: password,
            idRol: values.idRol || null,
            palabraSecreta: values.palabraSecreta || null,
            habilitado: values.habilitado,
            verificado: values.verificado,
            estatus: values.estatus,
            comentario: values.comentario || null,
          });
        } else {
          const created = await usuariosModule.createUsuario.execute({
            username: values.username,
            email: values.email,
            userpassword: values.userpassword?.trim() ?? "",
            idRol: values.idRol || null,
            palabraSecreta: values.palabraSecreta || null,
            habilitado: values.habilitado,
            verificado: values.verificado,
            estatus: values.estatus,
            comentario: values.comentario || null,
          });

          if (pendingImagen) {
            await usuariosModule.uploadUsuarioImagen.execute({
              id: created.id,
              file: pendingImagen,
            });
          }
        }

        await onSuccess?.();
        return true;
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "No fue posible guardar el usuario",
        );
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [usuario, onSuccess],
  );

  return {
    isSaving,
    errorMessage,
    save,
    isEditMode: Boolean(usuario),
  };
}
