import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";

import { Button, Input, InputErrorMsg, Select, Switch } from "@/components/ui";
import { typedYupResolver } from "@/utils/typedYupResolver";

import { municipiosApi } from "../../municipios/data/municipios.api";
import { Sector, SectorFormValues } from "../sectores.types";

const sectorSchema = Yup.object().shape({
  idMunicipio: Yup.string().required("El municipio es requerido"),
  sectorBarrio: Yup.string()
    .trim()
    .min(2, "Debe tener al menos 2 caracteres")
    .max(150, "Máximo 150 caracteres")
    .required("El nombre del sector es requerido"),
  circunscripcion: Yup.string().trim().max(50, "Máximo 50 caracteres"),
  latitud: Yup.string().trim().max(20, "Máximo 20 caracteres"),
  longitud: Yup.string().trim().max(20, "Máximo 20 caracteres"),
  activo: Yup.boolean().required(),
});

interface SectoresFormModalProps {
  open: boolean;
  sector?: Sector | null;
  onClose: () => void;
  onSaved: (values: SectorFormValues) => Promise<void> | void;
}

export function SectoresFormModal({
  open,
  sector,
  onClose,
  onSaved,
}: SectoresFormModalProps) {
  const isEditMode = Boolean(sector);
  const [municipioOptions, setMunicipioOptions] = useState<{ label: string; value: string }[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SectorFormValues>({
    resolver: typedYupResolver(sectorSchema),
    defaultValues: {
      idMunicipio: "",
      sectorBarrio: "",
      circunscripcion: "",
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
        const municipios = await municipiosApi.getMunicipios();
        setMunicipioOptions(
          municipios.map((item) => ({
            label: `${item.municipio} - ${item.provinciaNombre}`,
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
      idMunicipio: sector?.idMunicipio ? String(sector.idMunicipio) : "",
      sectorBarrio: sector?.sectorBarrio ?? "",
      circunscripcion: sector?.circunscripcion ?? "",
      latitud: sector?.latitud?.toString() ?? "",
      longitud: sector?.longitud?.toString() ?? "",
      activo: sector?.activo ?? true,
    });
  }, [open, sector, reset]);

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
                  {isEditMode ? "Editar sector" : "Nuevo sector"}
                </Dialog.Title>
                <p className="mt-1 text-sm text-gray-500 dark:text-dark-300">
                  Registra el sector, su municipio y datos geográficos.
                </p>

                <form className="mt-5 space-y-4" onSubmit={submit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Controller
                        control={control}
                        name="idMunicipio"
                        render={({ field }) => (
                          <Select
                            label="Municipio"
                            data={[
                              {
                                label: "Seleccione un municipio",
                                value: "",
                                disabled: true,
                              },
                              ...municipioOptions,
                            ]}
                            disabled={isLoadingOptions}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value)}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                            error={errors.idMunicipio?.message}
                          />
                        )}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <Input
                        label="Sector / Barrio"
                        placeholder="Ej. Los Mina"
                        {...register("sectorBarrio")}
                        error={errors.sectorBarrio?.message}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <Input
                        label="Circunscripción"
                        placeholder="Ej. 1"
                        {...register("circunscripcion")}
                        error={errors.circunscripcion?.message}
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
                          : "Crear sector"}
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
