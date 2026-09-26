import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";

import { Button, Input, InputErrorMsg, Select, Switch } from "@/components/ui";
import { typedYupResolver } from "@/utils/typedYupResolver";

import { provinciasApi } from "../../provincias/data/provincias.api";
import { Municipio, MunicipioFormValues } from "../municipios.types";

const municipioSchema = Yup.object().shape({
  idProvincia: Yup.string().required("La provincia es requerida"),
  municipio: Yup.string()
    .trim()
    .min(2, "Debe tener al menos 2 caracteres")
    .max(100, "Máximo 100 caracteres")
    .required("El nombre del municipio es requerido"),
  latitud: Yup.string().trim().max(20, "Máximo 20 caracteres"),
  longitud: Yup.string().trim().max(20, "Máximo 20 caracteres"),
  activo: Yup.boolean().required(),
});

interface MunicipiosFormModalProps {
  open: boolean;
  municipio?: Municipio | null;
  onClose: () => void;
  onSaved: (values: MunicipioFormValues) => Promise<void> | void;
}

export function MunicipiosFormModal({
  open,
  municipio,
  onClose,
  onSaved,
}: MunicipiosFormModalProps) {
  const isEditMode = Boolean(municipio);
  const [provinceOptions, setProvinceOptions] = useState<{ label: string; value: string }[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MunicipioFormValues>({
    resolver: typedYupResolver(municipioSchema),
    defaultValues: {
      idProvincia: "",
      municipio: "",
      latitud: "",
      longitud: "",
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
        const provincias = await provinciasApi.getProvincias();
        setProvinceOptions(
          provincias.map((item) => ({
            label: item.provincia,
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
      idProvincia: municipio?.idProvincia ? String(municipio.idProvincia) : "",
      municipio: municipio?.municipio ?? "",
      latitud: municipio?.latitud?.toString() ?? "",
      longitud: municipio?.longitud?.toString() ?? "",
      activo: municipio?.activo ?? true,
    });
  }, [open, municipio, reset]);

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
                  {isEditMode ? "Editar municipio" : "Nuevo municipio"}
                </Dialog.Title>
                <p className="mt-1 text-sm text-gray-500 dark:text-dark-300">
                  Registra el municipio, su provincia y coordenadas de referencia.
                </p>

                <form className="mt-5 space-y-4" onSubmit={submit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Controller
                        control={control}
                        name="idProvincia"
                        render={({ field }) => (
                          <Select
                            label="Provincia"
                            data={[
                              {
                                label: "Seleccione una provincia",
                                value: "",
                                disabled: true,
                              },
                              ...provinceOptions,
                            ]}
                            disabled={isLoadingOptions}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value)}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                            error={errors.idProvincia?.message}
                          />
                        )}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <Input
                        label="Municipio"
                        placeholder="Ej. Santo Domingo Este"
                        {...register("municipio")}
                        error={errors.municipio?.message}
                      />
                    </div>

                    <div>
                      <Input
                        label="Latitud"
                        placeholder="Ej. 18.4861"
                        inputMode="decimal"
                        {...register("latitud")}
                        error={errors.latitud?.message}
                      />
                    </div>

                    <div>
                      <Input
                        label="Longitud"
                        placeholder="Ej. -69.9312"
                        inputMode="decimal"
                        {...register("longitud")}
                        error={errors.longitud?.message}
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
                          : "Crear municipio"}
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
