import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";

import { Button, Input, InputErrorMsg, Select, Switch } from "@/components/ui";
import { typedYupResolver } from "@/utils/typedYupResolver";

import { sectoresIndustrialesApi } from "../../sectores-industriales/data/sectores-industriales.api";
import {
  SubSectorIndustrial,
  SubSectorIndustrialFormValues,
} from "../sub-sectores-industriales.types";

const subSectorIndustrialSchema = Yup.object().shape({
  idSectorIndustrial: Yup.string().required("El sector industrial es requerido"),
  subSectorIndustrial: Yup.string()
    .trim()
    .min(2, "Debe tener al menos 2 caracteres")
    .max(150, "Máximo 150 caracteres")
    .required("El sub sector industrial es requerido"),
  activo: Yup.boolean().required(),
});

interface SubSectoresIndustrialesFormModalProps {
  open: boolean;
  subSectorIndustrial?: SubSectorIndustrial | null;
  onClose: () => void;
  onSaved: (values: SubSectorIndustrialFormValues) => Promise<void> | void;
}

export function SubSectoresIndustrialesFormModal({
  open,
  subSectorIndustrial,
  onClose,
  onSaved,
}: SubSectoresIndustrialesFormModalProps) {
  const isEditMode = Boolean(subSectorIndustrial);
  const [sectorOptions, setSectorOptions] = useState<{ label: string; value: string }[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubSectorIndustrialFormValues>({
    resolver: typedYupResolver(subSectorIndustrialSchema),
    defaultValues: {
      idSectorIndustrial: "",
      subSectorIndustrial: "",
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
        const sectoresIndustriales = await sectoresIndustrialesApi.getSectoresIndustriales();
        setSectorOptions(
          sectoresIndustriales.map((item) => ({
            label: item.sectorIndustrial,
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
      idSectorIndustrial: subSectorIndustrial?.idSectorIndustrial ? String(subSectorIndustrial.idSectorIndustrial) : "",
      subSectorIndustrial: subSectorIndustrial?.subSectorIndustrial ?? "",
      activo: subSectorIndustrial?.activo ?? true,
    });
  }, [open, subSectorIndustrial, reset]);

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
                  {isEditMode ? "Editar sub sector industrial" : "Nuevo sub sector industrial"}
                </Dialog.Title>
                <p className="mt-1 text-sm text-gray-500 dark:text-dark-300">
                  Asocia el sub sector industrial con su sector principal.
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
                      <Input
                        label="Sub sector industrial"
                        placeholder="Ej. Vallas publicitarias"
                        {...register("subSectorIndustrial")}
                        error={errors.subSectorIndustrial?.message}
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
                          : "Crear sub sector industrial"}
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