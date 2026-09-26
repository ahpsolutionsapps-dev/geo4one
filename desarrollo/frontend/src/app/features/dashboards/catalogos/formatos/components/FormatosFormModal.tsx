import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";

import { Button, Input, InputErrorMsg, Select, Switch } from "@/components/ui";
import { typedYupResolver } from "@/utils/typedYupResolver";

import {
  FormatoCatalogoFormValues,
  FormatoCatalogoItem,
  TipoElementoOption,
} from "../../shared/catalogos-elementos.types";

const formatoSchema = Yup.object().shape({
  idTipoElemento: Yup.string().required("El tipo de elemento es requerido"),
  formato: Yup.string()
    .trim()
    .min(2, "Debe tener al menos 2 caracteres")
    .max(150, "Máximo 150 caracteres")
    .required("El formato es requerido"),
  activo: Yup.boolean().required(),
});

interface FormatosFormModalProps {
  open: boolean;
  formato?: FormatoCatalogoItem | null;
  tiposElementos: TipoElementoOption[];
  onClose: () => void;
  onSaved: (values: FormatoCatalogoFormValues) => Promise<void> | void;
}

export function FormatosFormModal({
  open,
  formato,
  tiposElementos,
  onClose,
  onSaved,
}: FormatosFormModalProps) {
  const isEditMode = Boolean(formato);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormatoCatalogoFormValues>({
    resolver: typedYupResolver(formatoSchema),
    defaultValues: {
      idTipoElemento: "",
      formato: "",
      activo: true,
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      idTipoElemento: formato?.idTipoElemento ?? "",
      formato: formato?.formato ?? "",
      activo: formato?.activo ?? true,
    });
  }, [formato, open, reset]);

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
                  {isEditMode ? "Editar tipo de formato" : "Nuevo tipo de formato"}
                </Dialog.Title>
                <p className="mt-1 text-sm text-gray-500 dark:text-dark-300">
                  Define el formato asociado al tipo de elemento.
                </p>

                <form className="mt-5 space-y-4" onSubmit={submit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Controller
                        control={control}
                        name="idTipoElemento"
                        render={({ field }) => (
                          <Select
                            label="Tipo de elemento"
                            data={[
                              {
                                label: "Seleccione un tipo de elemento",
                                value: "",
                                disabled: true,
                              },
                              ...tiposElementos.map((item) => ({
                                label: item.nombre,
                                value: item.id,
                              })),
                            ]}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value)}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                            error={errors.idTipoElemento?.message}
                          />
                        )}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <Input
                        label="Formato"
                        placeholder="Ej. Valla 12x24"
                        {...register("formato")}
                        error={errors.formato?.message}
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
                          : "Crear tipo de formato"}
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
