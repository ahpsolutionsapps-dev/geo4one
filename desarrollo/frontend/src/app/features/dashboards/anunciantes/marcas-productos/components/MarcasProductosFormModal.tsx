import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";

import { Button, Input, InputErrorMsg, Select, Switch } from "@/components/ui";
import { typedYupResolver } from "@/utils/typedYupResolver";

import { categoriasAnunciantesApi } from "../../categorias-anunciantes/data/categorias-anunciantes.api";
import { anunciantesApi } from "../data/anunciantes.api";
import { MarcaProducto, MarcaProductoFormValues } from "../marcas-productos.types";

const marcaProductoSchema = Yup.object().shape({
  idAnunciante: Yup.string().required("El anunciante es requerido"),
  idCategoriaAnunciante: Yup.string().required("La categoría es requerida"),
  marcaProducto: Yup.string()
    .trim()
    .min(2, "Debe tener al menos 2 caracteres")
    .max(200, "Máximo 200 caracteres")
    .required("La marca es requerida"),
  activo: Yup.boolean().required(),
});

interface MarcasProductosFormModalProps {
  open: boolean;
  marcaProducto?: MarcaProducto | null;
  onClose: () => void;
  onSaved: (values: MarcaProductoFormValues) => Promise<void> | void;
}

export function MarcasProductosFormModal({
  open,
  marcaProducto,
  onClose,
  onSaved,
}: MarcasProductosFormModalProps) {
  const isEditMode = Boolean(marcaProducto);
  const [anuncianteOptions, setAnuncianteOptions] = useState<{ label: string; value: string }[]>([]);
  const [categoriaOptions, setCategoriaOptions] = useState<{ label: string; value: string }[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MarcaProductoFormValues>({
    resolver: typedYupResolver(marcaProductoSchema),
    defaultValues: {
      idAnunciante: "",
      idCategoriaAnunciante: "",
      marcaProducto: "",
      activo: true,
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    void (async () => {
      setIsLoadingOptions(true);
      try {
        const [anunciantes, categorias] = await Promise.all([
          anunciantesApi.getAnunciantes(),
          categoriasAnunciantesApi.getCategoriasAnunciantes(),
        ]);

        setAnuncianteOptions(
          anunciantes.map((item) => ({
            label: item.anunciante,
            value: item.id,
          })),
        );

        setCategoriaOptions(
          categorias.map((item) => ({
            label: `${item.categoriaAnunciante} - ${item.sectorIndustrial} / ${item.subSectorIndustrial}`,
            value: item.id,
          })),
        );
      } finally {
        setIsLoadingOptions(false);
      }
    })();
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      idAnunciante: marcaProducto?.idAnunciante ? String(marcaProducto.idAnunciante) : "",
      idCategoriaAnunciante: marcaProducto?.idCategoriaAnunciante
        ? String(marcaProducto.idCategoriaAnunciante)
        : "",
      marcaProducto: marcaProducto?.marcaProducto ?? "",
      activo: marcaProducto?.activo ?? true,
    });
  }, [open, marcaProducto, reset]);

  const submit = handleSubmit(async (values) => {
    await onSaved(values);
    onClose();
  });

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-100" onClose={() => undefined}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm dark:bg-black/40" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl dark:bg-dark-700">
                <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-dark-50">
                  {isEditMode ? "Editar marca" : "Nueva marca"}
                </Dialog.Title>
                <p className="mt-1 text-sm text-gray-500 dark:text-dark-300">
                  Vincula la marca con su anunciante y categoría.
                </p>

                <form className="mt-5 space-y-4" onSubmit={submit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Controller
                        control={control}
                        name="idAnunciante"
                        render={({ field }) => (
                          <Select
                            label="Anunciante"
                            data={[
                              { label: "Seleccione un anunciante", value: "", disabled: true },
                              ...anuncianteOptions,
                            ]}
                            disabled={isLoadingOptions}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value)}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                            error={errors.idAnunciante?.message}
                          />
                        )}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <Controller
                        control={control}
                        name="idCategoriaAnunciante"
                        render={({ field }) => (
                          <Select
                            label="Categoría"
                            data={[
                              { label: "Seleccione una categoría", value: "", disabled: true },
                              ...categoriaOptions,
                            ]}
                            disabled={isLoadingOptions}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value)}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                            error={errors.idCategoriaAnunciante?.message}
                          />
                        )}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <Input
                        label="Marca / Producto"
                        placeholder="Ej. Sprite"
                        {...register("marcaProducto")}
                        error={errors.marcaProducto?.message}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <Switch label="Activo" {...register("activo")} />
                      <InputErrorMsg when={Boolean(errors.activo?.message)}>
                        {errors.activo?.message}
                      </InputErrorMsg>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={onClose}
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" color="primary" disabled={isSubmitting}>
                      {isSubmitting
                        ? "Guardando..."
                        : isEditMode
                          ? "Guardar cambios"
                          : "Crear marca"}
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