import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import * as Yup from "yup";

import { Button, Input, InputErrorMsg, Select, Switch } from "@/components/ui";
import { typedYupResolver } from "@/utils/typedYupResolver";

import { Anunciante, AnuncianteFormValues } from "../anunciantes.types";
import { anunciantesApi, SelectOption } from "../data/anunciantes.api";

const anuncianteSchema = Yup.object().shape({
  idSectorIndustrial: Yup.string().required("El sector es requerido"),
  idSubSectorIndustrial: Yup.string().required("El sub sector es requerido"),
  idCategoriaAnunciante: Yup.string().required("La categoria es requerida"),
  anunciante: Yup.string()
    .trim()
    .min(2, "Debe tener al menos 2 caracteres")
    .max(200, "Maximo 200 caracteres")
    .required("El nombre del anunciante es requerido"),
  activo: Yup.boolean().required(),
});

interface AnunciantesFormModalProps {
  open: boolean;
  anunciante?: Anunciante | null;
  onClose: () => void;
  onSaved: (values: AnuncianteFormValues) => Promise<void> | void;
}

export function AnunciantesFormModal({
  open,
  anunciante,
  onClose,
  onSaved,
}: AnunciantesFormModalProps) {
  const isEditMode = Boolean(anunciante);
  const [sectoresOptions, setSectoresOptions] = useState<SelectOption[]>([]);
  const [subSectoresOptions, setSubSectoresOptions] = useState<SelectOption[]>([]);
  const [categoriasOptions, setCategoriasOptions] = useState<SelectOption[]>([]);
  const [isLoadingSectores, setIsLoadingSectores] = useState(false);
  const [isLoadingSubSectores, setIsLoadingSubSectores] = useState(false);
  const [isLoadingCategorias, setIsLoadingCategorias] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AnuncianteFormValues>({
    resolver: typedYupResolver(anuncianteSchema),
    defaultValues: {
      idSectorIndustrial: "",
      idSubSectorIndustrial: "",
      idCategoriaAnunciante: "",
      anunciante: "",
      activo: true,
    },
  });

  const selectedSector = useWatch({ control, name: "idSectorIndustrial" });
  const selectedSubSector = useWatch({ control, name: "idSubSectorIndustrial" });

  useEffect(() => {
    if (!open) {
      return;
    }

    void (async () => {
      setIsLoadingSectores(true);
      try {
        const sectors = await anunciantesApi.getSectoresOptions();
        setSectoresOptions(sectors);
      } finally {
        setIsLoadingSectores(false);
      }
    })();
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      idSectorIndustrial: anunciante?.idSectorIndustrial
        ? String(anunciante.idSectorIndustrial)
        : "",
      idSubSectorIndustrial: anunciante?.idSubSectorIndustrial
        ? String(anunciante.idSubSectorIndustrial)
        : "",
      idCategoriaAnunciante: anunciante?.idCategoriaAnunciante
        ? String(anunciante.idCategoriaAnunciante)
        : "",
      anunciante: anunciante?.anunciante ?? "",
      activo: anunciante?.activo ?? true,
    });
  }, [open, anunciante, reset]);

  useEffect(() => {
    if (!open || !selectedSector) {
      setSubSectoresOptions([]);
      setCategoriasOptions([]);
      setValue("idSubSectorIndustrial", "");
      setValue("idCategoriaAnunciante", "");
      return;
    }

    void (async () => {
      setIsLoadingSubSectores(true);
      try {
        const items = await anunciantesApi.getSubSectoresOptions(selectedSector);
        setSubSectoresOptions(items);
      } finally {
        setIsLoadingSubSectores(false);
      }
    })();
  }, [open, selectedSector, setValue]);

  useEffect(() => {
    if (!open || !selectedSubSector) {
      setCategoriasOptions([]);
      setValue("idCategoriaAnunciante", "");
      return;
    }

    void (async () => {
      setIsLoadingCategorias(true);
      try {
        const items = await anunciantesApi.getCategoriasOptions(selectedSubSector);
        setCategoriasOptions(items);
      } finally {
        setIsLoadingCategorias(false);
      }
    })();
  }, [open, selectedSubSector, setValue]);

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
                  {isEditMode ? "Editar anunciante" : "Nuevo anunciante"}
                </Dialog.Title>
                <p className="mt-1 text-sm text-gray-500 dark:text-dark-300">
                  Vincula el anunciante con su sector, sub sector y categoria.
                </p>

                <form className="mt-5 space-y-4" onSubmit={submit}>
                  <Controller
                    control={control}
                    name="idSectorIndustrial"
                    render={({ field }) => (
                      <Select
                        label="Sector Industrial"
                        data={[
                          { label: "Seleccione un sector", value: "", disabled: true },
                          ...sectoresOptions.map((item) => ({
                            label: item.label,
                            value: item.id,
                          })),
                        ]}
                        value={field.value ?? ""}
                        onChange={(event) => field.onChange(event.target.value)}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        disabled={isLoadingSectores}
                        error={errors.idSectorIndustrial?.message}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="idSubSectorIndustrial"
                    render={({ field }) => (
                      <Select
                        label="Sub Sector Industrial"
                        data={[
                          { label: "Seleccione un sub sector", value: "", disabled: true },
                          ...subSectoresOptions.map((item) => ({
                            label: item.label,
                            value: item.id,
                          })),
                        ]}
                        value={field.value ?? ""}
                        onChange={(event) => field.onChange(event.target.value)}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        disabled={!selectedSector || isLoadingSubSectores}
                        error={errors.idSubSectorIndustrial?.message}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="idCategoriaAnunciante"
                    render={({ field }) => (
                      <Select
                        label="Categoria"
                        data={[
                          { label: "Seleccione una categoria", value: "", disabled: true },
                          ...categoriasOptions.map((item) => ({
                            label: item.label,
                            value: item.id,
                          })),
                        ]}
                        value={field.value ?? ""}
                        onChange={(event) => field.onChange(event.target.value)}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        disabled={!selectedSubSector || isLoadingCategorias}
                        error={errors.idCategoriaAnunciante?.message}
                      />
                    )}
                  />

                  <Input
                    label="Anunciante"
                    placeholder="Ej. The Coca-Cola Company"
                    {...register("anunciante")}
                    error={errors.anunciante?.message}
                  />

                  <Switch label="Activo" {...register("activo")} />
                  <InputErrorMsg when={Boolean(errors.activo?.message)}>
                    {errors.activo?.message}
                  </InputErrorMsg>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outlined" onClick={onClose} disabled={isSubmitting}>
                      Cancelar
                    </Button>
                    <Button type="submit" color="primary" disabled={isSubmitting}>
                      {isSubmitting
                        ? "Guardando..."
                        : isEditMode
                          ? "Guardar cambios"
                          : "Crear anunciante"}
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
