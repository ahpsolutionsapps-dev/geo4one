import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as Yup from "yup";

import { Button, Input, InputErrorMsg, Select, Switch } from "@/components/ui";
import { typedYupResolver } from "@/utils/typedYupResolver";

import {
  ComboAnunciante,
  ComboAnuncianteFormValues,
} from "../combos-anunciantes.types";
import { combosAnunciantesApi, MarcaProductoOption } from "../data/combos-anunciantes.api";

const comboAnuncianteSchema = Yup.object().shape({
  comboAnunciante: Yup.string()
    .trim()
    .min(2, "Debe tener al menos 2 caracteres")
    .max(1000, "Maximo 1000 caracteres")
    .required("El nombre del combo es requerido"),
  marcas: Yup.array()
    .of(
      Yup.object({
        idMarcaProducto: Yup.string().required("La marca es requerida"),
        orden: Yup.number().typeError("El orden es requerido").integer().min(1).required(),
      }),
    )
    .min(1, "Debes seleccionar al menos una marca")
    .test("unique-idMarcaProducto", "No puedes repetir marcas", (value) => {
      if (!value) {
        return true;
      }

      const ids = value.map((item) => item.idMarcaProducto);
      return new Set(ids).size === ids.length;
    })
    .test("unique-orden", "No puedes repetir ordenes", (value) => {
      if (!value) {
        return true;
      }

      const ordenes = value.map((item) => item.orden);
      return new Set(ordenes).size === ordenes.length;
    }),
  activo: Yup.boolean().required(),
});

interface CombosAnunciantesFormModalProps {
  open: boolean;
  comboAnunciante?: ComboAnunciante | null;
  onClose: () => void;
  onSaved: (values: ComboAnuncianteFormValues) => Promise<void> | void;
}

export function CombosAnunciantesFormModal({
  open,
  comboAnunciante,
  onClose,
  onSaved,
}: CombosAnunciantesFormModalProps) {
  const isEditMode = Boolean(comboAnunciante);
  const [marcaOptions, setMarcaOptions] = useState<MarcaProductoOption[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ComboAnuncianteFormValues>({
    resolver: typedYupResolver(comboAnuncianteSchema),
    defaultValues: {
      comboAnunciante: "",
      marcas: [{ idMarcaProducto: "", orden: 1 }],
      activo: true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "marcas",
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    void (async () => {
      setIsLoadingOptions(true);
      try {
        const options = await combosAnunciantesApi.getMarcasProductoOptions();
        setMarcaOptions(options);
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
      comboAnunciante: comboAnunciante?.comboAnunciante ?? "",
      marcas:
        comboAnunciante?.marcas?.length
          ? comboAnunciante.marcas
              .slice()
              .sort((a, b) => a.orden - b.orden)
              .map((item) => ({
                idMarcaProducto: String(item.idMarcaProducto),
                orden: item.orden,
              }))
          : [{ idMarcaProducto: "", orden: 1 }],
      activo: comboAnunciante?.activo ?? true,
    });
  }, [open, comboAnunciante, reset]);

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
              <DialogPanel className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-xl dark:bg-dark-700">
                <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-dark-50">
                  {isEditMode ? "Editar combo" : "Nuevo combo"}
                </Dialog.Title>
                <p className="mt-1 text-sm text-gray-500 dark:text-dark-300">
                  Define el nombre del combo y el orden de sus marcas.
                </p>

                <form className="mt-5 space-y-4" onSubmit={submit}>
                  <div>
                    <Input
                      label="Nombre del combo"
                      placeholder="Ej. Coca-Cola / Sprite / Fanta"
                      {...register("comboAnunciante")}
                      error={errors.comboAnunciante?.message}
                    />
                  </div>

                  <div className="rounded-lg border border-gray-200 p-4 dark:border-dark-500">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700 dark:text-dark-100">
                        Marcas del combo
                      </span>
                      <Button
                        type="button"
                        variant="flat"
                        className="gap-2"
                        onClick={() => append({ idMarcaProducto: "", orden: fields.length + 1 })}
                        disabled={isLoadingOptions}
                      >
                        <PlusIcon className="size-4" />
                        Agregar marca
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {fields.map((field, index) => (
                        <div key={field.id} className="grid gap-3 sm:grid-cols-[1fr_120px_auto]">
                          <Controller
                            control={control}
                            name={`marcas.${index}.idMarcaProducto`}
                            render={({ field: selectField }) => (
                              <Select
                                label={`Marca ${index + 1}`}
                                data={[
                                  { label: "Seleccione una marca", value: "", disabled: true },
                                  ...marcaOptions.map((item) => ({
                                    label: item.label,
                                    value: item.id,
                                  })),
                                ]}
                                value={selectField.value ?? ""}
                                onChange={(event) => selectField.onChange(event.target.value)}
                                onBlur={selectField.onBlur}
                                name={selectField.name}
                                ref={selectField.ref}
                                disabled={isLoadingOptions}
                                error={errors.marcas?.[index]?.idMarcaProducto?.message}
                              />
                            )}
                          />

                          <Input
                            type="number"
                            min={1}
                            label="Orden"
                            {...register(`marcas.${index}.orden` as const, {
                              valueAsNumber: true,
                            })}
                            error={errors.marcas?.[index]?.orden?.message}
                          />

                          <div className="flex items-end">
                            <Button
                              type="button"
                              isIcon
                              variant="flat"
                              className="size-10 rounded-full text-error"
                              onClick={() => remove(index)}
                              disabled={fields.length <= 1}
                              title="Eliminar marca"
                              aria-label="Eliminar marca"
                            >
                              <TrashIcon className="size-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <InputErrorMsg when={Boolean(errors.marcas?.message)}>
                      {errors.marcas?.message as string}
                    </InputErrorMsg>
                  </div>

                  <div>
                    <Switch label="Activo" {...register("activo")} />
                    <InputErrorMsg when={Boolean(errors.activo?.message)}>
                      {errors.activo?.message}
                    </InputErrorMsg>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outlined" onClick={onClose} disabled={isSubmitting}>
                      Cancelar
                    </Button>
                    <Button type="submit" color="primary" disabled={isSubmitting}>
                      {isSubmitting
                        ? "Guardando..."
                        : isEditMode
                          ? "Guardar cambios"
                          : "Crear combo"}
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
