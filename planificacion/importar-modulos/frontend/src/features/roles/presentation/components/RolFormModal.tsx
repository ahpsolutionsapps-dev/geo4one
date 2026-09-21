import { typedYupResolver } from "@/utils/typedYupResolver";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";

import { Button, Checkbox, Input, InputErrorMsg, Textarea } from "@/components/ui";

import {
  ModuloCatalogItem,
  Rol,
  assignableModuloIds,
  isSuperAdminRol,
  moduloCatalogLabel,
} from "../../domain/entities/rol.entity";
import { rolesModule } from "../../di/roles.module";
import { RolFormValues, useRolForm } from "../hooks/use-rol-form";

const schema = Yup.object().shape({
  rol: Yup.string()
    .trim()
    .min(2, "Debe tener al menos 2 caracteres")
    .max(80, "Máximo 80 caracteres")
    .required("El nombre del rol es requerido"),
  descripcion: Yup.string()
    .trim()
    .min(2, "Debe tener al menos 2 caracteres")
    .max(500, "Máximo 500 caracteres")
    .required("La descripción es requerida"),
  idModulos: Yup.array().of(Yup.number().required()).default([]),
});

interface RolFormModalProps {
  open: boolean;
  rol?: Rol | null;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
}

function groupModulos(modulos: ModuloCatalogItem[]) {
  const roots = modulos
    .filter((item) => item.idPadre == null)
    .sort((a, b) => a.orderIndex - b.orderIndex);

  return roots.map((root) => ({
    root,
    children: modulos
      .filter((item) => item.idPadre === root.idModulo)
      .sort((a, b) => a.orderIndex - b.orderIndex),
  }));
}

export function RolFormModal({
  open,
  rol,
  onClose,
  onSaved,
}: RolFormModalProps) {
  const { isSaving, errorMessage, save, isEditMode } = useRolForm({ rol });
  const [modulos, setModulos] = useState<ModuloCatalogItem[]>([]);
  const [loadingModulos, setLoadingModulos] = useState(false);
  const isSuperAdmin = rol ? isSuperAdminRol(rol) : false;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<RolFormValues>({
    resolver: typedYupResolver(schema),
    defaultValues: {
      rol: "",
      descripcion: "",
      idModulos: [],
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoadingModulos(true);
      try {
        const catalog = await rolesModule.getModulosCatalog.execute();
        if (cancelled) return;
        setModulos(catalog);

        if (rol) {
          const detail = await rolesModule.getRolById.execute(rol.id);
          if (cancelled) return;
          reset({
            rol: detail.rol,
            descripcion: detail.descripcion,
            idModulos: assignableModuloIds(detail.idModulos, catalog),
          });
        } else {
          reset({
            rol: "",
            descripcion: "",
            idModulos: [],
          });
        }
      } finally {
        if (!cancelled) {
          setLoadingModulos(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [open, rol, reset]);

  const grouped = useMemo(() => groupModulos(modulos), [modulos]);

  const onSubmit = handleSubmit(async (values) => {
    await save({
      ...values,
      idModulos: assignableModuloIds(values.idModulos, modulos),
    });
    await onSaved();
    onClose();
  });

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-100" onClose={() => undefined}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm dark:bg-black/40" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="dark:bg-dark-700 w-full max-w-3xl rounded-xl bg-white p-5 shadow-xl sm:p-6">
                <Dialog.Title className="text-lg font-semibold text-gray-800 dark:text-dark-50">
                  {isEditMode ? "Editar rol" : "Nuevo rol"}
                </Dialog.Title>
                <p className="mt-1 text-sm text-gray-500 dark:text-dark-300">
                  Define el rol y los módulos del menú a los que tendrá acceso.
                </p>

                <form className="mt-5 space-y-4" onSubmit={onSubmit}>
                  {errorMessage && (
                    <div className="rounded-lg border border-error/20 bg-error/5 px-3 py-2 text-sm text-error">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Input
                        label="Nombre del rol"
                        disabled={isSuperAdmin}
                        {...register("rol")}
                        error={errors.rol?.message}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Textarea
                        label="Descripción"
                        rows={3}
                        {...register("descripcion")}
                        error={errors.descripcion?.message}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-800 dark:text-dark-100">
                        Módulos asignados
                      </h3>
                      {loadingModulos && (
                        <span className="text-xs text-gray-500">Cargando...</span>
                      )}
                    </div>
                    {modulos.some((item) => item.oculto) && (
                      <p className="mb-2 text-xs text-gray-500 dark:text-dark-300">
                        Los módulos marcados como Oculto solo los ve Super
                        Administrador. Al asignarlos a un rol, se habilitan para
                        que los administradores puedan asignarlos.
                      </p>
                    )}
                    <InputErrorMsg when={Boolean(errors.idModulos?.message)}>
                      {errors.idModulos?.message}
                    </InputErrorMsg>

                    <Controller
                      name="idModulos"
                      control={control}
                      render={({ field }) => {
                        const selected = new Set(field.value ?? []);

                        const toggle = (idModulo: number, checked: boolean) => {
                          const next = new Set(selected);
                          if (checked) {
                            next.add(idModulo);
                          } else {
                            next.delete(idModulo);
                          }
                          field.onChange([...next]);
                        };

                        const toggleSection = (
                          sectionId: number,
                          childIds: number[],
                          checked: boolean,
                        ) => {
                          const next = new Set(selected);
                          if (checked) {
                            next.add(sectionId);
                            childIds.forEach((id) => next.add(id));
                          } else {
                            next.delete(sectionId);
                            childIds.forEach((id) => next.delete(id));
                          }
                          field.onChange([...next]);
                        };

                        return (
                          <div className="dark:border-dark-500 max-h-80 space-y-3 overflow-y-auto rounded-lg border border-gray-200 p-3">
                            {grouped.map(({ root, children }) => {
                              const childIds = children.map((c) => c.idModulo);
                              const allChildrenSelected =
                                childIds.length > 0 &&
                                childIds.every((id) => selected.has(id));

                              return (
                                <div key={root.idModulo} className="space-y-2">
                                  <Checkbox
                                    checked={
                                      selected.has(root.idModulo) ||
                                      allChildrenSelected
                                    }
                                    onChange={(event) =>
                                      toggleSection(
                                        root.idModulo,
                                        childIds,
                                        event.target.checked,
                                      )
                                    }
                                    label={moduloCatalogLabel(root)}
                                    classNames={{ labelText: "font-semibold" }}
                                  />
                                  <div className="ml-6 grid gap-2 sm:grid-cols-2">
                                    {children.map((child) => (
                                      <Checkbox
                                        key={child.idModulo}
                                        checked={selected.has(child.idModulo)}
                                        onChange={(event) =>
                                          toggle(
                                            child.idModulo,
                                            event.target.checked,
                                          )
                                        }
                                        label={moduloCatalogLabel(child)}
                                      />
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                            {!loadingModulos && grouped.length === 0 && (
                              <p className="text-sm text-gray-500">
                                No hay módulos disponibles.
                              </p>
                            )}
                          </div>
                        );
                      }}
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={onClose}
                      disabled={isSaving}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" color="primary" disabled={isSaving}>
                      {isSaving
                        ? "Guardando..."
                        : isEditMode
                          ? "Guardar cambios"
                          : "Crear rol"}
                    </Button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
