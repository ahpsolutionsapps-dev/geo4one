import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";

import { Button, Input, InputErrorMsg, Select, Switch } from "@/components/ui";
import { typedYupResolver } from "@/utils/typedYupResolver";

import { sectoresIndustrialesApi } from "../../sectores-industriales/data/sectores-industriales.api";
import { subSectoresIndustrialesApi } from "../../sub-sectores-industriales/data/sub-sectores-industriales.api";
import {
  CategoriaAnunciante,
  CategoriaAnuncianteFormValues,
} from "../categorias-anunciantes.types";

const categoriaAnuncianteSchema = Yup.object().shape({
  idSectorIndustrial: Yup.string().required("El sector industrial es requerido"),
  idSubSectorIndustrial: Yup.string().required("El sub sector industrial es requerido"),
  categoriaAnunciante: Yup.string()
    .trim()
    .min(2, "Debe tener al menos 2 caracteres")
    .max(150, "Máximo 150 caracteres")
    .required("La categoría es requerida"),
  activo: Yup.boolean().required(),
});

interface CategoriasAnunciantesFormModalProps {
  open: boolean;
  categoriaAnunciante?: CategoriaAnunciante | null;
  onClose: () => void;
  onSaved: (values: CategoriaAnuncianteFormValues) => Promise<void> | void;
}

export function CategoriasAnunciantesFormModal({
  open,
  categoriaAnunciante,
  onClose,
  onSaved,
}: CategoriasAnunciantesFormModalProps) {
  const isEditMode = Boolean(categoriaAnunciante);
  const [sectorOptions, setSectorOptions] = useState<{ label: string; value: string }[]>([]);
  const [subSectorOptions, setSubSectorOptions] = useState<
    { label: string; value: string; sectorId: string }[]
  >([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategoriaAnuncianteFormValues>({
    resolver: typedYupResolver(categoriaAnuncianteSchema),
    defaultValues: {
      idSectorIndustrial: "",
      idSubSectorIndustrial: "",
      categoriaAnunciante: "",
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
        const [sectoresIndustriales, subSectoresIndustriales] = await Promise.all([
          sectoresIndustrialesApi.getSectoresIndustriales(),
          subSectoresIndustrialesApi.getSubSectoresIndustriales(),
        ]);

        setSectorOptions(
          sectoresIndustriales.map((item) => ({
            label: item.sectorIndustrial,
            value: item.id,
          })),
        );

        setSubSectorOptions(
          subSectoresIndustriales.map((item) => ({
            label: item.subSectorIndustrial,
            value: item.id,
            sectorId: String(item.idSectorIndustrial),
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
      idSectorIndustrial: categoriaAnunciante?.idSectorIndustrial ? String(categoriaAnunciante.idSectorIndustrial) : "",
      idSubSectorIndustrial: categoriaAnunciante?.idSubSectorIndustrial
        ? String(categoriaAnunciante.idSubSectorIndustrial)
        : "",
      categoriaAnunciante: categoriaAnunciante?.categoriaAnunciante ?? "",
      activo: categoriaAnunciante?.activo ?? true,
    });
  }, [open, categoriaAnunciante, reset]);

  const selectedSectorIndustrial = watch("idSectorIndustrial");
  const selectedSubSectorIndustrial = watch("idSubSectorIndustrial");

  const availableSubSectorOptions = useMemo(
    () =>
      selectedSectorIndustrial
        ? subSectorOptions.filter((item) => item.sectorId === selectedSectorIndustrial)
        : subSectorOptions,
    [selectedSectorIndustrial, subSectorOptions],
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    if (!selectedSectorIndustrial) {
      if (selectedSubSectorIndustrial) {
        setValue("idSubSectorIndustrial", "", { shouldValidate: true });
      }
      return;
    }

    const isCurrentSubSectorValid = availableSubSectorOptions.some(
      (option) => option.value === selectedSubSectorIndustrial,
    );

    if (selectedSubSectorIndustrial && !isCurrentSubSectorValid) {
      setValue("idSubSectorIndustrial", "", { shouldValidate: true });
    }
  }, [
    availableSubSectorOptions,
    open,
    selectedSectorIndustrial,
    selectedSubSectorIndustrial,
    setValue,
  ]);

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
                  {isEditMode ? "Editar categoría" : "Nueva categoría"}
                </Dialog.Title>
                <p className="mt-1 text-sm text-gray-500 dark:text-dark-300">
                  Relaciona la categoría con su sector y sub sector industrial.
                </p>

                <form className="mt-5 space-y-4" onSubmit={submit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Controller
                        control={control}
                        name="idSectorIndustrial"
                        render={({ field }) => (
                          <Select
                            label="Sector industrial"
                            data={[
                              { label: "Seleccione un sector industrial", value: "", disabled: true },
                              ...sectorOptions,
                            ]}
                            disabled={isLoadingOptions}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value)}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                            error={errors.idSectorIndustrial?.message}
                          />
                        )}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <Controller
                        control={control}
                        name="idSubSectorIndustrial"
                        render={({ field }) => (
                          <Select
                            label="Sub sector industrial"
                            data={[
                              {
                                label: selectedSectorIndustrial
                                  ? "Seleccione un sub sector industrial"
                                  : "Seleccione primero un sector industrial",
                                value: "",
                                disabled: true,
                              },
                              ...availableSubSectorOptions,
                            ]}
                            disabled={isLoadingOptions || !selectedSectorIndustrial}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value)}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                            error={errors.idSubSectorIndustrial?.message}
                          />
                        )}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <Input
                        label="Categoría"
                        placeholder="Ej. Vallas premium"
                        {...register("categoriaAnunciante")}
                        error={errors.categoriaAnunciante?.message}
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
                          : "Crear categoría"}
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